export type VideoSource =
  | { kind: "file"; url: string }
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string };
export interface Project {
  id: string;
  title: string;
  client: string;
  description?: string;
  category: string;
  // True only where the client actually commissioned the piece, so the
  // "produced for" credit is never claimed for a concept or a spec film.
  commissioned?: boolean;
  poster: string;
  aspect: "landscape" | "portrait";
  source: VideoSource;
  featured?: boolean;
}
// Selected work explicitly requested by Orel; concepts are labelled as such.
export const projects: Project[] = [{
  id: "mirror-lipstick",
  title: "ליפגלוס שתופס את העין",
  client: "ביוטי וקוסמטיקה",
  description: "סרטון פרסומי לליפגלוס, עם סצנת ביוטי שהופכת את המוצר לכוכב של הסיפור.",
  category: "סרטוני AI לעסקים",
  poster: "/portfolio/lipstick/poster.jpg",
  aspect: "portrait",
  source: { kind: "file", url: "/portfolio/lipstick/mirror-final.mp4" },
  featured: true,
}, {
  id: "third-age-animation",
  title: "טכנולוגיה פוגשת את הגיל השלישי",
  client: "ועידת טכנולוגיה לגיל השלישי",
  commissioned: true,
  description: "סרטון אנימציה שנוצר לוועידת טכנולוגיה לגיל השלישי, ומפגיש בין חדשנות לבין האנשים שהיא נועדה לשרת.",
  category: "אנימציית AI",
  poster: "/portfolio/animation/seniors-poster.jpg",
  aspect: "portrait",
  source: { kind: "file", url: "/portfolio/animation/seniors.mp4" },
}, {
  id: "children-animation",
  title: "שלא יישאר ילד בלי כריך",
  client: "עמותת אנשים",
  commissioned: true,
  description: "סרטון אנימציה לעמותת אנשים, המספקת כריכים לילדים ממשפחות מעוטות יכולת שמגיעים לבית הספר ללא ארוחה. סיפור על צורך בסיסי שאף ילד לא צריך להישאר בלעדיו.",
  category: "אנימציית AI",
  poster: "/portfolio/animation/children-poster.jpg",
  aspect: "portrait",
  source: { kind: "file", url: "/portfolio/animation/children.mp4" },
}, {
  id: "months-campaign",
  title: "הפיתוח שלכם צריך שיראו אותו",
  client: "יזמות ביטחונית | Defense Tech",
  description: "סרטון שיווקי הפונה ליזמים בתחום הטכנולוגיה הביטחונית. במרכזו האתגר להפוך חודשים של פיתוח למסר שאפשר להבין ולהציג.",
  category: "סרטוני AI לעסקים",
  poster: "/portfolio/business/months-poster.jpg",
  aspect: "portrait",
  source: { kind: "file", url: "/portfolio/business/months.mp4" },
}, {
  id: "business-systems",
  title: "אפקט טק. הטכנולוגיה שמאחורי העסק",
  client: "אפקט טק",
  commissioned: true,
  description: "סרטון שיווקי לאפקט טק, שמעמיד במרכז את המערכות הטכנולוגיות שמלוות את הפעילות העסקית.",
  category: "סרטוני AI לעסקים",
  poster: "/portfolio/business/systems-poster.jpg",
  aspect: "portrait",
  source: { kind: "file", url: "/portfolio/business/systems.mp4" },
}, {
  id: "restaurant-story",
  title: "ארוחת שף, בגרסה שלו",
  client: "Hill's | מזון לכלבים",
  description: "סרטון מותג למזון הכלבים של Hill's. חוויית מסעדה עם אורח על ארבע, שמכניסה הומור לעולם של תזונה לכלבים.",
  category: "סרטוני AI לעסקים",
  poster: "/portfolio/business/restaurant-poster.jpg",
  aspect: "portrait",
  source: { kind: "file", url: "/portfolio/business/restaurant.mp4" },
}, {
  id: "street-moment",
  title: "הרחוב הוא המסלול",
  client: "אופנה וביגוד",
  description: "סרטון שיווקי לקמפיין בגדים, שמוציא את האופנה לרחוב ומשלב את הלבוש בתוך סצנה של תנועה וחיי יום־יום.",
  category: "סרטוני AI לעסקים",
  poster: "/portfolio/street/poster.jpg",
  aspect: "portrait",
  source: { kind: "file", url: "/portfolio/street/street-film.mp4" },
}, {
  id: "social-dragon",
  title: "SOCIAL 2 — מעבר לדמיון",
  client: "יצירה של אוראל לוי",
  category: "סרט קונספט AI",
  poster: "/portfolio/social/dragon-poster.jpg",
  aspect: "portrait",
  source: { kind: "file", url: "/portfolio/social/social-2.mp4" },
}];
export const site = {
  name: "אוראל לוי",
  description:
    "קריאייטיב, סרטוני תדמית, פרסומות ותוכן לסושיאל. אוראל לוי, יוצר תוכן AI לעסקים.",
  ready: process.env.NEXT_PUBLIC_SITE_READY ? process.env.NEXT_PUBLIC_SITE_READY === "true" : process.env.NODE_ENV === "production",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972544606224").replace(/\D/g, ""),
  email: "leviorel@gmail.com",
  about: "אני מגיע מעולם התוכן, ובשנתיים האחרונות יוצר באמצעות בינה מלאכותית. בכל פרויקט אני מתחיל מהעסק שלכם: מה מייחד אותו, למי הוא פונה ומה אנחנו רוצים שהצופה ירגיש. משם אני בונה את הרעיון, הסיפור והשפה הוויזואלית, עד לסרטון שיש לו אופי משל עצמו. את ההתמחות שלי ב־AI העמקתי בקורס של רן נוראיני. כיום אני שותף אסטרטגי ב־EFECT, הבית הישראלי לעולמות וירטואליים, ובמסגרת השותפות יוצר סרטונים מותאמים אישית לעסקים קטנים, בינוניים וגדולים. מה שמעניין אותי הוא לקחת משהו שאתם מכירים כל כך טוב, העסק שלכם, ולגרום לאחרים לראות בו משהו שעוד לא ראו.",
  portrait: "/portrait/orel-studio-v1.png",
  hero: {
    poster: "/showreel/poster.jpg",
    video: "/showreel/orel-showreel-720p.mp4",
    isAtmosphere: false,
  },
};
export const whatsappUrl = /^972[1-9]\d{7,8}$/.test(site.whatsapp)
  ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("היי אוראל, אשמח לדבר על תוכן AI לעסק שלי.")}`
  : null;
// Temporary stock art direction, explicitly labelled in preview.
export const atmosphere = [
  {
    title: "עולמות שאפשר לדמיין",
    label: "קונספט וקריאייטיב",
    image: "/atmosphere/desert.jpg",
  },
  {
    title: "מבט אחר על המותג",
    label: "תדמית וסיפור",
    image: "/atmosphere/architecture.jpg",
  },
  {
    title: "תוכן עם נוכחות",
    label: "סושיאל ופרסום",
    image: "/atmosphere/fashion.jpg",
  },
];
