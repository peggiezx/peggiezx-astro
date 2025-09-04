---
title: "Day 6: Bringing It to Life: Connecting Frontend & FastAPI"
pubDate: 2025-06-08
tags: ["FastAPI", "React", "Vite", "TypeScript", "SPA", "CircleShare"]
---

I’ve been living in FastAPI’s `/docs` for a while. It’s amazing for testing, but there’s a point where you want to **click real buttons**. A tiny web frontend lets you create an account, make a post, and delete it — and suddenly the backend you wrote _feels alive_.

The UI might be ugly at first, but that’s fine. Touching the product reveals the missing pieces (loading states, validation, friendly errors) in a way `/docs` never will.

## What _is_ the frontend (in 2025 terms)?

It’s no longer just static HTML/CSS. A modern frontend is an **application** that:

- Renders the UI (HTML + CSS)
- Holds state (who’s logged in, which posts are on screen)
- Runs logic (form validation, conditional layouts, error messages)
- Talks to the backend (fetch/axios calls, caching)
- Routes between “pages” without reloading

In short: the frontend is the **client** for your API.

## Decision Time: Picking a Stack

There are a lot of frontend frameworks and build tools. Here’s how I narrowed it down for CircleShare’s MVP.

### Build Tool — **Vite**

Why Vite: I need fast feedback loops while iterating on auth and circle flows.

- Pros: instant reloads, modern defaults, tiny config.
- Trade-off: newer ecosystem, rare plugin gaps.
- Why not others: CRA is deprecated, Webpack is heavy, Parcel/Rollup aren’t ideal for SPAs.

**Bottom line:** I’m shipping faster with Vite.

### Framework — **React**

Why React: CircleShare will have complex state (user roles, circles, posts).

- Pros: massive ecosystem, libraries for everything, easy to find help.
- Trade-off: more boilerplate than Vue/Svelte.
- Why not others: Vue and Svelte are smaller ecosystems, Angular is overkill, Solid is too new.

**Bottom line:** React gives me proven tools and patterns for production.

### Language — **TypeScript**

Why TypeScript: CircleShare has real models (Users, Circles, Posts, Permissions).

- Pros: catches API/typing mistakes early, safer refactors, IntelliSense.
- Trade-off: small learning curve and a build step.
- Why not JS: more runtime errors, riskier refactors.

**Bottom line:** TypeScript keeps me from shipping auth or data bugs.

### Styling — **Tailwind (plus options later)**

Why Tailwind: fast to prototype, consistent spacing/colors, easy to keep design clean.

- Alternatives I may add: Styled Components, CSS Modules.
- Why not Bootstrap: looks generic fast.

**Bottom line:** Tailwind helps me move quickly without messy CSS.

### State & Data — **Zustand + React Query (near-term picks)**

- Zustand → simple auth/user state.
- React Query → API calls with caching, retries, and loading states.
- Later if needed: Redux Toolkit for real-time or cross-page state.

**Bottom line:** lightweight today, scalable tomorrow.

## Final Call

**Vite + React + TypeScript (+ Tailwind, Zustand, React Query)**

- Fast iteration on auth and circle features.
- Type safety around auth + API boundaries.
- A massive ecosystem for routing, forms, uploads, and real-time.
- Industry-standard skills that transfer to future projects.
- Modern DX with a path to production scalability.


## Minimal Project Skeleton

```
circleshare-web/
├─ index.html
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ api.ts            # tiny API client
│  ├─ auth.ts           # token storage helpers
│  ├─ views/
│  │  ├─ Login.tsx
│  │  ├─ MyDays.tsx     # my posts
│  │  └─ TheirDays.tsx  # everyone’s posts
└─ vite.config.ts
```

Backend note: I already enabled CORS for `http://localhost:5173` in FastAPI so the browser can call the API locally.


👉 Full code is on my GitHub: [CircleShare](https://github.com/yourusername/circleshare)
