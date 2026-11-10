/**
 * Building blocks shared by every page of the public website: layout widths,
 * page heroes, section headings, content cards, pagination, empty states and
 * safe rich text. Colours come from the institute theme tokens.
 */
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { ArrowRightIcon, BriefcaseIcon, CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, MapPinIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { getImageBaseUrl } from "src/api";
import { useSurfaceDesign } from "src/lib/theme";
import { cx } from "src/components/ui";

export const P = {
  home: "/landing",
  about: "/landing/about",
  events: "/landing/events",
  event: (id) => `/landing/events/${id}`,
  news: "/landing/news",
  article: (id) => `/landing/news/${id}`,
  jobs: "/landing/jobs",
  job: (id) => `/landing/jobs/${id}`,
  gallery: "/landing/gallery",
  stories: "/landing/stories",
  podcasts: "/landing/podcasts",
  contact: "/landing/contact",
  login: "/login",
  signup: "/signup",
};

export const img = (path) => (path ? (/^https?:/.test(path) ? path : getImageBaseUrl(path)) : null);
export const fmtDay = (d) => new Date(d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
export const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
export const fmtTime = (d) => new Date(d).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
export const fmtNum = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n ?? 0));
/** date-only events are stored as midnight UTC; don't show that as a time (3:00 AM in Addis) */
export const hasTime = (d) => {
  const x = new Date(d);
  return x.getUTCHours() !== 0 || x.getUTCMinutes() !== 0;
};
export const prettyType = (t) => (t ? String(t).replace(/[_-]+/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "");

export function Container({ className, children }) {
  const { width } = useSurfaceDesign("public");
  return <div className={cx("mx-auto w-full px-4 sm:px-6 lg:px-8", width === "wide" ? "max-w-7xl" : "max-w-6xl", className)}>{children}</div>;
}

/** Title band at the top of every inner page. */
export function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-brand/5 blur-3xl" />
      <Container className="relative py-12 sm:py-16">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-link">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{subtitle}</p>}
        {children && <div className="mt-6">{children}</div>}
      </Container>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, action, center }) {
  return (
    <div className={cx("mb-8 flex flex-wrap items-end gap-4 sm:mb-10", center ? "flex-col items-center text-center" : "justify-between")}>
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-link">{eyebrow}</p>}
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {text && <p className="mt-2 text-slate-600">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function MoreLink({ to, children }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
      {children} <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </Link>
  );
}

export function ButtonLink({ to, href, variant = "primary", className, children }) {
  const cls = cx(
    "inline-flex items-center justify-center gap-2 rounded-btn px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    variant === "primary" && "bg-brand text-white shadow-sm hover:bg-brand-hover",
    variant === "white" && "bg-white text-slate-900 shadow-sm hover:bg-slate-100",
    variant === "ghost-light" && "text-white ring-1 ring-inset ring-white/40 hover:bg-white/10",
    variant === "secondary" && "bg-white text-slate-800 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
    className
  );
  return href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

/** Image with a branded placeholder when the item has none (or it fails). */
export function Cover({ src, className, icon: Icon = NewspaperIcon }) {
  const url = img(src);
  return (
    <div className={cx("relative overflow-hidden bg-gradient-to-br from-brand to-brand/50", className)}>
      {/* icon sits underneath; a loaded image covers it */}
      <Icon aria-hidden className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-white/40" />
      {url ? <img src={url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} /> : null}
    </div>
  );
}

export function DateBadge({ date }) {
  const d = new Date(date);
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white text-center shadow-sm ring-1 ring-slate-200">
      <span className="text-[11px] font-semibold uppercase text-link">{d.toLocaleDateString(undefined, { month: "short" })}</span>
      <span className="text-xl font-bold leading-none text-slate-900">{d.getDate()}</span>
    </div>
  );
}

export function EventCard({ e }) {
  return (
    <Link to={P.event(e.id)} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <Cover src={e.image} icon={CalendarDaysIcon} className="aspect-[16/9]" />
        <div className="absolute left-4 top-4">
          <DateBadge date={e.time} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-slate-900 group-hover:text-link">{e.title}</h3>
        <div className="mt-2 space-y-1 text-sm text-slate-500">
          <p className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 shrink-0" /> {fmtDay(e.time)}
            {hasTime(e.time) ? ` · ${fmtTime(e.time)}` : ""}
          </p>
          {e.venue && (
            <p className="flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 shrink-0" /> <span className="truncate">{e.venue}</span>
            </p>
          )}
        </div>
        {e.excerpt && <p className="mt-3 line-clamp-2 text-sm text-slate-600">{e.excerpt}</p>}
      </div>
    </Link>
  );
}

export function NewsCard({ n, large }) {
  return (
    <Link to={P.article(n.id)} className={cx("group flex flex-col", large && "lg:col-span-2")}>
      <Cover src={n.image} className={cx("rounded-2xl", large ? "aspect-[16/9]" : "aspect-[3/2]")} />
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-link">
        {n.category}
        <span className="font-normal normal-case tracking-normal text-slate-400"> · {fmtDate(n.created_at)}</span>
      </p>
      <h3 className={cx("mt-1.5 font-semibold leading-snug text-slate-900 group-hover:text-link", large ? "text-2xl" : "text-lg")}>{n.title}</h3>
      {n.excerpt && <p className={cx("mt-2 text-sm leading-relaxed text-slate-600", large ? "line-clamp-3" : "line-clamp-2")}>{n.excerpt}</p>}
    </Link>
  );
}

export function JobRow({ j }) {
  const days = j.deadline ? Math.ceil((new Date(j.deadline) - Date.now()) / 86_400_000) : null;
  return (
    <Link to={P.job(j.id)} className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-brand/40">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-link">
        <BriefcaseIcon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-slate-900 group-hover:text-link">{j.title}</h3>
        <p className="mt-0.5 text-sm text-slate-600">{[j.company, j.address].filter(Boolean).join(" · ")}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
          {j.hiring_type && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{prettyType(j.hiring_type)}</span>}
          {j.level && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{j.level}</span>}
          {j.salary && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{j.salary}</span>}
        </div>
      </div>
      {days !== null && <span className={cx("hidden shrink-0 text-xs font-medium sm:block", days <= 7 ? "text-amber-700" : "text-slate-500")}>{days <= 0 ? "Closes today" : `Closes in ${days} day${days === 1 ? "" : "s"}`}</span>}
    </Link>
  );
}

export function Empty({ icon: Icon = NewspaperIcon, title, text, children }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <Icon className="mx-auto h-10 w-10 text-slate-300" />
      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{text}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function CardSkeletons({ n = 3, className = "aspect-[3/2]" }) {
  return Array.from({ length: n }, (_, i) => (
    <div key={i} className="animate-pulse">
      <div className={cx("rounded-2xl bg-slate-200", className)} />
      <div className="mt-4 h-3 w-1/3 rounded bg-slate-200" />
      <div className="mt-2 h-5 w-4/5 rounded bg-slate-200" />
    </div>
  ));
}

export function Pager({ page, totalPage, onChange }) {
  if (!totalPage || totalPage < 2) return null;
  const btn = "inline-flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-medium ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pages">
      <button type="button" className={btn} disabled={page <= 1} onClick={() => (onChange(page - 1), window.scrollTo({ top: 0, behavior: "smooth" }))}>
        <ChevronLeftIcon className="h-4 w-4" /> Previous
      </button>
      <span className="text-sm text-slate-500">
        Page {page} of {totalPage}
      </span>
      <button type="button" className={btn} disabled={page >= totalPage} onClick={() => (onChange(page + 1), window.scrollTo({ top: 0, behavior: "smooth" }))}>
        Next <ChevronRightIcon className="h-4 w-4" />
      </button>
    </nav>
  );
}

export function RichText({ html, className }) {
  const clean = DOMPurify.sanitize(html || "", { USE_PROFILES: { html: true } });
  return <div className={cx("rich-text text-[15px] leading-relaxed text-slate-700 sm:text-base", className)} dangerouslySetInnerHTML={{ __html: clean }} />;
}

/** Closing call to action used at the bottom of most pages. */
export function JoinBanner({ title = "Your classmates are already here.", text = "Join free in a minute to message alumni, RSVP to events and see every opportunity." }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 sm:px-12 sm:py-14">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/5" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
              <p className="mt-2 text-white/85">{text}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href={P.signup} variant="white">
                Join the network <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={P.login} variant="ghost-light">
                Sign in
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
