import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VideoScrollSection from "@/components/shop/VideoScrollSection";
import Reveal from "@/components/fx/Reveal";
import Parallax from "@/components/fx/Parallax";
import MagneticButton from "@/components/fx/MagneticButton";

async function getReviews() {
  try {
    return await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

const fontHeading = { fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" };

const PRODUCTS = [
  {
    href: "/produkte/donstore-grip-socks",
    img: "/images/socks_studio.png",
    tag: "BESTSELLER",
    name: "Grip Socks",
    desc: "Anti-Rutsch Grip-Punkte · Atmungsaktiv · Größe 39–46",
    price: "19,99 €",
    compare: "24,99 €",
  },
  {
    href: "/produkte/donstore-shin-guards",
    img: "/images/shinguards_studio.png",
    tag: "NEU",
    name: "Shin Guards",
    desc: "Matte Hartschale · Inkl. Donstore Tasche · Profi-Schutz",
    price: "34,99 €",
    compare: null,
  },
  {
    href: "/produkte/donstore-rigid-tape",
    img: "/images/tape_studio.jpg",
    tag: "ESSENTIAL",
    name: "Rigid Tape",
    desc: "3er Pack · Starker Halt · Für alle Sportarten",
    price: "12,99 €",
    compare: null,
  },
];

const USP = [
  {
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Maximaler Halt",
    desc: "Gummierte Grip-Punkte auf der ganzen Sohle für sicheren Stand.",
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Atmungsaktiv",
    desc: "Mesh-Zonen halten deine Füße trocken – auch bei intensivem Training.",
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: "Premium Qualität",
    desc: "Lab-getestete Materialien für langanhaltenden Tragekomfort.",
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Schnelle Lieferung",
    desc: "Standard 2–4 Werktage. Express 1–2 Werktage. Kostenlos ab 60 €.",
  },
];

const FAQ_SHORT = [
  { q: "Welche Größen gibt es?", a: "Donstore Grip Socks in zwei Größen: 39–42 und 43–46." },
  { q: "Wie wasche ich die Socken?", a: "Maschinenwaschbar bei 30–40°C. Nicht trocknergeeignet." },
  { q: "Wann kommt meine Bestellung?", a: "Standard: 2–4 Werktage. Express: 1–2 Werktage." },
];

const MARQUEE_ITEMS = [
  "PREMIUM QUALITY", "GRIP PERFORMANCE", "FREE RETURNS", "FAST DELIVERY",
  "SPORTS LAB TESTED", "MADE FOR ATHLETES", "DONSTORE",
  "PREMIUM QUALITY", "GRIP PERFORMANCE", "FREE RETURNS", "FAST DELIVERY",
  "SPORTS LAB TESTED", "MADE FOR ATHLETES", "DONSTORE",
];

export default async function HomePage() {
  const reviews = await getReviews();

  return (
    <>
      {/* ── VIDEO HERO (erste Sektion) ── */}
      <VideoScrollSection />

      {/* ── HEADLINE + CTA ── */}
      <section className="relative py-28 bg-white overflow-hidden border-b border-[#e5e5e5]">
        <Parallax speed={-0.12} className="absolute top-0 right-0 w-[520px] h-[520px] pointer-events-none">
          <div
            className="w-full h-full"
            style={{ background: "radial-gradient(circle at 80% 10%, rgba(195,244,0,0.35) 0%, transparent 60%)" }}
            aria-hidden="true"
          />
        </Parallax>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#c3f400] text-black text-xs font-black px-3 py-1.5 tracking-widest uppercase mb-8 animate-fade-in">
            Performance Gear
          </span>
          <h1
            className="text-7xl sm:text-8xl font-black uppercase leading-[0.9] mb-8 text-[#0a0a0a]"
            style={fontHeading}
          >
            <span className="hero-line"><span style={{ animationDelay: "0.05s" }}>GRIP.</span></span>
            <span className="hero-line"><span style={{ animationDelay: "0.18s" }}>KOMFORT.</span></span>
            <span className="hero-line"><span style={{ animationDelay: "0.31s" }}>KONTROLLE.</span></span>
          </h1>
          <Reveal direction="up" delay={0.45} distance={24}>
            <p className="text-[#666] text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Donstore Performance Gear — entwickelt für Athleten, die das Maximum aus sich herausholen. Kein Verrutschen. Kein Kompromiss.
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.6} distance={24}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton
                href="/produkte/donstore-grip-socks"
                className="bg-[#0a0a0a] text-white font-bold px-10 py-4 text-center hover:bg-[#c3f400] hover:text-black transition-colors text-sm tracking-widest uppercase"
              >
                Jetzt shoppen →
              </MagneticButton>
              <MagneticButton
                href="/produkte"
                strength={0.2}
                className="border border-[#e5e5e5] text-[#666] font-semibold px-10 py-4 text-center hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors text-sm tracking-widest uppercase"
              >
                Alle Produkte
              </MagneticButton>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.75} distance={16}>
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-[#999]">
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect width="16" height="16" fill="#c3f400" />
                  <path d="M3.5 8l3 3L12.5 5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Kostenloser Versand ab 60 €
              </span>
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect width="16" height="16" fill="#c3f400" />
                  <path d="M3.5 8l3 3L12.5 5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                </svg>
                30 Tage Rückgabe
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-[#e5e5e5] bg-[#f5f5f5] py-3.5 overflow-hidden" aria-hidden="true">
        <div className="flex marquee-track whitespace-nowrap gap-8 select-none">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="text-xs font-bold tracking-widest uppercase text-[#aaa] flex items-center gap-8">
              {item}
              <span className="text-[#c3f400] font-black">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PRODUKTE ── */}
      <section className="py-24 bg-white" aria-labelledby="products-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <Reveal direction="right">
              <div>
                <p className="text-[#999] text-xs font-bold tracking-widest uppercase mb-3">Kollektion</p>
                <h2
                  id="products-heading"
                  className="text-5xl font-black uppercase text-[#0a0a0a]"
                  style={fontHeading}
                >
                  UNSERE PRODUKTE
                </h2>
              </div>
            </Reveal>
            <Reveal direction="left">
              <Link
                href="/produkte"
                className="text-sm font-medium text-[#666] hover:text-[#0a0a0a] transition-colors tracking-widest uppercase hidden sm:block"
              >
                Alle ansehen →
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} direction="up" delay={i * 0.14} distance={64}>
                <Link
                  href={p.href}
                  className="group relative bg-white border border-[#e5e5e5] overflow-hidden hover:border-[#0a0a0a] hover:shadow-lg transition-all duration-300 block h-full"
                >
                  <span className="absolute top-4 left-4 z-10 bg-[#c3f400] text-black text-[10px] font-black px-2 py-1 tracking-widest uppercase">
                    {p.tag}
                  </span>
                  <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
                    <Image
                      src={p.img}
                      alt={`Donstore ${p.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 border-t border-[#f0f0f0]">
                    <h3
                      className="text-2xl font-black uppercase text-[#0a0a0a] mb-1"
                      style={fontHeading}
                    >
                      {p.name}
                    </h3>
                    <p className="text-[#999] text-sm mb-4">{p.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#0a0a0a]">{p.price}</span>
                        {p.compare && (
                          <span className="text-sm text-[#bbb] line-through">{p.compare}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase text-[#999] group-hover:text-[#0a0a0a] transition-colors">
                        Kaufen →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── USP GRID ── */}
      <section className="py-20 bg-[#f5f5f5] border-y border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e5e5e5]">
            {USP.map((u, i) => (
              <Reveal key={u.title} direction="up" delay={i * 0.1} distance={40} className="h-full">
                <div className="bg-[#f5f5f5] p-8 text-center hover:bg-white transition-colors h-full">
                  <div className="text-[#0a0a0a] flex justify-center mb-4">{u.icon}</div>
                  <h3 className="text-lg font-black uppercase text-[#0a0a0a] mb-2" style={fontHeading}>
                    {u.title}
                  </h3>
                  <p className="text-sm text-[#888] leading-relaxed">{u.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        <Parallax speed={0.18} className="absolute inset-0 pointer-events-none">
          <div
            className="w-full h-[130%] -mt-[15%]"
            style={{ background: "radial-gradient(ellipse at center, rgba(195,244,0,0.09) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
        </Parallax>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Reveal direction="zoom" duration={1}>
            <span className="inline-block bg-[#c3f400] text-black text-xs font-black px-3 py-1.5 tracking-widest uppercase mb-6">
              Performance First
            </span>
            <h2
              className="text-6xl sm:text-7xl font-black uppercase text-white leading-none mb-6"
              style={fontHeading}
            >
              KEIN VERRUTSCHEN.<br />
              KEIN KOMPROMISS.
            </h2>
            <p className="text-[#777] text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Entwickelt für Athleten, die das Maximale aus sich herausholen wollen.
            </p>
            <MagneticButton
              href="/produkte/donstore-grip-socks"
              strength={0.4}
              className="inline-block bg-[#c3f400] text-black font-bold px-12 py-5 hover:bg-white transition-colors text-sm tracking-widest uppercase"
            >
              Jetzt entdecken →
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ── BEWERTUNGEN ── */}
      {reviews.length > 0 && (
        <section className="py-20 bg-white border-t border-[#e5e5e5]" aria-labelledby="reviews-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal direction="up">
              <div className="text-center mb-14">
                <p className="text-[#999] text-xs font-bold tracking-widest uppercase mb-3">Kundenstimmen</p>
                <h2 id="reviews-heading" className="text-4xl font-black uppercase text-[#0a0a0a]" style={fontHeading}>
                  BEWERTUNGEN
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e5e5e5]">
              {reviews.map((r, i) => (
                <Reveal key={r.id} direction="up" delay={i * 0.12} className="h-full">
                  <blockquote className="bg-white p-8 hover:bg-[#fafafa] transition-colors h-full">
                    <div className="flex gap-1 mb-4" aria-label={`${r.rating} von 5 Sternen`}>
                      {Array.from({ length: 5 }).map((_, si) => (
                        <svg key={si} width="14" height="14" viewBox="0 0 24 24" fill={si < r.rating ? "#c3f400" : "#e5e5e5"} aria-hidden="true">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                        </svg>
                      ))}
                    </div>
                    {r.title && <p className="font-bold text-[#0a0a0a] text-sm mb-2">{r.title}</p>}
                    {r.body && <p className="text-[#666] text-sm leading-relaxed mb-4">&quot;{r.body}&quot;</p>}
                    <footer className="text-xs text-[#bbb] font-medium uppercase tracking-widest">{r.author}</footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="py-20 bg-[#f5f5f5] border-t border-[#e5e5e5]" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal direction="up">
            <div className="text-center mb-14">
              <p className="text-[#999] text-xs font-bold tracking-widest uppercase mb-3">Support</p>
              <h2 id="faq-heading" className="text-4xl font-black uppercase text-[#0a0a0a]" style={fontHeading}>
                HÄUFIGE FRAGEN
              </h2>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.15}>
            <dl className="divide-y divide-[#e5e5e5] bg-white border border-[#e5e5e5]">
              {FAQ_SHORT.map((item) => (
                <div key={item.q} className="px-6 py-5">
                  <dt className="font-bold text-base text-[#0a0a0a] mb-1.5">{item.q}</dt>
                  <dd className="text-[#666] text-sm leading-relaxed">{item.a}</dd>
                </div>
              ))}
            </dl>
            <div className="text-center mt-10">
              <Link href="/faq" className="text-sm font-bold tracking-widest uppercase text-[#0a0a0a] hover:text-[#666] transition-colors">
                Alle Fragen ansehen →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
