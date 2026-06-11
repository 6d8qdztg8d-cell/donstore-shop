"use client";

import Image from "next/image";

const PARTICLES = [
  { left: "12%", size: 3, delay: 0, dur: 11 },
  { left: "22%", size: 2, delay: 2.5, dur: 14 },
  { left: "38%", size: 4, delay: 5, dur: 12 },
  { left: "55%", size: 2, delay: 1.2, dur: 15 },
  { left: "68%", size: 3, delay: 6.5, dur: 13 },
  { left: "80%", size: 2, delay: 3.8, dur: 16 },
  { left: "90%", size: 3, delay: 8, dur: 12 },
];

/**
 * Atmosphärische Produktbühne: driftende Rauchschwaden und aufsteigende
 * Staubpartikel hinter dem statischen Produktbild.
 */
export default function HeroVisual() {
  return (
    <div className="relative flex justify-center items-center min-h-[420px] lg:min-h-[520px]">
      {/* Rauchschwaden */}
      <div className="absolute inset-0 overflow-visible pointer-events-none" aria-hidden="true">
        <div className="smoke smoke-1" />
        <div className="smoke smoke-2" />
        <div className="smoke smoke-3" />
      </div>

      {/* Aufsteigende Staubpartikel */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Bodenschatten */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/5 h-8 rounded-[50%] bg-black/20 blur-2xl"
        aria-hidden="true"
      />

      {/* Produktbild — statisch */}
      <div className="relative z-10 w-72 h-72 sm:w-96 sm:h-96 lg:w-[460px] lg:h-[460px]">
        <Image
          src="/images/socks_studio.png"
          alt="Donstore Grip Socks"
          fill
          className="object-contain drop-shadow-2xl"
          priority
          sizes="(max-width:1024px) 320px, 460px"
        />
      </div>
    </div>
  );
}
