export function SavedNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return <p role="status" className="cms-message cms-message--ok cms-saved">Spremljeno! Promjene će biti vidljive na stranici za otprilike 2 minute.</p>;
}
