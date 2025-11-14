import type { SalaryUnit } from "@/types/session";

const WORK_HOURS_PER_YEAR = 2080;
const SECONDS_PER_HOUR = 3600;

export function toPerSecondSalary(
  inputSalary: number,
  unit: SalaryUnit,
): number {
  if (inputSalary <= 0) return 0;
  const hourly =
    unit === "annual" ? inputSalary / WORK_HOURS_PER_YEAR : inputSalary;
  return hourly / SECONDS_PER_HOUR;
}

export function buildSessionSalaryPerSecond(
  participants: number,
  inputSalary: number,
  unit: SalaryUnit,
): number {
  const perPerson = toPerSecondSalary(inputSalary, unit);
  return perPerson * participants;
}
