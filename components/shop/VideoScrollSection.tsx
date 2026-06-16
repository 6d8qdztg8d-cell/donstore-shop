"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { ScrollGooeyText } from "@/components/ui/gooey-text-morphing";

const PHASES = [
  {
    kicker: "01 — Grip",
    title: "ANTI-RUTSCH SOHLE",
    text: "Gummierte Grip-Punkte verzahnen sich mit deinem Schuh. Null Verrutschen, volle Kraftübertragung.",
  },
  {
    kicker: "02 — Material",
    title: "ATMUNGSAKTIVES MESH",
    text: "Gestrickte Mesh-Zonen leiten Feuchtigkeit ab und halten deine Füße trocken.",
  },
  {
    kicker: "03 — Passform",
    title: "KOMPRESSION & HALT",
    text: "Anatomische Kompressionszonen stützen das Fußgewölbe. In 39–42 und 43–46.",
  },
];

export default function VideoScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Only GooeyText needs React state — everything else goes via DOM refs
  const [gooeyIndex, setGooeyIndex] = useState(0);

  const kickerRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let smooth = 0;
    let unlocked = false;
    let cancelled = false;
    let currentPhase = -1;

    function updateTextDOM(idx: number) {
      PHASES.forEach((_, i) => {
        const active = i === idx;
        const past = i < idx;

        const kicker = kickerRefs.current[i];
        if (kicker) {
          kicker.style.opacity = active ? "1" : "0";
          kicker.style.transform = active ? "translateY(0)" : past ? "translateY(-12px)" : "translateY(12px)";
        }

        const body = bodyRefs.current[i];
        if (body) {
          body.style.opacity = active ? "1" : "0";
          body.style.transform = active ? "translateY(0)" : past ? "translateY(-12px)" : "translateY(12px)";
        }
      });
    }

    // Set initial state without waiting for first scroll
    updateTextDOM(0);
    currentPhase = 0;

    function loop() {
      if (cancelled) return;
      raf = requestAnimationFrame(loop);

      const section = sectionRef.current;
      if (!section) return;

      const duration = video!.duration;
      if (!duration || !isFinite(duration)) return;

      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0 || rect.top > window.innerHeight || rect.bottom < 0) return;

      const p = Math.min(1, Math.max(0, -rect.top / total));

      if (!unlocked && p > 0) {
        unlocked = true;
        const v = video!;
        v.play().then(() => { v.pause(); v.currentTime = 0; }).catch(() => {});
      }

      const target = p * Math.max(0, duration - 0.04);
      smooth += (target - smooth) * 0.22;
      if (!video!.seeking && Math.abs(video!.currentTime - smooth) > 0.02) {
        video!.currentTime = smooth;
      }

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }

      const idx = Math.min(PHASES.length - 1, Math.floor(p * PHASES.length));
      if (idx !== currentPhase) {
        currentPhase = idx;
        // Direct DOM update — zero React overhead, no re-render
        updateTextDOM(idx);
        // GooeyText still needs React state, but deferred so it never blocks the rAF
        startTransition(() => setGooeyIndex(idx));
      }
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh]"
      aria-label="Donstore Grip Socks im Detail"
    >
      <div className="sticky top-0 h-screen w-full bg-white overflow-hidden">

        <video
          ref={videoRef}
          src="/videos/socks_rotation_scrub.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          aria-label="Donstore Grip Socks 360° Rotation — durch Scrollen drehen"
        />

        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-md pointer-events-auto">

              {/* Kicker — updated directly via DOM ref, no React re-render */}
              <div className="relative h-6 mb-4 overflow-hidden">
                {PHASES.map((ph, i) => (
                  <p
                    key={ph.kicker}
                    ref={(el) => { kickerRefs.current[i] = el; }}
                    className="absolute inset-0 text-xs font-bold tracking-widest uppercase text-[#999] transition-all duration-500 ease-out"
                    style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? "translateY(0)" : "translateY(12px)" }}
                  >
                    {ph.kicker}
                  </p>
                ))}
              </div>

              {/* Titel — GooeyText via startTransition (deferred, low-priority) */}
              <div style={{ fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" }}>
                <ScrollGooeyText
                  texts={PHASES.map((ph) => ph.title)}
                  activeIndex={gooeyIndex}
                  morphTime={0.55}
                  className="mb-5"
                  textClassName="font-black uppercase leading-none text-[#0a0a0a] text-5xl sm:text-6xl"
                />
              </div>

              {/* Body-Text — updated directly via DOM ref, no React re-render */}
              <div className="relative mb-8" style={{ minHeight: "5rem" }}>
                {PHASES.map((ph, i) => (
                  <p
                    key={ph.kicker}
                    ref={(el) => { bodyRefs.current[i] = el; }}
                    className="absolute inset-0 text-[#666] text-lg leading-relaxed transition-all duration-500 ease-out"
                    style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? "translateY(0)" : "translateY(12px)" }}
                  >
                    {ph.text}
                  </p>
                ))}
              </div>

              <a
                href="/produkte/donstore-grip-socks"
                className="inline-block bg-[#0a0a0a] text-white font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#c3f400] hover:text-black transition-colors"
              >
                Jetzt kaufen →
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eee]" aria-hidden="true">
          <div
            ref={progressRef}
            className="h-full bg-[#0a0a0a] origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#999] text-xs font-bold tracking-widest uppercase whitespace-nowrap" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
          Scrollen zum Drehen
        </div>
      </div>
    </section>
  );
}
