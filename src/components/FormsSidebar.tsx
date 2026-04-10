'use client';

import { ClipboardText, FolderOpen, PlayBig, ReminderAnticlockwise, ArchiveDefault } from './icons';
import styles from './FormsSidebar.module.css';

const navItems = [
  { label: 'All', count: 366, active: true, icon: <ClipboardText /> },
  { label: 'Groups', count: 65, icon: <FolderOpen /> },
  { label: 'Live', icon: <PlayBig /> },
  { label: 'Draft', count: 222, icon: <ReminderAnticlockwise /> },
  { label: 'Archived', count: 34, icon: <ArchiveDefault /> },
];

export function FormsSidebar() {
  return (
    <div className={styles.panel}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Forms</h2>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <div key={item.label} className={styles.tabWrapper}>
            <a
              href="#"
              className={`${styles.navItem} ${item.active ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>
                {item.label}
                {item.count !== undefined && ` (${item.count})`}
              </span>
            </a>
          </div>
        ))}
      </nav>
    </div>
  );
}
