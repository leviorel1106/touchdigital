"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function CinematicMotion({ enabled }: { enabled: boolean }) {
  useGSAP(() => {
    const main = document.getElementById("main-content");
    if (!main || !enabled) return;
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".studio-heading h2, .section-heading h2, .about-copy h2, .contact-copy h2", main).forEach((heading) => {
          gsap.from(heading, { y: 45, duration: 1, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 94%", once: true } });
        });
        gsap.from(".process-steps li", { y: 40, stagger: .12, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ".process-steps", start: "top 88%", once: true } });
      }, main);
      // Phones move the whole frame rather than the picture inside it: the
      // portrait has almost no headroom, so any pan across it clips the face.
      media.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".about-art", { y: 26 }, { y: -26, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: .8 } });
      }, main);
      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(".hero-film", { scale: .94, borderRadius: 12, ease: "none", scrollTrigger: { trigger: ".hero-film", start: "top top", end: "bottom top", scrub: .7 } });
        gsap.fromTo(".world-stage", { rotateX: 6, y: 60 }, { rotateX: 0, y: 0, ease: "none", scrollTrigger: { trigger: ".world-stage", start: "top bottom", end: "top 25%", scrub: .8 } });
        gsap.utils.toArray<HTMLElement>(".service-row", main).forEach((row) => {
          gsap.from(row, { x: 55, duration: .9, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 90%", once: true } });
        });
        gsap.fromTo(".manifesto-image", { yPercent: -12, scale: 1.15 }, { yPercent: 12, scale: 1.15, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(".about-art", { rotateY: -9, rotateZ: -3 }, { rotateY: 7, rotateZ: 2, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: .8 } });
      }, main);
      return () => media.revert();
    }, main);
    let alive = true;
    void document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; context.revert(); };
  }, { dependencies: [enabled], revertOnUpdate: true });
  return null;
}
