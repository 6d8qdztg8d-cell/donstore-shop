"use client";

import { useEffect, useRef } from "react";

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

const TRANSITION = "opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)";

export default function VideoScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const kickerRefs = useRef<(HTMLElement | null)[]>([]);
  const titleRefs = useRef<(HTMLElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let smooth = 0;
    let unlocked = false;
    let cancelled = false;
    let currentPhase = 0;

    function setPhaseDOM(idx: number) {
      PHASES.forEach((_, i) => {
        const active = i === idx;
        const out = i < idx ? "translateY(-8px)" : "translateY(8px)";
        for (const ref of [kickerRefs.current[i], titleRefs.current[i], bodyRefs.current[i]]) {
          if (!ref) continue;
          ref.style.opacity = active ? "1" : "0";
          ref.style.transform = active ? "translateY(0)" : out;
        }
      });
    }

    setPhaseDOM(0);

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
        setPhaseDOM(idx);
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
          aria-label="Donstore Grip Socks 360° Rotation"
        />

        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div
              className="max-w-md pointer-events-auto"
              style={{ fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" }}
            >
              {/* Kicker */}
              <div className="relative h-6 mb-4 overflow-hidden">
                {PHASES.map((ph, i) => (
                  <p
                    key={ph.kicker}
                    ref={(el) => { kickerRefs.current[i] = el; }}
                    className="absolute inset-0 text-xs font-bold tracking-widest uppercase text-[#999]"
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      transform: i === 0 ? "translateY(0)" : "translateY(8px)",
                      transition: TRANSITION,
                    }}
                  >
                    {ph.kicker}
                  </p>
                ))}
              </div>

              {/* Titel */}
              <div className="relative mb-5" style={{ minHeight: "4rem" }}>
                {PHASES.map((ph, i) => (
                  <span
                    key={ph.title}
                    ref={(el) => { titleRefs.current[i] = el; }}
                    className={`select-none font-black uppercase leading-none text-[#0a0a0a] text-5xl sm:text-6xl${i === 0 ? " block" : " absolute inset-0 block"}`}
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      transform: i === 0 ? "translateY(0)" : "translateY(8px)",
                      transition: TRANSITION,
                    }}
                  >
                    {ph.title}
                  </span>
                ))}
              </div>

              {/* Body */}
              <div className="relative mb-8" style={{ minHeight: "5rem" }}>
                {PHASES.map((ph, i) => (
                  <p
                    key={ph.kicker}
                    ref={(el) => { bodyRefs.current[i] = el; }}
                    className={`text-[#666] text-lg leading-relaxed${i === 0 ? "" : " absolute inset-0"}`}
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      transform: i === 0 ? "translateY(0)" : "translateY(8px)",
                      transition: TRANSITION,
                    }}
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
