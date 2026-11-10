/**
 * The institute's configuration as set by the super admin: which member
 * features are on, and how the public website is laid out. Everything
 * defaults to "on" while loading or if the request fails, so a slow or
 * failed call never hides the app.
 */
import { useQuery } from "react-query";
import { getInstituteConfig } from "src/api";
import { PATHS } from "./nav";

export function useInstituteConfig() {
  const q = useQuery("instituteConfig", getInstituteConfig, { staleTime: 60_000, retry: false, refetchOnWindowFocus: false });
  const features = q.data?.features || {};
  return {
    ...q,
    config: q.data,
    on: (feature) => (feature ? features[feature] !== false : true),
    website: q.data?.website,
    signupMode: q.data?.signup_mode || "open",
  };
}

/** member pages that belong to a switchable feature */
export const FEATURE_FOR_PATH = {
  [PATHS.messages]: "chat",
  [PATHS.jobs]: "jobs",
  [PATHS.events]: "events",
  [PATHS.news]: "news",
  [PATHS.groups]: "groups",
  [PATHS.mentorship]: "mentorship",
  [PATHS.documents]: "documents",
  [PATHS.career]: "career",
};
export function featureForPath(pathname) {
  const base = Object.keys(FEATURE_FOR_PATH).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  return base ? FEATURE_FOR_PATH[base] : null;
}
