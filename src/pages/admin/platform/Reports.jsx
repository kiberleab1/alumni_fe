/** Growth and engagement for one institute (or all, for the super admin). */
import { useState } from "react";
import { useQuery } from "react-query";
import { getAnalytics } from "src/api";
import { Card, PageHeader, Segmented } from "src/components/ui";
import { fmtDate } from "../kit";
import { InstituteSelect, KpiTile, num, useInstituteFilter } from "./shared";

/** Weekly sign-ups: one series, so no legend; hover or focus a bar for its value. */
function SignupChart({ series }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...series.map((s) => s.count));
  const ticks = [max, Math.round(max / 2), 0];
  const label = (w) => new Date(`${w}T00:00:00Z`).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
  const shown = hover != null ? series[hover] : null;
  return (
    <div>
      <div className="mb-3 flex h-5 items-baseline justify-between text-sm">
        <span className="text-slate-500">{shown ? `Week of ${label(shown.week)}` : `${series.length} weeks`}</span>
        <span className="font-semibold text-slate-900">{shown ? `${num(shown.count)} sign-ups` : `${num(series.reduce((a, b) => a + b.count, 0))} total`}</span>
      </div>
      <div className="flex gap-2">
        <div className="flex h-44 flex-col justify-between py-0.5 text-right text-[11px] tabular-nums text-slate-400" aria-hidden="true">
          {ticks.map((t, i) => (
            <span key={i}>{num(t)}</span>
          ))}
        </div>
        <div className="relative h-44 flex-1">
          <div className="absolute inset-0 flex flex-col justify-between" aria-hidden="true">
            {ticks.map((_, i) => (
              <div key={i} className="border-t border-slate-100" />
            ))}
          </div>
          <div className="absolute inset-0 flex items-end gap-[2px]" role="list" aria-label="Sign-ups per week" onMouseLeave={() => setHover(null)}>
            {series.map((s, i) => (
              <button
                type="button"
                role="listitem"
                key={s.week}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`Week of ${label(s.week)}: ${s.count} sign-ups`}
                className="group flex h-full flex-1 items-end focus:outline-none"
              >
                <span className={`block w-full rounded-t-[4px] transition-colors ${hover === i ? "bg-brand-hover" : "bg-brand"}`} style={{ height: `${Math.max(s.count ? 2 : 0, (s.count / max) * 100)}%` }} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-8 mt-1.5 flex justify-between text-[11px] text-slate-400" aria-hidden="true">
        <span>{series[0] && label(series[0].week)}</span>
        <span>{series.length && label(series[series.length - 1].week)}</span>
      </div>
    </div>
  );
}

/** Magnitude bars for a short ranked list; values are printed, bars are secondary. */
function RankBars({ rows, empty }) {
  if (!rows.length) return <p className="py-6 text-sm text-slate-500">{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-slate-700">{r.label}</span>
            <span className="shrink-0 font-semibold tabular-nums text-slate-900">{num(r.value)}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-brand" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const STATUS_LABEL = { ACTIVE: "Active", PENDING: "Pending approval", SUSPENDED: "Suspended", BANNED: "Banned", REJECTED: "Rejected" };

export default function ReportsPage() {
  const [institute, setInstitute] = useInstituteFilter(true);
  const [days, setDays] = useState(90);
  const { data, isLoading, isError } = useQuery(["adminAnalytics", institute, days], () => getAnalytics({ institute_id: institute, days }), { keepPreviousData: true });
  const t = data?.totals;
  const v = (x) => (isLoading ? "…" : num(x));
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Reports"
        subtitle="How your network is growing and what members use."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <InstituteSelect value={institute} onChange={setInstitute} allowAll className="w-56" />
            <Segmented
              label="Time range"
              value={String(days)}
              onChange={(x) => setDays(+x)}
              options={[
                { value: "30", label: "30d" },
                { value: "90", label: "90d" },
                { value: "180", label: "6m" },
                { value: "365", label: "1y" },
              ]}
            />
          </div>
        }
      />
      {isError && <p className="text-sm text-rose-600">Couldn't load reports.</p>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiTile label="Members" value={v(t?.members)} hint={t ? `${num(t.new_members)} joined in this period` : " "} />
        <KpiTile label="Active in last 30 days" value={v(t?.active_30d)} hint={t?.members ? `${Math.round((t.active_30d / t.members) * 100)}% of members` : " "} />
        <KpiTile label="Waiting for approval" value={v(t?.pending)} tone={t?.pending ? "warn" : undefined} hint="Sign-ups to review" />
        <KpiTile label="Open document requests" value={v(t?.open_documents)} tone={t?.open_documents ? "warn" : undefined} hint="Submitted, in review or needing info" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">New members per week</h2>
          <div className="mt-4">{data ? <SignupChart series={data.signups} /> : <div className="h-52 animate-pulse rounded-xl bg-slate-100" />}</div>
        </Card>
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Accounts by status</h2>
          <div className="mt-4">
            <RankBars rows={data ? Object.entries(data.status).filter(([, n]) => n).map(([k, n]) => ({ key: k, label: STATUS_LABEL[k] || k, value: n })) : []} empty={isLoading ? "Loading…" : "No accounts yet."} />
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiTile label="Groups" value={v(t?.groups)} />
        <KpiTile label="Group posts" value={v(t?.group_posts)} hint="In this period" />
        <KpiTile label="Upcoming events" value={v(t?.upcoming_events)} />
        <KpiTile label="RSVPs" value={v(t?.rsvps)} hint="In this period" />
        <KpiTile label="Open jobs" value={v(t?.open_jobs)} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Largest groups</h2>
          <p className="text-sm text-slate-500">Active members</p>
          <div className="mt-4">
            <RankBars rows={(data?.top_groups || []).map((g) => ({ key: g.id, label: g.name, value: g.members }))} empty={isLoading ? "Loading…" : "No groups yet."} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900">Recent events</h2>
          <p className="text-sm text-slate-500">People going</p>
          <div className="mt-4">
            <RankBars rows={(data?.recent_events || []).map((e) => ({ key: e.id, label: `${e.title} · ${fmtDate(e.time)}`, value: e.going }))} empty={isLoading ? "Loading…" : "No events yet."} />
          </div>
        </Card>
      </div>
    </div>
  );
}
