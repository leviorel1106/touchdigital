"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { site } from "@/lib/site";

export function FilmButton({ start = 0, label = "לצפייה בסרט המלא", className = "film-button" }: { start?: number; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const title = useId();
  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    const opener = trigger.current;
    const previous = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event("film-open"));
    return () => {
      node?.close();
      document.body.style.overflow = previous;
      window.dispatchEvent(new Event("film-close"));
      opener?.focus({ preventScroll: true });
    };
  }, [open]);
  return <>
    <button ref={trigger} className={className} onClick={() => { setFailed(false); setOpen(true); }}>
      <span className="film-play"><Play size={16} fill="currentColor" /></span>{label}
    </button>
    <dialog className="video-dialog cinema-dialog" ref={dialog} aria-labelledby={title} onCancel={(event) => { event.preventDefault(); setOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      {open && <div className="video-shell">
        <div className="video-heading"><div><p>סרט קונספט / אוראל לוי</p><h3 id={title}>מעבר לדמיון.</h3></div><button className="icon-button" autoFocus aria-label="סגירת הסרטון" onClick={() => setOpen(false)}><X /></button></div>
        {failed ? <p className="video-error" role="alert">הסרטון לא נטען. אפשר לסגור ולנסות שוב.</p> : <video className="cinema-player" src={site.hero.video} poster={site.hero.poster} controls autoPlay playsInline onLoadedMetadata={(event) => { event.currentTarget.currentTime = start; }} onError={() => setFailed(true)} />}
      </div>}
    </dialog>
  </>;
}
