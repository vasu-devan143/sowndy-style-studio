import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  return raw.replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
}

/** Publishable key (sb_publishable_...) or the older anon JWT. */
export function getSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    ""
  );
}

export function getOwnerEmail() {
  return process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim().toLowerCase() ?? "";
}

export function isSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  return Boolean(url.startsWith("http") && key);
}

export function supabaseSetupHint() {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (url.startsWith("http") && key) return null;
  if (key && !url.startsWith("http")) {
    return "Supabase key is saved, but the Project URL is still missing. Paste https://YOUR-PROJECT.supabase.co into .env.local as NEXT_PUBLIC_SUPABASE_URL.";
  }
  if (url.startsWith("http") && !key) {
    return "Project URL is saved, but the publishable key is missing.";
  }
  return "Shop is in demo mode (saved in this browser). Add your Supabase URL + publishable key to .env.local to use the cloud database.";
}

let browserClient: SupabaseClient | null = null;

export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) {
    browserClient = createClient(getSupabaseUrl(), getSupabaseKey());
  }
  return browserClient;
}
