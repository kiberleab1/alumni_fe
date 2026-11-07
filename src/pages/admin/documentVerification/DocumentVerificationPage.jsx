/**
 * Registrar queue for member document requests (degree verification,
 * transcripts, letters). Filter by status, open a request, move it along and
 * leave a note; the member is notified and sees the history on their side.
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ClipboardDocumentCheckIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { getAdminDocuments, updateDocumentStatus } from "src/api";
import { Button, Card, EmptyState, Field, Modal, Pill, SearchInput, SkeletonRow, Tabs, apiError, cx, inputClass, timeAgo } from "src/components/ui";

const LABEL = { submitted: "Submitted", in_review: "In review", needs_info: "Needs info", approved: "Approved", rejected: "Rejected", delivered: "Delivered" };
const TONE = { submitted: "amber", in_review: "brand", needs_info: "amber", approved: "green", rejected: "rose", delivered: "green" };
// what an admin can move a request to from each status
const NEXT = {
  submitted: ["in_review", "needs_info", "approved", "rejected"],
  in_review: ["needs_info", "approved", "rejected"],
  needs_info: ["in_review", "rejected"],
  approved: ["delivered", "in_review"],
  rejected: ["in_review"],
  delivered: [],
};
const ACTION = { in_review: "Start review", needs_info: "Ask for information", approved: "Approve", rejected: "Reject", delivered: "Mark delivered" };
const FILTERS = ["open", "submitted", "in_review", "needs_info", "approved", "delivered", "rejected", "all"];

function RequestPanel({ doc, onClose }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const update = useMutation(updateDocumentStatus, {
    onSuccess: () => {
      toast.success("Updated. The member has been notified.");
      queryClient.invalidateQueries("adminDocuments");
      setStatus("");
      setNote("");
      onClose();
    },
    onError: (e) => toast.error(apiError(e)),
  });
  if (!doc) return null;
  const needsNote = status === "needs_info" || status === "rejected";
  const options = NEXT[doc.status] || [];
  return (
    <Modal open={!!doc} onClose={onClose} title={`${doc.document_label} · ${doc.reference_no || ""}`} size="lg">
      <div className="space-y-5">
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Requested by</p>
            <p className="mt-1 font-medium text-slate-900">{doc.requester.name}</p>
            <p className="text-slate-600">{doc.requester.email}</p>
            {doc.requester.graduation_year && <p className="text-slate-500">Class of {doc.requester.graduation_year}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Send to</p>
            <p className="mt-1 text-slate-900">{doc.recipient_name || "—"}</p>
            <p className="inline-flex items-center gap-1 text-slate-600">
              <EnvelopeIcon className="h-4 w-4" /> {doc.recipient_email || "—"}
            </p>
            <p className="text-slate-500">Delivery: {doc.delivery || "email"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Purpose</p>
            <p className="mt-1 text-slate-800">{doc.purpose || "—"}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">History</p>
          <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
            {[...doc.history].reverse().map((h, i) => (
              <li key={i} className="text-sm">
                <p>
                  <span className="font-medium text-slate-900">{LABEL[h.status] || h.status}</span>
                  <span className="text-slate-500">
                    {" "}
                    · {h.by === "member" ? doc.requester.name.split(" ")[0] : "Registrar"} · {timeAgo(h.at)}
                  </span>
                </p>
                {h.note && <p className="mt-0.5 rounded-lg bg-slate-50 px-3 py-2 text-slate-700">{h.note}</p>}
              </li>
            ))}
          </ol>
        </div>

        {options.length > 0 ? (
          <form
            className="space-y-4 rounded-xl bg-slate-50 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              update.mutate({ id: doc.id, status, comment: note.trim() });
            }}
          >
            <p className="text-sm font-semibold text-slate-900">Update this request</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="New status">
              {options.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={status === s}
                  onClick={() => setStatus(s)}
                  className={cx("rounded-full px-3 py-1.5 text-sm font-medium ring-1", status === s ? "bg-brand text-white ring-brand" : "bg-white text-slate-700 ring-slate-300 hover:ring-slate-400")}
                >
                  {ACTION[s]}
                </button>
              ))}
            </div>
            <Field label={needsNote ? (status === "needs_info" ? "What do you need from the member?" : "Reason (shown to the member)") : "Note to the member (optional)"} htmlFor="doc-note">
              <textarea id="doc-note" rows={3} className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} placeholder={status === "needs_info" ? "e.g. Please confirm your student ID number" : ""} />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" disabled={!status || (needsNote && !note.trim())} loading={update.isLoading}>
                {status ? ACTION[status] : "Choose an action"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">This request is complete.</p>
        )}
      </div>
    </Modal>
  );
}

export default function DocumentVerificationPage() {
  const [status, setStatus] = useState("open");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const { data, isLoading } = useQuery(["adminDocuments", status, search, page], () => getAdminDocuments({ status, search, page }), { keepPreviousData: true });
  const counts = data?.counts || {};
  const items = data?.items || [];
  return (
    <div className="ui-scope mx-auto max-w-6xl p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Document requests</h1>
      <p className="mt-1 text-sm text-slate-500">Verification letters and transcripts requested by members. Members are notified each time you update a request.</p>
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={status}
          onChange={(v) => (setStatus(v), setPage(1))}
          tabs={FILTERS.map((f) => ({ value: f, label: f === "open" ? "Open" : f === "all" ? "All" : LABEL[f], count: counts[f] || undefined }))}
        />
        <SearchInput value={search} onChange={(v) => (setSearch(v), setPage(1))} placeholder="Search name, email or reference" className="lg:w-72" />
      </div>
      <Card className="mt-4 overflow-hidden">
        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : !items.length ? (
          <EmptyState icon={ClipboardDocumentCheckIcon} title={status === "open" ? "Nothing waiting" : "No requests here"} description={search ? "Try a different search." : "New member requests will appear here."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Member</th>
                  <th className="hidden px-4 py-3 md:table-cell">Purpose</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((d) => (
                  <tr key={d.id} onClick={() => setOpen(d)} className="cursor-pointer hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <button type="button" className="text-left font-medium text-slate-900 hover:underline" onClick={() => setOpen(d)}>
                        {d.document_label}
                      </button>
                      <p className="text-xs text-slate-500">{d.reference_no}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-900">{d.requester.name}</p>
                      <p className="text-xs text-slate-500">{d.requester.graduation_year ? `Class of ${d.requester.graduation_year}` : d.requester.email}</p>
                    </td>
                    <td className="hidden max-w-xs truncate px-4 py-3 text-slate-600 md:table-cell">{d.purpose}</td>
                    <td className="px-4 py-3">
                      <Pill tone={TONE[d.status]}>{LABEL[d.status]}</Pill>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-slate-500 sm:table-cell">{timeAgo(d.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {data?.totalPage > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-slate-500">
            Page {page} of {data.totalPage}
          </span>
          <Button variant="secondary" size="sm" disabled={page >= data.totalPage} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
      <RequestPanel doc={open} onClose={() => setOpen(null)} />
    </div>
  );
}
