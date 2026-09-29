import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/cms";

export const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs tracking-wider text-muted-foreground uppercase">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <Field label={label}>
      <input
        type={type}
        className={inputCls}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <textarea
        rows={4}
        className={inputCls}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function ImageInput({
  label,
  value,
  onChange,
  folder,
  placeholder = "https://example.com/thumbnail.jpg",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
  placeholder?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"url" | "upload">("url");

  return (
    <Field label={label}>
      <div className="space-y-3">
        {/* URL / Upload Mode Switch */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                mode === "url"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                mode === "upload"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Upload File
            </button>
          </div>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Input Field / File Uploader */}
        {mode === "url" ? (
          <input
            type="url"
            className={inputCls}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value.trim())}
          />
        ) : (
          <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground hover:border-primary transition-colors">
            {busy ? "Uploading file to storage…" : "Click or tap to choose an image file"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBusy(true);
                try {
                  const url = await uploadMedia(file, folder);
                  onChange(url);
                  toast.success("Image uploaded successfully");
                } catch (err) {
                  toast.error((err as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
        )}

        {/* Live Thumbnail Preview */}
        {value && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 p-2.5">
            <img
              src={value}
              alt="Thumbnail preview"
              className="h-16 w-12 rounded object-cover border border-border bg-background"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='64' viewBox='0 0 48 64'%3E%3Crect width='48' height='64' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' fill='%23888' font-size='8' text-anchor='middle' dy='.3em'%3EBroken%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                Live Thumbnail Preview
              </span>
              <p className="truncate text-xs text-muted-foreground">{value}</p>
            </div>
          </div>
        )}
      </div>
    </Field>
  );
}

export function SaveButton({
  busy,
  children = "Save changes",
}: {
  busy?: boolean;
  children?: ReactNode;
}) {
  return (
    <button
      disabled={busy}
      className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
    >
      {busy ? "Saving…" : children}
    </button>
  );
}
