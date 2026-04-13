import {
  argbFromHex,
  hexFromArgb,
  TonalPalette,
  Hct,
} from '@material/material-color-utilities';
import {
  mainTokens,
  buttonTokens,
  linkTokens,
  neutralTokens,
  semanticTokens,
  primaryTokens,
  type Mode,
  type TokenMapping,
} from './tokens';

export interface DarkOverrides {
  main?: string | null;
  button?: string | null;
  link?: string | null;
}

export type TonalScale = Record<number, string>;

const TONE_STEPS = [95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5] as const;

/**
 * Generate a tonal palette from a hex seed color.
 * Returns a map of tone (0-100) → hex string.
 *
 * We generate every integer tone (0–100) so that adaptive tone
 * selection can pick any value, not just multiples of 5.
 */
export function generatePalette(hex: string): TonalScale {
  const hct = Hct.fromInt(argbFromHex(hex));
  const palette = TonalPalette.fromHct(hct);
  const scale: TonalScale = {};
  for (let t = 0; t <= 100; t++) {
    scale[t] = hexFromArgb(palette.tone(t));
  }
  return scale;
}

/**
 * Get the seed color's tone in HCT space (0–100).
 * Used by adaptive tone selection to keep the resolved color
 * close to what the user picked.
 */
export function getSeedTone(hex: string): number {
  return Hct.fromInt(argbFromHex(hex)).tone;
}

/** The tone steps we display in the palette strip visualizer */
export const DISPLAY_TONES = TONE_STEPS;

/**
 * Resolve dynamic brand tokens from palettes based on mode.
 * Tone resolvers can be fixed numbers or functions of the seed tone.
 */
function resolveDynamicTokens(
  palette: TonalScale,
  tokenMap: Record<string, TokenMapping>,
  mode: Mode,
  seedTone: number,
  primaryTokenList?: readonly string[],
  overrideHex?: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  const primarySet = primaryTokenList ? new Set(primaryTokenList) : null;
  for (const [token, mapping] of Object.entries(tokenMap)) {
    if (overrideHex && primarySet?.has(token)) {
      // User explicitly picked this color for dark mode — use it verbatim,
      // skip tone remapping.
      result[token] = overrideHex;
      continue;
    }
    const resolver = mode === 'light' ? mapping.light : mapping.dark;
    const tone = typeof resolver === 'function' ? resolver(seedTone) : resolver;
    result[token] = palette[tone];
  }
  return result;
}

/**
 * Resolve all static tokens (neutrals + semantics) based on mode.
 */
function resolveStaticTokens(mode: Mode): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [token, values] of Object.entries(neutralTokens)) {
    result[token] = values[mode];
  }
  for (const [token, values] of Object.entries(semanticTokens)) {
    result[token] = values[mode];
  }
  return result;
}

/**
 * Resolve all CSS custom property tokens from the three palettes and mode.
 * Seed hex values are needed for adaptive tone calculation.
 */
export function resolveAllTokens(
  mainPalette: TonalScale,
  buttonPalette: TonalScale,
  linkPalette: TonalScale,
  mode: Mode,
  mainHex: string,
  buttonHex: string,
  linkHex: string,
  darkOverrides?: DarkOverrides,
): Record<string, string> {
  // When a dark override is set, swap that role's palette + seed to the override hex
  // so hover/active/subtle variants harmonize with the user's chosen dark color.
  const useOverride = mode === 'dark' && darkOverrides;
  const mainOverride = useOverride ? darkOverrides.main ?? undefined : undefined;
  const buttonOverride = useOverride ? darkOverrides.button ?? undefined : undefined;
  const linkOverride = useOverride ? darkOverrides.link ?? undefined : undefined;

  const effMainPalette = mainOverride ? generatePalette(mainOverride) : mainPalette;
  const effButtonPalette = buttonOverride ? generatePalette(buttonOverride) : buttonPalette;
  const effLinkPalette = linkOverride ? generatePalette(linkOverride) : linkPalette;

  const effMainHex = mainOverride ?? mainHex;
  const effButtonHex = buttonOverride ?? buttonHex;
  const effLinkHex = linkOverride ?? linkHex;

  return {
    ...resolveDynamicTokens(effMainPalette, mainTokens, mode, getSeedTone(effMainHex), primaryTokens.main, mainOverride),
    ...resolveDynamicTokens(effButtonPalette, buttonTokens, mode, getSeedTone(effButtonHex), primaryTokens.button, buttonOverride),
    ...resolveDynamicTokens(effLinkPalette, linkTokens, mode, getSeedTone(effLinkHex), primaryTokens.link, linkOverride),
    ...resolveStaticTokens(mode),
  };
}

/**
 * Apply resolved tokens as CSS custom properties on the root element.
 */
export function applyTokensToRoot(tokens: Record<string, string>): void {
  const root = document.documentElement;
  for (const [property, value] of Object.entries(tokens)) {
    root.style.setProperty(property, value);
  }
}

/**
 * Get which tones are "active" for a given color role and mode.
 * Returns the resolved tone values (accounting for adaptive functions).
 */
export function getActiveTones(
  role: 'main' | 'button' | 'link',
  mode: Mode,
  seedHex: string,
): number[] {
  const tokenMap = role === 'main' ? mainTokens : role === 'button' ? buttonTokens : linkTokens;
  const seedTone = getSeedTone(seedHex);
  const tones = new Set<number>();
  for (const mapping of Object.values(tokenMap)) {
    const resolver = mode === 'light' ? mapping.light : mapping.dark;
    const tone = typeof resolver === 'function' ? resolver(seedTone) : resolver;
    // Round to nearest 5 for display strip alignment
    tones.add(Math.round(tone / 5) * 5);
  }
  return [...tones];
}
