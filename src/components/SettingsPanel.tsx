'use client';

import React, { useState } from 'react';
import styles from './SettingsPanel.module.css';

interface Props {
  onGenerate: (settings: { prompt: string, format: string }) => void;
  isGenerating: boolean;
}

export default function SettingsPanel({ onGenerate, isGenerating }: Props) {
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState("3:4 (WB)");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const tags = ["В интерьере", "На модели", "Крупный план", "Неоновый свет", "Минимализм"];

  const handleTagToggle = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerateClick = () => {
    const combinedPrompt = `${prompt} ${activeTags.join(", ")}`.trim();
    onGenerate({ prompt: combinedPrompt || "product shot", format });
  };

  return (
    <aside className={styles.panel}>
      <h2 className={styles.panelTitle}>Настройки генерации</h2>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Описание товара</h3>
        <textarea 
          className={styles.textarea} 
          placeholder="Например: Кроссовки беговые мужские..."
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Формат</h3>
        <div className={styles.optionsGrid}>
          {["3:4 (WB)", "1:1 (Ozon)", "16:9 (Баннер)"].map(opt => (
             <button 
               key={opt}
               onClick={() => setFormat(opt)}
               className={`${styles.optionBtn} ${format === opt ? styles.active : ''}`}>
               {opt}
             </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Атмосфера / Композиция</h3>
        <div className={styles.optionsWrap}>
          {tags.map(tag => (
             <span 
               key={tag}
               onClick={() => handleTagToggle(tag)}
               className={`${styles.tag} ${activeTags.includes(tag) ? styles.activeTag : ''}`}>
               {tag}
             </span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ссылки на конкурентов (Скоро)</h3>
        <input 
          type="text" 
          className={styles.input} 
          placeholder="https://wildberries.ru/catalog/..."
          disabled
        />
        <p className={styles.hint}>Пока в разработке ✨</p>
      </div>

      <div className={styles.stickyBottom}>
        <button 
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className={styles.generateBtn}
          style={{ opacity: isGenerating ? 0.7 : 1, cursor: isGenerating ? 'not-allowed' : 'pointer' }}
        >
          {isGenerating ? 'Нейросеть рисует... 🎨' : 'Сгенерировать'}
        </button>
      </div>
    </aside>
  );
}

