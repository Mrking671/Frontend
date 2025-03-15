import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('https://disabled-brenda-godaddy-41a00a2b.koyeb.app/movies')
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Movie Streaming Site</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>
            <Link href={`/movie/${movie._id}`}>
              <a>{movie.file_name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
