'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { generatePalette, resolveAllTokens } from '@/lib/theme';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import styles from './BrandingPage.module.css';

function ColorRow({
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
    <div className={styles.colorRow}>
      <span className={styles.colorRowLabel}>{label}</span>
      <div className={styles.colorRowRight}>
        {isAuto && <span className={styles.autoBadge}>AUTO</span>}
        {!isAuto && onReset && (
          <button
            type="button"
            className={styles.resetInlineBtn}
            onClick={onReset}
            title="Reset to auto"
            aria-label={`Reset ${label.toLowerCase()} to auto`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <span className={styles.colorRowSwatch} style={{ background: value }}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
          />
        </span>
      </div>
    </div>
  );
}

export function BrandingPage() {
  const theme = useTheme();

  const [editingTab, setEditingTab] = useState<'light' | 'dark'>('light');
  const isDark = editingTab === 'dark';
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const readImage = (file: File, setter: (v: string | null) => void) => {
    const reader = new FileReader();
    reader.onload = () => setter(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readImage(file, setHeaderImage);
    e.target.value = '';
  };

  const onPickLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readImage(file, setLogoImage);
    e.target.value = '';
  };

  // Draft state — picker edits these locally; only Publish commits to global theme.
  const [draftMain, setDraftMain] = useState(theme.mainColor);
  const [draftButton, setDraftButton] = useState(theme.buttonColor);
  const [draftLink, setDraftLink] = useState(theme.linkColor);
  const [draftDarkMain, setDraftDarkMain] = useState<string | null>(theme.darkMainColor);
  const [draftDarkButton, setDraftDarkButton] = useState<string | null>(theme.darkButtonColor);
  const [draftDarkLink, setDraftDarkLink] = useState<string | null>(theme.darkLinkColor);

  // Re-sync drafts when global theme changes (initial hydrate, Revert, preset switch).
  useEffect(() => {
    setDraftMain(theme.mainColor);
    setDraftButton(theme.buttonColor);
    setDraftLink(theme.linkColor);
    setDraftDarkMain(theme.darkMainColor);
    setDraftDarkButton(theme.darkButtonColor);
    setDraftDarkLink(theme.darkLinkColor);
  }, [
    theme.mainColor,
    theme.buttonColor,
    theme.linkColor,
    theme.darkMainColor,
    theme.darkButtonColor,
    theme.darkLinkColor,
  ]);

  const draftMainPalette = useMemo(() => generatePalette(draftMain), [draftMain]);
  const draftButtonPalette = useMemo(() => generatePalette(draftButton), [draftButton]);
  const draftLinkPalette = useMemo(() => generatePalette(draftLink), [draftLink]);

  const previewTokens = useMemo(
    () =>
      resolveAllTokens(
        draftMainPalette,
        draftButtonPalette,
        draftLinkPalette,
        editingTab,
        draftMain,
        draftButton,
        draftLink,
        { main: draftDarkMain, button: draftDarkButton, link: draftDarkLink },
      ) as unknown as React.CSSProperties,
    [
      editingTab,
      draftMainPalette,
      draftButtonPalette,
      draftLinkPalette,
      draftMain,
      draftButton,
      draftLink,
      draftDarkMain,
      draftDarkButton,
      draftDarkLink,
    ],
  );

  const onPublish = () => {
    theme.setAllColors(draftMain, draftButton, draftLink, {
      main: draftDarkMain ?? undefined,
      button: draftDarkButton ?? undefined,
      link: draftDarkLink ?? undefined,
    });
    // setAllColors is sync; saveChanges reads from theme state which won't reflect
    // the new values until next render, so persist explicitly here.
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'oneteam-theme',
        JSON.stringify({
          main: draftMain,
          button: draftButton,
          link: draftLink,
          darkMain: draftDarkMain,
          darkButton: draftDarkButton,
          darkLink: draftDarkLink,
        }),
      );
    }
  };

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
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderRow}>
              <h1 className={styles.pageTitle}>Branding</h1>
              <div className={styles.pageHeaderActions}>
                <button className={styles.revertBtn} onClick={theme.resetToDefaults}>
                  Revert
                </button>
                <button className={styles.publishBtn} onClick={onPublish}>
                  Publish
                </button>
              </div>
            </div>
            <div className={styles.tabs} role="tablist" aria-label="Theme mode">
              <button
                type="button"
                role="tab"
                aria-selected={!isDark}
                className={`${styles.tab} ${!isDark ? styles.tabActive : ''}`}
                onClick={() => setEditingTab('light')}
              >
                Light Mode
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isDark}
                className={`${styles.tab} ${isDark ? styles.tabActive : ''}`}
                onClick={() => setEditingTab('dark')}
              >
                Dark Mode
              </button>
            </div>
          </div>

          <div className={styles.split}>
            <div className={styles.controlsCol}>
              <div className={styles.headingLabel}>Header</div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Logo</label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.fileInputHidden}
                  onChange={onPickLogo}
                />
                <div className={styles.logoCard}>
                  {logoImage ? (
                    <>
                      <img src={logoImage} alt="Logo preview" className={styles.logoPreview} />
                      <button
                        type="button"
                        className={styles.headerImageRemove}
                        onClick={() => setLogoImage(null)}
                        aria-label="Remove logo"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={styles.logoUploadBtn}
                      onClick={() => logoInputRef.current?.click()}
                      aria-label="Upload logo"
                    >
                      <div className={styles.logoCircle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Header Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.fileInputHidden}
                  onChange={onPickFile}
                />
                {headerImage ? (
                  <div className={styles.headerImageCard}>
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

              <div className={styles.divider} />

              <div className={styles.colorRows}>
                {!isDark ? (
                  <>
                    <ColorRow label="Main Color" value={draftMain} onChange={setDraftMain} />
                    <ColorRow label="Button Color" value={draftButton} onChange={setDraftButton} />
                    <ColorRow label="Link Color" value={draftLink} onChange={setDraftLink} />
                  </>
                ) : (
                  <>
                    <ColorRow
                      label="Main Color"
                      value={draftDarkMain ?? draftMain}
                      onChange={setDraftDarkMain}
                      isAuto={draftDarkMain === null}
                      onReset={() => setDraftDarkMain(null)}
                    />
                    <ColorRow
                      label="Button Color"
                      value={draftDarkButton ?? draftButton}
                      onChange={setDraftDarkButton}
                      isAuto={draftDarkButton === null}
                      onReset={() => setDraftDarkButton(null)}
                    />
                    <ColorRow
                      label="Link Color"
                      value={draftDarkLink ?? draftLink}
                      onChange={setDraftDarkLink}
                      isAuto={draftDarkLink === null}
                      onReset={() => setDraftDarkLink(null)}
                    />
                  </>
                )}
              </div>
            </div>

            <div className={styles.previewCol}>
              {/* <div className={styles.exampleHeader}>Example</div> */}
              <div className={styles.browserWindow} style={previewTokens} data-mode={editingTab}>
                <div className={styles.browserToolbar}>
                  <span className={styles.browserDot} data-color="red" />
                  <span className={styles.browserDot} data-color="yellow" />
                  <span className={styles.browserDot} data-color="green" />
                </div>
                <div className={styles.browserContent}>
                  <PreviewWireframe headerImage={headerImage} logoImage={logoImage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewWireframe({
  headerImage,
  logoImage,
}: {
  headerImage: string | null;
  logoImage: string | null;
}) {
  return (
    <div className={styles.wireframe}>
      <div className={styles.wfTopBar}>
        <span className={styles.wfTopPill} />
      </div>
      <div className={styles.wfBody}>
        <div className={styles.wfRail}>
          <span
            className={styles.wfRailLogo}
            style={
              logoImage
                ? {
                    backgroundImage: `url(${logoImage})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          />
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
