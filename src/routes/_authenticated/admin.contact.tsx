import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { contentQuery, saveContent, type ContactContent, type SocialItem } from "@/lib/cms";
import { SaveButton, TextInput, inputCls } from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/contact")({ component: ContactAdmin });

const PLATFORMS = ["Instagram", "YouTube", "TikTok", "Facebook", "LinkedIn", "Twitter/X", "Behance", "Dribbble", "Custom"];

function ContactAdmin() {
  const qc = useQueryClient();
  const contact = useQuery(contentQuery("contact")).data;
  const socials = useQuery(contentQuery("socials")).data;
  const [c, setC] = useState<ContactContent | null>(null);
  const [items, setItems] = useState<SocialItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (contact && !c) setC(contact); }, [contact, c]);
  useEffect(() => { if (socials && !items) setItems(socials.items); }, [socials, items]);
  if (!c || !items) return <p className="text-muted-foreground">Loading…</p>;
  const set = (k: keyof ContactContent) => (v: string) => setC({ ...c, [k]: v });

  return (
    <form
      className="max-w-3xl space-y-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await saveContent("contact", c);
          await saveContent("socials", { items });
          await qc.invalidateQueries({ queryKey: ["site_content"] });
          toast.success("Settings updated");
        } catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
      }}
    >
      <h1 className="text-2xl uppercase">Contact & Social</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Email" value={c.email} onChange={set("email")} />
        <TextInput label="Alternate email" value={c.alt_email} onChange={set("alt_email")} />
        <TextInput label="Phone" value={c.phone} onChange={set("phone")} />
        <TextInput label="WhatsApp number (with country code)" value={c.whatsapp} onChange={set("whatsapp")} />
        <TextInput label="Location" value={c.location} onChange={set("location")} />
        <TextInput label="Business hours" value={c.business_hours} onChange={set("business_hours")} />
      </div>
      <div className="space-y-3">
        <h2 className="text-sm uppercase">Social accounts</h2>
        {items.map((s, i) => {
          const upd = (p: Partial<SocialItem>) => setItems(items.map((x, j) => (j === i ? { ...x, ...p } : x)));
          return (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3">
              <select className={`${inputCls} w-36`} value={s.platform} onChange={(e) => upd({ platform: e.target.value })}>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <input className={`${inputCls} min-w-0 flex-1`} placeholder="Profile URL" value={s.url} onChange={(e) => upd({ url: e.target.value })} />
              <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={s.active} onChange={(e) => upd({ active: e.target.checked })} /> Active</label>
              <button type="button" aria-label="Remove" onClick={() => confirm("Remove this account?") && setItems(items.filter((_, j) => j !== i))} className="p-2 text-muted-foreground hover:text-primary"><Trash2 className="h-4 w-4" /></button>
            </div>
          );
        })}
        <button type="button" onClick={() => setItems([...items, { platform: "YouTube", url: "", active: true }])} className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary">+ Add account</button>
      </div>
      <SaveButton busy={busy} />
    </form>
  );
}
