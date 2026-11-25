const API_BASE_URL = "/api";
// Cache GitHub analytics requests
const statsCache = new Map();

// Calculate the date based on the selected period
export function getStartDate(period) {
  const date = new Date();

  date.setDate(date.getDate() - Number(period));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Fetch repositories from GitHub

export async function fetchRepositories({
  period = 7,
  page = 1,
  perPage = 20,
}) {
  const params = new URLSearchParams({
    period: String(period),
    page: String(page),
    perPage: String(perPage),
  });

  const response = await fetch(
    `${API_BASE_URL}/repositories?${params.toString()}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Repository search failed: ${response.status}`,
    );
  }

  return {
    repositories: data.repositories,
    totalCount: data.totalCount,
  };
}

// Fetch and cache GitHub statistics

async function fetchGitHubStats(owner, repo, type, attempts = 3) {
  const params = new URLSearchParams({
    owner,
    repo,
    type,
  });

  const url = `${API_BASE_URL}/repository-stats?${params.toString()}`;

  if (statsCache.has(url)) {
    return statsCache.get(url);
  }

  const requestPromise = (async () => {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const response = await fetch(url);

      if (response.status === 202) {
        if (attempt === attempts) {
          return null;
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        continue;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `GitHub statistics request failed: ${response.status}`,
        );
      }

      return data;
    }

    return null;
  })();

  statsCache.set(url, requestPromise);

  try {
    const data = await requestPromise;

    if (data === null) {
      setTimeout(() => {
        if (statsCache.get(url) === requestPromise) {
          statsCache.delete(url);
        }
      }, 60_000);
    }

    return data;
  } catch (error) {
    statsCache.delete(url);
    throw error;
  }
}

// Fetch weekly code frequency
export async function fetchCodeFrequency(owner, repo) {
  return fetchGitHubStats(owner, repo, "code_frequency");
}

// Fetch weekly commit activity
export async function fetchCommitActivity(owner, repo) {
  return fetchGitHubStats(owner, repo, "commit_activity");
}

// Fetch contributor statistics
export async function fetchContributors(owner, repo) {
  return fetchGitHubStats(owner, repo, "contributors");
}
