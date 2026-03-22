'use client';

import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import styles from './Workspace.module.css';

export default function Workspace() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setOriginalImage(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Ошибка при обращении к AI');
      }

      const blob = await res.blob();
      setTransparentImage(URL.createObjectURL(blob));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.workspace}>
      {!originalImage && <ImageUploader onUpload={handleUpload} />}
      
      {isLoading && (
         <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Магия AI... Идеально вырезаем фон 🪄</p>
         </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <p>⚠️ {error}</p>
          <button onClick={() => {setError(null); setOriginalImage(null);}} className={styles.retryBtn}>Попробовать снова</button>
        </div>
      )}

      {transparentImage && !isLoading && (
        <div className={styles.canvasArea}>
          {/* Transparent chekerboard background */}
          <div className={styles.checkeredBg}>
            <img src={transparentImage} alt="Вырезанный товар" className={styles.productImg} />
          </div>
          <div className={styles.controls}>
            <button onClick={() => {setTransparentImage(null); setOriginalImage(null);}} className={styles.resetBtn}>Загрузить другое фото</button>
          </div>
        </div>
      )}
    </div>
  );
}
