import { Fragment } from "react";

const linkPattern = /([\w.+-]+@[\w-]+\.[\w.-]+|https?:\/\/[^\s]+)/g;

/** Renders text typed in the CMS: e-mail addresses and web links become clickable. */
export function Linkified({ text }: { text: string }) {
  return text.split(linkPattern).map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
    const trailing = part.match(/[.,;:!?)]+$/)?.[0] ?? "";
    const value = trailing ? part.slice(0, -trailing.length) : part;
    const href = value.includes("@") && !value.startsWith("http") ? `mailto:${value}` : value;
    return <Fragment key={index}><a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>{value}</a>{trailing}</Fragment>;
  });
}

export function paragraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export function RichText({ text, className }: { text: string; className?: string }) {
  return paragraphs(text).map((paragraph, index) => <p key={index} className={className}><Linkified text={paragraph} /></p>);
}

/** Single-line field that may contain manual line breaks (e.g. poster titles). */
export function Lines({ text }: { text: string }) {
  return text.split("\n").map((line, index) => <Fragment key={index}>{index > 0 && <br />}{line}</Fragment>);
}
