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
      <p className="text-sm text-white/50">Participants</p>
      <div className="mt-3 flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/20 bg-black/30 p-2">
        <AccentButton ariaLabel="Decrease participants" onClick={onDecrease} color="rose">
          −
        </AccentButton>
        <input
          ref={ref}
          type="number"
          className="flex-1 min-w-0 bg-transparent text-center text-3xl font-semibold text-white outline-none"
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
