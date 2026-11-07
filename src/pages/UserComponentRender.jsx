/**
 * Member-area routes (mounted under /user/* by App.jsx).
 *
 * Older pages were written for the previous state-based navigation and take
 * callback props (onEventsDetailClick, navParams…). The small adapters below
 * translate those into URLs, so every page has an address and survives a
 * refresh.
 */
import { Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PATHS, chatPath, eventPath } from "src/lib/nav";

import HomePage from "./user/home/HomePage";
import PeoplePage from "./user/people/PeoplePage";
import ChatUi from "./user/chatConnections/Chat";
import JobsBoard from "./user/jobs/JobsBoard";
import EventsPage from "./user/events/EventsPage";
import EventDetailPage from "./user/events/EventDetailPage";
import NewsPage from "./user/news/NewsPage";
import NewsArticle from "./user/news/NewsArticle";
import GroupsPage from "./user/groups/GroupsPage";
import GroupDetail from "./user/groups/GroupDetail";
import MentorshipPage from "./user/mentorship/MentorshipPage";
import DocumentsPage from "./user/documents/DocumentsPage";
import ProfilePage from "./user/profile/ProfilePage";
import OnboardingPage from "./user/profile/OnboardingPage";
import CareerPage from "./user/career/CareerPage";
import NotificationsPage from "./user/notifications/NotificationsPage";
import SettingsPage from "./user/settings/SettingsPage";

function Messages() {
  const [params] = useSearchParams();
  const { state } = useLocation();
  const peerId = params.get("with");
  const chat = state?.peer ? { peer: state.peer } : peerId ? { peer: { id: peerId, name: state?.name || "Member" } } : null;
  return <ChatUi chat={chat} />;
}

function Events() {
  const navigate = useNavigate();
  return <EventsPage onEventsDetailClick={(event) => navigate(eventPath(event.id), { state: { event } })} />;
}

function EventDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  return <EventDetailPage key={id} event={state?.event?.id === id ? state.event : null} navParams={{ eventId: id }} onBackToEvents={() => navigate(PATHS.events)} />;
}

function Settings() {
  const [params] = useSearchParams();
  return <SettingsPage navParams={params.get("tab") ? { tab: params.get("tab") } : null} />;
}


export default function MemberRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="people" element={<PeoplePage />} />
      <Route path="people/:userId" element={<ProfilePage />} />
      <Route path="welcome" element={<OnboardingPage />} />
      <Route path="messages" element={<Messages />} />
      <Route path="jobs" element={<JobsBoard />} />
      <Route path="events" element={<Events />} />
      <Route path="events/:id" element={<EventDetail />} />
      <Route path="news" element={<NewsPage />} />
      <Route path="news/:id" element={<NewsArticle />} />
      <Route path="groups" element={<GroupsPage />} />
      <Route path="groups/:id" element={<GroupDetail />} />
      <Route path="mentorship" element={<MentorshipPage />} />
      <Route path="documents" element={<DocumentsPage />} />
      <Route path="profile" element={<ProfilePage />} />
      {/* the old create/edit forms are replaced by onboarding and the profile editor */}
      <Route path="profile/create" element={<Navigate to={PATHS.welcome} replace />} />
      <Route path="profile/edit" element={<Navigate to={PATHS.profile} replace />} />
      <Route path="career" element={<CareerPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="settings" element={<Settings />} />
      {/* old addresses */}
      <Route path="alumni" element={<Navigate to={PATHS.people} replace />} />
      <Route path="connections" element={<Navigate to={`${PATHS.people}?tab=accepted`} replace />} />
      <Route path="chat" element={<Navigate to={PATHS.messages} replace />} />
      <Route path="jobs-history" element={<Navigate to={PATHS.career} replace />} />
      <Route path="*" element={<Navigate to={PATHS.home} replace />} />
    </Routes>
  );
}
