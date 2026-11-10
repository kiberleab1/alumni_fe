/** Send a message to all members or a slice of them, in the app and/or by e-mail. */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { MegaphoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { getAnnouncements, previewAnnouncementAudience, sendAnnouncement } from "src/api";
import { Button, Card, EmptyState, Field, Modal, PageHeader, Pill, apiError, cx, inputClass } from "src/components/ui";
import { useDepartments, useSession } from "../kit";
import { InstituteSelect, num, useDebounced, when } from "./shared";

const AUDIENCES = [
  ["all", "Everyone"],
  ["role", "A role"],
  ["class", "A graduating class"],
  ["department", "A department"],
];
const describeAudience = (a, departments) => {
  if (!a || a.type === "all") return "Everyone";
  if (a.type === "role") return a.value === "alumni" ? "Alumni" : a.value === "admin" ? "Admins" : "Members";
  if (a.type === "class") return `Class of ${a.value}`;
  if (a.type === "department") return departments.find((d) => d.value === a.value)?.label || "A department";
  return a.type;
};

export default function AnnouncementsPage() {
  const { isSuper, instituteId } = useSession();
  const client = useQueryClient();
  const [institute, setInstitute] = useState(instituteId);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("all");
  const [value, setValue] = useState("");
  const [channels, setChannels] = useState(["in_app"]);
  const [confirming, setConfirming] = useState(false);
  const { data: departments = [] } = useDepartments();
  const audience = type === "all" ? { type } : { type, value: type === "class" ? Number(value) : value };
  const audienceReady = type === "all" || (type === "class" ? /^\d{4}$/.test(String(value)) : !!value);
  const key = useDebounced(JSON.stringify([institute, audience]), 400);
  const preview = useQuery(["announceAudience", key], () => previewAnnouncementAudience({ institute_id: isSuper ? institute : undefined, audience }), { enabled: audienceReady, retry: false });
  const history = useQuery(["adminAnnouncements", institute], () => getAnnouncements({ institute_id: isSuper ? institute : undefined }), {
    refetchInterval: (d) => (d?.items?.some((a) => a.status === "sending") ? 3000 : false),
  });
  const send = useMutation(() => sendAnnouncement({ institute_id: isSuper ? institute : undefined, title: title.trim(), body: body.trim(), audience, channels }), {
    onSuccess: (a) => {
      toast.success(`Sending to ${num(a.recipients)} member${a.recipients === 1 ? "" : "s"}`);
      setConfirming(false);
      setTitle("");
      setBody("");
      client.invalidateQueries("adminAnnouncements");
    },
    onError: (e) => {
      setConfirming(false);
      toast.error(apiError(e, "Couldn't send"));
    },
  });
  const count = preview.data?.count;
  const ready = title.trim().length >= 3 && body.trim() && audienceReady && channels.length && count > 0;
  const toggleChannel = (c) => setChannels((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  const years = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Announcements" subtitle="Reach members in their notifications and inbox." actions={<InstituteSelect value={institute} onChange={setInstitute} className="w-60" />} />
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="space-y-5 p-5 sm:p-6 lg:col-span-3">
          <Field label="Title" htmlFor="ann-title" hint={`${title.length}/140`}>
            <input id="ann-title" maxLength={140} className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Homecoming registration is open" />
          </Field>
          <Field label="Message" htmlFor="ann-body" hint={`${body.length}/5000`}>
            <textarea id="ann-body" rows={6} maxLength={5000} className={inputClass} value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Send to" htmlFor="ann-aud">
              <select id="ann-aud" className={inputClass} value={type} onChange={(e) => (setType(e.target.value), setValue(""))}>
                {AUDIENCES.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            {type === "role" && (
              <Field label="Role" htmlFor="ann-role">
                <select id="ann-role" className={inputClass} value={value} onChange={(e) => setValue(e.target.value)}>
                  <option value="">Choose…</option>
                  <option value="alumni">Alumni</option>
                  <option value="user">Members</option>
                  <option value="admin">Admins</option>
                </select>
              </Field>
            )}
            {type === "class" && (
              <Field label="Graduation year" htmlFor="ann-year">
                <select id="ann-year" className={inputClass} value={value} onChange={(e) => setValue(e.target.value)}>
                  <option value="">Choose…</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {type === "department" && (
              <Field label="Department" htmlFor="ann-dept">
                <select id="ann-dept" className={inputClass} value={value} onChange={(e) => setValue(e.target.value)}>
                  <option value="">Choose…</option>
                  {departments
                    .filter((d) => !institute || d.institute === institute)
                    .map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                </select>
              </Field>
            )}
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Deliver by</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {[
                ["in_app", "In-app notification"],
                ["email", "E-mail"],
              ].map(([c, l]) => (
                <label key={c} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm ring-1 ring-slate-200">
                  <input type="checkbox" checked={channels.includes(c)} onChange={() => toggleChannel(c)} /> {l}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-600" aria-live="polite">
              {!audienceReady ? "Choose who to send to" : preview.isLoading ? "Counting recipients…" : count != null ? <><b className="text-slate-900">{num(count)}</b> active member{count === 1 ? "" : "s"} will receive this</> : "Couldn't count recipients"}
            </p>
            <Button disabled={!ready} onClick={() => setConfirming(true)}>
              <PaperAirplaneIcon className="h-4 w-4" /> Review and send
            </Button>
          </div>
        </Card>
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sent</h2>
          <div className="mt-3 space-y-3">
            {history.isLoading ? (
              <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
            ) : !history.data?.items?.length ? (
              <Card>
                <EmptyState icon={MegaphoneIcon} title="No announcements yet" description="What you send appears here." />
              </Card>
            ) : (
              history.data.items.map((a) => (
                <Card key={a.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 font-semibold text-slate-900">{a.title}</p>
                    <Pill tone={a.status === "sent" ? "green" : a.status === "failed" ? "rose" : "amber"}>{a.status === "sent" ? "Sent" : a.status === "failed" ? "Failed" : "Sending"}</Pill>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.body}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {describeAudience(a.audience, departments)} · {num(a.recipients)} people · {(a.channels || []).map((c) => (c === "email" ? "e-mail" : "in-app")).join(" + ")} · {when(a.createdAt)} by {a.sent_by_name}
                  </p>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Send this announcement?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Keep editing
            </Button>
            <Button loading={send.isLoading} onClick={() => send.mutate()}>
              Send to {num(count)}
            </Button>
          </>
        }
      >
        <div className={cx("rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200")}>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{body}</p>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Goes to {describeAudience(audience, departments).toLowerCase()} ({num(count)} people) by {channels.map((c) => (c === "email" ? "e-mail" : "in-app notification")).join(" and ")}. This can't be recalled.
        </p>
      </Modal>
    </div>
  );
}
