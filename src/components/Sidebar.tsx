'use client';

import {
  OneteamLogo,
  IconBarchart,
  IconSendPlane,
  IconGraduationHat,
  IconCalendarEvent,
  IconAnnotation,
  IconClipboardText,
  IconFolder,
  IconHand,
  IconUserTwo,
  IconShieldCheck,
  IconOrgChart,
  IconSettings,
  IconInformation,
} from './icons';
import styles from './Sidebar.module.css';

const iconNav = [
  { id: 'analytics', icon: <IconBarchart /> },
  { id: 'send', icon: <IconSendPlane /> },
  { id: 'learning', icon: <IconGraduationHat /> },
  { id: 'calendar', icon: <IconCalendarEvent /> },
  { id: 'chat', icon: <IconAnnotation /> },
  { id: 'forms', icon: <IconClipboardText />, active: true },
  { id: 'folders', icon: <IconFolder /> },
  { id: 'interact', icon: <IconHand /> },
  { id: 'people', icon: <IconUserTwo /> },
  { id: 'security', icon: <IconShieldCheck /> },
  { id: 'org', icon: <IconOrgChart /> },
];

const bottomNav = [
  { id: 'settings', icon: <IconSettings /> },
  { id: 'help', icon: <IconInformation /> },
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <div className={styles.logo}>
          <OneteamLogo />
        </div>
        <nav className={styles.mainNav}>
          {iconNav.map((item) => (
            <div
              key={item.id}
              className={`${styles.navItem} ${item.active ? styles.active : ''}`}
            >
              {item.active && <span className={styles.activeIndicator} />}
              <button
                className={styles.iconBtn}
                title={item.id}
              >
                {item.icon}
              </button>
            </div>
          ))}
        </nav>
      </div>
      <nav className={styles.bottomNav}>
        {bottomNav.map((item) => (
          <div key={item.id} className={styles.navItem}>
            <button
              className={styles.iconBtn}
              title={item.id}
            >
              {item.icon}
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}
