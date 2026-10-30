/** Declarative form definitions. Plain data, so server pages can pass them to the client form. */

export type Option = { value: string; label: string; groups?: string[] };

type Base = { name: string; label: string; help?: string; required?: boolean };

export type Field =
  | (Base & { type: "text" | "email" | "date" | "time"; placeholder?: string })
  | (Base & { type: "textarea"; rows?: number; placeholder?: string })
  | (Base & { type: "number"; min?: number })
  | (Base & { type: "toggle" })
  | (Base & { type: "select"; options: Option[]; placeholder?: string; filterBy?: string })
  | (Base & { type: "checkboxes"; options: Option[] })
  | (Base & { type: "image" })
  | (Base & { type: "group"; fields: Field[] })
  | (Base & {
    type: "list";
    fields: Field[];
    itemLabel: string;
    addLabel: string;
    newItem: Record<string, unknown>;
    titleField?: string;
    layout?: "cards" | "grid";
    /** Name of the image field: shows an "add several photos" button that creates one item per photo. */
    bulkImages?: string;
  })
  | { type: "section"; name?: undefined; label: string; help?: string; anchor?: string };

export type FormValues = Record<string, unknown>;
