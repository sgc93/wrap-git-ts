import { getUserProfile } from "./api/profile";
import { commitSummerizer } from "./core/commitSummerizer";
import { repoSummerizer } from "./core/repoSummerizer";
import { ProfileType } from "./types/ProfileType";

// async function gitWrapped(username: string, token?: string) {
//   const profile: {success: boolean, profile: ProfileType} = await getUserProfile(username, token);
  
//   if (profileData.success) {
//     return {
//       success: true,
//       profile: profileData.profile,
//       methods: {
//         commitSummerizer,
//         // issueSummerizer,
//         // getOrgs,
//         // recentActivities,
//         // pullRequestSummerizer,
//         // lngSummerizer,
//         repoSummerizer
//       }
//     };
//   } else {
//     return { ...profileData.profile };
//   }
// }

export = {

  commitSummerizer,
  getUserProfile,
  // issueSummerizer,
  // getOrgs,
  // recentActivities,
  // pullRequestSummerizer,
  // lngSummerizer,
  repoSummerizer,
  // getAllRepos
};
