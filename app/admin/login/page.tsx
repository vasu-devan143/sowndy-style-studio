"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const { login, isAdmin, ready } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (ready && isAdmin) router.replace("/admin");
  }, [isAdmin, ready, router]);

  return (
    <form
      className="mx-auto grid max-w-md gap-4 rounded-3xl bg-white p-6 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          await login(email, password);
          router.push("/admin");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Login failed");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h1 className="text-3xl">Owner login</h1>
      <p className="text-sm text-muted">
        Shop desk உங்களுக்கு மட்டும். Supabase-ல நீங்க உருவாக்கிய real email மற்றும் password போடுங்க.
      </p>
      {!configured && (
        <p className="rounded-xl bg-cream px-3 py-2 text-sm text-rose">
          இன்னும் Project URL போடல. .env.local-ல NEXT_PUBLIC_SUPABASE_URL-ல https://….supabase.co
          paste பண்ணி, terminal-ல npm run dev மறுபடியும் ரன் பண்ணுங்க. அப்புறம் தான் real login வேலை செய்யும்.
        </p>
      )}
      <label className="grid gap-1 text-sm">
        Email
        <input
          type="email"
          required
          autoComplete="username"
          placeholder="you@email.com"
          className="rounded-xl border px-3 py-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Password
        <input
          type="password"
          required
          autoComplete="current-password"
          className="rounded-xl border px-3 py-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button disabled={busy || !configured} className="rounded-full bg-rose px-4 py-3 font-semibold text-white">
        {busy ? "Please wait…" : "Open shop desk"}
      </button>
    </form>
  );
}
