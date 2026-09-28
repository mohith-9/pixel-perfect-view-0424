import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "@/lib/cms";
import { Field, ImageInput, SaveButton, TextArea, TextInput, inputCls } from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/work")({ component: WorkAdmin });

const PLATFORMS = ["YouTube", "YouTube Shorts", "Instagram Reels", "TikTok", "Vimeo", "Direct MP4"];
type Draft = Partial<Project> & { title: string };
const EMPTY: Draft = { title: "", featured: true, published: true };

function WorkAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: async () => ((await supabase.from("projects").select("*").order("sort_order")).data ?? []) as Project[],
  });
  const [edit, setEdit] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin"] }); qc.invalidateQueries({ queryKey: ["projects"] }); };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setBusy(true);
    const { id, created_at: _c, updated_at: _u, ...rest } = edit;
    const payload = { ...rest, project_date: rest.project_date || null };
    const res = id
      ? await supabase.from("projects").update(payload).eq("id", id)
      : await supabase.from("projects").insert({ ...payload, sort_order: (data?.length ?? 0) + 1 });
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(id ? "Video saved" : "Video added");
    setEdit(null);
    refresh();
  }
  async function patch(id: string, p: Partial<Project>, msg: string) {
    const { error } = await supabase.from("projects").update(p).eq("id", id);
    if (error) toast.error(error.message); else { toast.success(msg); refresh(); }
  }
  async function remove(id: string) {
    if (!confirm("Delete this video?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Video deleted"); refresh(); }
  }
  async function move(i: number, dir: -1 | 1) {
    if (!data) return;
    const a = data[i], b = data[i + dir];
    if (!b) return;
    await Promise.all([
      supabase.from("projects").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("projects").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    refresh();
  }

  const set = (k: keyof Project) => (v: string) => setEdit((d) => d && { ...d, [k]: v });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl uppercase">Featured Work</h1>
        <button onClick={() => setEdit({ ...EMPTY })} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">+ Add Video</button>
      </div>

      <div className="space-y-2">
        {data?.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
            <div className="flex flex-col">
              <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="p-1 text-muted-foreground hover:text-primary disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
              <button aria-label="Move down" disabled={i === data.length - 1} onClick={() => move(i, 1)} className="p-1 text-muted-foreground hover:text-primary disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
            </div>
            {p.thumbnail_url ? <img src={p.thumbnail_url} alt="" className="h-16 w-10 rounded object-cover" /> : <div className="h-16 w-10 rounded bg-background" />}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{p.title}</div>
              <div className="text-xs text-muted-foreground">{[p.platform, p.views && `${p.views} views`, p.client_name].filter(Boolean).join(" · ")}</div>
            </div>
            <button onClick={() => patch(p.id, { published: !p.published }, p.published ? "Video unpublished" : "Video published")}
              className={`rounded px-2 py-1 text-[10px] uppercase ${p.published ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
              {p.published ? "Published" : "Draft"}
            </button>
            <button aria-label="Edit" onClick={() => setEdit(p)} className="p-2 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
            <button aria-label="Delete" onClick={() => remove(p.id)} className="p-2 text-muted-foreground hover:text-primary"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/80" onClick={() => setEdit(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-lg space-y-4 overflow-y-auto border-l border-border bg-background p-6">
            <h2 className="text-lg uppercase">{edit.id ? "Edit video" : "Add video"}</h2>
            <TextInput label="Project title *" value={edit.title} onChange={set("title")} />
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Client name" value={edit.client_name ?? ""} onChange={set("client_name")} />
              <TextInput label="Category" value={edit.category ?? ""} onChange={set("category")} />
            </div>
            <TextArea label="Short description" value={edit.description ?? ""} onChange={set("description")} />
            <ImageInput label="Thumbnail" value={edit.thumbnail_url ?? ""} onChange={set("thumbnail_url")} folder="projects" />
            <TextInput label="Video URL" value={edit.video_url ?? ""} onChange={set("video_url")} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Platform">
                <select className={inputCls} value={edit.platform ?? ""} onChange={(e) => set("platform")(e.target.value)}>
                  <option value="">—</option>
                  {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <TextInput label="Views (e.g. 1.2M)" value={edit.views ?? ""} onChange={set("views")} />
            </div>
            <TextInput label="Project date" type="date" value={edit.project_date ?? ""} onChange={set("project_date")} />
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!edit.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!edit.published} onChange={(e) => setEdit({ ...edit, published: e.target.checked })} /> Published</label>
            </div>
            <div className="flex gap-3">
              <SaveButton busy={busy} />
              <button type="button" onClick={() => setEdit(null)} className="rounded-md border border-border px-5 py-2.5 text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
