import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MessageCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { inputCls } from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/leads")({ component: Leads });

const STATUSES = [
  ["new", "New"], ["contacted", "Contacted"], ["discussion", "In Discussion"], ["converted", "Converted"], ["closed", "Closed"],
] as const;

function Leads() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => (await supabase.from("contact_leads").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin"] }); };
  async function update(id: string, patch: { status?: string; is_read?: boolean }) {
    const { error } = await supabase.from("contact_leads").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Lead updated"); refresh(); }
  }
  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("contact_leads").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Lead deleted"); refresh(); }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl uppercase">Contact Leads</h1>
      {data?.length === 0 && <p className="text-muted-foreground">No enquiries yet. They'll appear here when someone uses the form on the Contact page.</p>}
      <div className="space-y-3">
        {data?.map((l) => (
          <div key={l.id} className={`rounded-xl border bg-surface p-5 ${l.is_read ? "border-border" : "border-primary"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{l.name} {!l.is_read && <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground uppercase">New</span>}</div>
                <div className="text-xs text-muted-foreground">{l.email}{l.phone && ` · ${l.phone}`}{l.company && ` · ${l.company}`}</div>
                <div className="mt-1 text-xs text-muted-foreground">{l.service && `Service: ${l.service}`}{l.budget && ` · Budget: ${l.budget}`} · {new Date(l.created_at).toLocaleString()}</div>
              </div>
              <select className={`${inputCls} w-40`} value={l.status} onChange={(e) => update(l.id, { status: e.target.value })}>
                {STATUSES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
              </select>
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap">{l.message}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {!l.is_read && <button onClick={() => update(l.id, { is_read: true })} className="rounded-md border border-border px-3 py-1.5 hover:border-primary">Mark as read</button>}
              <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:border-primary"><Mail className="h-3.5 w-3.5" /> Reply via email</a>
              {l.phone && <a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:border-primary"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>}
              <button onClick={() => remove(l.id)} className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:border-primary"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
