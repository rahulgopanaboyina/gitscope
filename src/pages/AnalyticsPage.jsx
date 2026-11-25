import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { lazy, Suspense, useEffect } from "react";

import {
  fetchAnalyticsRequest,
  resetAnalytics,
  setSelectedMetric,
} from "../features/analytics/analyticsSlice";

import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const WeeklyActivityChart = lazy(
  () => import("../components/WeeklyActivityChart"),
);

const ContributorActivityChart = lazy(
  () => import("../components/ContributorActivityChart"),
);

function AnalyticsPage() {
  const { owner, repo } = useParams();

  const dispatch = useDispatch();

  const {
    codeFrequency,
    commitActivity,
    contributors,
    selectedMetric,
    loading,
    error,
    codeFrequencyLoading,
    commitActivityLoading,
    contributorsLoading,
    codeFrequencyUnavailable,
    commitActivityUnavailable,
    contributorsUnavailable,
    codeFrequencyError,
    commitActivityError,
    contributorsError,
  } = useSelector((state) => state.analytics);

  const weeklyActivityLoading =
    selectedMetric === "commits" ? commitActivityLoading : codeFrequencyLoading;

  const weeklyActivityUnavailable =
    selectedMetric === "commits"
      ? commitActivityUnavailable
      : codeFrequencyUnavailable;

  const weeklyActivityError =
    selectedMetric === "commits" ? commitActivityError : codeFrequencyError;

  const hasWeeklyActivity =
    selectedMetric === "commits"
      ? commitActivity.length > 0
      : codeFrequency.length > 0;

  // Reset analytics and fetch data when a repository is opened
  useEffect(() => {
    dispatch(resetAnalytics());

    dispatch(
      fetchAnalyticsRequest({
        owner,
        repo,
      }),
    );
  }, [dispatch, owner, repo]);

  return (
    <main className="analytics-page">
      {/* Breadcrumb Navigation */}
      <div className="analytics-breadcrumb">
        <Link to="/">Explore</Link>
        <span>/</span>
        <span>{owner}</span>
        <span>/</span>
        <span>{repo}</span>
      </div>

      {/* Repository Header */}
      <section className="analytics-header">
        <span className="section-label">REPOSITORY ANALYTICS</span>
        <h1>{repo}</h1>
        <p>
          Owned by <span>{owner}</span>
        </p>
        <a
          href={`https://github.com/${owner}/${repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-repository-link"
        >
          View on GitHub ↗
        </a>
      </section>

      {/* Analytics Metric Selector */}
      <section className="analytics-controls">
        <div>
          <span className="section-label">ACTIVITY METRICS</span>
          <h2>Repository activity</h2>
          <p>Select a metric to explore weekly activity.</p>
        </div>

        <div className="metric-selector">
          <FormControl fullWidth size="small">
            <InputLabel id="metric-filter-label">Select metric</InputLabel>

            <Select
              labelId="metric-filter-label"
              id="metric-filter"
              sx={{
                "& .MuiSelect-select": {
                  color: "#ffffff !important",
                  WebkitTextFillColor: "#ffffff",
                },
                "& .MuiSelect-icon": {
                  color: "#94a3b8",
                },
              }}
              value={selectedMetric}
              label="Select metric"
              onChange={(event) =>
                dispatch(setSelectedMetric(event.target.value))
              }
            >
              <MenuItem value="commits">Commits</MenuItem>
              <MenuItem value="additions">Additions</MenuItem>
              <MenuItem value="deletions">Deletions</MenuItem>
            </Select>
          </FormControl>
        </div>
      </section>

      {/* Weekly Activity Chart */}
      {weeklyActivityLoading && (
        <div className="empty-state">
          <CircularProgress size={32} sx={{ color: "#22d3ee" }} />
          <h3>Loading weekly activity...</h3>
        </div>
      )}

      {!weeklyActivityLoading &&
        !error &&
        !weeklyActivityError &&
        !weeklyActivityUnavailable &&
        hasWeeklyActivity && (
          <section className="analytics-chart-section">
            <div className="chart-heading">
              <h2>Weekly activity overview</h2>
              <p>
                Track repository activity over time based on your selected
                metric.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="empty-state">
                  <p>Loading weekly activity chart...</p>
                </div>
              }
            >
              <WeeklyActivityChart
                selectedMetric={selectedMetric}
                commitActivity={commitActivity}
                codeFrequency={codeFrequency}
              />
            </Suspense>
          </section>
        )}

      {!weeklyActivityLoading && weeklyActivityUnavailable && (
        <div className="empty-state">
          <h3>Weekly activity temporarily unavailable</h3>
          <p>
            GitHub is still generating the statistics for this repository.
            Please try again later.
          </p>
        </div>
      )}

      {!weeklyActivityLoading && weeklyActivityError && (
        <div className="empty-state">
          <h3>Unable to load weekly activity</h3>
          <p>{weeklyActivityError}</p>
        </div>
      )}

      {/* Contributor Activity Chart */}
      {contributorsLoading && (
        <div className="empty-state">
          <CircularProgress size={32} sx={{ color: "#22d3ee" }} />
          <h3>Loading contributor activity...</h3>
        </div>
      )}

      {!contributorsLoading &&
        !error &&
        !contributorsError &&
        !contributorsUnavailable &&
        contributors.length > 0 && (
          <section className="analytics-chart-section">
            <div className="chart-heading">
              <h2>Contributor activity breakdown</h2>
              <p>
                Compare weekly contributions from individual repository
                contributors.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="empty-state">
                  <p>Loading contributor activity chart...</p>
                </div>
              }
            >
              <ContributorActivityChart
                contributors={contributors}
                selectedMetric={selectedMetric}
              />
            </Suspense>
          </section>
        )}

      {!contributorsLoading && contributorsUnavailable && (
        <div className="empty-state">
          <h3>Contributor activity temporarily unavailable</h3>
          <p>
            GitHub is still generating contributor statistics. Please try again
            later.
          </p>
        </div>
      )}

      {!contributorsLoading && contributorsError && (
        <div className="empty-state">
          <h3>Unable to load contributor activity</h3>
          <p>{contributorsError}</p>
        </div>
      )}

      {/* Analytics Error State */}
      {error && (
        <div className="empty-state">
          <h3>Unable to load analytics</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        !weeklyActivityLoading &&
        !contributorsLoading &&
        !weeklyActivityUnavailable &&
        !contributorsUnavailable &&
        !weeklyActivityError &&
        !contributorsError &&
        !hasWeeklyActivity &&
        contributors.length === 0 && (
          <div className="empty-state">
            <h3>No analytics data available</h3>
            <p>GitHub has not provided repository activity statistics.</p>
          </div>
        )}
    </main>
  );
}

export default AnalyticsPage;
