"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { Fuse } from "@/components/fuse";
import { useLocaleCurrency } from "@/hooks/use-locale-currency";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";
import {
  buildSessionSalaryPerSecond,
  WORK_HOURS_PER_YEAR,
} from "@/lib/session";
import { useSessionStore } from "@/state/session-store";
import { useTimerStore } from "@/state/timer-store";
import type { SalaryUnit } from "@/types/session";
import { Segmented } from "./session-intake/segmented";
import { Stepper } from "./session-intake/stepper";

const DEFAULT_PARTICIPANTS = 5;
const DEFAULT_ANNUAL_SALARY = 50000;
const DEFAULT_HOURLY_RATE = 65;
const ANNUAL_STEP = 5000;
const HOURLY_STEP = 5;

export const currencyOptions = ["USD", "EUR", "GBP", "JPY", "INR"] as const;

const unitOptions: { value: SalaryUnit; label: string }[] = [
  { value: "annual", label: "A year" },
  { value: "hourly", label: "An hour" },
];

function parseWholeNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits === "" ? 0 : Number(digits);
}

export function SessionIntakeForm() {
  const resetCounter = useSessionStore((state) => state.resetCounter);
  const localeCurrency = useLocaleCurrency();
  const key = `${resetCounter}-${localeCurrency}`;

  return <SessionIntakeFormInner key={key} localeCurrency={localeCurrency} />;
}

function SessionIntakeFormInner({ localeCurrency }: { localeCurrency: string }) {
  const initialCurrency = (currencyOptions as readonly string[]).includes(
    localeCurrency,
  )
    ? localeCurrency
    : "USD";
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [salary, setSalary] = useState(DEFAULT_ANNUAL_SALARY);
  const [unit, setUnit] = useState<SalaryUnit>("annual");
  const [currency, setCurrency] = useState<string>(initialCurrency);
  const [error, setError] = useState<string | null>(null);
  const participantsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => participantsRef.current?.focus());
  }, []);

  const setSession = useSessionStore((state) => state.setSession);
  const resetTimer = useTimerStore((state) => state.reset);

  const isValid = participants >= 1 && salary > 0;
  const salaryStep = unit === "annual" ? ANNUAL_STEP : HOURLY_STEP;
  const ratePerSecond = isValid
    ? buildSessionSalaryPerSecond(participants, salary, unit)
    : 0;
  const perPersonHourly =
    participants > 0 ? (ratePerSecond * 3600) / participants : 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      setError("Add at least one person and a pay figure above zero.");
      return;
    }
    setError(null);
    resetTimer();
    setSession({
      participants,
      salaryPerSecond: ratePerSecond,
      currency,
      salaryInput: salary,
      salaryUnit: unit,
    });
  };

  const money = (value: number) => formatCurrency(value, currency, 2);

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-start gap-3 lg:grid-cols-[7fr_5fr]"
    >
      <section
        aria-labelledby="room-heading"
        className="rounded-lg border border-border bg-surface p-5 sm:p-6"
      >
        <h2 id="room-heading" className="text-[16px] font-medium">
          Who is in the room
        </h2>
        <div className="mt-5 grid gap-6">
          <Stepper
            label="People"
            value={String(participants)}
            inputRef={participantsRef}
            onChange={(raw) => setParticipants(Math.max(1, parseWholeNumber(raw)))}
            onDecrease={() => setParticipants((prev) => Math.max(1, prev - 1))}
            onIncrease={() => setParticipants((prev) => prev + 1)}
            decreaseLabel="One fewer person"
            increaseLabel="One more person"
            suffix={participants === 1 ? "person" : "people"}
          />
          <Stepper
            label="Average pay, before tax"
            value={salary.toLocaleString("en-US")}
            prefix={getCurrencySymbol(currency)}
            onChange={(raw) => setSalary(parseWholeNumber(raw))}
            onDecrease={() => setSalary((prev) => Math.max(0, prev - salaryStep))}
            onIncrease={() => setSalary((prev) => prev + salaryStep)}
            decreaseLabel={`Lower pay by ${salaryStep.toLocaleString("en-US")}`}
            increaseLabel={`Raise pay by ${salaryStep.toLocaleString("en-US")}`}
            suffix={unit === "annual" ? "a year" : "an hour"}
            aside={
              <Segmented
                label="Pay period"
                options={unitOptions}
                value={unit}
                onChange={(value) => {
                  if (value === unit) return;
                  setUnit(value);
                  setSalary(
                    value === "annual" ? DEFAULT_ANNUAL_SALARY : DEFAULT_HOURLY_RATE,
                  );
                }}
              />
            }
          />
          <div>
            <p id="currency-label" className="text-[14px] font-medium">
              Currency
            </p>
            <div className="mt-2">
              <Segmented
                label="Currency"
                stretch
                options={currencyOptions.map((code) => ({
                  value: code,
                  name: code,
                  label: (
                    <>
                      <span aria-hidden="true" className="text-ink">
                        {getCurrencySymbol(code)}
                      </span>{" "}
                      <span aria-hidden="true" className="hidden sm:inline">
                        {code}
                      </span>
                    </>
                  ),
                }))}
                value={currency}
                onChange={setCurrency}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-5 text-[14px] text-negative" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid}
          className="mt-6 h-11 w-full rounded-md bg-primary px-5 text-[15px] font-medium text-on-primary transition-opacity hover:opacity-85 active:opacity-75 disabled:cursor-not-allowed disabled:bg-raised disabled:text-muted"
        >
          Start meeting
        </button>
      </section>

      <section
        aria-labelledby="estimate-heading"
        className="rounded-lg border border-border bg-surface p-5 sm:p-6"
      >
        <h2 id="estimate-heading" className="text-[16px] font-medium">
          What it will cost
        </h2>
        <p className="mt-4 flex items-baseline gap-2 tabular-nums">
          <span className="text-[30px] font-bold leading-9">
            {money(ratePerSecond * 60)}
          </span>
          <span className="text-muted">a minute</span>
        </p>
        <dl className="mt-4 text-[14px] tabular-nums">
          {[
            ["An hour, the whole room", money(ratePerSecond * 3600)],
            ["An hour, each person", money(perPersonHourly)],
            ["A minute, each person", money(perPersonHourly / 60)],
            ["Every second", formatCurrency(ratePerSecond, currency, 4)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex h-10 items-center justify-between border-t border-rule"
            >
              <dt className="text-muted">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mt-6 text-[14px] font-medium">Over the first hour</h3>
        <div className="mt-3">
          <Fuse elapsedSeconds={0} ratePerSecond={ratePerSecond} currency={currency} />
        </div>
        <p className="mt-4 text-[12px] text-muted">
          A yearly figure is spread over {WORK_HOURS_PER_YEAR.toLocaleString("en-US")}{" "}
          working hours (40 a week, 52 weeks).
        </p>
      </section>
    </form>
  );
}
