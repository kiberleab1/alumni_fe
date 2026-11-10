/** Who changed what, and when: every successful admin action. */
import { useState } from "react";
import { useQuery } from "react-query";
import { ChevronLeftIcon, ChevronRightIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { getAuditLog } from "src/api";
import { Avatar, Card, EmptyState, PageHeader, SearchInput, cx, inputClass } from "src/components/ui";
import { InstituteSelect, num, useDebounced, useInstituteFilter } from "./shared";

const AREA_LABEL = (a) => a.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
const ROLE = { super_admin: "Super admin", admin: "Admin" };
const stamp = (d) => new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
const dayKey = (d) => new Date(d).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

export default function AuditLogPage() {
  const [institute, setInstitute] = useInstituteFilter(true);
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [from, setFrom] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);
  const params = { institute_id: institute, search: q, area, from, page };
  const { data, isLoading, isError } = useQuery(["adminAudit", params], () => getAuditLog(params), { keepPreviousData: true });
  const reset = (fn) => (v) => (fn(v), setPage(1));
  const items = data?.items || [];
  let lastDay = null;
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Audit log" subtitle="Every change made in the admin console." />
      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
        <SearchInput value={search} onChange={reset(setSearch)} placeholder="Search actions or people" className="md:w-72" />
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <select className={cx(inputClass, "sm:w-44")} value={area} onChange={(e) => reset(setArea)(e.target.value)} aria-label="Area">
            <option value="">All areas</option>
            {(data?.areas || []).map((a) => (
              <option key={a} value={a}>
                {AREA_LABEL(a)}
              </option>
            ))}
          </select>
          <input type="date" className={cx(inputClass, "sm:w-44")} value={from} onChange={(e) => reset(setFrom)(e.target.value)} aria-label="Since" />
          <InstituteSelect value={institute} onChange={reset(setInstitute)} allowAll className="col-span-2 sm:w-56" />
        </div>
      </div>
      <Card className="mt-4 overflow-hidden">
        {isLoading ? (
          <div className="h-64 animate-pulse bg-slate-100" />
        ) : isError ? (
          <p className="p-6 text-sm text-rose-600">Couldn't load the audit log.</p>
        ) : !items.length ? (
          <EmptyState icon={ClipboardDocumentListIcon} title="Nothing recorded" description={q || area || from ? "Try other filters." : "Changes made by admins will appear here."} />
        ) : (
          <ol>
            {items.map((e) => {
              const day = dayKey(e.createdAt);
              const header = day !== lastDay;
              lastDay = day;
              return (
                <li key={e.id}>
                  {header && <p className="border-y border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 first:border-t-0">{day}</p>}
                  <div className="flex items-start gap-3 px-4 py-3">
                    <Avatar name={e.actor_name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-900">
                        <span className="font-semibold">{e.actor_name || "Someone"}</span> <span className="text-slate-500">· {ROLE[e.actor_role] || e.actor_role}</span>
                      </p>
                      <p className="text-sm text-slate-700">{e.summary}</p>
                    </div>
                    <time className="shrink-0 text-xs text-slate-500" dateTime={e.createdAt}>
                      {stamp(e.createdAt)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {data && data.total > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
            <p>{num(data.total)} entries</p>
            <div className="flex items-center gap-1">
              <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Newer">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className="px-2 font-medium text-slate-700">
                {page} / {num(data.totalPage)}
              </span>
              <button type="button" disabled={page >= data.totalPage} onClick={() => setPage(page + 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Older">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
