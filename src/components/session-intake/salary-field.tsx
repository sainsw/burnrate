"use client";

import { SalaryUnit } from "@/types/session";
import clsx from "clsx";
import { AccentButton } from "./accent-button";

const salaryUnitLabels: Record<SalaryUnit, string> = {
  annual: "Annual salary",
  hourly: "Hourly rate",
};

type InputChangeHandler = (value: number) => void;

interface SalaryFieldProps {
  unit: SalaryUnit;
  salary: number;
  salaryStep: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: InputChangeHandler;
  onUnitChange: (value: SalaryUnit) => void;
}

export function SalaryField({
  unit,
  salary,
  salaryStep,
  onDecrease,
  onIncrease,
  onChange,
  onUnitChange,
}: SalaryFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-white/50">Salary</p>
        <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-white/70">
          {(Object.keys(salaryUnitLabels) as SalaryUnit[]).map((value) => (
            <button
              key={value}
              type="button"
              className={clsx(
                "rounded-full px-3 py-1 transition",
                unit === value
                  ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-black dark:shadow"
                  : "text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white",
              )}
              onClick={() => onUnitChange(value)}
            >
              {salaryUnitLabels[value]}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/20 dark:bg-black/30 dark:shadow-none">
        <AccentButton ariaLabel="Decrease salary" onClick={onDecrease} color="indigo">
          −
        </AccentButton>
        <input
          type="number"
          className="flex-1 min-w-0 bg-transparent text-center text-3xl font-semibold text-slate-900 outline-none dark:text-white"
          min={0}
          step={salaryStep}
          value={salary}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <AccentButton ariaLabel="Increase salary" onClick={onIncrease} color="lime">
          +
        </AccentButton>
      </div>
    </div>
  );
}
