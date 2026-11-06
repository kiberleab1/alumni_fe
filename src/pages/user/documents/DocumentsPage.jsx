import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { AcademicCapIcon, CheckIcon, ClipboardDocumentCheckIcon, DocumentTextIcon, EnvelopeIcon, ExclamationTriangleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { getMyDocuments, replyToDocument, requestDocument, withdrawDocument } from "src/api";
import { useSocketEvent } from "src/lib/realtime";
import { Button, Card, EmptyState, Field, Modal, PageHeader, Pill, Segmented, SkeletonRow, apiError, cx, inputClass, timeAgo } from "src/components/ui";

const TYPE_ICON = { degree: AcademicCapIcon, transcript: DocumentTextIcon, enrollment: EnvelopeIcon, other: ClipboardDocumentCheckIcon };
const TYPE_HINT = {
  degree: "Confirms your degree to an employer or another university.",
  transcript: "Your official grades, sent by the registrar.",
  enrollment: "A letter confirming when you studied here.",
  other: "Anything else the registrar can provide.",
};
// the happy path shown as a tracker; needs_info / rejected are shown inline
const STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "in_review", label: "In review" },
  { key: "approved", label: "Approved" },
  { key: "delivered", label: "Delivered" },
];
const STATUS = {
  submitted: ["Submitted", "slate"],
  in_review: ["In review", "brand"],
  needs_info: ["Needs your input", "amber"],
  approved: ["Approved", "green"],
  rejected: ["Rejected", "rose"],
  delivered: ["Delivered", "green"],
};

function Tracker({ status }) {
  const index = status === "needs_info" ? 1 : status === "rejected" ? 1 : STEPS.findIndex((s) => s.key === status);
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {STEPS.map((s, i) => {
        const done = i < index || (i === index && status === "delivered");
        const current = i === index && status !== "delivered";
        return (
          <li key={s.key} className="flex flex-1 items-center gap-2">
            <span
              className={cx(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                done ? "bg-brand text-brand-ink" : current ? (status === "needs_info" ? "bg-amber-500 text-white" : status === "rejected" ? "bg-rose-500 text-white" : "bg-brand-soft text-link ring-2 ring-brand") : "bg-slate-100 text-slate-400"
              )}
              aria-current={current ? "step" : undefined}
            >
              {done ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={cx("hidden text-xs font-medium sm:inline", done || current ? "text-slate-800" : "text-slate-400")}>{s.label}</span>
            {i < STEPS.length - 1 && <span className={cx("h-px flex-1", i < index ? "bg-brand" : "bg-slate-200")} />}
          </li>
        );
      })}
    </ol>
  );
}

function NewRequest({ types, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ document_type: "degree", purpose: "", delivery: "email", recipient_name: "", recipient_email: "", note: "" });
  const [error, setError] = useState(null);
  const create = useMutation(requestDocument, {
    onSuccess: (d) => {
      toast.success(`Request ${d.reference_no} sent to the registrar`);
      queryClient.invalidateQueries("myDocuments");
      onClose();
    },
    onError: (e) => setError(apiError(e)),
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });
  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title="Request a document"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={create.isLoading} onClick={() => create.mutate(form)} disabled={form.purpose.trim().length < 3 || (form.delivery === "email" && !form.recipient_email)}>
            Send request
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">What do you need?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(types || {}).map(([value, label]) => {
              const Icon = TYPE_ICON[value] || ClipboardDocumentCheckIcon;
              const on = form.document_type === value;
              return (
                <label key={value} className={cx("flex cursor-pointer gap-3 rounded-xl border p-3 transition", on ? "border-brand bg-brand-soft" : "border-slate-200 hover:border-slate-300")}>
                  <input type="radio" name="doc-type" value={value} checked={on} onChange={set("document_type")} className="sr-only" />
                  <Icon className={cx("h-6 w-6 shrink-0", on ? "text-link" : "text-slate-400")} />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{label}</span>
                    <span className="block text-xs text-slate-500">{TYPE_HINT[value]}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <Field label="What is it for?" htmlFor="doc-purpose">
          <input id="doc-purpose" className={inputClass} maxLength={300} value={form.purpose} onChange={set("purpose")} placeholder="e.g. Job application at Safaricom" />
        </Field>
        <Field label="How should it be delivered?">
          <Segmented
            value={form.delivery}
            onChange={set("delivery")}
            label="Delivery"
            options={[
              { value: "email", label: "Email it to someone" },
              { value: "pickup", label: "I'll collect it" },
            ]}
          />
        </Field>
        {form.delivery === "email" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Recipient name" htmlFor="doc-rname">
              <input id="doc-rname" className={inputClass} value={form.recipient_name} onChange={set("recipient_name")} placeholder="Organisation or person" />
            </Field>
            <Field label="Recipient email" htmlFor="doc-remail">
              <input id="doc-remail" type="email" className={inputClass} value={form.recipient_email} onChange={set("recipient_email")} placeholder="hr@company.com" />
            </Field>
          </div>
        )}
        <Field label="Note for the registrar (optional)" htmlFor="doc-note">
          <textarea id="doc-note" rows={2} className={inputClass} maxLength={1000} value={form.note} onChange={set("note")} />
        </Field>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
      </div>
    </Modal>
  );
}

