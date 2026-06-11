import type { Metadata } from "next";
export const metadata: Metadata = { title: "AGB" };

export default function AGBPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-4">⚠ Platzhalter — vor Veröffentlichung rechtlich prüfen lassen</p>
      <h1 className="text-4xl font-black tracking-tight mb-10">Allgemeine Geschäftsbedingungen</h1>
      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-base mb-2">§ 1 Geltungsbereich</h2>
          <p>Diese AGB gelten für alle Bestellungen über unseren Online-Shop Donstore.</p>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">§ 2 Vertragsschluss</h2>
          <p>Mit dem Absenden einer Bestellung gibst du ein verbindliches Angebot ab. Der Vertrag kommt mit unserer Auftragsbestätigung per E-Mail zustande.</p>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">§ 3 Preise und Zahlung</h2>
          <p>Alle Preise sind Endpreise inklusive Mehrwertsteuer. Zahlung über Stripe (Kreditkarte, PayPal).</p>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">§ 4 Widerrufsrecht</h2>
          <p>Verbrauchern steht ein 14-tägiges Widerrufsrecht zu. Details: siehe Versand & Rückgabe.</p>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">§ 5 Gerichtsstand</h2>
          <p>Es gilt deutsches Recht. Gerichtsstand ist [Dein Ort], soweit gesetzlich zulässig.</p>
        </section>
      </div>
    </div>
  );
}
