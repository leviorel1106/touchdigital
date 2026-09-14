"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PrivacySettingsButton } from "./PrivacyControls";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowUpLeft,
  ArrowUpRight,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { Portfolio } from "./Portfolio";
import { ProcessRobot } from "./ProcessRobot";
import { ContactForm } from "./ContactForm";
import { MotionExperience } from "./MotionExperience";
import { HeroCanvas } from "./HeroCanvas";
import { CreativeStage } from "./CreativeStage";
import { StudioShowcase } from "./StudioShowcase";
import { projects, site, whatsappUrl } from "@/lib/site";
const nav = [
  { href: "#work", text: "העבודות" },
  { href: "#services", text: "מה אני יוצר" },
  { href: "#about", text: "קצת עליי" },
];
const services = [
  {
    no: "01",
    title: "סרטוני תדמית",
    subtitle: "לספר את הסיפור שלך",
    body: "הרעיון שמאחורי העסק, האנשים והאופי שלו. סיפור חזותי שמאפשר להכיר אותך עוד לפני השיחה הראשונה.",
    tags: "סיפור מותג / סרטי עסק / השקות",
  },
  {
    no: "02",
    title: "פרסומות AI",
    subtitle: "להפוך רעיון לסצנה",
    body: "עולמות, דמויות ומוצרים במציאות שאפשר להמציא. קריאייטיב שנבנה סביב המסר של המותג שלך.",
    tags: "סרטי מוצר / קמפיינים / קריאייטיב",
  },
  {
    no: "03",
    title: "תוכן לסושיאל",
    subtitle: "להיות חלק מהשיחה",
    body: "סרטונים קצרים עם קצב, אופי וסיבה להמשיך לצפות. מותאמים למסך הקטן ולשפה של העסק שלך.",
    tags: "רילסים / תוכן קצר / פורמט אנכי",
  },
];
function Wordmark() {
  return (
    <span className="wordmark" dir="ltr">
      <span className="brand-symbol" aria-hidden>
        <span />
        <span />
      </span>
      <span>
        OREL LEVI<span className="wordmark-sub">AI CONTENT CREATOR</span>
      </span>
    </span>
  );
}
export function Landing({ mailReady }: { mailReady: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLDialogElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const crewVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const el = mobileNav.current;
    const opener = menuButton.current;
    const previous = document.body.style.overflow;
    el?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = previous;
      opener?.focus({ preventScroll: true });
    };
  }, [menuOpen]);
  useEffect(() => {
    const videos = [heroVideo.current, crewVideo.current].filter((video): video is HTMLVideoElement => video !== null);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visible = new Set<HTMLVideoElement>();
    let filmOpen = false;
    const sync = () => {
      videos.forEach((video) => {
        if (media.matches || document.documentElement.dataset.motion === "paused" || document.hidden || !visible.has(video) || filmOpen) video.pause();
        else void video.play().catch(() => {});
      });
    };
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) visible.add(video);
        else visible.delete(video);
      });
      sync();
    });
    videos.forEach((video) => visibility.observe(video));
    const motion = new MutationObserver(sync);
    motion.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    const open = () => { filmOpen = true; sync(); };
    const close = () => { filmOpen = false; sync(); };
    window.addEventListener("film-open", open);
    window.addEventListener("film-close", close);
    sync();
    return () => {
      visibility.disconnect();
      motion.disconnect();
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      window.removeEventListener("film-open", open);
      window.removeEventListener("film-close", close);
    };
  }, []);
  return (
    <>
      <MotionExperience />
      <a className="skip-link" href="#main-content">
        דילוג לתוכן
      </a>
      <header className="site-header">
        <a
          href="#home"
          className="logo-link"
          aria-label="אוראל לוי, לראש העמוד"
        >
          <Wordmark />
        </a>
        <nav className="desktop-nav" aria-label="ניווט ראשי">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.text}
            </a>
          ))}
        </nav>
        <a href="#contact" className="header-contact">
          בואו ניצור משהו <ArrowUpLeft size={18} />
        </a>
        <button
          ref={menuButton}
          className="icon-button mobile-toggle"
          aria-label="פתיחת תפריט"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(true)}
        >
          <Menu />
        </button>
      </header>
      <dialog
        id="mobile-nav"
        className="mobile-nav"
        ref={mobileNav}
        aria-label="תפריט ניווט"
        onCancel={(e) => {
          e.preventDefault();
          setMenuOpen(false);
        }}
      >
        <button
          className="icon-button menu-close"
          aria-label="סגירת תפריט"
          onClick={() => setMenuOpen(false)}
        >
          <X />
        </button>
        <nav>
          {[...nav, { href: "#contact", text: "בואו נדבר" }].map((n) => (
            <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>
              {n.text}
              <ArrowUpLeft />
            </a>
          ))}
        </nav>
        <span dir="ltr">OREL LEVI / AI CONTENT</span>
      </dialog>
      <main id="main-content" tabIndex={-1}>
        <section
          className={site.hero.video ? "hero hero-film" : "hero"}
          id="home"
          aria-labelledby="hero-title"
          data-scroll-scene
        >
          <div className="hero-scene">
            <Image
              src={site.hero.poster}
              alt=""
              fill
              preload
              sizes="100vw"
              className="hero-landscape"
            />
            {site.hero.video && (
              <video
                ref={heroVideo}
                className="hero-video"
                src={site.hero.video}
                poster={site.hero.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="סרט השואוריל של אוראל לוי"
              />
            )}
          </div>
          <div className="hero-shade" />
          {!site.hero.video && <HeroCanvas />}
          <div className="hero-topline">
            <span>
              <i className="status-dot" /> אוראל לוי / יוצר תוכן AI לעסקים
            </span>
            <span className="hero-coordinate" dir="ltr">
              IMAGINATION, IN MOTION.
            </span>
          </div>
          <div className="hero-content">
            <h1 id="hero-title">
              העסק שלך.
              <br />
              <span>מעבר לדמיון.</span>
            </h1>
            <p>
              סרטונים שהופכים רעיון לעולם שלם.
              <br />
              קריאייטיב אנושי. אפשרויות של AI. הסיפור שלך.
            </p>
            <a className="button button-white" href="#contact">
              בואו ניצור את הסרטון שלכם <ArrowUpLeft size={22} />
            </a>
          </div>
          <a className="hero-work-link" href="#work">
            <span className="round-arrow">
              <ArrowDownLeft size={31} />
            </span>
            <span>
              פחות להסביר.
              <br />
              <strong>יותר להראות.</strong>
            </span>
          </a>
          <div className="hero-bottom">
            <a href="#work">
              <ArrowDown size={15} /> לגלול אל העבודות
            </a>
            <span>
              {site.hero.isAtmosphere
                ? "תמונת אווירה • ההירו החדש בדרך"
                : "A FILM BY OREL LEVI"}
            </span>
            {!site.hero.video && (
              <span className="frame-mark" dir="ltr">
                [ CREATIVE WITHOUT LIMITS ]
              </span>
            )}
          </div>
        </section>
        <div className="creative-strip" aria-hidden="true">
          <div className="marquee-track" dir="ltr">
            {[0, 1].map((copy) => (
              <div className="marquee-group" key={copy}>
                <span>CREATIVE THINKING</span>
                <i>✳</i>
                <span>HUMAN DIRECTION</span>
                <i>✳</i>
                <span>AI POSSIBILITIES</span>
                <i>✳</i>
                <span>YOUR STORY</span>
                <i>✳</i>
              </div>
            ))}
          </div>
        </div>
        {projects.length > 0 && <Portfolio projects={projects} preview={!site.ready} />}
        <StudioShowcase sectionId={projects.length ? "showreel-worlds" : "work"} />
        <CreativeStage />
        <section
          id="services"
          className="section services"
          aria-labelledby="services-title"
          data-scroll-scene
        >
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">מהרעיון ועד הפריים האחרון</p>
              <h2 id="services-title">
                אותו עסק.
                <br />
                <span className="muted">אפשרויות חדשות.</span>
              </h2>
            </div>
            <p className="section-intro">
              כל פורמט מתחיל בשאלה אחת:
              <br />
              מה הסיפור שהעסק שלך צריך לספר?
            </p>
          </div>
          <div className="service-list">
            {services.map((s) => (
              <a className="service-row reveal" key={s.no} href="#contact" aria-label={`נדבר על ${s.title}`}>
                <span className="service-number" dir="ltr">
                  /{s.no}
                </span>
                <div className="service-title">
                  <h3>{s.title}</h3>
                  <p>{s.subtitle}</p>
                </div>
                <div className="service-detail">
                  <p>{s.body}</p>
                  <span>{s.tags}</span>
                </div>
                <ArrowUpLeft className="service-arrow" size={30} aria-hidden />
              </a>
            ))}
          </div>
        </section>
        <section id="ai-crew" className="section crew-film" aria-labelledby="crew-title" data-scroll-scene>
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">הקריאייטיב שלי. צוות של אפשרויות.</p>
              <h2 id="crew-title">הדמיון מקבל<br /><span className="muted">צוות הפקה.</span></h2>
            </div>
            <p className="section-intro">מהתסריט ועד לפריים האחרון.<br />סרט קונספט שמכניס אתכם לסט שלי.</p>
          </div>
          <video ref={crewVideo} className="crew-film-player" autoPlay muted loop playsInline preload="metadata" poster="/robot-film/poster.jpg" aria-label="צוות ההפקה של אוראל לוי, סרט קונספט באורך 25 שניות">
            <source src="/robot-film/production-25s.mp4" type="video/mp4" />
            הדפדפן אינו תומך בניגון הסרטון. <a href="/robot-film/production-25s.mp4">פתיחת הסרטון</a>
          </video>
          <div className="crew-film-caption"><span>סרט קונספט שנוצר ב־AI · 25 שניות</span><a className="text-link" href="#contact">מה ניצור לעסק שלכם? <ArrowUpLeft size={18} /></a></div>
        </section>
        <section
          id="about"
          className="section about"
          aria-labelledby="about-title"
          data-scroll-scene
        >
          <div className="about-art reveal">
            {site.portrait ? (
              <Image
                src={site.portrait}
                alt="אוראל לוי"
                fill
                sizes="(max-width: 800px) 90vw, 40vw"
              />
            ) : (
              <>
                <span className="about-monogram" dir="ltr">
                  ol<span>.</span>
                </span>
                <span className="about-art-caption" dir="ltr">
                  THE HUMAN
                  <br />
                  BEHIND THE AI.
                </span>
                <span className="about-art-corner" aria-hidden>
                  ↗
                </span>
              </>
            )}
          </div>
          <div className="about-copy reveal">
            <p className="eyebrow">מאחורי הפריימים</p>
            <h2 id="about-title">
              נעים להכיר,
              <br />
              אני אוראל.
            </h2>
            <p className="about-lead">
              העסק שלכם הוא נקודת ההתחלה.
              <br />
              הדמיון שלי לוקח אותו משם.
            </p>
            {site.about ? (
              <p>{site.about}</p>
            ) : (
              <p>
                כאן העסק שלך מקבל מקום לדמיין איך הוא יכול להיראות, להישמע ולספר
                את עצמו. עם מחשבה על המסר, על הקהל ועל הפרטים הקטנים שבכל פריים.
              </p>
            )}
            {!site.ready && !site.about && (
              <p className="setup-note">
                הטקסט האישי והתמונה של אוראל יתווספו בהמשך.
              </p>
            )}
            <a className="text-link" href="#contact">
              בואו נכיר את העסק שלכם <ArrowUpLeft size={20} />
            </a>
            <div className="about-signature" dir="ltr">Orel Levi<span>HUMAN MIND. AI POSSIBILITIES.</span></div>
          </div>
        </section>
        <section
          className="section process"
          aria-labelledby="process-title"
          data-scroll-scene
        >
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">כך זה עובד</p>
              <h2 id="process-title">
                מרעיון בראש.
                <br />
                <span className="muted">לסרטון על המסך.</span>
              </h2>
            </div>
            <p className="section-intro">
              תהליך משותף, עם כיוון ברור
              <br />
              ומקום לדמיון לאורך הדרך.
            </p>
          </div>
          <ProcessRobot />
          <ol className="process-steps">
            {[
              [
                "מכירים את העסק",
                "מדברים על המותג, הקהל והמטרה. מבינים מה חשוב לך להעביר.",
              ],
              [
                "מוצאים את הסיפור",
                "מגבשים קונספט ושפה חזותית, ומדייקים יחד את הכיוון לפני ההפקה.",
              ],
              [
                "נותנים לו חיים",
                "יוצרים את הסצנות, עורכים ומחברים תמונה, קול וקצב לסרטון שלם.",
              ],
              [
                "מוכנים לפרסום",
                "עוברים יחד על התוצאה ומכינים את הקבצים לפורמטים שסיכמנו.",
              ],
            ].map(([title, body], i) => (
              <li className="reveal" key={title}>
                <div className="step-top">
                  <span>0{i + 1}</span>
                  <ArrowUpLeft size={23} aria-hidden />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>
        <ContactForm
          mailReady={mailReady}
          whatsapp={whatsappUrl}
          preview={!site.ready}
        />
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <a
            href="#home"
            className="logo-link"
            aria-label="אוראל לוי, לראש העמוד"
          >
            <Wordmark />
          </a>
          <p>רעיונות גדולים. תוכן עם אופי.</p>
          <a href="#home" className="text-link">
            בחזרה למעלה <ArrowUpRight size={18} />
          </a>
        </div>
        <nav className="legal-links" aria-label="מידע משפטי ופרטיות">
          <Link href="/privacy">מדיניות פרטיות</Link>
          <Link href="/terms">תנאי שימוש</Link>
          <Link href="/cookies">מדיניות עוגיות</Link>
          <Link href="/accessibility">הצהרת נגישות</Link>
          <PrivacySettingsButton />
          <a href="mailto:leviorel@gmail.com">leviorel@gmail.com</a>
        </nav>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} אוראל לוי. כל הזכויות שמורות.
          </span>
          <span dir="ltr">MADE OF IDEAS.</span>
        </div>
      </footer>
      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שיחה עם אוראל בוואטסאפ"
        >
          <MessageCircle size={23} />
          <span>נדבר?</span>
        </a>
      ) : (
        !site.ready && (
          <span
            className="whatsapp-preview"
            title="יופעל לאחר הוספת מספר הוואטסאפ"
          >
            <MessageCircle size={20} /> וואטסאפ • בקרוב
          </span>
        )
      )}
    </>
  );
}
