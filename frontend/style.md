# Portfolio Design System

Brand: **Prompt Blue `#0B132B`** × **AI Green `#39FF88`**.
Philosophy: minimal, editorial typography, bento grids, subtle glass, purposeful motion.

All tokens live in [`src/styles/index.css`](src/styles/index.css). Components use tokens only — never hard-coded colours.

## Themes

Dark is the default. Light is designed separately, not inverted.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0B132B` | `#F7F9FC` | Page background |
| `--bg-2` | `#101A33` | `#FFFFFF` | Secondary background, chips, inputs |
| `--surface` | `#15213D` | `#FFFFFF` | Cards / tiles |
| `--surface-2` | `#1A2947` | `#EEF2F8` | Elevated surfaces, image placeholders |
| `--text` | `#F5F7FA` | `#0B132B` | Primary text |
| `--text-2` | `#AAB5C8` | `#526079` | Secondary text |
| `--text-3` | `#8E9BB2` | `#56647C` | Meta / mono labels (≥4.5:1) |
| `--icon` | `#8E9BB2` | `#66758C` | Muted icons |
| `--accent` | `#39FF88` | `#087A43` | Primary buttons, active states, focus ring |
| `--accent-hover` | `#74FFAA` | `#065F35` | Hover |
| `--accent-ink` | `#0B132B` | `#FFFFFF` | Text **on** an accent background |
| `--accent-text` | `#39FF88` | `#087A43` | Accent used **as** text |
| `--decor` | `#39FF88` | `#39FF88` | Decorative dots / indicators only |
| `--border` | `#263550` | `#DCE3ED` | Subtle borders |

Rules:
- AI Green is an accent, never a large background. In light mode `#39FF88` is decorative only (dots, indicators); text and buttons use `#087A43`.
- Prompt Blue anchors both themes: brand mark, admin sidebar, and the Contact panel (rendered with `data-theme="dark"` in both themes).
- No purple, pink or orange accents. Gradients are limited to very soft accent washes.

### Theme mechanics
- `index.html` sets `data-theme` before first paint: saved choice (`localStorage['theme-preference']`), then the OS preference, then dark.
- Only an explicit toggle is persisted. Without one, the theme follows OS changes live.
- `meta[name=theme-color]` is kept in sync.
- Switching adds `html.theme-switching` for 320 ms to fade colours (skipped with reduced motion).
- A subtree can be forced to a theme with `data-theme="dark|light"`.

## Typography
- Display: **Instrument Serif** (section titles, hero name, large numbers; italic `<em>` for the accent word).
- UI/body: **Inter** 400/500/600.
- Meta labels: **JetBrains Mono** 500, uppercase, letter-spaced.
- Fonts load non-blocking with `display=swap`.

## Layout & components
- Container 1200px + fluid gutter `clamp(16px, 4vw, 40px)`; section padding `clamp(80px, 11vw, 136px)`.
- Section header: `01 —— EYEBROW` + serif title (`SectionHeader`). Indices are assigned only to sections that render.
- `.bento` (3 cols → 2 → 1) with `.span-2` / `.span-3`; `.tile` cards (`--radius-lg`, 1px border, minimal shadow).
- Buttons: `.btn.btn--primary` / `.btn--ghost` / `.btn--sm` (BEM names avoid clashing with admin's `.btn-primary`).
- Chips: `.chip`, `.chip--accent`, `.chip--mono`. Status: `.status-dot`.
- Icons: inline SVG via `components/common/Icon.jsx` (no icon font).
- Images: `lib/media.js` adds Cloudinary `f_auto,q_auto,w_*`; `ZoomableImage` is a lazy, keyboard-accessible lightbox trigger with gallery support.

## Motion
- `.reveal` fade-up (600 ms) via one IntersectionObserver. Content is never hidden without JS or with reduced motion.
- Hover: 2px lift on interactive tiles, arrow nudges. No infinite decorative animations except the status-dot ping.

## Accessibility
- WCAG 2.2 AA contrast in both themes. Focus ring: 2px `--accent`, 3px offset.
- Skip link, semantic landmarks, `aria-current` on active nav, labelled icon buttons, `aria-live` form status.
- `prefers-reduced-motion` disables animation and transitions.
