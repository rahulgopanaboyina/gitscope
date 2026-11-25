import { Link } from "react-router-dom";

function RepositoryCard({ repository, rank }) {
  const {
    name,
    full_name,
    description,
    stargazers_count,
    open_issues_count,
    language,
    owner,
  } = repository;

  const formatNumber = (number) =>
    new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(number ?? 0);

  return (
    <article className="repository-card">
      <div className="repository-card-top">
        <span className="repository-rank">#{rank}</span>

        <span className="repository-stars">
          ★ {formatNumber(stargazers_count)}
        </span>
      </div>

      <div className="repository-owner">
        <img
          src={owner.avatar_url}
          alt={`${owner.login}'s avatar`}
          className="owner-avatar"
        />

        <span>{owner.login}</span>
      </div>

      <h3 className="repository-name">
        <Link to={`/repository/${owner.login}/${name}`}>{full_name}</Link>
      </h3>

      <p className="repository-description">
        {description || "No description provided."}
      </p>

      <div className="repository-card-bottom">
        <span className="repository-language">
          <span className="language-dot"></span>
          {language || "Not specified"}
        </span>

        <span className="repository-issues">
          Open issues: {formatNumber(open_issues_count)}
        </span>
      </div>

      <Link
        to={`/repository/${owner.login}/${name}`}
        className="repository-details-link"
      >
        View analytics <span>→</span>
      </Link>
    </article>
  );
}

export default RepositoryCard;
