"use client";

import clsx from "clsx";

export const currencyOptions = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "INR", symbol: "₹" },
];

interface CurrencySliderProps {
  currencyIndex: number;
  sliderWidth: number;
  onChange: (index: number) => void;
}

export function CurrencySlider({ currencyIndex, sliderWidth, onChange }: CurrencySliderProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-500 dark:text-white/50">Currency</p>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/15 dark:bg-black/30 dark:shadow-none">
        <div
          className="absolute inset-y-0 rounded-2xl bg-slate-900/5 transition-all duration-200 dark:bg-white/20"
          style={{
            width: `${sliderWidth}%`,
            left: `${currencyIndex * sliderWidth}%`,
          }}
        />
        <div className="grid grid-cols-5 text-center text-sm font-semibold text-slate-600 dark:text-white">
          {currencyOptions.map((option, index) => (
            <button
              type="button"
              key={option.code}
              className={clsx(
                "relative z-10 px-2 py-4 transition",
                currencyIndex === index
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white",
              )}
              onClick={() => onChange(index)}
            >
              <span aria-hidden="true" className="text-2xl">
                {option.symbol}
              </span>
              <span className="sr-only">{option.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
