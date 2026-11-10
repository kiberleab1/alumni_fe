/**
 * Public home page: hero, live numbers, what members get, upcoming events,
 * latest news, open jobs, alumni voices and a closing call to join.
 * Hero text/image come from Web content → "slideshow" when an admin set it.
 */
import { Fragment } from "react";
import { useQuery } from "react-query";
import { useInstituteConfig } from "src/lib/config";
import { useSurfaceDesign } from "src/lib/theme";
import { cx } from "src/components/ui";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  RectangleGroupIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getPublic } from "src/api";
import { ButtonLink, CardSkeletons, Container, EventCard, JobRow, JoinBanner, MoreLink, NewsCard, P, SectionHead, fmtNum, img } from "../public/kit";

const FEATURES = [
  { icon: UserGroupIcon, title: "Find your classmates", text: "Search alumni by class, department, city and company, then reconnect." },
  { icon: ChatBubbleLeftRightIcon, title: "Message your network", text: "Private, real-time conversations with the people you know." },
  { icon: BriefcaseIcon, title: "Jobs and referrals", text: "Openings shared with alumni, and classmates who already work there." },
  { icon: LightBulbIcon, title: "Mentorship", text: "Get advice from graduates a few steps ahead, or mentor someone yourself." },
  { icon: CalendarDaysIcon, title: "Events and reunions", text: "RSVP in one tap, add it to your calendar and see who else is going." },
  { icon: ClipboardDocumentCheckIcon, title: "Official documents", text: "Request verification letters and transcripts, and track every step." },
];

function Hero({ data, cta }) {
  const h = data?.hero;
  const d = useSurfaceDesign("public");
  // the website design can override the hero text and photo per institute
  const image = img(d.hero_image || h?.images?.[0]);
  const name = data?.institute?.name;
  const layout = d.hero_layout || "split";
  const centered = layout === "centered";
  return (
    <section className={cx("relative isolate overflow-hidden bg-slate-950", layout === "image" && "min-h-[34rem]")}>
      {image && <img src={image} alt="" className={cx("absolute inset-0 -z-10 h-full w-full object-cover", layout === "image" ? "opacity-70" : "opacity-40")} />}
      <div aria-hidden className={cx("absolute inset-0 -z-10", layout === "image" ? "bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/20" : "bg-gradient-to-br from-brand/90 via-slate-950/80 to-slate-950")} />
      {layout !== "image" && <div aria-hidden className="absolute -right-40 top-10 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl" />}
      <Container className={cx("grid items-center gap-12 py-20 sm:py-24 lg:py-28", layout === "split" && "lg:grid-cols-[1.2fr_1fr]", centered && "text-center", layout === "image" && "items-end pt-40")}>
        <div className={cx(centered && "mx-auto max-w-3xl")}>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-inset ring-white/20">
            <AcademicCapIcon className="h-4 w-4" /> {name ? `${name} alumni` : "Alumni network"}
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">{d.hero_title || h?.title || "Stay connected with the people who shaped you."}</h1>
          <p className={cx("mt-6 max-w-xl text-lg leading-relaxed text-white/80", centered && "mx-auto")}>{d.hero_subtitle || (h?.description ? h.description.replace(/<[^>]*>/g, " ").trim() : "Find classmates, discover jobs and mentors, and keep up with events and news from your institute, all in one place.")}</p>
          <div className={cx("mt-9 flex flex-wrap gap-3", centered && "justify-center")}>
            <ButtonLink href={P.signup} variant="white">
              {cta || "Join the network"} <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink to={P.events} variant="ghost-light">
              See upcoming events
            </ButtonLink>
          </div>
          <ul className={cx("mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75", centered && "justify-center")}>
            {["Free for all graduates", "Your privacy, your choice", "Takes a minute"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircleIcon className="h-5 w-5 text-white/60" /> {t}
              </li>
            ))}
          </ul>
        </div>
        {layout === "split" && <HeroCard data={data} />}
      </Container>
    </section>
  );
}