function RequestCard({ d }) {
  const queryClient = useQueryClient();
  const [reply, setReply] = useState("");
  const [open, setOpen] = useState(d.status === "needs_info");
  const refresh = () => queryClient.invalidateQueries("myDocuments");
  const send = useMutation(replyToDocument, {
    onSuccess: () => {
      toast.success("Sent to the registrar");
      setReply("");
      refresh();
    },
    onError: (e) => toast.error(apiError(e)),
  });
  const withdraw = useMutation(withdrawDocument, {
    onSuccess: () => {
      toast.success("Request withdrawn");
      refresh();
    },
    onError: (e) => toast.error(apiError(e)),
  });
  const [label, tone] = STATUS[d.status] || STATUS.submitted;
  const Icon = TYPE_ICON[d.document_type] || ClipboardDocumentCheckIcon;
  const lastRegistrarNote = [...d.history].reverse().find((h) => h.by === "registrar" && h.note);
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{d.document_label}</p>
          <p className="text-sm text-slate-600">{d.purpose}</p>
          <p className="text-xs text-slate-500">
            {d.reference_no && `${d.reference_no} · `}
            {d.delivery === "pickup" ? "Collect in person" : d.recipient_email ? `To ${d.recipient_name ? `${d.recipient_name} ` : ""}<${d.recipient_email}>` : ""} · requested {timeAgo(d.created_at)}
          </p>
        </div>
        <Pill tone={tone}>{label}</Pill>
      </div>
      <div className="mt-4">
        <Tracker status={d.status} />
      </div>
      {d.status === "needs_info" && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="flex items-start gap-2 text-sm text-amber-900">
            <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
            <span>
              <strong>The registrar needs something:</strong> {lastRegistrarNote?.note || d.comment || "Please reply with the requested details."}
            </span>
          </p>
          <div className="mt-2 flex gap-2">
            <input className={inputClass} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Your reply" aria-label="Reply to the registrar" maxLength={1000} />
            <Button disabled={!reply.trim()} loading={send.isLoading} onClick={() => send.mutate({ id: d.id, message: reply })}>
              Send
            </Button>
          </div>
        </div>
      )}
      {d.status === "rejected" && (lastRegistrarNote?.note || d.comment) && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">Reason: {lastRegistrarNote?.note || d.comment}</p>}
      <div className="mt-3 flex items-center justify-between">
        <button onClick={() => setOpen((o) => !o)} className="text-xs font-semibold text-link hover:underline" aria-expanded={open}>
          {open ? "Hide history" : `History (${d.history.length})`}
        </button>
        {d.status === "submitted" && (
          <Button size="sm" variant="ghost" loading={withdraw.isLoading} onClick={() => window.confirm("Withdraw this request?") && withdraw.mutate(d.id)}>
            Withdraw
          </Button>
        )}
      </div>
      {open && (
        <ol className="mt-2 space-y-2 border-l border-slate-200 pl-4">
          {d.history
            .slice()
            .reverse()
            .map((h, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium text-slate-800">{(STATUS[h.status] || [h.status])[0]}</span>
                <span className="text-slate-500"> · {h.by === "registrar" ? "Registrar" : "You"} · {timeAgo(h.at)}</span>
                {h.note && <p className="text-slate-600">{h.note}</p>}
              </li>
            ))}
        </ol>
      )}
    </Card>
  );
}

/** Documents & verification (design board 7). */
export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const { data, isLoading } = useQuery("myDocuments", getMyDocuments);
  useSocketEvent("document:update", () => queryClient.invalidateQueries("myDocuments"));
  const items = data?.items || [];
  return (
    <div className="ui-scope mx-auto max-w-4xl">
      <PageHeader
        title="Documents"
        subtitle="Request degree verification, transcripts and letters from the registrar, and follow each request."
        actions={
          <Button onClick={() => setCreating(true)}>
            <PlusIcon className="h-4 w-4" /> New request
          </Button>
        }
      />
      {isLoading ? (
        <Card>
          <SkeletonRow />
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={ClipboardDocumentCheckIcon}
            title="No requests yet"
            description="Need to prove your degree to an employer? Request it here and the registrar will send it for you."
            action={<Button onClick={() => setCreating(true)}>Request a document</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((d) => (
            <RequestCard key={d.id} d={d} />
          ))}
        </div>
      )}
      {creating && <NewRequest types={data?.document_types} onClose={() => setCreating(false)} />}
    </div>
  );
}
