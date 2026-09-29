import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MessageCircle, Trash2 } from "lucide-react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { inputCls } from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/leads")({ component: Leads });

const STATUSES = [
  ["new", "New"],
  ["contacted", "Contacted"],
  ["discussion", "In Discussion"],
  ["converted", "Converted"],
  ["closed", "Closed"],
] as const;

type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  message: string;
  status: string;
  is_read: boolean;
  created_at: string;
};

function Leads() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "contact_leads"), orderBy("created_at", "desc")),
        );
        const leads: Lead[] = [];
        snap.forEach((d) => {
          const leadData = d.data();
          leads.push({
            id: d.id,
            name: leadData.name || "",
            email: leadData.email || "",
            phone: leadData.phone ?? null,
            company: leadData.company ?? null,
            service: leadData.service ?? null,
            budget: leadData.budget ?? null,
            message: leadData.message || "",
            status: leadData.status || "new",
            is_read: Boolean(leadData.is_read),
            created_at: leadData.created_at || "",
          });
        });
        return leads;
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "contact_leads");
      }
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin"] });
  };

  async function update(id: string, patch: { status?: string; is_read?: boolean }) {
    try {
      await updateDoc(doc(db, "contact_leads", id), patch);
      toast.success("Lead updated");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update lead");
      handleFirestoreError(error, OperationType.UPDATE, `contact_leads/${id}`);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await deleteDoc(doc(db, "contact_leads", id));
      toast.success("Lead deleted");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete lead");
      handleFirestoreError(error, OperationType.DELETE, `contact_leads/${id}`);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl uppercase">Contact Leads</h1>
      {data?.length === 0 && (
        <p className="text-muted-foreground">
          No enquiries yet. They'll appear here when someone uses the form on the Contact page.
        </p>
      )}
      <div className="space-y-3">
        {data?.map((l) => (
          <div
            key={l.id}
            className={`rounded-xl border bg-surface p-5 ${l.is_read ? "border-border" : "border-primary"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-semibold">
                  {l.name}{" "}
                  {!l.is_read && (
                    <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground uppercase">
                      New
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {l.email}
                  {l.phone && ` · ${l.phone}`}
                  {l.company && ` · ${l.company}`}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {l.service && `Service: ${l.service}`}
                  {l.budget && ` · Budget: ${l.budget}`} ·{" "}
                  {l.created_at ? new Date(l.created_at).toLocaleString() : ""}
                </div>
              </div>
              <select
                className={`${inputCls} w-40`}
                value={l.status}
                onChange={(e) => update(l.id, { status: e.target.value })}
              >
                {STATUSES.map(([v, t]) => (
                  <option key={v} value={v}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap">{l.message}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {!l.is_read && (
                <button
                  onClick={() => update(l.id, { is_read: true })}
                  className="rounded-md border border-border px-3 py-1.5 hover:border-primary"
                >
                  Mark as read
                </button>
              )}
              <a
                href={`mailto:${l.email}`}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:border-primary"
              >
                <Mail className="h-3.5 w-3.5" /> Reply via email
              </a>
              {l.phone && (
                <a
                  href={`https://wa.me/${l.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:border-primary"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              )}
              <button
                onClick={() => remove(l.id)}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:border-primary"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
