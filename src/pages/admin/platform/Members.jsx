/**
 * Every account in one place: search, filter, approve sign-ups, suspend,
 * change roles, bulk actions, invite, CSV import and export.
 */
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ArrowDownTrayIcon, ArrowUpTrayIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon, EnvelopeIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { bulkMembers, downloadMembersCsv, getAdminMembers, importMembers, setMemberRole } from "src/api";
import { Avatar, Button, Card, EmptyState, Field, Modal, PageHeader, Pill, SearchInput, Switch, Tabs, apiError, cx, inputClass } from "src/components/ui";
import { useSession } from "../kit";
import { InstituteSelect, num, parseCsv, useDebounced, useInstituteFilter, when } from "./shared";

const STATUS_TONE = { ACTIVE: "green", PENDING: "amber", SUSPENDED: "rose", BANNED: "rose", REJECTED: "slate" };
const STATUS_LABEL = { ACTIVE: "Active", PENDING: "Pending", SUSPENDED: "Suspended", BANNED: "Banned", REJECTED: "Rejected" };
const ROLE_LABEL = { alumni: "Alumni", user: "Member", admin: "Admin", super_admin: "Super admin" };
const ACTION_TEXT = {
  approve: ["Approve", "approved"],
  reject: ["Reject", "rejected"],
  activate: ["Reactivate", "reactivated"],
  suspend: ["Suspend", "suspended"],
  ban: ["Ban", "banned"],
  delete: ["Delete", "deleted"],
  resend_invite: ["Resend invite to", "re-invited"],
};
const DESTRUCTIVE = ["suspend", "ban", "delete", "reject"];

function actionsFor(m, isSuper) {
  const out = [];
  if (m.status === "PENDING") out.push("approve", "reject");
  if (m.status === "ACTIVE") out.push("suspend");
  if (["SUSPENDED", "BANNED", "REJECTED"].includes(m.status)) out.push("activate");
  if (isSuper && m.status !== "BANNED") out.push("ban");
  if (m.invited) out.push("resend_invite");
  out.push("delete");
  return out;
}

