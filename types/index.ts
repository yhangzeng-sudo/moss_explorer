export interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  energy: number;
  unlockedBiomes: string[];
  claimedPoints: string[]; // IDs of claimed moss points
  createdAt: Date;
}

export interface MossPost {
  id: string;
  authorId: string;
  title: string;
  imageUrl: string;
  locationName: string;
  lat?: number;
  lng?: number;
  stickers: string[];
  energyReward: number;
  createdAt: Date;
}

export interface MossPoint {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  energyCore: number;
  icon?: string;
}

export interface Biome {
  id: string;
  name: string;
  requiredEnergy: number;
  description: string;
  thumbnailUrl?: string;
}

