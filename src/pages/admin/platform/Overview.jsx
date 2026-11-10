/** Super admin: the whole platform at a glance, one row per institute. */
import { useQuery } from "react-query";
import { AdjustmentsHorizontalIcon, BuildingLibraryIcon, PlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { getPlatformOverview } from "src/api";
import { Button, Card, EmptyState, PageHeader, Pill } from "src/components/ui";
import { KpiTile, num, when } from "./shared";

const MODE = { open: ["Open", "green"], approval: ["Approval", "amber"], invite: ["Invite only", "slate"] };

export default function PlatformOverview({ go }) {
  const { data, isLoading, isError } = useQuery("platformOverview", getPlatformOverview, { staleTime: 30_000 });
  const t = data?.totals;
  const v = (x) => (isLoading ? "…" : num(x));
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Platform overview"
        subtitle="Every institute on the platform, and how each is set up."
        actions={
          <Button onClick={() => go("Create Institute")}>
            <PlusIcon className="h-4 w-4" /> Add institute
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiTile label="Institutes" value={v(t?.institutes)} />
        <KpiTile label="Members" value={v(t?.members)} />
        <KpiTile label="Active (30 days)" value={v(t?.active_30d)} />
        <KpiTile label="Pending approval" value={v(t?.pending)} tone={t?.pending ? "warn" : undefined} />
        <KpiTile label="Admins" value={v(t?.admins)} />
        <KpiTile label="Upcoming events" value={v(t?.upcoming_events)} />
      </div>
      <Card className="overflow-hidden">
        {isError ? (
          <p className="p-6 text-sm text-rose-600">Couldn't load the overview.</p>
        ) : isLoading ? (
          <div className="h-64 animate-pulse bg-slate-100" />
        ) : !data.institutes.length ? (
          <EmptyState icon={BuildingLibraryIcon} title="No institutes yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Institute</th>
                  <th className="px-4 py-3 text-right">Members</th>
                  <th className="hidden px-4 py-3 text-right md:table-cell">Active 30d</th>
                  <th className="hidden px-4 py-3 text-right md:table-cell">Pending</th>
                  <th className="hidden px-4 py-3 text-right lg:table-cell">Admins</th>
                  <th className="hidden px-4 py-3 text-right lg:table-cell">Groups</th>
                  <th className="hidden px-4 py-3 xl:table-cell">Sign-up</th>
                  <th className="hidden px-4 py-3 xl:table-cell">Features off</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.institutes.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{i.name}</p>
                      <p className="text-xs text-slate-500">
                        {i.sub_url} · last sign-up {when(i.last_signup).toLowerCase()}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{num(i.members)}</td>
                    <td className="hidden px-4 py-3 text-right tabular-nums md:table-cell">{num(i.active_30d)}</td>
                    <td className="hidden px-4 py-3 text-right tabular-nums md:table-cell">{i.pending ? <span className="font-semibold text-amber-700">{num(i.pending)}</span> : "0"}</td>
                    <td className="hidden px-4 py-3 text-right tabular-nums lg:table-cell">{i.admins ? num(i.admins) : <span className="text-rose-600">None</span>}</td>
                    <td className="hidden px-4 py-3 text-right tabular-nums lg:table-cell">{num(i.groups)}</td>
                    <td className="hidden px-4 py-3 xl:table-cell">
                      <Pill tone={MODE[i.signup_mode][1]}>{MODE[i.signup_mode][0]}</Pill>
                    </td>
                    <td className="hidden max-w-[14rem] px-4 py-3 text-xs text-slate-500 xl:table-cell">{i.features_off.length ? i.features_off.join(", ") : "—"}</td>
                    <td className="px-2 py-2">
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => go("Members", { institute_id: i.id, status: i.pending ? "PENDING" : "" })} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Members" aria-label={`Members of ${i.name}`}>
                          <UsersIcon className="h-5 w-5" />
                        </button>
                        <button type="button" onClick={() => go("Institute Settings", { id: i.id })} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Settings" aria-label={`Settings for ${i.name}`}>
                          <AdjustmentsHorizontalIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
