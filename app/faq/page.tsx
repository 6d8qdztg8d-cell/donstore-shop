import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ", description: "Häufig gestellte Fragen zu Donstore Grip Socks." };

const FAQ = [
  { q: "Welche Größen gibt es?", a: "Donstore Grip Socks sind in zwei Größen erhältlich: 39–42 (S/M) und 43–46 (L/XL)." },
  { q: "Welche Farben sind verfügbar?", a: "Aktuell bieten wir die Classic White Edition mit schwarzem Donstore Logo an." },
  { q: "Für welche Sportarten sind die Socken geeignet?", a: "Perfekt für Fußball, Futsal, Fitness, Gym und den Alltag. Überall wo Halt und Komfort wichtig sind." },
  { q: "Wie wasche ich die Grip Socks?", a: "Maschinenwaschbar bei max. 40°C. Kein Trockner, kein Bügeln. Die Grip-Punkte bleiben so länger erhalten." },
  { q: "Wie lange hält der Grip?", a: "Bei richtiger Pflege bleiben die Grip-Punkte viele Monate wirksam. Wir empfehlen mindestens 2 Paar für abwechselnde Nutzung." },
  { q: "Wie lange dauert die Lieferung?", a: "Standard: 2–4 Werktage nach Deutschland, Österreich, Schweiz. Express: 1–2 Werktage." },
  { q: "Gibt es kostenlosen Versand?", a: "Ja! Ab einem Bestellwert von 60 € versenden wir kostenlos. Darunter berechnen wir 4,99 € Versandkosten." },
  { q: "Wie funktioniert die Rückgabe?", a: "Du hast 30 Tage Rückgaberecht ab Erhalt. Ungetragene Artikel können kostenlos zurückgesendet werden." },
  { q: "Welche Zahlungsarten werden akzeptiert?", a: "Wir akzeptieren Kreditkarte (Visa, Mastercard), PayPal und weitere gängige Zahlungsmethoden über Stripe." },
  { q: "Ist meine Zahlung sicher?", a: "Ja. Die gesamte Zahlung wird über Stripe abgewickelt – einem der sichersten Zahlungsdienstleister weltweit." },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-black tracking-tight mb-3">FAQ</h1>
      <p className="text-gray-500 mb-12">Häufig gestellte Fragen. Nicht gefunden was du suchst? <a href="/kontakt" className="underline hover:text-black">Kontaktiere uns.</a></p>
      <dl className="divide-y divide-gray-200 border-t border-gray-200">
        {FAQ.map((item) => (
          <div key={item.q} className="py-6">
            <dt className="font-bold text-base mb-2">{item.q}</dt>
            <dd className="text-gray-600 leading-relaxed">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