/** Glass card on the hero: the next event, so the page feels alive. */
function HeroCard({ data }) {
  const next = data?.events?.[0];
  return (
    <div className="hidden rounded-3xl bg-white/10 p-6 ring-1 ring-inset ring-white/15 backdrop-blur lg:block">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Happening next</p>
      {next ? (
        <Link to={P.event(next.id)} className="mt-4 block rounded-2xl bg-white p-5 shadow-xl transition hover:-translate-y-0.5">
          <p className="text-sm font-semibold text-link">{new Date(next.time).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{next.title}</p>
          {next.venue && <p className="mt-1 text-sm text-slate-500">{next.venue}</p>}
          <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-link">
            View event <ArrowRightIcon className="h-4 w-4" />
          </p>
        </Link>
      ) : (
        <div className="mt-4 rounded-2xl bg-white/5 p-5 text-sm text-white/70">New events will appear here.</div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          ["Alumni", data?.stats?.alumni],
          ["Open jobs", data?.stats?.open_jobs],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
            <p className="text-2xl font-bold text-white">{data ? fmtNum(v) : "–"}</p>
            <p className="text-xs text-white/60">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stats({ stats }) {
  const items = [
    { label: "Alumni on the network", value: stats?.alumni, icon: AcademicCapIcon },
    { label: "Upcoming events", value: stats?.upcoming_events, icon: CalendarDaysIcon },
    { label: "Open jobs", value: stats?.open_jobs, icon: BriefcaseIcon },
    { label: "Alumni groups", value: stats?.groups, icon: RectangleGroupIcon },
  ];
  return (
    <section className="border-b border-slate-200 bg-white">
      <Container>
        <dl className="grid grid-cols-2 divide-slate-200 lg:grid-cols-4 lg:divide-x">
          {items.map((i) => (
            <div key={i.label} className="flex items-center gap-4 px-2 py-7 lg:px-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-link">
                <i.icon className="h-6 w-6" />
              </span>
              <div>
                <dd className="text-2xl font-bold tracking-tight text-slate-900">{stats ? fmtNum(i.value) : "–"}</dd>
                <dt className="text-sm text-slate-500">{i.label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function Features() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHead center eyebrow="Why join" title="Everything your alumni community needs" text="One place to keep the friendships, the network and the opportunities that started on campus." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 transition hover:shadow-md hover:ring-brand/30">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Quotes({ items }) {
  if (!items?.length) return null;
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHead eyebrow="Alumni voices" title="In their words" action={<MoreLink to={P.stories}>More stories</MoreLink>} />
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="flex flex-col rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <span aria-hidden className="text-5xl font-serif leading-none text-brand/30">“</span>
              <blockquote className="m-0 -mt-2 flex-1 border-0 bg-transparent p-0 text-[15px] leading-relaxed text-slate-700">{t.quote}</blockquote>
              <figcaption className="mt-5 border-t border-slate-200 pt-4">
                <p className="font-semibold text-slate-900">{t.name}</p>
                {t.credentials && <p className="text-sm text-slate-500">{t.credentials}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function LandingPage() {
  const { data, isLoading } = useQuery("publicHome", () => getPublic("home"), { staleTime: 60_000, retry: false });
  const { website } = useInstituteConfig();
  // the institute's admin chooses which sections show and in what order
  const sections = {
    hero: <Hero data={data} cta={website?.hero_cta} />,
    stats: <Stats stats={data?.stats} />,
    features: <Features />,
    events: (isLoading || data?.events?.length > 0) && (
      <section className="bg-slate-50 py-20 sm:py-24">
        <Container>
          <SectionHead eyebrow="Events" title="Coming up" action={<MoreLink to={P.events}>All events</MoreLink>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{isLoading ? <CardSkeletons className="aspect-[16/9]" /> : data.events.map((e) => <EventCard key={e.id} e={e} />)}</div>
        </Container>
      </section>
    ),
    news: data?.news?.length > 0 && (
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHead eyebrow="News" title="From campus and the alumni community" action={<MoreLink to={P.news}>All news</MoreLink>} />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {data.news.map((n, i) => (
              <NewsCard key={n.id} n={n} large={i === 0} />
            ))}
          </div>
        </Container>
      </section>
    ),
    jobs: data?.jobs?.length > 0 && (
      <section className="bg-slate-50 py-20 sm:py-24">
        <Container>
          <SectionHead eyebrow="Careers" title="Opportunities shared with alumni" action={<MoreLink to={P.jobs}>All jobs</MoreLink>} />
          <div className="grid gap-4 md:grid-cols-2">
            {data.jobs.map((j) => (
              <JobRow key={j.id} j={j} />
            ))}
          </div>
        </Container>
      </section>
    ),
    testimonials: <Quotes items={data?.testimonials} />,
    join: <JoinBanner />,
  };
  const order = website?.sections || Object.keys(sections).map((key) => ({ key, visible: true }));
  return (
    <>
      {order
        .filter((s) => s.visible && sections[s.key])
        .map((s) => (
          <Fragment key={s.key}>{sections[s.key]}</Fragment>
        ))}
    </>
  );
}
