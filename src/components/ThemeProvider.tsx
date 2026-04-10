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
  setMainColor: (hex: string) => void;
  setButtonColor: (hex: string) => void;
  setLinkColor: (hex: string) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setAllColors: (main: string, button: string, link: string) => void;
  getActiveTones: (role: 'main' | 'button' | 'link') => number[];
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

  const mainPalette = useMemo(() => generatePalette(mainColor), [mainColor]);
  const buttonPalette = useMemo(() => generatePalette(buttonColor), [buttonColor]);
  const linkPalette = useMemo(() => generatePalette(linkColor), [linkColor]);

  useEffect(() => {
    const tokens = resolveAllTokens(
      mainPalette, buttonPalette, linkPalette, mode,
      mainColor, buttonColor, linkColor,
    );
    applyTokensToRoot(tokens);
    document.documentElement.setAttribute('data-mode', mode);
  }, [mainPalette, buttonPalette, linkPalette, mode, mainColor, buttonColor, linkColor]);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  }, []);

  const setAllColors = useCallback((main: string, button: string, link: string) => {
    setMainColor(main);
    setButtonColor(button);
    setLinkColor(link);
  }, []);

  const getActiveTonesForRole = useCallback(
    (role: 'main' | 'button' | 'link') => {
      const hex = role === 'main' ? mainColor : role === 'button' ? buttonColor : linkColor;
      return getActiveTones(role, mode, hex);
    },
    [mode, mainColor, buttonColor, linkColor],
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
      setMainColor,
      setButtonColor,
      setLinkColor,
      setMode,
      toggleMode,
      setAllColors,
      getActiveTones: getActiveTonesForRole,
    }),
    [mainColor, buttonColor, linkColor, mode, mainPalette, buttonPalette, linkPalette, toggleMode, setAllColors, getActiveTonesForRole],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
