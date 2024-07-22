'use client'
// pages/image-grid.js

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const imageLoader = ({ src }) => {
  return `https://atk.dbackup.cloud/faces/${src}`;
}

function Header() {
  return (
    <header className="bg-gray-800 text-white py-6 mb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">Face Cluster Overview</h1>
        <p className="mt-2 text-gray-300">Explore all existing face clusters in your collection</p>
      </div>
    </header>
  );
}

function ImageGrid() {
  const [images, setImages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(50);
  const [hasMore, setHasMore] = useState(true);
  const [totalCluster, setTotalCluster] = useState(0);

  useEffect(() => {
    fetch(`https://atk.dbackup.cloud/get_video_cluster?offset=${skip}&limit=${limit}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const imageEntries = data.results.map((item, index) => ({
          cluster: index + skip,
          count: item.file_count,
          fileName: item.representative_file_name,
        }));
        setImages(prevImages => [...prevImages, ...imageEntries]);
        setHasMore(data.results.length === limit);
        setTotalCluster(data.total_count);
      })
      .catch((error) => console.error('Error fetching images:', error));
  }, [skip, limit]);

  return (
    <>
      <Head>
        <title>Face Cluster Overview</title>
        <meta name="description" content="Explore all existing face clusters" />
      </Head>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <p className="text-xl font-semibold">Total Clusters: {totalCluster}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {images.map(({ cluster, count, fileName }, index) => (
            <div key={index} className="text-center">
              <Link href={`/video-cluster-viewer?filename=${fileName}`} legacyBehavior>
                <a className="block">
                  <Image
                    loader={imageLoader}
                    src={fileName}
                    alt={`Face cluster: ${cluster}`}
                    width={300}
                    height={300}
                    className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </a>
              </Link>
              <p className="mt-2 text-sm text-gray-600">Cluster ID: {cluster} | Count: {count}</p>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            onClick={() => setSkip(prevSkip => prevSkip + limit)}
            disabled={!hasMore}
            className="block mx-auto mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
          >
            Show More
          </button>
        )}
        <div className="text-center text-gray-600 mt-6">
          Showing {images.length} of {totalCluster} clusters
        </div>
      </div>
    </>
  );
}

export default ImageGrid;