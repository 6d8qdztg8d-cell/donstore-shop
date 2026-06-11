"use client";

import { useRef, useCallback, useEffect } from "react";
import Link from "next/link";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Anziehungsstärke (0–1) */
  strength?: number;
}

/**
 * Magnetischer CTA-Button: zieht sich Richtung Cursor und
 * federt mit Spring-Physik zurück — wie auf Awwwards-Seiten.
 */
export default function MagneticButton({ href, children, className = "", strength = 0.35 }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const raf = useRef(0);
  const running = useRef(false);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const tick = useCallback(() => {
    const c = current.current;
    const t = target.current;
    c.x += (t.x - c.x) * 0.14;
    c.y += (t.y - c.y) * 0.14;
    if (ref.current) {
      ref.current.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0)`;
    }
    if (Math.abs(t.x - c.x) < 0.1 && Math.abs(t.y - c.y) < 0.1) {
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
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    target.current = {
      x: (e.clientX - rect.left - rect.width / 2) * strength,
      y: (e.clientY - rect.top - rect.height / 2) * strength,
    };
    kick();
  }

  function onLeave() {
    target.current = { x: 0, y: 0 };
    kick();
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ willChange: "transform", display: "inline-block" }}
    >
      {children}
    </Link>
  );
}
