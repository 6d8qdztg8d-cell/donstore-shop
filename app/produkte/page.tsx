import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Alle Produkte",
  description: "Entdecke alle Donstore Produkte – Premium Grip Socks, Shin Guards und Tape.",
};

const fontHeading = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

const LOCAL_IMAGES: Record<string, string> = {
  "donstore-grip-socks": "/images/socks_studio.png",
  "donstore-shin-guards": "/images/shinguards_studio.png",
  "donstore-rigid-tape": "/images/tape_studio.jpg",
};

async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true },
      include: { images: { where: { isPrimary: true } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export default async function ProdukteSeite() {
  const products = await getProducts();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-14">
          <p className="text-[#999] text-xs font-bold tracking-widest uppercase mb-3">Kollektion</p>
          <h1 className="text-5xl font-black uppercase text-[#0a0a0a]" style={fontHeading}>
            Alle Produkte
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const img = LOCAL_IMAGES[p.slug] ?? p.images[0]?.url;
            const discount = p.comparePrice
              ? Math.round((1 - p.price / Number(p.comparePrice)) * 100)
              : null;

            return (
              <Link
                key={p.id}
                href={`/produkte/${p.slug}`}
                className="group bg-white border border-[#e5e5e5] overflow-hidden hover:border-[#0a0a0a] hover:shadow-lg transition-all duration-300 block"
              >
                <div className="relative aspect-square bg-[#f8f8f8] overflow-hidden">
                  {p.featured && (
                    <span className="absolute top-4 left-4 z-10 bg-[#c3f400] text-black text-[10px] font-black px-2 py-1 tracking-widest uppercase">
                      BESTSELLER
                    </span>
                  )}
                  {discount && (
                    <span className="absolute top-4 right-4 z-10 bg-[#0a0a0a] text-white text-[10px] font-black px-2 py-1 tracking-widest uppercase">
                      −{discount}%
                    </span>
                  )}
                  {img && (
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-6 border-t border-[#f0f0f0]">
                  <h3 className="text-xl font-black uppercase text-[#0a0a0a] mb-1" style={fontHeading}>
                    {p.name}
                  </h3>
                  <p className="text-[#999] text-sm mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#0a0a0a]">
                        {Number(p.price).toFixed(2).replace(".", ",")} €
                      </span>
                      {p.comparePrice && (
                        <span className="text-sm text-[#bbb] line-through">
                          {Number(p.comparePrice).toFixed(2).replace(".", ",")} €
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-[#999] group-hover:text-[#0a0a0a] transition-colors">
                      Details →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
