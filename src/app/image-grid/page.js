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
  
  
  useEffect(() => {
    // Fetching image data from your FastAPI backend
    fetch('https://faceapp.dbackup.cloud')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the API returns a JSON object where keys are cluster identifiers
        // and values are filenames, as described.
        const imageEntries = Object.entries(data).map(([key, value]) => ({
          cluster: key.split(':')[1], // Extracting cluster number from key
          fileName: value,
        }));
        setImages(imageEntries);
      })
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  return (
    <>
      <Head>
        <title>Image Grid</title>
        <meta name="description" content="Explore image clusters" />
      </Head>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Image Clusters</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginTop: '20px' }}>
          {images.map(({ cluster, fileName }, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              {/* Linking each image to its cluster details page */}
              <Link href={`/cluster?clusterId=${cluster}`} legacyBehavior>
                <a>
                <Image
                    loader={imageLoader}
                    src={`${fileName}`}
                    alt={`Face Cluster ${cluster}`}
                    width={300}
                    height={300}
                  />
                </a>
              </Link>
              <p>Face Cluster: {cluster}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ImageGrid;
