import { createLeadHandler } from "@/lib/lead";
export const runtime = "nodejs";
export const POST = createLeadHandler({
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    LEAD_TO_EMAIL: process.env.LEAD_TO_EMAIL,
    LEAD_FROM_EMAIL: process.env.LEAD_FROM_EMAIL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    LEAD_WEBHOOK_URL: process.env.LEAD_WEBHOOK_URL,
    GREEN_API_INSTANCE: process.env.GREEN_API_INSTANCE,
    GREEN_API_TOKEN: process.env.GREEN_API_TOKEN,
    LEAD_WHATSAPP_TO: process.env.LEAD_WHATSAPP_TO,
  },
});
