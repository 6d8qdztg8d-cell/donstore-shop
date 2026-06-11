"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  badge?: string;
}

export default function ProductCard({ id, name, slug, price, comparePrice, image, badge }: ProductCardProps) {
  const discount = comparePrice ? Math.round((1 - price / comparePrice) * 100) : null;

  return (
    <Link href={`/produkte/${slug}`} className="group block">
      <div className="relative aspect-square bg-gray-50 overflow-hidden mb-3">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1">
            {badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-1">
            −{discount}%
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-900 group-hover:text-black">{name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-base">{price.toFixed(2).replace(".", ",")} €</span>
          {comparePrice && (
            <span className="text-sm text-gray-400 line-through">{comparePrice.toFixed(2).replace(".", ",")} €</span>
          )}
        </div>
      </div>
    </Link>
  );
}
