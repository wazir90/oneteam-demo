/**
 * Token definitions matching the Figma "Brands" variable collection.
 * These are the actual Figma variable names resolved to their values.
 *
 * Dynamic brand tokens are generated at runtime from 3 seed colors.
 * Static tokens swap between light/dark mode.
 *
 * Tone mapping (Tailwind scale → Material tonal palette):
 *   50→95, 100→90, 200→80, 300→70, 400→60, 500→50, 600→40, 700→30, 800→20, 900→10, 950→5
 */

export type Mode = 'light' | 'dark';

/**
 * A tone resolver can be either:
 *   - A fixed number (e.g. 95) — always that tone regardless of seed
 *   - A function (seedTone) => tone — adapts based on where the seed sits
 *
 * Adaptive resolvers clamp the seed tone into a usable range per mode,
 * keeping the result close to the user's chosen color while guaranteeing
 * enough contrast against the mode's background.
 */
type ToneResolver = number | ((seedTone: number) => number);

export interface TokenMapping {
  light: ToneResolver;
  dark: ToneResolver;
}

/** Clamp a value between min and max */
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Adaptive tone for FILLED SURFACES (top bar, buttons, brand bg).
 * Light mode: clamp seed into 25–50 (dark enough on white bg).
 * Dark mode:  clamp seed into 45–65 (vibrant on dark bg without washing out).
 */
const filled = (seedTone: number): { light: number; dark: number } => ({
  light: clamp(Math.round(seedTone), 25, 50),
  dark: clamp(Math.round(seedTone) + 15, 45, 65),
});

/**
 * Adaptive tone for TEXT/ICONS on neutral surfaces.
 * Light mode: clamp seed into 20–45 (readable on white).
 * Dark mode:  clamp seed into 65–90 (readable on dark).
 */
const onNeutral = (seedTone: number): { light: number; dark: number } => ({
  light: clamp(Math.round(seedTone), 20, 45),
  dark: clamp(Math.round(seedTone) + 35, 65, 90),
});

/**
 * Create an adaptive token mapping for filled surfaces.
 * offset shifts the base tone (e.g. +10 for hover, -10 for active).
 */
function adaptFilled(offset = 0): TokenMapping {
  return {
    light: (st: number) => clamp(filled(st).light + offset, 5, 95),
    dark:  (st: number) => clamp(filled(st).dark + offset, 5, 95),
  };
}

/**
 * Create an adaptive token mapping for text/icons on neutral surfaces.
 * offset shifts the base tone.
 */
function adaptOnNeutral(offset = 0): TokenMapping {
  return {
    light: (st: number) => clamp(onNeutral(st).light + offset, 5, 95),
    dark:  (st: number) => clamp(onNeutral(st).dark + offset, 5, 95),
  };
}

// --- Dynamic brand tokens (generated from "Main" seed via tonal palette) ---

export const mainTokens: Record<string, TokenMapping> = {
  // Bg/Brand — filled surfaces, adaptive to seed tone
  '--bg-brand':              adaptFilled(0),
  '--bg-brand-hover':        adaptFilled(+10),
  '--bg-brand-active':       adaptFilled(-10),
  // Subtle brand backgrounds — fixed extremes (always near white/black)
  '--bg-brand-subtlest':     { light: 95, dark: 5 },
  '--bg-brand-subtler':      { light: 90, dark: 10 },
  '--bg-brand-subtle':       { light: 80, dark: 20 },
  // Bg/Top Bar — filled surface, darker in dark mode for immersion
  '--bg-top-bar':            { light: (st) => clamp(Math.round(st), 25, 50), dark: (st) => clamp(Math.round(st), 10, 25) },
  // Border/Brand
  '--border-brand':          adaptFilled(0),
  '--border-brand-subtle':   { light: 80, dark: 30 },
  '--border-brand-subtler':  { light: 90, dark: 20 },
  '--border-brand-subtlest': { light: 95, dark: 10 },
  // Icons/Brand — text/icons on neutral surfaces
  '--icons-brand':           adaptOnNeutral(0),
  '--icons-brand-hover':     adaptOnNeutral(+10),
  '--icons-brand-active':    adaptOnNeutral(-10),
};

// --- Dynamic brand tokens (generated from "Button" seed) ---

export const buttonTokens: Record<string, TokenMapping> = {
  '--bg-button':       adaptFilled(0),
  '--bg-button-hover': adaptFilled(+10),
};