function RowMenu({ member, onAction, onRole, isSuper }) {
  const [open, setOpen] = useState(false);
  const protectedRole = member.role_name === "super_admin" || (member.role_name === "admin" && !isSuper);
  if (protectedRole) return null;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label={`Actions for ${member.name}`} aria-expanded={open}>
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-slate-200">
            {actionsFor(member, isSuper).map((a) => (
              <button key={a} type="button" onClick={() => (setOpen(false), onAction(a, [member]))} className={cx("block w-full px-4 py-2 text-left hover:bg-slate-50", DESTRUCTIVE.includes(a) ? "text-rose-600" : "text-slate-700")}>
                {ACTION_TEXT[a][0].replace(" to", "")}
              </button>
            ))}
            <button type="button" onClick={() => (setOpen(false), onRole(member))} className="block w-full border-t border-slate-100 px-4 py-2 text-left text-slate-700 hover:bg-slate-50">
              Change role
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function RoleDialog({ member, onClose }) {
  const { isSuper } = useSession();
  const [role, setRole] = useState(member.role_name);
  const client = useQueryClient();
  const m = useMutation(() => setMemberRole({ id: member.id, role }), {
    onSuccess: () => {
      client.invalidateQueries("adminMembers");
      toast.success(`${member.name} is now ${ROLE_LABEL[role].toLowerCase()}`);
      onClose();
    },
    onError: (e) => toast.error(apiError(e, "Couldn't change the role")),
  });
  const options = isSuper ? ["alumni", "user", "admin"] : ["alumni", "user"];
  return (
    <Modal
      open
      onClose={onClose}
      title={`Change role · ${member.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={m.isLoading} disabled={role === member.role_name} onClick={() => m.mutate()}>
            Save role
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        {options.map((r) => (
          <label key={r} className={cx("flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1", role === r ? "bg-brand-soft ring-brand" : "ring-slate-200 hover:bg-slate-50")}>
            <input type="radio" name="role" className="mt-1" checked={role === r} onChange={() => setRole(r)} />
            <span>
              <span className="block text-sm font-semibold text-slate-900">{ROLE_LABEL[r]}</span>
              <span className="block text-xs text-slate-500">{r === "admin" ? "Can use the admin console for this institute." : r === "alumni" ? "A graduate with an alumni profile." : "A member without an alumni profile."}</span>
            </span>
          </label>
        ))}
        <p className="pt-1 text-xs text-slate-500">They'll be signed out and need to sign in again.</p>
      </div>
    </Modal>
  );
}

function ConfirmAction({ action, members, institute, onClose, onDone }) {
  const m = useMutation(() => bulkMembers({ ids: members.map((x) => x.id), action, institute_id: institute }), {
    onSuccess: (r) => {
      toast.success(`${r.updated} member${r.updated === 1 ? "" : "s"} ${ACTION_TEXT[action][1]}${r.skipped ? ` · ${r.skipped} skipped` : ""}`);
      onDone();
    },
    onError: (e) => toast.error(apiError(e, "Couldn't update these members")),
  });
  const [verb] = ACTION_TEXT[action];
  const who = members.length === 1 ? members[0].name : `${members.length} members`;
  return (
    <Modal
      open
      onClose={onClose}
      title={`${verb} ${who}?`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={DESTRUCTIVE.includes(action) ? "danger" : "primary"} loading={m.isLoading} onClick={() => m.mutate()}>
            {verb.replace(" to", "")}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-slate-600">
        {action === "delete" && "Their account and sign-in will be removed. Their content stays."}
        {action === "suspend" && "They'll be signed out and can't sign in until reactivated."}
        {action === "ban" && "They'll be signed out and permanently blocked from signing in."}
        {action === "reject" && "Their sign-up will be declined and they won't be able to sign in."}
        {action === "approve" && "They'll get an e-mail and can sign in straight away."}
        {action === "activate" && "They'll be able to sign in again."}
        {action === "resend_invite" && "A fresh invitation link, valid for 7 days, will be e-mailed."}
      </p>
    </Modal>
  );
}

const FIELD_ALIASES = {
  email: ["email", "e-mail", "email address"],
  first_name: ["first name", "firstname", "first_name", "given name"],
  last_name: ["last name", "lastname", "last_name", "surname", "family name"],
  phone_number: ["phone", "phone number", "phone_number", "mobile"],
};

function ImportDialog({ institute, onClose }) {
  const client = useQueryClient();
  const [text, setText] = useState("");
  const [role, setRole] = useState("alumni");
  const [invite, setInvite] = useState(true);
  const [result, setResult] = useState(null);
  const parsed = useMemo(() => {
    const rows = parseCsv(text);
    if (rows.length < 2) return { rows: [], missing: [] };
    const head = rows[0].map((h) => h.toLowerCase());
    const index = Object.fromEntries(Object.entries(FIELD_ALIASES).map(([k, names]) => [k, head.findIndex((h) => names.includes(h))]));
    const missing = ["email", "first_name", "last_name"].filter((k) => index[k] < 0);
    const items = rows.slice(1).map((r) => Object.fromEntries(Object.entries(index).map(([k, i]) => [k, i >= 0 ? r[i] || "" : ""])));
    return { rows: items, missing };
  }, [text]);
  const m = useMutation(() => importMembers({ rows: parsed.rows, role, send_invites: invite, institute_id: institute === "all" ? undefined : institute }), {
    onSuccess: (r) => {
      setResult(r);
      client.invalidateQueries("adminMembers");
    },
    onError: (e) => toast.error(apiError(e, "Import failed")),
  });
  const readFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return toast.error("CSV files must be under 2 MB");
    f.text().then(setText);
  };
  const tooMany = parsed.rows.length > 1000;
  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title="Import members"
      footer={
        result ? (
          <Button onClick={onClose}>Done</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={m.isLoading} disabled={!parsed.rows.length || parsed.missing.length > 0 || tooMany} onClick={() => m.mutate()}>
              Import {parsed.rows.length ? num(parsed.rows.length) : ""} {parsed.rows.length === 1 ? "member" : "members"}
            </Button>
          </>
        )
      }
    >
      {result ? (
        <div className="space-y-3">
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {num(result.created)} member{result.created === 1 ? "" : "s"} added{invite && result.created ? " and invited by e-mail" : ""}.
          </p>
          {result.skipped.length > 0 && (
            <>
              <p className="text-sm font-semibold text-slate-900">{result.skipped.length} row{result.skipped.length === 1 ? "" : "s"} skipped</p>
              <ul className="max-h-60 divide-y divide-slate-100 overflow-y-auto rounded-xl ring-1 ring-slate-200 text-sm">
                {result.skipped.map((s) => (
                  <li key={`${s.line}-${s.email}`} className="flex justify-between gap-3 px-3 py-2">
                    <span className="min-w-0 truncate text-slate-700">
                      Line {s.line} · {s.email || "no email"}
                    </span>
                    <span className="shrink-0 text-slate-500">{s.reason}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Upload or paste a CSV with the columns <b>Email</b>, <b>First name</b>, <b>Last name</b> and optionally <b>Phone</b>. Existing e-mails are skipped.
          </p>
          <input type="file" accept=".csv,text/csv" onChange={readFile} className="block w-full text-sm text-slate-600" aria-label="CSV file" />
          <textarea className={cx(inputClass, "font-mono text-xs")} rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder={"Email,First name,Last name,Phone\nhana@example.com,Hana,Bekele,+251911000000"} aria-label="CSV text" />
          {parsed.missing.length > 0 && text.trim() && <p className="text-sm text-rose-600">Missing column{parsed.missing.length > 1 ? "s" : ""}: {parsed.missing.map((k) => k.replace("_", " ")).join(", ")}</p>}
          {tooMany && <p className="text-sm text-rose-600">Import at most 1,000 rows at a time.</p>}
          {parsed.rows.length > 0 && !parsed.missing.length && (
            <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">First name</th>
                    <th className="px-3 py-2">Last name</th>
                    <th className="px-3 py-2">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsed.rows.slice(0, 4).map((r, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{r.email}</td>
                      <td className="px-3 py-2">{r.first_name}</td>
                      <td className="px-3 py-2">{r.last_name}</td>
                      <td className="px-3 py-2">{r.phone_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsed.rows.length > 4 && <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">…and {num(parsed.rows.length - 4)} more</p>}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Import as" htmlFor="imp-role">
              <select id="imp-role" className={inputClass} value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="alumni">Alumni</option>
                <option value="user">Members</option>
              </select>
            </Field>
            <div className="flex items-end pb-2">
              <Switch checked={invite} onChange={setInvite} label="E-mail each person an invitation" />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function InviteDialog({ institute, onClose }) {
  const client = useQueryClient();
  const [f, setF] = useState({ email: "", first_name: "", last_name: "", role: "alumni" });
  const m = useMutation(() => importMembers({ rows: [f], role: f.role, send_invites: true, institute_id: institute === "all" ? undefined : institute }), {
    onSuccess: (r) => {
      if (!r.created) return toast.error(r.skipped[0]?.reason || "Couldn't invite");
      client.invalidateQueries("adminMembers");
      toast.success(`Invitation sent to ${f.email}`);
      onClose();
    },
    onError: (e) => toast.error(apiError(e, "Couldn't invite")),
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const ready = /\S+@\S+\.\S+/.test(f.email) && f.first_name.trim() && f.last_name.trim();
  return (
    <Modal
      open
      onClose={onClose}
      title="Invite a member"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={m.isLoading} disabled={!ready} onClick={() => m.mutate()}>
            <EnvelopeIcon className="h-4 w-4" /> Send invite
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="inv-email" className="sm:col-span-2">
          <input id="inv-email" type="email" className={inputClass} value={f.email} onChange={set("email")} autoFocus />
        </Field>
        <Field label="First name" htmlFor="inv-first">
          <input id="inv-first" className={inputClass} value={f.first_name} onChange={set("first_name")} />
        </Field>
        <Field label="Last name" htmlFor="inv-last">
          <input id="inv-last" className={inputClass} value={f.last_name} onChange={set("last_name")} />
        </Field>
        <Field label="Role" htmlFor="inv-role" className="sm:col-span-2">
          <select id="inv-role" className={inputClass} value={f.role} onChange={set("role")}>
            <option value="alumni">Alumni</option>
            <option value="user">Member</option>
          </select>
        </Field>
        <p className="text-xs text-slate-500 sm:col-span-2">They'll get an e-mail with a link to set their password.</p>
      </div>
    </Modal>
  );
}

export default function MembersPage({ record }) {
  const { isSuper } = useSession();
  const client = useQueryClient();
  const [institute, setInstitute] = useInstituteFilter(true, record?.institute_id);
  const [status, setStatus] = useState(record?.status || "");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Map());
  const [confirm, setConfirm] = useState(null);
  const [roleFor, setRoleFor] = useState(null);
  const [dialog, setDialog] = useState(null);
  const q = useDebounced(search);
  const params = { institute_id: institute, status, search: q, role, sort, page, pageSize: 25 };
  const { data, isLoading, isError, refetch, isFetching } = useQuery(["adminMembers", params], () => getAdminMembers(params), { keepPreviousData: true });
  const reset = (fn) => (v) => {
    fn(v);
    setPage(1);
    setSelected(new Map());
  };
  const counts = data?.counts || {};
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  const items = data?.items || [];
  const selectable = items.filter((m) => m.role_name !== "super_admin" && (isSuper || m.role_name !== "admin"));
  const allOnPage = selectable.length > 0 && selectable.every((m) => selected.has(m.id));
  const toggle = (m) =>
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(m.id)) next.delete(m.id);
      else next.set(m.id, m);
      return next;
    });
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Map(prev);
      selectable.forEach((m) => (allOnPage ? next.delete(m.id) : next.set(m.id, m)));
      return next;
    });
  const chosen = [...selected.values()];
  const showInstitute = isSuper && institute === "all";
  const [exporting, setExporting] = useState(false);
  const exportCsv = async () => {
    setExporting(true);
    try {
      await downloadMembersCsv({ institute_id: institute, status, search: q, role });
    } catch (e) {
      toast.error(apiError(e, "Export failed"));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Members"
        subtitle="Every account: approve sign-ups, manage access and invite people."
        actions={
          <>
            <Button variant="secondary" loading={exporting} onClick={exportCsv}>
              <ArrowDownTrayIcon className="h-4 w-4" /> Export
            </Button>
            <Button variant="secondary" onClick={() => setDialog("import")}>
              <ArrowUpTrayIcon className="h-4 w-4" /> Import
            </Button>
            <Button onClick={() => setDialog("invite")}>
              <UserPlusIcon className="h-4 w-4" /> Invite
            </Button>
          </>
        }
      />
      <Tabs
        className="mt-2"
        value={status}
        onChange={reset(setStatus)}
        tabs={[
          { value: "", label: `All ${data ? num(all) : ""}` },
          { value: "PENDING", label: `Pending ${counts.PENDING ? num(counts.PENDING) : ""}` },
          { value: "ACTIVE", label: "Active" },
          { value: "SUSPENDED", label: "Suspended" },
          ...(counts.BANNED ? [{ value: "BANNED", label: "Banned" }] : []),
          ...(counts.REJECTED ? [{ value: "REJECTED", label: "Rejected" }] : []),
        ]}
      />
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput value={search} onChange={reset(setSearch)} placeholder="Search name, email or phone" className="lg:w-80" />
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <select className={cx(inputClass, "sm:w-36")} value={role} onChange={(e) => reset(setRole)(e.target.value)} aria-label="Role">
            <option value="">All roles</option>
            <option value="alumni">Alumni</option>
            <option value="user">Members</option>
            <option value="admin">Admins</option>
          </select>
          <select className={cx(inputClass, "sm:w-40")} value={sort} onChange={(e) => reset(setSort)(e.target.value)} aria-label="Sort">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A–Z</option>
            <option value="active">Recently active</option>
          </select>
          <InstituteSelect value={institute} onChange={reset(setInstitute)} allowAll className="col-span-2 sm:w-56" />
        </div>
      </div>

      {chosen.length > 0 && (
        <div className="sticky top-16 z-10 mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg">
          <span className="mr-2 font-semibold">{chosen.length} selected</span>
          {["approve", "activate", "suspend", "resend_invite", "delete"].map((a) => (
            <button key={a} type="button" onClick={() => setConfirm({ action: a, members: chosen })} className={cx("rounded-lg px-3 py-1.5 font-medium hover:bg-white/10", a === "delete" && "text-rose-300")}>
              {a === "resend_invite" ? "Resend invite" : ACTION_TEXT[a][0]}
            </button>
          ))}
          <button type="button" onClick={() => setSelected(new Map())} className="ml-auto rounded-lg px-3 py-1.5 text-white/70 hover:bg-white/10">
            Clear
          </button>
        </div>
      )}

      <Card className="mt-4 overflow-hidden">
        {isLoading ? (
          <div className="animate-pulse divide-y divide-slate-100">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <div className="h-9 w-9 rounded-full bg-slate-200" />
                <div className="h-4 w-48 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-14 text-center">
            <p className="text-sm text-slate-600">We couldn't load members.</p>
            <Button variant="secondary" size="sm" className="mt-3" loading={isFetching} onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : !items.length ? (
          <EmptyState icon={UsersIcon} title={q || role || status ? "No members match" : "No members yet"} description={q ? "Try another search." : "Invite people or import a CSV to get started."} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Select all on this page" />
                    </th>
                    <th className="px-2 py-3">Member</th>
                    <th className="hidden px-4 py-3 md:table-cell">Role</th>
                    <th className="px-4 py-3">Status</th>
                    {showInstitute && <th className="hidden px-4 py-3 lg:table-cell">Institute</th>}
                    <th className="hidden px-4 py-3 lg:table-cell">Joined</th>
                    <th className="hidden px-4 py-3 xl:table-cell">Last sign-in</th>
                    <th className="px-2 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((m) => {
                    const can = selectable.includes(m);
                    return (
                      <tr key={m.id} className={cx("transition hover:bg-slate-50", selected.has(m.id) && "bg-brand-soft")}>
                        <td className="px-4 py-3">{can && <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggle(m)} aria-label={`Select ${m.name}`} />}</td>
                        <td className="px-2 py-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar name={m.name} size="sm" />
                            <div className="min-w-0 max-w-[16rem]">
                              <p className="truncate font-semibold text-slate-900">
                                {m.name} {m.verified && <CheckIcon className="inline h-3.5 w-3.5 text-emerald-600" aria-label="Email verified" />}
                              </p>
                              <p className="truncate text-xs text-slate-500">{m.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{ROLE_LABEL[m.role_name] || m.role_name}</td>
                        <td className="px-4 py-3">
                          <Pill tone={STATUS_TONE[m.status]}>{m.invited && m.status === "ACTIVE" ? "Invited" : STATUS_LABEL[m.status] || m.status}</Pill>
                        </td>
                        {showInstitute && <td className="hidden max-w-[12rem] truncate px-4 py-3 text-slate-600 lg:table-cell">{m.institute_name}</td>}
                        <td className="hidden whitespace-nowrap px-4 py-3 text-slate-600 lg:table-cell">{when(m.joined_at)}</td>
                        <td className="hidden whitespace-nowrap px-4 py-3 text-slate-600 xl:table-cell">{when(m.last_login_at)}</td>
                        <td className="px-2 py-2 text-right">
                          <RowMenu member={m} isSuper={isSuper} onAction={(action, members) => setConfirm({ action, members })} onRole={setRoleFor} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
              <p>
                {num((page - 1) * 25 + 1)}–{num((page - 1) * 25 + items.length)} of {num(data.total)}
              </p>
              <div className="flex items-center gap-1">
                <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Previous page">
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="px-2 font-medium text-slate-700">
                  {page} / {num(data.totalPage)}
                </span>
                <button type="button" disabled={page >= data.totalPage} onClick={() => setPage(page + 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Next page">
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
      {confirm && (
        <ConfirmAction
          {...confirm}
          institute={institute}
          onClose={() => setConfirm(null)}
          onDone={() => {
            setConfirm(null);
            setSelected(new Map());
            client.invalidateQueries("adminMembers");
          }}
        />
      )}
      {roleFor && <RoleDialog member={roleFor} onClose={() => setRoleFor(null)} />}
      {dialog === "import" && <ImportDialog institute={institute} onClose={() => setDialog(null)} />}
      {dialog === "invite" && <InviteDialog institute={institute} onClose={() => setDialog(null)} />}
    </div>
  );
}
