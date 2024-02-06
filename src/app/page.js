import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '40px auto' }}>
      <Head>
        <title>FaceApp Viewer</title>
        <meta name="description" content="Explore facial recognition clusters" />
      </Head>
      
      <h1>Welcome to FaceApp Viewer</h1>
      <p>This application allows you to explore and visualize clusters of facial recognition results. Dive into the world of AI-powered facial recognition and discover interesting patterns and insights.</p>
      
      {/* Navigation Link to ImageGrid */}
      <p>
        <Link href="/image-grid" legacyBehavior>
          <a style={{ color: 'blue', textDecoration: 'underline' }}>Explore Image Clusters</a>
        </Link>
      </p>
      
      {/* Additional content or links can be added here */}
    </div>
  );
}