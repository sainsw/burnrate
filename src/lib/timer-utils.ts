export const FRAME_INTERVAL_MS = 1000 / 30; // ~33ms target for 30fps

export function calculateElapsedSeconds(
  now: number,
  startTime: number,
  pausedOffset = 0,
): number {
  const delta = Math.max(now - startTime - pausedOffset, 0);
  return delta / 1000;
}

export function calculateCost(
  elapsedSeconds: number,
  salaryPerSecond: number,
): number {
  return elapsedSeconds * salaryPerSecond;
}

export function snapToFrame(
  now: number,
  lastFrameTime: number,
  intervalMs = FRAME_INTERVAL_MS,
) {
  return now - lastFrameTime >= intervalMs;
}

export function formatDuration(seconds: number): string {
  const clamped = Math.max(seconds, 0);
  const hrs = Math.floor(clamped / 3600)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((clamped % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(clamped % 60)
    .toString()
    .padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}
