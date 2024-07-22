import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>FaceApp Viewer</title>
        <meta name="description" content="Explore facial recognition clusters" />
      </Head>
      
      <header className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">FaceApp Viewer</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome to FaceApp Viewer</h2>
          <p className="text-gray-600 mb-6">
            This application allows you to explore and visualize clusters of facial recognition results. 
            Dive into the world of AI-powered facial recognition and discover interesting patterns and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/image-grid" legacyBehavior>
            <a className="block p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-2">Explore Image Clusters</h3>
              <p>View and navigate through facial recognition clusters</p>
            </a>
          </Link>

          <Link href="/image-search" legacyBehavior>
            <a className="block p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-2">Image Search</h3>
              <p>Search for similar images within our database</p>
            </a>
          </Link>

          <Link href="/cluster-search" legacyBehavior>
            <a className="block p-6 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-2">Cluster Search</h3>
              <p>Find similar image clusters based on your input</p>
            </a>
          </Link>

          <Link href="/video-search" legacyBehavior>
            <a className="block p-6 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-2">Video Search</h3>
              <p>Search faces in video collection</p>
            </a>
          </Link>

          <Link href="/video-grid" legacyBehavior>
            <a className="block p-6 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-2">Video Cluster Viewer</h3>
              <p>View video clusters</p>
            </a>
          </Link>

          <Link href="/video-cluster-search" legacyBehavior>
            <a className="block p-6 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-2">Video Cluster Search</h3>
              <p>Search on video clusters</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 FaceApp Viewer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}