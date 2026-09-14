"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ProcessRobot() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const rail = root.current;
    const section = rail?.closest(".process");
    if (!rail || !section) return;
    const robot = rail.querySelector<HTMLElement>(".process-bot")!;
    const steps = section.querySelectorAll(".process-steps li");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const pose = { progress: 0 };
      const draw = () => {
        if (document.documentElement.dataset.motion === "paused") return;
        const p = pose.progress;
        const stride = Math.sin(p * Math.PI * 32);
        robot.style.transform = `translateX(${-p * (rail.clientWidth - 112)}px)`;
        rail.style.setProperty("--journey", String(p));
        robot.style.setProperty("--step", `${stride * 22}deg`);
        robot.style.setProperty("--hop", `${-Math.abs(stride) * 5}px`);
        robot.style.setProperty("--look", `${Math.sin(p * Math.PI * 6) * 7}deg`);
        steps.forEach((step, i) => step.classList.toggle("robot-current", i === Math.min(3, Math.floor(p * 4))));
      };
      gsap.to(pose, {
        progress: 1, ease: "none", onUpdate: draw,
        scrollTrigger: { trigger: rail, endTrigger: section, start: "top 75%", end: "bottom 35%", scrub: .35, onRefresh: draw },
      });
      const resize = new ResizeObserver(() => ScrollTrigger.refresh());
      resize.observe(rail);
      return () => {
        resize.disconnect();
        robot.removeAttribute("style");
        rail.style.removeProperty("--journey");
        steps.forEach(step => step.classList.remove("robot-current"));
      };
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <div className="process-journey" ref={root} aria-hidden="true">
      <div className="journey-line" />
      <div className="journey-stops">{["01", "02", "03", "04"].map(n => <span key={n}>{n}</span>)}</div>
      <div className="process-bot">
        <svg viewBox="0 0 140 160" fill="none">
          <defs>
            <linearGradient id="bot-shell" x1="30" y1="25" x2="110" y2="140" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset=".5" stopColor="#d7e4f5"/><stop offset="1" stopColor="#6b83a5"/></linearGradient>
            <linearGradient id="bot-face" x1="42" y1="40" x2="95" y2="80" gradientUnits="userSpaceOnUse"><stop stopColor="#213e60"/><stop offset="1" stopColor="#070f1c"/></linearGradient>
          </defs>
          <ellipse cx="70" cy="148" rx="35" ry="5" fill="#669aff" opacity=".18"/>
          <g className="bot-body">
            <g className="bot-leg bot-leg-a"><rect x="48" y="116" width="17" height="25" rx="8" fill="url(#bot-shell)"/><rect x="40" y="135" width="27" height="11" rx="5.5" fill="#ebf3ff"/></g>
            <g className="bot-leg bot-leg-b"><rect x="77" y="116" width="17" height="25" rx="8" fill="url(#bot-shell)"/><rect x="72" y="135" width="27" height="11" rx="5.5" fill="#ebf3ff"/></g>
            <g className="bot-arm bot-arm-a"><rect x="27" y="86" width="16" height="35" rx="8" transform="rotate(12 35 90)" fill="url(#bot-shell)"/></g>
            <g className="bot-arm bot-arm-b"><rect x="98" y="86" width="16" height="35" rx="8" transform="rotate(-12 106 90)" fill="url(#bot-shell)"/></g>
            <rect x="42" y="81" width="56" height="44" rx="19" fill="url(#bot-shell)"/>
            <rect x="56" y="93" width="28" height="17" rx="8" fill="#172c47"/>
            <path d="M64 102h12m-6-6v12" stroke="#76bdff" strokeWidth="3" strokeLinecap="round"/>
            <g className="bot-head">
              <path d="M70 30V18" stroke="#b6cdef" strokeWidth="4"/><circle cx="70" cy="15" r="5" fill="#80c8ff"/>
              <rect x="24" y="49" width="13" height="23" rx="6" fill="#81a8d9"/><rect x="103" y="49" width="13" height="23" rx="6" fill="#81a8d9"/>
              <rect x="30" y="29" width="80" height="58" rx="24" fill="url(#bot-shell)"/>
              <rect x="38" y="38" width="64" height="40" rx="17" fill="url(#bot-face)"/>
              <rect x="49" y="49" width="10" height="14" rx="5" fill="#8edbff"/><rect x="81" y="49" width="10" height="14" rx="5" fill="#8edbff"/>
              <path d="M65 67q5 5 10 0" stroke="#8edbff" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M44 34h24" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".8"/>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
