import type { Metadata } from "next";
export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-4">⚠ Platzhalter — vor Veröffentlichung rechtlich prüfen lassen</p>
      <h1 className="text-4xl font-black tracking-tight mb-10">Impressum</h1>
      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-base mb-2">Angaben gemäß § 5 TMG</h2>
          <p>[Dein Name / Firmenname]<br/>[Straße Hausnummer]<br/>[PLZ Ort]<br/>Deutschland</p>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">Kontakt</h2>
          <p>E-Mail: info@donstore.de<br/>Website: www.donstore.de</p>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">Umsatzsteuer-Identifikationsnummer</h2>
          <p>DE[UMSATZSTEUER-ID]</p>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">Streitschlichtung</h2>
          <p>Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht verpflichtet, an einem Streitbeilegungsverfahren teilzunehmen.</p>
        </section>
      </div>
    </div>
  );
}
