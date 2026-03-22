// Types for infographic card templates

export interface CardCallout {
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
  icon?: string; // emoji or icon name
}

export interface CardData {
  title: string;
  subtitle?: string;
  callouts: CardCallout[];
  badges?: string[];
  productImageUrl: string;
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string; // "tech", "minimal", "modern", "warm", "bold"
  previewColor: string; // for thumbnail display
}

export type CardFormat = '3:4' | '1:1' | '16:9';

export const CARD_FORMATS: Record<CardFormat, { width: number; height: number; label: string }> = {
  '3:4': { width: 900, height: 1200, label: 'WB (3:4)' },
  '1:1': { width: 1000, height: 1000, label: 'Ozon (1:1)' },
  '16:9': { width: 1600, height: 900, label: 'Баннер (16:9)' },
};
