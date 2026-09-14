"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const FilmSpace = dynamic(() => import("./FilmSpace"), { ssr: false });

class CanvasBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function CreativeSpace({ active }: { active: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setReady(false), []);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    let visible = false;
    const sync = () => setEnabled(visible && media.matches && !document.hidden && document.documentElement.dataset.motion !== "paused");
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { rootMargin: "100px" });
    if (ref.current) observer.observe(ref.current);
    const motion = new MutationObserver(sync);
    motion.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); motion.disconnect(); media.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return <div ref={ref} className={`creative-space ${enabled && ready ? "has-canvas" : ""}`} aria-hidden="true">
    <div className="space-fallback">
      {["culinary", "villa", "fashion"].map((image, index) => <div className={`space-frame ${index === active ? "selected" : ""}`} key={image}><Image src={`/showreel/${image}.jpg`} alt="" fill sizes="(max-width: 900px) 85vw, 600px" /></div>)}
    </div>
    {enabled && <CanvasBoundary onError={onError}><FilmSpace active={active} onReady={onReady} /></CanvasBoundary>}
    <span className="space-caption">רעיון אחד. אינסוף נקודות מבט.</span>
  </div>;
}
