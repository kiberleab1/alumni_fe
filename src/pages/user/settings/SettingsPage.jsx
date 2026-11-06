import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  BellIcon,
  ComputerDesktopIcon,
  EyeIcon,
  KeyIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  blockUser,
  changeMyPassword,
  deactivateMyAccount,
  getBlockedUsers,
  getMe,
  getMySessions,
  getMySettings,
  revokeOtherSessions,
  unblockUser,
  updateMySettings,
} from "src/api";
import { deleteUserToken } from "src/helpers/globalStorage";
import { Avatar, Button, EmptyState, Segmented, Spinner, Switch, apiError, cx, timeAgo } from "src/components/ui";

const SECTIONS = [
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "privacy", label: "Privacy", icon: EyeIcon },
  { id: "blocked", label: "Blocked people", icon: NoSymbolIcon },
  { id: "account", label: "Account", icon: UserCircleIcon },
];

const CATEGORY_HINTS = {
  connections: "Connection requests and accepted invitations",
  events: "Reminders, seats from the waitlist, changes and cancellations",
};

const VISIBILITY = [
  { value: "members", label: "Alumni" },
  { value: "connections", label: "Connections" },
  { value: "only_me", label: "Only me" },
];
const PRIVACY_FIELDS = [
  { key: "email", label: "Email address" },
  { key: "phone", label: "Phone number" },
  { key: "location", label: "City and region" },
];

