// src/app/frame-viewer/page.js
'use client'

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'
import Image from 'next/image';
import Link from 'next/link';

const imageLoader = ({ src }) => {
  return `https://atk.dbackup.cloud/frames/${src}`;
}

function FrameViewer() {
  const searchParams = useSearchParams();
  const frames = searchParams.get('frames');

  if (!frames) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  const frameList = JSON.parse(frames);
  const videoFilename = frameList[0].split('____')[0];

  const getTimestamp = (frame) => {
    return frame.split('____')[2].split('.')[0];
  }

  return (
    <Suspense>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">FaceApp</h1>
              <span className="hidden sm:inline text-gray-500">|</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Frame Viewer</h2>
            </div>
            <Link 
              href={`https://atk.dbackup.cloud/videos/${videoFilename}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-full transition-colors duration-300 text-sm font-medium shadow-md hover:shadow-lg w-full sm:w-auto text-center"
            >
              View Original Video
            </Link>
          </div>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-600 truncate">Video: {videoFilename}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {frameList.map((frame, index) => (
            <Link 
              key={index} 
              href={{
                pathname: '/video-player',
                query: {
                  video: videoFilename,
                  timestamp: getTimestamp(frame),
                  frames: frames,
                },
              }}
              className="block"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                <div className="relative aspect-video sm:aspect-square">
                  <Image
                    loader={imageLoader}
                    src={frame}
                    alt={`Frame ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className="bg-gray-100"
                  />
                </div>
                <div className="p-2 sm:p-3 bg-white">
                  <p className="text-gray-700 font-medium text-sm sm:text-base text-center">
                    {getTimestamp(frame)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
    </Suspense>
  );
}

export default FrameViewer;