import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ArrowRightIcon, BriefcaseIcon, CalendarDaysIcon, CheckCircleIcon, LightBulbIcon, NewspaperIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import {
  getConnectionSuggestions,
  getMemberJobs,
  getMemberNews,
  getMyEvents,
  getMyProfile,
  getMyMentorships,
  getImageBaseUrl,
  listConnections,
  respondToConnection,
  sendConnectionRequest,
} from "src/api";
import { useRealtime } from "src/lib/realtime";
import { PATHS, chatPath, eventPath, jobPath, newsPath, peoplePath, profilePath } from "src/lib/nav";
import { Avatar, Button, Card, Pill, apiError, cx, timeAgo } from "src/components/ui";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

/** Profile checklist: what's missing and where to fix it (computed by the API). */
const STEP_TARGET = { profile: PATHS.welcome, career: PATHS.career };
function useProfileSteps() {
  const profile = useQuery("myProfile", getMyProfile, { staleTime: 60_000 });
  const steps = (profile.data?.completeness?.checks || []).map((c) => ({ label: c.label, done: c.done, to: STEP_TARGET[c.key] || PATHS.profile }));
  return { steps, loading: profile.isLoading, onboarding: !!profile.data?.onboarding?.needed };
}

function Section({ title, to, linkLabel = "See all", icon: Icon, children, className }) {
  return (
    <Card className={cx("p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          {Icon && <Icon className="h-5 w-5 text-slate-400" />} {title}
        </h2>
        {to && (
          <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
            {linkLabel} <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </Card>
  );
}

const Empty = ({ children }) => <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">{children}</p>;

export default function HomePage() {
  const { me, pendingRequests } = useRealtime();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { steps, loading: stepsLoading, onboarding } = useProfileSteps();
  const done = steps.filter((s) => s.done).length;

  const requests = useQuery(["connections", "incoming", "home"], () => listConnections({ type: "incoming", pageSize: 3 }), { staleTime: 15_000 });
  const suggestions = useQuery(["suggestions", 4], () => getConnectionSuggestions(4), { staleTime: 60_000 });
  const events = useQuery("myEvents", () => getMyEvents("upcoming"), { staleTime: 30_000 });
  const jobs = useQuery(["memberJobs", "home"], () => getMemberJobs({ pageSize: 3 }), { staleTime: 60_000 });
  const news = useQuery(["memberNews", "home"], () => getMemberNews({ pageSize: 3 }), { staleTime: 60_000 });
  const mentorship = useQuery("myMentorships", getMyMentorships, { staleTime: 30_000 });

  const refreshPeople = () => {
    queryClient.invalidateQueries("connections");
    queryClient.invalidateQueries("connectionCounts");
    queryClient.invalidateQueries("suggestions");
  };
  const respond = useMutation(respondToConnection, {
    onSuccess: (_, v) => {
      toast.success(v.status === "accepted" ? "You're now connected" : "Request ignored");
      refreshPeople();
    },
    onError: (e) => toast.error(apiError(e)),
  });
  const connect = useMutation((userId) => sendConnectionRequest({ user_id: userId }), {
    onSuccess: () => {
      toast.success("Request sent");
      refreshPeople();
    },
    onError: (e) => toast.error(apiError(e)),
  });

  const incomingRequests = requests.data?.items || requests.data?.data || [];
  const mentorAsks = mentorship.data?.incoming?.length || 0;

  // first sign-in without a profile: start the short setup instead
  if (onboarding) return <Navigate to={PATHS.welcome} replace />;

  return (
    <div className="ui-scope mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {greeting()}, {me?.first_name || "there"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Here's what's happening in your alumni network.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(peoplePath())}>
            <UserPlusIcon className="h-4 w-4" /> Find classmates
          </Button>
          <Button onClick={() => navigate(PATHS.events)}>
            <CalendarDaysIcon className="h-4 w-4" /> Browse events
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* profile progress */}
          {!stepsLoading && done < steps.length && (
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 p-5">
                <div className="relative h-14 w-14 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-brand" strokeDasharray={`${(done / steps.length) * 97.4} 97.4`} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">{Math.round((done / steps.length) * 100)}%</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-slate-900">Finish your profile</h2>
                  <p className="text-sm text-slate-500">Complete profiles get found by classmates and recruiters far more often.</p>
                </div>
              </div>
              <ul className="divide-y divide-slate-100">
                {steps.map((s) => (
                  <li key={s.label}>
                    <Link to={s.to} className={cx("flex items-center gap-3 px-5 py-3 text-sm transition hover:bg-slate-50", s.done ? "text-slate-400" : "font-medium text-slate-800")}>
                      <CheckCircleIcon className={cx("h-5 w-5 shrink-0", s.done ? "text-emerald-500" : "text-slate-300")} />
                      <span className={cx("flex-1", s.done && "line-through")}>{s.label}</span>
                      {!s.done && <ArrowRightIcon className="h-4 w-4 text-slate-400" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Section title="Your upcoming events" to={PATHS.events} icon={CalendarDaysIcon}>
            {events.data?.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {events.data.slice(0, 4).map(({ event, my_status, waitlist_position }) => {
                  const d = new Date(event.time);
                  return (
                    <li key={event.id}>
                      <Link to={eventPath(event.id)} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:shadow-sm">
                        <span className="flex w-12 shrink-0 flex-col items-center rounded-lg border border-slate-200 py-1">
                          <span className="text-[11px] font-semibold uppercase text-accent">{d.toLocaleDateString(undefined, { month: "short" })}</span>
                          <span className="text-lg font-bold text-slate-900">{d.getDate()}</span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-900">{event.title}</span>
                          <span className="block truncate text-xs text-slate-500">{d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}{event.venue ? ` · ${event.venue}` : ""}</span>
                        </span>
                        <Pill tone={my_status === "going" ? "green" : my_status === "waitlist" ? "amber" : "slate"}>
                          {my_status === "going" ? "Going" : my_status === "waitlist" ? `Waitlist${waitlist_position ? ` #${waitlist_position}` : ""}` : "Maybe"}
                        </Pill>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Empty>
                No upcoming RSVPs. <Link to={PATHS.events} className="font-semibold text-link">See what's on</Link>
              </Empty>
            )}
          </Section>

          <div className="grid gap-5 md:grid-cols-2">
            <Section title="Jobs for you" to={PATHS.jobs} icon={BriefcaseIcon}>
              {jobs.data?.items?.length ? (
                <ul className="space-y-3">
                  {jobs.data.items.map((j) => (
                    <li key={j.id}>
                      <Link to={jobPath(j.id)} className="block rounded-lg p-2 transition hover:bg-slate-50">
                        <p className="truncate text-sm font-semibold text-slate-900">{j.title}</p>
                        <p className="truncate text-xs text-slate-500">{[j.company, j.address, j.hiring_type].filter(Boolean).join(" · ")}</p>
                        {j.alumni_count > 0 && <p className="mt-1 text-xs font-medium text-link">{j.alumni_count} alumni work here</p>}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty>No open jobs right now.</Empty>
              )}
            </Section>
            <Section title="Latest news" to={PATHS.news} icon={NewspaperIcon}>
              {news.data?.items?.length ? (
                <ul className="space-y-3">
                  {news.data.items.map((n) => (
                    <li key={n.id}>
                      <Link to={newsPath(n.id)} className="flex gap-3 rounded-lg p-2 transition hover:bg-slate-50">
                        {n.image && <img src={getImageBaseUrl(n.image)} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover" />}
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-900">{n.title}</span>
                          <span className="text-xs text-slate-500">{n.category} · {timeAgo(n.created_at)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty>No news yet.</Empty>
              )}
            </Section>
          </div>
        </div>

        <div className="space-y-5">
          <Section title="Connection requests" to={peoplePath("incoming")} linkLabel={pendingRequests > 3 ? `All ${pendingRequests}` : "Manage"}>
            {incomingRequests.length ? (
              <ul className="space-y-3">
                {incomingRequests.map((c) => (
                  <li key={c.id} className="flex items-center gap-3">
                    <Avatar name={c.user?.name} photo={c.user?.photo} size="sm" />
                    <div className="min-w-0 flex-1">
                      <Link to={profilePath(c.user?.id)} className="block truncate text-sm font-semibold text-slate-900 hover:underline">{c.user?.name}</Link>
                      <p className="truncate text-xs text-slate-500">{[c.user?.department_name, c.user?.graduation_year && `Class of ${c.user.graduation_year}`].filter(Boolean).join(" · ")}</p>
                    </div>
                    <Button size="sm" onClick={() => respond.mutate({ id: c.id, status: "accepted" })} disabled={respond.isLoading}>
                      Accept
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => respond.mutate({ id: c.id, status: "declined" })} disabled={respond.isLoading} aria-label={`Ignore ${c.user?.name}`}>
                      Ignore
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No pending requests.</Empty>
            )}
          </Section>

          {mentorAsks > 0 && (
            <Card className="flex items-center gap-3 border-amber-200 bg-amber-50 p-4">
              <LightBulbIcon className="h-6 w-6 shrink-0 text-amber-700" />
              <p className="flex-1 text-sm text-amber-900">
                {mentorAsks} member{mentorAsks > 1 ? "s" : ""} asked you to mentor them.
              </p>
              <Button size="sm" variant="secondary" onClick={() => navigate(`${PATHS.mentorship}?tab=requests`)}>
                Review
              </Button>
            </Card>
          )}

          <Section title="People you may know" to={peoplePath("discover")}>
            {suggestions.data?.length ? (
              <ul className="space-y-3">
                {suggestions.data.map((s) => (
                  <li key={s.user.id} className="flex items-center gap-3">
                    <Avatar name={s.user.name} photo={s.user.photo} size="sm" online={s.user.online} />
                    <div className="min-w-0 flex-1">
                      <Link to={profilePath(s.user.id)} className="block truncate text-sm font-semibold text-slate-900 hover:underline">{s.user.name}</Link>
                      <p className="truncate text-xs text-slate-500">{s.reasons?.[0] || s.user.department_name || "Fellow alumni"}</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => connect.mutate(s.user.id)} disabled={connect.isLoading}>
                      Connect
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>We'll suggest people once more classmates join.</Empty>
            )}
          </Section>

          <Card className="p-5">
            <h2 className="text-base font-semibold text-slate-900">Give back</h2>
            <p className="mt-1 text-sm text-slate-500">Share what you've learned with students and recent graduates.</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigate(`${PATHS.mentorship}?tab=mentor`)}>
                Become a mentor
              </Button>
              <Button size="sm" variant="ghost" onClick={() => navigate(chatPath())}>
                Messages
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
