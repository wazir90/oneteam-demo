'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './TopBar.module.css';
import { ChevronDown } from './icons/ChevronDown';
import { ChatBubble } from './icons/ChatBubble';
import { Bell } from './icons/Bell';
import { useTheme } from './ThemeProvider';
import { ProfileSettingsModal } from './ProfileSettingsModal';

type ThemeChoice = 'light' | 'dark' | 'system';
const THEME_PREF_KEY = 'oneteam-theme-pref';

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>('light');

  const setModeRef = useRef(theme.setMode);
  useEffect(() => {
    setModeRef.current = theme.setMode;
  }, [theme.setMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(THEME_PREF_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') setThemeChoice(stored);
    const onPrefChange = (e: Event) => {
      const next = (e as CustomEvent<ThemeChoice>).detail;
      if (next === 'light' || next === 'dark' || next === 'system') setThemeChoice(next);
    };
    window.addEventListener('oneteam-theme-pref-change', onPrefChange);
    return () => window.removeEventListener('oneteam-theme-pref-change', onPrefChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || themeChoice !== 'system' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setModeRef.current(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [themeChoice]);

  const pickTheme = (next: ThemeChoice) => {
    setThemeChoice(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_PREF_KEY, next);
      window.dispatchEvent(new CustomEvent('oneteam-theme-pref-change', { detail: next }));
    }
    if (next === 'system') {
      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.setMode(prefersDark ? 'dark' : 'light');
    } else {
      theme.setMode(next);
    }
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.brandSelector}>
          <span>Walmart</span>
          <ChevronDown size={12} />
        </button>
      </div>

      <div className={styles.right}>
        <button className={styles.navBtn}>Company Dashboard</button>

        <button className={styles.iconBtn}>
          <ChatBubble size={18} />
          <span className={styles.badge}>3</span>
        </button>

        <button className={styles.iconBtn}>
          <Bell size={18} />
        </button>

        <div className={styles.avatarWrap} ref={menuRef}>
          <button
            className={styles.avatar}
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open user menu"
          >
            <span className={styles.avatarInner}>JD</span>
          </button>

          {menuOpen && (
            <div className={styles.menu} role="menu">
              <div className={styles.menuHeader}>
                <div className={styles.menuName}>John Doe</div>
                <div className={styles.menuEmail}>john.doe@walmart.com</div>
              </div>

              <button className={styles.statusBtn} type="button">
                <span className={styles.statusBtnIcon} aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="9" cy="10" r="1" fill="currentColor" />
                    <circle cx="15" cy="10" r="1" fill="currentColor" />
                    <path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M17 4v4M19 6h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <span className={styles.statusBtnLabel}>Set your status</span>
              </button>

              <div className={styles.menuDivider} />

              <button
                className={styles.menuItem}
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setSettingsOpen(true);
                }}
              >
                <span className={styles.menuItemIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <span className={styles.menuItemLabel}>Profile settings</span>
              </button>

              <button className={styles.menuItem} role="menuitem">
                <span className={styles.menuItemIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l8 3v6c0 4.5-3.4 8.5-8 9-4.6-.5-8-4.5-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={styles.menuItemLabel}>Privacy settings</span>
              </button>

              <button className={styles.menuItem} role="menuitem">
                <span className={styles.menuItemIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M16 3h5v5M21 3l-7 7M8 21H3v-5M3 21l7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={styles.menuItemLabel}>Switch organization</span>
              </button>

              <div className={styles.menuDivider} />

              <div className={styles.menuRow}>
                <span className={styles.menuItemLabel}>Theme</span>
                <div className={styles.themeToggle} role="radiogroup" aria-label="Theme">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeChoice === 'light'}
                    aria-label="Light"
                    className={`${styles.themeToggleBtn} ${themeChoice === 'light' ? styles.themeToggleBtnActive : ''}`}
                    onClick={() => pickTheme('light')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeChoice === 'dark'}
                    aria-label="Dark"
                    className={`${styles.themeToggleBtn} ${themeChoice === 'dark' ? styles.themeToggleBtnActive : ''}`}
                    onClick={() => pickTheme('dark')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeChoice === 'system'}
                    aria-label="Match system"
                    className={`${styles.themeToggleBtn} ${themeChoice === 'system' ? styles.themeToggleBtnActive : ''}`}
                    onClick={() => pickTheme('system')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M12 3a9 9 0 0 1 0 18V3z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className={styles.menuDivider} />

              <button className={`${styles.menuItem} ${styles.menuItemDanger}`} role="menuitem">
                <span className={styles.menuItemIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 17l5-5-5-5M20 12H9M12 4H5v16h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={styles.menuItemLabel}>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <ProfileSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        initialTab="preferences"
      />
    </header>
  );
}

