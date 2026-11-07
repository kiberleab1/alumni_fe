import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { profilePath } from "src/lib/nav";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ChatBubbleLeftRightIcon,
  CheckIcon,
  InboxArrowDownIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserGroupIcon,
  UserMinusIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  apiErrorMessage,
  getConnectionCounts,
  getConnectionSuggestions,
  listConnections,
  removeConnection,
  respondToConnection,
  sendConnectionRequest,
} from "src/api";
import { useRealtime } from "src/lib/realtime";
import { Avatar, Button, CountBadge, EmptyState, SkeletonRow, cx, timeAgo } from "src/components/ui";

const PAGE_SIZE = 12;
const TABS = [
  { id: "accepted", label: "Connections", icon: UserGroupIcon, countKey: "accepted" },
  { id: "incoming", label: "Requests", icon: InboxArrowDownIcon, countKey: "incoming", alert: true },
  { id: "outgoing", label: "Sent", icon: PaperAirplaneIcon, countKey: "outgoing" },
  { id: "discover", label: "Discover", icon: SparklesIcon },
];

function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function ConnectionNetwork({ onSelectChatClick, navParams }) {
  const [tab, setTab] = useState(navParams?.tab || "accepted");
  useEffect(() => {
    if (navParams?.tab) setTab(navParams.tab);
  }, [navParams]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);
  const queryClient = useQueryClient();
  const { isOnline, presence } = useRealtime();

  useEffect(() => setPage(1), [tab, q]);

  const { data: counts } = useQuery("connectionCounts", getConnectionCounts, { staleTime: 10_000 });
  const list = useQuery(
    ["connections", tab, q, page],
    () => listConnections({ type: tab, search: q, pageNumber: page, pageSize: PAGE_SIZE }),
    { enabled: tab !== "discover", keepPreviousData: true, staleTime: 10_000 }
  );
  const suggestions = useQuery("connectionSuggestions", () => getConnectionSuggestions(18), {
    enabled: tab === "discover",
    staleTime: 60_000,
  });

  const refresh = () => {
    queryClient.invalidateQueries("connections");
    queryClient.invalidateQueries("connectionCounts");
    queryClient.invalidateQueries("conversations");
  };
  const onError = (err) => toast.error(apiErrorMessage(err));

  const respond = useMutation(respondToConnection, {
    onSuccess: (data) => {
      if (data.status === "accepted") toast.success(`You're now connected with ${data.user.name}`);
      refresh();
    },
    onError,
  });
  const remove = useMutation(removeConnection, { onSuccess: refresh, onError });
  const connect = useMutation(sendConnectionRequest, {
    onSuccess: (data) => {
      toast.success(data.auto_accepted ? `You're now connected with ${data.user.name}` : `Request sent to ${data.user.name}`);
      queryClient.setQueryData("connectionSuggestions", (old) =>
        (old || []).map((s) => (s.user.id === data.user.id ? { ...s, state: data.state } : s))
      );
      refresh();
    },
    onError,
  });

  const online = (u) => (u.id in presence ? isOnline(u.id) : !!u.online);
  const items = list.data?.items || [];
  const totalPages = list.data?.totalPage || 0;

  return (
    <div className="ui-scope mx-auto max-w-6xl py-2">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My network</h1>
        <p className="text-sm text-slate-500">Grow and stay in touch with your alumni community.</p>
      </div>

      {/* tabs */}
      <div className="flex flex-col gap-3 border-b border-slate-200 sm:flex-row sm:items-end sm:justify-between">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Network sections">
          {TABS.map((t) => {
            const count = t.countKey ? counts?.[t.countKey] : undefined;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cx(
                  "flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition",
                  active ? "border-brand text-link" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.alert ? (
                  <CountBadge count={count} />
                ) : (
                  count !== undefined && (
                    <span className={cx("rounded-full px-2 text-xs", active ? "bg-brand-soft text-link" : "bg-slate-100 text-slate-600")}>
                      {count}
                    </span>
                  )
                )}
              </button>
            );
          })}
        </nav>
        {tab !== "discover" && (
          <label className="relative mb-2 block sm:w-72">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, department…"
              className="w-full rounded-lg border-0 bg-white py-2 pl-9 pr-3 text-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-brand"
            />
          </label>
        )}
      </div>

      <div className="mt-6">
        {tab === "discover" ? (
          <Discover
            query={suggestions}
            online={online}
            onConnect={(user) => connect.mutate({ user_id: user.id })}
            pendingId={connect.isLoading ? connect.variables?.user_id : null}
          />
        ) : list.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white">
                <SkeletonRow />
              </div>
            ))}
          </div>
        ) : list.isError ? (
          <EmptyState icon={XMarkIcon} title="Couldn't load your network" description={apiErrorMessage(list.error)} action={<Button onClick={() => list.refetch()}>Try again</Button>} />
        ) : items.length === 0 ? (
          <ListEmpty tab={tab} searching={!!q} onDiscover={() => setTab("discover")} />
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <PersonCard key={c.id} user={c.user} online={online(c.user)} subtitle={cardSubtitle(c)} note={tab === "incoming" ? c.message : null}>
                  {tab === "accepted" && (
                    <>
                      <Button className="flex-1" onClick={() => onSelectChatClick?.({ peer: c.user })}>
                        <ChatBubbleLeftRightIcon className="h-4 w-4" /> Message
                      </Button>
                      <Button
                        variant="secondary"
                        aria-label={`Remove ${c.user.name}`}
                        title="Remove connection"
                        loading={remove.isLoading && remove.variables?.id === c.id}
                        onClick={() => {
                          if (window.confirm(`Remove ${c.user.name} from your connections?`)) remove.mutate({ id: c.id });
                        }}
                      >
                        <UserMinusIcon className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {tab === "incoming" && (
                    <>
                      <Button
                        variant="success"
                        className="flex-1"
                        loading={respond.isLoading && respond.variables?.id === c.id && respond.variables?.status === "accepted"}
                        onClick={() => respond.mutate({ id: c.id, status: "accepted" })}
                      >
                        <CheckIcon className="h-4 w-4" /> Accept
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1"
                        loading={respond.isLoading && respond.variables?.id === c.id && respond.variables?.status === "declined"}
                        onClick={() => respond.mutate({ id: c.id, status: "declined" })}
                      >
                        Ignore
                      </Button>
                    </>
                  )}
                  {tab === "outgoing" && (
                    <Button
                      variant="secondary"
                      className="flex-1"
                      loading={respond.isLoading && respond.variables?.id === c.id}
                      onClick={() => respond.mutate({ id: c.id, status: "cancelled" })}
                    >
                      Withdraw request
                    </Button>
                  )}
                </PersonCard>
              ))}
            </ul>
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// "just now" | "5m ago" | "on Nov 3"
function ago(date) {
  const t = timeAgo(date);
  if (t === "just now") return t;
  return /^\d+[mhd]$/.test(t) ? `${t} ago` : `on ${t}`;
}
function cardSubtitle(c) {
  if (c.state === "connected") return `Connected ${ago(c.responded_at || c.updated_at)}`;
  if (c.direction === "incoming") return `Requested ${ago(c.created_at)}`;
  return `Sent ${ago(c.updated_at)}`;
}

