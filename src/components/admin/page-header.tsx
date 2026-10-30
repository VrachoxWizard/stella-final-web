import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageHeader({ title, text, back, children }: { title: string; text?: string; back?: { href: string; label: string }; children?: React.ReactNode }) {
  return <>
    {back && <Link className="cms-back" href={back.href}><ChevronLeft size={18} aria-hidden="true" /> {back.label}</Link>}
    <div className="cms-page-header"><div><h1>{title}</h1>{text && <p>{text}</p>}</div>{children}</div>
  </>;
}
