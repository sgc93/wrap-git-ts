import { throwError, throwGitError } from "../utils/error.js";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (token) headers.Authorization = `bearer ${token}`;

  try {
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify({ query, variables })
    });

    if (!res.ok) {
      const message = `GitHub API returned status ${res.status}`;
      throw throwGitError(res.status, message);
    }

    const json = await res.json();

    if (json.errors) {
      throw throwGitError(400, JSON.stringify(json.errors));
    }

    return json.data;
  } catch (error: any) {
    throw throwError(error.message);
  }
}
