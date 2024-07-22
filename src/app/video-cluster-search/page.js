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

function Footer({ totalClusters, totalVideos }) {
  return (
    <footer className="bg-gray-100 py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>Total clusters found: {totalClusters}</p>
        <p>Total videos found: {totalVideos}</p>
      </div>
    </footer>
  );
}

function ImageSearch() {
  const [imageFile, setImageFile] = useState(null);
  const [radius, setRadius] = useState('');
  const [limit, setLimit] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalClusters, setTotalClusters] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedRadius = localStorage.getItem('imageSearch_radius');
    const savedLimit = localStorage.getItem('imageSearch_limit');
    const savedResults = localStorage.getItem('imageSearch_searchResults');
    const savedTotalClusters = localStorage.getItem('imageSearch_totalClusters');
    const savedTotalVideos = localStorage.getItem('imageSearch_totalVideos');

    if (savedRadius) setRadius(savedRadius);
    if (savedLimit) setLimit(savedLimit);
    if (savedResults) setSearchResults(JSON.parse(savedResults));
    if (savedTotalClusters) setTotalClusters(parseInt(savedTotalClusters));
    if (savedTotalVideos) setTotalVideos(parseInt(savedTotalVideos));
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
      const response = await fetch('https://atk.dbackup.cloud/search_video_cluster', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 404) {
        setError('No images found');
        setSearchResults([]);
        setTotalClusters(0);
        setTotalVideos(0);
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API Response:', data); // Log the response for debugging

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results[0]);
        setTotalClusters(data.count || 0);
        setTotalVideos(data.results[0].reduce((sum, item) => sum + (item.entity?.file_count || 0), 0));
        
        localStorage.setItem('imageSearch_radius', radius);
        localStorage.setItem('imageSearch_limit', limit);
        localStorage.setItem('imageSearch_searchResults', JSON.stringify(data.results[0]));
        localStorage.setItem('imageSearch_totalClusters', data.count || 0);
        localStorage.setItem('imageSearch_totalVideos', data.results[0].reduce((sum, item) => sum + (item.entity?.file_count || 0), 0));
      } else {
        setError('No results found');
        setSearchResults([]);
        setTotalClusters(0);
        setTotalVideos(0);
      }
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
                      pathname: '/video-cluster-viewer',
                      query: { filename: result.id },
                    }}
                  >
                    <div className="cursor-pointer">
                      <div className="h-64 overflow-hidden">
                        <Image
                          loader={imageLoader}
                          src={result.id}
                          alt={`Image ${index + 1}`}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        {result.distance !== undefined && (
                          <p className="text-sm text-gray-600 mb-1">
                            Distance: {typeof result.distance === 'number' ? result.distance.toFixed(4) : result.distance}
                          </p>
                        )}
                        {result.entity && result.entity.file_count !== undefined && (
                          <p className="text-sm text-gray-600 mb-1">Files: {result.entity.file_count}</p>
                        )}
                        <p className="text-sm text-gray-600 truncate">ID: {result.id}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer totalClusters={totalClusters} totalVideos={totalVideos} />
    </>
  );
}

export default ImageSearch;