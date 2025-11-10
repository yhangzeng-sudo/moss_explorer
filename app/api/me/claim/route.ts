import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, getMossPoints } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, pointId } = body;
    
    if (!userId || !pointId) {
      return NextResponse.json(
        { error: 'Missing userId or pointId' },
        { status: 400 }
      );
    }
    
    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if already claimed
    if (user.claimedPoints.includes(pointId)) {
      return NextResponse.json(
        { error: 'Point already claimed', energy: user.energy },
        { status: 400 }
      );
    }
    
    // Get the moss point to determine energy reward
    const points = getMossPoints();
    const point = points.find(p => p.id === pointId);
    
    if (!point) {
      return NextResponse.json({ error: 'Moss point not found' }, { status: 404 });
    }
    
    // Update user with new energy and claimed point
    const updatedUser = updateUser(userId, {
      energy: user.energy + point.energyCore,
      claimedPoints: [...user.claimedPoints, pointId],
    });
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      energy: updatedUser.energy,
      energyGained: point.energyCore,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to claim energy' }, { status: 500 });
  }
}

