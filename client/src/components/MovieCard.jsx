function MovieCard({ movie, saved, onOpen, onToggleSave }) {
  return (
    <article className="movie-card">
      <button className="poster-button" type="button" onClick={() => onOpen(movie)} aria-label={`View ${movie.title}`}>
        <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
        <span className="poster-shade" />
        <span className="poster-title">{movie.title}</span>
        <span className="poster-meta">{movie.year} · {movie.genres?.[0]}</span>
      </button>
      <button
        className={`save-button${saved ? " save-button--saved" : ""}`}
        type="button"
        onClick={() => onToggleSave(movie)}
        aria-label={saved ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`}
      >
        {saved ? "✓" : "+"}
      </button>
    </article>
  );
}

export default MovieCard;
