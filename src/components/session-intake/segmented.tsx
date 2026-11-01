"use client";

import clsx from "clsx";

interface SegmentedProps<T extends string> {
  label: string;
  options: { value: T; label: React.ReactNode; name?: string }[];
  value: T;
  onChange: (value: T) => void;
  stretch?: boolean;
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  stretch = false,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={clsx(
        "rounded-md bg-raised p-0.5",
        stretch ? "grid" : "inline-flex",
      )}
      style={stretch ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` } : undefined}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.name}
            onClick={() => onChange(option.value)}
            className={clsx(
              "h-8 whitespace-nowrap rounded-[5px] px-3 text-[13px] tabular-nums transition-colors",
              selected
                ? "bg-surface font-medium text-ink ring-1 ring-border"
                : "text-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
