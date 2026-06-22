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

// CSS-only crossfade: opacity + transform, no rAF blur loop, no SVG filter.
// rAF-driven filter: blur() inside SVG feColorMatrix blocks Safari's main thread
// and causes video stutter. opacity/transform are always compositor-accelerated.
export function ScrollGooeyText({
  texts,
  activeIndex,
  morphTime = 0.55,
  className,
  textClassName,
}: ScrollGooeyTextProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {texts.map((text, i) => (
          <span
            key={text}
            className={cn(
              "select-none",
              i === 0 ? "block" : "absolute inset-0 block",
              textClassName
            )}
            style={{
              fontFamily: "inherit",
              opacity: i === activeIndex ? 1 : 0,
              transform: i === activeIndex ? "translateY(0)" : "translateY(8px)",
              transition: `opacity ${morphTime}s cubic-bezier(0.4,0,0.2,1), transform ${morphTime}s cubic-bezier(0.4,0,0.2,1)`,
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
