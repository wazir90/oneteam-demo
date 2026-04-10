# Oneteam Dynamic Theming Demo — Progress Update

## What's Built

Single-page Next.js app recreating the Oneteam Forms dashboard screen. Fully functional with:

- **Figma-matched UI** — Top bar, icon sidebar, Forms sub-nav, quick action cards, search/filters, data table with 10 rows. All pulled from the actual Figma design (node 321:2245).
- **3 dynamic color inputs** — Main, Button, Link. Each generates a full tonal palette at runtime.
- **Light/dark mode toggle** — All tokens swap correctly between modes.
- **Brand presets** — IKEA, Walmart, H&M one-click switching.
- **Palette strip visualizer** — Shows the generated 11-tone scale per seed color with active tone indicators.
- **Figma token import** — All variable names from the Brands collection are mapped.

## How Dynamic Colors Work

Customer picks a hex → we generate a 101-shade tonal ramp using `@material/material-color-utilities` (Google's HCT color library) → we pick the right shade per token per mode.

**The key insight:** we don't use the same shade in both modes. The shade is chosen **adaptively based on the input color's brightness**:

- **Filled surfaces** (top bar, buttons): seed tone clamped to 25–50 in light, 55–80 in dark
- **Text/icons on page** (links, brand icons): seed tone clamped to 20–45 in light, 65–90 in dark  
- **Top bar in dark mode**: stays dark and immersive (tone 10–25) instead of becoming a bright bar
- **Subtle backgrounds**: always near-white (tone 90–95) or near-black (tone 5–10)

This means a dark navy `#001844` and a bright gold `#FFD700` both produce usable themes — the system adapts instead of breaking on extreme inputs.

## Stack

Next.js (App Router) + TypeScript + CSS custom properties + `@material/material-color-utilities`

## What's Left

- Final visual polish pass against Figma
- Edge case testing with more color extremes
- Any token adjustments after team review
