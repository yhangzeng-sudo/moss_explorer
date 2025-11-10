import { NextResponse } from 'next/server';
import { getBiomes } from '@/lib/db';

export async function GET() {
  try {
    const biomes = getBiomes();
    return NextResponse.json(biomes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch biomes' }, { status: 500 });
  }
}

