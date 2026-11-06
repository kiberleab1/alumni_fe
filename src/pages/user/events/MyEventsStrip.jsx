import { useQuery } from "react-query";
import { getMyEvents } from "src/api";
import { cx } from "src/components/ui";

const BADGE = {
  going: ["Going", "bg-emerald-100 text-emerald-800"],
  maybe: ["Maybe", "bg-slate-100 text-slate-700"],
  waitlist: ["Waitlist", "bg-amber-100 text-amber-800"],
};

/** "Your upcoming events" row shown above the events list. Hidden when empty. */
export default function MyEventsStrip({ onOpen }) {
  const { data } = useQuery("myEvents", () => getMyEvents("upcoming"), { staleTime: 30_000 });
  if (!data?.length) return null;
  return (
    <section className="ui-scope mb-6 px-4" aria-labelledby="my-events-heading">
      <h2 id="my-events-heading" className="mb-3 text-base font-semibold text-slate-900">
        Your upcoming events
      </h2>
      <ul className="flex gap-3 overflow-x-auto pb-1">
        {data.map(({ event, my_status }) => {
          const d = new Date(event.time);
          const [label, tone] = BADGE[my_status] || BADGE.maybe;
          return (
            <li key={event.id} className="shrink-0">
              <button
                onClick={() => onOpen(event)}
                className="flex w-72 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-slate-300 hover:shadow-sm"
              >
                <span className="flex w-12 shrink-0 flex-col items-center rounded-lg border border-slate-200 py-1">
                  <span className="text-[11px] font-semibold uppercase text-accent">{d.toLocaleDateString(undefined, { month: "short" })}</span>
                  <span className="text-lg font-bold text-slate-900">{d.getDate()}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{event.title}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                    {event.venue ? ` · ${event.venue}` : ""}
                  </span>
                </span>
                <span className={cx("shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", tone)}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
