import { useEffect, useMemo, useState } from "react";
import AuthDialog from "./components/AuthDialog.jsx";
import MovieCard from "./components/MovieCard.jsx";
import MovieDialog from "./components/MovieDialog.jsx";
import { apiRequest } from "./services/api.js";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("cineshelf-token"));
  const [user, setUser] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");
  const [catalogError, setCatalogError] = useState("");
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState("browse");
  const [query, setQuery] = useState("");
  const [authMode, setAuthMode] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    apiRequest("/health")
      .then((data) => setApiStatus(data.database === "connected" ? "connected" : "database"))
      .catch(() => setApiStatus("unavailable"));
    apiRequest("/movies")
      .then((data) => {
        setMovies(data.movies);
        setCatalogError("");
      })
      .catch((error) => setCatalogError(error.message));
  }, []);

  useEffect(() => {
    if (!token) return;
    apiRequest("/auth/me", { token })
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("cineshelf-token");
        setToken(null);
        setUser(null);
        setWatchlist([]);
      });
    apiRequest("/watchlist", { token })
      .then((data) => setWatchlist(data.movies))
      .catch((error) => setNotice(error.message));
  }, [token]);

  const featured = movies.find((movie) => movie.featured) || movies[0];
  const savedIds = useMemo(() => new Set(watchlist.map((movie) => movie._id)), [watchlist]);
  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return movies;
    return movies.filter((movie) => movie.title.toLowerCase().includes(normalizedQuery)
      || movie.genres.some((genre) => genre.toLowerCase().includes(normalizedQuery)));
  }, [movies, query]);

  async function handleAuthenticate(credentials) {
    const endpoint = authMode === "register" ? "/auth/register" : "/auth/login";
    const data = await apiRequest(endpoint, { method: "POST", body: JSON.stringify(credentials) });
    localStorage.setItem("cineshelf-token", data.token);
    setToken(data.token);
    setUser(data.user);
    setAuthMode(null);
    setNotice(`Welcome${data.user.name ? `, ${data.user.name}` : ""}!`);
  }

  function handleSignOut() {
    localStorage.removeItem("cineshelf-token");
    setToken(null);
    setUser(null);
    setWatchlist([]);
    setPage("browse");
    setNotice("You have signed out.");
  }

  async function toggleWatchlist(movie) {
    if (!token) {
      setSelectedMovie(null);
      setAuthMode("login");
      setNotice("Sign in to keep a personal watchlist.");
      return;
    }
    try {
      const isSaved = savedIds.has(movie._id);
      const data = await apiRequest(`/watchlist/${movie._id}`, {
        token,
        method: isSaved ? "DELETE" : "POST",
      });
      setWatchlist(data.movies);
      setNotice(isSaved ? "Removed from My List." : "Added to My List.");
    } catch (error) {
      setNotice(error.message);
    }
  }

  function renderCard(movie) {
    return <MovieCard key={movie._id} movie={movie} saved={savedIds.has(movie._id)} onOpen={setSelectedMovie} onToggleSave={toggleWatchlist} />;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={() => setPage("browse")} aria-label="CineShelf home">
          <span className="brand-mark">C</span><span>CINESHELF</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={page === "browse" ? "nav-link nav-link--active" : "nav-link"} onClick={() => setPage("browse")}>Browse</button>
          <button className={page === "list" ? "nav-link nav-link--active" : "nav-link"} onClick={() => setPage("list")}>My List</button>
        </nav>
        <div className="topbar-actions">
          {page === "browse" && <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search movies" placeholder="Search titles or genres" value={query} onChange={(event) => setQuery(event.target.value)} /></label>}
          {user ? <><span className="user-name">Hi, {user.name.split(" ")[0]}</span><button className="button button-small button-secondary" onClick={handleSignOut}>Sign out</button></>
            : <button className="button button-small button-primary" onClick={() => setAuthMode("login")}>Sign in</button>}
        </div>
      </header>

      <main id="top">
        {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}

        {page === "browse" ? (
          <>
            {!query && featured && <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, #0b0b0f 0%, rgba(11,11,15,.88) 34%, rgba(11,11,15,.2) 76%), linear-gradient(0deg, #0b0b0f 0%, transparent 45%), url("${featured.backdrop}")` }}>
              <div className="hero-content">
                <p className="hero-kicker"><span className="hero-kicker-mark">C</span> FEATURED FILM</p>
                <h1>{featured.title}</h1>
                <div className="movie-facts"><span>{featured.year}</span><span>{featured.rating}</span><span>{featured.duration}</span></div>
                <p className="hero-description">{featured.description}</p>
                <div className="hero-actions">
                  <button className="button button-light" onClick={() => setSelectedMovie(featured)}>ⓘ &nbsp;More info</button>
                  <button className="button button-secondary" onClick={() => toggleWatchlist(featured)}>{savedIds.has(featured._id) ? "✓  In My List" : "+  My List"}</button>
                </div>
              </div>
              <div className="hero-index"><span>01</span> / {String(movies.length).padStart(2, "0")}</div>
            </section>}

            {catalogError ? <section className="empty-state"><div className="empty-icon">▣</div><h2>Let’s get your movie shelf ready</h2><p>{catalogError}</p><p className="setup-hint">Add your MongoDB connection to <code>server/.env</code>, then run <code>npm run seed --prefix server</code> to add the sample catalog.</p></section>
              : query ? <section className="catalog-section search-results"><div className="section-heading"><div><span className="section-kicker">FIND YOUR NEXT WATCH</span><h2>Search results</h2></div><span className="result-count">{searchResults.length} titles</span></div>{searchResults.length ? <div className="movie-grid">{searchResults.map(renderCard)}</div> : <p className="muted-copy">No titles found. Try a different search.</p>}</section>
                : <section className="catalog-section">
                  {movies.length === 0 ? <div className="empty-state"><h2>No movies found yet</h2><p>Add the sample catalog to MongoDB to get started.</p></div> : <>
                    <div className="section-heading"><div><span className="section-kicker">CURATED FOR YOUR NEXT MOVIE NIGHT</span><h2>Popular on CineShelf</h2></div><span className="result-count">{movies.length} titles</span></div>
                    <div className="movie-grid">{movies.map(renderCard)}</div>
                    {[...new Set(movies.flatMap((movie) => movie.genres))].map((genre) => {
                      const genreMovies = movies.filter((movie) => movie.genres.includes(genre));
                      return <div className="genre-row" key={genre}><div className="row-heading"><h3>{genre}</h3><span>{genreMovies.length} films</span></div><div className="movie-grid">{genreMovies.map(renderCard)}</div></div>;
                    })}
                  </>}
                </section>}
          </>
        ) : (
          <section className="catalog-section watchlist-page">
            <div className="section-heading"><div><span className="section-kicker">YOUR PERSONAL COLLECTION</span><h2>My List</h2></div><span className="result-count">{watchlist.length} saved</span></div>
            {!user ? <div className="empty-state"><div className="empty-icon">＋</div><h2>Your next movie, saved</h2><p>Sign in to build a watchlist that’s yours.</p><button className="button button-primary" onClick={() => setAuthMode("login")}>Sign in</button></div>
              : watchlist.length ? <div className="movie-grid">{watchlist.map(renderCard)}</div>
                : <div className="empty-state"><div className="empty-icon">＋</div><h2>Your list starts here</h2><p>Save a few movies and they’ll be waiting here for movie night.</p><button className="button button-secondary" onClick={() => setPage("browse")}>Explore movies</button></div>}
          </section>
        )}
      </main>

      <footer className="site-footer"><span className="footer-brand">CINESHELF</span><span>A small shelf for a big-screen mood.</span><span className={`footer-status footer-status--${apiStatus}`}><i />{apiStatus === "checking" ? "Checking services" : apiStatus === "connected" ? "Database connected" : apiStatus === "database" ? "API ready · database not connected" : "Server offline"}</span></footer>

      {authMode && <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} onSubmit={handleAuthenticate} />}
      <MovieDialog movie={selectedMovie} saved={selectedMovie ? savedIds.has(selectedMovie._id) : false} onClose={() => setSelectedMovie(null)} onToggleSave={toggleWatchlist} />
    </div>
  );
}

export default App;
