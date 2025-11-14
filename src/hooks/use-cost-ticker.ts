"use client";

import { useEffect } from "react";
import { useTimerStore } from "@/state/timer-store";
import { FRAME_INTERVAL_MS, calculateElapsedSeconds } from "@/lib/timer-utils";

export function useCostTicker() {
  const status = useTimerStore((state) => state.status);
  const startTime = useTimerStore((state) => state.startTime);
  const updateMetrics = useTimerStore((state) => state.updateMetrics);

  useEffect(() => {
    if (status !== "running" || startTime === null) {
      return;
    }

    let frameId: number;
    let lastUpdate = 0;

    const tick = () => {
      const now = performance.now();
      if (now - lastUpdate >= FRAME_INTERVAL_MS) {
        const elapsedSeconds = calculateElapsedSeconds(
          now,
          startTime,
          useTimerStore.getState().pausedOffset,
        );
        updateMetrics(elapsedSeconds);
        lastUpdate = now;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [status, startTime, updateMetrics]);
}
