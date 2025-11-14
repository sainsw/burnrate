"use client";

import { create } from "zustand";
import type { SessionPayload, SessionSnapshot } from "@/types/session";
import { calculateElapsedSeconds } from "@/lib/timer-utils";
import { useSessionStore } from "@/state/session-store";

export type TimerStatus = "idle" | "running" | "paused" | "stopped";

interface TimerState {
  status: TimerStatus;
  startTime: number | null;
  pausedOffset: number;
  pausedStarted: number | null;
  elapsedSeconds: number;
  totalCost: number;
  costPerMinute: number;
  ratePerSecond: number;
  finalSnapshot: SessionSnapshot | null;
  start: (session: SessionPayload) => void;
  updateMetrics: (elapsedSeconds: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

const initialState = {
  status: "idle" as TimerStatus,
  startTime: null,
  pausedOffset: 0,
  pausedStarted: null,
  elapsedSeconds: 0,
  totalCost: 0,
  costPerMinute: 0,
  ratePerSecond: 0,
  finalSnapshot: null,
};

export const useTimerStore = create<TimerState>()((set, get) => ({
  ...initialState,
  start: (session) => {
    const now = performance.now();
    set({
      status: "running",
      startTime: now,
      pausedOffset: 0,
      pausedStarted: null,
      elapsedSeconds: 0,
      totalCost: 0,
      ratePerSecond: session.salaryPerSecond,
      costPerMinute: session.salaryPerSecond * 60,
      finalSnapshot: null,
    });
  },
  updateMetrics: (elapsedSeconds) => {
    const { ratePerSecond } = get();
    set({
      elapsedSeconds,
      totalCost: elapsedSeconds * ratePerSecond,
    });
  },
  pause: () => {
    const state = get();
    if (state.status !== "running" || state.startTime === null) return;

    const now = performance.now();
    const elapsedSeconds = calculateElapsedSeconds(
      now,
      state.startTime,
      state.pausedOffset,
    );

    set({
      status: "paused",
      pausedStarted: now,
      elapsedSeconds,
      totalCost: elapsedSeconds * state.ratePerSecond,
    });
  },
  resume: () => {
    const state = get();
    if (state.status !== "paused" || state.pausedStarted === null) return;
    const now = performance.now();
    set({
      status: "running",
      pausedOffset: state.pausedOffset + (now - state.pausedStarted),
      pausedStarted: null,
    });
  },
  stop: () => {
    const state = get();
    if (state.status === "idle" || !state.startTime) return;
    const now = performance.now();
    const effectivePausedOffset =
      state.pausedOffset +
      (state.pausedStarted ? now - state.pausedStarted : 0);
    const elapsedSeconds = calculateElapsedSeconds(
      now,
      state.startTime,
      effectivePausedOffset,
    );
    const totalCost = elapsedSeconds * state.ratePerSecond;
    const session = useSessionStore.getState().session;

    set({
      status: "stopped",
      pausedStarted: null,
      pausedOffset: effectivePausedOffset,
      elapsedSeconds,
      totalCost,
      finalSnapshot: session
        ? {
            elapsedSeconds,
            totalCost,
            participants: session.participants,
            currency: session.currency,
          }
        : null,
    });
  },
  reset: () => set({ ...initialState }),
}));
