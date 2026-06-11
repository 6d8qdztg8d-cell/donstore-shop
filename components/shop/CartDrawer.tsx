"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

export default function CartDrawer() {
  const { items, open, setOpen, removeItem, updateQty, getSubtotal, getTotal, discountAmount, discountCode } =
    useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const subtotal = getSubtotal();
  const shipping = subtotal >= 60 ? 0 : subtotal > 0 ? 4.99 : 0;
  const total = getTotal();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div
        ref={overlayRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/50 z-50"
        aria-hidden="true"
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg">Warenkorb</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Warenkorb schließen"
            className="p-2 text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <svg width="48" height="48" fill="none" stroke="#d1d5db" strokeWidth="1.2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-gray-500 text-sm">Dein Warenkorb ist leer.</p>
              <button
                onClick={() => setOpen(false)}
                className="bg-black text-white text-sm font-medium px-6 py-2.5 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Weiter shoppen
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    {item.size && <p className="text-xs text-gray-500">Größe: {item.size}</p>}
                    <p className="text-sm font-semibold mt-1">{fmt(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Menge verringern"
                        className="w-7 h-7 border border-gray-200 text-sm hover:border-gray-400 transition-colors cursor-pointer flex items-center justify-center"
                      >−</button>
                      <span className="text-sm w-4 text-center font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Menge erhöhen"
                        className="w-7 h-7 border border-gray-200 text-sm hover:border-gray-400 transition-colors cursor-pointer flex items-center justify-center"
                      >+</button>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`${item.name} entfernen`}
                        className="ml-auto text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Zwischensumme</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Versand</span>
                <span>{shipping === 0 ? <span className="text-green-600">Kostenlos</span> : fmt(shipping)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Rabatt ({discountCode})</span>
                  <span>−{fmt(discountAmount)}</span>
                </div>
              )}
              {subtotal > 0 && subtotal < 60 && (
                <p className="text-xs text-gray-400 pt-1">Noch {fmt(60 - subtotal)} bis zum kostenlosen Versand</p>
              )}
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3">
              <span>Gesamt</span><span>{fmt(total)}</span>
            </div>
            <Link
              href="/warenkorb"
              onClick={() => setOpen(false)}
              className="block w-full bg-black text-white text-sm font-semibold py-3.5 text-center hover:bg-gray-800 transition-colors"
            >
              Zur Kasse →
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="block w-full border border-gray-200 text-sm font-medium py-3 text-center hover:border-gray-400 transition-colors cursor-pointer"
            >
              Weiter shoppen
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
