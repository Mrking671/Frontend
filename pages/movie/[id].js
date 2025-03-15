import { useRouter } from 'next/router';

export default function Movie() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  const streamUrl = `https://disabled-brenda-godaddy-41a00a2b.koyeb.app/stream/${id}`;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Streaming Movie</h1>
      <video controls style={{ width: '100%', maxWidth: '800px' }}>
        <source src={streamUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
