'use client';

import styles from './TopBar.module.css';
import { ChevronDown } from './icons/ChevronDown';
import { ChatBubble } from './icons/ChatBubble';
import { Bell } from './icons/Bell';

export function TopBar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {/* Brand selector */}
        <button className={styles.brandSelector}>
          <span>Walmart</span>
          <ChevronDown size={12} />
        </button>
      </div>

      <div className={styles.right}>
        <button className={styles.navBtn}>Company Dashboard</button>

        {/* Chat icon with badge */}
        <button className={styles.iconBtn}>
          <ChatBubble size={18} />
          <span className={styles.badge}>3</span>
        </button>

        {/* Notification bell */}
        <button className={styles.iconBtn}>
          <Bell size={18} />
        </button>

        {/* Avatar */}
        <div className={styles.avatar}>
          <div className={styles.avatarInner}>JD</div>
        </div>
      </div>
    </header>
  );
}
