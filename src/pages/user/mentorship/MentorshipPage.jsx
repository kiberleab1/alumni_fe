import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ChatBubbleLeftRightIcon, LightBulbIcon, SparklesIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { findMentors, getMyMentorProfile, getMyMentorships, requestMentor, respondMentorship, saveMyMentorProfile } from "src/api";
import { useSocketEvent } from "src/lib/realtime";
import { chatPath, profilePath } from "src/lib/nav";
import { Avatar, Button, Card, Chips, EmptyState, Field, Modal, PageHeader, Pill, SearchInput, SkeletonRow, Switch, Tabs, apiError, cx, inputClass, timeAgo } from "src/components/ui";

const FORMATS = { chat: "Chat", video: "Video call", in_person: "In person" };
const SUGGESTED_TOPICS = ["Career change", "First job", "Interview prep", "Leadership", "Entrepreneurship", "Further study", "Software", "Finance", "Public health"];

function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function RequestModal({ mentor, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ topic: mentor.topics?.[0] || "", goal: "", format: mentor.formats?.[0] || "chat", message: "" });
  const [error, setError] = useState(null);
  const send = useMutation(requestMentor, {
    onSuccess: () => {
      toast.success(`Request sent to ${mentor.user.first_name || mentor.user.name}`);
      queryClient.invalidateQueries("mentors");
      queryClient.invalidateQueries("myMentorships");
      onClose();
    },
    onError: (e) => setError(apiError(e)),
  });
  return (
    <Modal
      open
      onClose={onClose}
      title={`Ask ${mentor.user.name} to mentor you`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={send.isLoading} disabled={form.goal.trim().length < 10} onClick={() => send.mutate({ mentor_id: mentor.user.id, ...form })}>
            Send request
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {mentor.topics?.length > 0 && (
          <Field label="Topic">
            <Chips value={form.topic} onChange={(v) => setForm({ ...form, topic: v })} options={mentor.topics.map((t) => ({ value: t, label: t }))} label="Topic" />
          </Field>
        )}
        <Field label="What do you want to achieve?" htmlFor="m-goal" hint="At least 10 characters. Be specific: mentors say yes to clear goals.">
          <textarea id="m-goal" rows={3} className={inputClass} maxLength={500} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="e.g. Move from QA into backend engineering within a year" />
        </Field>
        <Field label="How would you like to meet?">
          <Chips value={form.format} onChange={(v) => setForm({ ...form, format: v })} options={(mentor.formats || ["chat"]).map((f) => ({ value: f, label: FORMATS[f] }))} label="Format" />
        </Field>
        <Field label="Anything else? (optional)" htmlFor="m-msg">
          <textarea id="m-msg" rows={2} className={inputClass} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </Field>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
      </div>
    </Modal>
  );
}

