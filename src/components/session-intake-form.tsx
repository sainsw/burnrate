"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocaleCurrency } from "@/hooks/use-locale-currency";
import { buildSessionSalaryPerSecond } from "@/lib/session";
import { useSessionStore } from "@/state/session-store";
import { useTimerStore } from "@/state/timer-store";
import type { SalaryUnit } from "@/types/session";
import { ParticipantsField } from "./session-intake/participants-field";
import { SalaryField } from "./session-intake/salary-field";
import {
  CurrencySlider,
  currencyOptions,
} from "./session-intake/currency-slider";

const DEFAULT_PARTICIPANTS = 5;
const DEFAULT_ANNUAL_SALARY = 50000;
const DEFAULT_HOURLY_RATE = 65;
const ANNUAL_STEP = 5000;
const HOURLY_STEP = 5;

interface SessionIntakeFormProps {
  disabled?: boolean;
}

export function SessionIntakeForm({ disabled = false }: SessionIntakeFormProps) {
  const resetCounter = useSessionStore((state) => state.resetCounter);
  const localeCurrency = useLocaleCurrency();
  const key = `${resetCounter}-${localeCurrency}`;

  return (
    <SessionIntakeFormInner
      key={key}
      disabled={disabled}
      localeCurrency={localeCurrency}
    />
  );
}

interface SessionIntakeFormInnerProps {
  localeCurrency: string;
  disabled: boolean;
}

function SessionIntakeFormInner({
  localeCurrency,
  disabled,
}: SessionIntakeFormInnerProps) {
  const initialCurrencyIndex =
    currencyOptions.findIndex((option) => option.code === localeCurrency);
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [salary, setSalary] = useState(DEFAULT_ANNUAL_SALARY);
  const [unit, setUnit] = useState<SalaryUnit>("annual");
  const [currencyIndex, setCurrencyIndex] = useState(
    initialCurrencyIndex >= 0 ? initialCurrencyIndex : 0,
  );
  const [error, setError] = useState<string | null>(null);
  const participantsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => participantsRef.current?.focus());
  }, []);

  const setSession = useSessionStore((state) => state.setSession);
  const resetTimer = useTimerStore((state) => state.reset);

  const parsedCurrency = currencyOptions[currencyIndex];

  const parsedParticipants = Number(participants);
  const parsedSalary = Number(salary);

  const isValid = useMemo(() => {
    if (parsedParticipants < 1) return false;
    if (parsedSalary <= 0) return false;
    return true;
  }, [parsedParticipants, parsedSalary]);

  const adjustParticipants = (delta: number) =>
    setParticipants((prev) => Math.max(1, prev + delta));

  const salaryStep = unit === "annual" ? ANNUAL_STEP : HOURLY_STEP;
  const adjustSalary = (delta: number) =>
    setSalary((prev) => Math.max(0, prev + delta));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      setError("Please set at least 1 participant and a salary above 0.");
      return;
    }
    setError(null);

    const salaryPerSecond = buildSessionSalaryPerSecond(
      parsedParticipants,
      parsedSalary,
      unit,
    );

    resetTimer();
    setSession({
      participants: parsedParticipants,
      salaryPerSecond,
      currency: parsedCurrency.code,
      salaryInput: parsedSalary,
      salaryUnit: unit,
    });
  };

  const sliderWidth = 100 / currencyOptions.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl shadow-slate-200/70 backdrop-blur-lg dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-black/50"
    >
      <ParticipantsField
        ref={participantsRef}
        participants={participants}
        onDecrease={() => adjustParticipants(-1)}
        onIncrease={() => adjustParticipants(1)}
        onChange={(value) => setParticipants(Number.isNaN(value) ? 1 : Math.max(1, value))}
      />
      <SalaryField
        unit={unit}
        salary={salary}
        salaryStep={salaryStep}
        onIncrease={() => adjustSalary(salaryStep)}
        onDecrease={() => adjustSalary(-salaryStep)}
        onChange={(value) => setSalary(Number.isNaN(value) ? 0 : Math.max(0, value))}
        onUnitChange={(value) => {
          if (unit === value) return;
          setUnit(value);
          setSalary(value === "annual" ? DEFAULT_ANNUAL_SALARY : DEFAULT_HOURLY_RATE);
        }}
      />
      <CurrencySlider
        currencyIndex={currencyIndex}
        onChange={setCurrencyIndex}
        sliderWidth={sliderWidth}
      />

      {error && (
        <p className="text-sm font-semibold text-rose-600 dark:text-red-200" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-2xl bg-rose-500 px-4 py-3 text-lg font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-rose-300 disabled:text-white/80 dark:disabled:bg-white/20 dark:disabled:text-white/70"
        disabled={disabled || !isValid}
      >
        Start meeting
      </button>
    </form>
  );
}
