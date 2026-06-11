"use client";

import { useRef, useEffect, useCallback } from "react";

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  /** Maximale Neigung in Grad */
  max?: number;
  /** Skalierung beim Hover */
  hoverScale?: number;
  /** Lichtreflex-Overlay anzeigen */
  glare?: boolean;
}

/**
 * Maus-reaktive 3D-Neigung mit Spring-Physik (lerp im rAF-Loop)
 * und wanderndem Lichtreflex — wie bei Premium-Produktkarten.
 */
export default function Tilt3D({
  children,
  className = "",
  max = 9,
  hoverScale = 1.025,
  glare = true,
}: Tilt3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const running = useRef(false);
  const target = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, s: 1, go: 0 });
  const current = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, s: 1, go: 0 });

  const tick = useCallback(() => {
    const c = current.current;
    const t = target.current;
    const ease = 0.11;
    c.rx += (t.rx - c.rx) * ease;
    c.ry += (t.ry - c.ry) * ease;
    c.gx += (t.gx - c.gx) * ease;
    c.gy += (t.gy - c.gy) * ease;
    c.s += (t.s - c.s) * ease;
    c.go += (t.go - c.go) * ease;

    const inner = innerRef.current;
    if (inner) {
      inner.style.transform = `perspective(1000px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) scale(${c.s.toFixed(3)})`;
    }
    const g = glareRef.current;
    if (g) {
      g.style.background = `radial-gradient(circle at ${c.gx.toFixed(1)}% ${c.gy.toFixed(1)}%, rgba(255,255,255,${(0.35 * c.go).toFixed(3)}) 0%, rgba(255,255,255,0) 55%)`;
    }

    const settled =
      Math.abs(t.rx - c.rx) < 0.01 &&
      Math.abs(t.ry - c.ry) < 0.01 &&
      Math.abs(t.s - c.s) < 0.001 &&
      Math.abs(t.go - c.go) < 0.005;

    if (settled) {
      running.current = false;
      return;
    }
    raf.current = requestAnimationFrame(tick);
  }, []);

  const kick = useCallback(() => {
    if (!running.current) {
      running.current = true;
      raf.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function onMove(e: React.MouseEvent) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    target.current = {
      rx: (0.5 - py) * max * 2,
      ry: (px - 0.5) * max * 2,
      gx: px * 100,
      gy: py * 100,
      s: hoverScale,
      go: 1,
    };
    kick();
  }

  function onLeave() {
    target.current = { rx: 0, ry: 0, gx: 50, gy: 50, s: 1, go: 0 };
    kick();
  }

  return (
    <div ref={wrapRef} className={className} onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: "1000px" }}>
      <div ref={innerRef} className="relative h-full w-full" style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
        {children}
        {glare && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
