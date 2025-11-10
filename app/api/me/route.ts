import { NextRequest, NextResponse } from 'next/server';
import { getUserById, createUser, updateUser } from '@/lib/db';
import { getMossPosts } from '@/lib/db';
import { getUnlockedBiomes } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';
    
    let user = getUserById(userId);
    
    if (!user) {
      user = createUser('Anonymous Explorer');
    }
    
    const posts = getMossPosts().filter(p => p.authorId === userId);
    const unlockedBiomes = getUnlockedBiomes(user.energy);
    
    return NextResponse.json({
      ...user,
      posts,
      unlockedBiomes,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, displayName } = body;
    
    if (!userId || !displayName) {
      return NextResponse.json(
        { error: 'Missing userId or displayName' },
        { status: 400 }
      );
    }
    
    let user = getUserById(userId);
    if (!user) {
      user = createUser(displayName);
    } else {
      user = updateUser(userId, { displayName }) || user;
    }
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

