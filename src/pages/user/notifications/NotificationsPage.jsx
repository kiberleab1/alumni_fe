import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { BellIcon, CalendarDaysIcon, CheckIcon, ClipboardDocumentCheckIcon, EllipsisHorizontalIcon, LightBulbIcon, RectangleGroupIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import { deleteNotification, getNotifications, listConnections, markNotificationsRead, markNotificationsUnread, respondToConnection } from "src/api";
import { useRealtime, useSocketEvent } from "src/lib/realtime";
import { notificationTarget } from "src/lib/nav";
import { Avatar, Button, Card, EmptyState, PageHeader, SkeletonRow, Tabs, apiError, cx, timeAgo } from "src/components/ui";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "connection_", label: "People" },
  { value: "event_", label: "Events" },
  { value: "mentorship_", label: "Mentorship" },
  { value: "group_", label: "Groups" },
];
const ICON = { event_: CalendarDaysIcon, mentorship_: LightBulbIcon, group_: RectangleGroupIcon, document_: ClipboardDocumentCheckIcon };
const iconFor = (type = "") => ICON[Object.keys(ICON).find((p) => type.startsWith(p))] || BellIcon;
const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

/** Full notifications inbox (design board 15). */
export default function NotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { unreadNotifs, setUnreadNotifs } = useRealtime();
  const [filter, setFilter] = useState("all");
  const q = useInfiniteQuery("notificationsInbox", ({ pageParam = 1 }) => getNotifications({ pageNumber: pageParam, pageSize: 30 }), {
    getNextPageParam: (last) => (last.currentPage < last.totalPage ? last.currentPage + 1 : undefined),
  });
  useSocketEvent("notification:new", () => queryClient.invalidateQueries("notificationsInbox"));
  const refresh = (res) => {
    if (res?.unread_count !== undefined) setUnreadNotifs(res.unread_count);
    queryClient.invalidateQueries("notificationsInbox");
    queryClient.invalidateQueries("notifications");
  };
  const read = useMutation(markNotificationsRead, { onSuccess: refresh, onError: (e) => toast.error(apiError(e)) });
  const unread = useMutation(markNotificationsUnread, { onSuccess: refresh, onError: (e) => toast.error(apiError(e)) });
  const remove = useMutation(deleteNotification, { onSuccess: () => refresh(), onError: (e) => toast.error(apiError(e)) });
  // accept/ignore connection requests in place: find the pending request from that person
  const respond = useMutation(
    async ({ n, status }) => {
      const pending = await listConnections({ type: "incoming", pageSize: 50 });
      const row = (pending.items || []).find((c) => String(c.user?.id) === String(n.actor?.id));
      if (!row) throw new Error("This request is no longer pending");
      await respondToConnection({ id: row.id, status });
      if (!n.is_read) await markNotificationsRead({ ids: [n.id] }).then(refresh);
      return status;
    },
    {
      onSuccess: (status, { n }) => {
        toast.success(status === "accepted" ? `You're now connected with ${n.actor?.name}` : "Request ignored");
        queryClient.invalidateQueries("connectionCounts");
        queryClient.invalidateQueries("connections");
        setHandled((h) => ({ ...h, [n.id]: status }));
      },
      onError: (e) => toast.error(apiError(e)),
    }
  );
  const [handled, setHandled] = useState({});

  const all = useMemo(() => (q.data?.pages || []).flatMap((p) => p.items || []), [q.data]);
  const items = all.filter((n) => (filter === "all" ? true : filter === "unread" ? !n.is_read : (n.type || "").startsWith(filter)));
  const groups = [
    { title: "Today", items: items.filter((n) => isToday(n.created_at)) },
    { title: "Earlier", items: items.filter((n) => !isToday(n.created_at)) },
  ].filter((g) => g.items.length);

  const open = (n) => {
    if (!n.is_read) read.mutate({ ids: [n.id] });
    navigate(notificationTarget(n));
  };

  return (
    <div className="ui-scope mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle={unreadNotifs ? `${unreadNotifs} unread` : "You're all caught up."}
        actions={
          unreadNotifs > 0 && (
            <Button variant="secondary" onClick={() => read.mutate({ all: true })} loading={read.isLoading && read.variables?.all}>
              <CheckIcon className="h-4 w-4" /> Mark all read
            </Button>
          )
        }
      />
      <Tabs className="mb-4" value={filter} onChange={setFilter} tabs={FILTERS.map((f) => ({ ...f, count: f.value === "unread" ? unreadNotifs : undefined }))} />
      {q.isLoading ? (
        <Card>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </Card>
      ) : !groups.length ? (
        <Card>
          <EmptyState icon={BellIcon} title={filter === "all" ? "No notifications yet" : "Nothing here"} description="Connection requests, event updates, mentorship and group activity will appear here." />
        </Card>
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{g.title}</h2>
              <Card className="divide-y divide-slate-100 overflow-visible">
                {g.items.map((n) => {
                  const Icon = iconFor(n.type);
                  return (
                    <div key={n.id} className={cx("flex gap-3 px-4 py-3", !n.is_read && "bg-brand-soft/60")}>
                      <button onClick={() => open(n)} className="flex min-w-0 flex-1 gap-3 text-left">
                        {n.actor ? (
                          <Avatar name={n.actor.name} photo={n.actor.photo} size="sm" />
                        ) : (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                            <Icon className="h-4 w-4" />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className={cx("block text-sm", n.is_read ? "text-slate-700" : "font-medium text-slate-900")}>{n.content}</span>
                          <span className="text-xs text-slate-400">{timeAgo(n.created_at)}</span>
                        </span>
                      </button>
                      {n.type === "connection_request" && !handled[n.id] && (
                        <div className="flex shrink-0 items-start gap-1">
                          <Button size="sm" onClick={() => respond.mutate({ n, status: "accepted" })} disabled={respond.isLoading}>
                            Accept
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => respond.mutate({ n, status: "declined" })} disabled={respond.isLoading}>
                            Ignore
                          </Button>
                        </div>
                      )}
                      {handled[n.id] && <span className="shrink-0 self-center text-xs font-medium text-slate-500">{handled[n.id] === "accepted" ? "Connected" : "Ignored"}</span>}
                      {!n.is_read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
                      <Menu as="div" className="relative shrink-0">
                        <Menu.Button className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Notification options">
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 z-20 mt-1 w-44 rounded-xl bg-white py-1 shadow-lg ring-1 ring-slate-200 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button onClick={() => (n.is_read ? unread.mutate([n.id]) : read.mutate({ ids: [n.id] }))} className={cx("flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700", active && "bg-slate-50")}>
                                <CheckIcon className="h-4 w-4" /> Mark as {n.is_read ? "unread" : "read"}
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button onClick={() => remove.mutate(n.id)} className={cx("flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600", active && "bg-rose-50")}>
                                <TrashIcon className="h-4 w-4" /> Remove
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    </div>
                  );
                })}
              </Card>
            </section>
          ))}
          {q.hasNextPage && (
            <div className="flex justify-center">
              <Button variant="secondary" loading={q.isFetchingNextPage} onClick={() => q.fetchNextPage()}>
                Load older
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
