'use client';

import React, { useState } from 'react';
import Header from './Header';
import Workspace from './Workspace';
import SettingsPanel from './SettingsPanel';
import Gallery from './Gallery';
import styles from '../app/page.module.css';

export default function Dashboard() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadImage = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setOriginalImage(URL.createObjectURL(file));
    setBackgroundImage(null);

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
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateBackground = async (settings: { prompt: string, format: string }) => {
    if (!transparentImage) {
      setError("Сначала загрузите фото товара!");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Ошибка генерации фона');
      }

      const blob = await res.blob();
      setBackgroundImage(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setTransparentImage(null);
    setBackgroundImage(null);
    setError(null);
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainLayout}>
        <div className={styles.content}>
          <Workspace 
            originalImage={originalImage}
            transparentImage={transparentImage}
            backgroundImage={backgroundImage}
            isUploading={isUploading}
            isGenerating={isGenerating}
            error={error}
            onUpload={handleUploadImage}
            onReset={handleReset}
          />
          <Gallery />
        </div>
        <SettingsPanel onGenerate={handleGenerateBackground} isGenerating={isGenerating} />
      </main>
    </div>
  );
}
