# BurnRate

BurnRate is a privacy-first, single-page meeting cost estimator built with Next.js 16, Tailwind CSS 4, and client-side state. It keeps all math on the device, keeps inputs minimal, and surfaces a live cost meter, shareable recap, and clear reset flow without extra routes.

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and use the touch-friendly controls:

- **Participants & salary** both expose large plus/minus buttons with 1-person minimum and $5,000 salary increments (defaulting to $50,000) so the values are easy to tap.
- **Currency selector** shows the top five symbols inside a sliding highlight, letting you choose your preferred ISO code without typing.
- **Live meter** appears beside the form, showing HH:MM:SS, total cost (split major/minor digits), and cost-per-minute along with Pause/Resume and Stop & Recap buttons.
- **Summary & share** lives below the meter after you stop the session so the copyable text and “Start new session” reset everything in-memory.

## Testing

- `npm run lint` – ESLint via the Next.js config
- `npm run test:unit` – Vitest runs the timer math suite
- `npm run test:e2e` – Playwright executes the happy path (automatically runs `npm run dev`)

## Notes

- Zustand stores under `src/state` hold only the current session and timers; calling “Start new session” clears them immediately.
- Helper modules like `src/lib/currency.ts`, `src/lib/session.ts`, and `src/lib/timer-utils.ts` keep the Cost & Timer logic pure and testable.
- The UI reuses Tailwind classes for tabular digits, reduced opacity decimals, and big touch targets so the live meter stays stable and responsive.
