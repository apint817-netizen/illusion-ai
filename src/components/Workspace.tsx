'use client';

import React from 'react';
import ImageUploader from './ImageUploader';
import styles from './Workspace.module.css';

interface Props {
  originalImage: string | null;
  transparentImage: string | null;
  backgroundImage: string | null;
  isUploading: boolean;
  isGenerating: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onReset: () => void;
}

export default function Workspace({
  originalImage,
  transparentImage,
  backgroundImage,
  isUploading,
  isGenerating,
  error,
  onUpload,
  onReset
}: Props) {

  return (
    <div className={styles.workspace}>
      {!originalImage && <ImageUploader onUpload={onUpload} />}
      
      {isUploading && (
         <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Магия AI... Идеально вырезаем фон 🪄</p>
         </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <p>⚠️ {error}</p>
          <button onClick={onReset} className={styles.retryBtn}>Попробовать снова</button>
        </div>
      )}

      {transparentImage && !isUploading && (
        <div className={styles.canvasArea}>
          <div className={styles.checkeredBg} style={{ 
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: backgroundImage ? 'none' : undefined,
              position: 'relative',
              overflow: 'hidden'
            }}>
            
            {isGenerating && (
              <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10}}>
                <div className={styles.spinner} style={{width: 32, height: 32, borderWidth: 3}}></div>
              </div>
            )}

            <img 
              src={transparentImage} 
              alt="Вырезанный товар" 
              className={styles.productImg} 
              style={{ position: 'relative', zIndex: 5 }}
            />
          </div>
          <div className={styles.controls}>
            <button onClick={onReset} className={styles.resetBtn}>Начать заново</button>
          </div>
        </div>
      )}
    </div>
  );
}

