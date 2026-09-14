import { createHash } from "node:crypto";
import { z } from "zod";

const phone = z
  .string()
  .trim()
  .max(25)
  .transform((value) => {
    const compact = value.replace(/[\s()-]/g, "");
    return compact.replace(/^(?:\+972|00972)/, "0");
  })
  .pipe(z.string().regex(/^(?:05\d{8}|0[2-489]\d{7})$/));
const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone,
  email: z
    .union([z.literal(""), z.string().trim().email().max(254)])
    .optional(),
  message: z.string().trim().max(3000).optional(),
  website: z.string().max(0).optional(),
});
type Environment = {
  RESEND_API_KEY?: string;
  LEAD_TO_EMAIL?: string;
  LEAD_FROM_EMAIL?: string;
  NEXT_PUBLIC_SITE_URL?: string;
};
type Dependencies = {
  env: Environment;
  send?: typeof fetch;
  now?: () => number;
};
const reply = (
  status: number,
  message: string,
  headers?: Record<string, string>,
) =>
  Response.json(
    { ok: false, message },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );

// Bounded, per-instance protection. Add platform/WAF rate limits when deploying at scale.
export function createLeadHandler({
  env,
  send = fetch,
  now = Date.now,
}: Dependencies) {
  const attempts = new Map<string, { count: number; expires: number }>();
  return async function handle(request: Request): Promise<Response> {
    const origin = request.headers.get("origin");
    if (
      origin &&
      origin !== new URL(request.url).origin &&
      origin !== env.NEXT_PUBLIC_SITE_URL
    )
      return reply(403, "לא ניתן לשלוח פנייה מהכתובת הזאת.");
    if (
      !request.headers
        .get("content-type")
        ?.toLowerCase()
        .includes("application/json")
    )
      return reply(415, "פורמט הפנייה אינו תקין.");
    const key = request.headers.get("idempotency-key");
    if (!key || !z.uuid().safeParse(key).success)
      return reply(400, "נא לרענן את העמוד ולנסות שוב.");
    let body: unknown;
    try {
      if (Number(request.headers.get("content-length")) > 16384)
        return reply(413, "הפנייה ארוכה מדי.");
      const reader = request.body?.getReader();
      if (!reader) return reply(400, "חסרים פרטי הפנייה.");
      const chunks: Uint8Array[] = [];
      let bytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 16384) {
          await reader.cancel();
          return reply(413, "הפנייה ארוכה מדי.");
        }
        chunks.push(value);
      }
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return reply(400, "פרטי הפנייה אינם תקינים.");
    }
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return reply(
        400,
        "בדקו שהשם ומספר הטלפון תקינים, ושהמייל הוקלד נכון אם הוספתם אותו.",
      );
    if (!env.RESEND_API_KEY || !env.LEAD_TO_EMAIL || !env.LEAD_FROM_EMAIL)
      return reply(
        503,
        "שליחת הפניות עדיין אינה פעילה. אפשר לפנות בוואטסאפ כשפרטי הקשר יהיו זמינים.",
      );
    const data = parsed.data;
    const stamp = now();
    for (const [id, record] of attempts)
      if (record.expires <= stamp) attempts.delete(id);
    // Phone-based throttling cannot be bypassed by spoofing forwarded IP headers.
    const identity = createHash("sha256").update(data.phone).digest("hex");
    const record = attempts.get(identity);
    if (record && record.count >= 5)
      return reply(429, "נשלחו כמה פניות ברצף. נסו שוב בעוד כמה דקות.", {
        "Retry-After": String(Math.ceil((record.expires - stamp) / 1000)),
      });
    if (attempts.size >= 10000 && !record)
      return reply(429, "יש כרגע עומס בפניות. נסו שוב בעוד כמה דקות.", {
        "Retry-After": "600",
      });
    attempts.set(identity, {
      count: (record?.count ?? 0) + 1,
      expires: record?.expires ?? stamp + 600000,
    });
    try {
      const response = await send("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `orel-lead-${key}`,
        },
        body: JSON.stringify({
          from: env.LEAD_FROM_EMAIL,
          to: [env.LEAD_TO_EMAIL],
          ...(data.email ? { reply_to: data.email } : {}),
          subject: "פנייה חדשה מהאתר של אוראל לוי",
          text: `שם: ${data.fullName}\nטלפון: ${data.phone}\nמייל: ${data.email || "לא נמסר"}\n\nעל העסק והרעיון:\n${data.message || "לא נמסר"}\n\nמקור: אתר אוראל לוי`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok)
        return reply(502, "הפנייה לא נשלחה כרגע. נסו שוב או פנו בוואטסאפ.");
      const result = (await response.json()) as { id?: string };
      if (!result.id)
        return reply(502, "לא התקבל אישור לשליחה. אפשר לנסות שוב.");
      return Response.json(
        { ok: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    } catch {
      return reply(502, "השליחה מתעכבת. נסו שוב או פנו בוואטסאפ.");
    }
  };
}
