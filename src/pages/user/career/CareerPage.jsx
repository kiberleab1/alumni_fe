import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { BriefcaseIcon, EyeIcon, MapPinIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deletePosition, getMyCareer, savePosition, updateMySettings } from "src/api";
import { Button, Card, EmptyState, Field, Modal, PageHeader, Pill, Segmented, Spinner, Switch, apiError, cx, inputClass } from "src/components/ui";

const TYPES = [
  ["", "Not specified"],
  ["full_time", "Full-time"],
  ["part_time", "Part-time"],
  ["contract", "Contract"],
  ["internship", "Internship"],
  ["volunteer", "Volunteer"],
  ["self_employed", "Self-employed"],
];
const TYPE_LABEL = Object.fromEntries(TYPES);
const VISIBILITY = [
  { value: "members", label: "All alumni" },
  { value: "connections", label: "Connections" },
  { value: "only_me", label: "Only me" },
];
const VIS_LABEL = Object.fromEntries(VISIBILITY.map((v) => [v.value, v.label]));
const EMPTY = { title: "", company: "", employment_type: "", location: "", start_date: "", end_date: "", is_current: false, description: "", visibility: "members" };
const toMonth = (d) => (d ? String(d).slice(0, 7) : "");
const fromMonth = (m) => (m ? `${m}-01` : null);

function PositionForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...initial, start_date: toMonth(initial?.start_date), end_date: toMonth(initial?.end_date), employment_type: initial?.employment_type || "", company: initial?.company || "", location: initial?.location || "" }));
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e }));
  const save = useMutation(savePosition, {
    onSuccess: (p) => {
      toast.success(initial?.id ? "Position updated" : "Position added");
      onSaved(p);
    },
    onError: (e) => setError(apiError(e)),
  });
  const submit = (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError("Add a job title");
    if (!form.start_date) return setError("Add the month you started");
    if (!form.is_current && form.end_date && form.end_date < form.start_date) return setError("The end date can't be before the start date");
    save.mutate({
      id: initial?.id,
      title: form.title,
      company: form.company,
      employment_type: form.employment_type || null,
      location: form.location,
      description: form.description,
      start_date: fromMonth(form.start_date),
      end_date: form.is_current ? null : fromMonth(form.end_date),
      is_current: form.is_current,
      visibility: form.visibility,
    });
  };
  const thisMonth = new Date().toISOString().slice(0, 7);
  return (
    <form onSubmit={submit} className="space-y-4" id="position-form">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Job title" htmlFor="pos-title">
          <input id="pos-title" className={inputClass} value={form.title} onChange={set("title")} placeholder="e.g. Software Engineer" autoFocus />
        </Field>
        <Field label="Company or organisation" htmlFor="pos-company" hint="Used to show you on matching job posts">
          <input id="pos-company" className={inputClass} value={form.company} onChange={set("company")} placeholder="e.g. Ethio Telecom" />
        </Field>
        <Field label="Employment type" htmlFor="pos-type">
          <select id="pos-type" className={inputClass} value={form.employment_type} onChange={set("employment_type")}>
            {TYPES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location" htmlFor="pos-location">
          <input id="pos-location" className={inputClass} value={form.location} onChange={set("location")} placeholder="City, country or Remote" />
        </Field>
        <Field label="Start" htmlFor="pos-start">
          <input id="pos-start" type="month" max={thisMonth} className={inputClass} value={form.start_date} onChange={set("start_date")} />
        </Field>
        <Field label="End" htmlFor="pos-end">
          <input id="pos-end" type="month" max={thisMonth} className={inputClass} value={form.is_current ? "" : form.end_date} onChange={set("end_date")} disabled={form.is_current} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" checked={form.is_current} onChange={set("is_current")} /> I work here now
      </label>
      <Field label="What you did" htmlFor="pos-desc">
        <textarea id="pos-desc" rows={3} className={inputClass} value={form.description} onChange={set("description")} placeholder="Responsibilities, achievements, tools you used" />
      </Field>
      <Field label="Who can see this position">
        <Segmented value={form.visibility} onChange={set("visibility")} options={VISIBILITY} label="Who can see this position" size="sm" />
      </Field>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={save.isLoading}>
          {initial?.id ? "Save changes" : "Add position"}
        </Button>
      </div>
    </form>
  );
}

