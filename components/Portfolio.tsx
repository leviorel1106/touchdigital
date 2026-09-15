"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ArrowLeft, ArrowRight, Play } from "lucide-react";
import { atmosphere, type Project } from "@/lib/site";
import { saveConsent, useConsent } from "@/lib/consent";

export function Portfolio({
  projects,
  preview,
}: {
  projects: Project[];
  preview: boolean;
}) {
  const [category, setCategory] = useState("הכל");
  const consent = useConsent();
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<Project | null>(null);
  const [videoError, setVideoError] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const categories = ["הכל", ...new Set(projects.map((p) => p.category))];
  const ordered = projects
    .filter((p) => category === "הכל" || p.category === category)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const visible = expanded ? ordered : ordered.slice(0, 6);
  return (
    <section
      id="work"
      className="section portfolio"
      aria-labelledby="work-title"
      data-scroll-scene
    >
      <div className="portfolio-word" aria-hidden dir="ltr">
        {/* Duplicated so the loop can reset at -50% without a visible seam. */}
        <div className="portfolio-word-track">
          <span>IMAGINE. CREATE. MOVE. </span>
          <span>IMAGINE. CREATE. MOVE. </span>
        </div>
      </div>
      <div className="section-heading reveal">
        <div>
          <p className="eyebrow">הקריאייטיב פוגש את המסך</p>
          <h2 id="work-title">
            לתת לדמיון
            <br />
            <span className="heading-accent">לדבר בעד עצמו.</span>
          </h2>
        </div>
        <p className="section-intro">
          סיפור מדויק. פריים שנשאר בראש.
          <br />
          תוכן שנותן לעסק שלך נוכחות משלו.
        </p>
      </div>
      {projects.length > 0 ? (
        <>
          {categories.length > 2 && (
            <div className="filters" aria-label="סינון עבודות">
              {categories.map((c) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  onClick={() => {
                    setActive(null);
                    setCategory(c);
                    setExpanded(false);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className={`work-grid${projects.length === 1 ? " work-single" : ""}`} ref={track}>
            {visible.map((p, i) => (
              <article className={`project project-${i % 3} project-aspect-${p.aspect}`} key={p.id}>
                <div className={`project-image${active?.id === p.id ? " is-playing" : ""}`}>
                  {active?.id === p.id ? (
                    <div className="project-inline-player">
              {videoError ? (
                <p role="alert" className="video-error">
                  לא ניתן לטעון את הסרטון כרגע. נסו שוב מאוחר יותר.
                </p>
              ) : p.source.kind === "file" ? (
                <video
                  key={p.id}
                  src={p.source.url}
                  poster={p.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  onError={() => setVideoError(true)}
                />
              ) : !consent.externalMedia ? (
                <div className="external-consent"><p>הסרטון מוצג באמצעות נגן חיצוני שעשוי לקבל מידע טכני ולהשתמש בעוגיות.</p><button className="button button-outline" onClick={() => saveConsent(true)}>אישור תוכן חיצוני וצפייה</button><Link href="/cookies">פרטים על השימוש בעוגיות</Link></div>
              ) : (
                <iframe
                  key={p.id}
                  title={p.title}
                  src={
                    p.source.kind === "youtube"
                      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(p.source.id)}?autoplay=1&playsinline=1&rel=0`
                      : `https://player.vimeo.com/video/${encodeURIComponent(p.source.id)}?autoplay=1&dnt=1`
                  }
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
                    </div>
                  ) : (
                    <button className="project-play-button" onClick={() => { setVideoError(false); setActive(p); }} aria-label={`לצפייה בסרטון ${p.title}`}>
                      <Image src={p.poster} alt={p.title} fill sizes="(max-width: 700px) 92vw, (max-width: 1000px) 46vw, 33vw" />
                      <span className="play-disc"><Play size={22} fill="currentColor" /></span>
                      <span className="project-format">{p.aspect === "portrait" ? "9:16" : "16:9"}</span>
                    </button>
                  )}
                </div>
                <div className="project-caption">
                  <div>
                    <span>
                      {p.commissioned ? `הופק עבור ${p.client}` : p.client} /{" "}
                      {p.category}
                    </span>
                    <h3>{p.title}</h3>
                    {p.description && <p className="project-description">{p.description}</p>}
                  </div>
                  <ArrowUpLeft aria-hidden size={25} />
                </div>
              </article>
            ))}
          </div>
          {ordered.length > 6 && (
            <button
              className="button button-outline more-work"
              onClick={() => { setActive(null); setExpanded(!expanded); }}
            >
              {expanded ? "להציג פחות" : `לכל העבודות (${ordered.length})`}
            </button>
          )}
        </>
      ) : preview ? (
        <>
          <p className="preview-caption">
            <span className="status-dot" />
            תצוגת עיצוב • תמונות אווירה להמחשה, סרטוני הלקוחות יתווספו בהמשך
          </p>
          <div className="work-grid" ref={track}>
            {atmosphere.map((p, i) => (
              <article className={`project project-${i} reveal`} key={p.title}>
                <div className="project-image">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 92vw, (max-width: 1000px) 46vw, 33vw"
                  />
                  <span className="sample-stamp">המחשה בלבד</span>
                  <span className="project-sequence" aria-hidden>
                    0{i + 1}
                  </span>
                </div>
                <div className="project-caption">
                  <div>
                    <span>{p.label}</span>
                    <h3>{p.title}</h3>
                  </div>
                  <ArrowUpLeft aria-hidden size={25} />
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="work-empty">
          <p>עבודות חדשות בדרך למסך.</p>
          <a className="text-link" href="#contact">
            נדבר על הסרטון שלך <ArrowUpLeft size={18} />
          </a>
        </div>
      )}
      {(projects.length > 1 || preview) && (
        <div className="gallery-navigation">
          <span>מחליקים. מגלים. מקבלים השראה.</span>
          <div>
            <button
              aria-label="לפריים הקודם"
              onClick={() =>
                track.current?.scrollBy({
                  left: (track.current?.clientWidth || 300) * 0.85,
                  behavior:
                    document.documentElement.dataset.motion === "paused"
                      ? "auto"
                      : "smooth",
                })
              }
            >
              <ArrowRight size={20} />
            </button>
            <button
              aria-label="לפריים הבא"
              onClick={() =>
                track.current?.scrollBy({
                  left: -(track.current?.clientWidth || 300) * 0.85,
                  behavior:
                    document.documentElement.dataset.motion === "paused"
                      ? "auto"
                      : "smooth",
                })
              }
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      )}

    </section>
  );
}

