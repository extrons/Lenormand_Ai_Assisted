export interface Card {
  number: number;
  name: string;
  image: string;
  meaning: string;
}

// 保留原始数据作为后备（当 localStorage 无数据时使用）
export const allCards: Card[] = [
];

// 新增：动态获取卡牌数据（优先使用可编辑版本）
import { getCardsForDisplay } from './card-meanings-editable'

// 导出动态获取的卡牌（用于组件）
export function getAllCards(): Card[] {
  return getCardsForDisplay()
}
