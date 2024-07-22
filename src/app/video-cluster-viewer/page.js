// app/video-cluster-viewer/page.js
'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const imageLoader = ({ src }) => {
  return `https://atk.dbackup.cloud/faces/${src}`;
}

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-4">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold">FaceApp</h1>
        <p className="text-sm">Video Cluster Viewer</p>
      </div>
    </header>
  );
}

function VideoClusterViewer() {
  const searchParams = useSearchParams();
  const filename = searchParams.get('filename');
  const [clusterData, setClusterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (filename) {
      fetchClusterData(filename);
    } else {
      setIsLoading(false);
      setError('No filename provided');
    }
  }, [filename]);

  const fetchClusterData = async (filename) => {
    try {
      const response = await fetch(`https://atk.dbackup.cloud/video_file_cluster?filename=${filename}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cluster data');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setClusterData(data);
    } catch (error) {
      console.error('Error fetching cluster data:', error);
      setError('An error occurred while fetching cluster data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-8">
            <p className="text-red-600 mb-4 text-xl">{error}</p>
            <Link href="/" className="text-blue-500 hover:underline">
              Return to Search
            </Link>
          </div>
        ) : !clusterData || !clusterData.results || clusterData.results.length === 0 ? (
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4 text-xl">No cluster data available.</p>
            <Link href="/" className="text-blue-500 hover:underline">
              Return to Search
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Video Cluster Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {clusterData.results.map((result, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
                  <Link 
                    href={{
                      pathname: '/frame-viewer',
                      query: { frames: JSON.stringify(result.frame_filenames) },
                    }}
                  >
                    <div className="cursor-pointer">
                      <div className="h-64 overflow-hidden">
                        <Image
                          loader={imageLoader}
                          src={result.representative_face_filename}
                          alt={`Representative Face ${index + 1}`}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-1">Video: {result.video_filename}</p>
                        <p className="text-sm text-gray-600 mb-1">Frames: {result.frame_filenames.length}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default VideoClusterViewer;