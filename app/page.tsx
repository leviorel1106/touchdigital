import { Landing } from "@/components/Landing";
export default function Home() {
  const mailReady = Boolean(
    process.env.RESEND_API_KEY &&
    process.env.LEAD_TO_EMAIL &&
    process.env.LEAD_FROM_EMAIL,
  );
  return <Landing mailReady={mailReady} />;
}
