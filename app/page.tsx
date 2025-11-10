import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-moss-green mb-4">
            🌿 NUS Moss Explorer
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover, share, and grow your moss ecosystem on campus
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/tour"
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-moss-green"
          >
            <h2 className="text-2xl font-bold text-moss-green mb-4">
              Start 360° Tour
            </h2>
            <p className="text-gray-600">
              Explore the virtual moss tour and discover hidden moss spots around NUS campus.
            </p>
          </Link>

          <Link
            href="/gallery"
            className="bg-moss-green text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4">
              View Other Discoveries
            </h2>
            <p className="text-white/90">
              See what moss treasures other students have found and shared.
            </p>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/post"
            className="inline-block bg-moss-light text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-moss-dark transition-colors shadow-md"
          >
            I found moss at NUS too! 🌿
          </Link>
        </div>

        <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold text-lg mb-2">Map Your Discovery</h3>
            <p className="text-gray-600 text-sm">
              Pin your moss findings on the interactive campus map
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">Collect Energy</h3>
            <p className="text-gray-600 text-sm">
              Each discovery earns energy to unlock new biomes
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="font-bold text-lg mb-2">Watch It Grow</h3>
            <p className="text-gray-600 text-sm">
              Track your moss ecosystem from seed to forest
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

