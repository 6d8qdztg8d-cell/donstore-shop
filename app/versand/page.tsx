import type { Metadata } from "next";
export const metadata: Metadata = { title: "Versand & Rückgabe" };

export default function VersandPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-black tracking-tight mb-10">Versand & Rückgabe</h1>
      <div className="prose max-w-none text-gray-700 leading-relaxed space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3">Versandzeiten</h2>
          <p>Bestellungen, die vor 14:00 Uhr eingehen, werden noch am selben Werktag verschickt.</p>
          <ul className="mt-3 space-y-1 list-disc list-inside">
            <li><strong>Standard:</strong> 2–4 Werktage (Deutschland, Österreich, Schweiz)</li>
            <li><strong>Express:</strong> 1–2 Werktage (gegen Aufpreis)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">Versandkosten</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>Kostenloser Versand ab einem Bestellwert von <strong>60 €</strong></li>
            <li>Standardversand: <strong>4,99 €</strong></li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">Rückgabe</h2>
          <p>Du kannst Artikel innerhalb von <strong>30 Tagen</strong> nach Erhalt zurückgeben. Voraussetzung: ungetragen, in Originalverpackung.</p>
          <p className="mt-2">Für die Rückgabe schreibe an: <a href="mailto:returns@donstore.de" className="underline">returns@donstore.de</a></p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">Widerrufsrecht</h2>
          <p>Als Verbraucher hast du das Recht, innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen. Die Frist beginnt mit Erhalt der Ware.</p>
        </section>
      </div>
    </div>
  );
}
