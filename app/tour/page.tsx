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
      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 1,
        logging: false,
      });

      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      setShowEditor(true);
    } catch (error) {
      console.error('Error capturing snapshot:', error);
      // Fallback to prototype image if capture fails
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
      const response = await fetch('/api/moss-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: 'default-user',
          title: title,
          imageUrl: imageDataUrl,
          locationName: '360° Tour',
          stickers: stickers,
          energyReward: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to upload' }));
        throw new Error(errorData.error || 'Failed to upload to gallery');
      }

      // Save to localStorage for 3D garden
      if (typeof window !== "undefined") {
        const mossRecord = {
          id: crypto.randomUUID(),
          source: "snapshot",
          imageUrl: imageDataUrl,
          mossType: mossType,
          has3D: true,
          createdAt: new Date().toISOString()
        };
        const existing = JSON.parse(localStorage.getItem("mossUploads") || "[]");
        existing.push(mossRecord);
        localStorage.setItem("mossUploads", JSON.stringify(existing));
      }

      alert(`Successfully uploaded "${title}" to gallery! 🌿`);
      setShowEditor(false);
      setCapturedImage(null);
      
      // Optionally redirect to gallery
      window.location.href = '/gallery';
    } catch (error) {
      console.error('Error uploading to gallery:', error);
      if (error instanceof Error) {
        alert(`Failed to upload: ${error.message}`);
      } else {
        alert('Failed to upload to gallery. Please try again.');
      }
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

