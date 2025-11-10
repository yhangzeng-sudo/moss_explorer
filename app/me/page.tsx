'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MossRecord {
  id: string;
  source?: string;
  imageUrl: string;
  mossType: string;
  has3D: boolean;
  createdAt: string;
}

export default function MePage() {
  const [mosses, setMosses] = useState<MossRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = JSON.parse(localStorage.getItem("mossUploads") || "[]");
    setMosses(stored);
  }, []);

  const updateMossInLocalStorage = (id: string, updates: Partial<MossRecord>) => {
    if (typeof window === "undefined") return;
    const stored = JSON.parse(localStorage.getItem("mossUploads") || "[]");
    const updated = stored.map((m: MossRecord) => 
      m.id === id ? { ...m, ...updates } : m
    );
    localStorage.setItem("mossUploads", JSON.stringify(updated));
    setMosses(updated);
  };

  const handleStartEdit = (moss: MossRecord) => {
    setEditingId(moss.id);
    setEditValue(moss.mossType);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      updateMossInLocalStorage(id, { mossType: editValue.trim() });
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDeleteMoss = (id: string) => {
    if (!confirm('Are you sure you want to remove this moss from your garden?')) {
      return;
    }

    if (typeof window === "undefined") return;
    const stored = JSON.parse(localStorage.getItem("mossUploads") || "[]");
    const updated = stored.filter((m: MossRecord) => m.id !== id);
    localStorage.setItem("mossUploads", JSON.stringify(updated));
    setMosses(updated);
  };

  const mossesWith3D = mosses.filter(m => m.has3D === true);

  const handleAddTestFernMoss = () => {
    if (typeof window === "undefined") return;
    const testMoss: MossRecord = {
      id: crypto.randomUUID(),
      source: "test",
      imageUrl: "/moss example.JPG",
      mossType: "Fern Moss",
      has3D: true,
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem("mossUploads") || "[]");
    existing.push(testMoss);
    localStorage.setItem("mossUploads", JSON.stringify(existing));
    setMosses(existing);
  };

  return (
    <main className="min-h-screen bg-[#f3f9f4] p-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-green-900 mb-2">My Digital Moss Garden</h1>
            <p className="text-sm text-gray-600">
              These are the mosses you uploaded and turned into 3D memories.
            </p>
          </div>
          {mossesWith3D.length === 0 && (
            <button
              onClick={handleAddTestFernMoss}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Add Test Fern Moss
            </button>
          )}
        </div>

        {mossesWith3D.length === 0 ? (
          <div className="bg-green-50 rounded-2xl p-4 min-h-[360px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-2">No 3D moss models yet.</p>
              <p className="text-sm text-gray-500 mb-4">
                Upload a moss and enable 3D model generation to see it here!
              </p>
              <button
                onClick={handleAddTestFernMoss}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Or Add Test Fern Moss
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 bg-green-50 rounded-2xl p-4 min-h-[360px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mossesWith3D.map((moss) => (
                <div key={moss.id} className="bg-white rounded-lg p-2 shadow-sm relative group hover:shadow-md transition-shadow">
                  <button
                    onClick={() => handleDeleteMoss(moss.id)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-sm leading-none z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete moss entry"
                    title="Delete moss entry"
                  >
                    ×
                  </button>
                  <div className="aspect-square mb-2 bg-[#e8f5ea] rounded-lg overflow-hidden relative">
                    <Image
                      src={moss.imageUrl}
                      alt={moss.mossType}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                  {editingId === moss.id ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(moss.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="w-full text-xs font-medium text-green-900 border border-green-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSaveEdit(moss.id)}
                          className="text-green-600 hover:text-green-800 text-xs"
                          title="Save"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p 
                        className="text-xs font-medium text-green-900 truncate cursor-pointer"
                        onClick={() => handleStartEdit(moss)}
                        title="Click to edit"
                      >
                        {moss.mossType}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(moss.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

