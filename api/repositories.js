import { githubRequest } from "./github.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed.",
    });
  }

  try {
    const { period = "7", page = "1", perPage = "20" } = req.query;

    const validPeriods = ["7", "14", "30"];

    if (
      !validPeriods.includes(String(period)) ||
      !Number.isInteger(Number(page)) ||
      Number(page) < 1 ||
      !Number.isInteger(Number(perPage)) ||
      Number(perPage) < 1 ||
      Number(perPage) > 100
    ) {
      return res.status(400).json({
        message: "Invalid repository search parameters.",
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(period));

    const formattedDate = startDate.toISOString().split("T")[0];

    const params = new URLSearchParams({
      q: `created:>${formattedDate}`,
      sort: "stars",
      order: "desc",
      page: String(page),
      per_page: String(perPage),
    });

    const data = await githubRequest(
      `/search/repositories?${params.toString()}`,
    );

    return res.status(200).json({
      repositories: data.items,
      totalCount: data.total_count,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Repository search failed.",
    });
  }
}
