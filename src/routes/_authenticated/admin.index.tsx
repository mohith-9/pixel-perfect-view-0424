import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import {
  Film,
  Inbox,
  Sparkles,
  Contact,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [{ title: "Admin Panel — Mohith Kumar" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminIndexPage,
});

type DashboardProject = {
  id: string;
  title: string;
  category: string | null;
  platform: string | null;
  published: boolean;
  featured: boolean;
  views: string | null;
  updated_at: string;
  created_at: string;
};

type DashboardLead = {
  id: string;
  name: string;
  email: string;
  service: string | null;
  budget: string | null;
  status: string;
  created_at: string;
  is_read: boolean;
};

function AdminIndexPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      try {
        const [projectsSnap, leadsSnap] = await Promise.all([
          getDocs(query(collection(db, "projects"), orderBy("updated_at", "desc"))),
          getDocs(query(collection(db, "contact_leads"), orderBy("created_at", "desc"), limit(8))),
        ]);

        const projects: DashboardProject[] = [];
        projectsSnap.forEach((doc) => {
          const d = doc.data();
          projects.push({
            id: doc.id,
            title: d.title || "",
            category: d.category ?? null,
            platform: d.platform ?? null,
            published: Boolean(d.published),
            featured: Boolean(d.featured),
            views: d.views ?? null,
            updated_at: d.updated_at || "",
            created_at: d.created_at || "",
          });
        });

        const leads: DashboardLead[] = [];
        leadsSnap.forEach((doc) => {
          const d = doc.data();
          leads.push({
            id: doc.id,
            name: d.name || "",
            email: d.email || "",
            service: d.service ?? null,
            budget: d.budget ?? null,
            status: d.status || "new",
            created_at: d.created_at || "",
            is_read: Boolean(d.is_read),
          });
        });

        return { projects, leads };
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "admin_overview");
      }
    },
  });

  const projects = data?.projects ?? [];
  const leads = data?.leads ?? [];
  const publishedProjects = projects.filter((p) => p.published);
  const unreadLeads = leads.filter((l) => !l.is_read);

  const stats = [
    { label: "Total Videos", value: projects.length, icon: Film, color: "text-foreground" },
    {
      label: "Published on Site",
      value: publishedProjects.length,
      icon: CheckCircle2,
      color: "text-primary",
    },
    { label: "New Enquiries", value: unreadLeads.length, icon: Inbox, color: "text-primary" },
    {
      label: "Total Leads Received",
      value: leads.length,
      icon: TrendingUp,
      color: "text-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Admin Control Center
          </div>
          <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            Mohith Kumar <span className="text-primary">Admin</span>
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Manage your showreel videos, review client leads, and edit portfolio content in
            real-time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/work"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground uppercase tracking-wide hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Video
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wide hover:border-primary transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Live Site
          </a>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Featured Work",
            desc: "Reorder and publish showreel reels",
            href: "/admin/work",
            icon: Film,
          },
          {
            title: "Client Leads",
            desc: `${unreadLeads.length} unread client enquiries`,
            href: "/admin/leads",
            icon: Inbox,
          },
          {
            title: "Hero & Bio",
            desc: "Update tagline, bio, and stats",
            href: "/admin/hero",
            icon: Sparkles,
          },
          {
            title: "Contact & Social",
            desc: "Manage WhatsApp, phone, email & links",
            href: "/admin/contact",
            icon: Contact,
          },
        ].map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className="group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary/60 hover:bg-surface/80"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <item.icon className="h-4 w-4" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-semibold uppercase">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {s.label}
              </span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`mt-2 font-display text-3xl font-bold ${s.color}`}>
              {isLoading ? "—" : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Videos */}
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Recently Updated Videos
              </h2>
              <p className="text-xs text-muted-foreground">Latest items in your showreel catalog</p>
            </div>
            <Link to="/admin/work" className="text-xs font-semibold text-primary hover:underline">
              Manage Work →
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No videos added yet. Click &quot;Add Video&quot; above to add your first project.
            </p>
          ) : (
            <ul className="divide-y divide-border/60 text-sm">
              {projects.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0 pr-3">
                    <div className="truncate font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {[p.category, p.platform, p.views && `${p.views} views`]
                        .filter(Boolean)
                        .join(" · ") || "Video project"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        p.published
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "border border-border bg-surface-2 text-muted-foreground"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                    <Link
                      to="/admin/work"
                      className="rounded border border-border px-2 py-1 text-xs hover:border-primary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent Leads */}
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider">Recent Client Leads</h2>
              <p className="text-xs text-muted-foreground">Form submissions from your website</p>
            </div>
            <Link to="/admin/leads" className="text-xs font-semibold text-primary hover:underline">
              View All Leads →
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No client enquiries yet. New form submissions will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-border/60 text-sm">
              {leads.slice(0, 6).map((l) => (
                <li key={l.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${l.is_read ? "" : "text-foreground"}`}>
                          {l.name}
                        </span>
                        {!l.is_read && (
                          <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{l.email}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {l.service && (
                          <span className="font-medium text-foreground">{l.service}</span>
                        )}
                        {l.budget && ` · ${l.budget}`}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {l.created_at ? new Date(l.created_at).toLocaleDateString() : ""}
                      </div>
                      <Link
                        to="/admin/leads"
                        className="mt-1.5 inline-block text-xs text-primary hover:underline"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
