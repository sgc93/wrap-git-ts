// export { getUserProfile } from "./api/profile";
// export { commitSummerizer } from "./core/commitSummerizer";
// export { repoSummerizer } from "./core/repoSummerizer";

export function helloWorld() {
  const message = "Hello World from my example modern npm package!";
  return message;
}

export function goodBye() {
  const message = "Goodbye from my example modern npm package!";
  return message;
}

export default {
  helloWorld,
  goodBye
};
