# Vardium_Frontend

Frontend POC code for the vadium crm solution

German and English website of Vardium, an independent finance and insurance broker in Hamburg: home page, about us, depot page and eight finance calculators (2026 tax values).

## Tech stack

- React 19 with the React Compiler, TypeScript, Vite
- Tailwind CSS v4 and shadcn/ui (Base UI)
- React Router, React Hook Form and Zod
- Vitest for the calculator tests

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command                | What it does                                                    |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Starts the development server                                   |
| `npm run build`        | Type-checks and builds for production                           |
| `npm run lint`         | Runs ESLint                                                     |
| `npm test`             | Runs the calculator tests (incl. BMF wage-tax reference cases)  |
| `npm run fixtures:bmf` | Re-downloads the official BMF wage-tax reference data (yearly)  |

## Project structure

```
src/
  app/          router and app wiring
  components/   ui (shadcn), common (reusable), layout (header, footer, ...)
  features/     home, about, depot, contact, calculators
  i18n/         de and en texts, language provider
  pages/        page components
```

Texts live in `src/i18n/locales` (`de.ts` defines the shape, `en.ts` must match it).
Yearly tax and social-security values live in `src/features/calculators/parameters`.
