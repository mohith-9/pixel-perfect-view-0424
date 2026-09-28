import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const [projects, leads] = await Promise.all([
        supabase.from("projects").select("id,title,published,views,updated_at,created_at").order("updated_at", { ascending: false }),
        supabase.from("contact_leads").select("id,name,email,service,status,created_at,is_read").order("created_at", { ascending: false }).limit(5),
      ]);
      return { projects: projects.data ?? [], leads: leads.data ?? [] };
    },
  });
  const projects = data?.projects ?? [];
  const cards = [
    ["Total Videos", projects.length],
    ["Published", projects.filter((p) => p.published).length],
    ["New Enquiries", (data?.leads ?? []).filter((l) => !l.is_read).length],
  ] as const;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl uppercase">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(([l, n]) => (
          <div key={l} className="rounded-xl border border-border bg-surface p-5">
            <div className="font-display text-3xl text-primary">{n}</div>
            <div className="text-xs text-muted-foreground uppercase">{l}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-3 flex justify-between"><h2 className="text-sm uppercase">Recently updated videos</h2><Link to="/admin/work" className="text-xs text-primary">Manage</Link></div>
          <ul className="divide-y divide-border text-sm">
            {projects.slice(0, 5).map((p) => (
              <li key={p.id} className="flex justify-between py-2"><span className="truncate">{p.title}</span><span className="text-xs text-muted-foreground">{p.published ? "Published" : "Draft"}</span></li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-3 flex justify-between"><h2 className="text-sm uppercase">Recent enquiries</h2><Link to="/admin/leads" className="text-xs text-primary">View all</Link></div>
          <ul className="divide-y divide-border text-sm">
            {(data?.leads ?? []).map((l) => (
              <li key={l.id} className="py-2"><div className="flex justify-between"><span className={l.is_read ? "" : "font-semibold"}>{l.name}</span><span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</span></div><div className="text-xs text-muted-foreground">{l.email}</div></li>
            ))}
            {data && data.leads.length === 0 && <li className="py-2 text-muted-foreground">No enquiries yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
