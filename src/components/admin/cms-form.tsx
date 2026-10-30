"use client";

import { useRouter } from "next/navigation";
import { createContext, useActionState, useContext, useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { AdminImage } from "@/components/admin/admin-context";
import type { Field, FormValues, Option } from "@/components/admin/fields";
import { newUploadKey, prepareImage } from "@/components/admin/image-tools";

export type ActionResult = { ok: boolean; message: string; redirectTo?: string };
type Action = (previous: ActionResult | null, formData: FormData) => Promise<ActionResult>;
type Path = Array<string | number>;
type Uploads = Map<string, { file: File; preview: string }>;

const MAX_REQUEST_BYTES = 3.8 * 1024 * 1024;

/** Counts photos still being shrunk, so the form cannot be saved half-way. */
const Processing = createContext<(delta: number) => void>(() => {});

function getAt(values: unknown, path: Path): unknown {
  return path.reduce<unknown>((current, key) => (current as Record<string | number, unknown> | undefined)?.[key], values);
}

function setAt<T>(values: T, path: Path, value: unknown): T {
  if (!path.length) return value as T;
  const [key, ...rest] = path;
  const copy = (Array.isArray(values) ? [...values] : { ...(values as object) }) as Record<string | number, unknown>;
  copy[key] = setAt(copy[key], rest, value);
  return copy as T;
}

function collectUploadKeys(value: unknown, keys = new Set<string>()) {
  if (Array.isArray(value)) value.forEach((item) => collectUploadKeys(item, keys));
  else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.upload === "string") keys.add(record.upload);
    Object.values(record).forEach((item) => collectUploadKeys(item, keys));
  }
  return keys;
}

export function CmsForm({ fields, initial, action, submitLabel = "Spremi promjene" }: { fields: Field[]; initial: FormValues; action: Action; submitLabel?: string }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(initial);
  const [dirty, setDirty] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploads] = useState<Uploads>(() => new Map());
  const [processing, setProcessing] = useState(0);
  const [result, formAction, saving] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const next = await action(previous, formData);
    if (next.ok) setDirty(false);
    return next;
  }, null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!result?.ok) return;
    if (result.redirectTo) router.push(result.redirectTo);
    else router.refresh();
  }, [result, router]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (path: Path, value: unknown) => {
    // A function receives the latest value, e.g. to append photos that finished processing.
    setValues((current) => setAt(current, path, typeof value === "function" ? value(getAt(current, path)) : value));
    setDirty(true);
    setLocalError(null);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const formData = new FormData();
    formData.set("payload", JSON.stringify(values));
    let size = 0;
    for (const key of collectUploadKeys(values)) {
      const upload = uploads.get(key);
      if (!upload) continue;
      formData.set(`upload:${key}`, upload.file);
      size += upload.file.size;
    }
    if (size > MAX_REQUEST_BYTES) {
      setLocalError("Odjednom ste dodali previše novih slika. Uklonite nekoliko, spremite, pa dodajte ostale.");
      return;
    }
    startTransition(() => formAction(formData));
  };

  const message = localError ? { ok: false, message: localError } : !dirty || !result?.ok ? result : null;

  return <form className="cms-form" onSubmit={submit} noValidate={false}>
    <Processing.Provider value={(delta) => setProcessing((count) => count + delta)}>
      <FieldList fields={fields} values={values} root={values} path={[]} update={update} uploads={uploads} />
    </Processing.Provider>
    <div className="cms-savebar">
      <button className="cms-button cms-button--primary" type="submit" disabled={saving || processing > 0}>{saving ? "Spremam…" : processing > 0 ? "Pričekajte, obrađujem slike…" : submitLabel}</button>
      {dirty && !saving && <span className="cms-hint">Imate nespremljene promjene.</span>}
      {message && <p role="status" className={`cms-message ${message.ok ? "cms-message--ok" : "cms-message--error"}`}>{message.message}</p>}
    </div>
  </form>;
}

type FieldProps = { values: FormValues; root: FormValues; path: Path; update: (path: Path, value: unknown) => void; uploads: Uploads };

function FieldList({ fields, ...props }: FieldProps & { fields: Field[] }) {
  return <>{fields.map((field, index) => <FieldInput key={field.name ?? `section-${index}`} field={field} {...props} />)}</>;
}

function Label({ field, htmlFor }: { field: Field; htmlFor?: string }) {
  return <>
    <label className="cms-label" htmlFor={htmlFor}>{field.label}{"required" in field && field.required && <span className="cms-required" aria-hidden="true"> *</span>}</label>
    {field.help && <p className="cms-help">{field.help}</p>}
  </>;
}

