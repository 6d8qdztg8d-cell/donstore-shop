import type { Metadata } from "next";
export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-semibold tracking-widest uppercase text-red-500 mb-4">⚠ Platzhalter — vor Veröffentlichung rechtlich prüfen lassen</p>
      <h1 className="text-4xl font-black tracking-tight mb-10">Datenschutzerklärung</h1>
      <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
        <p>Der Schutz deiner persönlichen Daten ist uns ein wichtiges Anliegen. Diese Datenschutzerklärung informiert dich über die Verarbeitung personenbezogener Daten beim Besuch unseres Online-Shops.</p>
        <section>
          <h2 className="font-bold text-base mb-2">Verantwortlicher</h2>
          <p>[Name/Firma], [Adresse], E-Mail: info@donstore.de</p>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">Welche Daten wir erfassen</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Name, E-Mail, Lieferadresse bei Bestellungen</li>
            <li>Zahlungsdaten (verarbeitet durch Stripe)</li>
            <li>E-Mail-Adresse bei Newsletter-Anmeldung</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">Zahlungsdienstleister</h2>
          <p>Zahlungen werden über Stripe verarbeitet. Datenschutzerklärung: stripe.com/de/privacy</p>
        </section>
        <section>
          <h2 className="font-bold text-base mb-2">Deine Rechte</h2>
          <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung. Wende dich dafür an: info@donstore.de</p>
        </section>
      </div>
    </div>
  );
}
