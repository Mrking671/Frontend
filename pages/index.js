import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { MongoClient } from 'mongodb';
import axios from 'axios';

// Helper function to clean up the movie title
function cleanTitle(title) {
  return title
    .replace(/\b(1080p|720p|480p|NF|WEB DL|DDP\d+\.\d+|AV1|Saon|mkv|mp4|S\d+E\d+|Episode \d+)\b/gi, "")
    .replace(/[\.\-_]/g, " ")
    .trim();
}

export async function getServerSideProps() {
  // Connect to MongoDB
  const uri = process.env.MONGO_URI;
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db(); // Uses default DB from connection string
  const moviesCollection = db.collection('vjcollection');
  const movies = await moviesCollection.find({}).toArray();

  // Close the MongoDB connection
  await client.close();

  // For each movie, call TMDb API to get details (poster, rating, etc.)
  const tmdbApiKey = process.env.TMDB_API_KEY;
  const moviesWithTMDb = await Promise.all(
    movies.map(async (movie) => {
      const title = movie.file_name;
      const cleanedTitle = cleanTitle(title);
      let tmdbData = null;
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(cleanedTitle)}`
        );
        if (res.data.results && res.data.results.length > 0) {
          tmdbData = res.data.results[0];
        }
      } catch (error) {
        console.error(`TMDb fetch error for "${cleanedTitle}":`, error);
      }
      return { ...movie, tmdb: tmdbData };
    })
  );

  // Pass the integrated data to the page
  return {
    props: {
      movies: JSON.parse(JSON.stringify(moviesWithTMDb)),
    },
  };
}

export default function Home({ movies }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>MovieFlix</h1>
      </header>

      <main className={styles.movieGrid}>
        {movies.map((movie) => {
          const tmdb = movie.tmdb;
          // TMDb returns a relative poster path; prepend base URL if available.
          const posterUrl =
            tmdb && tmdb.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
              : "/default-poster.png"; // Place a fallback image in the public folder
          const rating = tmdb && tmdb.vote_average ? tmdb.vote_average : null;

          return (
            <Link href={`/movie/${movie._id}`} key={movie._id}>
              <a className={styles.movieCard}>
                <div className={styles.posterContainer}>
                  <img src={posterUrl} alt={movie.file_name} className={styles.poster} />
                  {rating && (
                    <div className={styles.rating}>
                      {rating} ★
                    </div>
                  )}
                </div>
                <div className={styles.movieTitle}>{movie.file_name}</div>
              </a>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
