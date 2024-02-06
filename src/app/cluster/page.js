'use client'
// pages/cluster.js

import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation'

const ClusterPage = () => {
  const searchParams = useSearchParams()
 
  const clusterId = searchParams.get('clusterId') // Extract clusterId from the URL query string
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Ensure clusterId is not undefined or null before proceeding
    if (!clusterId) return;

    fetch(`https://faceapp.dbackup.cloud/cluster/${clusterId}`)
      .then((response) => response.json())
      .then((data) => {
        setFiles(data.file_names || []);
      })
      .catch((error) => console.error('Error fetching cluster images:', error));
  }, [clusterId]);


  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', margin: '20px' }}>
      {files.map((fileName, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          {/* Wrap the img tag in an anchor tag pointing to the original image URL */}
          <a href={`https://faceapp.dbackup.cloud/oimage/${fileName}`} target="_blank" rel="noopener noreferrer">
            <img
              src={`https://faceapp.dbackup.cloud/image/${fileName}`}
              alt={`Cluster Image`}
              style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
            />
          </a>
        </div>
      ))}
    </div>
  );
};

export default ClusterPage;
