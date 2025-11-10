'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import { detectMossTypeFromName, fallbackMossType } from '@/lib/moss-detect';

const NUS_LOCATIONS = [
  'UTown',
  'YIH (Yusof Ishak House)',
  'Central Library',
  'Kent Ridge',
  'Faculty of Science',
  'Faculty of Engineering',
  'University Hall',
];

const STICKERS = [
  '🌿', '🍄', '🪨', '💧', '🌧', '☀️', '🌱', // Original set
  '🌳', '🌲', '🌴', '🌵', // Trees
  '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', // Flowers
  '🍃', '🍂', '🍁', // Leaves
  '🦋', '🐛', '🐝', '🐞', '🐢', '🐸', // Small creatures
  '⛈️', '🌈', '🌙', '⭐', '✨', // Weather & sky
  '🌊', '💦', '🌾', '🌰', // More nature elements
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGE_DIMENSIONS = { maxWidth: 1920, maxHeight: 1080 };
const COMPRESSION_QUALITY = 0.8;

export default function PostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [detectedMossType, setDetectedMossType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to save moss to localStorage
  const saveMossToLocalStorage = (moss: {
    id: string;
    source: string;
    imageUrl: string;
    mossType: string;
    has3D: boolean;
    createdAt: string;
  }) => {
    if (typeof window === "undefined") return;
    const existing = JSON.parse(localStorage.getItem("mossUploads") || "[]");
    existing.push(moss);
    localStorage.setItem("mossUploads", JSON.stringify(existing));
  };

  const validateImage = (file: File): string | null => {
    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, or WebP image';
    }

    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      return `Image size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    return null;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setErrors({});
    setSubmitError('');

    // Validate image
    const validationError = validateImage(file);
    if (validationError) {
      setErrors({ image: validationError });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsCompressing(true);
    try {
      // Compress image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: MAX_IMAGE_SIZE / 1024 / 1024,
        maxWidthOrHeight: Math.max(MAX_IMAGE_DIMENSIONS.maxWidth, MAX_IMAGE_DIMENSIONS.maxHeight),
        useWebWorker: true,
        fileType: file.type,
      });

      setImageFile(compressedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setImagePreview(previewUrl);
        // Detect moss type from filename
        const detected = detectMossTypeFromName(file.name) || fallbackMossType();
        setDetectedMossType(detected);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      setErrors({ image: 'Failed to process image. Please try again.' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsCompressing(false);
    }
  };

  const toggleSticker = (sticker: string) => {
    setSelectedStickers(prev =>
      prev.includes(sticker)
        ? prev.filter(s => s !== sticker)
        : [...prev, sticker]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Moss name is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Moss name must be at least 3 characters';
    }

    if (!locationName) {
      newErrors.locationName = 'Please select a location';
    }

    if (!imageFile) {
      newErrors.image = 'Please upload an image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    if (!imageFile) return;

    setIsSubmitting(true);

    try {
      // Convert image to base64 for storage (in production, upload to cloud storage)
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });

      const response = await fetch('/api/moss-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: 'default-user', // In production, get from auth
          title: title.trim(),
          imageUrl: imageBase64,
          locationName,
          stickers: selectedStickers,
          energyReward: 1,
        }),
      });

      // Parse response to check for errors
      const responseData = await response.json().catch(() => ({ error: 'Failed to parse response' }));

      if (!response.ok) {
        // If API call failed, throw error and DO NOT save to localStorage
        throw new Error(responseData.error || `Server error: ${response.status}`);
      }

      // Only save to localStorage if API call succeeded
      const mossRecord = {
        id: crypto.randomUUID(),
        source: "post",
        imageUrl: imageBase64,
        mossType: detectedMossType || fallbackMossType(),
        has3D: true,
        createdAt: new Date().toISOString()
      };
      saveMossToLocalStorage(mossRecord);

      // Success - redirect to gallery
      router.push('/gallery');
    } catch (error) {
      console.error('Error submitting post:', error);
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-moss-green mb-6 md:mb-8">Post My Moss</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{submitError}</p>
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
              errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}>
              {isCompressing ? (
                <div className="py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-moss-green mb-2"></div>
                  <p className="text-gray-600 text-sm">Compressing image...</p>
                </div>
              ) : imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                      setDetectedMossType('');
                      setErrors({ ...errors, image: '' });
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                  {imageFile && (
                    <p className="text-xs text-gray-500 mt-2">
                      Size: {(imageFile.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-500 mb-3">JPG, PNG, or WebP (max 5MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                    capture="environment"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block bg-moss-green text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-moss-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] flex items-center justify-center"
                  >
                    Choose Image
                  </label>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moss Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors({ ...errors, title: '' });
                }
              }}
              placeholder="e.g., Tiny Guardian at YIH Wall"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-moss-green focus:border-transparent ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              value={locationName}
              onChange={(e) => {
                setLocationName(e.target.value);
                if (errors.locationName) {
                  setErrors({ ...errors, locationName: '' });
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-moss-green focus:border-transparent ${
                errors.locationName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select a location</option>
              {NUS_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {errors.locationName && (
              <p className="mt-1 text-sm text-red-600">{errors.locationName}</p>
            )}
          </div>

          {/* Moss Detection Result */}
          {detectedMossType && imagePreview && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-3">
                AI suggestion: {detectedMossType} 🌿
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/encyclopedia#${detectedMossType.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm bg-moss-green text-white px-4 py-2 rounded-lg hover:bg-moss-dark transition-colors"
                >
                  📚 View Moss Encyclopedia
                </a>
                <div className="text-sm text-gray-600 flex items-center">
                  ✓ 3D preview will be saved to My Garden
                </div>
              </div>
            </div>
          )}

          {/* Stickers */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add your mood
            </label>
            <div className="flex flex-wrap gap-3">
              {STICKERS.map(sticker => (
                <button
                  key={sticker}
                  type="button"
                  onClick={() => toggleSticker(sticker)}
                  data-active={selectedStickers.includes(sticker)}
                  className="flex items-center justify-center w-16 h-16 rounded-xl border border-gray-200 hover:border-green-500 cursor-pointer data-[active=true]:border-green-600 data-[active=true]:bg-green-50 transition-all text-4xl"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || isCompressing}
            className="w-full bg-moss-green text-white py-4 md:py-3 rounded-lg font-semibold hover:bg-moss-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              'Submit Discovery 🌿'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

