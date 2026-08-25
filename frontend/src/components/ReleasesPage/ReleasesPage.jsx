import React, { useEffect, useState } from "react";
import { releasesStyles } from "../../assets/dummyStyles";

const API_BASE = "http://localhost:5000";
const PLACEHOLDER_IMG = "https://via.placeholder.com/400x600?text=No+Image";

const normalizeApiBase = (base) => base.replace(/\/+$/, "");

const getUploadUrl = (maybeFilenameOrUrl) => {
  if (!maybeFilenameOrUrl || typeof maybeFilenameOrUrl !== "string") return null;

  const apiBase = normalizeApiBase(API_BASE);

  if (/^https?:\/\//i.test(maybeFilenameOrUrl)) {
    try {
      const parsed = new URL(maybeFilenameOrUrl);
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        const parts = maybeFilenameOrUrl.split("/uploads/");
        const filename = parts.length > 1 ? parts.pop() : parsed.pathname.split("/").pop();
        return `${apiBase}/uploads/${filename}`;
      }
      return maybeFilenameOrUrl;
    } catch (e) {
    }
  }

  if (maybeFilenameOrUrl.startsWith("/")) {
    return `${apiBase}/${maybeFilenameOrUrl.replace(/^\/+/, "")}`;
  }

  return `${apiBase}/uploads/${maybeFilenameOrUrl.replace(/^uploads\//, "")}`;
};

const mapBackendMovieToUi = (m) => {
  const poster =
    m.poster || (m.latestTrailer && m.latestTrailer.thumbnail) || null;
  const image = getUploadUrl(poster) || PLACEHOLDER_IMG;

  const category =
    (Array.isArray(m.categories) && m.categories.join(", ")) ||
    (m.latestTrailer &&
      Array.isArray(m.latestTrailer.genres) &&
      m.latestTrailer.genres.join(", ")) ||
    "";

  return {
    id: m._id || m.id,
    title:
      m.movieName ||
      m.title ||
      (m.latestTrailer && m.latestTrailer.title) ||
      "Untitled",
    image,
    category,
    raw: m,
  };
};

const ReleasesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE}/api/movies?type=releaseSoon&limit=100`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const items = Array.isArray(json.items)
          ? json.items
          : Array.isArray(json.data)
          ? json.data
          : [];
        const mapped = (items || []).map(mapBackendMovieToUi);
        if (!cancelled) setMovies(mapped);
      } catch (err) {
        console.error("Failed to load release movies", err);
        if (!cancelled) setError("Failed to load releases");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={releasesStyles.pageContainer}>
      <div className={releasesStyles.headerContainer}>
        <h1 className={releasesStyles.headerTitle}>RELEASES SOON</h1>
        <p className={releasesStyles.headerSubtitle}>
          Latest Movies • Now Showing
        </p>
      </div>

      {loading ? (
        <div style={{ padding: 32, textAlign: "center", color: "#999" }}>
          Loading releases…
        </div>
      ) : error ? (
        <div style={{ padding: 32, textAlign: "center", color: "red" }}>
          {error}
        </div>
      ) : movies.length === 0 ? (
        <div style={{ padding: 32, textAlign: "center", color: "#777" }}>
          No upcoming releases found.
        </div>
      ) : (
        <div className={releasesStyles.movieGrid}>
          {movies.map((movie) => (
            <div key={movie.id} className={releasesStyles.movieCard}>
              <div className={releasesStyles.imageContainer}>
                <img
                  src={movie.image}
                  alt={movie.title}
                  className={releasesStyles.movieImage}
                  loading="lazy"
                />
              </div>

              <div className={releasesStyles.movieInfo}>
                <h3 className={releasesStyles.movieTitle}>{movie.title}</h3>
                <p className={releasesStyles.movieCategory}>{movie.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReleasesPage;