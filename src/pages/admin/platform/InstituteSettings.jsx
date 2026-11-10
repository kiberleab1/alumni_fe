/**
 * Per-institute control panel.
 *   super admin       which features the institute may use, storage and
 *                     upload limits, the most its admins may ever do
 *   institute admins  features on/off, security rules, website layout
 *                     (owners always; co-admins with the matching permission)
 */
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ArrowDownIcon, ArrowTopRightOnSquareIcon, ArrowUpIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { saveAdminConfig } from "src/api";
import { Button, Card, Field, PageHeader, Switch, Tabs, apiError, cx, inputClass } from "src/components/ui";
import { useSession } from "../kit";
import { InstituteSelect, useAdminConfig } from "./shared";
import { CAP_GROUPS } from "./Team";

const FEATURE_HINT = {
  groups: "Members join class, department and interest groups with channels.",
  chat: "One-to-one messages between members.",
  files: "Members share files, images and videos inside groups.",
  mentorship: "Members offer and request mentoring.",
  jobs: "Job board, tracking and referrals for members.",
  events: "Event pages and RSVPs in the member app.",
  news: "News feed with reactions and saving.",
  documents: "Members request verification letters and transcripts.",
  career: "Career history on member profiles.",
  podcasts: "Podcasts page on the public website.",
};
const SECTION_LABEL = { hero: "Hero banner", stats: "Live numbers", features: "Why join", events: "Upcoming events", news: "Latest news", jobs: "Open jobs", testimonials: "Alumni voices", join: "Join call-to-action" };
const NAV_LABEL = { about: "About", events: "Events", news: "News", jobs: "Jobs", stories: "Stories", podcasts: "Podcasts", gallery: "Gallery", contact: "Contact" };
const BASE = (d) => ({ features: d.enabled, available: d.available, limits: d.limits, security: d.security, website: d.website, admin_caps: d.admin_caps });
const PARTS = ["features", "available", "limits", "security", "website", "admin_caps"];
const SIGNUP = {
  open: ["Open", "Anyone can join; accounts work right away."],
  approval: ["Approval", "Anyone can sign up; an admin approves each account under Members → Pending."],
  invite: ["Invite only", "Sign-up is closed; admins invite people or import a CSV."],
};

function Toggle({ title, hint, checked, onChange, disabled }) {
  return (
    <div className={cx("flex items-start justify-between gap-4 rounded-xl p-4 ring-1", checked ? "ring-slate-200" : "bg-slate-50 ring-slate-200")}>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} label={title} />
    </div>
  );
}

function ReadOnlyNote({ children }) {
  return (
    <p className="mb-4 flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
      <LockClosedIcon className="h-4 w-4 shrink-0" /> {children}
    </p>
  );
}

