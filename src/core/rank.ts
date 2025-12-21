/**
 * Exponential Cumulative Distribution Functions:- Calculates the exponential cdf.
 *
 * Behavior: It rises very quickly at first but slows down as it approaches 1.
 *
 * Purpose: It rewards consistency.
 *
 * Usage: Used for Commits, PRs, and Issues.
 */
function exponential_cdf(x: number) {
  return 1 - 2 ** -x;
}

// /**
//  * Log Normal Cumulative Distribution Functions:- Calculates the log normal cdf.
//  *
//  * Behavior: It rises much more slowly and has a "heavy tail."
//  *
//  * Purpose: It rewards rarity and high impact.
//  *
//  * Usage: Used for Stars and Followers.
//  */
function log_normal_cdf(x: number) {
  // approximation
  return x / (1 + x);
}

const getRankIdentity = (
  level: string
): {
  label: string;
  context: string;
} => {
  const identities: Record<
    string,
    {
      label: string;
      context: string;
    }
  > = {
    S: {
      label: "Core Maintainer",
      context:
        "Your code is a cornerstone of the ecosystem. You aren't just using the web; you're building it."
    },
    "A+": {
      label: "Elite Architect",
      context:
        "Your output was world-class. You've mastered the balance of quality and community impact."
    },
    A: {
      label: "Senior Contributor",
      context:
        "You are a pillar of your projects. Your reviews and features set the standard for others."
    },
    "A-": {
      label: "Production Ready",
      context:
        "You became a force to be reckoned with. Your workflow is polished."
    },
    "B+": {
      label: "Active Committer",
      context:
        "You have serious momentum. Your consistency has placed you ahead of the curve."
    },
    B: {
      label: "Solid Mid-Level",
      context:
        "You’re out-performing the global average. You have the grit to ship meaningful code."
    },
    "B-": {
      label: "Rising Talent",
      context:
        "You’ve moved past the basics. you have already started building a real legacy."
    },
    "C+": {
      label: "Growth Phase",
      context:
        "The foundation is laid. You’ve proven you can ship; now it’s time to scale in the next few months."
    },
    C: {
      label: "Open Source Explorer",
      context:
        "You’ve officially put yourself on the map! Every elite career starts with these first PRs."
    }
  };

  return (
    identities[level] || {
      label: "Developer",
      context: "You're writing history, one commit at a time. Keep building!"
    }
  );
};

export const calculateGitHubRank = (
  stats: {
    commits: number;
    prs: number;
    issues: number;
    reviews: number;
    stars: number;
    followers: number;
  },
  createdAt?: string
) => {
  const yearsActive = createdAt ?
    (new Date().getTime() - new Date(createdAt).getTime()) /
    (1000 * 60 * 60 * 24 * 365) : 0;

  const years = Math.max(1, yearsActive);

  // Medians based on GitHub activity benchmarks
  const COMMITS_MEDIAN = 250 * years;
  const STARS_MEDIAN = 50;
  const PRS_MEDIAN = 50 * years;
  const ISSUES_MEDIAN = 25 * years;
  const FOLLOWERS_MEDIAN = 10;
  const REVIEWS_MEDIAN = 5 * years;

  const STARS_WEIGHT = 4;
  const PRS_WEIGHT = 3;
  const COMMITS_WEIGHT = 2;
  const ISSUES_WEIGHT = 1;
  const REVIEWS_WEIGHT = 1;
  const FOLLOWERS_WEIGHT = 1;

  const TOTAL_WEIGHT = 12;

  // Calculate normalized rank (0 to 1)
  const rank =
    1 -
    (COMMITS_WEIGHT * exponential_cdf(stats.commits / COMMITS_MEDIAN) +
      PRS_WEIGHT * exponential_cdf(stats.prs / PRS_MEDIAN) +
      ISSUES_WEIGHT * exponential_cdf(stats.issues / ISSUES_MEDIAN) +
      REVIEWS_WEIGHT * exponential_cdf(stats.reviews / REVIEWS_MEDIAN) +
      STARS_WEIGHT * log_normal_cdf(stats.stars / STARS_MEDIAN) +
      FOLLOWERS_WEIGHT * log_normal_cdf(stats.followers / FOLLOWERS_MEDIAN)) /
      TOTAL_WEIGHT;

  const percentile = rank * 100;

  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const LEVELS = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"];

  const levelIndex = THRESHOLDS.findIndex((t) => percentile <= t);
  const level = LEVELS[levelIndex !== -1 ? levelIndex : LEVELS.length - 1];

  const { label, context } = getRankIdentity(level);

  return {
    level,
    label,
    context,
    percentile: percentile.toFixed(2)
  };
};
