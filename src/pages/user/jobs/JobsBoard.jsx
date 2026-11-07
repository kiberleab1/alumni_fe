import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { BookmarkIcon, BriefcaseIcon, BuildingOffice2Icon, ChatBubbleLeftRightIcon, ClockIcon, MapPinIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { getImageBaseUrl, getJobAlumni, getMemberJob, getMemberJobs, sendConnectionRequest, trackJob } from "src/api";
import { chatPath, profilePath } from "src/lib/nav";
import { Avatar, Button, Card, Chips, EmptyState, Field, PageHeader, Pill, SearchInput, SkeletonRow, Spinner, Tabs, apiError, cx, inputClass, timeAgo } from "src/components/ui";

const STATUS = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "closed", label: "Closed" },
];
const STATUS_TONE = { saved: "slate", applied: "brand", interviewing: "amber", offer: "green", closed: "slate" };
const TYPES = [
  { value: "", label: "All types" },
  { value: "Full time", label: "Full time" },
  { value: "Part time", label: "Part time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

const deadlineText = (d) => {
  if (!d) return null;
  const days = Math.ceil((new Date(d) - Date.now()) / 86_400_000);
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  if (days <= 14) return `Closes in ${days} day${days > 1 ? "s" : ""}`;
  return `Closes ${new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
};

function useTrack() {
  const queryClient = useQueryClient();
  return useMutation(trackJob, {
    onSuccess: (job, v) => {
      queryClient.invalidateQueries("memberJobs");
      if (job?.id) queryClient.setQueryData(["memberJob", job.id], job);
      else queryClient.invalidateQueries(["memberJob", v.id]);
      toast.success(!v.status ? "Removed from your list" : v.status === "saved" ? "Saved" : `Marked as ${STATUS.find((s) => s.value === v.status)?.label.toLowerCase()}`);
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

function JobDetail({ id, onClose }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const track = useTrack();
  const { data: job, isLoading } = useQuery(["memberJob", id], () => getMemberJob(id));
  const alumni = useQuery(["jobAlumni", id], () => getJobAlumni(id), { enabled: !!job?.company });
  const [note, setNote] = useState("");
  useEffect(() => setNote(job?.note || ""), [job?.id, job?.note]);
  const connect = useMutation((userId) => sendConnectionRequest({ user_id: userId, message: `Hi! I saw you work at ${job?.company} and I'm interested in the ${job?.title} role. Could we connect?` }), {
    onSuccess: () => {
      toast.success("Request sent");
      queryClient.invalidateQueries(["jobAlumni", id]);
    },
    onError: (e) => toast.error(apiError(e)),
  });
  const html = useMemo(() => DOMPurify.sanitize(job?.description || ""), [job?.description]);

  if (isLoading || !job) {
    return (
      <Card className="flex justify-center p-10 text-slate-400">
        <Spinner />
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start gap-3">
          {job.image ? (
            <img src={getImageBaseUrl(job.image)} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <BuildingOffice2Icon className="h-6 w-6" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
            <p className="text-sm text-slate-600">{[job.company, job.address].filter(Boolean).join(" · ")}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {job.hiring_type && <Pill>{job.hiring_type}</Pill>}
              {job.level && <Pill>{job.level}</Pill>}
              {job.salary && <Pill tone="green">{job.salary}</Pill>}
              {job.deadline && <Pill tone={job.is_open ? "amber" : "rose"}>{deadlineText(job.deadline)}</Pill>}
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 lg:hidden">
            Close
          </button>
        </div>
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Track your application</p>
          <div className="flex flex-wrap gap-2">
            {STATUS.map((s) => (
              <button
                key={s.value}
                onClick={() => track.mutate({ id: job.id, status: s.value })}
                aria-pressed={job.my_status === s.value}
                className={cx("rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition", job.my_status === s.value ? "bg-brand text-brand-ink ring-brand" : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-100")}
              >
                {s.label}
              </button>
            ))}
            {job.my_status && (
              <button onClick={() => track.mutate({ id: job.id, status: null })} className="px-2 text-xs font-medium text-slate-500 hover:text-rose-600">
                Remove
              </button>
            )}
          </div>
          {job.my_status && (
            <Field label="Private note" className="mt-3" htmlFor="job-note">
              <div className="flex gap-2">
                <input id="job-note" className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Sent CV on Monday, follow up Friday" />
                <Button variant="secondary" disabled={note === (job.note || "")} onClick={() => track.mutate({ id: job.id, status: job.my_status, note })}>
                  Save
                </Button>
              </div>
            </Field>
          )}
          {job.applied_at && <p className="mt-2 text-xs text-slate-500">Applied {timeAgo(job.applied_at)}</p>}
        </div>
      </div>

      {job.company && (
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-900">Alumni at {job.company}</h3>
          {alumni.isLoading ? (
            <SkeletonRow />
          ) : alumni.data?.items?.length ? (
            <ul className="mt-3 space-y-3">
              {alumni.data.items.map((a) => (
                <li key={a.user.id} className="flex items-center gap-3">
                  <Avatar name={a.user.name} photo={a.user.photo} size="sm" online={a.user.online} />
                  <div className="min-w-0 flex-1">
                    <Link to={profilePath(a.user.id)} className="block truncate text-sm font-semibold text-slate-900 hover:underline">{a.user.name}</Link>
                    <p className="truncate text-xs text-slate-500">
                      {a.title}
                      {a.is_current ? "" : " (former)"}
                      {a.user.graduation_year ? ` · Class of ${a.user.graduation_year}` : ""}
                    </p>
                  </div>
                  {a.connection_state === "connected" ? (
                    <Button size="sm" variant="secondary" onClick={() => navigate(chatPath(a.user.id), { state: { peer: a.user } })}>
                      <ChatBubbleLeftRightIcon className="h-4 w-4" /> Ask for referral
                    </Button>
                  ) : a.connection_state === "pending_sent" ? (
                    <Pill>Pending</Pill>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => connect.mutate(a.user.id)} disabled={connect.isLoading}>
                      <UserPlusIcon className="h-4 w-4" /> Connect
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No alumni have listed {job.company} in their career history yet.</p>
          )}
        </div>
      )}

      <div className="rich-text p-5 text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: html }} />
    </Card>
  );
}

/** Jobs (design board 5): list with saved/applied tabs and a detail panel. */
export default function JobsBoard() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "all";
  const selected = params.get("job");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const q = useDebounced(search);
  const track = useTrack();
  const { data, isLoading } = useQuery(["memberJobs", tab, q, type], () => getMemberJobs({ tab, search: q, type, pageSize: 50 }), { keepPreviousData: true });
  const items = data?.items || [];

  const setParam = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next);
  };
  // desktop: open the first job automatically
  useEffect(() => {
    if (!selected && items.length && window.matchMedia("(min-width: 1024px)").matches) {
      const next = new URLSearchParams(params);
      next.set("job", items[0].id);
      setParams(next, { replace: true });
    }
  }, [selected, items, params, setParams]);

  return (
    <div className="ui-scope mx-auto max-w-7xl">
      <PageHeader title="Jobs" subtitle="Opportunities shared with your alumni network. Save the ones you like and track where you've applied." />
      <Tabs
        className="mb-4"
        value={tab}
        onChange={(v) => setParam("tab", v === "all" ? null : v)}
        tabs={[
          { value: "all", label: "All jobs" },
          { value: "saved", label: "Saved", count: data?.counts?.saved },
          { value: "applied", label: "Applications", count: data?.counts?.applied },
        ]}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search title, company or location" className="sm:w-80" />
        <Chips value={type} onChange={setType} options={TYPES} label="Job type" />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className={cx("space-y-3 lg:col-span-2", selected && "hidden lg:block")}>
          {isLoading ? (
            <Card>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </Card>
          ) : items.length === 0 ? (
            <Card>
              <EmptyState
                icon={BriefcaseIcon}
                title={tab === "saved" ? "No saved jobs" : tab === "applied" ? "No applications tracked" : "No jobs found"}
                description={tab === "all" ? "Try another search, or check back soon." : "Use Save or the status buttons on a job to keep track of it here."}
              />
            </Card>
          ) : (
            items.map((j) => (
              <button
                key={j.id}
                onClick={() => setParam("job", j.id)}
                className={cx("block w-full rounded-theme border bg-white p-4 text-left shadow-sm transition hover:border-slate-300", selected === j.id ? "border-brand ring-1 ring-brand" : "border-slate-200")}
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{j.title}</p>
                    <p className="truncate text-sm text-slate-600">{j.company || "—"}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      {j.address && (
                        <span className="inline-flex items-center gap-1">
                          <MapPinIcon className="h-3.5 w-3.5" /> {j.address}
                        </span>
                      )}
                      {j.deadline && (
                        <span className={cx("inline-flex items-center gap-1", !j.is_open && "text-rose-600")}>
                          <ClockIcon className="h-3.5 w-3.5" /> {deadlineText(j.deadline)}
                        </span>
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {j.my_status && j.my_status !== "saved" && <Pill tone={STATUS_TONE[j.my_status]}>{STATUS.find((s) => s.value === j.my_status)?.label}</Pill>}
                      {j.alumni_count > 0 && <Pill tone="brand">{j.alumni_count} alumni work here</Pill>}
                    </div>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={j.my_status ? `Unsave ${j.title}` : `Save ${j.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      track.mutate({ id: j.id, status: j.my_status ? null : "saved" });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        track.mutate({ id: j.id, status: j.my_status ? null : "saved" });
                      }
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-link"
                  >
                    {j.my_status ? <BookmarkSolid className="h-5 w-5 text-link" /> : <BookmarkIcon className="h-5 w-5" />}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
        <div className={cx("lg:col-span-3", !selected && "hidden lg:block")}>
          {selected ? (
            <div className="lg:sticky lg:top-20">
              <button onClick={() => setParam("job", null)} className="mb-3 text-sm font-semibold text-link lg:hidden">
                ← All jobs
              </button>
              <JobDetail key={selected} id={selected} onClose={() => setParam("job", null)} />
            </div>
          ) : (
            <Card>
              <EmptyState icon={BriefcaseIcon} title="Pick a job" description="Select a job on the left to see the details and alumni who work there." />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
