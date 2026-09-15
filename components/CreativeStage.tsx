"use client";
import { useEffect, useRef, useState } from "react";

import { ArrowDown } from "lucide-react";


import { CreativeSpace } from "./CreativeSpace";

const chapters = [
  {
    title: "מתחילים ברעיון.",
    text: "מוצאים את הזווית, את המסר ואת התחושה שהסרטון צריך להשאיר.",
    label: "הקונספט",
    english: "THE IDEA",
    image: 1,
  },
  {
    title: "מדמיינים עולם.",
    text: "נותנים לרעיון שפה משלו. צבע, אור וקומפוזיציה שמספרים את אותו הסיפור.",
    label: "העולם",
    english: "THE WORLD",
    image: 0,
  },
  {
    title: "נותנים לו תנועה.",
    text: "מחברים את הפריימים לקצב. כל תנועה, חיתוך וצליל מקבלים מקום.",
    label: "התנועה",
    english: "THE MOTION",
    image: 2,
  },
];

export function CreativeStage() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const bounds = useRef({ start: 0, range: 1 });
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let frame = 0;
    const measure = () => {
      const sticky = section.querySelector<HTMLElement>(".creative-sticky")!;
      bounds.current = {
        start: section.getBoundingClientRect().top + scrollY - 88,
        range:
          getComputedStyle(sticky).position === "sticky"
            ? Math.max(1, section.offsetHeight - sticky.offsetHeight)
            : 0,
      };
    };
    const update = () => {
      frame = 0;
      if (
        document.documentElement.dataset.motion === "paused" ||
        bounds.current.range === 0
      )
        return;
      const p = Math.max(
        0,
        Math.min(1, (scrollY - bounds.current.start) / bounds.current.range),
      );
      section.style.setProperty("--chapter-progress", p.toFixed(4));
      const next = Math.min(2, Math.floor(p * 3));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resize.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, []);
  function select(index: number) {
    setActive(index);
    activeRef.current = index;
    if (
      document.documentElement.dataset.motion !== "paused" &&
      bounds.current.range > 0
    )
      window.scrollTo({
        top:
          bounds.current.start +
          bounds.current.range *
            (index === 0 ? 0.05 : index === 1 ? 0.5 : 0.95),
        behavior: "smooth",
      });
  }
  const chapter = chapters[active];
  return (
    <section
      id="creative"
      ref={ref}
      className="creative-journey"
      aria-labelledby="creative-title"
      data-scroll-scene
    >
      <div className="creative-sticky">
        <div className="creative-top">
          <span dir="ltr">INSIDE THE CREATIVE PROCESS</span>
          <span>
            <ArrowDown size={14} /> הסיפור מתפתח עם הגלילה
          </span>
        </div>
        <div className="creative-composition">
          <div className="creative-copy">
            <p className="eyebrow">כאן הרעיון מתחיל לזוז</p>
            <h2 id="creative-title">
              מה אם
              <br />
              <span className="heading-accent">אפשר אחרת?</span>
            </h2>
            <div className="chapter-copy" key={active}>
              <h3>{chapter.title}</h3>
              <p>{chapter.text}</p>
            </div>
            <div
              className="chapter-buttons"
              role="group"
              aria-label="שלבי הקריאייטיב"
            >
              {chapters.map((item, i) => (
                <button
                  key={item.label}
                  aria-pressed={active === i}
                  onClick={() => select(i)}
                >
                  <span dir="ltr">0{i + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className={`creative-screen chapter-${active}`}>
            <CreativeSpace active={active} />
          </div>
        </div>
        <div className="chapter-timeline" aria-hidden>
          {chapters.map((item, i) => (
            <span key={item.label} className={active >= i ? "complete" : ""}>
              <i />
              {item.english}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

