import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import RepositoryCard from "../components/RepositoryCard";

import {
  fetchRepositoriesRequest,
  loadMoreRepositoriesRequest,
  setSearchTerm,
  setSelectedPeriod,
} from "../features/repositories/repositorySlice";

function RepositoryPage() {
  const loadMoreRef = useRef(null);
  const hasTriggeredRef = useRef(false);
  const lastFetchedPeriodRef = useRef(null);
  const dispatch = useDispatch();

  const {
    searchTerm,
    selectedPeriod,
    repositories,
    totalCount,
    loading,
    error,
    currentPage,
    hasMore,
  } = useSelector((state) => state.repositories);

  // Filter repositories based on the search term
  const filteredRepositories = repositories.filter((repository) => {
    const search = searchTerm.toLowerCase();

    return (
      repository.name.toLowerCase().includes(search) ||
      repository.full_name.toLowerCase().includes(search) ||
      (repository.description || "").toLowerCase().includes(search) ||
      repository.owner.login.toLowerCase().includes(search)
    );
  });

  // Fetch repositories when the page loads
  // or when the selected period changes
  useEffect(() => {
    if (lastFetchedPeriodRef.current === selectedPeriod) {
      return;
    }

    lastFetchedPeriodRef.current = selectedPeriod;

    dispatch(
      fetchRepositoriesRequest({
        period: selectedPeriod,
        page: 1,
      }),
    );
  }, [dispatch, selectedPeriod]);

  // Reset the pagination guard after a successful page load
  useEffect(() => {
    hasTriggeredRef.current = false;
  }, [currentPage]);

  // Observe the bottom of the repository list
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry.isIntersecting) {
          hasTriggeredRef.current = false;
          return;
        }

        if (
          hasMore &&
          !loading &&
          !error &&
          !searchTerm.trim() &&
          !hasTriggeredRef.current
        ) {
          hasTriggeredRef.current = true;

          dispatch(
            loadMoreRepositoriesRequest({
              period: selectedPeriod,
              page: currentPage + 1,
            }),
          );
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    const currentElement = loadMoreRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [
    dispatch,
    selectedPeriod,
    currentPage,
    hasMore,
    loading,
    error,
    searchTerm,
  ]);

  return (
    <main className="repository-page">
      {/* Hero Section */}
      <section className="hero" id="about">
        <div className="hero-badge">
          <span className="status-dot"></span>
          DEVELOPER DISCOVERY PLATFORM
        </div>

        <h1>
          Discover what's
          <br />
          <span>trending on GitHub.</span>
        </h1>

        <p className="hero-description">
          Explore popular open-source repositories, discover innovative
          projects, and analyze developer activity across GitHub.
        </p>

        <a href="#explore" className="hero-button">
          Explore repositories <span>→</span>
        </a>
      </section>

      {/* Repository Explorer */}
      <section className="explore-section" id="explore">
        <div className="section-heading">
          <div>
            <span className="section-label">DISCOVER PROJECTS</span>

            <h2>Trending repositories</h2>

            <p>
              Explore the most popular projects from the open-source community.
            </p>
          </div>
        </div>

        {/* Discovery Toolbar */}
        <div className="discovery-toolbar">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(event) => dispatch(setSearchTerm(event.target.value))}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="period-filter">Created within</label>

            <select
              id="period-filter"
              value={selectedPeriod}
              onChange={(event) =>
                dispatch(setSelectedPeriod(event.target.value))
              }
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>

          <div className="sort-indicator">
            <span>★</span> Most starred
          </div>
        </div>

        {repositories.length > 0 && (
          <div className="results-info">
            <span>
              Showing {filteredRepositories.length} of{" "}
              {totalCount.toLocaleString()} repositories
            </span>

            <span>Sorted by stars</span>
          </div>
        )}

        {/* Repository Results */}
        {loading && repositories.length === 0 && (
          <div className="empty-state">
            <CircularProgress size={32} sx={{ color: "#22d3ee" }} />
            <h3>Discovering repositories...</h3>
            <p>Fetching trending projects from GitHub.</p>
          </div>
        )}

        {error && (
          <div className="empty-state">
            <h3>Unable to load repositories</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredRepositories.length === 0 && (
          <div className="empty-state">
            <h3>
              {searchTerm
                ? "No matching repositories found."
                : "No repositories found."}
            </h3>

            <p>
              {searchTerm
                ? "Try searching with a different keyword."
                : "Try selecting a different time period."}
            </p>
          </div>
        )}

        {filteredRepositories.length > 0 && (
          <div className="repository-grid">
            {filteredRepositories.map((repository) => (
              <RepositoryCard
                key={repository.id}
                repository={repository}
                rank={
                  repositories.findIndex((item) => item.id === repository.id) +
                  1
                }
              />
            ))}
          </div>
        )}

        {loading && repositories.length > 0 && (
          <div className="loading-more">
            <CircularProgress size={24} sx={{ color: "#22d3ee" }} />
            <span>Loading more repositories...</span>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loadMoreRef} className="scroll-trigger"></div>
      </section>
    </main>
  );
}

export default RepositoryPage;