function filteredOptions(options: Option[], filterBy: string | undefined, root: FormValues) {
  if (!filterBy) return options;
  const value = root[filterBy];
  if (typeof value !== "string" || !value) return options;
  return options.filter((option) => !option.groups || option.groups.includes(value));
}

function FieldInput({ field, values, root, path, update, uploads }: FieldProps & { field: Field }) {
  if (field.type === "section") {
    return <div className="cms-section-title" id={field.anchor}><h2>{field.label}</h2>{field.help && <p>{field.help}</p>}</div>;
  }

  const fieldPath = [...path, field.name];
  const id = `f-${fieldPath.join("-")}`;
  const value = getAt(values, [field.name]);

  switch (field.type) {
    case "text":
    case "email":
    case "date":
    case "time":
      return <div className="cms-field"><Label field={field} htmlFor={id} /><input id={id} className="cms-input" type={field.type} required={field.required} placeholder={field.placeholder} value={(value as string) ?? ""} onChange={(event) => update(fieldPath, event.target.value)} /></div>;
    case "textarea":
      return <div className="cms-field"><Label field={field} htmlFor={id} /><textarea id={id} className="cms-input" rows={field.rows ?? 4} required={field.required} placeholder={field.placeholder} value={(value as string) ?? ""} onChange={(event) => update(fieldPath, event.target.value)} /></div>;
    case "number":
      return <div className="cms-field cms-field--short"><Label field={field} htmlFor={id} /><input id={id} className="cms-input" type="number" inputMode="numeric" min={field.min ?? 0} step={1} required={field.required} value={value === undefined || value === null ? "" : String(value)} onChange={(event) => update(fieldPath, event.target.value === "" ? null : Number(event.target.value))} /></div>;
    case "toggle":
      return <div className="cms-field"><label className="cms-toggle"><input type="checkbox" checked={Boolean(value)} onChange={(event) => update(fieldPath, event.target.checked)} /><span className="cms-toggle-track" aria-hidden="true" /><span className="cms-toggle-text">{field.label}</span></label>{field.help && <p className="cms-help">{field.help}</p>}</div>;
    case "select": {
      const options = filteredOptions(field.options, field.filterBy, root);
      return <div className="cms-field"><Label field={field} htmlFor={id} /><select id={id} className="cms-input" required={field.required} value={(value as string) ?? ""} onChange={(event) => update(fieldPath, event.target.value)}>
        <option value="">{field.placeholder ?? "— odaberite —"}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select></div>;
    }
    case "checkboxes": {
      const selected = new Set((value as string[] | undefined) ?? []);
      return <fieldset className="cms-field"><legend className="cms-label">{field.label}</legend>{field.help && <p className="cms-help">{field.help}</p>}<div className="cms-checkboxes">{field.options.map((option) => <label key={option.value} className="cms-check"><input type="checkbox" checked={selected.has(option.value)} onChange={(event) => {
        const next = new Set(selected);
        if (event.target.checked) next.add(option.value); else next.delete(option.value);
        update(fieldPath, field.options.map(({ value: optionValue }) => optionValue).filter((optionValue) => next.has(optionValue)));
      }} />{option.label}</label>)}</div></fieldset>;
    }
    case "image":
      return <ImageField field={field} value={value} path={fieldPath} update={update} uploads={uploads} />;
    case "group":
      return <fieldset className="cms-group"><legend>{field.label}</legend>{field.help && <p className="cms-help">{field.help}</p>}<FieldList fields={field.fields} values={(value as FormValues) ?? {}} root={root} path={fieldPath} update={update} uploads={uploads} /></fieldset>;
    case "list":
      return <ListField field={field} items={(value as FormValues[]) ?? []} root={root} path={fieldPath} update={update} uploads={uploads} />;
  }
}

type ImageValue = { src?: string; upload?: string; name?: string; width: number; height: number } | null | undefined;

