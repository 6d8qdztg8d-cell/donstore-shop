"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore();
  useEffect(() => { clearCart(); }, [clearCart]);

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg width="32" height="32" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="text-3xl font-black tracking-tight mb-4">Vielen Dank für deine Bestellung!</h1>
      <p className="text-gray-500 mb-2">Deine Bestellung wurde erfolgreich aufgenommen.</p>
      <p className="text-gray-500 mb-10">Du erhältst in Kürze eine Bestätigungs-E-Mail.</p>
      <Link href="/produkte" className="bg-black text-white font-semibold px-8 py-4 hover:bg-gray-800 transition-colors text-sm inline-block">
        Weiter shoppen →
      </Link>
    </div>
  );
}
