'use client'
// pages/image-search.js

import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const imageLoader = ({ src }) => {
  return `https://atk.dbackup.cloud/crop/${src}`;
}

function Header() {
  return (
    <header className="bg-gray-800 text-white py-6 mb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">Image Search</h1>
        <p className="mt-2 text-gray-300">Find similar images in our database</p>
      </div>
    </header>
  );
}

function ImageSearch() {
  const [imageFile, setImageFile] = useState(null);
  const [radius, setRadius] = useState('');
  const [limit, setLimit] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('radius', radius);
    formData.append('limit', limit);

    try {
      const response = await fetch('https://atk.dbackup.cloud/search', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 404) {
        setError('No images found');
        setSearchResults([]);
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSearchResults(data.results[0]);
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
        <title>Image Search</title>
        <meta name="description" content="Search similar images" />
      </Head>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 mb-2">Image File:</label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="radius" className="block text-gray-700 mb-2">Radius:</label>
            <input
              type="number"
              id="radius"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="limit" className="block text-gray-700 mb-2">Limit:</label>
            <input
              type="number"
              id="limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {searchResults.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {searchResults.map((result, index) => {
                const originalFileName = result.id.split('____')[0];
                return (
                  <div key={index} className="text-center">
                    <a href={`https://atk.dbackup.cloud/original/${originalFileName}`} target="_blank" rel="noopener noreferrer" className="block">
                      <Image
                        loader={imageLoader}
                        src={result.id}
                        alt={`Image ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
                      />
                    </a>
                    <p className="mt-2 text-sm text-gray-600">Distance: {result.distance.toFixed(4)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ImageSearch;