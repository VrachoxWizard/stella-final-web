"use client";

import { useForm } from "@formspree/react";
import { useState } from "react";

export function ContactForm() {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
  const [state, handleFormspree] = useForm(formId || "placeholder");
  const [localSuccess, setLocalSuccess] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!data.get("consent")) { setConsentError(true); return; }
    setConsentError(false);
    if (formId) await handleFormspree(event);
    else { setLocalSuccess(true); form.reset(); }
  };

  const succeeded = state.succeeded || localSuccess;
  return <form className="contact-form" onSubmit={onSubmit} noValidate>
    <span className="eyebrow">Pošaljite poruku</span>
    <h2>Čujemo se na terenu.</h2>
    <div className="field-grid">
      <div className="field"><label htmlFor="name">Ime i prezime</label><input id="name" name="name" autoComplete="name" required /></div>
      <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
    </div>
    <div className="field"><label htmlFor="message">Poruka</label><textarea id="message" name="message" required /></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="company">Tvrtka</label><input id="company" name="company" tabIndex={-1} autoComplete="off" /></div>
    <label className="consent"><input name="consent" type="checkbox" value="da" /><span>Slažem se da Tina Šport–Pia upotrijebi ove podatke isključivo za odgovor na moj upit.</span></label>
    {consentError && <p className="field-error" role="alert">Za slanje poruke potrebno je prihvatiti obradu podataka.</p>}
    {state.errors && Object.keys(state.errors).length > 0 && <p className="form-message error" role="alert">Poruku trenutačno nije moguće poslati. Pokušajte ponovno ili nam se javite e-mailom.</p>}
    {succeeded && <p className="form-message" role="status">Hvala! Vaša poruka je spremna za naš tim.</p>}
    <button className="button" type="submit" disabled={state.submitting}>{state.submitting ? "Šaljem…" : "Pošalji poruku"}</button>
  </form>;
}
