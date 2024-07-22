// src/app/video-player/page.js
'use client'

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function VideoPlayer() {
  const searchParams = useSearchParams();
  const video = searchParams.get('video');
  const timestamp = searchParams.get('timestamp');
  const frames = searchParams.get('frames');
  const [isLoading, setIsLoading] = useState(true);

  // Convert timestamp to seconds for video player
  const startTime = timestamp.split(':').reduce((acc, time) => (60 * acc) + +time, 0);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold">Video Player</h1>
          <Link 
            href={{
              pathname: '/frame-viewer',
              query: { frames: frames },
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300 text-sm w-full sm:w-auto text-center"
          >
            Back to Frames
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
            {isLoading ? (
              <div className="aspect-video flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <video
                controls
                autoPlay
                className="w-full aspect-video"
                src={`https://atk.dbackup.cloud/videos/${video}#t=${startTime}`}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="mt-4 sm:mt-6 text-center">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Now Playing</h2>
            <p className="text-gray-300 text-sm sm:text-base truncate">{video}</p>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">Starting from: {timestamp}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VideoPlayer;