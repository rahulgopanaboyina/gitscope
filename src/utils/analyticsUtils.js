// Convert Unix timestamps into readable dates
export function formatWeekDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Prepare weekly commit activity
export function prepareCommitData(commitActivity) {
  if (!Array.isArray(commitActivity)) {
    return [];
  }

  return commitActivity.map((week) => ({
    date: formatWeekDate(week.week),
    timestamp: week.week * 1000,
    commits: week.total,
  }));
}

// Prepare weekly additions and deletions
export function prepareCodeFrequency(codeFrequency) {
  if (!Array.isArray(codeFrequency)) {
    return [];
  }

  return codeFrequency.map(([timestamp, additions, deletions]) => ({
    date: formatWeekDate(timestamp),
    timestamp: timestamp * 1000,
    additions,
    deletions: Math.abs(deletions),
  }));
}

// Prepare weekly activity for each contributor
export function prepareContributorData(contributors, metric) {
  if (!Array.isArray(contributors)) {
    return [];
  }

  return contributors.map((contributor) => ({
    name: contributor.author?.login || "Unknown contributor",

    avatar: contributor.author?.avatar_url || "",

    total: contributor.total,

    weeklyActivity: (Array.isArray(contributor.weeks)
      ? contributor.weeks
      : []
    ).map((week) => ({
      timestamp: week.w * 1000,

      date: formatWeekDate(week.w),

      additions: week.a,

      deletions: Math.abs(week.d),

      commits: week.c,
    })),

    metric,
  }));
}