export default function InstituteSettingsPage({ record, go }) {
  const { isSuper, instituteId: mine } = useSession();
  const [instituteId, setInstituteId] = useState(record?.id || mine);
  const [tab, setTab] = useState(record?.tab || "features");
  const [domainText, setDomainText] = useState("");
  const { data, isLoading, isError } = useAdminConfig(instituteId);
  const [draft, setDraft] = useState(null);
  useEffect(() => {
    if (data) setDraft(BASE(data));
  }, [data]);
  const client = useQueryClient();
  const dirty = useMemo(() => {
    if (!draft || !data) return [];
    const base = BASE(data);
    return PARTS.filter((k) => JSON.stringify(draft[k]) !== JSON.stringify(base[k]));
  }, [draft, data]);
  // switches are sent one by one so an untouched feature is never re-submitted
  const changed = (k) => {
    if (!["features", "available"].includes(k)) return draft[k];
    const base = BASE(data)[k];
    return Object.fromEntries(Object.entries(draft[k]).filter(([f, v]) => base[f] !== v));
  };
  const save = useMutation(() => saveAdminConfig({ institute_id: instituteId, ...Object.fromEntries(dirty.map((k) => [k, changed(k)])) }), {
    onSuccess: (next) => {
      client.setQueryData(["adminConfig", instituteId || "mine"], next);
      client.invalidateQueries("adminConfig");
      client.invalidateQueries("instituteConfig");
      toast.success("Settings saved");
    },
    onError: (e) => toast.error(apiError(e, "Couldn't save settings")),
  });
  const can = data?.can_edit || {};
  const canWebsite = !!can.website;
  const addDomain = () => {
    const d = domainText.trim().toLowerCase().replace(/^@/, "");
    if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(d)) return toast.error("Enter a domain like kefeta.edu.et");
    if (!draft.security.allowed_domains.includes(d)) set("security", { allowed_domains: [...draft.security.allowed_domains, d] });
    setDomainText("");
  };
  const set = (part, patch) => setDraft((d) => ({ ...d, [part]: { ...d[part], ...patch } }));
  const setWebsite = (patch) => set("website", patch);
  const moveSection = (i, by) =>
    setDraft((d) => {
      const s = [...d.website.sections];
      const j = i + by;
      if (j < 0 || j >= s.length) return d;
      [s[i], s[j]] = [s[j], s[i]];
      return { ...d, website: { ...d.website, sections: s } };
    });

  return (
    <div className="mx-auto max-w-5xl pb-20">
      <PageHeader
        title="Institute settings"
        subtitle={data ? `${data.institute.name} · ${data.institute.sub_url}` : "Features, sign-up, website and admin permissions"}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <InstituteSelect value={instituteId} onChange={(v) => (setInstituteId(v), setDraft(null))} className="w-60" />
          </div>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "features", label: "Features" },
          { value: "access", label: "Security" },
          { value: "website", label: "Website" },
          ...(isSuper ? [{ value: "admins", label: "Platform limits" }] : []),
        ]}
      />
      {isError ? (
        <p className="mt-6 text-sm text-rose-600">Couldn't load this institute's settings.</p>
      ) : isLoading || !draft ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-slate-200" />
      ) : (
        <div className="mt-6">
          {tab === "features" && (
            <>
              {!can.features && <ReadOnlyNote>You don't have permission to switch features. Ask an owner of this institute.</ReadOnlyNote>}
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(data.catalog.features).map(([k, label]) => {
                  const available = draft.available[k];
                  return (
                    <div key={k} className={cx("rounded-xl p-4 ring-1 ring-slate-200", !(available && draft.features[k]) && "bg-slate-50")}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{label}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{available ? FEATURE_HINT[k] : "Not included for this institute by the platform."}</p>
                        </div>
                        <Switch checked={available && draft.features[k]} onChange={(v) => set("features", { [k]: v })} disabled={!can.features || !available} label={label} />
                      </div>
                      {isSuper && (
                        <label className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2.5 text-xs font-medium text-slate-600">
                          <input type="checkbox" checked={available} onChange={(e) => set("available", { [k]: e.target.checked })} /> Available to this institute
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                {isSuper ? "You decide what each institute may use; its admins switch those features on or off. " : "The platform decides which features your institute can use; you choose which are on. "}
                Nothing is deleted when a feature is off.
              </p>
            </>
          )}

          {tab === "access" && (
            <div className="space-y-5">
              {!can.security && <ReadOnlyNote>You don't have permission to change security rules. Ask an owner of this institute.</ReadOnlyNote>}
              <Card className="p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-900">Who can join</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {Object.entries(SIGNUP).map(([k, [title, hint]]) => (
                    <label key={k} className={cx("flex cursor-pointer flex-col rounded-xl p-4 ring-1", draft.security.signup_mode === k ? "bg-brand-soft ring-2 ring-brand" : "ring-slate-200", !can.security && "cursor-default opacity-80")}>
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <input type="radio" name="signup" checked={draft.security.signup_mode === k} disabled={!can.security} onChange={() => set("security", { signup_mode: k })} /> {title}
                      </span>
                      <span className="mt-1 text-xs text-slate-500">{hint}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-700">Only these e-mail domains can sign up</p>
                  <p className="text-xs text-slate-500">Leave empty to allow any address. Sub-domains are included (kefeta.edu.et also allows students.kefeta.edu.et).</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {draft.security.allowed_domains.map((d) => (
                      <span key={d} className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-3 pr-1 text-sm text-slate-700">
                        @{d}
                        {can.security && (
                          <button type="button" onClick={() => set("security", { allowed_domains: draft.security.allowed_domains.filter((x) => x !== d) })} className="rounded-full px-1.5 text-slate-500 hover:bg-slate-200" aria-label={`Remove ${d}`}>
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {can.security && (
                      <form className="flex gap-2" onSubmit={(e) => (e.preventDefault(), addDomain())}>
                        <input className={cx(inputClass, "w-48")} value={domainText} onChange={(e) => setDomainText(e.target.value)} placeholder="kefeta.edu.et" aria-label="Add an e-mail domain" />
                        <Button type="submit" variant="secondary" size="sm">
                          Add
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </Card>
              <Card className="space-y-4 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-900">Access rules</h2>
                <Toggle title="Members must confirm their e-mail before signing in" hint="Admins are never locked out by this." checked={draft.security.require_verified_email} disabled={!can.security} onChange={(v) => set("security", { require_verified_email: v })} />
                <Toggle title="Members can create groups" hint="When off, only admins create groups; members can still join them." checked={draft.security.member_groups} disabled={!can.security} onChange={(v) => set("security", { member_groups: v })} />
                <Field label="Largest file a member can upload (MB)" htmlFor="sec-upload" hint={`Up to ${draft.limits.max_upload_mb} MB, the platform limit for this institute`}>
                  <input id="sec-upload" type="number" min="1" max={draft.limits.max_upload_mb} disabled={!can.security} className={cx(inputClass, "sm:w-40")} value={draft.security.upload_mb} onChange={(e) => set("security", { upload_mb: Math.min(draft.limits.max_upload_mb, Math.max(1, +e.target.value || 1)) })} />
                </Field>
              </Card>
              <Card className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-slate-900">Platform limits</h2>
                  {!isSuper && <span className="text-xs font-medium text-slate-500">Set by the platform</span>}
                </div>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <Field label="Largest upload allowed (MB)" htmlFor="lim-upload" hint="1 to 100 MB">
                    <input id="lim-upload" type="number" min="1" max="100" disabled={!can.limits} className={inputClass} value={draft.limits.max_upload_mb} onChange={(e) => set("limits", { max_upload_mb: Math.min(100, Math.max(1, +e.target.value || 1)) })} />
                  </Field>
                  <Field label="Storage for this institute (MB)" htmlFor="lim-storage" hint="Shared by all groups and messages">
                    <input id="lim-storage" type="number" min="50" step="50" disabled={!can.limits} className={inputClass} value={draft.limits.storage_mb} onChange={(e) => set("limits", { storage_mb: Math.max(50, +e.target.value || 50) })} />
                  </Field>
                </div>
              </Card>
            </div>
          )}

          {tab === "website" && (
            <div className="space-y-5">
              {!canWebsite && <ReadOnlyNote>Your role can't edit the website.</ReadOnlyNote>}
              <Card className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-slate-900">Home page sections</h2>
                  <a href="/landing" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
                    Preview site <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">Show, hide and reorder what visitors see.</p>
                <ol className="mt-4 divide-y divide-slate-100 rounded-xl ring-1 ring-slate-200">
                  {draft.website.sections.map((s, i) => (
                    <li key={s.key} className={cx("flex items-center gap-3 px-4 py-2.5", !s.visible && "bg-slate-50")}>
                      <span className="w-5 text-xs font-semibold text-slate-400">{i + 1}</span>
                      <span className={cx("flex-1 text-sm font-medium", s.visible ? "text-slate-900" : "text-slate-400 line-through")}>{SECTION_LABEL[s.key]}</span>
                      <button type="button" disabled={!canWebsite} onClick={() => setWebsite({ sections: draft.website.sections.map((x) => (x.key === s.key ? { ...x, visible: !x.visible } : x)) })} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40" aria-label={s.visible ? `Hide ${SECTION_LABEL[s.key]}` : `Show ${SECTION_LABEL[s.key]}`}>
                        {s.visible ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                      </button>
                      <button type="button" disabled={!canWebsite || i === 0} onClick={() => moveSection(i, -1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label={`Move ${SECTION_LABEL[s.key]} up`}>
                        <ArrowUpIcon className="h-4 w-4" />
                      </button>
                      <button type="button" disabled={!canWebsite || i === draft.website.sections.length - 1} onClick={() => moveSection(i, 1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label={`Move ${SECTION_LABEL[s.key]} down`}>
                        <ArrowDownIcon className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ol>
              </Card>
              <Card className="p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-900">Menu</h2>
                <p className="mt-0.5 text-sm text-slate-500">Pages listed in the website's top menu and footer.</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.entries(NAV_LABEL).map(([k, label]) => (
                    <label key={k} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm ring-1 ring-slate-200">
                      <input type="checkbox" disabled={!canWebsite} checked={draft.website.nav[k]} onChange={(e) => setWebsite({ nav: { ...draft.website.nav, [k]: e.target.checked } })} /> {label}
                    </label>
                  ))}
                </div>
              </Card>
              <Card className="space-y-5 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-slate-900">Announcement bar</h2>
                <Toggle title="Show a bar at the top of every page" checked={draft.website.banner.enabled} disabled={!canWebsite} onChange={(v) => setWebsite({ banner: { ...draft.website.banner, enabled: v } })} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Text" htmlFor="ban-text" hint={`${draft.website.banner.text.length}/140`}>
                    <input id="ban-text" maxLength={140} disabled={!canWebsite} className={inputClass} value={draft.website.banner.text} onChange={(e) => setWebsite({ banner: { ...draft.website.banner, text: e.target.value } })} placeholder="Homecoming 2027: registration is open" />
                  </Field>
                  <Field label="Link (optional)" htmlFor="ban-link" hint="A full https:// link or a page like /landing/events">
                    <input id="ban-link" disabled={!canWebsite} className={inputClass} value={draft.website.banner.link} onChange={(e) => setWebsite({ banner: { ...draft.website.banner, link: e.target.value } })} />
                  </Field>
                </div>
              </Card>
              <Card className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <h2 className="text-base font-semibold text-slate-900 sm:col-span-2">Search engines and call to action</h2>
                <Field label="Page title" htmlFor="seo-title" hint={`${draft.website.seo_title.length}/70 · shown in search results and browser tabs`}>
                  <input id="seo-title" maxLength={70} disabled={!canWebsite} className={inputClass} value={draft.website.seo_title} onChange={(e) => setWebsite({ seo_title: e.target.value })} placeholder={`${data.institute.name} Alumni`} />
                </Field>
                <Field label="Join button text" htmlFor="hero-cta" hint="On the home page hero">
                  <input id="hero-cta" maxLength={40} disabled={!canWebsite} className={inputClass} value={draft.website.hero_cta} onChange={(e) => setWebsite({ hero_cta: e.target.value })} />
                </Field>
                <Field label="Description" htmlFor="seo-desc" hint={`${draft.website.seo_description.length}/160`} className="sm:col-span-2">
                  <textarea id="seo-desc" rows={2} maxLength={160} disabled={!canWebsite} className={inputClass} value={draft.website.seo_description} onChange={(e) => setWebsite({ seo_description: e.target.value })} />
                </Field>
              </Card>
            </div>
          )}

          {tab === "admins" && isSuper && (
            <div className="space-y-5">
              <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                The most this institute's admins may ever do. Owners get all of it; co-admins get what owners grant, within these.{" "}
                {go && (
                  <button type="button" onClick={() => go("Admins", { institute_id: instituteId })} className="font-semibold text-link hover:underline">
                    Manage this institute's admins
                  </button>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => setDraft((d) => ({ ...d, admin_caps: Object.keys(data.catalog.capabilities) }))}>
                  Allow everything
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setDraft((d) => ({ ...d, admin_caps: Object.keys(data.catalog.capabilities).filter((c) => !["features.manage", "security.manage", "branding.edit"].includes(c)) }))}>
                  Everything but features, security and branding
                </Button>
              </div>
              {CAP_GROUPS.map(([group, caps]) => (
                <Card key={group} className="p-5 sm:p-6">
                  <h2 className="text-base font-semibold text-slate-900">{group}</h2>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {caps.map((c) => (
                      <label key={c} className="flex items-start gap-3 rounded-lg p-2 text-sm hover:bg-slate-50">
                        <input type="checkbox" className="mt-0.5" checked={draft.admin_caps.includes(c)} onChange={(e) => setDraft((d) => ({ ...d, admin_caps: e.target.checked ? [...d.admin_caps, c] : d.admin_caps.filter((x) => x !== c) }))} />
                        <span className="text-slate-700">{data.catalog.capabilities[c]}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      {dirty.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <p className="text-sm text-slate-600">You have unsaved changes</p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setDraft(BASE(data))}>
                Discard
              </Button>
              <Button loading={save.isLoading} onClick={() => save.mutate()}>
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
