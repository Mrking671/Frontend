import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch movies (all or via search)
  const fetchMovies = (query = "") => {
    const endpoint = query ? `/search?q=${encodeURIComponent(query)}` : '/movies';
    fetch(`https://disabled-brenda-godaddy-41a00a2b.koyeb.app${endpoint}`)
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchQuery);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>MovieFlix</h1>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>
      </header>
      <main className={styles.movieGrid}>
        {movies.map((movie) => (
          <Link href={`/movie/${movie._id}`} key={movie._id}>
            <a className={styles.movieCard}>
              <div className={styles.posterContainer}>
                {movie.omdb && movie.omdb.Poster && movie.omdb.Poster !== "N/A" ? (
                  <img src={movie.omdb.Poster} alt={movie.file_name} className={styles.poster} />
                ) : (
                  <div className={styles.noPoster}>No Image</div>
                )}
                {movie.omdb && movie.omdb.imdbRating && (
                  <div className={styles.rating}>
                    {movie.omdb.imdbRating} ★
                  </div>
                )}
              </div>
              <div className={styles.movieTitle}>{movie.file_name}</div>
            </a>
          </Link>
        ))}
      </main>
    </div>
  );
}
