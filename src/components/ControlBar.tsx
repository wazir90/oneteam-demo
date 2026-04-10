'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { PaletteStrip } from './PaletteStrip';
import { presets } from '@/lib/presets';
import styles from './ControlBar.module.css';

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className={styles.colorPicker}>
      <div className={styles.pickerWrapper}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.picker}
        />
      </div>
      <div className={styles.pickerInfo}>
        <span className={styles.pickerLabel}>{label}</span>
        <span className={styles.hexValue}>{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

export function ControlBar() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`${styles.controlBar} ${expanded ? styles.expanded : ''}`}>
      {/* Expanded palette section */}
      {expanded && (
        <div className={styles.paletteSection}>
          <PaletteStrip
            palette={theme.mainPalette}
            activeTones={theme.getActiveTones('main')}
            label="Main"
          />
          <PaletteStrip
            palette={theme.buttonPalette}
            activeTones={theme.getActiveTones('button')}
            label="Button"
          />
          <PaletteStrip
            palette={theme.linkPalette}
            activeTones={theme.getActiveTones('link')}
            label="Link"
          />
        </div>
      )}

      {/* Main bar */}
      <div className={styles.bar}>
        {/* Color pickers */}
        <div className={styles.pickers}>
          <ColorPicker
            label="Main"
            value={theme.mainColor}
            onChange={theme.setMainColor}
          />
          <ColorPicker
            label="Button"
            value={theme.buttonColor}
            onChange={theme.setButtonColor}
          />
          <ColorPicker
            label="Link"
            value={theme.linkColor}
            onChange={theme.setLinkColor}
          />
        </div>

        <div className={styles.divider} />

        {/* Presets */}
        <div className={styles.presets}>
          {Object.entries(presets).map(([key, preset]) => (
            <button
              key={key}
              className={styles.presetBtn}
              onClick={() =>
                theme.setAllColors(preset.main, preset.button, preset.link)
              }
              title={preset.label}
            >
              <span
                className={styles.presetDot}
                style={{ backgroundColor: preset.main }}
              />
              <span className={styles.presetName}>{preset.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.divider} />

        {/* Palette toggle */}
        <button
          className={`${styles.iconBtn} ${expanded ? styles.active : ''}`}
          onClick={() => setExpanded(!expanded)}
          title="Toggle palette view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="4" height="12" rx="1" fill="currentColor" opacity={0.9} />
            <rect x="6" y="4" width="4" height="8" rx="1" fill="currentColor" opacity={0.5} />
            <rect x="11" y="6" width="4" height="4" rx="1" fill="currentColor" opacity={0.25} />
          </svg>
        </button>

        {/* Mode toggle */}
        <button className={styles.iconBtn} onClick={theme.toggleMode} title={theme.mode === 'light' ? 'Switch to dark' : 'Switch to light'}>
          {theme.mode === 'light' ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.17 3.17l1.06 1.06M11.77 11.77l1.06 1.06M3.17 12.83l1.06-1.06M11.77 4.23l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21.75 15.5a9.72 9.72 0 01-13.25-13.25A10 10 0 1021.75 15.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
