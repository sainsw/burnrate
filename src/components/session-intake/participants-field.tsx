"use client";

import { ForwardedRef, forwardRef } from "react";
import { AccentButton } from "./accent-button";

type InputChangeHandler = (value: number) => void;

interface ParticipantsFieldProps {
  participants: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: InputChangeHandler;
}

export const ParticipantsField = forwardRef(function ParticipantsField(
  { participants, onDecrease, onIncrease, onChange }: ParticipantsFieldProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <div>
      <p className="text-sm text-slate-500 dark:text-white/50">Participants</p>
      <div className="mt-3 flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/20 dark:bg-black/30 dark:shadow-none">
        <AccentButton ariaLabel="Decrease participants" onClick={onDecrease} color="rose">
          −
        </AccentButton>
        <input
          ref={ref}
          type="number"
          className="flex-1 min-w-0 bg-transparent text-center text-3xl font-semibold text-slate-900 outline-none dark:text-white"
          min={1}
          value={participants}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <AccentButton ariaLabel="Increase participants" onClick={onIncrease} color="teal">
          +
        </AccentButton>
      </div>
    </div>
  );
});
