'use client'
// pages/image-grid.js

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const imageLoader = ({ src }) => {
  return `https://faceapp.dbackup.cloud/image/${src}`;
}

function ImageGrid() {
  const [images, setImages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(100); // Adjust based on your preference
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetch(`https://faceapp.dbackup.cloud?skip=${skip}&limit=${limit}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const imageEntries = Object.entries(data).map(([key, value]) => ({
          cluster: key.split(':')[1],
          count: key.split(':')[2], // Extracting cluster number from key
          fileName: value,
        }));
        setImages(prevImages => [...prevImages, ...imageEntries]);
        setHasMore(imageEntries.length === limit);
      })
      .catch((error) => console.error('Error fetching images:', error));
  }, [skip, limit]);

  return (
    <>
      <Head>
        <title>Image Grid</title>
        <meta name="description" content="Explore image clusters" />
      </Head>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Image Clusters</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginTop: '20px' }}>
          {images.map(({ cluster,count, fileName }, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              {/* Linking each image to its cluster details page */}
              <Link href={`/cluster?clusterId=${cluster}`} legacyBehavior>
                <a>
                <Image
                    loader={imageLoader}
                    src={`${fileName}`}
                    alt={`Face cluster: ${cluster}`}
                    width={300}
                    height={300}
                  />
                </a>
              </Link>
              <p>c_id: {cluster} count:{count}</p>
            </div>
          ))}
        </div>
      </div>
        {hasMore && (
          <button
            onClick={() => setSkip(prevSkip => prevSkip + limit)}
            disabled={!hasMore}
            style={{ margin: '20px auto', display: 'block' }}
          >
            Show More
          </button>
        )}
    </>
  );
}

export default ImageGrid;
