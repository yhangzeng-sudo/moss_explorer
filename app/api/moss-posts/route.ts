import { NextRequest, NextResponse } from 'next/server';
import { getMossPosts, createMossPost } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const sticker = searchParams.get('sticker');
    
    let posts = getMossPosts();
    
    if (location) {
      posts = posts.filter(p => p.locationName.toLowerCase().includes(location.toLowerCase()));
    }
    
    if (sticker) {
      posts = posts.filter(p => p.stickers.includes(sticker));
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorId, title, imageUrl, locationName, lat, lng, stickers, energyReward } = body;
    
    if (!authorId || !title || !imageUrl || !locationName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    try {
      const post = createMossPost({
        authorId,
        title,
        imageUrl,
        locationName,
        lat,
        lng,
        stickers: stickers || [],
        energyReward: energyReward || 1,
      });
      
      return NextResponse.json(post, { status: 201 });
    } catch (dbError: any) {
      // If it's a quota error, return it with proper status
      if (dbError?.message?.includes('quota')) {
        return NextResponse.json(
          { error: dbError.message },
          { status: 507 } // 507 Insufficient Storage
        );
      }
      // Re-throw other errors to be caught by outer catch
      throw dbError;
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to create post';
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage.includes('quota') ? 507 : 500 }
    );
  }
}

