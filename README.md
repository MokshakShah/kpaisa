# Skyward Booking

Skyward Booking is a polished airline seat-selection experience built with React, TypeScript, and Vite. It demonstrates a complete client-side booking flow: passenger management, interactive aircraft layouts, seat assignment, dynamic pricing, optional meals, persistence, undo, recommendations, and a final confirmation state.

## Live demo

**Production:** [kpaisa.vercel.app](https://kpaisa-internship.vercel.app/)

## Features

- Passenger count management for 1–4 passengers.
- Explicit passenger-first seat assignment.
- Interactive `3–2` and `2–3–2` aircraft layouts.
- Row numbers, seat labels, aisle spacing, occupied seats, and responsive horizontal scrolling.
- Standard, Premium, and Extra legroom seat categories.
- Seat hover details with category and price.
- One unique seat per passenger, with reassignment and removal.
- Smart seat recommendation based on availability and the passenger's current row.
- “Keep passengers together” assignment for unseated passengers.
- Optional vegetarian and non-vegetarian meals with free and paid choices.
- Detailed passenger, seat, meal, tax, and total price breakdown.
- Undo for the last booking change.
- LocalStorage persistence across reloads.
- Booking progress indicator and confirmation screen.
- Responsive desktop, tablet, and mobile layouts.

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The production commands are:

```bash
npm run test
npm run build
npm run preview
```

## Project structure

```text
src/
├── components/
│   ├── Header.tsx       # Airline header and route context
│   └── Icon.tsx         # Shared inline SVG icons
├── utils/
│   ├── bookingStorage.ts # Safe LocalStorage load/save helpers
│   ├── seatPricing.ts    # Seat category and pricing rules
│   └── seatPricing.test.ts
├── App.tsx              # Booking flow composition and state owner
├── main.tsx             # React entry point
├── styles.css           # Design system and responsive styling
└── types.ts             # Shared domain types
```

## State management and data flow

`App` owns the booking state intentionally. This keeps passenger-seat ownership unambiguous and avoids conflicting state between the passenger list, seat map, and summary.

- `passengers` is the source of truth for passenger identity and seat assignments.
- `activePassengerId` controls who receives the next seat or meal selection.
- `passengerMeals` maps one optional meal ID to each passenger ID.
- `layout` changes only the rendered seat groups; it never mutates assignments.
- `history` stores the last ten booking snapshots for undo.
- `confirmed` controls the final confirmation view.

Derived values are calculated from state rather than duplicated:

- Assigned seats come from `passengers`.
- Seat charges use unique assigned-seat IDs.
- Meal charges come from `passengerMeals`.
- The final total combines flight fare, taxes, seat charges, and meal charges.
- Continue is disabled until every passenger has a seat.

## Assignment rules

1. A passenger must be selected before a seat can be clicked.
2. Selecting a free seat assigns it to the active passenger.
3. Selecting another seat replaces the active passenger's previous seat.
4. A seat assigned to another passenger is disabled.
5. Clicking the active seat removes the assignment.
6. Switching passengers preserves every existing assignment.
7. Switching layouts preserves valid assignments.

These rules are enforced by deriving seat availability from the `passengers` array. The UI does not maintain a second seat ownership registry.

## Performance and quality decisions

- `SeatMap` is memoized with `React.memo`.
- Assigned seats and price totals use `useMemo`.
- Seat assignment callbacks use `useCallback` to reduce child re-renders.
- Seat ownership uses a `Set` for constant-time membership checks.
- Persistence is isolated in a typed utility with malformed-storage fallback behavior.
- No runtime routing or state-management dependency is required for this single-screen flow.
- Production dependencies are intentionally minimal: React and React DOM.

## Testing

The current automated suite covers the pricing contract, including free seats and paid categories:

```bash
npm run test
```

The production build includes TypeScript checking:

```bash
npm run build
```

## Deployment

The app is deployed with Vercel:

```bash
npx vercel --prod
```

Vite outputs the production bundle to `dist/`, which Vercel serves as the static application.
