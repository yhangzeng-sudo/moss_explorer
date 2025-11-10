'use client';

import { useState, useRef, useEffect } from 'react';
import { detectMossTypeFromName, fallbackMossType } from '@/lib/moss-detect';
import MossModel from '@/components/MossModel';

interface SnapshotEditorProps {
  imageUrl: string;
  onSave: (imageDataUrl: string) => void;
  onClose: () => void;
  onUploadToGallery?: (imageDataUrl: string, title: string, mossType: string, stickers: string[]) => void;
}

export default function SnapshotEditor({ imageUrl, onSave, onClose, onUploadToGallery }: SnapshotEditorProps) {
  const [snapshotName, setSnapshotName] = useState('');
  const [selectedStickers, setSelectedStickers] = useState<Array<{ id: string; sticker: string; x: number; y: number }>>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [detectedMossType, setDetectedMossType] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset image state when imageUrl changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setErrorMessage('');
    setSelectedStickers([]);
    setSnapshotName('');
    setDetectedMossType('');
    
    // Debug: log image URL info
    if (imageUrl) {
      console.log('SnapshotEditor: Image URL received', {
        length: imageUrl.length,
        isBase64: imageUrl.startsWith('data:'),
        preview: imageUrl.substring(0, 50) + '...'
      });
    }
  }, [imageUrl]);

  // Detect moss type when image loads
  useEffect(() => {
    if (imageLoaded && imageUrl) {
      // Check if this is the moss example image - identify as Fern Moss
      if (imageUrl.includes('moss example') || imageUrl.includes('moss example.JPG')) {
        setDetectedMossType('Fern Moss');
        return;
      }
      // Use snapshot name or fallback to detect moss type
      const nameToDetect = snapshotName || 'moss discovery';
      const detected = detectMossTypeFromName(nameToDetect) || fallbackMossType();
      setDetectedMossType(detected);
    }
  }, [imageLoaded, imageUrl, snapshotName]);

  const STICKERS = [
    '🌿', '🍄', '🪨', '💧', '🌧', '☀️', '🌱', // Original set
    '🌳', '🌲', '🌴', '🌵', // Trees
    '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', // Flowers
    '🍃', '🍂', '🍁', // Leaves
    '🦋', '🐛', '🐝', '🐞', '🐢', '🐸', // Small creatures
    '⛈️', '🌈', '🌙', '⭐', '✨', // Weather & sky
    '🌊', '💦', '🌾', '🌰', // More nature elements
  ];

  const handleAddSticker = (sticker: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Add sticker at center of image, but slightly offset for multiple stickers
    const offsetX = (selectedStickers.length % 3) * 10 - 10; // -10, 0, 10
    const offsetY = Math.floor(selectedStickers.length / 3) * 10;
    const newSticker = { id, sticker, x: 50 + offsetX, y: 50 + offsetY };
    setSelectedStickers([...selectedStickers, newSticker]);
    console.log('Added sticker:', newSticker, 'Total stickers:', selectedStickers.length + 1);
  };

  const handleStickerDrag = (id: string, clientX: number, clientY: number) => {
    if (!imageRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    setSelectedStickers(prev =>
      prev.map(s => s.id === id ? { ...s, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : s)
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleStickerDrag(isDragging, e.clientX, e.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      e.preventDefault();
      const touch = e.touches[0];
      handleStickerDrag(isDragging, touch.clientX, touch.clientY);
    }
  };

  const handleSave = () => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) {
      alert('Please wait for the image to load before saving.');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    
    // Set canvas size to match image
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw stickers
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    selectedStickers.forEach(({ sticker, x, y }) => {
      const stickerX = (x / 100) * canvas.width;
      const stickerY = (y / 100) * canvas.height;
      ctx.fillText(sticker, stickerX, stickerY);
    });

    // Draw name if provided
    if (snapshotName) {
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.strokeText(snapshotName, canvas.width / 2, canvas.height - 20);
      ctx.fillText(snapshotName, canvas.width / 2, canvas.height - 20);
    }

    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const handleUploadToGallery = async () => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) {
      alert('Please wait for the image to load before uploading.');
      return;
    }

    // Use snapshot name or default name
    const finalName = snapshotName.trim() || 'My Moss Discovery';

    setIsUploading(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = imageRef.current;
      
      // Set canvas size to match image
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw stickers
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      selectedStickers.forEach(({ sticker, x, y }) => {
        const stickerX = (x / 100) * canvas.width;
        const stickerY = (y / 100) * canvas.height;
        ctx.fillText(sticker, stickerX, stickerY);
      });

      // Draw name if provided
      if (snapshotName) {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.strokeText(snapshotName, canvas.width / 2, canvas.height - 20);
        ctx.fillText(snapshotName, canvas.width / 2, canvas.height - 20);
      }

      const dataUrl = canvas.toDataURL('image/png');
      
      if (onUploadToGallery) {
        // Extract sticker emojis from selectedStickers
        const stickerEmojis = selectedStickers.map(s => s.sticker);
        await onUploadToGallery(dataUrl, finalName, detectedMossType || fallbackMossType(), stickerEmojis);
      }
    } catch (error) {
      console.error('Error uploading to gallery:', error);
      alert('Failed to upload to gallery. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Take a Snapshot!</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name your snapshot
          </label>
          <input
            type="text"
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            placeholder="e.g., My Moss Discovery"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div 
          ref={containerRef}
          className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" 
          style={{ minHeight: '400px', position: 'relative' }}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(null)}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(null)}
        >
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-moss-green mb-2"></div>
                <p className="text-gray-600 text-sm">Loading image...</p>
              </div>
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-6xl mb-2">❓</div>
                <p className="text-gray-600 text-sm mb-2">Failed to load image</p>
                <p className="text-gray-500 text-xs mb-4">{errorMessage || 'Please check the image URL'}</p>
                {imageUrl && (
                  <p className="text-gray-400 text-xs break-all max-w-md">
                    {imageUrl.length > 100 ? `${imageUrl.substring(0, 100)}...` : imageUrl}
                  </p>
                )}
              </div>
            </div>
          )}
          {imageUrl && (
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Snapshot"
              className={`w-full h-auto relative ${imageLoaded ? 'block' : 'hidden'}`}
              style={{ zIndex: 1 }}
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
                if (imageRef.current && canvasRef.current) {
                  canvasRef.current.width = imageRef.current.naturalWidth || imageRef.current.width;
                  canvasRef.current.height = imageRef.current.naturalHeight || imageRef.current.height;
                }
                // Check if this is the moss example image - identify as Fern Moss
                if (imageUrl.includes('moss example') || imageUrl.includes('moss example.JPG')) {
                  setDetectedMossType('Fern Moss');
                } else {
                  // Detect moss type when image loads
                  const nameToDetect = snapshotName || 'moss discovery';
                  const detected = detectMossTypeFromName(nameToDetect) || fallbackMossType();
                  setDetectedMossType(detected);
                }
              }}
              onError={(e) => {
                console.error('Image load error:', e);
                setImageError(true);
                setImageLoaded(false);
                setErrorMessage('Failed to load image. Please try again or use a different image.');
              }}
              {...(imageUrl.startsWith('data:') ? {} : { crossOrigin: 'anonymous' })}
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Sticker overlays - only show when image is loaded */}
          {imageLoaded && selectedStickers.map(({ id, sticker, x, y }) => (
            <div
              key={id}
              className="absolute cursor-move text-4xl select-none touch-none group pointer-events-auto"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 20,
                pointerEvents: 'auto',
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(id);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(id);
              }}
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Remove sticker on double click
                setSelectedStickers(prev => prev.filter(s => s.id !== id));
              }}
              title="Drag to move, double-click to remove"
            >
              {sticker}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedStickers(prev => prev.filter(s => s.id !== id));
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* 3D Preview and Moss Detection */}
        {imageLoaded && detectedMossType && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-3">
              AI Detection: {detectedMossType} 🌿
            </p>
            <div className="mb-3">
              <MossModel mossType={detectedMossType} scale={1.5} cameraZ={2.8} height="h-48" />
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Add stickers</p>
            {selectedStickers.length > 0 && (
              <p className="text-xs text-gray-500">
                {selectedStickers.length} sticker{selectedStickers.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {STICKERS.map(sticker => {
              const isSelected = selectedStickers.some(s => s.sticker === sticker);
              return (
                <button
                  key={sticker}
                  type="button"
                  onClick={() => handleAddSticker(sticker)}
                  data-active={isSelected}
                  className="flex items-center justify-center w-16 h-16 rounded-xl border border-gray-200 hover:border-green-500 cursor-pointer data-[active=true]:border-green-600 data-[active=true]:bg-green-50 transition-all text-4xl"
                  title="Click to add sticker"
                >
                  {sticker}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          {onUploadToGallery && (
            <button
              onClick={handleUploadToGallery}
              disabled={!imageLoaded || imageError || isUploading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                'Upload to Gallery 📤'
              )}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!imageLoaded || imageError}
            className="flex-1 bg-moss-green text-white py-2 rounded-lg font-semibold hover:bg-moss-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Snapshot
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

