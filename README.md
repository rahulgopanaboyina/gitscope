# GitScope – GitHub Repository Explorer

GitScope is a GitHub repository discovery and analytics application that helps developers explore recently created repositories, discover popular projects, and understand repository activity through interactive charts.

## Live Demo

**Live Application:** [GitScope – GitHub Repository Explorer](https://gitscope-dun.vercel.app)

## Features

- **Repository Discovery:** Explore the most-starred GitHub repositories created within the last 7, 14, or 30 days.
- **Repository Details:** View repository name, description, star count, open issues, owner username, and profile avatar.
- **Search:** Find repositories using keywords.
- **Infinite Scrolling:** Load additional repositories as you scroll.
- **Repository Analytics:** View detailed activity information for individual repositories.
- **Weekly Activity Charts:** Visualize commit activity, additions, and deletions.
- **Contributor Analytics:** Explore contributor activity through interactive charts.
- **Interactive Charts:** Use chart tooltips and legends to explore repository statistics.

## Tech Stack

| Technology      | Purpose                                 |
| --------------- | --------------------------------------- |
| React           | Frontend development                    |
| Vite            | Development server and build tool       |
| Redux Toolkit   | State management                        |
| Redux Saga      | Asynchronous operations                 |
| React Router    | Application routing                     |
| Material UI     | UI components                           |
| Highcharts      | Interactive data visualization          |
| GitHub REST API | Repository and analytics data           |
| Vercel          | Deployment and serverless API functions |

## Project Structure

```text
gitscope/
├── api/
│   ├── github.js
│   ├── repositories.js
│   └── repository-stats.js
├── public/
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── features/
│   │   ├── analytics/
│   │   └── repositories/
│   ├── pages/
│   ├── services/
│   └── utils/
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- A GitHub Personal Access Token

### 1. Clone the repository

```bash
git clone https://github.com/rahulgopanaboyina/gitscope.git
```

### 2. Navigate to the project directory

```bash
cd gitscope
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root directory and add:

```env
GITHUB_TOKEN=your_github_personal_access_token
```

Replace the placeholder with your GitHub Personal Access Token.

**Important:** Never commit your `.env.local` file or expose your GitHub token in frontend code.

### 5. Run the application locally

```bash
npx vercel dev
```

This runs the application locally with its Vercel API functions.

## Available Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run lint`    | Run ESLint checks                     |
| `npm run build`   | Create a production build             |
| `npm run preview` | Preview the production frontend build |

## Deployment

GitScope is designed for deployment on Vercel.

1. Import the GitHub repository into Vercel.
2. Configure the `GITHUB_TOKEN` environment variable.
3. Deploy the application.
4. Access the deployed application using the generated Vercel URL.

## Author

**Rahul Gopanaboyina**

- GitHub: [rahulgopanaboyina](https://github.com/rahulgopanaboyina)

---

Developed as a GitHub repository discovery and analytics project.
