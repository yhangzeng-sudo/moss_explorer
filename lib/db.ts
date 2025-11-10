import { User, MossPost, MossPoint, Biome } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const POINTS_FILE = path.join(DATA_DIR, 'points.json');
const BIOMES_FILE = path.join(DATA_DIR, 'biomes.json');

// Initialize files if they don't exist
function initFile(filePath: string, defaultValue: any[]) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

// Users
export function getUsers(): User[] {
  initFile(USERS_FILE, []);
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data).map((u: any) => ({
    ...u,
    createdAt: new Date(u.createdAt),
  }));
}

export function getUserById(id: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.id === id);
  return user ? { ...user, createdAt: new Date(user.createdAt) } : null;
}

export function createUser(displayName: string, avatarUrl?: string): User {
  const users = getUsers();
  const newUser: User = {
    id: uuidv4(),
    displayName,
    avatarUrl,
    energy: 0,
    unlockedBiomes: [],
    claimedPoints: [],
    createdAt: new Date(),
  };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return newUser;
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return users[index];
}

// Moss Posts
export function getMossPosts(): MossPost[] {
  initFile(POSTS_FILE, []);
  const data = fs.readFileSync(POSTS_FILE, 'utf-8');
  return JSON.parse(data).map((p: any) => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));
}

export function getMossPostById(id: string): MossPost | null {
  const posts = getMossPosts();
  const post = posts.find(p => p.id === id);
  return post ? { ...post, createdAt: new Date(post.createdAt) } : null;
}

export function createMossPost(post: Omit<MossPost, 'id' | 'createdAt'>): MossPost {
  const posts = getMossPosts();
  const newPost: MossPost = {
    ...post,
    id: uuidv4(),
    createdAt: new Date(),
  };
  posts.push(newPost);
  
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (error: any) {
    // If write fails, remove the post from array and throw error
    posts.pop();
    const errorMessage = error?.message || 'Failed to save post';
    if (errorMessage.includes('quota') || errorMessage.includes('space') || errorMessage.includes('ENOSPC')) {
      throw new Error('The quota has been exceeded. Please try with a smaller image or contact support.');
    }
    throw new Error(errorMessage);
  }
  
  // Update user energy
  const user = getUserById(post.authorId);
  if (user) {
    updateUser(post.authorId, {
      energy: user.energy + post.energyReward,
    });
  }
  
  return newPost;
}

export function deleteMossPost(id: string): boolean {
  const posts = getMossPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  posts.splice(index, 1);
  
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    return true;
  } catch (error: any) {
    console.error('Failed to delete post:', error);
    return false;
  }
}

// Moss Points
export function getMossPoints(): MossPoint[] {
  initFile(POINTS_FILE, [
    {
      id: '1',
      name: 'YIH Entrance Wall',
      description: 'A shaded wall near YIH entrance with diverse moss growth',
      lat: 1.2966,
      lng: 103.7764,
      energyCore: 2,
      icon: '🌿',
    },
    {
      id: '2',
      name: 'UTown Green Drainage',
      description: 'Moss along drainage lines in UTown',
      lat: 1.3047,
      lng: 103.7734,
      energyCore: 2,
      icon: '💧',
    },
    {
      id: '3',
      name: 'Central Library Steps',
      description: 'Moss patches on stone steps',
      lat: 1.2963,
      lng: 103.7727,
      energyCore: 2,
      icon: '🪨',
    },
  ]);
  const data = fs.readFileSync(POINTS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Biomes
export function getBiomes(): Biome[] {
  initFile(BIOMES_FILE, [
    {
      id: 'shaded-wall',
      name: 'Shaded Wall Biome',
      requiredEnergy: 5,
      description: 'Unlock the secrets of moss growing in shaded areas',
      thumbnailUrl: '/biomes/shaded-wall.jpg',
    },
    {
      id: 'drainage-line',
      name: 'Drainage Line Biome',
      requiredEnergy: 10,
      description: 'Explore moss thriving along water drainage systems',
      thumbnailUrl: '/biomes/drainage-line.jpg',
    },
    {
      id: 'stone-surface',
      name: 'Stone Surface Biome',
      requiredEnergy: 15,
      description: 'Discover moss colonies on stone and concrete',
      thumbnailUrl: '/biomes/stone-surface.jpg',
    },
  ]);
  const data = fs.readFileSync(BIOMES_FILE, 'utf-8');
  return JSON.parse(data);
}

export function getUnlockedBiomes(userEnergy: number): Biome[] {
  const biomes = getBiomes();
  return biomes.filter(b => userEnergy >= b.requiredEnergy);
}

export function getGrowthStage(energy: number): string {
  if (energy >= 15) return 'Moss Forest';
  if (energy >= 10) return 'Wall Patch';
  if (energy >= 5) return 'Sprouting Moss';
  return 'Seed';
}

