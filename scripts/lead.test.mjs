import test from "node:test";
import assert from "node:assert/strict";
import { createLeadHandler } from "../lib/lead.ts";

const env = {
  RESEND_API_KEY: "test-key",
  LEAD_FROM_EMAIL: "test@example.com",
  LEAD_TO_EMAIL: "owner@example.com",
};
const valid = {
  fullName: "בדיקת אתר",
  phone: "050-1234567",
  email: "",
  message: "",
  website: "",
};
function request(body = valid, options = {}) {
  return new Request("http://localhost:3000/api/lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "idempotency-key": options.key ?? crypto.randomUUID(),
      ...(options.headers ?? {}),
    },
    body: options.raw ?? JSON.stringify(body),
  });
}
test("sends normalized contact information and confirms only a provider receipt", async () => {
  let sent;
  const handler = createLeadHandler({
    env,
    send: async (url, init) => {
      sent = { url, ...init };
      return Response.json({ id: "email-id" });
    },
  });
  const key = crypto.randomUUID();
  const res = await handler(
    request(
      {
        ...valid,
        phone: "+972 50-1234567",
        email: "client@example.com",
        message: "<b>רעיון</b>",
      },
      { key },
    ),
  );
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  const payload = JSON.parse(sent.body);
  assert.equal(sent.url, "https://api.resend.com/emails");
  assert.equal(payload.reply_to, "client@example.com");
  assert.match(payload.text, /0501234567/);
  assert.equal(payload.html, undefined);
  assert.equal(sent.headers["Idempotency-Key"], `orel-lead-${key}`);
});
test("optional email and description can be omitted", async () => {
  const handler = createLeadHandler({
    env,
    send: async () => Response.json({ id: "ok" }),
  });
  assert.equal(
    (await handler(request({ fullName: "בדיקה", phone: "03-1234567" }))).status,
    200,
  );
});
test("invalid fields, honeypot and malformed JSON never reach email provider", async () => {
  let calls = 0;
  const handler = createLeadHandler({
    env,
    send: async () => {
      calls++;
      return Response.json({ id: "bad" });
    },
  });
  for (const change of [
    { fullName: "א" },
    { phone: "12" },
    { email: "bad" },
    { website: "spam" },
    { message: "x".repeat(3001) },
  ])
    assert.equal((await handler(request({ ...valid, ...change }))).status, 400);
  assert.equal((await handler(request(valid, { raw: "{" }))).status, 400);
  assert.equal(calls, 0);
});
test("missing configuration fails instead of reporting a fake success", async () => {
  assert.equal((await createLeadHandler({ env: {} })(request())).status, 503);
});
test("provider failure, timeout and empty receipt are errors", async () => {
  for (const send of [
    async () => Response.json({}, { status: 429 }),
    async () => {
      throw new Error("timeout");
    },
    async () => Response.json({}),
  ]) {
    assert.equal(
      (await createLeadHandler({ env, send })(request())).status,
      502,
    );
  }
});
test("same attempt preserves provider payload and idempotency key on retry", async () => {
  const sent = [];
  const handler = createLeadHandler({
    env,
    send: async (_, init) => {
      sent.push(init);
      return Response.json({ id: "same" });
    },
  });
  const key = crypto.randomUUID();
  await handler(request(valid, { key }));
  await handler(request(valid, { key }));
  assert.equal(sent[0].body, sent[1].body);
  assert.equal(
    sent[0].headers["Idempotency-Key"],
    sent[1].headers["Idempotency-Key"],
  );
});
test("rate limit blocks bursts and expires", async () => {
  let time = 1000;
  const handler = createLeadHandler({
    env,
    now: () => time,
    send: async () => Response.json({ id: "ok" }),
  });
  for (let i = 0; i < 5; i++)
    assert.equal((await handler(request())).status, 200);
  const blocked = await handler(request());
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("Retry-After"), "600");
  time += 600001;
  assert.equal((await handler(request())).status, 200);
});
test("rejects cross-origin, incorrect content type, invalid keys and oversized bodies", async () => {
  const handler = createLeadHandler({ env });
  assert.equal(
    (
      await handler(
        request(valid, { headers: { origin: "https://other.example" } }),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handler(
        request(valid, { headers: { "content-type": "text/plain" } }),
      )
    ).status,
    415,
  );
  assert.equal((await handler(request(valid, { key: "invalid" }))).status, 400);
  assert.equal(
    (await handler(request(valid, { raw: "x".repeat(17000) }))).status,
    413,
  );
});

const storeEnv = {
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_ANON_KEY: "anon-key",
};
test("stores the lead in the database when no mail provider is configured", async () => {
  let sent;
  const key = crypto.randomUUID();
  const handler = createLeadHandler({
    env: storeEnv,
    send: async (url, init) => {
      sent = { url, ...init };
      return new Response(null, { status: 201 });
    },
  });
  const res = await handler(
    request({ ...valid, phone: "+972 50-1234567" }, { key }),
  );
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(sent.url, "https://project.supabase.co/rest/v1/site_leads");
  const row = JSON.parse(sent.body);
  assert.equal(row.request_id, key);
  assert.equal(row.phone, "0501234567");
  assert.equal(row.source, "orel-levi-site");
  assert.equal(sent.headers.apikey, "anon-key");
});
test("a stored lead survives a mail provider failure", async () => {
  for (const mail of [
    async () => Response.json({}, { status: 429 }),
    async () => Response.json({}),
    async () => {
      throw new Error("timeout");
    },
  ]) {
    const handler = createLeadHandler({
      env: { ...env, ...storeEnv },
      send: async (url, init) =>
        url.includes("supabase")
          ? new Response(null, { status: 201 })
          : mail(url, init),
    });
    assert.equal((await handler(request())).status, 200);
  }
});
test("a repeated submission is accepted rather than duplicated", async () => {
  const handler = createLeadHandler({
    env: storeEnv,
    send: async () => new Response(null, { status: 409 }),
  });
  assert.equal((await handler(request())).status, 200);
});
test("a lead that reaches neither database nor mail is reported as failed", async () => {
  const handler = createLeadHandler({
    env: storeEnv,
    send: async () => new Response(null, { status: 500 }),
  });
  assert.equal((await handler(request())).status, 502);
});
