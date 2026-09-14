# Orel Levi — AI content portfolio

A Hebrew RTL Next.js 16 landing page for Orel Levi. All active legacy sections and their assets have been replaced. Backups of the previous work are outside this repository in the parent workspace.

## Local preview

```sh
npm install
npm run dev
```

Open http://localhost:3000. The default is an explicitly marked preview with stock atmosphere images, no sample client claims, noindex metadata and disabled contact delivery until configured.

## Content and launch

Edit `lib/site.ts` for approved project metadata, personal biography, portrait and hero media. `projects` is deliberately empty. A project needs id, title, client, category, poster, aspect (portrait or landscape), source and optional featured. Sources are `{ kind: 'file', url: '/work/film.mp4' }`, `{ kind: 'youtube', id: 'VIDEO_ID' }` or `{ kind: 'vimeo', id: 'NUMERIC_ID' }`. Add optimized local posters under public/work. Add captioned final videos or captions at the source platform. Category controls derive from real projects; the first six are shown before expanding. Avoid publishing test fixtures as real work.

Copy `.env.example` to `.env.local`. Set RESEND_API_KEY, LEAD_FROM_EMAIL (an address on a verified sender domain) and LEAD_TO_EMAIL. Set NEXT_PUBLIC_WHATSAPP_NUMBER as international digits starting with 972, and NEXT_PUBLIC_SITE_URL as the actual HTTPS origin, without a trailing slash. Never put mail credentials in NEXT_PUBLIC variables. Restart after environment changes. Set NEXT_PUBLIC_SITE_READY=true only after real assets, personal copy and contacts are reviewed and a real lead is received in the destination inbox.

Mail is sent server-side through https://resend.com/docs/api-reference/emails/send-email. The endpoint validates required name and Israeli phone, accepts optional email and message, caps request size, rejects a bot-trap field, and applies bounded per-instance phone-based throttling. Add deployment/WAF rate limits for distributed production abuse protection. Retries use a stable provider idempotency key. No lead details are written to console logs or a database. The receipt means accepted by the provider, not verified inbox delivery.

Hero video is optional, muted and plays only after pressing its control. Replacing site.hero.poster/video needs no layout rewrite. Set isAtmosphere=false once the real hero is ready. Personal imagery and video are still pending; the current site is not published.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
# With npm run dev running separately, and Chrome installed:
npm run test:browser
```

Node 24+ is used for native TypeScript in the API tests. Browser tests create a temporary qa-fixture page, exercise actual gallery and form components with intercepted media/email requests, and remove the page afterward. Do not build or deploy while browser tests are running. Screenshots go to ignored artifacts/.

## Temporary image credits

Preview atmosphere images from Unsplash, locally bundled for predictable loading:
- Desert: https://images.unsplash.com/photo-1509316785289-025f5b846b35
- Architecture: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab
- Fashion: https://images.unsplash.com/photo-1515886657613-9f3515b0c78f

These are visual placeholders, not Orel's work. Assistant is distributed under the SIL Open Font License included with the font files.
