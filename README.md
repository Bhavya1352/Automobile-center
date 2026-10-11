# AutoSphere — independent car service centre

A front-end for an independent automotive service centre: service catalogue,
AI-assisted symptom triage, vehicle health records, booking entry points and
customer/workshop dashboards.

## Design

The interface is light, editorial and typographic. Photography and type carry
the page; sections are separated by hairline rules rather than floating cards.

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F5F3EE` | Page ground |
| `surface` | `#FFFFFF` | Panels, tables |
| `sand` | `#ECE9E1` | Alternating section bands |
| `ink` | `#171A18` | Primary text |
| `muted` | `#666862` | Secondary text |
| `forest` | `#183F35` | Primary actions, the closing band |
| `clay` | `#C76B32` | Accent: urgency, emphasis, hover |
| `line` | `#D9D7D0` | Hairline borders |

**Type** — [Fraunces](https://fonts.google.com/specimen/Fraunces) for display
(`SOFT`/`WONK` at 0 for a crisp editorial cut), [IBM Plex
Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) for body, IBM Plex Mono
for technical readouts (odometer, registration, measurements).

**Rules the design holds to** — no dark theme, no glassmorphism, no glow, no
decorative gradients, corner radii of 1–4px only, no icon-in-a-square per
feature, no eyebrow pill above every heading, and no repeated three-column card
grid. Section composition alternates between asymmetric, grid and full-bleed so
no two consecutive sections read the same way.

## Stack

- **React 19** with TypeScript 5.9 in `strict` mode
- **Vite 7**
- **Tailwind CSS v4** — tokens declared in the `@theme` block of
  `src/index.css`; there is deliberately no `tailwind.config.js`
- **React Router 7**, **Framer Motion**, **Lucide**

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint
```

## Structure

```
src/
├── components/   Shell: Navbar, Footer, Layout, PageHero, ErrorBoundary…
├── sections/     Homepage sections, one file each
├── pages/        Routed pages
├── data/         homeData.ts (homepage content), carsData, siteData
├── context/      Inventory, Toast
├── hooks/        useDebounce, useFilterParams
├── lib/          cn() class-merge helper
└── services/     carService — mock API boundary
```

Homepage sections compose in `src/pages/Home.tsx`: Hero → Accreditations →
Services → HowItWorks → AiCheck → VehicleHealth → Trust → Pricing →
Testimonials → FAQ → ClosingCta.

## The AI vehicle check

Presented as a product feature, not decoration. The owner describes a symptom in
plain language; the check reads it against the vehicle's service history and
common faults for the model, then returns a likely cause, the evidence it used,
an urgency level, and a recommended service that hands off into booking.

The UI states plainly that it is an AI-assisted recommendation rather than a
mechanical diagnosis, and that a technician confirms the cause before any work
is quoted. The content currently ships as a worked example in
`src/data/homeData.ts`; wiring it to a real model is a backend task.

## Known gaps

- Forms (contact, registration) are not yet wired to a backend.
- The customer and workshop dashboards are migrated to the new palette but
  still use the previous dashboard layout and hardcoded data.
- `carsData.ts` is a vehicle showcase, not the service domain model.
