import Link from "next/link";
import { CalendarClock } from "lucide-react";

type EmptyStateText = { eyebrow: string; title: string; text: string };

const defaultText: EmptyStateText = {
  eyebrow: "Natjecanje · uskoro",
  title: "Raspored još nije objavljen.",
  text: "Termini i parovi pojavit će se ovdje čim budu službeno potvrđeni.",
};

export function CompetitionEmptyState({ compact = false, content = defaultText }: { compact?: boolean; content?: EmptyStateText }) {
  return (
    <div className={`competition-empty-state${compact ? " compact" : ""}`} role="status">
      <span className="competition-empty-icon" aria-hidden="true"><CalendarClock /></span>
      <div>
        {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
        <h3>{content.title}</h3>
        {content.text && <p>{content.text}</p>}
      </div>
      {!compact && <Link className="button button-small" href="/kontakt">Kontaktirajte nas</Link>}
    </div>
  );
}
