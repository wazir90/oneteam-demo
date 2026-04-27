'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { lightIllustration, darkIllustration, systemIllustration } from './themeIllustrations';
import styles from './BrandingPage.module.css';

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

type ThemeChoice = 'light' | 'dark' | 'system';

function ThemeCard({
  choice,
  label,
  illustration,
  selected,
  onSelect,
}: {
  choice: ThemeChoice;
  label: string;
  illustration: string;
  selected: boolean;
  onSelect: (c: ThemeChoice) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`${styles.themeCard} ${selected ? styles.themeCardSelected : ''}`}
      onClick={() => onSelect(choice)}
    >
      <span className={`${styles.themeRadio} ${selected ? styles.themeRadioSelected : ''}`}>
        {selected && <span className={styles.themeRadioDot} />}
      </span>
      <span
        className={styles.themeIllustration}
        dangerouslySetInnerHTML={{ __html: illustration }}
      />
      <span className={styles.themeLabel}>{label}</span>
    </button>
  );
}

function ColorField({
  label,
  value,
  onChange,
  isAuto,
  onReset,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  isAuto?: boolean;
  onReset?: () => void;
}) {
  return (
    <div className={styles.colorField}>
      <label className={styles.colorLabel}>{label} color</label>
      <div className={styles.colorInput}>
        <span className={styles.swatch}>
          <span className={styles.swatchFill} style={{ background: value }} />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} color`}
          />
        </span>
        <input
          type="text"
          className={styles.hexInput}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (HEX_RE.test(v)) onChange(v);
          }}
          spellCheck={false}
        />
        {isAuto ? (
          <span className={styles.autoBadge} title="Matches light mode">AUTO</span>
        ) : onReset ? (
          <button
            type="button"
            className={styles.resetInlineBtn}
            onClick={onReset}
            title="Reset to auto"
            aria-label={`Reset ${label.toLowerCase()} dark override to auto`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function BrandingPage() {
  const theme = useTheme();

  const [themeChoice, setThemeChoice] = useState<ThemeChoice>('light');
  const [editingTab, setEditingTab] = useState<'light' | 'dark'>('light');
  const isDark = editingTab === 'dark';
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setHeaderImage(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const setMode = theme.setMode;

  useEffect(() => {
    if (themeChoice !== 'system') {
      setMode(themeChoice);
      return;
    }
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setMode(mq.matches ? 'dark' : 'light');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [themeChoice, setMode]);

  const setTab = (tab: 'light' | 'dark') => {
    setEditingTab(tab);
  };

  const pickThemeChoice = (choice: ThemeChoice) => {
    setThemeChoice(choice);
    if (choice === 'light' || choice === 'dark') {
      setEditingTab(choice);
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      setEditingTab(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  };

  const lightPrimary = theme.mainColor;
  const darkPrimary = theme.darkMainColor ?? theme.mainColor;

  return (
    <div className={styles.page}>
      <TopBar />
      <div className={styles.body}>
        <Sidebar />
        <div className={styles.settingsNav}>
          <div className={styles.settingsTitle}>Settings</div>
          <NavItem label="General" />
          <NavItem label="Branding" active />
          <NavItem label="Apps & Shortcuts" />
          <NavItem label="Integration" />
          <NavItem label="Invitation email" />
          <NavItem label="Custom feeds" />
        </div>

        <div className={styles.main}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Choose theme</div>
            <div
              className={styles.themeCards}
              role="radiogroup"
              aria-label="Choose theme"
              style={{
                ['--cu-appearance-switcher-lightmode-primary' as string]: lightPrimary,
                ['--cu-appearance-switcher-darkmode-primary' as string]: darkPrimary,
              }}
            >
              <ThemeCard
                choice="light"
                label="Light"
                illustration={lightIllustration}
                selected={themeChoice === 'light'}
                onSelect={pickThemeChoice}
              />
              <ThemeCard
                choice="dark"
                label="Dark"
                illustration={darkIllustration}
                selected={themeChoice === 'dark'}
                onSelect={pickThemeChoice}
              />
              <ThemeCard
                choice="system"
                label="Match browser"
                illustration={systemIllustration}
                selected={themeChoice === 'system'}
                onSelect={pickThemeChoice}
              />
            </div>

            <div className={styles.divider} />

            <div className={styles.sectionTitle}>Brand colors</div>

            <div className={styles.tabs} role="tablist" aria-label="Theme mode">
              <button
                type="button"
                role="tab"
                aria-selected={!isDark}
                className={`${styles.tab} ${!isDark ? styles.tabActive : ''}`}
                onClick={() => setTab('light')}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.17 3.17l1.06 1.06M11.77 11.77l1.06 1.06M3.17 12.83l1.06-1.06M11.77 4.23l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Light mode
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isDark}
                className={`${styles.tab} ${isDark ? styles.tabActive : ''}`}
                onClick={() => setTab('dark')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21.75 15.5a9.72 9.72 0 01-13.25-13.25A10 10 0 1021.75 15.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Dark mode
              </button>
            </div>

            <div className={styles.colorRow}>
              {!isDark ? (
                <>
                  <ColorField label="Main" value={theme.mainColor} onChange={theme.setMainColor} />
                  <ColorField label="Button" value={theme.buttonColor} onChange={theme.setButtonColor} />
                  <ColorField label="Link" value={theme.linkColor} onChange={theme.setLinkColor} />
                </>
              ) : (
                <>
                  <ColorField
                    label="Main"
                    value={theme.darkMainColor ?? theme.mainColor}
                    onChange={theme.setDarkMainColor}
                    isAuto={theme.darkMainColor === null}
                    onReset={() => theme.setDarkMainColor(null)}
                  />
                  <ColorField
                    label="Button"
                    value={theme.darkButtonColor ?? theme.buttonColor}
                    onChange={theme.setDarkButtonColor}
                    isAuto={theme.darkButtonColor === null}
                    onReset={() => theme.setDarkButtonColor(null)}
                  />
                  <ColorField
                    label="Link"
                    value={theme.darkLinkColor ?? theme.linkColor}
                    onChange={theme.setDarkLinkColor}
                    isAuto={theme.darkLinkColor === null}
                    onReset={() => theme.setDarkLinkColor(null)}
                  />
                </>
              )}
            </div>

            <div className={styles.headerImageField}>
              <label className={styles.colorLabel}>Header image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInputHidden}
                onChange={onPickFile}
              />
              {headerImage ? (
                <div className={styles.headerImagePreview}>
                  <img src={headerImage} alt="Header preview" />
                  <button
                    type="button"
                    className={styles.headerImageRemove}
                    onClick={() => setHeaderImage(null)}
                    aria-label="Remove header image"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.headerImageDropzone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 16l5-5 4 4 3-3 6 6M3 5h18v14H3V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Upload header image</span>
                </button>
              )}
            </div>

            <div className={styles.actions}>
              <button className={styles.saveBtn} onClick={theme.saveChanges}>Save changes</button>
              <button className={styles.resetThemeBtn} onClick={theme.resetToDefaults}>Back to standard theme</button>
            </div>
          </div>

          <div className={styles.exampleHeader}>Example</div>
          <PreviewWireframe headerImage={headerImage} />
        </div>
      </div>
    </div>
  );
}

function PreviewWireframe({ headerImage }: { headerImage: string | null }) {
  return (
    <div className={styles.wireframe}>
      <div className={styles.wfTopBar}>
        <span className={styles.wfTopPill} />
      </div>
      <div className={styles.wfBody}>
        <div className={styles.wfRail}>
          <span className={styles.wfRailLogo} />
          <span className={styles.wfRailDot} />
          <span className={styles.wfRailDot} />
          <span className={styles.wfRailDot} />
          <span className={styles.wfRailDot} />
        </div>
        <div className={styles.wfPanel}>
          <div className={styles.wfPanelRow}>
            <span className={styles.wfAvatar} />
            <span className={styles.wfLineLong} />
          </div>
          <span className={styles.wfSectionLabel} />
          <div className={styles.wfPanelGroup}>
            <span className={styles.wfBlock} />
            <span className={styles.wfArrowLine} />
            <span className={styles.wfArrowLine} />
            <span className={styles.wfArrowLine} />
          </div>
          <span className={styles.wfSectionLabel} />
          <div className={styles.wfPanelGroup}>
            <span className={styles.wfBlock} />
            <span className={styles.wfBlock} />
          </div>
        </div>
        <div className={styles.wfMain}>
          <div
            className={styles.wfHero}
            style={
              headerImage
                ? { backgroundImage: `url(${headerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : undefined
            }
          >
            {headerImage && <div className={styles.wfHeroOverlay} />}
            <div className={styles.wfHeroBadge} />
            <span className={styles.wfHeroTitle}>My timeline</span>
            <span className={styles.wfHeroSub}>Location</span>
          </div>
          <div className={styles.wfTabs}>
            <span className={styles.wfTabActive}>Messages</span>
            <span className={styles.wfTab}>Important</span>
            <span className={styles.wfTab}>Files</span>
          </div>
          <div className={styles.wfComposer}>
            <span className={styles.wfAvatar} />
            <span className={styles.wfComposerText} />
          </div>
          <div className={styles.wfActions}>
            <span className={styles.wfActionPill} />
            <span className={styles.wfActionPill} />
            <span className={styles.wfActionPill} />
          </div>
          <div className={styles.wfPostsHeader}>
            <span className={styles.wfLineSm} />
          </div>
          <div className={styles.wfPostCard}>
            <div className={styles.wfPostHead}>
              <span className={styles.wfAvatar} />
              <span className={styles.wfLineMd} />
            </div>
            <span className={styles.wfLineFull} />
            <span className={styles.wfLineFull} />
            <span className={styles.wfLineHalf} />
          </div>
        </div>
        <div className={styles.wfRight}>
          <div className={styles.wfButton} />
          <div className={styles.wfRightCard}>
            <div className={styles.wfRightHead}>
              <span className={styles.wfLineSm} />
              <span className={styles.wfLink} />
            </div>
            <div className={styles.wfRightHead}>
              <span className={styles.wfLineSm} />
              <span className={styles.wfLink} />
            </div>
          </div>
          <div className={styles.wfRightCard}>
            <span className={styles.wfLineSm} />
            <span className={styles.wfLineFull} />
            <span className={styles.wfLineFull} />
            <span className={styles.wfLineFull} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className={`${styles.navItem} ${active ? styles.active : ''}`}>
      <span className={styles.navIcon}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
      {label}
    </div>
  );
}
