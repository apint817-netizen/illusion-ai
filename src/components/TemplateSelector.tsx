'use client';

import React from 'react';
import { TEMPLATES, TemplateInfo } from '../templates';
import styles from './TemplateSelector.module.css';

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function TemplateSelector({ selectedId, onSelect }: Props) {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Выберите шаблон</h3>
      <div className={styles.grid}>
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            className={`${styles.card} ${selectedId === tpl.id ? styles.active : ''}`}
            onClick={() => onSelect(tpl.id)}
          >
            <div 
              className={styles.preview} 
              style={{ background: tpl.previewColor }}
            >
              <span className={styles.previewIcon}>
                {tpl.category === 'tech' ? '🌑' : tpl.category === 'minimal' ? '⬜' : '🌈'}
              </span>
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{tpl.name}</span>
              <span className={styles.desc}>{tpl.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
