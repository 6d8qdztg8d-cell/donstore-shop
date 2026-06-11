"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";

const PRODUCT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDxDCGzfQYELvN-nfUguxEu5xcDb-5qmaiqpB6hh0GP6gLnrz_-tVYNdC6sdvHcsjI8CksylDdlZUdLenacqB0QS9ctq2B3BjpA9wBDIhv8XIuU8WSv-i5r-CJrqZPqgLkyfie_NnPmWG1pmcYyYFRB7KdxwpJCZifpZBQzjmD8yfOkVrL-J1YjGG-rskYRKmPy4ewA2Xcc078ldV6Jhhn3gTKdLIsfOToKnP-B2SFoNzGoFYIv1YuvU1yOTptjfHviwC4zolpiYgw";

const DEMO_PRODUCT = {
  id: "demo-1",
  name: "Donstore Grip Socks",
  slug: "donstore-grip-socks",
  description:
    "Donstore Grip Socks geben dir Halt, Komfort und Kontrolle bei jeder Bewegung. Die rutschfesten Grip-Punkte sorgen für starken Halt im Schuh, während das atmungsaktive Material deine Füße angenehm trocken hält. Perfekt für Fußball, Training und Alltag.",
  price: 19.99,
  comparePrice: 24.99,
  images: [PRODUCT_IMG],
  variants: [
    { id: "v1", size: "39–42" },
    { id: "v2", size: "43–46" },
  ],
  advantages: [
    "Rutschfeste Grip-Punkte auf der Sohle",
    "Atmungsaktive Mesh-Zonen",
    "Hoher Tragekomfort",
    "Schwarzes Donstore Logo",
    "Geeignet für Fußball, Fitness und Alltag",
  ],
  reviews: [
    { id: "r1", rating: 5, title: "Absolut top!", body: "Kein Mal verrutscht, super Qualität.", author: "Lena K." },
    { id: "r2", rating: 5, title: "Nie wieder ohne", body: "Perfekter Halt im Schuh.", author: "Marco S." },
  ],
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={i < rating ? "text-black" : "text-gray-200"} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductPage() {
  const product = DEMO_PRODUCT;
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const discount = Math.round((1 - product.price / product.comparePrice) * 100);

  function handleAddToCart() {
    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      price: product.price,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
        <a href="/" className="hover:text-black">Home</a>
        <span className="mx-2">/</span>
        <a href="/produkte" className="hover:text-black">Produkte</a>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden mb-4">
            <Image src={product.images[0]} alt={product.name} fill className="object-contain p-10" priority sizes="(max-width:1024px) 100vw, 50vw" />
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1">−{discount}%</span>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Performance Sportsocken</p>
          <h1 className="text-3xl font-black tracking-tight mb-4">{product.name}</h1>

          {/* Ratings */}
          <div className="flex items-center gap-3 mb-5">
            <Stars rating={5} />
            <span className="text-sm text-gray-500">({product.reviews.length} Bewertungen)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-black">{product.price.toFixed(2).replace(".", ",")} €</span>
            <span className="text-lg text-gray-400 line-through">{product.comparePrice.toFixed(2).replace(".", ",")} €</span>
            <span className="bg-black text-white text-xs font-bold px-2 py-1">−{discount}%</span>
          </div>

          {/* Size */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Größe: <span className="font-bold">{selectedVariant.size}</span></span>
              <a href="#groessentabelle" className="text-xs text-gray-400 underline hover:text-black">Größentabelle</a>
            </div>
            <div className="flex gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  aria-pressed={selectedVariant.id === v.id}
                  className={`px-5 py-2.5 text-sm font-semibold border transition-colors cursor-pointer ${
                    selectedVariant.id === v.id
                      ? "bg-black text-white border-black"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-semibold">Menge:</span>
            <div className="flex items-center border border-gray-200">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer" aria-label="Menge verringern">−</button>
              <span className="w-10 text-center font-medium text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer" aria-label="Menge erhöhen">+</button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex-1 py-4 font-semibold text-sm tracking-wide transition-colors cursor-pointer ${
                added ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {added ? "✓ Hinzugefügt!" : "In den Warenkorb"}
            </button>
          </div>

          {/* Shipping info */}
          <div className="border border-gray-100 p-4 text-sm text-gray-500 space-y-1.5 mb-8">
            <p className="flex items-center gap-2"><span>🚚</span> Kostenloser Versand ab 60 €</p>
            <p className="flex items-center gap-2"><span>↩</span> 30 Tage Rückgabe</p>
            <p className="flex items-center gap-2"><span>🔒</span> Sichere Zahlung mit Stripe</p>
          </div>

          {/* Advantages */}
          <div className="mb-8">
            <h2 className="font-bold text-base mb-4">Produktvorteile</h2>
            <ul className="space-y-2">
              {product.advantages.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-black font-bold mt-0.5">✓</span>{a}
                </li>
              ))}
            </ul>
          </div>

          {/* Size table */}
          <div id="groessentabelle" className="mb-8">
            <h2 className="font-bold text-base mb-4">Größentabelle</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Größe</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Schuhgröße EU</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-200 px-4 py-2">S/M</td><td className="border border-gray-200 px-4 py-2">39–42</td></tr>
                <tr><td className="border border-gray-200 px-4 py-2">L/XL</td><td className="border border-gray-200 px-4 py-2">43–46</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20 border-t border-gray-100 pt-12" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-2xl font-black tracking-tight mb-8">Kundenbewertungen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.reviews.map((r) => (
            <blockquote key={r.id} className="bg-gray-50 p-6 border border-gray-100">
              <Stars rating={r.rating} />
              {r.title && <p className="font-semibold text-sm mt-2 mb-1">{r.title}</p>}
              <p className="text-gray-600 text-sm leading-relaxed mb-3">&quot;{r.body}&quot;</p>
              <footer className="text-xs text-gray-400">{r.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
