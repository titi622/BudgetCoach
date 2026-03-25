## Quick orientation for AI coding agents

This repository is a Vite + React + TypeScript single-page app (SPA) with Tailwind-based UI primitives. Below are the minimal facts and examples an assistant needs to be immediately productive.

- Project entry points
  - App entry: `src/main.tsx` — renders `<App />`.
  - App wrapper: `src/App.tsx` — mounts React Router using `router` from `src/app/router.tsx`.

- Routing and pages
  - Routes are defined in `src/app/router.tsx` (react-router v7 createBrowserRouter). Example routes: `/` -> `LoginPage`, `/home` -> `HomePage`, `/add/:category` -> `AssetInputPage`.
  - Pages live in `src/pages/` (e.g., `LoginPage.tsx`, `HomePage.tsx`, `AssetInputPage.tsx`). Use these as canonical examples for layout, styling, and interactions.

- Components and UI primitives
  - Reusable UI components are under `src/components/` and low-level design tokens/primitives under `src/components/ui/` (e.g., `button.tsx`, `card.tsx`, `input.tsx`). Follow existing patterns: forwardRef, VariantProps (class-variance-authority), and `cn()` from `src/lib/utils.ts`.
  - Styling is Tailwind CSS. The project uses utility-first classes extensively and uses `twMerge` via `cn()` to combine classes safely.

- Path alias and TypeScript
  - Path alias `@/*` -> `src/*` is configured in `tsconfig.json`. Use imports like `@/components/...` when modifying or adding files.

- Build, dev and lint commands (source: `package.json`)
  - dev (HMR): `npm run dev` (runs `vite`).
  - build: `npm run build` (runs `tsc -b` then `vite build`).
  - preview: `npm run preview` (vite preview).
  - lint: `npm run lint` (runs `eslint .`).

- Conventions and patterns to follow
  - UI components follow a consistent pattern: export of component + variants via `cva` and `VariantProps`. Keep this pattern for new primitives.
  - Use Tailwind utility classes (no global CSS overrides). When merging classes, call `cn(...)` from `src/lib/utils.ts`.
  - Prefer composition over duplication: small primitives (Button, Input, Card) are used to build larger pieces (`AppSidebar`, `SiteHeader`, `SectionCards`). Reuse them.
  - Routing is centralized in `src/app/router.tsx`. Add routes there and place pages in `src/pages/`.

- Data and fixtures
  - Local JSON fixture examples: `src/pages/data.json` and `src/app/dashboard/data.json` — helpful for mocking props in component stories or unit tests.

- External integrations & libs to be aware of
  - Tailwind CSS, Radix UI primitives, class-variance-authority, react-router-dom v7, @dnd-kit for drag/drop, recharts for charts, zod for validation.
  - No backend code in this repo — network/IO is not present in source files; treat data as client-side fixtures unless the user adds APIs.

- When making edits or PRs
  - Run `npm run lint` and `npm run build` locally (TypeScript build is required by `npm run build` via `tsc -b`).
  - Keep changes small and component-scoped. Follow existing file structure under `src/components` and `src/pages`.

- Examples for common edits
  - Add a new page: create `src/pages/YourPage.tsx`, export default or named component, then add `{ path: '/yourpath', element: <YourPage /> }` to `src/app/router.tsx`.
  - Add a UI primitive: create `src/components/ui/<name>.tsx` following `button.tsx` pattern (forwardRef, VariantProps, export variants and component).

If any part of this guidance is unclear or you'd like more detail (tests, CI/CD, or conventions not detectible from code), tell me which area to expand and I will iterate.
