import { NextRequest, NextResponse } from 'next/server';
import { getMossPostById, deleteMossPost } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = getMossPostById(id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteMossPost(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Post not found or failed to delete' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

