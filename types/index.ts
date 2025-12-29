import { StatsData } from '@/lib/types';

export interface Wizard {
  [tokenId: string]: {
    name: string;
    head?: string;
    body?: string;
    prop?: string;
    familiar?: string;
    rune?: string;
    background?: string;
  };
}

export interface TraitOption {
  type: string;
  name: string;
}

export interface Selection {
  head: TraitOption[];
  body: TraitOption[];
  prop: TraitOption[];
  familiar: TraitOption[];
  rune: TraitOption[];
  background: TraitOption[];
}

export interface BurnData extends Omit<StatsData, 'souls'> {
  order: string[];
  souls: {
    [tokenId: string]: {
      name: string;
    };
  };
}

export interface LeaderboardData {
  leaderboard: LeaderboardRow[];
  lastUpdated?: number;
}

export interface LeaderboardRow {
  address: string;
  burnCount: number;
  latestBurn: {
    timestamp: number;
    txHash: string;
  };
}

export interface ShameData {
  owners: OwnerData[];
  lastUpdated?: number;
}

export interface OwnerData {
  owner: string;
  tokens: TokenData[];
  flameCount: number;
}

export interface TokenData {
  owner?: string;
  contract: string;
  tokenId: string;
  name: string;
  image: string;
}

