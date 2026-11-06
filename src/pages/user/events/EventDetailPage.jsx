import { Fragment, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  TicketIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  apiErrorMessage,
  clearEventRsvp,
  downloadEventCalendar,
  exportEventAttendees,
  getEventAttendance,
  getEventAttendees,
  getEventById,
  getImageBaseUrl,
  sendConnectionRequest,
  setEventRsvp,
} from "src/api";
import { useRealtime } from "src/lib/realtime";
import { Avatar, Button, EmptyState, Spinner, cx } from "src/components/ui";

const fmtDay = (d) => new Date(d).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
const fmtShort = (d) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const OPTIONS = [
  { id: "going", label: "Going" },
  { id: "maybe", label: "Maybe" },
  { id: "not_going", label: "Can’t go" },
];

export default function EventDetailPage({ event: initialEvent, navParams, onBackToEvents }) {
  const eventId = navParams?.eventId || initialEvent?.id;
  const queryClient = useQueryClient();
  const { me } = useRealtime();
  const isOrganiser = ["admin", "super_admin"].includes(me?.role_name);
  const [showGuests, setShowGuests] = useState(false);

  const eventQ = useQuery(["event", eventId], async () => (await getEventById(eventId)).data, {
    enabled: !!eventId,
    initialData: initialEvent?.id === eventId ? initialEvent : undefined,
    staleTime: 60_000,
  });
  const att = useQuery(["eventAttendance", eventId], () => getEventAttendance(eventId), {
    enabled: !!eventId,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });

  const onRsvpChanged = (summary, verb) => {
    queryClient.setQueryData(["eventAttendance", eventId], summary);
    queryClient.invalidateQueries("myEvents");
    queryClient.invalidateQueries(["eventAttendees", eventId]);
    if (verb === "clear") return toast.info("Your RSVP was removed.");
    const msg = {
      going: "You’re going! We’ll remind you the day before.",
      waitlist: `The event is full, so you’re #${summary.waitlist_position} on the waitlist. We’ll tell you if a seat opens.`,
      maybe: "Marked as maybe.",
      not_going: "Thanks for letting the organisers know.",
    }[summary.my_status];
    if (msg) toast.success(msg);
  };
  const onError = (err) => {
    toast.error(apiErrorMessage(err, "Couldn’t update your RSVP."));
    att.refetch();
  };
  const rsvp = useMutation(setEventRsvp, { onSuccess: (s) => onRsvpChanged(s), onError });
  const clear = useMutation(() => clearEventRsvp(eventId), { onSuccess: (s) => onRsvpChanged(s, "clear"), onError });

  const description = useMemo(
    () => DOMPurify.sanitize(eventQ.data?.description || "", { USE_PROFILES: { html: true } }),
    [eventQ.data?.description]
  );

  if (!eventId) {
    return <EmptyState icon={CalendarDaysIcon} title="Event not found" description="Pick an event from the Events page." />;
  }
  if (eventQ.isLoading) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }
  if (eventQ.isError || !eventQ.data) {
    return <EmptyState icon={CalendarDaysIcon} title="This event isn’t available" description="It may have been cancelled or moved." />;
  }

  const ev = eventQ.data;
  const a = att.data;
  const busy = rsvp.isLoading || clear.isLoading;
  const calendar = () => downloadEventCalendar(eventId).catch((e) => toast.error(apiErrorMessage(e)));

  return (
    <div className="ui-scope mx-auto max-w-6xl pb-12">
      <button onClick={onBackToEvents} className="mb-4 inline-flex items-center gap-1 rounded-lg py-1.5 text-sm font-medium text-link hover:opacity-80">
        <ChevronLeftIcon className="h-4 w-4" /> All events
      </button>

      <div className="relative h-48 overflow-hidden rounded-2xl bg-slate-800 sm:h-64">
        {ev.image && <img src={getImageBaseUrl(ev.image)} alt="" className="h-full w-full object-cover" />}
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ---------------------------------------------------------- main */}
        <div className="min-w-0 flex-1 space-y-6">
          <div>
            {ev.level && <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{ev.level} priority</p>}
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{ev.title}</h1>
          </div>

          <RsvpCard
            a={a}
            loading={att.isLoading}
            busy={busy}
            pending={rsvp.variables?.status}
            onPick={(status) => rsvp.mutate({ eventId, status })}
            onClear={() => clear.mutate()}
            onCalendar={calendar}
          />

          <section>
            <h2 className="text-lg font-semibold text-slate-900">About this event</h2>
            {description ? (
              <div className="rich-text mt-2 text-[15px] leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="mt-2 text-sm text-slate-500">The organisers haven’t added a description yet.</p>
            )}
          </section>
        </div>

        {/* ------------------------------------------------------- sidebar */}
        <aside className="w-full space-y-4 lg:w-80">
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <Detail icon={CalendarDaysIcon} title={fmtDay(ev.time)} sub={`${fmtTime(ev.time)}${a?.ends_at ? ` – ${fmtTime(a.ends_at)}` : ""}`} />
            <Detail
              icon={MapPinIcon}
              title={ev.venue || "Venue to be announced"}
              sub={
                ev.venue && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.venue)}`} target="_blank" rel="noreferrer" className="text-link hover:underline">
                    Open in maps
                  </a>
                )
              }
            />
            {a?.deadline && !a.started && <Detail icon={ClockIcon} title={a.rsvp_open ? `RSVP by ${fmtShort(a.deadline)}` : "Registration closed"} />}
            {a && <Capacity a={a} />}
            <Button variant="secondary" className="w-full" onClick={calendar}>
              <CalendarDaysIcon className="h-4 w-4" /> Add to calendar
            </Button>
            {isOrganiser && (
              <Button variant="ghost" className="w-full" onClick={() => exportEventAttendees(eventId).catch((e) => toast.error(apiErrorMessage(e)))}>
                <ArrowDownTrayIcon className="h-4 w-4" /> Export guest list (CSV)
              </Button>
            )}
          </section>

          <WhosGoing a={a} onOpen={() => setShowGuests(true)} />
        </aside>
      </div>

      <GuestsDialog open={showGuests} onClose={() => setShowGuests(false)} eventId={eventId} />
    </div>
  );
}

function Detail({ icon: Icon, title, sub }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {sub && <p className="text-sm text-slate-600">{sub}</p>}
      </div>
    </div>
  );
}

function Capacity({ a }) {
  if (a.capacity == null) return <Detail icon={TicketIcon} title="Open to everyone" sub={`${a.counts.going} going`} />;
  const pct = Math.min(100, Math.round((a.counts.going / a.capacity) * 100));
  return (
    <div className="flex gap-3">
      <TicketIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{a.is_full ? "Fully booked" : `${a.spots_left} of ${a.capacity} spots left`}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Seats taken">
          <div className={cx("h-full rounded-full", a.is_full ? "bg-amber-500" : "bg-brand")} style={{ width: `${pct}%` }} />
        </div>
        {a.counts.waitlist > 0 && <p className="mt-1.5 text-xs text-slate-500">{a.counts.waitlist} on the waitlist</p>}
      </div>
    </div>
  );
}

function RsvpCard({ a, loading, busy, pending, onPick, onClear, onCalendar }) {
  if (loading || !a) {
    return <div className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" />;
  }
  const shell = "rounded-2xl border bg-white p-5";

  if (a.ended) {
    return (
      <section className={cx(shell, "border-slate-200")}>
        <h2 className="font-semibold text-slate-900">This event has ended</h2>
        <p className="mt-1 text-sm text-slate-600">
          {a.checked_in ? "Thanks for coming! Connect with people you met from the guest list." : a.my_status === "going" ? "We hope you enjoyed it." : `${a.counts.going} alumni attended.`}
        </p>
      </section>
    );
  }
  if (a.started) {
    return (
      <section className={cx(shell, "border-emerald-200 bg-emerald-50")}>
        <h2 className="flex items-center gap-2 font-semibold text-emerald-900">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Happening now
        </h2>
        <p className="mt-1 text-sm text-emerald-800">{a.my_status === "going" ? "You’re on the guest list." : "RSVPs are closed for this event."}</p>
      </section>
    );
  }

  const closedForMe = !a.rsvp_open && !["going", "waitlist"].includes(a.my_status);
  if (closedForMe) {
    return (
      <section className={cx(shell, "border-slate-200")}>
        <h2 className="font-semibold text-slate-900">Registration has closed</h2>
        <p className="mt-1 text-sm text-slate-600">The RSVP deadline was {fmtShort(a.deadline)}. Contact the organisers if you still want to attend.</p>
      </section>
    );
  }

  const current = a.my_status === "waitlist" ? "going" : a.my_status;
  return (
    <section className={cx(shell, "border-slate-200")} aria-labelledby="rsvp-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="rsvp-heading" className="font-semibold text-slate-900">
          Are you going?
        </h2>
        {a.is_full && a.my_status !== "going" && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Full · waitlist open</span>}
      </div>
      <div role="radiogroup" aria-labelledby="rsvp-heading" className="mt-4 grid grid-cols-3 gap-2">
        {OPTIONS.map((o) => {
          const on = current === o.id;
          const label = o.id === "going" && a.is_full && a.my_status !== "going" ? (a.my_status === "waitlist" ? "On waitlist" : "Join waitlist") : o.label;
          return (
            <button
              key={o.id}
              role="radio"
              aria-checked={on}
              disabled={busy}
              onClick={() => !on && onPick(o.id)}
              className={cx(
                // ring instead of border: Bootstrap's global .border forces its own colour
                "flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold ring-1 ring-inset transition disabled:opacity-60",
                on
                  ? o.id === "going"
                    ? a.my_status === "waitlist"
                      ? "bg-amber-500 text-white ring-amber-500"
                      : "bg-brand text-brand-ink ring-brand"
                    : "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50 hover:ring-slate-400"
              )}
            >
              {busy && pending === o.id ? <Spinner className="h-4 w-4" /> : on && <CheckCircleIcon className="h-4 w-4" />}
              {label}
            </button>
          );
        })}
      </div>

      {a.my_status === "going" && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-emerald-900">You’re on the list. We’ll remind you the day before.</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onCalendar}>
              <CalendarDaysIcon className="h-4 w-4" /> Add to calendar
            </Button>
          </div>
        </div>
      )}
      {a.my_status === "waitlist" && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">You’re #{a.waitlist_position} on the waitlist.</span> If a seat opens up you’ll get it automatically and we’ll notify you.
          </p>
          <Button variant="secondary" size="sm" disabled={busy} onClick={onClear}>
            Leave waitlist
          </Button>
        </div>
      )}
      {a.my_status && a.my_status !== "waitlist" && (
        <button onClick={onClear} disabled={busy} className="mt-3 text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline">
          Clear my response
        </button>
      )}
    </section>
  );
}

function WhosGoing({ a, onOpen }) {
  if (!a) return null;
  const friends = a.friends_going?.people || [];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold text-slate-900">Who’s going</h2>
        <span className="text-sm text-slate-500">{a.counts.going} going</span>
      </div>
      {a.counts.going === 0 ? (
        <p className="mt-2 text-sm text-slate-600">Nobody yet. Be the first!</p>
      ) : (
        <>
          {friends.length > 0 && (
            <>
              <div className="mt-3 flex -space-x-2">
                {friends.slice(0, 6).map((p) => (
                  <Avatar key={p.id} name={p.name} photo={p.photo} size="sm" className="ring-2 ring-white" />
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-700">
                <span className="font-semibold">{friends.slice(0, 2).map((p) => p.first_name || p.name).join(", ")}</span>
                {a.friends_going.count > 2 ? ` and ${a.friends_going.count - 2} more from your network` : " from your network"}
              </p>
            </>
          )}
          <button onClick={onOpen} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-link hover:opacity-80">
            <UserGroupIcon className="h-4 w-4" /> See everyone attending
          </button>
        </>
      )}
    </section>
  );
}

function GuestsDialog({ open, onClose, eventId }) {
  const [scope, setScope] = useState("all");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const queryClient = useQueryClient();
  useEffect(() => {
    const t = setTimeout(() => setQ(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const list = useQuery(["eventAttendees", eventId, scope, q], () => getEventAttendees({ eventId, scope, search: q, pageSize: 50 }), {
    enabled: open,
    keepPreviousData: true,
  });
  const connect = useMutation(sendConnectionRequest, {
    onSuccess: (d) => {
      toast.success(d.auto_accepted ? `You’re now connected with ${d.user.name}` : `Request sent to ${d.user.name}`);
      queryClient.invalidateQueries(["eventAttendees", eventId]);
      queryClient.invalidateQueries("connectionCounts");
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  });
  const stateLabel = { connected: "Connected", pending_sent: "Request sent", pending_received: "Wants to connect", self: "You" };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="ui-scope relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="duration-150" enterFrom="opacity-0" enterTo="opacity-100" leave="duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-slate-900/50" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <Transition.Child as={Fragment} enter="duration-150" enterFrom="opacity-0 translate-y-4" enterTo="opacity-100 translate-y-0" leave="duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Panel className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <Dialog.Title className="font-semibold text-slate-900">Attending</Dialog.Title>
                <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 border-b border-slate-100 px-5 py-3">
                <div className="inline-flex rounded-lg bg-slate-100 p-1" role="tablist">
                  {[
                    ["all", "Everyone"],
                    ["network", "Your network"],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={scope === id}
                      onClick={() => setScope(id)}
                      className={cx("rounded-md px-3 py-1.5 text-sm font-medium", scope === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <label className="relative block">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search attendees"
                    aria-label="Search attendees"
                    className="w-full rounded-lg border-0 bg-slate-100 py-2 pl-9 pr-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand"
                  />
                </label>
              </div>
              <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto">
                {list.isLoading && (
                  <li className="flex justify-center py-10 text-slate-400">
                    <Spinner />
                  </li>
                )}
                {!list.isLoading && !list.data?.items?.length && (
                  <li>
                    <EmptyState icon={UserGroupIcon} title="No one here yet" description={scope === "network" ? "None of your connections are going yet." : "Try a different search."} />
                  </li>
                )}
                {list.data?.items?.map(({ user, connection_state }) => (
                  <li key={user.id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar name={user.name} photo={user.photo} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {[user.department_name, user.graduation_year && `Class of ${user.graduation_year}`].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {connection_state === "none" ? (
                      <Button size="sm" loading={connect.isLoading && connect.variables?.user_id === user.id} onClick={() => connect.mutate({ user_id: user.id })}>
                        Connect
                      </Button>
                    ) : (
                      <span className="text-xs font-medium text-slate-500">{stateLabel[connection_state]}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
