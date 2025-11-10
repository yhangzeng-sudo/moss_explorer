'use client';

import Link from 'next/link';
import { useState } from 'react';
import LoginButton from './LoginButton';

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-moss-green text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          🌿 NUS Moss Explorer
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <Link href="/tour" className="hover:underline">360° Tour</Link>
          <Link href="/post" className="hover:underline">+ Post</Link>
          <Link href="/gallery" className="hover:underline">Gallery</Link>
          <Link href="/map" className="hover:underline">Map</Link>
          <Link href="/encyclopedia" className="hover:underline">Moss Encyclopedia</Link>
          <Link href="/me" className="hover:underline">My Garden</Link>
          <LoginButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-2">
          <div className="flex flex-col gap-2">
            <Link 
              href="/tour" 
              className="px-4 py-2 hover:bg-green-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              360° Tour
            </Link>
            <Link 
              href="/post" 
              className="px-4 py-2 hover:bg-green-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              + Post
            </Link>
            <Link 
              href="/gallery" 
              className="px-4 py-2 hover:bg-green-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link 
              href="/map" 
              className="px-4 py-2 hover:bg-green-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Map
            </Link>
            <Link 
              href="/encyclopedia" 
              className="px-4 py-2 hover:bg-green-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Moss Encyclopedia
            </Link>
            <Link 
              href="/me" 
              className="px-4 py-2 hover:bg-green-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              My Garden
            </Link>
            <div className="px-4 py-2">
              <LoginButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

