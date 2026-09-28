import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { contentQuery, saveContent, type HeroContent } from "@/lib/cms";
import { ImageInput, SaveButton, TextArea, TextInput } from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/hero")({ component: HeroAdmin });

function HeroAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery(contentQuery("hero"));
  const [h, setH] = useState<HeroContent | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data && !h) setH(data); }, [data, h]);
  if (!h) return <p className="text-muted-foreground">Loading…</p>;
  const set = (k: keyof HeroContent) => (v: string) => setH({ ...h, [k]: v });

  return (
    <form
      className="max-w-3xl space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await saveContent("hero", h);
          await qc.invalidateQueries({ queryKey: ["site_content", "hero"] });
          toast.success("Saved successfully");
        } catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
      }}
    >
      <h1 className="text-2xl uppercase">Hero</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Small heading" value={h.small_heading} onChange={set("small_heading")} />
        <TextInput label="Background text" value={h.background_text} onChange={set("background_text")} />
        <TextInput label="Name (line 1)" value={h.name_line1} onChange={set("name_line1")} />
        <TextInput label="Name (line 2)" value={h.name_line2} onChange={set("name_line2")} />
        <TextInput label="Role" value={h.role} onChange={set("role")} />
        <TextInput label="Tagline" value={h.tagline} onChange={set("tagline")} />
      </div>
      <TextArea label="Description" value={h.description} onChange={set("description")} />
      <ImageInput label="Hero image (leave empty to keep current photo)" value={h.image_url} onChange={set("image_url")} folder="hero" />
      <div>
        <h2 className="mb-3 text-sm uppercase">Stats</h2>
        <div className="space-y-3">
          {h.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-3 gap-3">
              {(["value", "label1", "label2"] as const).map((k) => (
                <TextInput key={k} label={k === "value" ? "Number" : k === "label1" ? "Label line 1" : "Label line 2"} value={s[k]}
                  onChange={(v) => setH({ ...h, stats: h.stats.map((x, j) => (j === i ? { ...x, [k]: v } : x)) })} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Primary button text" value={h.primary_cta_text} onChange={set("primary_cta_text")} />
        <TextInput label="Primary button link" value={h.primary_cta_link} onChange={set("primary_cta_link")} />
        <TextInput label="Secondary button text" value={h.secondary_cta_text} onChange={set("secondary_cta_text")} />
        <TextInput label="Secondary button link" value={h.secondary_cta_link} onChange={set("secondary_cta_link")} />
      </div>
      <SaveButton busy={busy} />
    </form>
  );
}
