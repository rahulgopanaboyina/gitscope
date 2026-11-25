
const GITHUB_API_URL = "https://api.github.com";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function githubRequest(endpoint) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GitHub token is not configured.");
  }

  let response;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      break;
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) {
        console.error("GitHub network request failed:", {
          endpoint,
          attempts: attempt,
          message: error.message,
          cause: error.cause
            ? {
                message: error.cause.message,
                code: error.cause.code,
              }
            : null,
        });

        const networkError = new Error(
          "Unable to connect to GitHub after multiple attempts. Please try again.",
        );

        networkError.status = 502;
        throw networkError;
      }

      console.warn(`GitHub connection attempt ${attempt} failed. Retrying...`);

      await wait(RETRY_DELAY);
    }
  }

  const data = await response.json();

  // Preserve GitHub's 202 response for statistics requests
  if (response.status === 202) {
    const error = new Error(
      data.message || "GitHub is generating repository statistics.",
    );

    error.status = 202;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data.message || "GitHub API request failed.");

    error.status = response.status;
    throw error;
  }

  return data;
}
