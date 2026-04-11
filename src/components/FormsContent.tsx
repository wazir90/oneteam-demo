'use client';

import styles from './FormsContent.module.css';

// Form data matching the Figma design
const forms = [
  { name: 'PTO Request', icon: 'user', iconBg: 'var(--bg-brand)', status: 'Live' as const, submissions: 12, createdBy: 'Aaron Johnson', avatarBg: 'var(--red-light)', date: 'Jan 12, 2026' },
  { name: 'Sick Leave Notification', icon: 'building', iconBg: 'var(--green-500)', status: 'Draft' as const, submissions: 7, createdBy: 'Bella Thompson', avatarBg: 'var(--blue-light)', date: 'Jan 12, 2026' },
  { name: 'Remote Work Request', icon: 'cake', iconBg: 'var(--yellow-500)', status: 'Live' as const, submissions: 4, createdBy: 'Carlos Martinez', avatarBg: 'var(--green-light)', date: 'Jan 12, 2026' },
  { name: 'Overtime Approval', icon: 'user', iconBg: 'var(--bg-brand)', status: 'Live' as const, submissions: 4, createdBy: 'Diana Patel', avatarBg: 'var(--yellow-light)', date: 'Jan 12, 2026' },
  { name: 'New Hire Information', icon: 'user', iconBg: 'var(--bg-brand)', status: 'Draft' as const, submissions: 2, createdBy: 'Ethan Brown', avatarBg: 'var(--purple-light)', date: 'Jan 12, 2026' },
  { name: 'First Day Checklist', icon: 'building', iconBg: 'var(--green-500)', status: 'Live' as const, submissions: 14, createdBy: 'Fiona Green', avatarBg: 'var(--teal-light)', date: 'Jan 12, 2026' },
  { name: 'Offboarding Clearance', icon: 'user', iconBg: 'var(--orange-400)', status: 'Draft' as const, submissions: 43, createdBy: 'George King', avatarBg: 'var(--red-light)', date: 'Jan 12, 2026' },
  { name: 'Emergency Contact Update', icon: 'cake', iconBg: 'var(--yellow-500)', status: 'Live' as const, submissions: 41, createdBy: 'Hannah Lewis', avatarBg: 'var(--blue-light)', date: 'Jan 12, 2026' },
  { name: 'Manager Evaluation', icon: 'user', iconBg: 'var(--orange-400)', status: 'Live' as const, submissions: 28, createdBy: 'Isaac White', avatarBg: 'var(--green-light)', date: 'Jan 12, 2026' },
  { name: 'Career Development Plan', icon: 'user', iconBg: 'var(--bg-brand)', status: 'Live' as const, submissions: 29, createdBy: 'David Lee', avatarBg: 'var(--yellow-light)', date: 'Jan 12, 2026' },
];

const quickActions = [
  { label: 'Create form', iconBg: 'var(--bg-button)', icon: 'plus' },
  { label: 'PTO Request', iconBg: 'var(--bg-warning)', icon: 'user' },
  { label: 'Sick Leave Notification', iconBg: 'var(--bg-success)', icon: 'building' },
  { label: 'Birthday Announcement', iconBg: 'var(--yellow-500)', icon: 'cake' },
];

function FormIcon({ type, bg }: { type: string; bg: string }) {
  return (
    <div className={styles.formIcon} style={{ backgroundColor: bg }}>
      {type === 'plus' && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
      )}
      {type === 'user' && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="white" strokeWidth="1.5"/><path d="M2 14c0-3 2.69-5 6-5s6 2 6 5" stroke="white" strokeWidth="1.5"/></svg>
      )}
      {type === 'building' && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="5" height="11" rx="1" stroke="white" strokeWidth="1.3"/><rect x="9" y="6" width="5" height="8" rx="1" stroke="white" strokeWidth="1.3"/><path d="M4 6h1M4 8h1M4 10h1M11 9h1M11 11h1" stroke="white" strokeWidth="1" strokeLinecap="round"/></svg>
      )}
      {type === 'cake' && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 10v4h12v-4" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/><path d="M2 10c1.33 1.33 2.67 1.33 4 0s2.67-1.33 4 0 2.67 1.33 4 0" stroke="white" strokeWidth="1.3"/><rect x="3" y="7" width="10" height="3" rx="1" stroke="white" strokeWidth="1.3"/><path d="M6 5V4M8 5V3M10 5V4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>
      )}
    </div>
  );
}

function SmallFormIcon({ type, bg }: { type: string; bg: string }) {
  return (
    <div className={styles.smallFormIcon} style={{ backgroundColor: bg }}>
      {type === 'user' && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="white" strokeWidth="1.8"/><path d="M2 14c0-3 2.69-5 6-5s6 2 6 5" stroke="white" strokeWidth="1.8"/></svg>
      )}
      {type === 'building' && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="5" height="11" rx="1" stroke="white" strokeWidth="1.5"/><rect x="9" y="6" width="5" height="8" rx="1" stroke="white" strokeWidth="1.5"/></svg>
      )}
      {type === 'cake' && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 10v4h12v-4" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><rect x="3" y="7" width="10" height="3" rx="1" stroke="white" strokeWidth="1.5"/></svg>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: 'Live' | 'Draft' }) {
  return (
    <span className={`${styles.statusBadge} ${status === 'Live' ? styles.live : styles.draft}`}>
      <span className={styles.statusDot} />
      {status}
    </span>
  );
}

export function FormsContent() {
  return (
    <div className={styles.container}>
      {/* Heading */}
      <div className={styles.heading}>
        <h1 className={styles.title}>All</h1>
        <button className={styles.createBtn}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Create form
        </button>
      </div>

      {/* Scrollable content */}
      <div className={styles.scrollArea}>
        <div className={styles.contentInner}>
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            {quickActions.map((action) => (
              <button key={action.label} className={styles.actionCard}>
                <FormIcon type={action.icon} bg={action.iconBg} />
                <span className={styles.actionLabel}>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.searchIcon}>
                <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className={styles.searchPlaceholder}>Search..</span>
            </div>

            <button className={styles.filterBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 20c0-3.31 3.13-6 7-6s7 2.69 7 6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 14c2.76 0 5 1.79 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Community in any</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            <button className={styles.filterBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 2v3M15 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Function group in any</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* Data Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.colName}>NAME</th>
                  <th className={styles.colStatus}>STATUS</th>
                  <th className={styles.colSubmission}>SUBMISSION</th>
                  <th className={styles.colCreatedBy}>CREATED BY</th>
                  <th className={styles.colDate}>CREATED AT</th>
                  <th className={styles.colActions}></th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.name}>
                    <td>
                      <div className={styles.nameCell}>
                        <SmallFormIcon type={form.icon} bg={form.iconBg} />
                        <span className={styles.formName}>{form.name}</span>
                      </div>
                    </td>
                    <td><StatusBadge status={form.status} /></td>
                    <td className={styles.submissionCell}>{form.submissions}</td>
                    <td>
                      <div className={styles.createdByCell}>
                        <div className={styles.creatorAvatar} style={{ backgroundColor: form.avatarBg }} />
                        <span>{form.createdBy}</span>
                      </div>
                    </td>
                    <td className={styles.dateCell}>{form.date}</td>
                    <td className={styles.actionsCell}>
                      <button className={styles.moreBtn}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="5" cy="10" r="1.5" fill="currentColor"/>
                          <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                          <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
