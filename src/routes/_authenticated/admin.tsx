import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LayoutDashboard, Sparkles, Film, Inbox, Contact, Menu, X, ExternalLink, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Mohith Kumar" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/hero", label: "Hero", icon: Sparkles },
  { to: "/admin/work", label: "Featured Work", icon: Film },
  { to: "/admin/leads", label: "Contact Leads", icon: Inbox },
  { to: "/admin/contact", label: "Contact & Social", icon: Contact },
] as const;

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  const sidebar = (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-6 px-2 font-display text-lg uppercase">
        Mohith <span className="text-primary">Admin</span>
      </div>
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
          activeProps={{ className: "bg-surface text-foreground border-l-2 border-primary" }}
        >
          <Icon className="h-4 w-4" /> {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-border lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-border bg-background">{sidebar}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="hidden truncate text-sm text-muted-foreground sm:block">{user.email}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" /> Site live
          </span>
          <div className="ml-auto flex gap-2">
            <a href="/" target="_blank" className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary">
              <ExternalLink className="h-3.5 w-3.5" /> View Website
            </a>
            <button onClick={logout} className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
