import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}></div>
        <span className={styles.logoText}>Illusion<span className={styles.logoHighlight}>AI</span></span>
      </div>
      <div className={styles.actions}>
        <div className={styles.creditsBadge}>
          <span className={styles.creditsIcon}>✨</span>
          <span className={styles.creditsText}>20 кредитов</span>
        </div>
        <button className={styles.profileBtn}>
          <div className={styles.avatar}>С</div>
        </button>
      </div>
    </header>
  );
}
