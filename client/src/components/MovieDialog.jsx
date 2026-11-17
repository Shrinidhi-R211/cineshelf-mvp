function MovieDialog({ movie, saved, onClose, onToggleSave }) {
  if (!movie) return null;
  return (
    <div className="dialog-scrim" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="movie-dialog" role="dialog" aria-modal="true" aria-labelledby="movie-title">
        <div className="movie-dialog-art" style={{ backgroundImage: `linear-gradient(0deg, #141419 2%, transparent 90%), url("${movie.backdrop}")` }}>
          <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Close">×</button>
          <div className="movie-dialog-heading">
            <span className="dialog-kicker">CINESHELF ORIGINAL</span>
            <h2 id="movie-title">{movie.title}</h2>
          </div>
        </div>
        <div className="movie-dialog-content">
          <div className="movie-facts"><span>{movie.year}</span><span>{movie.rating}</span><span>{movie.duration}</span></div>
          <p>{movie.description}</p>
          <div className="genre-tags">{movie.genres?.map((genre) => <span key={genre}>{genre}</span>)}</div>
          <button className={`button ${saved ? "button-secondary" : "button-primary"}`} type="button" onClick={() => onToggleSave(movie)}>
            {saved ? "✓  In My List" : "+  Add to My List"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default MovieDialog;
