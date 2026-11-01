import { formatCurrency } from "@/lib/currency";

interface FuseProps {
  elapsedSeconds: number;
  ratePerSecond: number;
  currency: string;
}

function tickStepMinutes(spanHours: number) {
  if (spanHours <= 1) return 15;
  if (spanHours <= 2) return 30;
  return 60;
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

/**
 * A track one hour long (stretching to the next whole hour once a meeting
 * runs past it). The burned part is the elapsed time; each tick names what
 * the meeting costs once it reaches that point.
 */
export function Fuse({ elapsedSeconds, ratePerSecond, currency }: FuseProps) {
  const spanHours = Math.max(1, Math.ceil(elapsedSeconds / 3600));
  const spanSeconds = spanHours * 3600;
  const step = tickStepMinutes(spanHours);
  const ticks: number[] = [];
  for (let m = step; m <= spanHours * 60; m += step) ticks.push(m);
  const burned = Math.min(elapsedSeconds / spanSeconds, 1);

  return (
    <div>
      <div
        className="relative h-2 overflow-hidden rounded-full bg-ember-track"
        role="progressbar"
        aria-label={`Time used of ${formatMinutes(spanHours * 60)}`}
        aria-valuemin={0}
        aria-valuemax={spanSeconds}
        aria-valuenow={Math.round(elapsedSeconds)}
        aria-valuetext={`${Math.floor(elapsedSeconds / 60)} of ${spanHours * 60} minutes`}
      >
        <div
          className="absolute inset-y-0 left-0 origin-left rounded-full bg-ember"
          style={{ width: "100%", transform: `scaleX(${burned})` }}
        />
        {ticks.slice(0, -1).map((m) => (
          <span
            key={m}
            className="absolute inset-y-0 w-0.5 bg-surface"
            style={{ left: `${(m / (spanHours * 60)) * 100}%` }}
          />
        ))}
      </div>
      <ol className="relative mt-3 h-10" aria-label="Cost at each point">
        {ticks.map((m, i) => {
          const isLast = i === ticks.length - 1;
          const reached = elapsedSeconds >= m * 60;
          const phoneHidden = !isLast && i % 2 === 0 && ticks.length > 2;
          return (
            <li
              key={m}
              className={`absolute top-0 flex-col whitespace-nowrap tabular-nums ${phoneHidden ? "hidden sm:flex" : "flex"} ${isLast ? "right-0 items-end" : "-translate-x-1/2 items-center"}`}
              style={isLast ? undefined : { left: `${(m / (spanHours * 60)) * 100}%` }}
            >
              <span className="text-[12px] text-muted">{formatMinutes(m)}</span>
              <span
                className={`text-[14px] ${reached ? "text-ink font-medium" : "text-muted"}`}
              >
                {formatCurrency(m * 60 * ratePerSecond, currency, 2)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