function PersonCard({ user, online, subtitle, note, children, extra }) {
  const meta = [user.degree, user.department_name, user.graduation_year && `Class of ${user.graduation_year}`].filter(Boolean);
  return (
    <li className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar name={user.name} photo={user.photo} size="lg" online={online} />
        <div className="min-w-0 flex-1">
          <Link to={profilePath(user.id)} className="block truncate font-semibold text-slate-900 hover:underline">{user.name}</Link>
          {meta.length > 0 && <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{meta.join(" · ")}</p>}
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {extra}
      {note && <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm italic text-slate-600">“{note}”</p>}
      <div className="mt-4 flex gap-2">{children}</div>
    </li>
  );
}

function Discover({ query, online, onConnect, pendingId }) {
  if (query.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white">
            <SkeletonRow />
          </div>
        ))}
      </div>
    );
  }
  const items = query.data || [];
  if (!items.length) {
    return (
      <EmptyState
        icon={SparklesIcon}
        title="No suggestions right now"
        description="Complete your alumni profile (department and graduation year) to get better suggestions, or browse the Alumni directory."
      />
    );
  }
  return (
    <>
      <p className="mb-4 text-sm text-slate-500">People you may know, based on your department, class and mutual connections.</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <PersonCard
            key={s.user.id}
            user={s.user}
            online={online(s.user)}
            extra={
              s.reasons?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.reasons.map((r) => (
                    <span key={r} className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-link">
                      {r}
                    </span>
                  ))}
                </div>
              )
            }
          >
            {s.state === "none" ? (
              <Button className="flex-1" loading={pendingId === s.user.id} onClick={() => onConnect(s.user)}>
                <UserPlusIcon className="h-4 w-4" /> Connect
              </Button>
            ) : (
              <Button variant="secondary" className="flex-1" disabled>
                <CheckIcon className="h-4 w-4" /> {s.state === "connected" ? "Connected" : "Request sent"}
              </Button>
            )}
          </PersonCard>
        ))}
      </ul>
    </>
  );
}

function ListEmpty({ tab, searching, onDiscover }) {
  if (searching) return <EmptyState icon={MagnifyingGlassIcon} title="No matches" description="Try a different name or department." />;
  if (tab === "incoming") return <EmptyState icon={InboxArrowDownIcon} title="No pending requests" description="When someone wants to connect, you'll see it here." />;
  if (tab === "outgoing") return <EmptyState icon={PaperAirplaneIcon} title="No requests sent" description="Requests you send that are still waiting for an answer show up here." />;
  return (
    <EmptyState
      icon={UserGroupIcon}
      title="Build your network"
      description="Connect with classmates and colleagues to message them and keep up with their careers."
      action={<Button onClick={onDiscover}>Find people you may know</Button>}
    />
  );
}
