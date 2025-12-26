export interface Message {
  user: string;
  text: string;
  time: string;
}

export interface DailyReport {
  count: number;
  bonus: number;
}

export interface UserProfile {
  username: string;
  nickname: string;
  avatarId: string;
  customAvatarUrl?: string;
  lastReportDate?: string;
  lastPenaltyCheck?: string;
  history?: Record<string, DailyReport>;
  inbox?: string[]; // New: Store notifications for the user
  
  inventory?: string[]; 
  equipped?: {
    border?: string; 
  };
}

export interface Database {
  scores: Record<string, number>;
  messages: Message[];
  users: Record<string, UserProfile>;
}

export interface UserSession {
  username: string;
  igProfile: string;
  realName: string;
  isOwner?: boolean; 
}

export enum Tab {
  DASHBOARD = 0,
  COMMUNITY = 1,
  WALLET = 2,
  RANKING = 3,
  STORE = 4,
}

export interface ShiftMap {
  [igProfile: string]: {
    [username: string]: string;
  };
}

export interface AvatarOption {
  id: string;
  icon: string;
  bg: string;
}

export enum RankTier {
  UNRANKED = 'Sem Rank',
  BRONZE = 'Bronze',
  SILVER = 'Prata',
  GOLD = 'Ouro',
  DIAMOND = 'Diamante'
}

export const RANK_ORDER = [RankTier.UNRANKED, RankTier.BRONZE, RankTier.SILVER, RankTier.GOLD, RankTier.DIAMOND];

// Store Definitions
export type ItemType = 'border';

export interface StoreItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  price: number;
  minRank: RankTier; 
  cssClass: string; 
}