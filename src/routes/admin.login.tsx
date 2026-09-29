import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { isUserAdmin } from "@/lib/auth";

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

  async function handleGoogleLogin() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const isAdmin = await isUserAdmin(res.user);
      if (!isAdmin) {
        await signOut(auth);
        setMsg("This Google account does not have admin permissions.");
        setBusy(false);
        return;
      }
      navigate({ to: "/admin", replace: true });
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Google sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const password = String(f.get("password"));
    setBusy(true);
    setMsg(null);

    try {
      let user = null;
      if (mode === "signup") {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        user = userCred.user;
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        user = userCred.user;
      }

      const isAdmin = await isUserAdmin(user);
      if (!isAdmin) {
        await signOut(auth);
        setMsg("This account does not have admin access.");
        setBusy(false);
        return;
      }

      navigate({ to: "/admin", replace: true });
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-8">
        <div>
          <div className="font-display text-xl uppercase">
            Mohith <span className="text-primary">Kumar</span>
          </div>
          <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
            {mode === "login" ? "Admin Login" : "Create admin account"}
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary transition-colors disabled:opacity-60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-2 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative bg-surface px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            Or with email
          </span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            className={field}
          />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className={field}
          />
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
          <button
            disabled={busy}
            className="w-full rounded-md bg-primary py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMsg(null);
          }}
          className="w-full text-xs text-muted-foreground hover:text-primary"
        >
          {mode === "login"
            ? "First time? Create the admin account"
            : "Already have an account? Log in"}
        </button>
      </div>
    </main>
  );
}
