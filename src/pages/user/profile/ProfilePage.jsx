/**
 * Member profile (design board: Profile). One page for your own profile
 * (/user/profile) and other members' (/user/people/:id): header with actions,
 * About, Experience, Education, skills, links, mentoring and shared groups.
 * What's shown follows the member's privacy settings (enforced by the API).
 */
import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  LightBulbIcon,
  LinkIcon,
  LockClosedIcon,
  MapPinIcon,
  PencilSquareIcon,
  PhoneIcon,
  RectangleGroupIcon,
  ShareIcon,
  SparklesIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { getMyProfile, getUserProfile, removeConnection, respondToConnection, saveMyProfile, sendConnectionRequest, uploadProfilePhoto } from "src/api";
import { useRealtime } from "src/lib/realtime";
import { PATHS, chatPath, groupPath } from "src/lib/nav";
import { useBlockUser } from "src/pages/user/settings/SettingsPage";
import { Avatar, Button, Card, EmptyState, Field, Modal, Pill, Spinner, TagInput, apiError, cx, inputClass, monthYear } from "src/components/ui";

export const SKILL_SUGGESTIONS = ["Communication", "Project management", "Python", "SQL", "Excel", "Data analysis", "Leadership", "Accounting", "Marketing", "Teaching", "Research", "Design"];
const LANGUAGE_SUGGESTIONS = ["Amharic", "English", "Afaan Oromo", "Tigrinya", "Somali", "Arabic", "French"];
const LINKS = [
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/…" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/…" },
  { key: "website", label: "Website", placeholder: "https://…" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/…" },
];
const placeOf = (loc) => (loc ? [loc.city, loc.country].filter(Boolean).join(", ") : "");
const host = (url) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/* ------------------------------------------------------------------ editor */

