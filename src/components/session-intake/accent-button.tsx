"use client";

import clsx from "clsx";
import { ReactNode } from "react";

export type AccentColor = "rose" | "teal" | "indigo" | "lime";

interface AccentButtonProps {
  onClick: () => void;
  ariaLabel: string;
  color: AccentColor;
  children: ReactNode;
}

export function AccentButton({ onClick, ariaLabel, color, children }: AccentButtonProps) {
  const styles: Record<AccentColor, string> = {
    rose: "bg-rose-500/90 text-white shadow-[0_0_15px_rgba(255,99,132,0.45)] hover:bg-rose-500/100 focus-visible:outline-rose-300",
    teal: "bg-teal-400/90 text-white shadow-[0_0_15px_rgba(45,212,191,0.45)] hover:bg-teal-400/100 focus-visible:outline-teal-200",
    indigo: "bg-indigo-500/90 text-white shadow-[0_0_15px_rgba(129,140,248,0.45)] hover:bg-indigo-500/100 focus-visible:outline-indigo-200",
    lime: "bg-lime-400/90 text-slate-950 shadow-[0_0_15px_rgba(134,239,172,0.45)] hover:bg-lime-400/100 focus-visible:outline-lime-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={clsx(
        "h-12 w-12 flex-shrink-0 rounded-2xl text-2xl font-semibold transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        styles[color],
      )}
    >
      {children}
    </button>
  );
}
