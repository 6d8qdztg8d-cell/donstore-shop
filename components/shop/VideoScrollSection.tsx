"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * Bildschirmfüllendes Scroll-Video: Die Sektion ist 400vh hoch, das Video
 * klebt fullscreen im Viewport. Die Scrollposition steuert die Frames.
 * Das Video ist all-intra kodiert (jeder Frame ein Keyframe) → weiches Seeking.
 */
export default function VideoScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current as HTMLVideoElement;

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

      // Browser-Unlock beim ersten Scroll (nicht beim Laden, damit kein Autoplay)
      if (!unlocked && p > 0) {
        unlocked = true;
        video.play().then(() => { video.pause(); video.currentTime = 0; }).catch(() => {});
      }

      // Frames weich zur Scrollposition lerpen
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

    // Safari ignoriert preload="auto" weitgehend und scrubbt auf
    // Netzwerk-Streams unzuverlässig → Video komplett als Blob laden,
    // dann ist jeder Seek sofort und exakt.
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
      .catch(() => start()); // Fallback: direkt mit Netzwerk-Quelle

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
      aria-label="Donstore Grip Socks im Detail"
    >
      <div className="sticky top-0 h-screen w-full bg-white overflow-hidden">

        {/* Bildschirmfüllendes Video — 16:9, Socke rechts positioniert */}
        <video
          ref={videoRef}
          src="/videos/socks_rotation_scrub.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          aria-label="Donstore Grip Socks 360° Rotation — durch Scrollen drehen"
        />

        {/* Text-Overlay links */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-md pointer-events-auto">

              {/* Kicker — fade */}
              <div className="relative h-6 mb-4 overflow-hidden">
                {PHASES.map((ph, i) => (
                  <p
                    key={ph.kicker}
                    className="absolute inset-0 text-xs font-bold tracking-widest uppercase text-[#999] transition-all duration-500 ease-out"
                    style={{
                      opacity: phase === i ? 1 : 0,
                      transform: phase === i ? "translateY(0)" : phase > i ? "translateY(-12px)" : "translateY(12px)",
                    }}
                  >
                    {ph.kicker}
                  </p>
                ))}
              </div>

              {/* Titel — Gooey Morph */}
              <div style={{ fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif" }}>
                <ScrollGooeyText
                  texts={PHASES.map((ph) => ph.title)}
                  activeIndex={phase}
                  morphTime={0.55}
                  className="mb-5"
                  textClassName="font-black uppercase leading-none text-[#0a0a0a] text-5xl sm:text-6xl"
                />
              </div>

              {/* Body-Text — fade */}
              <div className="relative mb-8" style={{ minHeight: "5rem" }}>
                {PHASES.map((ph, i) => (
                  <p
                    key={ph.kicker}
                    className="absolute inset-0 text-[#666] text-lg leading-relaxed transition-all duration-500 ease-out"
                    style={{
                      opacity: phase === i ? 1 : 0,
                      transform: phase === i ? "translateY(0)" : phase > i ? "translateY(-12px)" : "translateY(12px)",
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

        {/* Scroll-Fortschritt unten */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eee]" aria-hidden="true">
          <div
            ref={progressRef}
            className="h-full bg-[#0a0a0a] origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Scroll-Hinweis */}
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
