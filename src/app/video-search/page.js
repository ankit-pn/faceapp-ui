'use client'

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
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
        <p className="text-sm">Find similar faces in our video database</p>
      </div>
    </header>
  );
}

function Footer({ totalCount }) {
  return (
    <footer className="bg-gray-100 py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-gray-600">
        Total videos found: {totalCount}
      </div>
    </footer>
  );
}

function ImageSearch() {
  const [imageFile, setImageFile] = useState(null);
  const [radius, setRadius] = useState('');
  const [limit, setLimit] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedRadius = localStorage.getItem('radius');
    const savedLimit = localStorage.getItem('limit');
    const savedResults = localStorage.getItem('searchResults');
    const savedTotalCount = localStorage.getItem('totalCount');

    if (savedRadius) setRadius(savedRadius);
    if (savedLimit) setLimit(savedLimit);
    if (savedResults) setSearchResults(JSON.parse(savedResults));
    if (savedTotalCount) setTotalCount(parseInt(savedTotalCount));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('radius', radius);
    formData.append('limit', limit);

    try {
      const response = await fetch('https://atk.dbackup.cloud/video_search', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 404) {
        setError('No images found');
        setSearchResults([]);
        setTotalCount(0);
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSearchResults(data.results);
      setTotalCount(data.total_count);
      
      localStorage.setItem('radius', radius);
      localStorage.setItem('limit', limit);
      localStorage.setItem('searchResults', JSON.stringify(data.results));
      localStorage.setItem('totalCount', data.total_count);
    } catch (error) {
      console.error('Error searching images:', error);
      setError('An error occurred while searching');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>FaceApp - Image Search</title>
        <meta name="description" content="Search similar faces in videos" />
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Search Parameters</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload Image:</label>
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
              <div>
                <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">Radius:</label>
                <input
                  type="number"
                  id="radius"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
              <div>
                <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">Limit:</label>
                <input
                  type="number"
                  id="limit"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </div>

        {error && <p className="text-red-600 text-center my-6 text-lg">{error}</p>}

        {searchResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((result, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                          alt={`Image ${index + 1}`}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-1">Distance: {result.distance.toFixed(4)}</p>
                        <p className="text-sm text-gray-600 mb-1">Frames: {result.frame_filenames.length}</p>
                        <p className="text-sm text-gray-600 truncate">Video: {result.video_filename}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer totalCount={totalCount} />
    </>
  );
}

export default ImageSearch;