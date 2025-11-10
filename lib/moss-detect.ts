/**
 * Moss detection helper functions
 * Uses simple keyword matching to detect moss types from names/titles
 */

export function detectMossTypeFromName(name: string): string {
  const lowerName = name.toLowerCase();
  
  // Keyword matching for different moss types
  if (lowerName.includes('fern')) return 'Fern Moss';
  if (lowerName.includes('flat')) return 'Flat Moss';
  if (lowerName.includes('hair')) return 'Hair Moss';
  if (lowerName.includes('long')) return 'Long Moss';
  if (lowerName.includes('rock')) return 'Rock Moss';
  if (lowerName.includes('star')) return 'Star Moss';
  if (lowerName.includes('reindeer') || lowerName.includes('redeer')) return 'Reindeer Moss';
  if (lowerName.includes('ball')) return 'Ball Moss';
  
  // Fallback if no match found
  return fallbackMossType();
}

export function fallbackMossType(): string {
  // Return a random moss type as fallback
  const mossTypes = [
    'Fern Moss',
    'Flat Moss',
    'Hair Moss',
    'Long Moss',
    'Rock Moss',
    'Star Moss',
    'Reindeer Moss',
    'Ball Moss'
  ];
  return mossTypes[Math.floor(Math.random() * mossTypes.length)];
}