// --- Dynamic brand tokens (generated from "Link" seed) ---

export const linkTokens: Record<string, TokenMapping> = {
  '--text-link':        adaptOnNeutral(0),
  '--text-link-hover':  adaptOnNeutral(+10),
  '--text-link-active': adaptOnNeutral(-10),
};

// --- Static tokens (swap per light/dark mode) ---

export const neutralTokens: Record<string, { light: string; dark: string }> = {
  // Backgrounds
  '--bg-surface':         { light: '#FFFFFF', dark: '#09090B' },
  '--bg-surface-raised':  { light: '#FAFAFA', dark: '#18181B' },
  '--bg-surface-sunken':  { light: '#F4F4F5', dark: '#18181B' },
  '--bg-surface-overlay': { light: '#FFFFFF', dark: '#27272A' },
  '--bg-inverse':         { light: '#18181B', dark: '#FAFAFA' },
  // Text
  '--text-heading':           { light: '#09090B', dark: '#FAFAFA' },
  '--text-sub-heading':       { light: '#27272A', dark: '#F4F4F5' },
  '--text-paragraph-1':       { light: '#3F3F46', dark: '#E4E4E7' },
  '--text-paragraph-2':       { light: '#52525B', dark: '#A1A1AA' },
  '--text-paragraph-3':       { light: '#71717A', dark: '#71717A' },
  '--text-disabled':          { light: '#D4D4D8', dark: '#52525B' },
  '--text-inverse':           { light: '#FAFAFA', dark: '#FAFAFA' },
  '--text-inverse-subtle':    { light: '#A1A1AA', dark: '#71717A' },
  '--text-inverse-subtler':   { light: '#71717A', dark: '#A1A1AA' },
  // Icons
  '--icons-subtler':          { light: '#A1A1AA', dark: '#71717A' },
  '--icons-subtler-hover':    { light: '#71717A', dark: '#A1A1AA' },
  '--icons-subtler-active':   { light: '#52525B', dark: '#D4D4D8' },
  '--icons-subtle':           { light: '#71717A', dark: '#A1A1AA' },
  '--icons-subtle-hover':     { light: '#52525B', dark: '#D4D4D8' },
  '--icons-subtle-active':    { light: '#3F3F46', dark: '#71717A' },
  '--icons-bold':             { light: '#52525B', dark: '#D4D4D8' },
  '--icons-bold-hover':       { light: '#3F3F46', dark: '#E4E4E7' },
  '--icons-bold-active':      { light: '#27272A', dark: '#A1A1AA' },
  '--icons-bolder':           { light: '#3F3F46', dark: '#E4E4E7' },
  '--icons-bolder-hover':     { light: '#27272A', dark: '#F4F4F5' },
  '--icons-bolder-active':    { light: '#18181B', dark: '#FAFAFA' },
  '--icons-disabled':         { light: '#D4D4D8', dark: '#52525B' },
  '--icons-inverse':          { light: '#FAFAFA', dark: '#FAFAFA' },
  '--icons-inverse-hover':    { light: '#F4F4F5', dark: '#18181B' },
  '--icons-inverse-active':   { light: '#E4E4E7', dark: '#27272A' },
  // Borders
  '--border-subtler':   { light: '#F4F4F5', dark: '#27272A' },
  '--border-subtle':    { light: '#E4E4E7', dark: '#3F3F46' },
  '--border-bold':      { light: '#D4D4D8', dark: '#52525B' },
  '--border-bolder':    { light: '#A1A1AA', dark: '#71717A' },
  '--border-boldest':   { light: '#27272A', dark: '#E4E4E7' },
  '--border-inverse':   { light: '#FAFAFA', dark: '#09090B' },
  // Legacy aliases (used in existing components)
  '--bg-soft-200':      { light: '#E4E4E7', dark: '#27272A' },
  '--grayscale-white':  { light: '#FFFFFF', dark: '#09090B' },
  '--oneteam-white':    { light: '#FFFFFF', dark: '#FFFFFF' },
};

