'use client';

import { useEffect, useState } from 'react';
import { MossPost, MossPoint } from '@/types';

export default function MapPage() {
  const [posts, setPosts] = useState<MossPost[]>([]);
  const [points, setPoints] = useState<MossPoint[]>([]);
  const [selectedPost, setSelectedPost] = useState<MossPost | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MossPoint | null>(null);
  const [userClaimedPoints, setUserClaimedPoints] = useState<string[]>([]);
  const [userEnergy, setUserEnergy] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const userId = 'default-user'; // In production, get from auth

  useEffect(() => {
    fetchData();
    fetchUserProfile();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, pointsRes] = await Promise.all([
        fetch('/api/moss-posts'),
        fetch('/api/moss-points'),
      ]);
      const postsData = await postsRes.json();
      const pointsData = await pointsRes.json();
      setPosts(postsData);
      setPoints(pointsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/me?userId=${userId}`);
      const data = await res.json();
      setUserClaimedPoints(data.claimedPoints || []);
      setUserEnergy(data.energy || 0);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleClaimEnergy = async (pointId: string) => {
    setClaiming(true);
    setClaimMessage(null);
    
    try {
      const res = await fetch('/api/me/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pointId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setClaimMessage({
          type: 'success',
          text: `+${data.energyGained} energy! Total: ${data.energy}`,
        });
        setUserEnergy(data.energy);
        setUserClaimedPoints([...userClaimedPoints, pointId]);
        setTimeout(() => {
          setSelectedPoint(null);
          setClaimMessage(null);
        }, 2000);
      } else {
        setClaimMessage({
          type: 'error',
          text: data.error || 'Failed to claim energy',
        });
      }
    } catch (error) {
      setClaimMessage({
        type: 'error',
        text: 'Failed to claim energy. Please try again.',
      });
    } finally {
      setClaiming(false);
    }
  };

  // Mock NUS campus map coordinates
  const mapBounds = {
    minLat: 1.29,
    maxLat: 1.31,
    minLng: 103.77,
    maxLng: 103.78,
  };

  const normalizeCoords = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-moss-green mb-4">Moss Map</h1>
          <p className="text-gray-700">
            This map visualises moss sightings shared by students across NUS. 
            It complements the 360° tour by showing live discoveries instead of fixed reference points.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading map...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 mt-4">
            <div className="h-[340px] rounded-xl relative overflow-hidden">
              {/* NUS campus map background */}
              <img 
                src="/campus map.jpg" 
                alt="NUS Campus Map" 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 opacity-50';
                  (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
                }}
              />
            
              {/* Official moss points */}
              {points.map(point => {
                const coords = normalizeCoords(point.lat, point.lng);
                const isClaimed = userClaimedPoints.includes(point.id);
                return (
                  <div
                    key={point.id}
                    className="absolute cursor-pointer group touch-manipulation"
                    style={{
                      left: `${coords.x}%`,
                      top: `${coords.y}%`,
                      transform: 'translate(-50%, -50%)',
                      minWidth: '44px',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => setSelectedPoint(point)}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      setSelectedPoint(point);
                    }}
                    title={`${point.name}${isClaimed ? ' (Claimed)' : ''}`}
                  >
                    <div className={`text-3xl ${isClaimed ? 'opacity-50' : 'animate-pulse'}`}>
                      {point.icon || '⚡'}
                    </div>
                    {isClaimed && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                        ✓
                      </div>
                    )}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {point.name}
                    </div>
                  </div>
                );
              })}

              {/* User moss posts */}
              {posts
                .filter(post => post.lat && post.lng)
                .map(post => {
                  const coords = normalizeCoords(post.lat!, post.lng!);
                  return (
                    <div
                      key={post.id}
                      className="absolute cursor-pointer touch-manipulation"
                      style={{
                        left: `${coords.x}%`,
                        top: `${coords.y}%`,
                        transform: 'translate(-50%, -50%)',
                        minWidth: '44px',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => setSelectedPost(post)}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        setSelectedPost(post);
                      }}
                    >
                      <div className="text-2xl">🌿</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Moss Point detail drawer */}
        {selectedPoint && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedPoint(null);
                setClaimMessage(null);
              }
            }}
          >
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedPoint(null);
                  setClaimMessage(null);
                }}
                className="float-right text-gray-500 hover:text-gray-700 text-2xl leading-none p-2 -mt-2 -mr-2 touch-manipulation"
                aria-label="Close"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-2">{selectedPoint.name}</h2>
              {selectedPoint.description && (
                <p className="text-gray-600 mb-4">{selectedPoint.description}</p>
              )}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Location:</span> {selectedPoint.name}
                </p>
                <p className="text-xs text-gray-500">
                  This is an official moss point on campus.
                </p>
              </div>
              
              {userClaimedPoints.includes(selectedPoint.id) ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-700 font-semibold">✓ Visited</p>
                  <p className="text-sm text-green-600 mt-1">You've visited this moss point</p>
                </div>
              ) : (
                <div>
                  {claimMessage && (
                    <div
                      className={`mb-4 p-3 rounded-lg ${
                        claimMessage.type === 'success'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {claimMessage.text}
                    </div>
                  )}
                  <button
                    onClick={() => handleClaimEnergy(selectedPoint.id)}
                    disabled={claiming}
                    className="w-full bg-moss-green text-white py-3 rounded-lg font-semibold hover:bg-moss-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px]"
                  >
                    {claiming ? 'Visiting...' : `Mark as Visited ✓`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Post detail drawer */}
        {selectedPost && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedPost(null);
              }
            }}
          >
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedPost(null)}
                className="float-right text-gray-500 hover:text-gray-700 text-2xl leading-none p-2 -mt-2 -mr-2 touch-manipulation"
                aria-label="Close"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Moss+Discovery';
                }}
              />
              <p className="text-gray-600 mb-2">📍 {selectedPost.locationName}</p>
              <div className="flex gap-2 mb-4">
                {selectedPost.stickers.map((sticker, idx) => (
                  <span key={idx} className="text-2xl">{sticker}</span>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Posted {new Date(selectedPost.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
