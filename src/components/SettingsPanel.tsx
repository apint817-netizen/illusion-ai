'use client';

import React from 'react';
import styles from './SettingsPanel.module.css';

export default function SettingsPanel() {
  return (
    <aside className={styles.panel}>
      <h2 className={styles.panelTitle}>Настройки генерации</h2>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Описание товара</h3>
        <textarea 
          className={styles.textarea} 
          placeholder="Например: Кроссовки беговые мужские..."
          rows={3}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Формат</h3>
        <div className={styles.optionsGrid}>
          <button className={`${styles.optionBtn} ${styles.active}`}>3:4 (WB)</button>
          <button className={styles.optionBtn}>1:1 (Ozon)</button>
          <button className={styles.optionBtn}>16:9 (Баннер)</button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Атмосфера / Композиция</h3>
        <div className={styles.optionsWrap}>
          <span className={`${styles.tag} ${styles.activeTag}`}>В интерьере</span>
          <span className={styles.tag}>На модели</span>
          <span className={styles.tag}>Крупный план</span>
          <span className={styles.tag}>Неоновый свет</span>
          <span className={styles.tag}>Минимализм</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ссылки на конкурентов</h3>
        <input 
          type="text" 
          className={styles.input} 
          placeholder="https://wildberries.ru/catalog/..."
        />
        <p className={styles.hint}>Мы проанализируем стиль и сделаем лучше ✨</p>
      </div>

      <div className={styles.stickyBottom}>
        <button className={styles.generateBtn}>Сгенерировать</button>
      </div>
    </aside>
  );
}
