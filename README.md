# SOWNDY STYLE STUDIO

Mobile-first shop website for sarees, chudidar and ready-to-wear pre-pleated sarees.

Customers can tap **Add to bag**, then create a bill, pay by UPI, or send the bag on WhatsApp. The owner can add products with photos, record sales (stock goes down automatically), print A4 or small receipts, and export reports.

## How to run on your computer

1. Install [Node.js LTS](https://nodejs.org/) if it is not already installed.
2. Open this folder in Cursor / a terminal.
3. Run:

```bash
npm install
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in Chrome.

### Try it without Supabase (demo mode)

The shop already has 6 sample products. Owner login:

- Email: `owner@sowndy.local`
- Password: `sowndy123`
- Open [http://localhost:3000/admin](http://localhost:3000/admin)

Demo data is saved in the browser. Clear site data if you want to start again.

### What to click to test

1. Home → category cards → a product → **Add to bag**.
2. Open **Bag** → fill name/phone → **Create bill** → Print.
3. Admin → Products → Add product (upload a photo from your phone).
4. Admin → New bill → tap items → Save bill (stock reduces).
5. Admin → Settings → change WhatsApp number and UPI ID.

## Connect free Supabase (when you are ready)

1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Open **SQL Editor**, paste `sql/schema.sql`, run it.
3. Optional: paste `sql/seed.sql` and run it for sample products.
4. Open **Authentication → Users → Add user** and create the owner email + password.
5. Open **Project Settings → Data API / API Keys** and copy:
   - Project URL (starts with `https://` and ends with `.supabase.co`) → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable key (starts with `sb_publishable_`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
6. Put both values in `.env.local`. The `sb_publishable_...` string is the **key**, not the URL.
7. Restart `npm run dev`. Login at `/admin` with the Supabase user.

## Deploy on Vercel

1. Push this folder to GitHub (or import the folder in Vercel).
2. Create a project at [https://vercel.com](https://vercel.com) and choose Next.js.
3. Add the same two environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy. Open the Vercel URL on Android, iPhone, Windows and Mac.

Change the brand name later in `lib/brand.ts` and in Admin → Settings.

## Notes

- **Saree Pre-Pleating** means ready-to-wear / pre-pleated sarees.
- UPI deep links (`upi://pay`) open GPay, PhonePe or Paytm on a phone. On a computer they may not open an app — show the QR instead.
- Print → **Save as PDF** is the download-PDF path on phones and laptops.
