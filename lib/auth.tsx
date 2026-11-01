"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSupabase, getOwnerEmail, isSupabaseConfigured } from "./supabase/client";

type AuthValue = {
  ready: boolean;
  isAdmin: boolean;
  usingDemo: boolean;
  ownerEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

function isAllowedOwner(email: string | undefined) {
  const allowed = getOwnerEmail();
  if (!email) return false;
  if (!allowed) return true;
  return email.trim().toLowerCase() === allowed;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const usingDemo = !isSupabaseConfigured();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setIsAdmin(false);
      setOwnerEmail(null);
      setReady(true);
      return;
    }

    const applySession = async (email: string | undefined) => {
      if (!isAllowedOwner(email)) {
        if (email) await supabase.auth.signOut();
        setIsAdmin(false);
        setOwnerEmail(null);
        return;
      }
      setIsAdmin(true);
      setOwnerEmail(email ?? null);
    };

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session?.user.email).finally(() => setReady(true));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session?.user.email);
    });
    return () => sub.subscription.unsubscribe();
  }, [usingDemo]);

  const login = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error(
        "Supabase Project URL இன்னும் போடல. .env.local-ல NEXT_PUBLIC_SUPABASE_URL-ல https://….supabase.co போட்டு, npm run dev மறுபடியும் ரன் பண்ணுங்க.",
      );
    }
    if (getOwnerEmail() && email.trim().toLowerCase() !== getOwnerEmail()) {
      throw new Error("இந்த email-க்கு owner access இல்ல. Shop owner email மட்டும் போடுங்க.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      if (error.message.toLowerCase().includes("invalid login")) {
        throw new Error("Email அல்லது password தவறு. Supabase-ல நீங்க உருவாக்கிய அதே details போடுங்க.");
      }
      throw error;
    }
    if (!isAllowedOwner(data.user?.email)) {
      await supabase.auth.signOut();
      throw new Error("இந்த account-க்கு shop desk access இல்ல.");
    }
    setIsAdmin(true);
    setOwnerEmail(data.user?.email ?? email.trim());
  };

  const logout = async () => {
    await getSupabase()?.auth.signOut();
    setIsAdmin(false);
    setOwnerEmail(null);
  };

  return (
    <AuthContext.Provider value={{ ready, isAdmin, usingDemo, ownerEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
