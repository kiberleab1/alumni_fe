import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { BellIcon, CalendarDaysIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useQuery, useQueryClient } from "react-query";
import { getNotifications, markNotificationsRead } from "src/api";
import { useRealtime } from "src/lib/realtime";
import { Avatar, CountBadge, EmptyState, Spinner, cx, timeAgo } from "src/components/ui";

/**
 * Bell with live unread badge. `onOpenItem(notification)` lets the shell
 * navigate (e.g. connection request -> My Connections).
 */
export default function NotificationBell({ onOpenItem, onSeeAll }) {
  const { unreadNotifs, setUnreadNotifs } = useRealtime();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery("notifications", () => getNotifications({ pageSize: 15 }), {
    staleTime: 30_000,
  });
  const items = data?.items || [];

  const markAll = async () => {
    const res = await markNotificationsRead({ all: true });
    setUnreadNotifs(res.unread_count);
    queryClient.invalidateQueries("notifications");
  };
  const open = async (n, close) => {
    close();
    if (!n.is_read) {
      const res = await markNotificationsRead({ ids: [n.id] }).catch(() => null);
      if (res) setUnreadNotifs(res.unread_count);
      queryClient.invalidateQueries("notifications");
    }
    onOpenItem?.(n);
  };

  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <Popover.Button
            className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label={`Notifications${unreadNotifs ? ` (${unreadNotifs} unread)` : ""}`}
          >
            <BellIcon className="h-6 w-6" />
            <CountBadge count={unreadNotifs} className="absolute -right-0.5 -top-0.5" />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-900">Notifications</p>
                {unreadNotifs > 0 && (
                  <button onClick={markAll} className="flex items-center gap-1 text-xs font-medium text-link hover:underline">
                    <CheckIcon className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8 text-slate-400">
                    <Spinner />
                  </div>
                ) : items.length === 0 ? (
                  <EmptyState icon={BellIcon} title="You're all caught up" description="Connection requests and updates will appear here." />
                ) : (
                  items.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => open(n, close)}
                      className={cx("flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50", !n.is_read && "bg-brand-soft")}
                    >
                      {n.actor ? (
                        <Avatar name={n.actor.name} photo={n.actor.photo} size="sm" />
                      ) : (
                        // system notifications (event reminders, seat updates…) have no person
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700" aria-hidden="true">
                          {n.type?.startsWith("event_") ? <CalendarDaysIcon className="h-4 w-4" /> : <BellIcon className="h-4 w-4" />}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-slate-800">{n.content}</span>
                        <span className="text-xs text-slate-400">{timeAgo(n.created_at)}</span>
                      </span>
                      {!n.is_read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />}
                    </button>
                  ))
                )}
              </div>
              {onSeeAll && (
                <button
                  onClick={() => {
                    close();
                    onSeeAll();
                  }}
                  className="block w-full border-t border-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-link hover:bg-slate-50"
                >
                  See all notifications
                </button>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
