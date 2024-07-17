'use client'
// pages/cluster.js
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const imageLoader = ({ src }) => {
  return `https://atk.dbackup.cloud/crop/${src}`;
}

function Header() {
  return (
    <header className="bg-gray-800 text-white py-4 mb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">Face Cluster Viewer</h1>
        <p className="mt-2 text-gray-300">Explore similar faces in your collection</p>
      </div>
    </header>
  );
}

function GetData() {
  const searchParams = useSearchParams();
  const filename = searchParams.get('filename');
  const [files, setFiles] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(30);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filename) return;

    fetch(`https://atk.dbackup.cloud/file_cluster?filename=${filename}&offset=${offset}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data); // Debugging line

        if (data && Array.isArray(data.results)) {
          setFiles(prevFiles => [...prevFiles, ...data.results]);
          setHasMore(data.results.length === limit);
          setTotalCount(data.total_count);
        } else {
          throw new Error('Unexpected data structure received from API');
        }
      })
      .catch((error) => {
        console.error('Error fetching cluster images:', error);
        setError(error.message);
      });
  }, [filename, offset, limit]);

  if (error) {
    return <div className="text-red-600 text-center text-xl mt-12">Error: {error}</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file, index) => {
            const originalFileName = file.split('____')[0];
            return (
              <div key={index} className="text-center">
                <a href={`https://atk.dbackup.cloud/original/${originalFileName}`} target="_blank" rel="noopener noreferrer" className="block">
                  <Image
                    loader={imageLoader}
                    src={file}
                    alt={`Face Cluster ${file}`}
                    width={300}
                    height={300}
                    className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </a>
              </div>
            );
          })}
        </div>
        {hasMore && (
          <button
            onClick={() => setOffset(prevOffset => prevOffset + limit)}
            className="block mx-auto mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Show More
          </button>
        )}
        <div className="text-center text-gray-600 mt-6">
          Showing {files.length} of {totalCount} images
        </div>
      </div>
    </>
  );
}

const ClusterPage = () => {
  return (
    <Suspense fallback={<div className="text-center text-xl mt-12 text-gray-600">Loading...</div>}>
      <GetData />
    </Suspense>
  );
};

export default ClusterPage;