export const semanticTokens: Record<string, { light: string; dark: string }> = {
  // Text semantic
  '--text-success':        { light: '#16A34A', dark: '#86EFAC' },
  '--text-danger':         { light: '#DC2626', dark: '#FCA5A5' },
  '--text-danger-inverse': { light: '#F87171', dark: '#FCA5A5' },
  '--text-warning':        { light: '#EA580C', dark: '#FDBA74' },
  '--text-accent-purple':  { light: '#9333EA', dark: '#D8B4FE' },
  // Bg success
  '--bg-success':          { light: '#16A34A', dark: '#22C55E' },
  '--bg-success-hover':    { light: '#22C55E', dark: '#4ADE80' },
  '--bg-success-active':   { light: '#15803D', dark: '#16A34A' },
  '--bg-success-subtler':  { light: '#DCFCE7', dark: '#14532D' },
  '--bg-success-subtlest': { light: '#F0FDF4', dark: '#052E16' },
  // Bg danger
  '--bg-danger':           { light: '#DC2626', dark: '#EF4444' },
  '--bg-danger-hover':     { light: '#EF4444', dark: '#F87171' },
  '--bg-danger-active':    { light: '#B91C1C', dark: '#DC2626' },
  '--bg-danger-subtlest':  { light: '#FEF2F2', dark: '#450A0A' },
  '--system-red':          { light: '#DC2626', dark: '#EF4444' },
  // Bg warning
  '--bg-warning':          { light: '#EA580C', dark: '#F97316' },
  '--bg-warning-hover':    { light: '#F97316', dark: '#FB923C' },
  '--bg-warning-active':   { light: '#C2410C', dark: '#EA580C' },
  '--bg-warning-subtlest': { light: '#FFF7ED', dark: '#431407' },
  '--bg-warning-subtler':  { light: '#FFEDD5', dark: '#7C2D12' },
  // Icons semantic
  '--icons-success':        { light: '#16A34A', dark: '#86EFAC' },
  '--icons-danger':         { light: '#DC2626', dark: '#FCA5A5' },
  '--icons-danger-subtle':  { light: '#EF4444', dark: '#F87171' },
  '--icons-danger-subtler': { light: '#F87171', dark: '#FCA5A5' },
  '--icons-warning':        { light: '#EA580C', dark: '#FDBA74' },
  '--icons-accent-purple':  { light: '#9333EA', dark: '#D8B4FE' },
  // Border semantic
  '--border-success':         { light: '#16A34A', dark: '#86EFAC' },
  '--border-success-subtler': { light: '#DCFCE7', dark: '#166534' },
  '--border-success-subtle':  { light: '#BBF7D0', dark: '#15803D' },
  '--border-danger':          { light: '#DC2626', dark: '#FCA5A5' },
  '--border-danger-subtler':  { light: '#FEE2E2', dark: '#991B1B' },
  '--border-danger-subtle':   { light: '#FECACA', dark: '#B91C1C' },
  '--border-danger-inverse':  { light: '#F87171', dark: '#FCA5A5' },
  '--border-warning':         { light: '#EA580C', dark: '#FDBA74' },
  '--border-warning-subtle':  { light: '#FED7AA', dark: '#C2410C' },
  // Accent yellow
  '--bg-accent-yellow':          { light: '#CA8A04', dark: '#EAB308' },
  '--bg-accent-yellow-subtlest': { light: '#FEFCE8', dark: '#422006' },
  '--bg-accent-yellow-subtler':  { light: '#FEF9C3', dark: '#713F12' },
  '--bg-accent-yellow-subtle':   { light: '#FDE047', dark: '#854D0E' },
  '--bg-accent-yellow-mid':      { light: '#FACC15', dark: '#FACC15' },
  // Accent purple
  '--bg-accent-purple':          { light: '#9333EA', dark: '#A855F7' },
  '--bg-accent-purple-subtlest': { light: '#FAF5FF', dark: '#3B0764' },
  '--bg-accent-purple-subtler':  { light: '#F3E8FF', dark: '#581C87' },
  '--bg-accent-purple-subtle':   { light: '#E9D5FF', dark: '#6B21A8' },
  // Avatar / soft colors (not in Figma Brands — kept from original)
  '--purple-light': { light: '#cac2ff', dark: '#5b4fc4' },
  '--yellow-light': { light: '#fbdfb1', dark: '#7c5c1e' },
  '--green-light':  { light: '#cbf5e5', dark: '#1a5c3a' },
  '--red-light':    { light: '#f8c9d2', dark: '#7c2d36' },
  '--blue-light':   { light: '#c2d6ff', dark: '#1e3a5f' },
  '--teal-light':   { light: '#c2efff', dark: '#164e63' },
};
