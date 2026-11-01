# BurnRate

BurnRate is a privacy-first, single-page meeting cost estimator built with Next.js 16, Tailwind CSS 4, and client-side state. It keeps all math on the device, keeps inputs minimal, and surfaces a live cost meter, shareable recap, and clear reset flow without extra routes.  
Live demo: https://burnrate.ainsworth.dev

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The app has one screen with three states:

- **New meeting**: steppers for people and average pay (a year or an hour), a currency switch, and a live estimate beside them: the cost a minute, an hour, each person, and over the first hour.
- **Meeting in progress**: the cost so far set large enough to read across a table, time, cost a minute and each person, the next quarter-hour mark and when it lands, and the fuse: a one-hour track that burns as the meeting runs. Pause, resume, or stop and recap.
- **Meeting recap**: the final cost, a sentence to copy or share, and "Start new meeting" to clear everything.

The look follows an achromatic ledger: Geist, ink on white (true black in dark mode), 1px borders instead of shadows, and the brand rose only on the burned part of the fuse.

## Testing

- `npm run lint` – Biome
- `npm run test:unit` – Vitest runs the timer math suite
- `npm run test:e2e` – Playwright executes the happy path (automatically runs `npm run dev`)

## Notes

- Zustand stores under `src/state` hold only the current session and timers; calling “Start new session” clears them immediately.
- Helper modules like `src/lib/currency.ts`, `src/lib/session.ts`, and `src/lib/timer-utils.ts` keep the Cost & Timer logic pure and testable.
- The UI reuses Tailwind classes for tabular digits, reduced opacity decimals, and big touch targets so the live meter stays stable and responsive.
- Metadata falls back to `https://burnrate.ainsworth.dev`; override `NEXT_PUBLIC_SITE_URL` if you deploy somewhere else so OpenGraph/Twitter cards stay accurate.