function ImageField({ field, value, path, update, uploads }: { field: Field & { type: "image" }; value: unknown; path: Path; update: (path: Path, value: unknown) => void; uploads: Uploads }) {
  const image = value as ImageValue;
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const track = useContext(Processing);
  const preview = image?.upload ? uploads.get(image.upload)?.preview : image?.src;

  return <div className="cms-field"><Label field={field} />
    <div className="cms-image">
      {preview ? <AdminImage src={preview} alt="" className="cms-image-preview" /> : <div className="cms-image-empty">Nema slike</div>}
      <div className="cms-image-actions">
        <label className="cms-button">
          <ImagePlus size={18} aria-hidden="true" /> {busy ? "Obrađujem…" : preview ? "Zamijeni sliku" : "Odaberi sliku"}
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setBusy(true); setError(null); track(1);
            try {
              const prepared = await prepareImage(file);
              const key = newUploadKey();
              uploads.set(key, { file: prepared.file, preview: prepared.preview });
              update(path, { upload: key, name: prepared.file.name, width: prepared.width, height: prepared.height });
            } catch (problem) {
              setError(problem instanceof Error ? problem.message : "Slika se nije uspjela učitati.");
            } finally { setBusy(false); track(-1); }
          }} />
        </label>
        {preview && !field.required && <button type="button" className="cms-button cms-button--ghost" onClick={() => update(path, null)}>Ukloni sliku</button>}
      </div>
    </div>
    {error && <p className="cms-message cms-message--error">{error}</p>}
  </div>;
}

function ListField({ field, items, root, path, update, uploads }: { field: Field & { type: "list" }; items: FormValues[]; root: FormValues; path: Path; update: (path: Path, value: unknown) => void; uploads: Uploads }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const track = useContext(Processing);
  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(path, next);
  };
  const newItem = () => ({ ...field.newItem, ...("id" in field.newItem ? { id: newUploadKey() } : {}) });

  return <div className="cms-list">
    <div className="cms-list-header"><h3>{field.label}</h3>{field.help && <p className="cms-help">{field.help}</p>}</div>
    {field.bulkImages && <div className="cms-bulk">
      <label className="cms-button cms-button--primary">
        <ImagePlus size={18} aria-hidden="true" /> {busy ? "Obrađujem slike…" : "Dodaj fotografije"}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={async (event) => {
          const files = [...(event.target.files ?? [])];
          event.target.value = "";
          if (!files.length) return;
          setBusy(true); setError(null); track(1);
          const added: FormValues[] = [];
          for (const file of files) {
            try {
              const prepared = await prepareImage(file);
              const key = newUploadKey();
              uploads.set(key, { file: prepared.file, preview: prepared.preview });
              added.push({ ...newItem(), [field.bulkImages!]: { upload: key, name: prepared.file.name, width: prepared.width, height: prepared.height } });
            } catch (problem) {
              setError(problem instanceof Error ? problem.message : "Neke slike se nisu uspjele učitati.");
            }
          }
          update(path, (latest: FormValues[] | undefined) => [...added, ...(latest ?? [])]);
          setBusy(false); track(-1);
        }} />
      </label>
      <p className="cms-help">Možete odabrati više fotografija odjednom. Nove fotografije pojavit će se na vrhu popisa. Ne zaboravite upisati opis i kliknuti „Spremi promjene”.</p>
    </div>}
    {error && <p className="cms-message cms-message--error">{error}</p>}
    {!items.length && <p className="cms-empty">Još nema nijedne stavke.</p>}
    <div className={field.layout === "grid" ? "cms-list-grid" : "cms-list-cards"}>
      {items.map((item, index) => {
        const title = field.titleField ? String(item[field.titleField] ?? "").split("\n")[0] : "";
        return <div className="cms-card" key={(item.id as string) ?? index}>
          <div className="cms-card-header">
            <strong>{title || `${field.itemLabel} ${index + 1}`}</strong>
            <div className="cms-card-tools">
              <button type="button" className="cms-icon-button" disabled={index === 0} onClick={() => move(index, index - 1)} aria-label="Pomakni gore" title="Pomakni gore"><ArrowUp size={18} /></button>
              <button type="button" className="cms-icon-button" disabled={index === items.length - 1} onClick={() => move(index, index + 1)} aria-label="Pomakni dolje" title="Pomakni dolje"><ArrowDown size={18} /></button>
              <button type="button" className="cms-icon-button cms-icon-button--danger" onClick={() => { if (window.confirm(`Obrisati: ${title || field.itemLabel}?`)) update(path, items.filter((_, other) => other !== index)); }} aria-label="Obriši" title="Obriši"><Trash2 size={18} /></button>
            </div>
          </div>
          <FieldList fields={field.fields} values={item} root={root} path={[...path, index]} update={update} uploads={uploads} />
        </div>;
      })}
    </div>
    {!field.bulkImages && <button type="button" className="cms-button" onClick={() => update(path, [...items, newItem()])}><Plus size={18} aria-hidden="true" /> {field.addLabel}</button>}
  </div>;
}