function FindMentors() {
  const [topic, setTopic] = useState("");
  const [search, setSearch] = useState("");
  const [asking, setAsking] = useState(null);
  const q = useDebounced(search);
  const { data, isLoading } = useQuery(["mentors", topic, q], () => findMentors({ topic, search: q }), { keepPreviousData: true });
  return (
    <>
      <div className="mb-5 space-y-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, role or topic" className="sm:w-96" />
        {data?.topics?.length > 0 && <Chips value={topic} onChange={setTopic} label="Topic" options={[{ value: "", label: "All topics" }, ...data.topics.map((t) => ({ value: t, label: t }))]} />}
      </div>
      {isLoading ? (
        <Card>
          <SkeletonRow />
          <SkeletonRow />
        </Card>
      ) : !data?.items?.length ? (
        <Card>
          <EmptyState icon={LightBulbIcon} title="No mentors yet" description="As alumni sign up to mentor, they'll appear here. You can be the first." />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.items.map((m) => (
            <Card key={m.user.id} className="flex flex-col p-5">
              <div className="flex items-start gap-3">
                <Avatar name={m.user.name} photo={m.user.photo} size="md" online={m.user.online} />
                <div className="min-w-0 flex-1">
                  <Link to={profilePath(m.user.id)} className="font-semibold text-slate-900 hover:underline">{m.user.name}</Link>
                  <p className="text-sm text-slate-600">{m.headline || m.current_role || m.user.department_name}</p>
                  {m.user.graduation_year && <p className="text-xs text-slate-500">Class of {m.user.graduation_year}</p>}
                </div>
                <Pill tone={m.spots_left ? "green" : "slate"}>{m.spots_left ? `${m.spots_left} place${m.spots_left > 1 ? "s" : ""} left` : "Full"}</Pill>
              </div>
              {m.reasons?.length > 0 && (
                <p className="mt-3 flex items-start gap-1.5 text-xs font-medium text-link">
                  <SparklesIcon className="h-4 w-4 shrink-0" /> {m.reasons.join(" · ")}
                </p>
              )}
              {m.bio && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{m.bio}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.topics.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                <p className="text-xs text-slate-500">{m.formats.map((f) => FORMATS[f]).join(" · ")}</p>
                {m.my_request ? (
                  <Pill tone={m.my_request.status === "accepted" ? "green" : "amber"}>{m.my_request.status === "accepted" ? "Your mentor" : "Request pending"}</Pill>
                ) : (
                  <Button size="sm" disabled={!m.spots_left} onClick={() => setAsking(m)}>
                    Request mentorship
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      {asking && <RequestModal mentor={asking} onClose={() => setAsking(null)} />}
    </>
  );
}

function RequestRow({ r, actions }) {
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start">
      <Avatar name={r.other.name} photo={r.other.photo} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">
          {r.other.name}
          {r.topic && <span className="ml-2 font-normal text-slate-500">· {r.topic}</span>}
        </p>
        <p className="mt-1 text-sm text-slate-700">
          <span className="font-medium">Goal:</span> {r.goal}
        </p>
        {r.message && <p className="mt-1 text-sm italic text-slate-500">“{r.message}”</p>}
        {r.response && <p className="mt-1 text-sm text-slate-600">Reply: {r.response}</p>}
        <p className="mt-1 text-xs text-slate-400">
          {FORMATS[r.format]} · {timeAgo(r.responded_at || r.created_at)}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">{actions}</div>
    </li>
  );
}

function MyMentorships({ only }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery("myMentorships", getMyMentorships);
  useSocketEvent("mentorship:update", () => queryClient.invalidateQueries("myMentorships"));
  const respond = useMutation(respondMentorship, {
    onSuccess: (r, v) => {
      toast.success({ accept: "Accepted. You're now connected and can chat.", decline: "Request declined", cancel: "Request withdrawn", complete: "Marked as complete" }[v.action]);
      queryClient.invalidateQueries("myMentorships");
      queryClient.invalidateQueries("mentors");
      queryClient.invalidateQueries("myMentorProfile");
      if (v.action === "accept") queryClient.invalidateQueries("connectionCounts");
    },
    onError: (e) => toast.error(apiError(e)),
  });
  if (isLoading) return <Card><SkeletonRow /></Card>;
  const chat = (r) => (
    <Button size="sm" variant="secondary" onClick={() => navigate(chatPath(r.other.id), { state: { peer: r.other } })}>
      <ChatBubbleLeftRightIcon className="h-4 w-4" /> Message
    </Button>
  );
  const complete = (r) => (
    <Button size="sm" variant="ghost" onClick={() => window.confirm("Mark this mentorship as complete? It frees the mentor's place.") && respond.mutate({ id: r.id, action: "complete" })}>
      Complete
    </Button>
  );
  const sections =
    only === "requests"
      ? [
          {
            title: "Asking you to mentor them",
            items: data?.incoming,
            empty: "No requests right now.",
            actions: (r) => (
              <>
                <Button size="sm" loading={respond.isLoading && respond.variables?.id === r.id && respond.variables?.action === "accept"} onClick={() => respond.mutate({ id: r.id, action: "accept" })}>
                  Accept
                </Button>
                <Button size="sm" variant="ghost" onClick={() => respond.mutate({ id: r.id, action: "decline" })}>
                  Decline
                </Button>
              </>
            ),
          },
        ]
      : [
          { title: "Your mentors", items: data?.mentors, empty: "Find a mentor to get started.", actions: (r) => <>{chat(r)}{complete(r)}</> },
          { title: "Your mentees", items: data?.mentees, empty: "When you accept a request, your mentees appear here.", actions: (r) => <>{chat(r)}{complete(r)}</> },
          { title: "Waiting for a reply", items: data?.outgoing, empty: "No pending requests.", actions: (r) => <Button size="sm" variant="ghost" onClick={() => respond.mutate({ id: r.id, action: "cancel" })}>Withdraw</Button> },
          { title: "Past", items: data?.past, empty: null, actions: () => <Pill>{"—"}</Pill> },
        ];
  return (
    <div className="space-y-5">
      {sections
        .filter((s) => s.empty !== null || s.items?.length)
        .map((s) => (
          <Card key={s.title} className="px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              {s.title} {s.items?.length ? <span className="text-slate-400">({s.items.length})</span> : null}
            </h2>
            {s.items?.length ? (
              <ul className="divide-y divide-slate-100">
                {s.items.map((r) => (
                  <RequestRow key={r.id} r={r} actions={s.title === "Past" ? <Pill>{r.status}</Pill> : s.actions(r)} />
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-slate-500">{s.empty}</p>
            )}
          </Card>
        ))}
    </div>
  );
}

function MentorProfileForm() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery("myMentorProfile", getMyMentorProfile);
  const [form, setForm] = useState(null);
  const [topicDraft, setTopicDraft] = useState("");
  useEffect(() => {
    if (!isLoading) setForm({ is_open: true, headline: "", bio: "", topics: [], formats: ["chat"], capacity: 2, ...(data || {}) });
  }, [data, isLoading]);
  const save = useMutation(saveMyMentorProfile, {
    onSuccess: (p) => {
      queryClient.setQueryData("myMentorProfile", p);
      queryClient.invalidateQueries("mentors");
      toast.success(data ? "Mentor profile saved" : "You're now listed as a mentor");
    },
    onError: (e) => toast.error(apiError(e)),
  });
  if (!form) return <Card><SkeletonRow /></Card>;
  const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const addTopic = (t) => {
    const v = t.trim();
    if (v && !form.topics.includes(v) && form.topics.length < 12) setForm({ ...form, topics: [...form.topics, v] });
    setTopicDraft("");
  };
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="space-y-5 p-5 lg:col-span-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{data ? "Your mentor profile" : "Become a mentor"}</h2>
            <p className="text-sm text-slate-500">Members in your institute can find you and send a request. You decide who to accept.</p>
          </div>
          {data && <Switch checked={form.is_open} onChange={(v) => setForm({ ...form, is_open: v })} label="Taking requests" />}
        </div>
        <Field label="Headline" htmlFor="mp-headline" hint="e.g. Product manager at Safaricom, 8 years in fintech">
          <input id="mp-headline" className={inputClass} maxLength={160} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </Field>
        <Field label="How you can help" htmlFor="mp-bio">
          <textarea id="mp-bio" rows={4} className={inputClass} maxLength={2000} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </Field>
        <Field label="Topics" hint="Pick or type up to 12">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {form.topics.map((t) => (
              <button key={t} onClick={() => setForm({ ...form, topics: form.topics.filter((x) => x !== t) })} className="rounded-full bg-brand text-brand-ink px-3 py-1 text-xs font-semibold" aria-label={`Remove ${t}`}>
                {t} ×
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={topicDraft}
              onChange={(e) => setTopicDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTopic(topicDraft))}
              placeholder="Add a topic and press Enter"
              aria-label="Add a topic"
              maxLength={40}
            />
            <Button variant="secondary" onClick={() => addTopic(topicDraft)} disabled={!topicDraft.trim()}>
              Add
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGESTED_TOPICS.filter((t) => !form.topics.includes(t)).map((t) => (
              <button key={t} onClick={() => addTopic(t)} className="rounded-full px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                + {t}
              </button>
            ))}
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ways to meet">
            <div className="flex flex-wrap gap-2">
              {Object.entries(FORMATS).map(([v, l]) => (
                <label key={v} className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" checked={form.formats.includes(v)} onChange={() => setForm({ ...form, formats: toggle(form.formats, v).length ? toggle(form.formats, v) : form.formats })} /> {l}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Mentees at a time" htmlFor="mp-cap">
            <input id="mp-cap" type="number" min={0} max={20} className={cx(inputClass, "w-24")} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Math.max(0, Math.min(20, Number(e.target.value) || 0)) })} />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button loading={save.isLoading} onClick={() => save.mutate({ is_open: form.is_open, headline: form.headline || "", bio: form.bio || "", topics: form.topics, formats: form.formats, capacity: form.capacity })}>
            {data ? "Save changes" : "Start mentoring"}
          </Button>
        </div>
      </Card>
      <Card className="h-fit p-5">
        <h2 className="text-sm font-semibold text-slate-900">How it works</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-slate-600">
          <li>Members send a request with a goal and how they'd like to meet.</li>
          <li>Accepting connects you, so you can talk in Messages.</li>
          <li>Mark it complete when you're done; that frees a place.</li>
        </ol>
        {data && (
          <p className="mt-4 text-sm text-slate-700">
            {data.active_mentees} of {data.capacity} places in use.
          </p>
        )}
      </Card>
    </div>
  );
}

/** Mentorship (design board 10). ?tab=find | mine | requests | mentor */
export default function MentorshipPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "find";
  const { data } = useQuery("myMentorships", getMyMentorships, { staleTime: 15_000 });
  return (
    <div className="ui-scope mx-auto max-w-6xl">
      <PageHeader title="Mentorship" subtitle="Learn from alumni who've been where you're going, or help someone who's just starting." />
      <Tabs
        className="mb-5"
        value={tab}
        onChange={(v) => setParams(v === "find" ? {} : { tab: v })}
        tabs={[
          { value: "find", label: "Find a mentor" },
          { value: "mine", label: "My mentorships", count: (data?.mentors?.length || 0) + (data?.mentees?.length || 0) },
          { value: "requests", label: "Requests", count: data?.incoming?.length },
          { value: "mentor", label: "Be a mentor" },
        ]}
      />
      {tab === "find" && <FindMentors />}
      {tab === "mine" && <MyMentorships />}
      {tab === "requests" && <MyMentorships only="requests" />}
      {tab === "mentor" && <MentorProfileForm />}
      {tab === "find" && !data?.mentors?.length && (
        <Card className="mt-6 flex flex-wrap items-center gap-3 p-5">
          <UserGroupIcon className="h-6 w-6 text-slate-400" />
          <p className="flex-1 text-sm text-slate-600">Have experience to share? Alumni who mentor say it's the most rewarding part of staying in touch.</p>
          <Button variant="secondary" onClick={() => setParams({ tab: "mentor" })}>
            Become a mentor
          </Button>
        </Card>
      )}
    </div>
  );
}
