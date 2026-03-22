import DarkPremium from './DarkPremium';
import CleanMinimal from './CleanMinimal';
import GradientModern from './GradientModern';
import { TemplateInfo, CardData, CardFormat } from './types';

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'dark-premium',
    name: 'Тёмная премиум',
    description: 'Техника, гаджеты, электроника',
    category: 'tech',
    previewColor: '#1a1a2e',
  },
  {
    id: 'clean-minimal',
    name: 'Чистый минимализм',
    description: 'Бытовые товары, посуда, одежда',
    category: 'minimal',
    previewColor: '#f5f5f7',
  },
  {
    id: 'gradient-modern',
    name: 'Градиентный',
    description: 'Модные аксессуары, косметика',
    category: 'modern',
    previewColor: '#667eea',
  },
];

export function getTemplateComponent(templateId: string) {
  switch (templateId) {
    case 'dark-premium': return DarkPremium;
    case 'clean-minimal': return CleanMinimal;
    case 'gradient-modern': return GradientModern;
    default: return DarkPremium;
  }
}

export { DarkPremium, CleanMinimal, GradientModern };
export { CARD_FORMATS } from './types';
export type { TemplateInfo, CardData, CardFormat };
