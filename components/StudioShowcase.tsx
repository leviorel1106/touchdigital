"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpLeft } from "lucide-react";
import { FilmButton } from "./FilmButton";

const worlds = [
  { name: "קולינריה", title: "אפשר כמעט לטעום.", detail: "מרקמים, אור ותנועה שהופכים מנה לרגע שקשה להסיט ממנו את המבט.", image: "culinary", time: 2, english: "A MATTER OF TASTE" },
  { name: "ביוטי ומוצר", title: "נוכחות שאי אפשר לפספס.", detail: "מוצר אחד. עולם שלם סביבו. שפה חזותית שמעניקה לכל פרט משמעות.", image: "perfume", time: 7, english: "INSTINCT & DESIRE" },
  { name: "אופנה", title: "אופי. בכל תנועה.", detail: "הבד, הצללית והאור נפגשים בסיפור שנבנה סביב המותג.", image: "fashion", time: 14, english: "MADE TO MOVE" },
  { name: "רכב", title: "להרגיש את העוצמה.", detail: "קווים, השתקפויות וקצב. תחושה שמתחילה עוד לפני שמתניעים.", image: "car", time: 17, english: "DRIVEN BY EMOTION" },
  { name: "נדל״ן", title: "לראות מקום. להרגיש בית.", detail: "אדריכלות מזווית אחרת. מסע בין חלל, חומר והחיים שאפשר לדמיין בו.", image: "villa", time: 24, english: "ROOM TO IMAGINE" },
];

export function StudioShowcase({ sectionId = "work" }: { sectionId?: string }) {
  const [active, setActive] = useState(0);
  const world = worlds[active];
  return <section id={sectionId} className="studio-showcase section" aria-labelledby={`${sectionId}-title`} data-scroll-scene>
    <div className="studio-heading"><div><p className="eyebrow">עולמות מתוך השואוריל</p><h2 id={`${sectionId}-title`}>אותו דמיון.<br /><span>עולמות אחרים.</span></h2></div><p>מהמנה הראשונה ועד הבית הבא.<br />לכל עסק יש סיפור שאפשר לראות אחרת.</p></div>
    <div className="world-selector" role="group" aria-label="בחירת עולם תוכן">
      {worlds.map((item, index) => <button key={item.image} aria-pressed={index === active} aria-controls="world-stage" onClick={() => setActive(index)}><span dir="ltr">0{index + 1}</span>{item.name}</button>)}
    </div>
    <div className="world-stage" id="world-stage">
      <div className="world-visual">
        {worlds.map((item, index) => <Image key={item.image} src={`/showreel/${item.image}.jpg`} alt={index === active ? item.title : ""} fill sizes="(max-width: 800px) 94vw, 80vw" className={index === active ? "world-image active" : "world-image"} aria-hidden={index !== active} />)}
        <div className="world-film-label"><span dir="ltr">OREL LEVI — CONCEPT FILM</span><span dir="ltr">0{active + 1} / 05</span></div>
        <div className="world-caption" aria-live="polite"><span dir="ltr">{world.english}</span><h3>{world.title}</h3></div>
        <FilmButton start={world.time} label="לצפייה בסצנה" className="world-play" />
      </div>
      <div className="world-detail"><p>{world.detail}</p><a href="#contact">נדמיין את העסק שלכם <ArrowUpLeft size={21} /></a></div>
    </div>
    <p className="concept-note">סצנות קונספט שנוצרו ב־AI להמחשת האפשרויות הקריאייטיביות.</p>
  </section>;
}
