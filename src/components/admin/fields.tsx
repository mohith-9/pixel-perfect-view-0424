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

export function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <Field label={label}>
      <input type={type} className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <textarea rows={4} className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function ImageInput({ label, value, onChange, folder }: { label: string; value: string; onChange: (v: string) => void; folder: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-20 w-16 rounded border border-border object-cover" />
        ) : (
          <div className="grid h-20 w-16 place-items-center rounded border border-dashed border-border text-[10px] text-muted-foreground">None</div>
        )}
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary">
            {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBusy(true);
                try {
                  onChange(await uploadMedia(file, folder));
                  toast.success("Image uploaded");
                } catch (err) {
                  toast.error((err as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-left text-xs text-muted-foreground hover:text-primary">
              Remove
            </button>
          )}
        </div>
      </div>
    </Field>
  );
}

export function SaveButton({ busy, children = "Save changes" }: { busy?: boolean; children?: ReactNode }) {
  return (
    <button disabled={busy} className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
      {busy ? "Saving…" : children}
    </button>
  );
}
