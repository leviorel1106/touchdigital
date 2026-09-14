import Link from "next/link";
import { notFound } from "next/navigation";
import { legalDocuments } from "@/lib/legal";
import { PrivacySettingsButton } from "@/components/PrivacyControls";

export function generateStaticParams() { return Object.keys(legalDocuments).map(policy => ({ policy })); }
export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const doc = legalDocuments[policy as keyof typeof legalDocuments];
  return { title: doc ? `${doc.title} | אוראל לוי` : "עמוד לא נמצא", alternates: { canonical: `/${policy}` } };
}
export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  if (!Object.hasOwn(legalDocuments, policy)) notFound();
  const doc = legalDocuments[policy as keyof typeof legalDocuments];
  return <main className="legal-page" id="main-content">
    <Link className="legal-back" href="/">← חזרה לאתר של אוראל לוי</Link>
    <p className="eyebrow">מידע ושקיפות</p><h1>{doc.title}</h1>
    <p className="legal-date">עדכון אחרון: 14 בספטמבר 2026</p>
    <p className="legal-intro">{doc.intro}</p>
    {doc.sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}
    <nav className="legal-links" aria-label="מסמכי האתר">{Object.entries(legalDocuments).map(([key, value]) => <Link key={key} href={`/${key}`} aria-current={key === policy ? "page" : undefined}>{value.title}</Link>)}<PrivacySettingsButton /></nav>
    <a href="mailto:leviorel@gmail.com">leviorel@gmail.com</a>
  </main>;
}
