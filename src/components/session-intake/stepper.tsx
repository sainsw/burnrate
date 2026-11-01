"use client";

import { type Ref, useId } from "react";

interface StepperProps {
  label: string;
  value: string;
  onChange: (raw: string) => void;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  prefix?: string;
  suffix?: string;
  description?: string;
  aside?: React.ReactNode;
  inputRef?: Ref<HTMLInputElement>;
}

const stepButton =
  "flex h-11 w-11 flex-none items-center justify-center rounded-md text-ink transition-colors hover:bg-raised active:bg-active";

export function Stepper({
  label,
  value,
  onChange,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  prefix,
  suffix,
  description,
  aside,
  inputRef,
}: StepperProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div>
      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-[14px] font-medium text-ink">
          {label}
        </label>
        {aside}
      </div>
      <div className="mt-2 flex items-center gap-1 rounded-md border border-control bg-surface p-1 focus-within:border-ink">
        <button
          type="button"
          className={stepButton}
          onClick={onDecrease}
          aria-label={decreaseLabel}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <div className="flex min-w-0 flex-1 items-baseline justify-center gap-1 text-[24px] font-medium tabular-nums">
          {prefix && <span className="text-muted">{prefix}</span>}
          <input
            ref={inputRef}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-describedby={descriptionId}
            className="w-full min-w-0 bg-transparent text-center outline-none focus-visible:outline-none"
            style={{ maxWidth: `${Math.max(value.length, 1) + 1}ch` }}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          {suffix && <span className="text-[14px] font-normal text-muted">{suffix}</span>}
        </div>
        <button
          type="button"
          className={stepButton}
          onClick={onIncrease}
          aria-label={increaseLabel}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      {description && (
        <p id={descriptionId} className="mt-2 text-[13px] text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
