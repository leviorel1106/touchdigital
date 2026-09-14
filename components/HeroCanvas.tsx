"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { atmosphere } from "@/lib/site";
import { GodRays } from "./MotionExperience";

export function HeroCanvas() {
  const [frame, setFrame] = useState(0);
  return (
    <div className="hero-canvas">
      <GodRays />
      <div className="canvas-orbit orbit-one" aria-hidden />
      <div className="canvas-orbit orbit-two" aria-hidden />
      <div className="floating-frame frame-back" aria-hidden>
        <Image
          src={atmosphere[(frame + 1) % 3].image}
          alt=""
          fill
          sizes="220px"
        />
        <span>ANOTHER PERSPECTIVE</span>
      </div>
      <div className="floating-frame frame-front">
        <div className="frame-window" key={frame}>
          <Image
            src={atmosphere[frame].image}
            alt={`תמונת אווירה: ${atmosphere[frame].title}`}
            fill
            sizes="(max-width: 600px) 190px, 300px"
          />
        </div>
        <span className="frame-cross cross-tl" aria-hidden>
          +
        </span>
        <span className="frame-cross cross-br" aria-hidden>
          +
        </span>
        <div className="frame-caption">
          <span dir="ltr">FRAME 0{frame + 1}</span>
          <ArrowUpRight size={18} />
        </div>
      </div>
      <span className="canvas-label" dir="ltr">
        A LITTLE IMAGINATION
        <br />
        <strong>CHANGES EVERYTHING.</strong>
      </span>
      <button
        className="canvas-switch"
        onClick={() => setFrame((value) => (value + 1) % 3)}
        aria-label="החלפת פריים בהירו"
      >
        <RefreshCw size={16} />
        <span>מבט אחר</span>
        <span className="canvas-counter" aria-live="polite" dir="ltr">
          0{frame + 1} / 03
        </span>
      </button>
    </div>
  );
}
