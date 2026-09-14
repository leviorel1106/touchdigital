"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpLeft, Check, LoaderCircle } from "lucide-react";
import Link from "next/link";

export function ContactForm({
  mailReady,
  whatsapp,
  preview,
}: {
  mailReady: boolean;
  whatsapp: string | null;
  preview: boolean;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const requestId = useRef("");
  const previousPayload = useRef("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!mailReady || busy.current) return;
    const form = e.currentTarget;
    const serialized = JSON.stringify(Object.fromEntries(new FormData(form)));
    if (!requestId.current || previousPayload.current !== serialized)
      requestId.current = crypto.randomUUID();
    previousPayload.current = serialized;
    busy.current = true;
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestId.current,
        },
        body: serialized,
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(result.message || "הפנייה לא נשלחה. נסו שוב בעוד רגע.");
      setStatus("success");
      form.reset();
      requestId.current = "";
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name === "Error"
          ? error.message
          : "השליחה מתעכבת. אפשר לנסות שוב, או לפנות בוואטסאפ.",
      );
    } finally {
      busy.current = false;
    }
  }
  return (
    <section
      id="contact"
      className="contact section"
      aria-labelledby="contact-title"
    >
      <div className="contact-copy reveal">
        <p className="eyebrow">הסרטון הבא מתחיל בשיחה</p>
        <h2 id="contact-title">
          יש לך עסק.
          <br />
          בוא ניתן לו
          <br />
          <span>סיפור.</span>
        </h2>
        <p>
          ספרו לי קצת על העסק ועל מה שתרצו ליצור.
          <br />
          משם נחשוב יחד איך להביא את זה למסך.
        </p>
        {/* WhatsApp lives in the floating button, not here. */}
        {!whatsapp && preview && (
          <p className="setup-note">
            כפתור הוואטסאפ יחובר כשיתווסף המספר שלך.
          </p>
        )}
      </div>
      <div className="form-panel reveal">
        <h3>מה ניצור יחד?</h3>
        <p className="form-intro">כמה פרטים קטנים, ורעיון גדול אחד.</p>
        {status === "success" ? (
          <div className="success-panel" role="status">
            <span className="success-icon">
              <Check size={28} />
            </span>
            <h4>הפנייה שלך בדרך אליי.</h4>
            <p>תודה על הפרטים. נדבר בקרוב על הרעיון שלך.</p>
            <button className="text-link" onClick={() => setStatus("idle")}>
              שליחת פנייה נוספת <ArrowUpLeft size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={submit} aria-busy={status === "sending"}>
            <div className="form-row">
              <label htmlFor="fullName">
                איך קוראים לך? <span>*</span>
                <input
                  id="fullName"
                  name="fullName"
                  placeholder="שם מלא"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </label>
              <label htmlFor="phone">
                מספר טלפון <span>*</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  dir="ltr"
                  placeholder="050-0000000"
                  autoComplete="tel"
                  maxLength={25}
                  required
                />
              </label>
            </div>
            <label htmlFor="email">
              כתובת מייל <span className="optional">לא חובה</span>
              <input
                id="email"
                name="email"
                type="email"
                dir="ltr"
                placeholder="you@business.com"
                autoComplete="email"
                maxLength={254}
              />
            </label>
            <label htmlFor="message">
              קצת על העסק והרעיון <span className="optional">לא חובה</span>
              <textarea
                id="message"
                name="message"
                placeholder="מה העסק שלך, ואיזה תוכן היית רוצה ליצור?"
                maxLength={3000}
                rows={3}
              />
            </label>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="website">
                Website
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>
            <p className="form-privacy">
              מסירת הפרטים היא מרצונך ולצורך טיפול בפנייה על ידי אוראל לוי. ללא שם וטלפון לא ניתן לשלוח את הטופס. המידע יועבר באמצעות ספק הדיוור לתיבת המייל של אוראל; לא נרשמים כאן לדיוור פרסומי. פרטים על מקבלי המידע וזכויות העיון והתיקון ב־<Link href="/privacy">מדיניות הפרטיות</Link>.
            </p>
            <button
              className="button button-blue submit-button"
              type="submit"
              disabled={!mailReady || status === "sending"}
            >
              {status === "sending" ? (
                <>
                  שולח את הפנייה <LoaderCircle className="spin" size={20} />
                </>
              ) : (
                <>
                  בואו נדבר על הרעיון <ArrowUpLeft size={21} />
                </>
              )}
            </button>
            {!mailReady && (
              <p className="setup-note">
                {preview
                  ? "תצוגה מקומית: שליחת המייל תחובר לאחר הוספת פרטי הדיוור."
                  : "הטופס אינו זמין כרגע. אפשר לפנות דרך פרטי הקשר באתר."}{" "}<a href="mailto:leviorel@gmail.com">שליחת מייל ישירות לאוראל</a>
              </p>
            )}
            {status === "error" && (
              <p className="form-error" role="alert">
                {message}
                {whatsapp && (
                  <>
                    {" "}
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      למעבר לוואטסאפ
                    </a>
                  </>
                )}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
