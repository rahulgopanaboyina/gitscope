import { lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";

import RepositoryPage from "./pages/RepositoryPage";

import "./App.css";

// Load analytics page only when required
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));

function App() {
  return (
    <div className="app">
      {/* Navigation */}
      <header className="navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">G</span>
          <span>GitScope</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Explore</Link>
          <a href="#about">About</a>
        </nav>

        <div className="nav-status">
          <span className="status-dot"></span>
          GitHub API
        </div>
      </header>

      {/* Page Routing */}
      <Routes>
        <Route path="/" element={<RepositoryPage />} />

        <Route
          path="/repository/:owner/:repo"
          element={
            <Suspense
              fallback={
                <div className="empty-state">
                  <h3>Loading analytics page...</h3>
                  <p>Please wait while we prepare your charts.</p>
                </div>
              }
            >
              <AnalyticsPage />
            </Suspense>
          }
        />
      </Routes>

      {/* Footer */}
      <footer className="footer">
        <span>GitScope</span>
        <span>Built for developers, powered by GitHub.</span>
      </footer>
    </div>
  );
}

export default App;
