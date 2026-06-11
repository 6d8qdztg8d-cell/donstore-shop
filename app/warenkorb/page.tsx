"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

function fmt(n: number) { return n.toFixed(2).replace(".", ",") + " €"; }

export default function WarenkorbSeite() {
  const { items, removeItem, updateQty, getSubtotal, getTotal, discountCode, discountAmount, setDiscount } = useCartStore();
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 60 ? 0 : subtotal > 0 ? 4.99 : 0;
  const total = getTotal();

  async function applyCode() {
    setCodeError("");
    setCodeLoading(true);
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput.trim().toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { setCodeError(data.error ?? "Ungültiger Code"); return; }
      setDiscount(data.code, data.discountAmount);
    } finally {
      setCodeLoading(false);
    }
  }

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, discountCode, discountAmount }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Fehler beim Checkout. Bitte versuche es erneut.");
    } catch {
      alert("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-3xl font-black tracking-tight mb-4">Warenkorb</h1>
        <p className="text-gray-500 mb-8">Dein Warenkorb ist leer.</p>
        <Link href="/produkte" className="bg-black text-white font-semibold px-8 py-4 hover:bg-gray-800 transition-colors text-sm">
          Weiter shoppen →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black tracking-tight mb-10">Warenkorb</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2">
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li key={item.id} className="flex gap-5 py-6">
                <div className="w-24 h-24 bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.name} width={96} height={96} className="w-full h-full object-contain p-2" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.size && <p className="text-sm text-gray-500 mt-0.5">Größe: {item.size}</p>}
                    </div>
                    <button onClick={() => removeItem(item.id)} aria-label={`${item.name} entfernen`} className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer p-1 self-start">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer" aria-label="Menge verringern">−</button>
                      <span className="w-9 text-center text-sm font-medium">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer" aria-label="Menge erhöhen">+</button>
                    </div>
                    <span className="font-bold">{fmt(item.price * item.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-6 h-fit">
          <h2 className="font-bold text-lg mb-6">Bestellübersicht</h2>

          {/* Discount */}
          <div className="mb-6">
            <label htmlFor="discount-code" className="text-sm font-medium block mb-2">Rabattcode</label>
            <div className="flex gap-2">
              <input
                id="discount-code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="CODE EINGEBEN"
                className="flex-1 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                aria-describedby={codeError ? "code-error" : undefined}
              />
              <button onClick={applyCode} disabled={codeLoading || !codeInput} className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50">
                {codeLoading ? "..." : "OK"}
              </button>
            </div>
            {codeError && <p id="code-error" className="text-red-500 text-xs mt-1" role="alert">{codeError}</p>}
            {discountCode && <p className="text-green-600 text-xs mt-1">✓ Code {discountCode} angewendet</p>}
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between text-gray-500"><span>Zwischensumme</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Versand</span><span>{shipping === 0 ? <span className="text-green-600">Kostenlos</span> : fmt(shipping)}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Rabatt</span><span>−{fmt(discountAmount)}</span></div>}
            {subtotal > 0 && subtotal < 60 && <p className="text-xs text-gray-400">Noch {fmt(60 - subtotal)} bis zum kostenlosen Versand</p>}
          </div>
          <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-4 mb-6">
            <span>Gesamt</span><span>{fmt(total)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="w-full bg-black text-white font-semibold py-4 text-sm hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-70"
          >
            {checkoutLoading ? "Weiterleitung..." : "Zur Kasse →"}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">🔒 Sichere Zahlung mit Stripe</p>
        </div>
      </div>
    </div>
  );
}
