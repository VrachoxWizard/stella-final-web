# Produkcijski prijelaz: Vercel + WordPress arhiva

Prijelaz domene provodi se tek nakon uspješnog preview i produkcijskog Vercel builda te izričite potvrde vlasnika. Ništa se ne briše sa starog hostinga tijekom prvih 30 dana.

## 1. Priprema

1. Potvrditi zadnji JetBackup i spremiti izvoz DNS zone.
2. Na TotoHostu kreirati `arhiva.mnk-tinasport.hr` i `media.mnk-tinasport.hr` prema postojećem serveru.
3. Produkcijski WordPress učiniti dostupnim na `arhiva`; postojeće uploadove izložiti kroz `media`.
4. Provjeriti HTTPS te uzorak fotografija, svih 16 videa, PDF i ODS dokument.
5. Ne brisati produkcijsku ni staging instalaciju.

## 2. Vercel i TinaCloud

1. Vercel preset: Next.js; bez Output Directory; Build `npm run build`; Install `npm install`; Production Branch `main`.
2. Dodati `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `NEXT_PUBLIC_TINA_BRANCH`, `NEXT_PUBLIC_FORMSPREE_FORM_ID` i `NEXT_PUBLIC_SITE_URL` za Preview i Production.
3. Povezati TinaCloud samo s repozitorijem `VrachoxWizard/stella-final-web` i najviše dva urednika.
4. Potvrditi `/admin`, spremanje skice i spremanje javne testne utakmice.
5. Najprije potvrditi preview, zatim produkcijski Vercel URL bez domene.

## 3. DNS bez prekida pošte

1. Zadržati TotoHost nameservere.
2. Dodati `arhiva` i `media` A zapise prema starom serveru.
3. `mail` promijeniti iz CNAME-a u A zapis prema starom serveru.
4. MX prebaciti s apex domene na `mail.mnk-tinasport.hr`.
5. CalDAV/CardDAV zapise koji ciljaju apex prebaciti na `mail.mnk-tinasport.hr`.
6. Ne mijenjati DKIM ni ostale TXT zapise.
7. Domene dodati u Vercel i koristiti isključivo A/CNAME vrijednosti koje Vercel prikaže za projekt.
8. Promijeniti apex A i `www` CNAME; apex postaviti kao primarnu domenu.
9. Pričekati SSL pa provjeriti apex, `www`, `arhiva`, `media`, `/admin`, sitemap, robots i stare rute.
10. Testirati slanje i primanje na obje domenske adrese, webmail, SPF, DKIM i MX.

## 4. Rollback

- Vratiti apex A na stari TotoHost IP i `www` CNAME na apex.
- Nove samostalne mail zapise ostaviti jer su kompatibilni sa starim hostingom.
- Kod problema sa sadržajem revertati odgovarajući Git commit; prethodni uspješni Vercel deployment ostaje aktivan.

## 5. Nakon stabilizacije

- Nakon najmanje 30 dana izraditi statičku kopiju arhive i zasebno odlučiti o gašenju WordPress PHP dijela.
- Promijeniti cPanel/FTP lozinku podijeljenu tijekom migracije, uključiti cPanel 2FA i izraditi ograničeni FTP račun.
