const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  token?: string
): Promise<T> {
  const headers = token
    ? {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      }
    : {
        "Content-Type": "application/json"
      };

  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify({ query, variables })
  });
  
  const json = await res.json();
  console.log(json)
  if (json.errors){
   const error =  JSON.stringify(json.errors, null, 2);
   console.log(json.errors)
  }
  return json.data;
}
