"use client";

export type SalaryUnit = "annual" | "hourly";

export interface SessionPayload {
  participants: number;
  salaryPerSecond: number;
  currency: string;
  salaryInput: number;
  salaryUnit: SalaryUnit;
}

export interface SessionSnapshot {
  elapsedSeconds: number;
  totalCost: number;
  participants: number;
  currency: string;
}
