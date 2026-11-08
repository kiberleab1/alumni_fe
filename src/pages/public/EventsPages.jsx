/** Public events: list (upcoming / past, search) and a single event page. */
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { ArrowLeftIcon, CalendarDaysIcon, ClockIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";
import { getPublic } from "src/api";
import { SearchInput, cx } from "src/components/ui";
import { ButtonLink, CardSkeletons, Container, Cover, Empty, EventCard, JoinBanner, PageHero, Pager, P, RichText, SectionHead, fmtDate, fmtTime, hasTime } from "./kit";

export function EventsPage() {
  const [when, setWhen] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery(["publicEvents", when, search, page], () => getPublic("events", { when, search, page }), { keepPreviousData: true, retry: false });
  const tab = (v, label) => (
    <button
      type="button"
      role="tab"
      aria-selected={when === v}
      onClick={() => (setWhen(v), setPage(1))}
      className={cx("rounded-lg px-4 py-2 text-sm font-semibold transition", when === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900")}
    >
      {label}
    </button>
  );
  return (
    <>
      <PageHero eyebrow="Events" title="Reunions, talks and meetups" subtitle="Come back to campus, meet alumni in your city, and learn from graduates who've been there.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="tablist" className="inline-flex w-fit rounded-xl bg-slate-200/70 p-1">
            {tab("upcoming", "Upcoming")}
            {tab("past", "Past events")}
          </div>
          <SearchInput value={search} onChange={(v) => (setSearch(v), setPage(1))} placeholder="Search events" className="sm:w-72" />
        </div>
      </PageHero>
      <section className="py-12 sm:py-16">
        <Container>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CardSkeletons n={6} className="aspect-[16/9]" />
            </div>
          ) : !data?.items?.length ? (
            <Empty icon={CalendarDaysIcon} title={search ? "No events match your search" : when === "upcoming" ? "No upcoming events yet" : "No past events"} text={when === "upcoming" ? "New events are announced here and emailed to members first." : undefined}>
              {when === "upcoming" && (
                <ButtonLink href={P.signup} variant="secondary">
                  Join to get event invites
                </ButtonLink>
              )}
            </Empty>
          ) : (
            <>
              <div className={cx("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", when === "past" && "opacity-90")}>
                {data.items.map((e) => (
                  <EventCard key={e.id} e={e} />
                ))}
              </div>
              <Pager page={page} totalPage={data.totalPage} onChange={setPage} />
            </>
          )}
        </Container>
      </section>
    </>
  );
}

function Fact({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-link" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-slate-900">{children}</div>
      </div>
    </div>
  );
}

export function EventDetailPage() {
  const { id } = useParams();
  const { data: e, isLoading, isError } = useQuery(["publicEvent", id], () => getPublic(`events/${id}`), { retry: false });
  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-2/3 rounded bg-slate-200" />
          <div className="aspect-[21/9] rounded-3xl bg-slate-200" />
        </div>
      </Container>
    );
  }
  if (isError || !e) {
    return (
      <Container className="py-20">
        <Empty icon={CalendarDaysIcon} title="This event isn't available" text="It may have been removed, or the link is incomplete.">
          <ButtonLink to={P.events} variant="secondary">
            See all events
          </ButtonLink>
        </Empty>
      </Container>
    );
  }
  const start = new Date(e.time);
  const timeText = hasTime(e.time) ? `${fmtTime(e.time)}${e.end_time ? ` – ${fmtTime(e.end_time)}` : ""}` : "Time to be announced";
  return (
    <>
      <Container className="pt-8">
        <Link to={P.events} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeftIcon className="h-4 w-4" /> All events
        </Link>
      </Container>
      <Container className="py-8 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <article>
            {e.past && <p className="mb-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">This event has ended</p>}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{e.title}</h1>
            <Cover src={e.image} icon={CalendarDaysIcon} className="mt-6 aspect-[16/9] rounded-3xl" />
            <h2 className="mt-10 text-lg font-semibold text-slate-900">About this event</h2>
            {e.description ? <RichText html={e.description} className="mt-3" /> : <p className="mt-3 text-slate-500">More details coming soon.</p>}
          </article>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="space-y-5">
                <Fact icon={CalendarDaysIcon} label="Date">
                  {start.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </Fact>
                <Fact icon={ClockIcon} label="Time">
                  {timeText}
                </Fact>
                {e.venue && (
                  <Fact icon={MapPinIcon} label="Venue">
                    {e.venue}
                  </Fact>
                )}
                {e.capacity && (
                  <Fact icon={UsersIcon} label="Capacity">
                    {e.capacity} people
                  </Fact>
                )}
              </div>
              {!e.past && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <ButtonLink href={`${P.login}?next=${encodeURIComponent(`/user/events/${e.id}`)}`} className="w-full">
                    Sign in to RSVP
                  </ButtonLink>
                  <p className="mt-3 text-center text-sm text-slate-500">
                    New here?{" "}
                    <a href={P.signup} className="font-semibold text-link hover:underline">
                      Join free
                    </a>
                  </p>
                  {e.deadline && <p className="mt-3 text-center text-xs text-slate-500">RSVP by {fmtDate(e.deadline)}</p>}
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
      {e.more?.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-16">
          <Container>
            <SectionHead title="More upcoming events" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {e.more.map((x) => (
                <EventCard key={x.id} e={x} />
              ))}
            </div>
          </Container>
        </section>
      )}
      <JoinBanner title="Don't miss the next reunion." text="Members get invites first, can RSVP in one tap and see which classmates are going." />
    </>
  );
}
