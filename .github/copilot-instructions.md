<!--
Guidance for AI coding agents working on the StakeEngine web-sdk monorepo.
Keep this file concise and focused on repo-specific patterns, build/test flows,
and concrete code locations an agent will need to read/modify.
-->

# Copilot instructions for web-sdk

- Repo layout: monorepo powered by pnpm workspaces + TurboRepo.
  - Packages live in `packages/*`, apps in `apps/*`.
  - Local package deps use `workspace:*` (examples: `pixi-svelte`, `utils-*`).

- Key commands (run from repo root):
  - Install: `pnpm install` (pnpm@10.5.0 required)
  - Run all dev tasks via Turbo: `pnpm run dev` or target a module: `pnpm run dev --filter=<name>` (e.g. `--filter=lines`).
  - Build a package: `pnpm run build --filter=<name>` (note: `pixi-svelte` exports `dist` and must be built after edits).
  - Storybook per-package: `pnpm run storybook --filter=<name>` or run root `pnpm run storybook --filter=lines`.

- Big-picture architecture (what to read first):
  1. `apps/<game>/src/routes/+page.svelte` — app entry: calls `setContext()` and mounts `<Game/>`.
  2. `packages/pixi-svelte` + `packages/components-*` — rendering layer (PIXI + Svelte components).
  3. `packages/utils-book` — playBookEvents/sequence and bookEvent handling.
  4. `apps/<game>/src/game/bookEventHandlerMap.ts` — maps `bookEvent.type` → async handlers that broadcast emitter events.
  5. `apps/<game>/src/game/eventEmitter.ts` and component `subscribeOnMount` usages — how emitter events flow into components.

- Data & control flow summary:
  - RGS returns a `book` (array of `bookEvent`s). `playBookEvents()` (utils-book) processes them in-order.
  - bookEvent handlers use `eventEmitter.broadcast()` / `broadcastAsync()` to trigger component work.
  - Components subscribe with `context.eventEmitter.subscribeOnMount(handlerMap)` and often return async handlers to await animations.

- Conventions & gotchas an agent must follow:
  - Preserve sequence: bookEvents are processed sequentially (do not turn sequence into parallel unless verified).
  - Task-breakdown pattern: complex bookEvents are split into smaller emitterEvents (e.g. `tumbleBoardInit`, `tumbleBoardExplode`). When adding behavior, follow this pattern and add stories.
  - Always update TypeScript union types when adding new bookEvent or emitterEvent types: see `apps/*/src/game/typesBookEvent.ts` and `typesEmitterEvent.ts`.
  - When editing `pixi-svelte` or other packages that expose `dist` as `main`, run `pnpm run build --filter=<package>` before testing dependents.
  - Storybook ports vary per package; check `package.json` `storybook` scripts for port numbers (e.g. `lines` uses `6001`).

- Testing and verification steps for changes:
  - Unit/happy-path: add/modify storybook stories under `apps/<game>/src/stories/*` to exercise new emitterEvents or components.
  - Quick local manual test: run `pnpm run storybook --filter=<app>`; use the `MODE_*` stories and the Action button to play books.
  - Build check for package changes: `pnpm run build --filter=<package>` then run `pnpm run dev --filter=<app>` or storybook for the app that consumes it.

- Files to inspect first for most changes:
  - `apps/<game>/src/game/bookEventHandlerMap.ts` (where book -> emitter events are implemented)
  - `packages/utils-book/src/createPlayBookUtils.ts` (sequence/playBookEvent implementation)
  - `packages/utils-event-emitter/src/createEventEmitter.ts` (broadcast / broadcastAsync semantics)
  - `apps/<game>/src/components/*` for emitter handlers and `subscribeOnMount` patterns.

- Example: adding a new bookEvent `updateGlobalMult`
  1. Add type in `typesBookEvent.ts`.
  2. Add a handler in `bookEventHandlerMap.ts` that broadcasts `globalMultiplierUpdate`.
  3. Define emitterEvent union in `typesEmitterEvent.ts` and add component handler in `GlobalMultiplier.svelte` using `subscribeOnMount`.
  4. Add story(s) in `apps/<game>/src/stories` (`bookEvent` and `book/random`) and verify via storybook Action button.

- When unsure about a convention, reference these concrete examples in the repo: `apps/lines/src/game/*`, `packages/pixi-svelte/*`, `packages/utils-book/*`.

If anything here is unclear or you'd like me to include more precise commands (Windows-specific tips, scripts for CI, or example story changes), tell me which part to expand and I'll iterate.
