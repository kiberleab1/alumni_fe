/** Admin home: live counts, work waiting on an admin, and recent activity. */
import { useQuery } from "react-query";
import { AcademicCapIcon, ArrowRightIcon, BriefcaseIcon, BuildingLibraryIcon, CalendarDaysIcon, CheckCircleIcon, ClipboardDocumentCheckIcon, FlagIcon, NewspaperIcon, PlusIcon, TagIcon } from "@heroicons/react/24/outline";
import { getAdminDocuments, getAllAlumni, getAllEvents, getAllJobs, getAllNews, getDepartments, getInstitutes, getMessageReports } from "src/api";
import { Avatar, Button, Card, PageHeader, cx } from "src/components/ui";
import { fmtDate, useSession } from "./kit";

/** A count that failed to load shows a dash rather than a misleading 0. */
const safe = (p) => p.catch(() => null);
const total = (r) => (r?.data ? r.data.total_items ?? null : null);

async function loadDashboard() {
  const one = { pageNumber: 1, pageSize: 10 };
  const [alumni, events, jobs, news, institutes, departments, documents, reports] = await Promise.all([
    safe(getAllAlumni({ pageNumber: 1, pageSize: 6 })),
    safe(getAllEvents({ pageNumber: 1, pageSize: 5 })),
    safe(getAllJobs(one)),
    safe(getAllNews(one)),
    safe(getInstitutes(one)),
    safe(getDepartments(one)),
    safe(getAdminDocuments({ status: "open" })),
    safe(getMessageReports({ status: "open" })),
  ]);
  const unwrap = (r) => r?.data ?? r;
  const docs = unwrap(documents);
  const reps = unwrap(reports);
  return {
    counts: { alumni: total(alumni), events: total(events), jobs: total(jobs), news: total(news), institutes: total(institutes), departments: total(departments) },
    openDocuments: docs?.total ?? null,
    openReports: reps?.total ?? reps?.total_items ?? null,
    recentAlumni: alumni?.data?.alumniProfile || [],
    events: events?.data?.events || [],
  };
}

const num = (v) => (v == null ? "—" : Number(v).toLocaleString());

function Stat({ icon: Icon, label, value, onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300 sm:p-5">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Icon className="h-5 w-5 text-link" aria-hidden="true" /> {label}
      </span>
      <span className="mt-2 block text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{value}</span>
    </button>
  );
}

function Attention({ icon: Icon, label, count, onClick }) {
  const waiting = count > 0;
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50">
      <span className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", waiting ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{waiting ? <Icon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900">{label}</span>
        <span className="block text-xs text-slate-500">{count == null ? "Couldn't load" : waiting ? `${num(count)} waiting for review` : "All clear"}</span>
      </span>
      <ArrowRightIcon className="h-4 w-4 text-slate-400" />
    </button>
  );
}

function Panel({ title, action, onAction, children }) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {action && (
          <button type="button" onClick={onAction} className="text-sm font-semibold text-link hover:underline">
            {action}
          </button>
        )}
      </div>
      {children}
    </Card>
  );
}

export function Dashboard({ go }) {
  const session = useSession();
  const { data, isLoading } = useQuery("adminDashboard", loadDashboard, { staleTime: 30_000 });
  const c = data?.counts || {};
  const show = (v) => (isLoading ? "…" : num(v));
  const stats = [
    { icon: AcademicCapIcon, label: "Alumni", value: c.alumni, page: "Alumni" },
    { icon: CalendarDaysIcon, label: "Events", value: c.events, page: "Events" },
    { icon: BriefcaseIcon, label: "Jobs", value: c.jobs, page: "Jobs" },
    { icon: NewspaperIcon, label: "News", value: c.news, page: "News" },
    { icon: BuildingLibraryIcon, label: "Institutions", value: c.institutes, page: "Institutions" },
    { icon: TagIcon, label: "Departments", value: c.departments, page: "Departments" },
  ];
  const first = session.name.split(" ")[0];
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title={first && first !== "Unnamed" ? `Welcome back, ${first}` : "Dashboard"}
        subtitle="Here's what's happening across your alumni network."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => go("Create News")}>
              <PlusIcon className="h-4 w-4" /> News
            </Button>
            <Button onClick={() => go("Create Event")}>
              <PlusIcon className="h-4 w-4" /> Event
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Stat key={s.label} icon={s.icon} label={s.label} value={show(s.value)} onClick={() => go(s.page)} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Needs attention">
          <div className="-mx-2 space-y-1">
            <Attention icon={ClipboardDocumentCheckIcon} label="Document requests" count={data?.openDocuments} onClick={() => go("Document Verification")} />
            <Attention icon={FlagIcon} label="Reported messages" count={data?.openReports} onClick={() => go("Message Reports")} />
          </div>
        </Panel>
        <Panel title="Newest alumni" action="View all" onAction={() => go("Alumni")}>
          {data?.recentAlumni?.length ? (
            <ul className="space-y-3">
              {data.recentAlumni.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <Avatar name={a.user_data?.name} size="sm" />
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-sm font-semibold text-slate-900">{a.user_data?.name}</p>
                    <p className="truncate text-xs text-slate-500">{a.department_name}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-slate-500">{isLoading ? "Loading…" : "No alumni profiles yet."}</p>
          )}
        </Panel>
        <Panel title="Recent events" action="View all" onAction={() => go("Events")}>
          {data?.events?.length ? (
            <ul className="space-y-3">
              {data.events.map((e) => (
                <li key={e.id} className="leading-tight">
                  <p className="truncate text-sm font-semibold text-slate-900">{e.title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {fmtDate(e.time)}
                    {e.venue ? ` · ${e.venue}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-slate-500">{isLoading ? "Loading…" : "No events yet."}</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
