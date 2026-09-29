import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Pencil,
  Trash2,
  Play,
  X,
  ExternalLink,
  Sparkles,
  Eye,
} from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { parseVideoUrl } from "@/lib/video";
import type { Project } from "@/lib/cms";
import {
  Field,
  ImageInput,
  SaveButton,
  TextArea,
  TextInput,
  inputCls,
} from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/work")({ component: WorkAdmin });

const PLATFORMS = ["YouTube", "YouTube Shorts", "Instagram Reels", "TikTok", "Vimeo", "Direct MP4"];
type Draft = Partial<Project> & { title: string };
const EMPTY: Draft = { title: "", featured: true, published: true };

function WorkAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: async () => {
      try {
        const snap = await getDocs(query(collection(db, "projects"), orderBy("sort_order", "asc")));
        const projects: Project[] = [];
        snap.forEach((d) => {
          projects.push({
            id: d.id,
            ...(d.data() as Omit<Project, "id">),
          });
        });
        return projects;
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "projects");
      }
    },
  });

  const [edit, setEdit] = useState<Draft | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setBusy(true);
    const { id, created_at: _c, updated_at: _u, ...rest } = edit;
    const now = new Date().toISOString();
    const payload = {
      ...rest,
      client_name: rest.client_name || null,
      category: rest.category || null,
      description: rest.description || null,
      thumbnail_url: rest.thumbnail_url || null,
      video_url: rest.video_url || null,
      platform: rest.platform || null,
      views: rest.views || null,
      project_date: rest.project_date || null,
      featured: Boolean(rest.featured),
      published: Boolean(rest.published),
      updated_at: now,
    };

    try {
      if (id) {
        await updateDoc(doc(db, "projects", id), payload);
      } else {
        const newId = crypto.randomUUID();
        await setDoc(doc(db, "projects", newId), {
          ...payload,
          id: newId,
          sort_order: (data?.length ?? 0) + 1,
          created_at: now,
        });
      }
      toast.success(id ? "Video saved" : "Video added");
      setEdit(null);
      refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save video");
      handleFirestoreError(
        err,
        id ? OperationType.UPDATE : OperationType.CREATE,
        `projects/${id || ""}`,
      );
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, p: Partial<Project>, msg: string) {
    try {
      await updateDoc(doc(db, "projects", id), {
        ...p,
        updated_at: new Date().toISOString(),
      });
      toast.success(msg);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update video");
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this video?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      toast.success("Video deleted");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete video");
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  }

  async function move(i: number, dir: -1 | 1) {
    if (!data) return;
    const a = data[i],
      b = data[i + dir];
    if (!a || !b) return;
    try {
      await Promise.all([
        updateDoc(doc(db, "projects", a.id), { sort_order: b.sort_order }),
        updateDoc(doc(db, "projects", b.id), { sort_order: a.sort_order }),
      ]);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reorder");
      handleFirestoreError(error, OperationType.UPDATE, "projects");
    }
  }

  const set = (k: keyof Project) => (v: string) => {
    setEdit((d) => {
      if (!d) return null;
      const updated = { ...d, [k]: v };

      // Auto-detect platform from video URL if platform is empty
      if (k === "video_url" && v) {
        if (!d.platform) {
          if (v.includes("shorts")) updated.platform = "YouTube Shorts";
          else if (v.includes("youtube") || v.includes("youtu.be")) updated.platform = "YouTube";
          else if (v.includes("instagram.com")) updated.platform = "Instagram Reels";
          else if (v.includes("tiktok.com")) updated.platform = "TikTok";
          else if (v.includes("vimeo.com")) updated.platform = "Vimeo";
          else if (/\.(mp4|webm|mov)/i.test(v)) updated.platform = "Direct MP4";
        }

        // Auto-suggest thumbnail if empty
        const parsed = parseVideoUrl(v);
        if (parsed.suggestedThumbnail && !d.thumbnail_url) {
          updated.thumbnail_url = parsed.suggestedThumbnail;
        }
      }
      return updated;
    });
  };

  const parsedVideo = edit ? parseVideoUrl(edit.video_url) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl uppercase">Featured Work</h1>
          <p className="text-xs text-muted-foreground">
            Add showreel videos with direct video/YouTube links and custom thumbnails.
          </p>
        </div>
        <button
          onClick={() => setEdit({ ...EMPTY })}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground uppercase tracking-wide hover:bg-primary/90 transition-colors"
        >
          + Add Video
        </button>
      </div>

      {data && data.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center text-muted-foreground">
          <Play className="mx-auto h-8 w-8 text-primary/40" />
          <p className="mt-3 text-sm">No videos in your showreel yet.</p>
          <button
            onClick={() => setEdit({ ...EMPTY })}
            className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground uppercase"
          >
            Add First Video
          </button>
        </div>
      )}

      <div className="space-y-2">
        {data?.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-border/80"
          >
            <div className="flex flex-col">
              <button
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                className="p-1 text-muted-foreground hover:text-primary disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                aria-label="Move down"
                disabled={i === data.length - 1}
                onClick={() => move(i, 1)}
                className="p-1 text-muted-foreground hover:text-primary disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>

            {/* Thumbnail with quick preview trigger */}
            <div
              className="relative group/thumb h-16 w-10 shrink-0 cursor-pointer overflow-hidden rounded border border-border bg-background"
              onClick={() => setPreviewProject(p)}
              title="Click to preview video"
            >
              {p.thumbnail_url ? (
                <img
                  src={p.thumbnail_url}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform group-hover/thumb:scale-110"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-surface-2 text-[8px] text-muted-foreground">
                  No img
                </div>
              )}
              <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{p.title}</div>
              <div className="text-xs text-muted-foreground flex flex-wrap gap-1.5">
                {[p.platform, p.views && `${p.views} views`, p.client_name]
                  .filter(Boolean)
                  .join(" · ") || "Video"}
              </div>
            </div>

            {/* Preview Button */}
            {p.video_url && (
              <button
                type="button"
                onClick={() => setPreviewProject(p)}
                className="flex items-center gap-1 rounded border border-border/80 px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                title="Preview video"
              >
                <Eye className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            )}

            <button
              onClick={() =>
                patch(
                  p.id,
                  { published: !p.published },
                  p.published ? "Video unpublished" : "Video published",
                )
              }
              className={`rounded px-2 py-1 text-[10px] uppercase font-semibold transition-colors ${
                p.published
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {p.published ? "Published" : "Draft"}
            </button>
            <button
              aria-label="Edit"
              onClick={() => setEdit(p)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              aria-label="Delete"
              onClick={() => remove(p.id)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* QUICK VIDEO PREVIEW MODAL */}
      {previewProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="relative flex flex-col items-center max-h-[92vh] max-w-lg w-full rounded-2xl border border-border bg-surface p-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full items-center justify-between pb-3 border-b border-border">
              <div className="min-w-0 pr-4">
                <h3 className="truncate text-sm font-bold uppercase">{previewProject.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {[
                    previewProject.platform,
                    previewProject.views && `${previewProject.views} views`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <button
                onClick={() => setPreviewProject(null)}
                className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-surface-2 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 relative w-full aspect-[9/16] max-h-[70vh] rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {(() => {
                const p = parseVideoUrl(previewProject.video_url);
                if (p.type === "direct" && p.directUrl) {
                  return (
                    <video
                      src={p.directUrl}
                      poster={previewProject.thumbnail_url || undefined}
                      controls
                      autoPlay
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  );
                }
                if (p.embedUrl) {
                  return (
                    <iframe
                      src={
                        p.type === "youtube"
                          ? `https://www.youtube.com/embed/${p.id}?autoplay=1&controls=1`
                          : p.embedUrl
                      }
                      title={previewProject.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  );
                }
                return (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    <p>Unable to embed this video player directly.</p>
                    {previewProject.video_url && (
                      <a
                        href={previewProject.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs text-primary-foreground font-semibold"
                      >
                        Open in New Tab <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD MODAL FORM */}
      {edit && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm"
          onClick={() => setEdit(null)}
        >
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-full max-w-lg space-y-4 overflow-y-auto border-l border-border bg-background p-6"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg uppercase font-bold">
                {edit.id ? "Edit video" : "Add video"}
              </h2>
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="grid h-7 w-7 place-items-center rounded text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <TextInput label="Project title *" value={edit.title} onChange={set("title")} />

            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Client name"
                value={edit.client_name ?? ""}
                onChange={set("client_name")}
              />
              <TextInput
                label="Category (e.g. Fitness, Podcast)"
                value={edit.category ?? ""}
                onChange={set("category")}
              />
            </div>

            {/* VIDEO URL INPUT WITH LIVE PREVIEW */}
            <div className="space-y-2">
              <TextInput
                label="Video URL (YouTube, Shorts, Vimeo, or MP4) *"
                value={edit.video_url ?? ""}
                onChange={set("video_url")}
              />

              {/* LIVE VIDEO PREVIEW BOX */}
              {edit.video_url && parsedVideo && (
                <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Play className="h-3 w-3 text-primary" /> Live Video Preview
                    </span>
                    <span className="rounded bg-surface-2 px-2 py-0.5 text-[10px] text-primary uppercase font-mono">
                      {parsedVideo.type}
                    </span>
                  </div>

                  <div className="relative aspect-[9/16] max-h-64 w-full max-w-[180px] mx-auto rounded-lg overflow-hidden border border-border bg-black flex items-center justify-center shadow-md">
                    {parsedVideo.type === "direct" && parsedVideo.directUrl ? (
                      <video
                        src={parsedVideo.directUrl}
                        poster={edit.thumbnail_url || undefined}
                        controls
                        playsInline
                        className="h-full w-full object-contain"
                      />
                    ) : (parsedVideo.type === "youtube" || parsedVideo.type === "vimeo") &&
                      parsedVideo.embedUrl ? (
                      <iframe
                        src={parsedVideo.embedUrl}
                        title="Video Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        className="h-full w-full"
                      />
                    ) : (
                      <div className="p-3 text-center text-[11px] text-muted-foreground">
                        Preview ready upon saving or direct playback.
                      </div>
                    )}
                  </div>

                  {parsedVideo.suggestedThumbnail && !edit.thumbnail_url && (
                    <button
                      type="button"
                      onClick={() => set("thumbnail_url")(parsedVideo.suggestedThumbnail!)}
                      className="w-full flex items-center justify-center gap-1.5 rounded border border-primary/40 bg-primary/10 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Sparkles className="h-3 w-3" /> Auto-Use Video Thumbnail
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* THUMBNAIL INPUT (Accepts URL or File Upload with Live Preview) */}
            <ImageInput
              label="Thumbnail (Image URL or File Upload)"
              value={edit.thumbnail_url ?? ""}
              onChange={set("thumbnail_url")}
              folder="projects"
              placeholder="https://example.com/thumbnail.jpg"
            />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Platform">
                <select
                  className={inputCls}
                  value={edit.platform ?? ""}
                  onChange={(e) => set("platform")(e.target.value)}
                >
                  <option value="">— Select platform —</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <TextInput
                label="Views (e.g. 1.2M or 500K)"
                value={edit.views ?? ""}
                onChange={set("views")}
              />
            </div>

            <TextArea
              label="Short description / Notes"
              value={edit.description ?? ""}
              onChange={set("description")}
            />

            <TextInput
              label="Project date"
              type="date"
              value={edit.project_date ?? ""}
              onChange={set("project_date")}
            />

            <div className="flex gap-6 text-sm py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!edit.featured}
                  onChange={(e) => setEdit({ ...edit, featured: e.target.checked })}
                  className="rounded border-border accent-primary"
                />{" "}
                Featured in Showcase
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!edit.published}
                  onChange={(e) => setEdit({ ...edit, published: e.target.checked })}
                  className="rounded border-border accent-primary"
                />{" "}
                Published Live
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <SaveButton busy={busy} />
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="rounded-md border border-border px-5 py-2.5 text-sm hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
