# Default build stack — what agents reach for unless told otherwise

When building a demo (`build-demo` / `build-blog-demo`), a client deliverable, or any scaffold in this
workspace, default to the choices below. They keep builds consistent, fast to spin up, and on a stack Dan
actually runs. Override only when the client's post pins a different stack (mirror theirs - see
`../playbook/live-demo-play.md`) or Dan says so.

## The defaults
- **Package manager: pnpm.** Use `pnpm` / `pnpm dlx` for installs and scripts (not npm/yarn; not Bun for
  package management even though Bun is fine as a runtime).
- **Deploy: Cloudflare or Vercel.**
  - **Vercel** for Next.js apps and most React SPA/SSR demos (auto-deploy from GitHub, preview URLs). This
    is the default for the `<slug>.danolekh.com` demo subdomains.
  - **Cloudflare** (Workers / Pages, Wrangler) for edge/TanStack-Start builds and anything using R2,
    Hyperdrive, or D1. The `danolekh.com` blog (`build-blog-demo`) is already TanStack Start on Cloudflare.
- **ORM / data layer: Drizzle ORM** over PostgreSQL (Supabase or any Postgres; SQLite for tiny demos).
  Hand-roll the schema with Drizzle - no heavy CMS/ORM wrappers.
- **UI primitives: shadcn/ui on Base UI.** Use shadcn/ui components (configured on the Base UI primitives,
  not legacy Radix) for the standard kit - buttons, inputs, dialogs, popovers, tabs, etc. Tailwind for
  styling. Add components via the shadcn CLI / registry (`pnpm dlx shadcn@latest add ...`).
- **DICE UI for the hard, logic-heavy components.** Before hand-building a complex interactive component,
  check if DICE UI already has it (catalog below) and copy it in. DICE UI is shadcn-style (React + TS +
  Tailwind, copy-paste from its registry, accessible/keyboard-navigable), so it drops in next to shadcn/ui.
  Hand-roll only when DICE UI doesn't cover it or the client is specifically grading our from-scratch a11y
  work (e.g. the HubSpot test where building primitives by hand was the point).

## DICE UI component catalog (so agents know what NOT to hand-build)
Source: https://www.diceui.com/docs · LLM-friendly docs at `https://www.diceui.com/llms.mdx/components/<name>`

Reach for DICE UI first for these - they're the ones that are painful and bug-prone to hand-roll:
- **Drag & drop / ordering:** Kanban (board with draggable columns/cards), Sortable (reorderable lists/grids).
- **Tabular / data:** Data Table (filter/sort/paginate, the big one), Data Grid, Masonry, Timeline.
- **Rich inputs / selection:** Combobox (filterable popover select), Listbox, Checkbox Group, Tags Input,
  Mention (@-mentions), Time Picker, Phone Input, Mask Input, Segmented Input, Editable (inline edit).
- **Media / canvas:** Media Player, Cropper (image crop), Color Picker, Color Swatch, QR Code, Compare
  Slider, Angle Slider, Marquee, Swap.
- **Feedback / status:** Stepper, Rating, Circular Progress, Gauge, Stat, Status, Badge Overflow.
- **Layout / chrome:** Action Bar, Selection Toolbar, Banner, Speed Dial, Key Value, Stack, Scroller, Tour,
  Avatar Group, Kbd, Responsive Dialog, Scroll Spy.
- **Utilities:** Composition, Direction Provider, Hitbox, Portal, Presence, Visually Hidden, Client Only.

The genuinely complex ones worth defaulting to DICE UI for: **Data Table, Data Grid, Kanban, Sortable,
Combobox, Media Player, Cropper, Mention, Tour, Stepper.**

## How this fits Dan's real stack
Consistent with `skills.md`: TypeScript, React/Next.js (App Router), Tailwind, Drizzle + Postgres,
Vercel/Cloudflare. shadcn/Base UI and DICE UI are the component layer on top. Don't claim a tool in a
proposal just because it's the default here - only claim what's in `skills.md`.
