'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MossPost } from '@/types';
import { detectMossTypeFromName, fallbackMossType } from '@/lib/moss-detect';
import MossPreview3D from '@/components/MossPreview3D';

export default function GalleryPage() {
  const [posts, setPosts] = useState<MossPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState('');
  const [stickerFilter, setStickerFilter] = useState('');
  const [snapshotStates, setSnapshotStates] = useState<{ [postId: string]: { detectedType: string; showPreview: boolean } }>({});

  useEffect(() => {
    fetchPosts();
  }, [locationFilter, stickerFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (locationFilter) params.append('location', locationFilter);
      if (stickerFilter) params.append('sticker', stickerFilter);
      
      const res = await fetch(`/api/moss-posts?${params.toString()}`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const locations = ['UTown', 'YIH', 'Kent Ridge', 'Central Library'];
  const stickers = [
    '🌿', '🍄', '🪨', '💧', '🌧', '☀️', '🌱', // Original set
    '🌳', '🌲', '🌴', '🌵', // Trees
    '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', // Flowers
    '🍃', '🍂', '🍁', // Leaves
    '🦋', '🐛', '🐝', '🐞', '🐢', '🐸', // Small creatures
    '⛈️', '🌈', '🌙', '⭐', '✨', // Weather & sky
    '🌊', '💦', '🌾', '🌰', // More nature elements
  ];

  const handleSnapshot = (post: MossPost) => {
    // Detect moss type from post title
    const detectedType = detectMossTypeFromName(post.title) || fallbackMossType();
    setSnapshotStates(prev => ({
      ...prev,
      [post.id]: { detectedType, showPreview: true }
    }));
  };

  const handleSaveToGarden = (post: MossPost) => {
    const state = snapshotStates[post.id];
    if (!state) return;

    // Save to localStorage
    if (typeof window === "undefined") return;
    const mossRecord = {
      id: crypto.randomUUID(),
      source: "snapshot",
      imageUrl: post.imageUrl,
      mossType: state.detectedType,
      has3D: true,
      createdAt: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem("mossUploads") || "[]");
    existing.push(mossRecord);
    localStorage.setItem("mossUploads", JSON.stringify(existing));

    // Hide preview after saving
    setSnapshotStates(prev => ({
      ...prev,
      [post.id]: { ...state, showPreview: false }
    }));

    // Show success message (optional)
    alert(`Saved ${state.detectedType} to My Garden! 🌿`);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const res = await fetch(`/api/moss-posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove from local state
        setPosts(prev => prev.filter(p => p.id !== postId));
        // Clear snapshot state if it exists
        setSnapshotStates(prev => {
          const newState = { ...prev };
          delete newState[postId];
          return newState;
        });
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-moss-green mb-4">Moss Gallery</h1>
          <p className="text-gray-700">Discover moss treasures shared by explorers</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Sticker
            </label>
            <select
              value={stickerFilter}
              onChange={(e) => setStickerFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Stickers</option>
              {stickers.map(sticker => (
                <option key={sticker} value={sticker}>{sticker}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading moss discoveries...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No moss posts found yet.</p>
            <Link
              href="/post"
              className="inline-block bg-moss-green text-white px-6 py-3 rounded-lg hover:bg-moss-dark transition-colors"
            >
              Be the first to post! 🌿
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Moss+Discovery';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                      title="Delete post"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">📍 {post.locationName}</p>
                  <div className="flex gap-2 mb-2">
                    {post.stickers.map((sticker, idx) => (
                      <span key={idx} className="text-2xl">{sticker}</span>
                    ))}
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => handleSnapshot(post)}
                      className="w-full bg-moss-green text-white px-4 py-2 rounded-lg hover:bg-moss-dark transition-colors text-sm font-medium"
                    >
                      Digitize Moss 💡
                    </button>
                  </div>
                  
                  {/* Snapshot Preview Section */}
                  {snapshotStates[post.id]?.showPreview && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-2">
                        AI suggestion: {snapshotStates[post.id].detectedType} 🌿
                      </p>
                      <div className="mb-3">
                        <MossPreview3D imageUrl={post.imageUrl} height="h-56" mossType={snapshotStates[post.id].detectedType} />
                      </div>
                      <button
                        onClick={() => handleSaveToGarden(post)}
                        className="w-full bg-moss-green text-white px-4 py-2 rounded-lg hover:bg-moss-dark transition-colors text-sm font-medium"
                      >
                        Save to My Garden 🌱
                      </button>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

