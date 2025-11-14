# BurnRate Agent Blueprint

This document translates the v1.2 requirements into concrete “agent” responsibilities so contributors can reason about the minimal Next.js MVP as a collection of small, specialised workers. All agents run entirely client-side and coordinate through lightweight state (React, Zustand, or context) so the experience stays private, fast, and highly accurate.

## Agent Directory

### 1. Session Intake Agent (`/`)
- **Mission**: Capture meeting parameters in under five seconds while enforcing all validation rules.
- **Inputs**: Number of participants, average salary figure, unit toggle (annual/hourly), locale-derived currency.
- **Outputs**: Normalised session payload `{ participants, salaryPerSecond, currency }`.
- **Key rules**:
  - Participants ≥ 1, salary > 0, currency required; no optional inputs, history, or meeting names.
  - Annual salaries convert using 2,080 working hours/year, then divide by 3,600 for per-second cost.
  - Determines locale currency automatically but allows an explicit user override to avoid ambiguity.
  - Clears all form state once a session ends to maintain privacy.
- **Implementation notes**: Lives on the home route. Uses client components only. Provide focus management so a user can type values and hit “Start Meeting” immediately.

### 2. Cost & Timer Agent (`/run`)
- **Mission**: Maintain a drift-free timer and cost accumulator that powers the live meter.
- **Inputs**: Session payload from Session Intake Agent; pause/resume/stop commands.
- **Outputs**: High-frequency stream containing elapsed time, total cost (to four decimals), and cost-per-minute.
- **Key rules**:
  - Uses `performance.now()` deltas with stored `startTime` and `pausedOffset` instead of trusting `setInterval`.
  - Updates at 20–30 fps via `requestAnimationFrame` so low salaries still visibly tick up.
  - Guarantees ±10 ms accuracy even when backgrounded or the device locks.
  - All math is pure: `elapsedSeconds = (now - start - pausedOffset)/1000`, `cost = elapsedSeconds * salaryPerSecond`.
  - Pause/resume adjusts `pausedOffset`; stop freezes the stream and hands control to the Summary Agent.
- **Implementation notes**: Colocate logic with a custom hook or Zustand store to keep UI separate from timing math. Write Vitest coverage for edge cases (rapid pauses, background tab, rounding).

### 3. Display & Animation Agent (`/run` UI shell)
- **Mission**: Render the cost meter exactly as specified while remaining buttery smooth.
- **Inputs**: Stream from Cost & Timer Agent plus UI preferences (currency symbol, theme).
- **Outputs**: UI state for elapsed time (HH:MM:SS), total cost, cost/minute, and control button states.
- **Key rules**:
  - Total cost formatted to `toFixed(4)` then split: `major = value.slice(0, -2)`, `minor = value.slice(-2)`.
  - `minor` digits styled at 60–70% font size, lighter weight/opacity, baseline aligned, no spacing, using tabular/monospace digits to prevent jitter.
  - No flicker: leverage CSS transitions where helpful but avoid reflow-heavy DOM changes.
  - Buttons for Pause/Resume/Stop must respond instantly and reflect the timer state.
- **Implementation notes**: Tailwind utility classes should encode the typography rules (`text-xs opacity-70 align-baseline`). Use React memoisation or lightweight components so the 20–30 fps updates do not thrash the tree. Playwright tests should assert rendering of stopwatch digits and button behaviour.

### 4. Summary & Share Agent (`/summary`)
- **Mission**: Present an immediate recap once the session stops while keeping data ephemeral.
- **Inputs**: Final state snapshot (elapsed time, total cost, participant count) from Cost & Timer Agent.
- **Outputs**: Summary UI, cost-per-attendee (4 decimals), share payloads (text template, optional PNG).
- **Key rules**:
  - No history or backend storage; everything stays in-memory until “Start New Session”.
  - Provide “Share result” (copyable text + future hook for PNG export) and “Start New Session”.
  - Clearing inputs/state on “Start New Session” ensures privacy guarantees.
- **Implementation notes**: This agent is the best place to add disclaimers about indicative accuracy to set expectations. Hook into the routing transition back to `/` to wipe any lingering state.

## Agent Collaboration Flow
1. Session Intake Agent validates input, computes `salaryPerSecond`, and forwards the payload.
2. Cost & Timer Agent initialises timers on `/run`, emits state to subscribers, and listens for control events.
3. Display & Animation Agent consumes the live stream, formats values, and handles user controls.
4. On “Stop”, Cost & Timer Agent emits a final snapshot which Summary & Share Agent renders on `/summary`.
5. “Start New Session” routes back to `/`, triggering every agent to reset their state.

## Cross-Cutting Responsibilities
- **Privacy Guardrails**: All agents run client-side; never persist salaries or session stats; clear stores on teardown.
- **Performance**: Initial bundle must load <1.5 s on modern mobile, animation loop must hold 20–30 fps without jitter, and calculations maintain ±10 ms drift tolerance.
- **Compatibility**: Mobile-first layouts, modern browsers only, no backend dependency; PWA left for future versions.
- **Testing Hooks**: Vitest for the Cost & Timer Agent math; Playwright for the three-route happy path; Lighthouse for performance and accessibility budgets.

Keeping this blueprint aligned with the requirements document ensures everyone extends BurnRate without compromising the minimalist, high-clarity experience. Update the agent descriptions whenever the routes, constraints, or success criteria change.
