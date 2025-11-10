'use client';

import { useState, useRef } from 'react';
import SnapshotEditor from '@/components/SnapshotEditor';
import html2canvas from 'html2canvas';

export default function TourPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const iframeRef = useRef<HTMLDivElement>(null);
  
  // Replace this URL with your actual ThinkLink 360° tour URL
  const thinkLinkUrl = 'https://www.thinglink.com/card/2042549433521930917';

  const handleCaptureSnapshot = async () => {
    setIsCapturing(true);
    try {
      // Always use prototype image for now to avoid cross-origin issues
      // This ensures the feature works reliably on both localhost and Vercel
      const prototypeImage = '/moss example.JPG';
      setCapturedImage(prototypeImage);
      setShowEditor(true);
      setIsCapturing(false);
      return;

      // Note: The code below is commented out because html2canvas has issues with
      // cross-origin iframes on production. Uncomment if you have a solution for CORS.
      /*
      // Try to capture the iframe container if tour has started
      const container = iframeRef.current;
      
      if (!container || !hasStarted) {
        // If tour hasn't started or container doesn't exist, use a prototype image
        // This allows users to try the snapshot feature even before starting the tour
        const prototypeImage = '/moss example.JPG';
        setCapturedImage(prototypeImage);
        setShowEditor(true);
        setIsCapturing(false);
        return;
      }

      // Use html2canvas to capture the iframe container
      try {
        const canvas = await html2canvas(container, {
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          scale: 1,
          logging: false,
          timeout: 5000,
        });

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        setShowEditor(true);
      } catch (canvasError) {
        console.error('Error capturing with html2canvas:', canvasError);
        // Fallback to prototype image
        const prototypeImage = '/moss example.JPG';
        setCapturedImage(prototypeImage);
        setShowEditor(true);
      }
      */
    } catch (error) {
      console.error('Error in handleCaptureSnapshot:', error);
      // Fallback to prototype image if anything fails
      const prototypeImage = '/moss example.JPG';
      setCapturedImage(prototypeImage);
      setShowEditor(true);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSaveSnapshot = (imageDataUrl: string) => {
    // Create download link
    const link = document.createElement('a');
    link.download = `moss-snapshot-${Date.now()}.png`;
    link.href = imageDataUrl;
    
    // For mobile devices, open in new tab if download fails
    try {
      link.click();
    } catch (error) {
      // Fallback: open image in new tab for mobile
      window.open(imageDataUrl, '_blank');
    }
    
    setShowEditor(false);
    setCapturedImage(null);
  };

  const handleUploadToGallery = async (imageDataUrl: string, title: string, mossType: string, stickers: string[] = []) => {
    try {
      // Validate inputs
      if (!imageDataUrl || !title || !mossType) {
        throw new Error('Missing required fields');
      }

      // Limit image data URL size to prevent issues
      if (imageDataUrl.length > 10 * 1024 * 1024) {
        throw new Error('Image is too large. Please try a smaller image.');
      }

      const response = await fetch('/api/moss-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: 'default-user',
          title: title.trim() || 'My Moss Discovery',
          imageUrl: imageDataUrl,
          locationName: '360° Tour',
          stickers: Array.isArray(stickers) ? stickers : [],
          energyReward: 1,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to upload to gallery';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Save to localStorage for 3D garden
      if (typeof window !== "undefined") {
        try {
          const mossRecord = {
            id: crypto.randomUUID?.() || `moss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            source: "snapshot",
            imageUrl: imageDataUrl,
            mossType: mossType || 'Unknown Moss',
            has3D: true,
            createdAt: new Date().toISOString()
          };
          const stored = localStorage.getItem("mossUploads");
          const existing = stored ? JSON.parse(stored) : [];
          if (Array.isArray(existing)) {
            existing.push(mossRecord);
            localStorage.setItem("mossUploads", JSON.stringify(existing));
          }
        } catch (err) {
          console.error('Error saving to localStorage:', err);
          // Continue even if localStorage fails - this is not critical
        }
      }

      alert(`Successfully uploaded "${title}" to gallery! 🌿`);
      setShowEditor(false);
      setCapturedImage(null);
      
      // Optionally redirect to gallery
      try {
        window.location.href = '/gallery';
      } catch (redirectError) {
        console.error('Error redirecting to gallery:', redirectError);
        // If redirect fails, just close the editor
      }
    } catch (error) {
      console.error('Error uploading to gallery:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload to gallery. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-moss-green mb-4">360° Moss Tour</h1>
          <p className="text-gray-700">Explore the virtual moss tour and discover hidden moss spots</p>
        </div>

        {!hasStarted ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center mb-6">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-moss-green mb-6">Ready to Explore?</h2>
              <p className="text-gray-600 mb-8">
                Begin your journey through the virtual moss tour and discover hidden moss spots around NUS campus.
              </p>
              <button
                onClick={() => setHasStarted(true)}
                className="bg-moss-green text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-moss-dark transition-colors shadow-md"
              >
                Start Tour 🌿
              </button>
            </div>
          </div>
        ) : (
          <div ref={iframeRef} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={thinkLinkUrl}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allowFullScreen
                title="360° Moss Tour"
              />
            </div>
          </div>
        )}

        {/* Capture Your Discovery section - always visible */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Capture Your Discovery</h2>
          <p className="text-gray-600 mb-6">
            Found something interesting? Take a snapshot and share it with the community!
          </p>
          
          {/* Snapshot button */}
          <div className="mb-6">
            <button
              onClick={handleCaptureSnapshot}
              disabled={isCapturing}
              className="bg-moss-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-moss-dark transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {isCapturing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Capturing...</span>
                </>
              ) : (
                'Take a Snapshot!'
              )}
            </button>
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href="/post"
              className="bg-moss-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-moss-dark transition-colors"
            >
              Share Your Moss Discovery 🌿
            </a>
            <a
              href="/gallery"
              className="border-2 border-moss-green text-moss-green px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              View Other Discoveries
            </a>
          </div>
        </div>
      </div>

      {/* Snapshot Editor Modal */}
      {showEditor && capturedImage && (
        <SnapshotEditor
          imageUrl={capturedImage}
          onSave={handleSaveSnapshot}
          onUploadToGallery={handleUploadToGallery}
          onClose={() => {
            setShowEditor(false);
            setCapturedImage(null);
          }}
        />
      )}
    </main>
  );
}

