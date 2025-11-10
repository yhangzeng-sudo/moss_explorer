import { NextResponse } from 'next/server';
import { getMossPoints } from '@/lib/db';

export async function GET() {
  try {
    const points = getMossPoints();
    return NextResponse.json(points);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch moss points' }, { status: 500 });
  }
}

