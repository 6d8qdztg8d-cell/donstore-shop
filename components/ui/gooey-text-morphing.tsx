"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollGooeyTextProps {
  texts: string[];
  activeIndex: number;
  morphTime?: number;
  className?: string;
  textClassName?: string;
}

export function ScrollGooeyText({
  texts,
  activeIndex,
  morphTime = 0.6,
  className,
  textClassName,
}: ScrollGooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);
  const prevIndex = React.useRef(activeIndex);
  const rafRef = React.useRef(0);
  const startRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    // Initialwert ohne Animation setzen
    if (text2Ref.current) {
      text2Ref.current.textContent = texts[activeIndex] ?? "";
      text2Ref.current.style.opacity = "100%";
      text2Ref.current.style.filter = "";
    }
    if (text1Ref.current) {
      text1Ref.current.style.opacity = "0%";
      text1Ref.current.style.filter = "";
    }
    prevIndex.current = activeIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (prevIndex.current === activeIndex) return;

    const from = texts[prevIndex.current] ?? "";
    const to = texts[activeIndex] ?? "";
    prevIndex.current = activeIndex;

    cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    if (text1Ref.current) text1Ref.current.textContent = from;
    if (text2Ref.current) text2Ref.current.textContent = to;

    function frame(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const fraction = Math.min(elapsed / morphTime, 1);

      if (text1Ref.current) {
        const f = 1 - fraction;
        text1Ref.current.style.filter = f > 0 ? `blur(${Math.min(8 / f - 8, 100)}px)` : "blur(100px)";
        text1Ref.current.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
      }
      if (text2Ref.current) {
        text2Ref.current.style.filter = fraction > 0 ? `blur(${Math.min(8 / fraction - 8, 100)}px)` : "blur(100px)";
        text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      }

      if (fraction < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        if (text1Ref.current) { text1Ref.current.style.filter = ""; text1Ref.current.style.opacity = "0%"; }
        if (text2Ref.current) { text2Ref.current.style.filter = ""; text2Ref.current.style.opacity = "100%"; }
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeIndex, texts, morphTime]);

  return (
    <div className={cn("relative", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="gooey-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
      <div style={{ filter: "url(#gooey-threshold)" }} className="relative">
        <span ref={text1Ref} className={cn("absolute inset-0 select-none", textClassName)} style={{ opacity: "0%", fontFamily: "inherit" }} />
        <span ref={text2Ref} className={cn("select-none", textClassName)} style={{ opacity: "100%", fontFamily: "inherit" }} />
      </div>
    </div>
  );
}
