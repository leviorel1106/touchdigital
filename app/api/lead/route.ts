import { createLeadHandler } from "@/lib/lead";
export const runtime = "nodejs";
export const POST = createLeadHandler({
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    LEAD_TO_EMAIL: process.env.LEAD_TO_EMAIL,
    LEAD_FROM_EMAIL: process.env.LEAD_FROM_EMAIL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