export function ProfileEditor({ open, onClose, data, focus }) {
  const queryClient = useQueryClient();
  const p = data?.profile || {};
  const [f, setF] = useState(null);
  const [error, setError] = useState(null);
  const form =
    f ||
    (data && {
      first_name: data.user.first_name || "",
      last_name: data.user.last_name || "",
      headline: p.headline || "",
      bio: p.bio || "",
      department_id: p.department_id || "",
      degree: p.degree || "",
      graduation_year: p.graduation_year || "",
      skills: p.skills || [],
      languages: p.languages || [],
      links: { linkedin: "", github: "", website: "", twitter: "", ...(p.links || {}) },
    });
  const set = (k) => (e) => setF({ ...form, [k]: e?.target ? e.target.value : e });
  const save = useMutation(saveMyProfile, {
    onSuccess: (d) => {
      queryClient.setQueryData("myProfile", d);
      queryClient.invalidateQueries("userProfile");
      queryClient.invalidateQueries("alumniProfile");
      toast.success("Profile saved");
      setF(null);
      onClose();
    },
    onError: (e) => setError(apiError(e)),
  });
  if (!form) return null;
  const years = Array.from({ length: new Date().getFullYear() + 6 - 1960 }, (_, i) => new Date().getFullYear() + 5 - i);
  const submit = (e) => {
    e.preventDefault();
    setError(null);
    if (!form.first_name.trim() || !form.last_name.trim()) return setError("Add your first and last name");
    if (!form.department_id || !form.degree.trim() || !form.graduation_year) return setError("Add your department, degree and graduation year");
    const bad = LINKS.find((l) => form.links[l.key] && !/^https?:\/\/\S+\.\S+/.test(form.links[l.key]));
    if (bad) return setError(`${bad.label} should be a full link starting with https://`);
    save.mutate({ ...form, graduation_year: Number(form.graduation_year) });
  };
  return (
    <Modal open={open} onClose={() => (setF(null), setError(null), onClose())} title="Edit profile" size="lg">
      <form onSubmit={submit} className="space-y-6" noValidate>
        <section className="space-y-4" id="edit-basics">
          <h3 className="text-sm font-semibold text-slate-900">Basics</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" htmlFor="pf-first">
              <input id="pf-first" className={inputClass} value={form.first_name} onChange={set("first_name")} maxLength={60} />
            </Field>
            <Field label="Last name" htmlFor="pf-last">
              <input id="pf-last" className={inputClass} value={form.last_name} onChange={set("last_name")} maxLength={60} />
            </Field>
          </div>
          <Field label="Headline" htmlFor="pf-headline" hint="One line under your name, e.g. “Data Analyst at Ethio Telecom”">
            <input id="pf-headline" className={inputClass} value={form.headline} onChange={set("headline")} maxLength={120} autoFocus={focus === "headline"} />
          </Field>
        </section>
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Education</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Department" htmlFor="pf-dept" className="sm:col-span-3">
              <select id="pf-dept" className={inputClass} value={form.department_id} onChange={set("department_id")}>
                <option value="">Choose your department</option>
                {(data.departments || []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Degree" htmlFor="pf-degree" className="sm:col-span-2">
              <input id="pf-degree" className={inputClass} value={form.degree} onChange={set("degree")} placeholder="e.g. BSc Computer Science" maxLength={120} />
            </Field>
            <Field label="Graduation year" htmlFor="pf-year">
              <select id="pf-year" className={inputClass} value={form.graduation_year} onChange={set("graduation_year")}>
                <option value="">Year</option>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">About</h3>
          <Field label="Bio" htmlFor="pf-bio" hint={`${form.bio.length}/2000`}>
            <textarea id="pf-bio" rows={4} className={inputClass} value={form.bio} onChange={set("bio")} maxLength={2000} placeholder="What you do, what you're interested in, what you can help classmates with" autoFocus={focus === "bio"} />
          </Field>
          <Field label="Skills" htmlFor="pf-skills">
            <TagInput id="pf-skills" value={form.skills} onChange={set("skills")} suggestions={SKILL_SUGGESTIONS} placeholder="Add a skill and press Enter" />
          </Field>
          <Field label="Languages" htmlFor="pf-langs">
            <TagInput id="pf-langs" value={form.languages} onChange={set("languages")} suggestions={LANGUAGE_SUGGESTIONS} max={15} placeholder="Add a language" />
          </Field>
        </section>
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {LINKS.map((l) => (
              <Field key={l.key} label={l.label} htmlFor={`pf-${l.key}`}>
                <input id={`pf-${l.key}`} type="url" className={inputClass} value={form.links[l.key]} onChange={(e) => setF({ ...form, links: { ...form.links, [l.key]: e.target.value } })} placeholder={l.placeholder} />
              </Field>
            ))}
          </div>
        </section>
        {error && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={() => (setF(null), onClose())}>
            Cancel
          </Button>
          <Button type="submit" loading={save.isLoading}>
            Save profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ actions */

function ConnectionActions({ view }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, connection } = view;
  const refresh = () => {
    queryClient.invalidateQueries(["userProfile", user.id]);
    queryClient.invalidateQueries("connectionCounts");
    queryClient.invalidateQueries("connections");
  };
  const connect = useMutation(() => sendConnectionRequest({ user_id: user.id }), {
    onSuccess: () => (toast.success(`Request sent to ${user.first_name}`), refresh()),
    onError: (e) => toast.error(apiError(e)),
  });
  const respond = useMutation((status) => respondToConnection({ id: connection.id, status }), {
    onSuccess: (_, status) => (toast.success(status === "accepted" ? `You're now connected with ${user.first_name}` : status === "cancelled" ? "Request withdrawn" : "Request ignored"), refresh()),
    onError: (e) => toast.error(apiError(e)),
  });
  const remove = useMutation(() => removeConnection({ user_id: user.id }), {
    onSuccess: () => (toast.success("Connection removed"), refresh()),
    onError: (e) => toast.error(apiError(e)),
  });
  const block = useBlockUser(() => navigate(PATHS.people));
  const message = (
    <Button onClick={() => navigate(chatPath(user.id), { state: { peer: { id: user.id, name: user.name, photo: view.profile?.photo } } })}>
      <ChatBubbleLeftRightIcon className="h-4 w-4" /> Message
    </Button>
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      {connection.state === "connected" && message}
      {connection.state === "none" && (
        <>
          <Button loading={connect.isLoading} onClick={() => connect.mutate()}>
            <UserPlusIcon className="h-4 w-4" /> Connect
          </Button>
          <Button variant="secondary" onClick={() => navigate(chatPath(user.id), { state: { peer: { id: user.id, name: user.name, photo: view.profile?.photo } } })}>
            Message
          </Button>
        </>
      )}
      {connection.state === "pending_sent" && (
        <Button variant="secondary" loading={respond.isLoading} onClick={() => respond.mutate("cancelled")}>
          Withdraw request
        </Button>
      )}
      {connection.state === "pending_received" && (
        <>
          <Button loading={respond.isLoading} onClick={() => respond.mutate("accepted")}>
            Accept request
          </Button>
          <Button variant="secondary" disabled={respond.isLoading} onClick={() => respond.mutate("declined")}>
            Ignore
          </Button>
        </>
      )}
      <details className="relative">
        <summary className="list-none rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 [&::-webkit-details-marker]:hidden" aria-label="More actions">
          More
        </summary>
        <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-slate-200">
          {connection.state === "connected" && (
            <button className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50" onClick={() => window.confirm(`Remove ${user.first_name} from your connections?`) && remove.mutate()}>
              Remove connection
            </button>
          )}
          <button className="block w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50" onClick={() => window.confirm(`Block ${user.name}? They won't be able to message or connect with you, and they aren't told.`) && block.mutate(user.id)}>
            Block {user.first_name}
          </button>
        </div>
      </details>
    </div>
  );
}

function PhotoButton() {
  const ref = useRef(null);
  const queryClient = useQueryClient();
  const upload = useMutation(uploadProfilePhoto, {
    onSuccess: (d) => {
      queryClient.setQueryData("myProfile", d);
      queryClient.invalidateQueries("userProfile");
      toast.success("Photo updated");
    },
    onError: (e) => toast.error(apiError(e, "Couldn't upload the photo")),
  });
  return (
    <>
      <button type="button" onClick={() => ref.current?.click()} className="absolute bottom-0 right-0 rounded-full bg-white p-1.5 text-slate-600 shadow ring-1 ring-slate-200 hover:text-slate-900" aria-label="Change photo">
        {upload.isLoading ? <Spinner className="h-4 w-4" /> : <CameraIcon className="h-4 w-4" />}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) return toast.error("Choose an image under 5 MB");
          upload.mutate(file);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ page */

function Section({ icon: Icon, title, action, children }) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          {Icon && <Icon className="h-5 w-5 text-slate-400" />} {title}
        </h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

function Completeness({ data, onEdit }) {
  const c = data.completeness;
  if (!c || c.percent >= 100) return null;
  const to = { photo: null, headline: "headline", bio: "bio", skills: "skills", career: PATHS.career, profile: null };
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-slate-100" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-brand" strokeWidth="3.5" strokeDasharray={`${(c.percent / 100) * 97.4} 97.4`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900">{c.percent}%</span>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Complete your profile</p>
          <p className="text-sm text-slate-500">Complete profiles show up first in search.</p>
        </div>
      </div>
      <ul className="mt-3 space-y-1">
        {c.checks
          .filter((x) => !x.done)
          .map((x) => (
            <li key={x.key}>
              {to[x.key] && to[x.key].startsWith("/") ? (
                <Link to={to[x.key]} className="text-sm font-medium text-link hover:underline">
                  {x.label}
                </Link>
              ) : (
                <button type="button" onClick={() => onEdit(to[x.key])} className="text-sm font-medium text-link hover:underline">
                  {x.label}
                </button>
              )}
            </li>
          ))}
      </ul>
    </Card>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const { me } = useRealtime();
  const userId = params.userId || me?.id;
  const self = String(userId) === String(me?.id);
  const [editing, setEditing] = useState(null); // null | focus key
  const view = useQuery(["userProfile", userId], () => getUserProfile(userId), { enabled: !!userId, retry: false });
  const mine = useQuery("myProfile", getMyProfile, { enabled: self });

  const copyLink = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/user/people/${userId}`);
    toast.success("Profile link copied");
  };

  if (view.isLoading || (self && mine.isLoading)) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }
  if (view.isError) {
    return (
      <Card className="ui-scope mx-auto max-w-xl">
        <EmptyState icon={LockClosedIcon} title="Profile not available" description="This member may have hidden their profile, or the link is wrong." action={<Link to={PATHS.people} className="font-semibold text-link">Find people</Link>} />
      </Card>
    );
  }
  const v = view.data;
  const p = v.profile;
  const place = placeOf(v.user.location);
  const links = p ? LINKS.filter((l) => p.links?.[l.key]) : [];

  if (self && !p) {
    return (
      <div className="ui-scope mx-auto max-w-2xl">
        <Card>
          <EmptyState
            icon={SparklesIcon}
            title="Set up your alumni profile"
            description="Add your department, class and what you do now, so classmates can find you."
            action={
              <Link to={PATHS.welcome} className="inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover">
                Get started
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="ui-scope mx-auto max-w-5xl space-y-5">
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-brand to-accent sm:h-36" />
        <div className="px-5 pb-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="relative -mt-12 rounded-full bg-white p-1 sm:-mt-14">
              <Avatar name={v.user.name} photo={p?.photo} size="xl" online={self ? undefined : v.user.online} />
              {self && <PhotoButton />}
            </div>
            <div className="flex flex-wrap gap-2 pt-3">
              {self ? (
                <>
                  <Button onClick={() => setEditing("basics")}>
                    <PencilSquareIcon className="h-4 w-4" /> Edit profile
                  </Button>
                  <Button variant="secondary" onClick={copyLink}>
                    <ShareIcon className="h-4 w-4" /> Share
                  </Button>
                </>
              ) : (
                <ConnectionActions view={v} />
              )}
            </div>
          </div>
          <div className="mt-3">
            <h1 className="text-2xl font-bold text-slate-900">{v.user.name}</h1>
            {p?.headline && <p className="mt-0.5 text-slate-700">{p.headline}</p>}
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              {p?.department_name && <span>{p.department_name}</span>}
              {p?.graduation_year && <span>Class of {p.graduation_year}</span>}
              {place && (
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" /> {place}
                </span>
              )}
              {!self && v.connection.mutual_connections > 0 && (
                <span>
                  {v.connection.mutual_connections} mutual connection{v.connection.mutual_connections === 1 ? "" : "s"}
                </span>
              )}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {v.open_to_opportunities && (
                <Pill tone="green">
                  <CheckCircleIcon className="h-3.5 w-3.5" /> Open to opportunities
                </Pill>
              )}
              {v.mentor && (
                <Pill tone="brand">
                  <LightBulbIcon className="h-3.5 w-3.5" /> Mentor
                </Pill>
              )}
              {!self && v.connection.state === "connected" && <Pill>Connected</Pill>}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="About" action={self && <EditLink onClick={() => setEditing("bio")} />}>
            {p?.bio ? <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{p.bio}</p> : <p className="text-sm text-slate-500">{self ? "Write a few lines about what you do and what you can help with." : `${v.user.first_name} hasn't written a bio yet.`}</p>}
          </Section>

          <Section icon={BriefcaseIcon} title="Experience" action={self && <Link to={PATHS.career} className="text-sm font-semibold text-link hover:underline">Edit</Link>}>
            {v.career.length ? (
              <ol className="space-y-4">
                {v.career.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <span className={cx("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", c.is_current ? "bg-brand-soft text-link" : "bg-slate-100 text-slate-500")}>
                      <BriefcaseIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{c.title}</p>
                      {c.company && <p className="text-sm text-slate-600">{c.company}</p>}
                      <p className="text-xs text-slate-500">{c.duration || [monthYear(c.start_date), c.is_current ? "Present" : monthYear(c.end_date)].filter(Boolean).join(" – ")}</p>
                      {c.description && <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{c.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-500">{self ? "Add your current or last job so classmates and recruiters can find you." : "No positions shared."}</p>
            )}
          </Section>

          <Section icon={AcademicCapIcon} title="Education" action={self && <EditLink onClick={() => setEditing("education")} />}>
            {p ? (
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <AcademicCapIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-slate-900">{p.degree}</p>
                  <p className="text-sm text-slate-600">{[p.department_name, self ? mine.data?.institute?.name : null].filter(Boolean).join(" · ")}</p>
                  {p.graduation_year && <p className="text-xs text-slate-500">Class of {p.graduation_year}</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No education details yet.</p>
            )}
          </Section>
        </div>

        <aside className="space-y-5">
          {self && mine.data && <Completeness data={mine.data} onEdit={(k) => setEditing(k || "basics")} />}

          {!self && v.mentor && (
            <Section icon={LightBulbIcon} title="Mentoring">
              {v.mentor.headline && <p className="text-sm text-slate-700">{v.mentor.headline}</p>}
              {v.mentor.topics.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {v.mentor.topics.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              )}
              <Link to={`${PATHS.mentorship}?mentor=${v.user.id}`} className="mt-3 inline-block text-sm font-semibold text-link hover:underline">
                Ask for mentorship
              </Link>
            </Section>
          )}

          <Section title="Skills" action={self && <EditLink onClick={() => setEditing("skills")} />}>
            {p?.skills?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No skills listed.</p>
            )}
            {p?.languages?.length > 0 && (
              <>
                <h3 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Languages</h3>
                <p className="text-sm text-slate-700">{p.languages.join(" · ")}</p>
              </>
            )}
          </Section>

          <Section title="Contact">
            <ul className="space-y-2 text-sm">
              {v.user.email && (
                <li className="flex items-center gap-2 text-slate-700">
                  <EnvelopeIcon className="h-4 w-4 shrink-0 text-slate-400" />
                  <a href={`mailto:${v.user.email}`} className="truncate hover:underline">
                    {v.user.email}
                  </a>
                </li>
              )}
              {v.user.phone_number && (
                <li className="flex items-center gap-2 text-slate-700">
                  <PhoneIcon className="h-4 w-4 shrink-0 text-slate-400" /> {v.user.phone_number}
                </li>
              )}
              {links.map((l) => (
                <li key={l.key} className="flex items-center gap-2">
                  {l.key === "website" ? <GlobeAltIcon className="h-4 w-4 shrink-0 text-slate-400" /> : <LinkIcon className="h-4 w-4 shrink-0 text-slate-400" />}
                  <a href={p.links[l.key]} target="_blank" rel="noopener noreferrer nofollow" className="truncate text-link hover:underline">
                    {l.key === "website" ? host(p.links[l.key]) : l.label}
                  </a>
                </li>
              ))}
            </ul>
            {!self && v.user.hidden_fields.length > 0 && (
              <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-500">
                <LockClosedIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {v.user.first_name} shares {v.user.hidden_fields.join(" and ")} with connections only.
              </p>
            )}
            {self && (
              <p className="mt-3 text-xs text-slate-500">
                Choose who sees your email, phone and location in{" "}
                <Link to={`${PATHS.settings}?tab=privacy`} className="font-semibold text-link hover:underline">
                  privacy settings
                </Link>
                .
              </p>
            )}
          </Section>

          {v.shared_groups.length > 0 && (
            <Section icon={RectangleGroupIcon} title={self ? "Your groups" : "Groups you share"}>
              <ul className="space-y-1">
                {v.shared_groups.map((g) => (
                  <li key={g.id}>
                    <Link to={groupPath(g.id)} className="text-sm font-medium text-link hover:underline">
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </aside>
      </div>

      {self && mine.data && <ProfileEditor open={!!editing} focus={editing} onClose={() => setEditing(null)} data={mine.data} />}
    </div>
  );
}

function EditLink({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Edit">
      <PencilSquareIcon className="h-4 w-4" />
    </button>
  );
}

export { placeOf };
