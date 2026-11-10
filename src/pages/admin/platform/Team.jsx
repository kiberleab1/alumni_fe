/**
 * An institute's admin team. The super admin appoints owners (full control);
 * owners add co-admins and choose what each may do.
 */
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { EllipsisVerticalIcon, ShieldCheckIcon, UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { addTeamAdmin as addAdmin, getTeam, removeTeamAdmin as removeAdmin, updateTeamAdmin as updateAdmin } from "src/api";
import { Avatar, Button, Card, EmptyState, Field, Modal, PageHeader, Pill, apiError, cx, inputClass } from "src/components/ui";
import { useSession } from "../kit";
import { InstituteSelect, when } from "./shared";

export const CAP_GROUPS = [
  ["Team & settings", ["team.manage", "features.manage", "security.manage", "website.edit", "branding.edit"]],
  ["People", ["members.manage", "announcements.send", "email.send", "documents.review", "moderation"]],
  ["Content", ["content.publish", "events.manage", "jobs.manage", "organization.manage"]],
  ["Insight", ["analytics.view", "audit.view"]],
];
const SHORT = {
  "team.manage": "Admins",
  "features.manage": "Features",
  "security.manage": "Security",
  "website.edit": "Website",
  "branding.edit": "Branding",
  "members.manage": "Members",
  "announcements.send": "Announcements",
  "email.send": "E-mail",
  "documents.review": "Documents",
  moderation: "Moderation",
  "content.publish": "News",
  "events.manage": "Events",
  "jobs.manage": "Jobs",
  "organization.manage": "Departments & staff",
  "analytics.view": "Reports",
  "audit.view": "Audit log",
};
const PRESETS = [
  ["Content editor", ["content.publish", "events.manage", "jobs.manage", "website.edit"]],
  ["Membership officer", ["members.manage", "documents.review", "announcements.send", "email.send"]],
  ["Communications", ["announcements.send", "email.send", "content.publish"]],
  ["Reports only", ["analytics.view", "audit.view"]],
];

const summary = (a) => (a.owner ? "Full control" : a.caps.length ? a.caps.map((c) => SHORT[c] || c).slice(0, 3).join(", ") + (a.caps.length > 3 ? ` +${a.caps.length - 3}` : "") : "No permissions yet");

/** Grouped checklist. Caps the current user can't grant are shown but locked. */
function PermissionPicker({ value, onChange, team }) {
  const grantable = (c) => team.ceiling.includes(c) && (team.my.super || (team.my.caps.includes(c) && (c !== "team.manage" || team.my.owner)));
  const toggle = (c) => onChange(value.includes(c) ? value.filter((x) => x !== c) : [...value, c]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(([label, caps]) => (
          <button key={label} type="button" onClick={() => onChange(caps.filter(grantable))} className="rounded-full px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
            {label}
          </button>
        ))}
        <button type="button" onClick={() => onChange([])} className="rounded-full px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50">
          Clear
        </button>
      </div>
      {CAP_GROUPS.map(([group, caps]) => (
        <fieldset key={group}>
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">{group}</legend>
          <div className="mt-1.5 grid gap-1 sm:grid-cols-2">
            {caps.map((c) => {
              const ok = grantable(c);
              return (
                <label key={c} className={cx("flex items-start gap-2.5 rounded-lg p-2 text-sm", ok ? "cursor-pointer hover:bg-slate-50" : "opacity-50")} title={ok ? undefined : team.ceiling.includes(c) ? "You can only grant permissions you have" : "Not allowed for this institute by the platform"}>
                  <input type="checkbox" className="mt-0.5" disabled={!ok} checked={value.includes(c)} onChange={() => toggle(c)} />
                  <span className="text-slate-700">{team.catalog[c]}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function AddDialog({ team, instituteId, presetOwner, onClose }) {
  const client = useQueryClient();
  const canOwner = team.my.super || team.my.owner;
  const [f, setF] = useState({ email: "", first_name: "", last_name: "", owner: presetOwner && canOwner, caps: [] });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const m = useMutation(() => addAdmin({ institute_id: team.my.super ? instituteId : undefined, email: f.email.trim(), first_name: f.first_name.trim(), last_name: f.last_name.trim(), owner: f.owner, caps: f.owner ? [] : f.caps }), {
    onSuccess: (r) => {
      client.invalidateQueries("adminTeam");
      client.invalidateQueries("platformOverview");
      toast.success(r.invited ? `Invitation sent to ${r.email}` : `${r.name} is now ${r.owner ? "an owner" : "a co-admin"}`);
      onClose();
    },
    onError: (e) => toast.error(apiError(e, "Couldn't add this admin")),
  });
  const ready = /\S+@\S+\.\S+/.test(f.email) && f.first_name.trim() && f.last_name.trim() && (f.owner || f.caps.length);
  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={`Add an admin to ${team.institute?.name || "this institute"}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={m.isLoading} disabled={!ready} onClick={() => m.mutate()}>
            <UserPlusIcon className="h-4 w-4" /> Add admin
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" htmlFor="ta-email" className="sm:col-span-2" hint="An existing member of this institute is promoted; anyone else gets an invitation e-mail.">
            <input id="ta-email" type="email" className={inputClass} value={f.email} onChange={set("email")} autoFocus />
          </Field>
          <Field label="First name" htmlFor="ta-first">
            <input id="ta-first" className={inputClass} value={f.first_name} onChange={set("first_name")} />
          </Field>
          <Field label="Last name" htmlFor="ta-last">
            <input id="ta-last" className={inputClass} value={f.last_name} onChange={set("last_name")} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            [true, "Owner", "Full control of this institute, including other admins."],
            [false, "Co-admin", "Only the permissions you choose below."],
          ].map(([owner, title, hint]) => (
            <label key={title} className={cx("flex cursor-pointer flex-col rounded-xl p-3 ring-1", f.owner === owner ? "bg-brand-soft ring-2 ring-brand" : "ring-slate-200", owner && !canOwner && "pointer-events-none opacity-50")}>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <input type="radio" name="kind" checked={f.owner === owner} disabled={owner && !canOwner} onChange={() => setF((p) => ({ ...p, owner }))} /> {title}
              </span>
              <span className="mt-0.5 text-xs text-slate-500">{hint}</span>
            </label>
          ))}
        </div>
        {!f.owner && <PermissionPicker team={team} value={f.caps} onChange={(caps) => setF((p) => ({ ...p, caps }))} />}
      </div>
    </Modal>
  );
}

function EditDialog({ team, admin, onClose }) {
  const client = useQueryClient();
  const [caps, setCaps] = useState(admin.caps);
  const m = useMutation(() => updateAdmin({ id: admin.id, caps }), {
    onSuccess: () => {
      client.invalidateQueries("adminTeam");
      toast.success(`${admin.name}'s permissions saved`);
      onClose();
    },
    onError: (e) => toast.error(apiError(e, "Couldn't save permissions")),
  });
  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={`Permissions · ${admin.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={m.isLoading} onClick={() => m.mutate()}>
            Save permissions
          </Button>
        </>
      }
    >
      <PermissionPicker team={team} value={caps} onChange={setCaps} />
      <p className="mt-4 text-xs text-slate-500">Changes apply on their next page load.</p>
    </Modal>
  );
}

function Confirm({ title, body, action, danger, onConfirm, loading, onClose }) {
  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "primary"} loading={loading} onClick={onConfirm}>
            {action}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-slate-600">{body}</p>
    </Modal>
  );
}

function RowMenu({ admin, team, onPick }) {
  const [open, setOpen] = useState(false);
  const canTouchOwner = team.my.super || team.my.owner;
  const items = [
    !admin.owner && ["edit", "Edit permissions"],
    !admin.owner && canTouchOwner && ["promote", "Make owner"],
    admin.owner && canTouchOwner && ["demote", "Make co-admin"],
    (!admin.owner || canTouchOwner) && ["remove", "Remove admin access"],
  ].filter(Boolean);
  if (admin.you || !items.length) return null;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label={`Actions for ${admin.name}`} aria-expanded={open}>
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-slate-200">
            {items.map(([k, label]) => (
              <button key={k} type="button" onClick={() => (setOpen(false), onPick(k, admin))} className={cx("block w-full px-4 py-2 text-left hover:bg-slate-50", k === "remove" ? "text-rose-600" : "text-slate-700")}>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function TeamPage({ record }) {
  const { isSuper, instituteId: mine } = useSession();
  const client = useQueryClient();
  const [instituteId, setInstituteId] = useState(record?.institute_id || mine);
  const [dialog, setDialog] = useState(record?.addOwner ? { kind: "add", owner: true } : null);
  const { data: team, isLoading, isError, error } = useQuery(["adminTeam", instituteId], () => getTeam(isSuper ? instituteId : undefined), { enabled: !!instituteId, retry: false });
  useEffect(() => {
    if (record?.institute_id) setInstituteId(record.institute_id);
  }, [record?.institute_id]);

  const change = useMutation(({ kind, admin }) => (kind === "remove" ? removeAdmin(admin.id) : updateAdmin({ id: admin.id, owner: kind === "promote" })), {
    onSuccess: (_, { kind, admin }) => {
      client.invalidateQueries("adminTeam");
      client.invalidateQueries("platformOverview");
      toast.success(kind === "remove" ? `${admin.name} is no longer an admin` : kind === "promote" ? `${admin.name} is now an owner` : `${admin.name} is now a co-admin`);
      setDialog(null);
    },
    onError: (e) => toast.error(apiError(e, "Couldn't update this admin")),
  });

  const owners = team?.items.filter((a) => a.owner).length || 0;
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Admins"
        subtitle={team?.institute ? `Who runs ${team.institute.name}: owners have full control, co-admins what you grant them.` : "Owners and co-admins of an institute."}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <InstituteSelect value={instituteId} onChange={setInstituteId} className="w-60" />
            {team && (
              <Button onClick={() => setDialog({ kind: "add", owner: false })}>
                <UserPlusIcon className="h-4 w-4" /> Add admin
              </Button>
            )}
          </div>
        }
      />
      {team && owners === 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          <span className="flex-1">{team.institute?.name} has no owner yet. Appoint one so the institute can run itself.</span>
          <Button size="sm" onClick={() => setDialog({ kind: "add", owner: true })}>
            Add owner
          </Button>
        </div>
      )}
      <Card className="mt-4 overflow-hidden">
        {isLoading ? (
          <div className="h-48 animate-pulse bg-slate-100" />
        ) : isError ? (
          <p className="p-6 text-sm text-rose-600">{apiError(error, "Couldn't load admins")}</p>
        ) : !team.items.length ? (
          <EmptyState icon={UserGroupIcon} title="No admins yet" description="Add an owner to run this institute." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {team.items.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={a.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {a.name} {a.you && <span className="font-normal text-slate-500">(you)</span>}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {a.email} · {a.invited ? "Invitation sent" : `Last sign-in ${when(a.last_login_at).toLowerCase()}`}
                  </p>
                </div>
                <div className="hidden min-w-0 max-w-[16rem] text-right sm:block">
                  <Pill tone={a.owner ? "green" : "slate"}>
                    {a.owner && <ShieldCheckIcon className="mr-1 inline h-3.5 w-3.5" />}
                    {a.owner ? "Owner" : "Co-admin"}
                  </Pill>
                  <p className="mt-1 truncate text-xs text-slate-500">{summary(a)}</p>
                </div>
                <RowMenu admin={a} team={team} onPick={(kind, admin) => setDialog({ kind, admin })} />
              </li>
            ))}
          </ul>
        )}
      </Card>
      <p className="mt-3 text-xs text-slate-500">Admins can't change their own access. Removed admins keep their member account.</p>

      {dialog?.kind === "add" && team && <AddDialog team={team} instituteId={instituteId} presetOwner={dialog.owner} onClose={() => setDialog(null)} />}
      {dialog?.kind === "edit" && <EditDialog team={team} admin={dialog.admin} onClose={() => setDialog(null)} />}
      {["remove", "promote", "demote"].includes(dialog?.kind) && (
        <Confirm
          title={{ remove: `Remove ${dialog.admin.name}?`, promote: `Make ${dialog.admin.name} an owner?`, demote: `Make ${dialog.admin.name} a co-admin?` }[dialog.kind]}
          body={
            {
              remove: "They'll be signed out and lose access to the admin console. Their member account stays.",
              promote: "Owners have full control of this institute, including other admins.",
              demote: "They'll keep no permissions until you grant some under Edit permissions.",
            }[dialog.kind]
          }
          action={{ remove: "Remove access", promote: "Make owner", demote: "Make co-admin" }[dialog.kind]}
          danger={dialog.kind === "remove"}
          loading={change.isLoading}
          onConfirm={() => change.mutate({ kind: dialog.kind, admin: dialog.admin })}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
