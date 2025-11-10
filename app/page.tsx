'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
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

        <div className="grid gap-6 md:grid-cols-3 mt-10 max-w-4xl mx-auto">
          {/* 1. Post a Moss */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-50 p-6 flex flex-col gap-3 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-2xl">📸</div>
            <h3 className="text-lg font-semibold text-green-900">Post a Moss</h3>
            <p className="text-sm text-gray-600">
              Upload or snap a moss you found on campus. Our AI will suggest the moss type and create a 3D preview.
            </p>
            <button
              onClick={() => router.push("/post")}
              className="mt-auto inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-900"
            >
              Go to Post →
            </button>
          </div>

          {/* 2. Grow Your Garden */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-50 p-6 flex flex-col gap-3 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-2xl">🌱</div>
            <h3 className="text-lg font-semibold text-green-900">Grow Your Digital Garden</h3>
            <p className="text-sm text-gray-600">
              Every saved moss becomes a 3D memory in your personal garden. Switch between card and garden views.
            </p>
            <button
              onClick={() => router.push("/me")}
              className="mt-auto inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-900"
            >
              View My Garden →
            </button>
          </div>

          {/* 3. Explore the Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-50 p-6 flex flex-col gap-3 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-2xl">🗺️</div>
            <h3 className="text-lg font-semibold text-green-900">Explore the Moss Map</h3>
            <p className="text-sm text-gray-600">
              See live discoveries shared by others and explore how moss connects across campus.
            </p>
            <button
              onClick={() => router.push("/map")}
              className="mt-auto inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-900"
            >
              Open Map →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

