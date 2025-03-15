import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/Movie.module.css';

export default function Movie() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`https://disabled-brenda-godaddy-41a00a2b.koyeb.app/movie/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{movie.file_name}</h1>
        {movie.omdb && movie.omdb.imdbRating && (
          <div className={styles.imdbRating}>
            IMDb Rating: {movie.omdb.imdbRating} ★
          </div>
        )}
      </header>
      <div className={styles.content}>
        <div className={styles.videoWrapper}>
          <video controls style={{ width: '100%' }}>
            <source src={`https://disabled-brenda-godaddy-41a00a2b.koyeb.app/stream/${movie._id}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {movie.omdb && (
          <div className={styles.details}>
            <h2>{movie.omdb.Title}</h2>
            <p>{movie.omdb.Plot}</p>
            <p><strong>Genre:</strong> {movie.omdb.Genre}</p>
            <p><strong>Released:</strong> {movie.omdb.Released}</p>
            <p><strong>Runtime:</strong> {movie.omdb.Runtime}</p>
            <p><strong>Director:</strong> {movie.omdb.Director}</p>
            <p><strong>Actors:</strong> {movie.omdb.Actors}</p>
          </div>
        )}
      </div>
    </div>
  );
}
