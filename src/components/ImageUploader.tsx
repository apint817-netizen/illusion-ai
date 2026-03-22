'use client';

import React, { useState } from 'react';
import styles from './ImageUploader.module.css';

export default function ImageUploader() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        <div className={styles.iconWrapper}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <h3 className={styles.title}>Загрузите фото товара</h3>
        <p className={styles.subtitle}>Перетащите изображение сюда или кликните</p>
        <button className={styles.uploadBtn}>Выбрать файл</button>
      </div>
    </div>
  );
}
