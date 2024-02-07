'use client'
// pages/cluster.js
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const imageLoader = ({ src }) => {
  return `https://faceapp.dbackup.cloud/image/${src}`;
}

function GetData() {
  const searchParams = useSearchParams();
  const clusterId = searchParams.get('clusterId');
  const [files, setFiles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(100); // Adjust based on your preference
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!clusterId) return;

    fetch(`https://faceapp.dbackup.cloud/cluster/${clusterId}?skip=${skip}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming 'data' structure matches your API response
        setFiles(prevFiles => [...prevFiles, ...(data.files || [])]);
        setHasMore((data.files || []).length === limit);
      })
      .catch((error) => console.error('Error fetching cluster images:', error));
  }, [clusterId, skip, limit]);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', margin: '20px' }}>
        {files.map((fileName, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
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
      {hasMore && (
        <button
          onClick={() => setSkip(prevSkip => prevSkip + limit)}
          style={{ display: 'block', margin: '20px auto' }}
        >
          Show More
        </button>
      )}
    </>
  );
}

const ClusterPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GetData />
    </Suspense>
  );
};

export default ClusterPage;
