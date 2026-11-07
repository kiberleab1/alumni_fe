/**
 * Member-area URLs. Every page has its own address under /user, so refresh,
 * the back button and shared links all work.
 */
export const PATHS = {
  home: "/user",
  people: "/user/people",
  messages: "/user/messages",
  jobs: "/user/jobs",
  events: "/user/events",
  news: "/user/news",
  groups: "/user/groups",
  mentorship: "/user/mentorship",
  documents: "/user/documents",
  profile: "/user/profile",
  career: "/user/career",
  notifications: "/user/notifications",
  settings: "/user/settings",
  welcome: "/user/welcome",
};

export const eventPath = (id) => `${PATHS.events}/${id}`;
export const newsPath = (id) => `${PATHS.news}/${id}`;
export const groupPath = (id) => `${PATHS.groups}/${id}`;
export const jobPath = (id) => `${PATHS.jobs}?job=${id}`;
export const chatPath = (userId) => (userId ? `${PATHS.messages}?with=${userId}` : PATHS.messages);
/** a member's profile; your own id opens your own profile */
export const profilePath = (userId) => (userId ? `${PATHS.people}/${userId}` : PATHS.profile);
export const peoplePath = (tab) => (tab ? `${PATHS.people}?tab=${tab}` : PATHS.people);

/** Where clicking a notification should take the member. */
export function notificationTarget(n) {
  const t = n?.type || "";
  if (t === "connection_request") return peoplePath("incoming");
  if (t === "connection_accepted") return n.actor?.id ? chatPath(n.actor.id) : PATHS.messages;
  if (t === "event_cancelled") return PATHS.events;
  if (t.startsWith("event_") && n.entity_id) return eventPath(n.entity_id);
  if (t === "mentorship_request") return `${PATHS.mentorship}?tab=requests`;
  if (t.startsWith("mentorship_")) return `${PATHS.mentorship}?tab=mine`;
  if (t.startsWith("group_") && n.entity_id) return groupPath(n.entity_id);
  if (t === "document_status") return PATHS.documents;
  if (t === "message_request") return n.actor?.id ? chatPath(n.actor.id) : PATHS.messages;
  return PATHS.notifications;
}
