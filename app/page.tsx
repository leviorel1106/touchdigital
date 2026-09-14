import { Landing } from "@/components/Landing";
export default function Home() {
  // The form is live when a lead can reach Orel at all: stored in the database, mailed, or both.
  const mailReady = Boolean(
    (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) ||
    (process.env.RESEND_API_KEY &&
      process.env.LEAD_TO_EMAIL &&
      process.env.LEAD_FROM_EMAIL),
  );
  return <Landing mailReady={mailReady} />;
}
