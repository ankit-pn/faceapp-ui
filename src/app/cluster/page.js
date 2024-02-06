'use client'
// pages/cluster.js
import Image from 'next/image';

import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const imageLoader = ({ src }) => {
  return `https://faceapp.dbackup.cloud/image/${src}`;
}

function GetData(){

  

  const searchParams = useSearchParams()
  const clusterId = searchParams.get('clusterId')
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


  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', margin: '20px' }}>
      {files.map((fileName, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          {/* Wrap the Image tag in an anchor tag pointing to the original image URL */}
          <a href={`https://faceapp.dbackup.cloud/oimage/${fileName}`} target="_blank" rel="noopener noreferrer">
          <Image
                    loader={imageLoader}
                    src={`${fileName}`}
                    alt={`Face Cluster ${fileName}`}
                    width={300}
                    height={300}
          />
          </a>
        </div>
      
      ))}
    </div>
}
const ClusterPage = () => {
  
 
  


  return (
    <Suspense>
      <GetData></GetData>
    </Suspense>
  );
};

export default ClusterPage;
