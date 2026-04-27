'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import {
  generatePalette,
  resolveAllTokens,
  applyTokensToRoot,
  getActiveTones,
  type TonalScale,
} from '@/lib/theme';
import type { Mode } from '@/lib/tokens';
import { defaultPreset } from '@/lib/presets';

interface ThemeState {
  mainColor: string;
  buttonColor: string;
  linkColor: string;
  mode: Mode;
  mainPalette: TonalScale;
  buttonPalette: TonalScale;
  linkPalette: TonalScale;
  // Dark-mode overrides: null = auto (derive from light seed), hex = use literally
  darkMainColor: string | null;
  darkButtonColor: string | null;
  darkLinkColor: string | null;
  darkMainPalette: TonalScale;
  darkButtonPalette: TonalScale;
  darkLinkPalette: TonalScale;
  setMainColor: (hex: string) => void;
  setButtonColor: (hex: string) => void;
  setLinkColor: (hex: string) => void;
  setDarkMainColor: (hex: string | null) => void;
  setDarkButtonColor: (hex: string | null) => void;
  setDarkLinkColor: (hex: string | null) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setAllColors: (
    main: string,
    button: string,
    link: string,
    darkOverrides?: { main?: string; button?: string; link?: string },
  ) => void;
  saveChanges: () => void;
  resetToDefaults: () => void;
  getActiveTones: (role: 'main' | 'button' | 'link') => number[];
}

const STORAGE_KEY = 'oneteam-theme';

interface PersistedTheme {
  main: string;
  button: string;
  link: string;
  darkMain: string | null;
  darkButton: string | null;
  darkLink: string | null;
}

function loadPersisted(): PersistedTheme | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedTheme) : null;
  } catch {
    return null;
  }
}

const ThemeContext = createContext<ThemeState | null>(null);

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mainColor, setMainColor] = useState(defaultPreset.main);
  const [buttonColor, setButtonColor] = useState(defaultPreset.button);
  const [linkColor, setLinkColor] = useState(defaultPreset.link);
  const [mode, setMode] = useState<Mode>('light');

  // Dark overrides: null = auto (algorithm derives from light seed)
  const [darkMainColor, setDarkMainColor] = useState<string | null>(null);
  const [darkButtonColor, setDarkButtonColor] = useState<string | null>(null);
  const [darkLinkColor, setDarkLinkColor] = useState<string | null>(null);

  // Hydrate from localStorage after mount to avoid SSR/client hydration mismatch.
  useEffect(() => {
    const persisted = loadPersisted();
    if (!persisted) return;
    setMainColor(persisted.main);
    setButtonColor(persisted.button);
    setLinkColor(persisted.link);
    setDarkMainColor(persisted.darkMain);
    setDarkButtonColor(persisted.darkButton);
    setDarkLinkColor(persisted.darkLink);
  }, []);

  const mainPalette = useMemo(() => generatePalette(mainColor), [mainColor]);
  const buttonPalette = useMemo(() => generatePalette(buttonColor), [buttonColor]);
  const linkPalette = useMemo(() => generatePalette(linkColor), [linkColor]);

  // Override palettes — only used in dark mode when an override is set.
  // Fall back to light palette so the type is always a valid TonalScale.
  const darkMainPalette = useMemo(
    () => (darkMainColor ? generatePalette(darkMainColor) : mainPalette),
    [darkMainColor, mainPalette],
  );
  const darkButtonPalette = useMemo(
    () => (darkButtonColor ? generatePalette(darkButtonColor) : buttonPalette),
    [darkButtonColor, buttonPalette],
  );
  const darkLinkPalette = useMemo(
    () => (darkLinkColor ? generatePalette(darkLinkColor) : linkPalette),
    [darkLinkColor, linkPalette],
  );

  useEffect(() => {
    const tokens = resolveAllTokens(
      mainPalette, buttonPalette, linkPalette, mode,
      mainColor, buttonColor, linkColor,
      { main: darkMainColor, button: darkButtonColor, link: darkLinkColor },
    );
    applyTokensToRoot(tokens);
    document.documentElement.setAttribute('data-mode', mode);
  }, [mainPalette, buttonPalette, linkPalette, mode, mainColor, buttonColor, linkColor, darkMainColor, darkButtonColor, darkLinkColor]);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  }, []);

  const setAllColors = useCallback(
    (
      main: string,
      button: string,
      link: string,
      darkOverrides?: { main?: string; button?: string; link?: string },
    ) => {
      setMainColor(main);
      setButtonColor(button);
      setLinkColor(link);
      // Preset switch replaces any stale dark overrides. If the preset
      // provides explicit dark values, apply them; otherwise clear to auto.
      setDarkMainColor(darkOverrides?.main ?? null);
      setDarkButtonColor(darkOverrides?.button ?? null);
      setDarkLinkColor(darkOverrides?.link ?? null);
    },
    [],
  );

  const saveChanges = useCallback(() => {
    if (typeof window === 'undefined') return;
    const payload: PersistedTheme = {
      main: mainColor,
      button: buttonColor,
      link: linkColor,
      darkMain: darkMainColor,
      darkButton: darkButtonColor,
      darkLink: darkLinkColor,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [mainColor, buttonColor, linkColor, darkMainColor, darkButtonColor, darkLinkColor]);

  const resetToDefaults = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setMainColor(defaultPreset.main);
    setButtonColor(defaultPreset.button);
    setLinkColor(defaultPreset.link);
    setDarkMainColor(null);
    setDarkButtonColor(null);
    setDarkLinkColor(null);
  }, []);

  const getActiveTonesForRole = useCallback(
    (role: 'main' | 'button' | 'link') => {
      // In dark mode with an override, active tones are computed against the
      // override-seeded palette so the strip highlights the right swatch.
      const darkOverride =
        mode === 'dark'
          ? role === 'main'
            ? darkMainColor
            : role === 'button'
              ? darkButtonColor
              : darkLinkColor
          : null;
      const lightHex = role === 'main' ? mainColor : role === 'button' ? buttonColor : linkColor;
      return getActiveTones(role, mode, darkOverride ?? lightHex);
    },
    [mode, mainColor, buttonColor, linkColor, darkMainColor, darkButtonColor, darkLinkColor],
  );

  const value = useMemo<ThemeState>(
    () => ({
      mainColor,
      buttonColor,
      linkColor,
      mode,
      mainPalette,
      buttonPalette,
      linkPalette,
      darkMainColor,
      darkButtonColor,
      darkLinkColor,
      darkMainPalette,
      darkButtonPalette,
      darkLinkPalette,
      setMainColor,
      setButtonColor,
      setLinkColor,
      setDarkMainColor,
      setDarkButtonColor,
      setDarkLinkColor,
      setMode,
      toggleMode,
      setAllColors,
      saveChanges,
      resetToDefaults,
      getActiveTones: getActiveTonesForRole,
    }),
    [
      mainColor, buttonColor, linkColor, mode,
      mainPalette, buttonPalette, linkPalette,
      darkMainColor, darkButtonColor, darkLinkColor,
      darkMainPalette, darkButtonPalette, darkLinkPalette,
      toggleMode, setAllColors, saveChanges, resetToDefaults, getActiveTonesForRole,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