export default function SettingsPage({ navParams }) {
  const [section, setSection] = useState(navParams?.tab || "notifications");
  useEffect(() => {
    if (navParams?.tab) setSection(navParams.tab);
  }, [navParams?.tab]);

  return (
    <div className="ui-scope mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <nav aria-label="Settings sections" className="md:w-52 md:shrink-0">
          <ul role="tablist" aria-orientation="vertical" className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
            {SECTIONS.map((s) => {
              const on = s.id === section;
              return (
                <li key={s.id} className="shrink-0">
                  <button
                    role="tab"
                    id={`tab-${s.id}`}
                    aria-selected={on}
                    aria-controls={`panel-${s.id}`}
                    onClick={() => setSection(s.id)}
                    className={cx(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                      on ? "bg-brand-soft text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <s.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div role="tabpanel" id={`panel-${section}`} aria-labelledby={`tab-${section}`} className="min-w-0 flex-1 space-y-5">
          {section === "notifications" && <NotificationsSection />}
          {section === "privacy" && <PrivacySection />}
          {section === "blocked" && <BlockedSection />}
          {section === "account" && <AccountSection />}
        </div>
      </div>
    </div>
  );
}

function Card({ title, description, children, className }) {
  return (
    <section className={cx("rounded-2xl border border-slate-200 bg-white", className)}>
      {(title || description) && (
        <header className="px-5 pt-5 sm:px-6">
          {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </header>
      )}
      <div className="px-5 pb-5 pt-4 sm:px-6">{children}</div>
    </section>
  );
}

/** settings query + optimistic partial updates */
function useSettings() {
  const qc = useQueryClient();
  const query = useQuery("mySettings", getMySettings, { staleTime: 60_000 });
  const mutation = useMutation(updateMySettings, {
    onMutate: async (patch) => {
      await qc.cancelQueries("mySettings");
      const prev = qc.getQueryData("mySettings");
      if (prev) {
        const next = {
          ...prev,
          privacy: { ...prev.privacy, ...(patch.privacy || {}) },
          directory_visible: patch.directory_visible ?? prev.directory_visible,
          notifications: { ...prev.notifications },
        };
        for (const [c, ch] of Object.entries(patch.notifications || {})) next.notifications[c] = { ...next.notifications[c], ...ch };
        qc.setQueryData("mySettings", next);
      }
      return { prev };
    },
    onError: (err, _patch, ctx) => {
      if (ctx?.prev) qc.setQueryData("mySettings", ctx.prev);
      toast.error(apiError(err, "Couldn't save that change"));
    },
    onSuccess: (data) => {
      qc.setQueryData("mySettings", data);
      toast.success("Saved", { toastId: "settings-saved", autoClose: 1500 });
    },
  });
  return { ...query, save: mutation.mutate };
}

function Loading() {
  return (
    <div className="flex justify-center py-16 text-slate-400">
      <Spinner className="h-6 w-6" />
    </div>
  );
}

/* ------------------------------------------------------------ notifications */

function NotificationsSection() {
  const { data, isLoading, isError, save } = useSettings();
  if (isLoading) return <Loading />;
  if (isError || !data) return <p className="text-sm text-rose-600">Couldn't load your settings. Refresh to try again.</p>;
  const cats = Object.entries(data.categories || {});
  return (
    <Card title="Notifications" description="Choose where each kind of update reaches you. Messages always show in Messages.">
      <div role="table" aria-label="Notification channels" className="-mx-5 sm:-mx-6">
        <div role="row" className="grid grid-cols-[1fr_5rem_5rem] items-center border-b border-slate-100 px-5 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
          <span role="columnheader">Activity</span>
          <span role="columnheader" className="text-center">In-app</span>
          <span role="columnheader" className="text-center">Email</span>
        </div>
        {cats.map(([id, cat]) => {
          const pref = data.notifications[id] || {};
          return (
            <div role="row" key={id} className="grid grid-cols-[1fr_5rem_5rem] items-center border-b border-slate-100 px-5 py-3.5 last:border-0 sm:px-6">
              <span role="rowheader">
                <span className="block text-sm font-medium text-slate-900">{cat.label}</span>
                <span className="block text-xs text-slate-500">{CATEGORY_HINTS[id]}</span>
              </span>
              <span role="cell" className="flex justify-center">
                <Switch checked={pref.in_app} label={`${cat.label} in the app`} onChange={(v) => save({ notifications: { [id]: { in_app: v } } })} />
              </span>
              <span role="cell" className="flex justify-center">
                {cat.email ? (
                  <Switch checked={pref.email} label={`${cat.label} by email`} onChange={(v) => save({ notifications: { [id]: { email: v } } })} />
                ) : (
                  <span className="text-xs text-slate-400" title="Not sent by email">—</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ privacy */

function PrivacySection() {
  const { data, isLoading, isError, save } = useSettings();
  if (isLoading) return <Loading />;
  if (isError || !data) return <p className="text-sm text-rose-600">Couldn't load your settings. Refresh to try again.</p>;
  const p = data.privacy;
  const seenBy = (level, viewer) => level === "members" || (level === "connections" && viewer === "connection");
  return (
    <>
      <Card title="Who can see your details" description="Alumni office staff can always see your record. These choices control what other members see.">
        <ul className="divide-y divide-slate-100">
          {PRIVACY_FIELDS.map((f) => (
            <li key={f.key} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
              <span className="text-sm font-medium text-slate-900">{f.label}</span>
              <Segmented size="sm" label={`Who can see your ${f.label.toLowerCase()}`} value={p[f.key]} options={VISIBILITY} onChange={(v) => save({ privacy: { [f.key]: v } })} />
            </li>
          ))}
          <li className="flex flex-wrap items-center justify-between gap-3 py-3">
            <span>
              <span className="block text-sm font-medium text-slate-900">Who can send you connection requests</span>
              <span className="block text-xs text-slate-500">“People we both know” needs at least one mutual connection</span>
            </span>
            <Segmented
              size="sm"
              label="Who can send you connection requests"
              value={p.connection_requests}
              options={[
                { value: "everyone", label: "Any alumnus" },
                { value: "mutuals", label: "People we both know" },
              ]}
              onChange={(v) => save({ privacy: { connection_requests: v } })}
            />
          </li>
          <li className="flex items-center justify-between gap-4 pb-0 pt-3">
            <span>
              <span className="block text-sm font-medium text-slate-900">Show me in the alumni directory</span>
              <span className="block text-xs text-slate-500">When off, only your connections can find you</span>
            </span>
            <Switch checked={data.directory_visible} label="Show me in the alumni directory" onChange={(v) => save({ directory_visible: v })} />
          </li>
        </ul>
      </Card>

      <Card title="How others see you">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["stranger", "An alumnus you’re not connected with"],
            ["connection", "One of your connections"],
          ].map(([viewer, title]) => {
            const shown = PRIVACY_FIELDS.filter((f) => seenBy(p[f.key], viewer)).map((f) => f.label.toLowerCase());
            const hidden = viewer === "stranger" && !data.directory_visible;
            return (
              <div key={viewer} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
                <p className="mt-2 text-sm text-slate-700">
                  {hidden
                    ? "Can’t find you in the directory or suggestions."
                    : `Sees your name, photo, department and class${shown.length ? `, plus your ${shown.join(", ")}` : ""}.`}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ blocked */

function BlockedSection() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery("blockedUsers", getBlockedUsers);
  const unblock = useMutation(unblockUser, {
    onSuccess: (_d, userId) => {
      qc.setQueryData("blockedUsers", (list = []) => list.filter((b) => b.user.id !== userId));
      ["alumni", "conversations", "connectionSuggestions"].forEach((k) => qc.invalidateQueries(k));
      toast.success("Unblocked");
    },
    onError: (err) => toast.error(apiError(err)),
  });
  return (
    <Card
      title="Blocked people"
      description="Blocked people can’t message you, connect with you, see your profile or find you in search. They aren’t told. Blocking also removes any connection between you."
    >
      {isLoading ? (
        <Loading />
      ) : !data?.length ? (
        <EmptyState icon={ShieldCheckIcon} title="You haven’t blocked anyone" description="You can block someone from their profile or from a conversation." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {data.map((b) => (
            <li key={b.user.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Avatar name={b.user.name} photo={b.user.photo} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-900">{b.user.name}</span>
                <span className="block text-xs text-slate-500">Blocked {timeAgo(b.blocked_at)}</span>
              </span>
              <Button variant="secondary" size="sm" loading={unblock.isLoading && unblock.variables === b.user.id} onClick={() => unblock.mutate(b.user.id)}>
                Unblock
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ account */

const inputCls =
  "block w-full rounded-lg border-0 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand";

function AccountSection() {
  const { data: me } = useQuery("me", getMe, { staleTime: 5 * 60_000 });
  return (
    <>
      <Card title="Account">
        <dl className="grid gap-1 text-sm">
          <dt className="text-slate-500">Sign-in email</dt>
          <dd className="flex flex-wrap items-center gap-2 font-medium text-slate-900">
            {me?.email || "…"}
            {me && (
              <span className={cx("rounded-full px-2 py-0.5 text-xs font-semibold", me.email_verified_at ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                {me.email_verified_at ? "Verified" : "Not verified"}
              </span>
            )}
          </dd>
        </dl>
      </Card>
      <PasswordCard />
      <SessionsCard />
      <DeactivateCard />
    </>
  );
}

function signOutLocally() {
  deleteUserToken();
  window.location.href = "/login";
}

function PasswordCard() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const change = useMutation(() => changeMyPassword({ current_password: form.current, new_password: form.next }), {
    onSuccess: () => {
      toast.success("Password changed. Please sign in again.");
      setTimeout(signOutLocally, 1200);
    },
    onError: (err) => setError(apiError(err)),
  });
  const weak = form.next && !(form.next.length >= 8 && /[A-Za-z]/.test(form.next) && /\d/.test(form.next));
  const mismatch = form.confirm && form.confirm !== form.next;
  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (weak || mismatch || !form.current) return;
    change.mutate();
  };
  return (
    <Card title="Password" description="Changing your password signs you out on every device, including this one.">
      <form onSubmit={submit} className="grid max-w-md gap-3" noValidate>
        {[
          ["current", "Current password", "current-password"],
          ["next", "New password", "new-password"],
          ["confirm", "Confirm new password", "new-password"],
        ].map(([k, label, ac]) => (
          <label key={k} className="grid gap-1 text-sm font-medium text-slate-700">
            {label}
            <input
              type="password"
              autoComplete={ac}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className={inputCls}
              aria-invalid={(k === "next" && weak) || (k === "confirm" && !!mismatch) || undefined}
            />
          </label>
        ))}
        {weak && <p className="text-xs text-amber-700">Use 8+ characters with at least one letter and one number.</p>}
        {mismatch && <p className="text-xs text-rose-600">The new passwords don’t match.</p>}
        {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
        <div>
          <Button type="submit" loading={change.isLoading} disabled={!form.current || !form.next || weak || !!mismatch || form.confirm !== form.next}>
            <KeyIcon className="h-4 w-4" /> Change password
          </Button>
        </div>
      </form>
    </Card>
  );
}

function describeAgent(ua = "") {
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "";
  return os ? `${browser} on ${os}` : browser;
}

function SessionsCard() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery("mySessions", getMySessions);
  const revoke = useMutation(revokeOtherSessions, {
    onSuccess: (r) => {
      qc.invalidateQueries("mySessions");
      toast.success(r?.revoked ? `Signed out ${r.revoked} other session${r.revoked > 1 ? "s" : ""}` : "No other sessions were active");
    },
    onError: (err) => toast.error(apiError(err)),
  });
  const others = (data || []).filter((s) => !s.current).length;
  return (
    <Card title="Where you’re signed in">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ul className="divide-y divide-slate-100">
            {(data || []).map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3 first:pt-0">
                <ComputerDesktopIcon className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-900">
                    {describeAgent(s.user_agent)}
                    {s.current && <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">This device</span>}
                  </span>
                  <span className="block text-xs text-slate-500">
                    Signed in {timeAgo(s.login_time)}
                    {s.ip_address ? ` · ${s.ip_address}` : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="pt-3">
            <Button variant="secondary" disabled={!others} loading={revoke.isLoading} onClick={() => revoke.mutate()}>
              Sign out all other devices
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

function DeactivateCard() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const del = useMutation(() => deactivateMyAccount(password), {
    onSuccess: signOutLocally,
    onError: (err) => setError(apiError(err)),
  });
  return (
    <Card className="border-rose-200" title="Delete account" description="Your profile, connections and messages are removed. Your graduation record stays with the institute.">
      {!open ? (
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete my account…
        </Button>
      ) : (
        <form
          className="grid max-w-md gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            if (password) del.mutate();
          }}
        >
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Enter your password to confirm
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} autoFocus />
          </label>
          {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" className="!bg-rose-600 !text-white hover:!bg-rose-700" disabled={!password} loading={del.isLoading}>
              Delete permanently
            </Button>
            <Button variant="ghost" onClick={() => (setOpen(false), setPassword(""), setError(""))}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

/* --------------------------------------------------------- shared: blocking */

/**
 * Confirms and blocks someone. Used from conversations and profiles.
 * `onDone` runs after a successful block.
 */
export function useBlockUser(onDone) {
  const qc = useQueryClient();
  return useMutation(blockUser, {
    onSuccess: (_d, userId) => {
      ["blockedUsers", "conversations", "connections", "connectionCounts", "alumni", "connectionSuggestions"].forEach((k) => qc.invalidateQueries(k));
      qc.invalidateQueries(["connectionStatus", userId]);
      toast.success("Blocked. They won’t be able to contact you.");
      onDone?.(userId);
    },
    onError: (err) => toast.error(apiError(err)),
  });
}
