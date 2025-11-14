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
      <p className="text-sm text-white/50">Currency</p>
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/30">
        <div
          className="absolute inset-y-0 rounded-2xl bg-white/20 transition-all duration-200"
          style={{
            width: `${sliderWidth}%`,
            left: `${currencyIndex * sliderWidth}%`,
          }}
        />
        <div className="grid grid-cols-5 text-center text-sm font-semibold text-white">
          {currencyOptions.map((option, index) => (
            <button
              type="button"
              key={option.code}
              className={clsx(
                "relative z-10 px-2 py-4 transition",
                currencyIndex === index
                  ? "text-white"
                  : "text-white/60 hover:text-white",
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
