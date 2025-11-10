'use client';

import { useState } from 'react';
import SnapshotEditor from '@/components/SnapshotEditor';

export default function SnapshotButton({ imageUrl }: { imageUrl?: string }) {
  const [showEditor, setShowEditor] = useState(false);
  
  // Use provided imageUrl or a prototype image
  const displayImageUrl = imageUrl || '/moss example.JPG';

  const handleSave = (imageDataUrl: string) => {
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
  };

  return (
    <>
      <button
        onClick={() => setShowEditor(true)}
        className="bg-moss-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-moss-dark transition-colors shadow-md"
      >
        Take a Snapshot!
      </button>
      {showEditor && (
        <SnapshotEditor
          imageUrl={displayImageUrl}
          onSave={handleSave}
          onClose={() => setShowEditor(false)}
        />
      )}
    </>
  );
}

