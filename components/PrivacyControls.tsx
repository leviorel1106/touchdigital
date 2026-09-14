"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { saveConsent, useConsent } from "@/lib/consent";

export function PrivacyControls() {
  const consent = useConsent();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("open-privacy-settings", show);
    return () => window.removeEventListener("open-privacy-settings", show);
  }, []);
  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    const opener = document.activeElement as HTMLElement | null;
    node?.showModal();
    return () => { node?.close(); opener?.focus({ preventScroll: true }); };
  }, [open]);
  const choose = (allow: boolean) => { saveConsent(allow); setOpen(false); };
  return <>
    {!consent.chosen && <section className="privacy-banner" aria-label="העדפות פרטיות ועוגיות">
      <div><strong>האתר מכבד את הפרטיות שלך.</strong><p>אין כאן עוגיות פרסום, מעקב או אנליטיקה. נגני וידאו חיצוניים ייטענו רק באישורך, והבחירה נשמרת בדפדפן שלך. <Link href="/cookies">למדיניות העוגיות</Link></p></div>
      <div className="privacy-actions"><button onClick={() => choose(true)}>אישור הכל</button><button onClick={() => choose(false)}>דחיית הכל</button><button className="privacy-settings-link" onClick={() => setOpen(true)}>הגדרות</button></div>
    </section>}
    <dialog ref={dialog} className="privacy-dialog" aria-labelledby="privacy-dialog-title" onCancel={e => { e.preventDefault(); setOpen(false); }} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="privacy-dialog-heading"><h2 id="privacy-dialog-title">העדפות פרטיות</h2><button autoFocus aria-label="סגירת הגדרות פרטיות" onClick={() => setOpen(false)}><X /></button></div>
      <h3>שמירת הבחירה שלך</h3><p>נשמרת בדפדפן למשך 180 ימים באמצעות אחסון מקומי. היא אינה משמשת למעקב או לפרסום.</p>
      <h3>ניגון תוכן חיצוני</h3><p>נגן של YouTube או Vimeo עשוי לקבל מידע טכני, כגון כתובת IP, ולהשתמש בעוגיות לפי המדיניות שלו. הסרטונים המאוחסנים באתר עצמו זמינים גם ללא אישור.</p>
      <p>המצב הנוכחי: {consent.externalMedia ? "תוכן חיצוני מאושר" : "תוכן חיצוני חסום"}. ניתן לשנות בכל עת. שינוי לא מוחק עוגיות שכבר נשמרו על ידי ספק חיצוני; ניתן למחוק אותן בהגדרות הדפדפן.</p>
      <div className="privacy-actions"><button onClick={() => choose(true)}>אישור הכל</button><button onClick={() => choose(false)}>דחיית הכל</button></div>
      <Link href="/privacy">למדיניות הפרטיות המלאה</Link>
    </dialog>
  </>;
}
export function PrivacySettingsButton() { return <button onClick={() => window.dispatchEvent(new Event("open-privacy-settings"))}>העדפות פרטיות</button>; }
