'use client';

import { useEffect, useState } from 'react';
import styles from './ProfileSettingsModal.module.css';
import { useTheme } from './ThemeProvider';
import { lightIllustration, darkIllustration, systemIllustration } from './themeIllustrations';

type Tab = 'general' | 'security' | 'preferences' | 'notifications';
type ThemeChoice = 'light' | 'dark' | 'system';

const THEME_PREF_KEY = 'oneteam-theme-pref';

export function ProfileSettingsModal({
  open,
  onClose,
  initialTab = 'preferences',
}: {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const theme = useTheme();

  const readStoredChoice = (): ThemeChoice => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem(THEME_PREF_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'light';
  };

  const [draftChoice, setDraftChoice] = useState<ThemeChoice>(readStoredChoice);

  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setDraftChoice(readStoredChoice());
    }
  }, [open, initialTab]);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_PREF_KEY, draftChoice);
      window.dispatchEvent(new CustomEvent('oneteam-theme-pref-change', { detail: draftChoice }));
    }
    if (draftChoice === 'system') {
      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.setMode(prefersDark ? 'dark' : 'light');
    } else {
      theme.setMode(draftChoice);
    }
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-settings-title"
    >
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2 id="profile-settings-title" className={styles.title}>
            Profile settings
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close"
            onClick={onClose}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <nav className={styles.nav}>
            <NavBtn label="General" icon={<UserIcon />} active={tab === 'general'} onClick={() => setTab('general')} />
            <NavBtn label="Security" icon={<ShieldIcon />} active={tab === 'security'} onClick={() => setTab('security')} />
            <NavBtn label="Preferences" icon={<GearIcon />} active={tab === 'preferences'} onClick={() => setTab('preferences')} />
            <NavBtn label="Notifications" icon={<BellIcon />} active={tab === 'notifications'} onClick={() => setTab('notifications')} />
          </nav>

          <div className={styles.content}>
            {tab === 'preferences' && (
              <PreferencesTab
                appearanceChoice={draftChoice}
                onAppearanceChoice={setDraftChoice}
              />
            )}
            {tab === 'general' && <Placeholder label="General" />}
            {tab === 'security' && <Placeholder label="Security" />}
            {tab === 'notifications' && <Placeholder label="Notifications" />}
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function NavBtn({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
      onClick={onClick}
    >
      <span className={styles.navIcon}>{icon}</span>
      {label}
    </button>
  );
}

function PreferencesTab({
  appearanceChoice,
  onAppearanceChoice,
}: {
  appearanceChoice: ThemeChoice;
  onAppearanceChoice: (c: ThemeChoice) => void;
}) {
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <>
      <h3 className={styles.sectionTitle}>Preferences</h3>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Language</label>
        <select className={styles.select} defaultValue="en">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Translations for posts</label>
        <select className={styles.select} defaultValue="en">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <h3 className={styles.sectionTitle}>Privacy</h3>
      <p className={styles.sectionDesc}>
        Control who can see your information. Administrators can always see this.
      </p>

      <PrivacyField label="Phone number" defaultValue="everyone" />

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Date of birth (dd-mm-yyyy)</label>
        <div className={styles.fieldHelp}>We never display your age</div>
        <select className={styles.select} defaultValue="community">
          <option value="everyone">Everyone</option>
          <option value="community">Community</option>
          <option value="onlyme">Only me</option>
        </select>
      </div>

      <PrivacyField label="Last active" defaultValue="everyone" />
      <PrivacyField label="Chat messages" defaultValue="everyone" />

      <div className={styles.toggleField}>
        <div className={styles.toggleHeader}>Chat read receipts</div>
        <div className={styles.toggleDesc}>
          If you turn off read receipts, you won&apos;t be able to see when others have read your messages either. Read receipts are always enabled in group chats.
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={readReceipts}
          aria-label="Chat read receipts"
          className={`${styles.toggle} ${readReceipts ? styles.toggleOn : ''}`}
          onClick={() => setReadReceipts((v) => !v)}
        >
          <span className={styles.toggleKnob} />
        </button>
      </div>

      <h3 className={styles.sectionTitle}>Appearance</h3>
      <Appearance value={appearanceChoice} onChange={onAppearanceChoice} />
    </>
  );
}

function PrivacyField({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <select className={styles.select} defaultValue={defaultValue}>
        <option value="everyone">Everyone</option>
        <option value="community">Community</option>
        <option value="onlyme">Only me</option>
      </select>
    </div>
  );
}

function Appearance({
  value,
  onChange,
}: {
  value: ThemeChoice;
  onChange: (c: ThemeChoice) => void;
}) {
  return (
    <div className={styles.appearance}>
      <p className={styles.appearanceDesc}>
        Choose light or dark mode, or switch your mode automatically based on your system settings.
      </p>
      <div className={styles.themeCards} role="radiogroup" aria-label="Appearance">
        <ThemeCard
          choice="light"
          label="Light"
          illustration={lightIllustration}
          selected={value === 'light'}
          onSelect={onChange}
        />
        <ThemeCard
          choice="dark"
          label="Dark"
          illustration={darkIllustration}
          selected={value === 'dark'}
          onSelect={onChange}
        />
        <ThemeCard
          choice="system"
          label="Auto"
          illustration={systemIllustration}
          selected={value === 'system'}
          onSelect={onChange}
        />
      </div>
    </div>
  );
}

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
      <span
        className={styles.themeIllustration}
        dangerouslySetInnerHTML={{ __html: illustration }}
      />
      <span className={styles.themeLabel}>{label}</span>
    </button>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <>
      <h3 className={styles.sectionTitle}>{label}</h3>
      <p className={styles.sectionDesc}>{label} settings coming soon.</p>
    </>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 3v6c0 4.5-3.4 8.5-8 9-4.6-.5-8-4.5-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
