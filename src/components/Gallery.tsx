import React from 'react';
import styles from './Gallery.module.css';

export default function Gallery() {
  return (
    <div className={styles.galleryContainer}>
      <h3 className={styles.title}>Последние генерации</h3>
      <div className={styles.grid}>
        {/* Placeholder items */}
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className={styles.card}>
            <div className={styles.imagePlaceholder}>
              <span className={styles.imageIcon}>📸</span>
            </div>
            <div className={styles.cardOverlay}>
              <button className={styles.actionBtn}>Скачать</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