/** Career history (design board 13): a timeline of positions. */
export default function CareerPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery("myCareer", getMyCareer);
  const [editing, setEditing] = useState(null); // null | {} (new) | position
  const [confirm, setConfirm] = useState(null);
  const items = data?.items || [];

  const refresh = () => queryClient.invalidateQueries("myCareer");
  const remove = useMutation(deletePosition, {
    onSuccess: () => {
      toast.success("Position removed");
      setConfirm(null);
      refresh();
    },
    onError: (e) => toast.error(apiError(e)),
  });
  const open = useMutation((v) => updateMySettings({ open_to_opportunities: v }), {
    onMutate: (v) => queryClient.setQueryData("myCareer", (d) => ({ ...d, open_to_opportunities: v })),
    onSuccess: (s) => toast.success(s.open_to_opportunities ? "You're marked as open to opportunities" : "Open to opportunities turned off"),
    onError: (e) => {
      toast.error(apiError(e));
      refresh();
    },
  });

  return (
    <div className="ui-scope mx-auto max-w-5xl">
      <PageHeader
        title="Career history"
        subtitle="Your positions, newest first. Alumni use this to find mentors, referrals and classmates at their company."
        actions={
          <Button onClick={() => setEditing({})}>
            <PlusIcon className="h-4 w-4" /> Add a position
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="self-start lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-16 text-slate-400">
              <Spinner />
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={BriefcaseIcon}
              title="No positions yet"
              description="Add your current or most recent job so classmates and recruiters can find you."
              action={<Button onClick={() => setEditing({})}>Add your first position</Button>}
            />
          ) : (
            <ol className="relative p-5">
              {items.map((p, i) => (
                <li key={p.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < items.length - 1 && <span className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-slate-200" aria-hidden="true" />}
                  <span className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", p.is_current ? "bg-brand-soft text-link" : "bg-slate-100 text-slate-500")}>
                    <BriefcaseIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900">{p.title}</h3>
                        <p className="text-sm text-slate-600">{[p.company, TYPE_LABEL[p.employment_type || ""] !== "Not specified" && TYPE_LABEL[p.employment_type]].filter(Boolean).join(" · ")}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                          {p.duration && <span>{p.duration}</span>}
                          {p.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPinIcon className="h-3.5 w-3.5" /> {p.location}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {p.is_current && <Pill tone="green">Current</Pill>}
                        <Pill tone={p.visibility === "members" ? "slate" : "amber"}>
                          <EyeIcon className="h-3 w-3" /> {VIS_LABEL[p.visibility]}
                        </Pill>
                        <button onClick={() => setEditing(p)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label={`Edit ${p.title}`}>
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => setConfirm(p)} className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${p.title}`}>
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {p.description && <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{p.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Open to opportunities</h2>
                <p className="mt-1 text-sm text-slate-500">Shows a badge on your profile so alumni know you'd welcome referrals and job leads.</p>
              </div>
              <Switch checked={!!data?.open_to_opportunities} onChange={(v) => open.mutate(v)} label="Open to opportunities" />
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900">Who sees this</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li>
                <strong className="text-slate-800">All alumni</strong>: anyone in your institute's network.
              </li>
              <li>
                <strong className="text-slate-800">Connections</strong>: only people you're connected with.
              </li>
              <li>
                <strong className="text-slate-800">Only me</strong>: hidden from everyone else; still counts toward your profile.
              </li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">Admins of your institute can always see your full history.</p>
          </Card>
        </div>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit position" : "Add a position"} size="lg">
        {editing && (
          <PositionForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              refresh();
            }}
          />
        )}
      </Modal>
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Delete this position?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={remove.isLoading} onClick={() => remove.mutate(confirm.id)}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          {confirm?.title}
          {confirm?.company ? ` at ${confirm.company}` : ""} will be removed from your career history.
        </p>
      </Modal>
    </div>
  );
}
