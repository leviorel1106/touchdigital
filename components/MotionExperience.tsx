"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { CinematicMotion } from "./CinematicMotion";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const query = "(prefers-reduced-motion: reduce)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

// Adapts the previous site's scroll progress and parallax into one batched engine.
// Frames are scheduled only on scroll/pointer/resize, never in a permanent RAF loop.
export function MotionExperience() {
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
  const enabled = !paused && !reduced;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = enabled ? "running" : "paused";
    const hero = document.querySelector<HTMLElement>(".hero");
    const header = document.querySelector<HTMLElement>(".site-header");
    const progress = document.querySelector<HTMLElement>(".reading-progress");
    const sections = [
      ...document.querySelectorAll<HTMLElement>("[data-scroll-scene]"),
    ];
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pageHeight = 1;
    let heroBounds = { top: 0, height: 1 };
    let bounds: { top: number; height: number }[] = [];
    const set = (el: HTMLElement | null, property: string, value: string) => {
      if (el && el.style.getPropertyValue(property) !== value)
        el.style.setProperty(property, value);
    };
    const measure = () => {
      const y = window.scrollY;
      pageHeight = root.scrollHeight;
      const box = hero?.getBoundingClientRect();
      if (box) heroBounds = { top: box.top + y, height: box.height };
      bounds = sections.map((el) => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top + y, height: rect.height };
      });
      if (!frame) frame = requestAnimationFrame(render);
    };
    const render = () => {
      frame = 0;
      const y = window.scrollY;
      const viewport = window.innerHeight;
      // Geometry is refreshed on resize/content changes, not during every scroll frame.
      const total = pageHeight - viewport;
      set(progress, "--read", String(total > 0 ? clamp(y / total) : 0));
      header?.classList.toggle("is-scrolled", y > 48);
      set(
        hero,
        "--hero-scroll",
        enabled
          ? clamp((y - heroBounds.top) / heroBounds.height).toFixed(3)
          : "0",
      );
      set(hero, "--pointer-x", enabled ? pointerX.toFixed(3) : "0");
      set(hero, "--pointer-y", enabled ? pointerY.toFixed(3) : "0");
      sections.forEach((el, i) => {
        const box = bounds[i];
        if (!box) return;
        const top = box.top - y;
        const visible = top < viewport && top + box.height > 0;
        el.classList.toggle("scene-visible", visible);
        if (!enabled) set(el, "--scene", ".5");
        else if (visible)
          set(
            el,
            "--scene",
            clamp((viewport - top) / (viewport + box.height)).toFixed(3),
          );
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !enabled || !hero) return;
      const box = hero.getBoundingClientRect();
      pointerX = (e.clientX - box.left) / box.width - 0.5;
      pointerY = (e.clientY - box.top) / box.height - 0.5;
      schedule();
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
      schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    hero?.addEventListener("pointermove", move, { passive: true });
    hero?.addEventListener("pointerleave", leave);
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      hero?.removeEventListener("pointermove", move);
      hero?.removeEventListener("pointerleave", leave);
      delete root.dataset.motion;
    };
  }, [enabled]);

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <CinematicMotion enabled={enabled} />
      <button
        className="motion-control"
        aria-label={enabled ? "השהיית הנפשות" : "הפעלת הנפשות"}
        aria-pressed={!enabled}
        disabled={reduced}
        onClick={() => setPaused((value) => !value)}
        title={reduced ? "התנועה מופחתת לפי הגדרות המכשיר" : undefined}
      >
        {enabled ? <Pause size={14} /> : <Play size={14} />}
        <span>{enabled ? "להשהות תנועה" : "תנועה מושהית"}</span>
      </button>
    </>
  );
}

// Reworked from the saved GodRays component: localized, masked and CSS-driven.
export function GodRays() {
  return (
    <div className="god-rays" aria-hidden="true">
      <div className="god-rays-spin" />
      <div className="god-rays-core" />
    </div>
  );
}
