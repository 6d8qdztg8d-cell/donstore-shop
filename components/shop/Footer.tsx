import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <p className="font-bold text-2xl tracking-tight mb-3">DONSTORE</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Performance-Ausrüstung für Athleten. Grip. Komfort. Kontrolle.
            </p>
          </div>
          <nav aria-label="Shop">
            <p className="font-semibold text-xs tracking-widest uppercase mb-4 text-gray-400">Shop</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/produkte" className="hover:text-white transition-colors">Alle Produkte</Link></li>
              <li><Link href="/produkte/donstore-grip-socks" className="hover:text-white transition-colors">Grip Socks</Link></li>
            </ul>
          </nav>
          <nav aria-label="Service">
            <p className="font-semibold text-xs tracking-widest uppercase mb-4 text-gray-400">Service</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/versand" className="hover:text-white transition-colors">Versand & Rückgabe</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </nav>
          <nav aria-label="Rechtliches">
            <p className="font-semibold text-xs tracking-widest uppercase mb-4 text-gray-400">Rechtliches</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 Donstore. Alle Rechte vorbehalten.</p>
          <p className="flex items-center gap-2">
            <span>Zahlung mit</span>
            <span className="text-white font-medium">Stripe</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
