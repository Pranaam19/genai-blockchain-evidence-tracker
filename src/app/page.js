import Head from 'next/head';
import UploadForm from './components/UploadForm';

export default function Home() {
  return (
    <div>
      <Head>
        <title>GenAI Blockchain Evidence Tracker</title>
      </Head>
      <main className="min-h-screen bg-gray-100 py-10">
        <UploadForm />
      </main>
    </div>
  );
}
