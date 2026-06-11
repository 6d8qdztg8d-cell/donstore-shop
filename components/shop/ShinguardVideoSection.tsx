"use client";

import { useEffect, useRef, useState } from "react";

const PHASES = [
  {
    kicker: "01 — Schutz",
    title: "UNZERSTÖRBAR HART",
    text: "Matte Hartschale absorbiert volle Aufprallkraft. Kein Stein. Kein Gegner. Keine Chance.",
  },
  {
    kicker: "02 — Impact",
    title: "BRICHT DER STEIN",
    text: "Geprüft gegen maximale Belastung. Der Schienbeinschoner bleibt — der Rest zersplittert.",
  },
  {
    kicker: "03 — Vertrauen",
    title: "DONSTORE QUALITÄT",
    text: "Anatomische Form, sicherer Sitz, kompromissloser Schutz. Für jeden Einsatz.",
  },
];

export default function ShinguardVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let duration = 0;
    let smooth = 0;
    let raf = 0;
    let objectUrl = "";
    let cancelled = false;
    let unlocked = false;

    const setDur = () => {
      if (video.duration && isFinite(video.duration)) duration = video.duration;
    };

    function loop() {
      raf = requestAnimationFrame(loop);
      const section = sectionRef.current;
      if (!section || duration === 0) return;

      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0 || rect.top > window.innerHeight || rect.bottom < 0) return;

      const p = Math.min(1, Math.max(0, -rect.top / total));

      if (!unlocked && p > 0) {
        unlocked = true;
        video.play().then(() => { video.pause(); video.currentTime = 0; }).catch(() => {});
      }

      const target = p * Math.max(0, duration - 0.04);
      smooth += (target - smooth) * 0.22;
      if (!video.seeking && Math.abs(video.currentTime - smooth) > 0.02) {
        video.currentTime = smooth;
      }

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }

      const idx = Math.min(PHASES.length - 1, Math.floor(p * PHASES.length));
      setPhase((prev) => (prev === idx ? prev : idx));
    }

    function start() {
      if (cancelled) return;
      video.addEventListener("loadedmetadata", setDur);
      setDur();
      raf = requestAnimationFrame(loop);
    }

    fetch(video.src)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
        start();
      })
      .catch(() => start());

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", setDur);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh]"
      aria-label="Donstore Shin Guards im Detail"
    >
      <div className="sticky top-0 h-screen w-full bg-white overflow-hidden">

        {/* Video — linke Hälfte */}
        <video
          ref={videoRef}
          src="/videos/shinguards_scroll.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute top-1/2 left-6 -translate-y-1/2 w-[50%] h-auto"
          aria-label="Donstore Shin Guards Aufprall-Demo — durch Scrollen abspielen"
        />

        {/* Text — rechte Hälfte, kein Overlap */}
        <div className="absolute top-0 right-0 w-[46%] h-full flex items-center pr-16">
          <div className="relative w-full">
            {PHASES.map((ph, i) => (
              <div
                key={ph.kicker}
                className="transition-all duration-500 ease-out"
                style={{
                  position: i === 0 ? "relative" : "absolute",
                  inset: i === 0 ? undefined : 0,
                  opacity: phase === i ? 1 : 0,
                  transform: phase === i ? "translateY(0)" : phase > i ? "translateY(-24px)" : "translateY(24px)",
                  pointerEvents: phase === i ? "auto" : "none",
                }}
              >
                <p className="text-xs font-bold tracking-widest uppercase mb-4 text-[#999]">
                  {ph.kicker}
                </p>
                <h2
                  className="text-5xl sm:text-6xl font-black uppercase leading-none mb-5 text-[#0a0a0a]"
                  style={{ fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" }}
                >
                  {ph.title}
                </h2>
                <p className="text-[#666] text-lg leading-relaxed mb-8">{ph.text}</p>
                <a
                  href="/produkte/donstore-shin-guards"
                  className="inline-block bg-[#0a0a0a] text-white font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#c3f400] hover:text-black transition-colors"
                >
                  Jetzt kaufen →
                </a>
              </div>
            ))}
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
          Scrollen zum Abspielen
        </div>
      </div>
    </section>
  );
}
