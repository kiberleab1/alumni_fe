/** Public About, Stories (testimonials + podcasts), Gallery and Contact pages. */
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MicrophoneIcon,
  PhoneIcon,
  PhotoIcon,
  PlayCircleIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { apiErrorMessage, getPublic, sendContactMessage } from "src/api";
import { Spinner, cx } from "src/components/ui";
import { ButtonLink, Container, Empty, JoinBanner, MoreLink, PageHero, P, RichText, SectionHead, fmtNum, img } from "./kit";

function Quote({ t }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <span aria-hidden className="font-serif text-5xl leading-none text-brand/30">“</span>
      <blockquote className="m-0 -mt-2 flex-1 border-0 bg-transparent p-0 text-[15px] leading-relaxed text-slate-700">{t.quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-link">
          {t.name
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </span>
        <span>
          <span className="block font-semibold text-slate-900">{t.name}</span>
          {t.credentials && <span className="block text-sm text-slate-500">{t.credentials}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

export function AboutPage() {
  const { data, isLoading } = useQuery("publicAbout", () => getPublic("about"), { staleTime: 5 * 60_000, retry: false });
  const i = data?.institute;
  const story = data?.story;
  const storyImage = img(story?.images?.[0]);
  const facts = [
    i?.founded && { label: "Founded", value: i.founded },
    i?.type && { label: "Institution", value: i.type },
    data?.alumni != null && { label: "Alumni on the network", value: fmtNum(data.alumni) },
    data?.departments?.length && { label: "Departments", value: data.departments.length },
  ].filter(Boolean);
  return (
    <>
      <PageHero eyebrow="About us" title={i?.name ? `The ${i.name} alumni community` : "Our alumni community"} subtitle="A lifelong network for everyone who studied with us: to stay close, help each other grow, and give back." />

      <section className="py-16 sm:py-20">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Our story" title={story?.title || "Where it all started"} />
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 rounded bg-slate-200" />
                <div className="h-4 w-5/6 rounded bg-slate-200" />
              </div>
            ) : story?.description ? (
              <RichText html={story.description} />
            ) : (
              <p className="leading-relaxed text-slate-600">{i?.description || "Our graduates work across the country and around the world. This network keeps them connected to each other and to the place where they started."}</p>
            )}
            {facts.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-4">
                {facts.map((f) => (
                  <div key={f.label} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <dd className="text-2xl font-bold text-slate-900">{f.value}</dd>
                    <dt className="mt-0.5 text-sm text-slate-500">{f.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="relative">
            {storyImage ? (
              <img src={storyImage} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg" />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-brand to-brand/60 shadow-lg">
                <BuildingLibraryIcon className="h-20 w-20 text-white/50" />
              </div>
            )}
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200 sm:left-auto sm:w-72">
              <p className="text-sm font-semibold text-slate-900">What the network is for</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {["Reconnect with classmates", "Open doors for each other", "Support current students"].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-link" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {data?.departments?.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20">
          <Container>
            <SectionHead eyebrow="Academics" title="Departments" text="Alumni are grouped by department and class year, so it's easy to find the people you studied with." />
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.departments.map((d) => (
                <li key={d.id} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-medium text-slate-800 ring-1 ring-slate-200">
                  <AcademicCapIcon className="h-5 w-5 shrink-0 text-link" /> {d.name}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {data?.team?.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHead eyebrow="Our team" title="The people behind the network" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.team.map((s) => (
                <div key={s.id} className="text-center">
                  {img(s.photo) ? (
                    <img src={img(s.photo)} alt="" className="mx-auto aspect-square w-full max-w-[220px] rounded-3xl object-cover" loading="lazy" />
                  ) : (
                    <div className="mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center rounded-3xl bg-slate-100">
                      <UserCircleIcon className="h-16 w-16 text-slate-300" />
                    </div>
                  )}
                  <p className="mt-4 font-semibold text-slate-900">{s.name}</p>
                  {s.title && <p className="text-sm text-link">{s.title}</p>}
                  {s.bio && <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">{s.bio}</p>}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {data?.testimonials?.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20">
          <Container>
            <SectionHead eyebrow="Alumni voices" title="What graduates say" />
            <div className="grid gap-5 md:grid-cols-3">
              {data.testimonials.slice(0, 3).map((t) => (
                <Quote key={t.id} t={t} />
              ))}
            </div>
          </Container>
        </section>
      )}
      <JoinBanner />
    </>
  );
}

export function StoriesPage() {
  const { data, isLoading } = useQuery("publicStories", () => getPublic("stories"), { staleTime: 5 * 60_000, retry: false });
  const none = !isLoading && !data?.testimonials?.length && !data?.podcasts?.length;
  return (
    <>
      <PageHero eyebrow="Alumni stories" title="Where our graduates are now" subtitle="Career paths, lessons learned and advice from alumni, in their own words." />
      <section className="py-12 sm:py-16">
        <Container>
          {none && (
            <Empty icon={MicrophoneIcon} title="Stories are on their way" text="We're collecting stories from alumni. Want to share yours?">
              <ButtonLink to={P.contact} variant="secondary">
                Tell us your story
              </ButtonLink>
            </Empty>
          )}
          {data?.testimonials?.length > 0 && (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
              {data.testimonials.map((t) => (
                <Quote key={t.id} t={t} />
              ))}
            </div>
          )}
        </Container>
      </section>
      {data?.podcasts?.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20">
          <Container>
            <SectionHead eyebrow="Podcast" title="Listen to alumni" action={<MoreLink to={P.podcasts}>All episodes</MoreLink>} />
            <div className="grid gap-6 md:grid-cols-2">
              {data.podcasts.slice(0, 2).map((p) => (
                <PodcastCard key={p.id} p={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
      <JoinBanner title="Have a story worth sharing?" text="Join the network to share updates, mentor students and inspire the next class." />
    </>
  );
}

/** YouTube video id from any common link form; null for other sites */
function youtubeId(url) {
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/** Thumbnail first, player on click, so a page of episodes stays fast. */
function PodcastCard({ p }) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(p.url);
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      {id ? (
        playing ? (
          <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={p.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group relative aspect-video w-full bg-slate-900" aria-label={`Play ${p.title}`}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
            <PlayCircleIcon className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg transition group-hover:scale-110" />
          </button>
        )
      ) : (
        <a href={p.url} target="_blank" rel="noreferrer" className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand to-brand/60" aria-label={`Listen to ${p.title}`}>
          <PlayCircleIcon className="h-16 w-16 text-white" />
        </a>
      )}
      <div className="p-5">
        <h3 className="font-semibold leading-snug text-slate-900">{p.title}</h3>
        {p.description && <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600">{p.description}</p>}
      </div>
    </article>
  );
}

export function PodcastsPage() {
  const { data, isLoading } = useQuery("publicStories", () => getPublic("stories"), { staleTime: 5 * 60_000, retry: false });
  return (
    <>
      <PageHero eyebrow="Podcast" title="Listen and watch" subtitle="Conversations and talks for the alumni community. Press play to watch right here." />
      <section className="py-12 sm:py-16">
        <Container>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-video animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : !data?.podcasts?.length ? (
            <Empty icon={MicrophoneIcon} title="No episodes yet" text="New episodes will appear here as soon as they're published." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.podcasts.map((p) => (
                <PodcastCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </Container>
      </section>
      <JoinBanner />
    </>
  );
}

function Lightbox({ images, index, onClose, onMove }) {
  useEffect(() => {
    const key = (e) => (e.key === "Escape" ? onClose() : e.key === "ArrowRight" ? onMove(1) : e.key === "ArrowLeft" ? onMove(-1) : null);
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);
  const btn = "absolute rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20";
  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4" onClick={onClose}>
      <img src={images[index]} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
      <button type="button" aria-label="Close" className={cx(btn, "right-4 top-4")} onClick={onClose}>
        <XMarkIcon className="h-6 w-6" />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" aria-label="Previous photo" className={cx(btn, "left-4 top-1/2 -translate-y-1/2")} onClick={(e) => (e.stopPropagation(), onMove(-1))}>
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button type="button" aria-label="Next photo" className={cx(btn, "right-4 top-1/2 -translate-y-1/2")} onClick={(e) => (e.stopPropagation(), onMove(1))}>
            <ChevronRightIcon className="h-6 w-6" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  );
}

export function GalleryPage() {
  const { data, isLoading } = useQuery("publicGallery", () => getPublic("gallery"), { staleTime: 5 * 60_000, retry: false });
  const [open, setOpen] = useState(null); // { album, index }
  const albums = (data?.albums || []).map((a) => ({ ...a, urls: a.images.map(img).filter(Boolean) }));
  return (
    <>
      <PageHero eyebrow="Gallery" title="Moments from campus and alumni events" subtitle="Graduations, reunions and everything in between." />
      <section className="py-12 sm:py-16">
        <Container className="space-y-16">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : !albums.length ? (
            <Empty icon={PhotoIcon} title="No photos yet" text="Photos from events and campus life will appear here." />
          ) : (
            albums.map((a, ai) => (
              <div key={a.id}>
                {(a.title || albums.length > 1) && <SectionHead title={a.title || `Album ${ai + 1}`} text={a.description ? a.description.replace(/<[^>]*>/g, " ").trim().slice(0, 200) : undefined} />}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {a.urls.map((u, i) => (
                    <button key={u + i} type="button" onClick={() => setOpen({ album: ai, index: i })} className={cx("group relative overflow-hidden rounded-2xl bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand", i === 0 && a.urls.length > 4 && "col-span-2 row-span-2")}>
                      <img src={u} alt="" loading="lazy" className="aspect-square h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      <span className="sr-only">Open photo {i + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </Container>
      </section>
      {open && (
        <Lightbox
          images={albums[open.album].urls}
          index={open.index}
          onClose={() => setOpen(null)}
          onMove={(d) => setOpen((o) => ({ ...o, index: (o.index + d + albums[o.album].urls.length) % albums[o.album].urls.length }))}
        />
      )}
    </>
  );
}

export function ContactPage() {
  const { data } = useQuery("publicAbout", () => getPublic("about"), { staleTime: 5 * 60_000, retry: false });
  const i = data?.institute;
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [touched, setTouched] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const errors = {
    name: f.name.trim().length < 2 && "Add your name",
    email: !/^\S+@\S+\.\S+$/.test(f.email.trim()) && "Enter a valid email",
    message: f.message.trim().length < 10 && "Write a little more (at least 10 characters)",
  };
  const ok = !Object.values(errors).some(Boolean);
  const send = useMutation(() => sendContactMessage(f));
  const field = (bad) => cx("mt-1.5 block w-full rounded-xl border-0 px-4 py-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand", touched && bad ? "ring-rose-300" : "ring-slate-300");
  const Err = ({ k }) => (touched && errors[k] ? <p className="mt-1 text-sm text-rose-600">{errors[k]}</p> : null);
  const rows = [
    i?.email && { icon: EnvelopeIcon, label: "Email", value: i.email, href: `mailto:${i.email}` },
    i?.phone && { icon: PhoneIcon, label: "Phone", value: i.phone, href: `tel:${i.phone.replace(/[^\d+]/g, "")}` },
    i?.website && { icon: GlobeAltIcon, label: "Website", value: i.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), href: i.website },
  ].filter(Boolean);
  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you" subtitle="Questions about membership, events or documents? Want to share a story or partner with us? Send a message and the alumni office will reply by email." />
      <section className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {rows.map((r) => (
              <a key={r.label} href={r.href} target={r.label === "Website" ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:ring-brand/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-link">
                  <r.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{r.label}</span>
                  <span className="block truncate font-medium text-slate-900">{r.value}</span>
                </span>
              </a>
            ))}
            <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-600 ring-1 ring-slate-200">
              <p className="font-semibold text-slate-900">Already a member?</p>
              <p className="mt-1">Sign in to request documents, message the alumni office directly and track your requests.</p>
              <a href={P.login} className="mt-3 inline-block font-semibold text-link hover:underline">
                Sign in →
              </a>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            {send.isSuccess ? (
              <div className="py-10 text-center">
                <CheckCircleIcon className="mx-auto h-14 w-14 text-emerald-500" />
                <h2 className="mt-4 text-xl font-semibold text-slate-900">Message sent</h2>
                <p className="mx-auto mt-2 max-w-sm text-slate-600">Thanks, {f.name.split(" ")[0]}. We'll reply to {f.email} as soon as we can.</p>
                <button type="button" className="mt-6 text-sm font-semibold text-link hover:underline" onClick={() => (send.reset(), setF({ name: "", email: "", subject: "", message: "", website: "" }), setTouched(false))}>
                  Send another message
                </button>
              </div>
            ) : (
              <form
                noValidate
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setTouched(true);
                  if (ok) send.mutate();
                }}
              >
                <h2 className="text-xl font-semibold text-slate-900">Send a message</h2>
                {send.isError && (
                  <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
                    {apiErrorMessage(send.error, "Couldn't send your message. Please try again.")}
                  </p>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="text-sm font-medium text-slate-700">
                      Your name
                    </label>
                    <input id="c-name" autoComplete="name" className={field(errors.name)} value={f.name} onChange={set("name")} maxLength={100} />
                    <Err k="name" />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input id="c-email" type="email" autoComplete="email" className={field(errors.email)} value={f.email} onChange={set("email")} maxLength={200} />
                    <Err k="email" />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-subject" className="text-sm font-medium text-slate-700">
                    Subject <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input id="c-subject" className={field(false)} value={f.subject} onChange={set("subject")} maxLength={150} placeholder="e.g. Question about the reunion" />
                </div>
                <div>
                  <label htmlFor="c-message" className="text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea id="c-message" rows={6} className={field(errors.message)} value={f.message} onChange={set("message")} maxLength={4000} />
                  <Err k="message" />
                </div>
                {/* honeypot for bots; hidden from people and screen readers */}
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={f.website} onChange={set("website")} />
                <button type="submit" disabled={send.isLoading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover disabled:opacity-70 sm:w-auto">
                  {send.isLoading && <Spinner className="h-4 w-4" />} Send message
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
