# Wrap-Git

wrap-git is a powerful Node.js package that provides an easy way to interact with the GitHub API, `supporting both JavaScript and TypeScript`.  
It wraps various endpoints and operations, enabling developers to access and summarize GitHub data with minimal effort.  
This package simplifies data retrieval and analysis from GitHub, making it an excellent choice for integrating GitHub functionalities into your applications.

## Features

- Fetch user profiles and filter screen data.
- Fetch and filter `commits`, `repositories`, `contributions` and `languages` coverages.
- Analyze commits and contributions per each year.
- Analyze repos — tops, star counts, and details.
- Analyze language coverage including repo count, top languages, and percentages.
- Calcuate longest sreak, effective day and effective month

## Installation

Install the package using npm:

```bash
npm install wrap-git
```
or with yarn:

```bash
yarn add wrap-git
```

## Usage
You can use the package by importing individual methods or use the default export.

### Option A — Named imports
```ts
  import { getGitHubUser, getGitHubCommits, getGitHubContributions, getGitHubContributionTypesPerYear, getGitHubLanguages, getGitHubRepos, getGitHubPinnedRepos } from "wrap-git";


  const userProfile = await getGitHubUser('sgc93', token);  // don't forget to handle errors
```

### Option B — Default import
```ts
  import wrapGit from "wrap-git";

  const { getGitHubUser, getGitHubCommits, getGitHubContributions, getGitHubContributionTypesPerYear, getGitHubLanguages, getGitHubRepos, getGitHubPinnedRepos } = wrapGit;

  const userProfile = await getGitHubUser('sgc93', token);  // don't forget to handle errors
```

## Contributing

We welcome contributions! Feel free to submit issues or create pull requests.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details

## Author

Developed and maintained by [smachew G.](https://github.com/sgc93).
Built with ❤️ using Node.js and TypeScript.
