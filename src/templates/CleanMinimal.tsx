'use client';

import React from 'react';
import { CardData, CardFormat, CARD_FORMATS } from './types';
import styles from './CleanMinimal.module.css';

interface Props {
  data: CardData;
  format: CardFormat;
}

export default function CleanMinimal({ data, format }: Props) {
  const dims = CARD_FORMATS[format];

  return (
    <div className={styles.card} style={{ width: dims.width, height: dims.height }}>
      <div className={styles.bg} />

      {/* Title */}
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{data.title}</h1>
        {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
      </div>

      {/* Product */}
      <div className={styles.productWrap}>
        <img 
          src={data.productImageUrl} 
          alt="Product" 
          className={styles.productImg}
          crossOrigin="anonymous"
        />
      </div>

      {/* Callouts */}
      <div className={styles.calloutsContainer}>
        {data.callouts.map((callout, i) => (
          <div 
            key={i} 
            className={`${styles.callout} ${styles[`callout_${callout.position}`] || ''}`}
          >
            {callout.icon && <span className={styles.calloutIcon}>{callout.icon}</span>}
            <span className={styles.calloutText}>{callout.text}</span>
          </div>
        ))}
      </div>

      {/* Badges */}
      {data.badges && data.badges.length > 0 && (
        <div className={styles.badges}>
          {data.badges.map((badge, i) => (
            <span key={i} className={styles.badge}>{badge}</span>
          ))}
        </div>
      )}
    </div>
  );
}
