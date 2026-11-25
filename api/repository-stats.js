import { githubRequest } from "./github.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed.",
    });
  }

  try {
    const { owner, repo, type } = req.query;

    const allowedTypes = ["code_frequency", "commit_activity", "contributors"];

    if (!owner || !repo || !allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid repository statistics parameters.",
      });
    }

    const data = await githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/stats/${type}`,
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Repository statistics request failed.",
    });
  }
}
