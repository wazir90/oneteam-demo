'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

type NavItem = {
  id: string;
  icon: React.ReactNode;
  href?: string;
  matchPath?: string;
};

const iconNav: NavItem[] = [
  { id: 'analytics', icon: <IconBarchart /> },
  { id: 'send', icon: <IconSendPlane /> },
  { id: 'learning', icon: <IconGraduationHat /> },
  { id: 'calendar', icon: <IconCalendarEvent /> },
  { id: 'chat', icon: <IconAnnotation /> },
  { id: 'forms', icon: <IconClipboardText />, href: '/', matchPath: '/' },
  { id: 'folders', icon: <IconFolder /> },
  { id: 'interact', icon: <IconHand /> },
  { id: 'people', icon: <IconUserTwo /> },
  { id: 'security', icon: <IconShieldCheck /> },
  { id: 'org', icon: <IconOrgChart /> },
];

const bottomNav: NavItem[] = [
  { id: 'settings', icon: <IconSettings />, href: '/branding', matchPath: '/branding' },
  { id: 'help', icon: <IconInformation /> },
];

export function Sidebar({ activePath }: { activePath?: string } = {}) {
  const currentPath = usePathname();
  const pathname = activePath ?? currentPath;

  const renderItem = (item: NavItem) => {
    const isActive = item.matchPath ? pathname === item.matchPath : false;
    const content = (
      <>
        {isActive && <span className={styles.activeIndicator} />}
        <button className={styles.iconBtn} title={item.id} tabIndex={-1}>
          {item.icon}
        </button>
      </>
    );
    const className = `${styles.navItem} ${isActive ? styles.active : ''}`;

    if (item.href) {
      return (
        <Link key={item.id} href={item.href} className={className} aria-label={item.id}>
          {content}
        </Link>
      );
    }
    return (
      <div key={item.id} className={className}>
        {content}
      </div>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <div className={styles.logo}>
          <OneteamLogo />
        </div>
        <nav className={styles.mainNav}>{iconNav.map(renderItem)}</nav>
      </div>
      <nav className={styles.bottomNav}>{bottomNav.map(renderItem)}</nav>
    </aside>
  );
}
