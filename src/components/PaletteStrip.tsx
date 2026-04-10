'use client';

import { DISPLAY_TONES, type TonalScale } from '@/lib/theme';
import styles from './PaletteStrip.module.css';

interface PaletteStripProps {
  palette: TonalScale;
  activeTones: number[];
  label: string;
}

export function PaletteStrip({ palette, activeTones, label }: PaletteStripProps) {
  return (
    <div className={styles.strip}>
      <span className={styles.label}>{label}</span>
      <div className={styles.swatches}>
        {DISPLAY_TONES.map((tone) => {
          const hex = palette[tone];
          const isActive = activeTones.includes(tone);
          return (
            <div key={tone} className={styles.swatchWrapper}>
              <div
                className={`${styles.swatch} ${isActive ? styles.active : ''}`}
                style={{ backgroundColor: hex }}
                title={`Tone ${tone}: ${hex}`}
              />
              <span className={styles.toneLabel}>{tone}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
