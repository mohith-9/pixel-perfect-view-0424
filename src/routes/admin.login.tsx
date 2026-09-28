import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Mohith Kumar" },
      { name: "description", content: "Owner sign-in for the Mohith Kumar portfolio admin panel." },
      { property: "og:title", content: "Admin Login — Mohith Kumar" },
      { property: "og:description", content: "Owner sign-in for the portfolio admin panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const password = String(f.get("password"));
    setBusy(true);
    setMsg(null);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin/login` },
      });
      setBusy(false);
      setMsg(error ? error.message : "Check your inbox and click the confirmation link, then log in here.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      setMsg(error.message);
      return;
    }
    const { data: ok } = await supabase.rpc("claim_admin");
    setBusy(false);
    if (!ok) {
      await supabase.auth.signOut();
      setMsg("This account does not have admin access.");
      return;
    }
    navigate({ to: "/admin/dashboard", replace: true });
  }

  const field =
    "w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-8">
        <div>
          <div className="font-display text-xl uppercase">
            Mohith <span className="text-primary">Kumar</span>
          </div>
          <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
            {mode === "login" ? "Admin Login" : "Create admin account"}
          </p>
        </div>
        <input name="email" type="email" required placeholder="Email" autoComplete="email" className={field} />
        <input name="password" type="password" required minLength={8} placeholder="Password" autoComplete={mode === "login" ? "current-password" : "new-password"} className={field} />
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <button disabled={busy} className="w-full rounded-md bg-primary py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase disabled:opacity-60">
          {busy ? "Please wait…" : mode === "login" ? "Login" : "Create account"}
        </button>
        <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(null); }} className="w-full text-xs text-muted-foreground hover:text-primary">
          {mode === "login" ? "First time? Create the admin account" : "Already have an account? Log in"}
        </button>
      </form>
    </main>
  );
}
