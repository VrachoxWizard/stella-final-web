import Link from "next/link";
import { CalendarClock } from "lucide-react";

export function CompetitionEmptyState({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`competition-empty-state${compact ? " compact" : ""}`} role="status">
      <span className="competition-empty-icon" aria-hidden="true"><CalendarClock /></span>
      <div>
        <span className="eyebrow">Natjecanje · uskoro</span>
        <h3>Raspored još nije objavljen.</h3>
        <p>Termini i parovi pojavit će se ovdje čim budu službeno potvrđeni.</p>
      </div>
      {!compact && <Link className="button button-small" href="/kontakt">Kontaktirajte nas</Link>}
    </div>
  );
}
