import {
  calculateCost,
  calculateElapsedSeconds,
  formatDuration,
  snapToFrame,
} from "@/lib/timer-utils";
import { describe, expect, it } from "vitest";

describe("timer utilities", () => {
  it("calculates elapsed seconds with no pauses", () => {
    const elapsed = calculateElapsedSeconds(10_000, 1_000, 0);
    expect(elapsed).toBeCloseTo(9);
  });

  it("subtracts paused offset accurately for rapid pauses", () => {
    const pausedOffset = 1_500; // 1.5 seconds paused
    const elapsed = calculateElapsedSeconds(6_000, 0, pausedOffset);
    expect(elapsed).toBeCloseTo(4.5);
  });

  it("handles backgrounded tabs by clamping negatives", () => {
    const elapsed = calculateElapsedSeconds(50, 100, 0);
    expect(elapsed).toBe(0);
  });

  it("derives cost from elapsed time", () => {
    const elapsed = 120.4567;
    const cost = calculateCost(elapsed, 4.25);
    expect(cost).toBeCloseTo(511.940975, 6);
  });

  it("snaps frames near 30fps", () => {
    expect(snapToFrame(40, 0)).toBe(true);
    expect(snapToFrame(10, 0)).toBe(false);
  });

  it("formats duration to HH:MM:SS", () => {
    expect(formatDuration(0)).toBe("00:00:00");
    expect(formatDuration(65)).toBe("00:01:05");
    expect(formatDuration(3661)).toBe("01:01:01");
  });
});
