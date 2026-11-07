/**
 * Moderation queue: messages members reported from their inbox. Admins see a
 * copy of the message (kept even if it was unsent), who reported it and how
 * often the sender has been reported, then dismiss it or record an action.
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FlagIcon } from "@heroicons/react/24/outline";
import { getMessageReports, resolveMessageReport } from "src/api";
import { Avatar, Button, Card, EmptyState, Pill, SkeletonRow, Tabs, apiError, inputClass, timeAgo } from "src/components/ui";

const REASON = { spam: "Spam", harassment: "Harassment", inappropriate: "Inappropriate", scam: "Scam or fraud", other: "Other" };
const STATUS = { open: "Open", actioned: "Action taken", dismissed: "Dismissed" };

function ReportCard({ r }) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const resolve = useMutation(resolveMessageReport, {
    onSuccess: (_, v) => {
      toast.success(v.status === "dismissed" ? "Report dismissed" : v.status === "open" ? "Report reopened" : "Action recorded");
      queryClient.invalidateQueries("messageReports");
    },
    onError: (e) => toast.error(apiError(e)),
  });
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={r.reported.name} photo={r.reported.photo} size="sm" />
          <div>
            <p className="font-semibold text-slate-900">{r.reported.name}</p>
            <p className="text-xs text-slate-500">
              {r.reported.reports_total > 1 ? `Reported ${r.reported.reports_total} times in total` : "First report"} · {r.reported.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="rose">{REASON[r.reason] || r.reason}</Pill>
          <Pill tone={r.status === "open" ? "amber" : r.status === "actioned" ? "green" : "slate"}>{STATUS[r.status]}</Pill>
        </div>
      </div>
      <blockquote className="mt-4 whitespace-pre-wrap rounded-lg border-l-4 border-rose-300 bg-rose-50/50 px-4 py-3 text-sm text-slate-800">{r.message || "(no text)"}</blockquote>
      <p className="mt-2 text-xs text-slate-500">
        Reported by {r.reporter.name} · {timeAgo(r.created_at)}
      </p>
      {r.details && <p className="mt-2 text-sm text-slate-700">“{r.details}”</p>}
      {r.status === "open" ? (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <label htmlFor={`note-${r.id}`} className="sr-only">
            Note
          </label>
          <input id={`note-${r.id}`} className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note, e.g. Warned the member by email" maxLength={1000} />
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" loading={resolve.isLoading && resolve.variables?.status === "dismissed"} onClick={() => resolve.mutate({ id: r.id, status: "dismissed", note })}>
              Dismiss
            </Button>
            <Button loading={resolve.isLoading && resolve.variables?.status === "actioned"} onClick={() => resolve.mutate({ id: r.id, status: "actioned", note })}>
              Mark action taken
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
          <span>
            {STATUS[r.status]} by {r.reviewed_by || "an admin"} {r.reviewed_at && `· ${timeAgo(r.reviewed_at)}`}
            {r.resolution_note && <> · “{r.resolution_note}”</>}
          </span>
          <Button variant="ghost" size="sm" onClick={() => resolve.mutate({ id: r.id, status: "open" })}>
            Reopen
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function MessageReportsPage() {
  const [status, setStatus] = useState("open");
  const { data, isLoading } = useQuery(["messageReports", status], () => getMessageReports({ status }), { keepPreviousData: true });
  return (
    <div className="ui-scope mx-auto max-w-4xl p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Message reports</h1>
      <p className="mt-1 text-sm text-slate-500">Messages members reported. Reporters stay anonymous to the person they reported. To suspend an account, use Users.</p>
      <Tabs
        className="mt-6"
        value={status}
        onChange={setStatus}
        tabs={[
          { value: "open", label: "Open", count: data?.open_count || undefined },
          { value: "actioned", label: "Action taken" },
          { value: "dismissed", label: "Dismissed" },
          { value: "all", label: "All" },
        ]}
      />
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <Card>
            <SkeletonRow />
            <SkeletonRow />
          </Card>
        ) : !data?.items?.length ? (
          <Card>
            <EmptyState icon={FlagIcon} title={status === "open" ? "No open reports" : "Nothing here"} description="Reports members send from their inbox appear here." />
          </Card>
        ) : (
          data.items.map((r) => <ReportCard key={r.id} r={r} />)
        )}
      </div>
    </div>
  );
}
