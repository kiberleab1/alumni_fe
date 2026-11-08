/** Public news (list by category, article) and jobs (list, detail). */
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { ArrowLeftIcon, BanknotesIcon, BriefcaseIcon, CalendarDaysIcon, ChartBarIcon, MapPinIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { getPublic } from "src/api";
import { SearchInput, cx } from "src/components/ui";
import { ButtonLink, CardSkeletons, Container, Cover, Empty, JobRow, JoinBanner, NewsCard, PageHero, Pager, P, RichText, SectionHead, fmtDate, prettyType } from "./kit";

function Chip({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cx("rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-inset transition", active ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-300 hover:ring-slate-400")}>
      {children}
    </button>
  );
}

export function NewsPage() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery(["publicNews", category, search, page], () => getPublic("news", { category: category || undefined, search, page }), { keepPreviousData: true, retry: false });
  const items = data?.items || [];
  const lead = page === 1 && !search && !category ? items[0] : null;
  const rest = lead ? items.slice(1) : items;
  return (
    <>
      <PageHero eyebrow="News" title="Stories from campus and the alumni community" subtitle="Achievements, announcements and the people behind them.">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {data?.categories?.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <Chip active={!category} onClick={() => (setCategory(""), setPage(1))}>
                All
              </Chip>
              {data.categories.map((c) => (
                <Chip key={c} active={category === c} onClick={() => (setCategory(c), setPage(1))}>
                  {c}
                </Chip>
              ))}
            </div>
          )}
          <SearchInput value={search} onChange={(v) => (setSearch(v), setPage(1))} placeholder="Search news" className="lg:ml-auto lg:w-72" />
        </div>
      </PageHero>
      <section className="py-12 sm:py-16">
        <Container>
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <CardSkeletons n={6} />
            </div>
          ) : !items.length ? (
            <Empty icon={NewspaperIcon} title={search || category ? "No stories match" : "No news yet"} text={search || category ? "Try another search or category." : "Check back soon for stories from campus and alumni."} />
          ) : (
            <>
              {lead && (
                <Link to={P.article(lead.id)} className="group mb-14 grid items-center gap-8 lg:grid-cols-2">
                  <Cover src={lead.image} className="aspect-[16/10] rounded-3xl" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-link">
                      {lead.featured ? "Featured · " : ""}
                      {lead.category}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 group-hover:text-link sm:text-3xl">{lead.title}</h2>
                    <p className="mt-3 line-clamp-4 leading-relaxed text-slate-600">{lead.excerpt}</p>
                    <p className="mt-4 text-sm text-slate-500">{fmtDate(lead.created_at)}</p>
                  </div>
                </Link>
              )}
              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((n) => (
                  <NewsCard key={n.id} n={n} />
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

function NotFound({ icon, title, back, label }) {
  return (
    <Container className="py-20">
      <Empty icon={icon} title={title} text="It may have been removed, or the link is incomplete.">
        <ButtonLink to={back} variant="secondary">
          {label}
        </ButtonLink>
      </Empty>
    </Container>
  );
}

function DetailSkeleton() {
  return (
    <Container className="max-w-3xl py-16">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-1/4 rounded bg-slate-200" />
        <div className="h-9 w-4/5 rounded bg-slate-200" />
        <div className="aspect-[16/9] rounded-3xl bg-slate-200" />
      </div>
    </Container>
  );
}

export function ArticlePage() {
  const { id } = useParams();
  const { data: n, isLoading, isError } = useQuery(["publicArticle", id], () => getPublic(`news/${id}`), { retry: false });
  if (isLoading) return <DetailSkeleton />;
  if (isError || !n) return <NotFound icon={NewspaperIcon} title="This story isn't available" back={P.news} label="See all news" />;
  return (
    <>
      <article>
        <Container className="max-w-3xl pt-8">
          <Link to={P.news} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeftIcon className="h-4 w-4" /> All news
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-link">{n.category}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">{n.title}</h1>
          <p className="mt-4 text-sm text-slate-500">{fmtDate(n.created_at)}</p>
        </Container>
        {n.image && (
          <Container className="mt-8 max-w-4xl">
            <Cover src={n.image} className="aspect-[16/9] rounded-3xl" />
          </Container>
        )}
        <Container className="max-w-3xl py-10">
          <RichText html={n.body} className="text-[17px] leading-8" />
        </Container>
      </article>
      {n.more?.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-16">
          <Container>
            <SectionHead title="Keep reading" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {n.more.map((x) => (
                <NewsCard key={x.id} n={x} />
              ))}
            </div>
          </Container>
        </section>
      )}
      <JoinBanner />
    </>
  );
}

const JOB_TYPES = ["Full time", "Part time", "Contract", "Internship", "Remote"];

export function JobsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery(["publicJobs", search, type, page], () => getPublic("jobs", { search, type: type || undefined, page }), { keepPreviousData: true, retry: false });
  return (
    <>
      <PageHero eyebrow="Careers" title="Opportunities shared with alumni" subtitle="Roles posted by the alumni office and by graduates hiring from their own community. Sign in to apply and ask for a referral.">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <SearchInput value={search} onChange={(v) => (setSearch(v), setPage(1))} placeholder="Search title, company or city" className="lg:w-80" />
          <div className="flex flex-wrap gap-2">
            <Chip active={!type} onClick={() => (setType(""), setPage(1))}>
              All types
            </Chip>
            {JOB_TYPES.map((t) => (
              <Chip key={t} active={type === t} onClick={() => (setType(t), setPage(1))}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
      </PageHero>
      <section className="py-12 sm:py-16">
        <Container className="max-w-4xl">
          {isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : !data?.items?.length ? (
            <Empty icon={BriefcaseIcon} title={search || type ? "No jobs match your search" : "No open jobs right now"} text="Members get new openings in their feed and by email as soon as they're posted.">
              <ButtonLink href={P.signup} variant="secondary">
                Join to get job alerts
              </ButtonLink>
            </Empty>
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-500">
                {data.total} open {data.total === 1 ? "role" : "roles"}
              </p>
              <div className="space-y-4">
                {data.items.map((j) => (
                  <JobRow key={j.id} j={j} />
                ))}
              </div>
              <Pager page={page} totalPage={data.totalPage} onChange={setPage} />
            </>
          )}
        </Container>
      </section>
      <JoinBanner title="Hiring? Post it for alumni." text="Members can share openings, refer classmates and find mentors in their field." />
    </>
  );
}

export function JobDetailPage() {
  const { id } = useParams();
  const { data: j, isLoading, isError } = useQuery(["publicJob", id], () => getPublic(`jobs/${id}`), { retry: false });
  if (isLoading) return <DetailSkeleton />;
  if (isError || !j) return <NotFound icon={BriefcaseIcon} title="This job isn't available" back={P.jobs} label="See open jobs" />;
  const facts = [
    { icon: BriefcaseIcon, label: "Type", value: prettyType(j.hiring_type) },
    { icon: ChartBarIcon, label: "Level", value: j.level },
    { icon: MapPinIcon, label: "Location", value: j.address },
    { icon: BanknotesIcon, label: "Salary", value: j.salary },
    { icon: CalendarDaysIcon, label: "Apply by", value: j.deadline && fmtDate(j.deadline) },
  ].filter((f) => f.value);
  return (
    <>
      <Container className="pt-8">
        <Link to={P.jobs} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeftIcon className="h-4 w-4" /> All jobs
        </Link>
      </Container>
      <Container className="py-8 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article>
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-link">
                <BriefcaseIcon className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{j.title}</h1>
                {j.company && <p className="mt-1 text-lg text-slate-600">{j.company}</p>}
              </div>
            </div>
            {j.closed && <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Applications for this role have closed.</p>}
            <h2 className="mt-10 text-lg font-semibold text-slate-900">About the role</h2>
            {j.description ? <RichText html={j.description} className="mt-3" /> : <p className="mt-3 text-slate-500">Sign in for the full details.</p>}
          </article>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <dl className="space-y-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex gap-3">
                    <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-link" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{f.label}</dt>
                      <dd className="mt-0.5 text-sm font-medium text-slate-900">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              {!j.closed && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <ButtonLink href={`${P.login}?next=${encodeURIComponent(`/user/jobs?job=${j.id}`)}`} className="w-full">
                    Sign in to apply
                  </ButtonLink>
                  <p className="mt-3 text-center text-sm text-slate-500">Members can also see classmates who work here and ask for a referral.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
      <JoinBanner />
    </>
  );
}
