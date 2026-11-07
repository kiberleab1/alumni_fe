/**
 * Public home page (design board: Public landing). New hero, live numbers,
 * what members get, upcoming events and latest stories, then the sections
 * admins manage in Web content (about, team, testimonials, contact).
 * Colours come from the institute theme, so admin branding applies here too.
 */
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  MapPinIcon,
  RectangleGroupIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getImageBaseUrl, getPublicHome, getWebContentByComonent } from "src/api";
import ContactComponent from "src/views/custom-components/sections/contactComponent";
import TeamComponent from "src/views/custom-components/sections/teamComponent";
import TestimonialComponent from "src/views/custom-components/sections/testimonialComponent";
import AboutUsPage from "./aboutus/aboutPage";


const FEATURES = [
  { icon: UserGroupIcon, title: "Find classmates", text: "Search alumni by class, department and company, and reconnect." },
  { icon: ChatBubbleLeftRightIcon, title: "Message your network", text: "Private, real-time messages with the people you know." },
  { icon: BriefcaseIcon, title: "Jobs and referrals", text: "Openings shared with alumni, and the classmates who already work there." },
  { icon: LightBulbIcon, title: "Mentorship", text: "Get advice from graduates ahead of you, or mentor someone yourself." },
  { icon: CalendarDaysIcon, title: "Events and reunions", text: "RSVP, add to your calendar and see who else is going." },
  { icon: ClipboardDocumentCheckIcon, title: "Documents", text: "Request verification letters and transcripts and follow their progress." },
];

const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
const fmtNum = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n ?? 0));

function Hero({ name }) {
  const slide = useQuery("landingSlideshow", () => getWebContentByComonent({ component: "slideshow", pageNumber: 1, pageSize: 1 }), { staleTime: 300_000, retry: false });
  const s = slide.data?.data?.[0];
  const image = s?.image?.[0] ? getImageBaseUrl(s.image[0]) : null;
  return (
    <section className="relative isolate overflow-hidden bg-side">
      {image && <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/80 via-black/40 to-black/70" />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/70">{name ? `${name} alumni network` : "Alumni network"}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{s?.title || "Stay connected with the people who shaped you."}</h1>
        <p className="mt-5 max-w-2xl text-lg text-white/80">{s?.description || "Find classmates, discover jobs and mentors, and keep up with events and news from your institute, all in one place."}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100">
            Join the network <ArrowRightIcon className="h-4 w-4" />
          </a>
          <a href="/login" className="inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/40 hover:bg-white/10">
            Sign in
          </a>
        </div>
      </div>
    </section>
  );
}

function Stats({ stats }) {
  const items = [
    { label: "Alumni", value: stats?.alumni, icon: AcademicCapIcon },
    { label: "Upcoming events", value: stats?.upcoming_events, icon: CalendarDaysIcon },
    { label: "Open jobs", value: stats?.open_jobs, icon: BriefcaseIcon },
    { label: "Groups", value: stats?.groups, icon: RectangleGroupIcon },
  ];
  return (
    <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-4 sm:px-6">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-lg ring-1 ring-slate-200 md:grid-cols-4">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-3 bg-white p-5">
            <i.icon className="h-6 w-6 shrink-0 text-link" />
            <div>
              <dd className="text-2xl font-bold text-slate-900">{stats ? fmtNum(i.value) : "–"}</dd>
              <dt className="text-sm text-slate-500">{i.label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-link">{eyebrow}</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-900">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function LandingPage() {
  const { data } = useQuery("publicHome", getPublicHome, { staleTime: 60_000, retry: false });
  const name = data?.institute?.name;
  return (
    <div className="ui-scope overflow-x-hidden bg-white font-theme">
      <Hero name={name} />
      <Stats stats={data?.stats} />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="Why join" title="Everything your alumni community needs" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-link">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {data?.events?.length > 0 && (
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead
              eyebrow="Events"
              title="Coming up"
              action={
                <Link to="/landing/events" className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
                  All events <ArrowRightIcon className="h-4 w-4" />
                </Link>
              }
            />
            <div className="grid gap-6 md:grid-cols-3">
              {data.events.map((e) => (
                <article key={e.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  {e.image ? <img src={getImageBaseUrl(e.image)} alt="" className="h-40 w-full object-cover" loading="lazy" /> : <div className="h-40 bg-gradient-to-br from-brand to-accent" />}
                  <div className="p-5">
                    <p className="text-sm font-semibold text-link">{fmtDate(e.time)}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{e.title}</h3>
                    {e.venue && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <MapPinIcon className="h-4 w-4" /> {e.venue}
                      </p>
                    )}
                    <a href="/login" className="mt-4 inline-block text-sm font-semibold text-link hover:underline">
                      Sign in to RSVP
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {data?.news?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHead eyebrow="News" title="From campus and alumni" />
          <div className="grid gap-6 md:grid-cols-3">
            {data.news.map((n) => (
              <article key={n.id} className="flex flex-col">
                {n.image ? <img src={getImageBaseUrl(n.image)} alt="" className="h-44 w-full rounded-2xl object-cover" loading="lazy" /> : <div className="h-44 rounded-2xl bg-slate-100" />}
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-link">{n.category}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{n.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-slate-600">{n.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <AboutUsPage />
      <TeamComponent />
      <TestimonialComponent />

      <section className="bg-brand">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Your classmates are already here.</h2>
            <p className="mt-2 text-white/80">Join free in a minute and pick up where you left off.</p>
          </div>
          <a href="/signup" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100">
            Create your account <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
      </section>

      <ContactComponent />
    </div>
  );
}

export default LandingPage;
