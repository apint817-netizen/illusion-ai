'use client';

import React, { useState, useRef } from 'react';
import Header from './Header';
import ImageUploader from './ImageUploader';
import TemplateSelector from './TemplateSelector';
import { getTemplateComponent, CardData, CardFormat, CARD_FORMATS } from '../templates';
import styles from './Dashboard.module.css';

const DEFAULT_CALLOUTS = [
  { text: 'Преимущество 1', position: 'top-left' as const, icon: '✨' },
  { text: 'Преимущество 2', position: 'top-right' as const, icon: '⚡' },
  { text: 'Преимущество 3', position: 'bottom-left' as const, icon: '🎯' },
  { text: 'Преимущество 4', position: 'bottom-right' as const, icon: '💎' },
];

export default function Dashboard() {
  // Step tracking
  const [step, setStep] = useState<'upload' | 'configure' | 'preview'>('upload');

  // Image state
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState('dark-premium');
  const [format, setFormat] = useState<CardFormat>('3:4');

  // Card content state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [callouts, setCallouts] = useState(DEFAULT_CALLOUTS);
  const [badges, setBadges] = useState<string[]>([]);
  const [isGeneratingText, setIsGeneratingText] = useState(false);

  // Refs
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle image upload + background removal
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Ошибка при удалении фона');
      }

      const blob = await res.blob();
      setTransparentImage(URL.createObjectURL(blob));
      setStep('configure');
    } catch (e: any) {
      setUploadError(e.message || 'Ошибка');
    } finally {
      setIsUploading(false);
    }
  };

  // AI text generation
  const handleGenerateText = async (description: string) => {
    setIsGeneratingText(true);
    try {
      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) throw new Error('Ошибка генерации текста');

      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.subtitle) setSubtitle(data.subtitle);
      if (data.callouts) {
        const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = [
          'top-left', 'top-right', 'bottom-left', 'bottom-right'
        ];
        setCallouts(data.callouts.slice(0, 4).map((c: any, i: number) => ({
          text: c.text || c,
          position: positions[i],
          icon: c.icon || ['✨', '⚡', '🎯', '💎'][i],
        })));
      }
      if (data.badges) setBadges(data.badges);
    } catch (e: any) {
      // If AI fails, at least set a baseline from description
      setTitle(description.split(' ').slice(0, 3).join(' ').toUpperCase());
    } finally {
      setIsGeneratingText(false);
    }
  };

  // Update a callout text
  const updateCallout = (index: number, text: string) => {
    setCallouts(prev => prev.map((c, i) => i === index ? { ...c, text } : c));
  };

  // Export PNG
  const handleExport = async () => {
    if (!cardRef.current) return;

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const link = document.createElement('a');
    link.download = `card-${format}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Build card data
  const cardData: CardData = {
    title: title || 'НАЗВАНИЕ ТОВАРА',
    subtitle: subtitle || undefined,
    callouts,
    badges,
    productImageUrl: transparentImage || '',
  };

  const TemplateComponent = getTemplateComponent(selectedTemplate);

  return (
    <div className={styles.app}>
      <Header />

      {step === 'upload' && (
        <div className={styles.uploadSection}>
          <h2 className={styles.stepTitle}>Шаг 1: Загрузите фото товара</h2>
          <p className={styles.stepDesc}>Мы автоматически уберём фон</p>

          {isUploading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Удаляем фон...</p>
            </div>
          ) : uploadError ? (
            <div className={styles.error}>
              <p>⚠️ {uploadError}</p>
              <button onClick={() => setUploadError(null)} className={styles.btn}>
                Попробовать снова
              </button>
            </div>
          ) : (
            <ImageUploader onUpload={handleUpload} />
          )}
        </div>
      )}

      {step === 'configure' && (
        <div className={styles.configSection}>
          <div className={styles.sidebar}>
            <h2 className={styles.stepTitle}>Шаг 2: Настройте карточку</h2>

            {/* Template selector */}
            <TemplateSelector
              selectedId={selectedTemplate}
              onSelect={setSelectedTemplate}
            />

            {/* Format */}
            <div className={styles.field}>
              <label className={styles.label}>Формат</label>
              <div className={styles.formatBtns}>
                {(Object.entries(CARD_FORMATS) as [string, { width: number; height: number; label: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    className={`${styles.formatBtn} ${format === key ? styles.formatActive : ''}`}
                    onClick={() => setFormat(key as CardFormat)}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Description */}
            <div className={styles.field}>
              <label className={styles.label}>Описание товара</label>
              <textarea 
                className={styles.textarea}
                placeholder="Опишите товар — AI заполнит карточку..."
                id="product-description"
              />
              <button 
                className={styles.aiBtn}
                disabled={isGeneratingText}
                onClick={() => {
                  const el = document.getElementById('product-description') as HTMLTextAreaElement;
                  if (el?.value) handleGenerateText(el.value);
                }}
              >
                {isGeneratingText ? '⏳ Генерирую...' : '🤖 AI заполнить'}
              </button>
            </div>

            {/* Manual title */}
            <div className={styles.field}>
              <label className={styles.label}>Заголовок</label>
              <input 
                className={styles.input}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="НАЗВАНИЕ ТОВАРА"
              />
            </div>

            {/* Subtitle */}
            <div className={styles.field}>
              <label className={styles.label}>Подзаголовок</label>
              <input 
                className={styles.input}
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="для вашего комфорта"
              />
            </div>

            {/* Callouts */}
            <div className={styles.field}>
              <label className={styles.label}>Выноски</label>
              {callouts.map((c, i) => (
                <input
                  key={i}
                  className={styles.input}
                  value={c.text}
                  onChange={e => updateCallout(i, e.target.value)}
                  placeholder={`Преимущество ${i + 1}`}
                />
              ))}
            </div>

            {/* Export */}
            <div className={styles.actions}>
              <button className={styles.exportBtn} onClick={handleExport}>
                📥 Скачать PNG
              </button>
              <button 
                className={styles.resetBtn} 
                onClick={() => {
                  setStep('upload');
                  setTransparentImage(null);
                  setTitle('');
                  setSubtitle('');
                  setCallouts(DEFAULT_CALLOUTS);
                  setBadges([]);
                }}
              >
                Начать заново
              </button>
            </div>
          </div>

          {/* Card Preview */}
          <div className={styles.previewArea}>
            <div className={styles.previewScale}>
              <div ref={cardRef}>
                <TemplateComponent data={cardData} format={format} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
