
export const getGitHubRecap = async (
  username: string,
  year: number,
  token: string
) => {
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  // contributions days -> green graph
  // total contributions
  // longest streak
  // effective day + active days from 365 days
  // effective month
  // top language

};
