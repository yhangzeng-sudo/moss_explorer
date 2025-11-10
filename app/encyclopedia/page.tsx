'use client';

const mossData = [
  {
    id: "fern-moss",
    name: "Fern Moss",
    image: "/moss/fern moss.jpg",
    description: "Fern Moss spreads softly over damp soil and rotting wood.",
    location: "Shady, humid forest floors."
  },
  {
    id: "rock-moss",
    name: "Rock Moss",
    image: "/moss/rock moss.jpg",
    description: "Rock Moss clings tightly to stones and walls.",
    location: "Damp rocks, walls, and shaded pathways."
  },
  {
    id: "reindeer-moss",
    name: "Reindeer Moss",
    image: "/moss/redeer moss.jpg",
    description: "A lichen with coral-like branches that turn pale when dry.",
    location: "Open woodlands and dry forest edges."
  },
  {
    id: "ball-moss",
    name: "Ball Moss",
    image: "/moss/ball moss.jpg",
    description: "Small round clumps that live on branches and take moisture from the air.",
    location: "Tree branches in warm, humid climates."
  },
  {
    id: "flat-moss",
    name: "Flat Moss",
    image: "/moss/flat moss.jpg",
    description: "Flat Moss grows like a thin green layer, hugging the surface closely.",
    location: "On soil, stones, or wood in shaded spots."
  },
  {
    id: "long-moss",
    name: "Long Moss",
    image: "/moss/long moss.jpg",
    description: "Long Moss forms longer, trailing shoots that look like soft strings.",
    location: "Moist areas where it can hang or spread."
  },
  {
    id: "hair-moss",
    name: "Hair Moss",
    image: "/moss/hair moss.jpg",
    description: "Hair Moss has upright, hair-like stems that make it look fluffy.",
    location: "Wet ground or near streams."
  },
  {
    id: "star-moss",
    name: "Star Moss",
    image: "/moss/star moss.jpg",
    description: "Star Moss grows in small star-shaped tufts that sparkle in the light after rain.",
    location: "Moist soil, forest floors, and shaded rocky areas."
  }
];

export default function EncyclopediaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-moss-green mb-4">🌿 Moss Encyclopedia</h1>
          <p className="text-gray-700">Learn about different types of moss found in nature</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mossData.map((moss) => (
            <div
              key={moss.id}
              id={moss.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-square bg-gray-200">
                <img
                  src={moss.image}
                  alt={moss.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(moss.name);
                  }}
                />
              </div>
              <div className="p-3">
                <h2 className="text-lg font-bold text-moss-green mb-2">{moss.name}</h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-1">{moss.description}</p>
                <p className="text-xs text-gray-500 mt-1">📍 {moss.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

