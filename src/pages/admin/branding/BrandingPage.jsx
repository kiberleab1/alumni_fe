import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUpTrayIcon, CheckIcon, ExclamationTriangleIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import {
  discardThemeDraft,
  getInstitutes,
  getThemeEditor,
  publishTheme,
  restoreTheme,
  saveThemeDraft,
  setThemeLocks,
  uploadThemeLogo,
} from "src/api";
import { getUserToken } from "src/helpers/globalStorage";
import { ensureFont, themeLogoUrl } from "src/lib/theme";
import { Button, Segmented, Spinner, apiError, cx, timeAgo } from "src/components/ui";

/**
 * Admin › Branding & theme.
 *
 * Edits go to a server-side draft (debounced). The server answers with the
 * derived CSS variables and the WCAG checks, which drive the live preview,
 * so the preview is exactly what members will get. Publishing makes it live.
 */
const PRESETS = [
  { label: "Ocean", brand: "#0369a1", accent: "#b45309", sidebar: "#0f172a" },
  { label: "Forest", brand: "#15803d", accent: "#a16207", sidebar: "#14532d" },
  { label: "Royal", brand: "#6d28d9", accent: "#c2410c", sidebar: "#2e1065" },
  { label: "Crimson", brand: "#be123c", accent: "#a16207", sidebar: "#1f2937" },
  { label: "Light", brand: "#0f172a", accent: "#0369a1", sidebar: "#ffffff" },
];
const SWATCHES = {
  brand: ["#0369a1", "#15803d", "#6d28d9", "#be123c", "#0f766e", "#c2410c"],
  accent: ["#b45309", "#a16207", "#c2410c", "#0369a1", "#be185d", "#0f766e"],
  sidebar: ["#0f172a", "#1e3a8a", "#14532d", "#2e1065", "#1f2937", "#ffffff"],
};
const COLOR_TOKENS = [
  { key: "brand", label: "Brand", hint: "Buttons, links and selected states" },
  { key: "accent", label: "Accent", hint: "Category labels and highlights" },
  { key: "sidebar", label: "Sidebar", hint: "Navigation background" },
];
const FONTS = [
  { value: "inter", label: "Inter", css: "Inter, sans-serif", url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
  { value: "nunito", label: "Nunito Sans", css: "'Nunito Sans', sans-serif", url: "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap" },
  { value: "serif", label: "Source Serif", css: "'Source Serif 4', serif", url: "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" },
];
const RADII = [
  { value: "sharp", label: "Sharp" },
  { value: "soft", label: "Soft" },
  { value: "round", label: "Round" },
];
const LOCK_LABELS = { brand: "Brand", accent: "Accent", sidebar: "Sidebar", font: "Font", radius: "Corners", logo: "Logo" };

/* contrast maths only for the accent "auto-fix" button; the server re-checks */
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrastWithWhite = (hex) => 1.05 / (lum(hex) + 0.05);
function darkenUntilReadable(hex) {
  let c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  let h = hex;
  for (let i = 0; i < 40 && contrastWithWhite(h) < 4.5; i++) {
    c = c.map((v) => Math.round(v * 0.92));
    h = "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  return h;
}

// the server trims names and stores "" logos as null, so compare normalised values
const norm = (k, v) => (k === "name" ? (v || "").trim() : v || null);
const sameTokens = (a = {}, b = {}) => ["brand", "accent", "sidebar", "font", "radius", "logo", "name"].every((k) => norm(k, a[k]) === norm(k, b[k]));

export default function BrandingPage() {
  const isSuper = getUserToken()?.user?.role_name === "super_admin";
  const [scope, setScope] = useState({ scope: "institute" });
  const qc = useQueryClient();
  const key = ["themeEditor", scope.scope, scope.institute_id || "mine"];

  const { data: E, isLoading, isError, error } = useQuery(key, () => getThemeEditor(scope), { keepPreviousData: true, refetchOnWindowFocus: false });
  const { data: institutes } = useQuery("brandingInstitutes", () => getInstitutes({ pageNumber: 1, pageSize: 100 }), {
    enabled: isSuper,
    select: (r) => r?.data?.institute || [],
  });

  // local draft: what the controls show. Synced from the server when the scope
  // changes or after restore/discard; otherwise the server catches up via the
  // debounced save below.
  const [draft, setDraft] = useState(null);
  const syncedFor = useRef(null);
  useEffect(() => {
    if (!E) return;
    const id = `${E.scope}:${E.institute_id || ""}`;
    if (syncedFor.current !== id) {
      syncedFor.current = id;
      setDraft(E.draft);
    }
  }, [E]);

  const setEditor = (data) => qc.setQueryData(key, data);
  const save = useMutation((d) => saveThemeDraft(scope, d), {
    onSuccess: setEditor,
    onError: (err) => toast.error(apiError(err, "Couldn't save the draft")),
  });

  // debounce saves while the admin is clicking through colours
  const timer = useRef(null);
  const update = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save.mutate(next), 400);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const replaceDraftFrom = (data) => {
    setEditor(data);
    setDraft(data.draft);
  };
  const publish = useMutation(() => publishTheme(scope), {
    onSuccess: (data) => {
      replaceDraftFrom(data);
      qc.invalidateQueries("theme");
      toast.success(scope.scope === "platform" ? "Platform defaults published" : "Theme published. Members see it now.");
    },
    onError: (err) => toast.error(apiError(err)),
  });
  const discard = useMutation(() => discardThemeDraft(scope), { onSuccess: replaceDraftFrom, onError: (err) => toast.error(apiError(err)) });
  const restore = useMutation((index) => restoreTheme(scope, index), {
    onSuccess: (data) => {
      replaceDraftFrom(data);
      toast.info("Restored into the draft. Publish to make it live.");
    },
    onError: (err) => toast.error(apiError(err)),
  });
  const locks = useMutation((list) => setThemeLocks(list), {
    onSuccess: (data) => {
      setEditor(data);
      toast.success("Locks updated");
    },
    onError: (err) => toast.error(apiError(err)),
  });
  const [uploading, setUploading] = useState(false);
  const onLogo = async (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Logo must be under 2 MB");
    setUploading(true);
    try {
      const { logo } = await uploadThemeLogo(file);
      update({ logo });
    } catch (err) {
      toast.error(apiError(err, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const font = FONTS.find((f) => f.value === draft?.font) || FONTS[0];
  useEffect(() => {
    FONTS.forEach((f) => ensureFont(f.url)); // font buttons preview themselves
  }, []);

  const lockedHere = (k) => E?.scope === "institute" && E.locks.includes(k);
  const failing = (E?.checks || []).filter((c) => !c.pass);
  const pending = save.isLoading || !!(draft && E && !sameTokens(draft, E.draft));
  const dirty = !!E?.has_unpublished_changes || pending;
  const previewStyle = useMemo(() => ({ ...(E?.vars || {}), fontFamily: font.css }), [E?.vars, font.css]);

  if (isLoading || !draft) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        {isError ? <p className="text-sm text-rose-600">{apiError(error, "Couldn't load the theme editor")}</p> : <Spinner className="h-6 w-6" />}
      </div>
    );
  }

  const target = E.scope === "platform" ? "every institute that hasn't set its own theme" : "members of this institute";
  return (
    <div className="ui-scope min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* the admin shell has no global toast container */}
      <ToastContainer position="bottom-right" newestOnTop limit={3} />
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
        <div className="min-w-[14rem] flex-1">
          <h1 className="text-xl font-bold">Branding &amp; theme</h1>
          <p className={cx("text-sm", failing.length ? "text-rose-600" : dirty ? "text-amber-700" : "text-emerald-700")} aria-live="polite">
            {failing.length
              ? "Fix the readability checks before publishing"
              : pending
              ? "Saving draft…"
              : dirty
              ? `Draft · not live yet. Publishing applies it to ${target}.`
              : `Live for ${target}${E.published_at ? ` · published ${timeAgo(E.published_at)}` : ""}`}
          </p>
        </div>
        {isSuper && (
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              label="What to edit"
              value={scope.scope}
              onChange={(v) => setScope(v === "platform" ? { scope: "platform" } : { scope: "institute", institute_id: institutes?.[0]?.id })}
              options={[
                { value: "platform", label: "Platform defaults" },
                { value: "institute", label: "An institute" },
              ]}
            />
            {scope.scope === "institute" && (
              <select
                aria-label="Institute"
                value={scope.institute_id || ""}
                onChange={(e) => setScope({ scope: "institute", institute_id: e.target.value })}
                className="rounded-lg border-0 py-1.5 pl-3 pr-8 text-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-brand"
              >
                {(institutes || []).map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        <Button variant="secondary" disabled={!dirty || discard.isLoading} onClick={() => discard.mutate()}>
          Discard
        </Button>
        <Button
          className="!bg-slate-900 !text-white hover:!bg-slate-700"
          disabled={!!failing.length || !dirty || pending}
          loading={publish.isLoading}
          onClick={() => publish.mutate()}
        >
          {E.scope === "platform" ? "Publish defaults" : "Publish theme"}
        </Button>
      </header>

      <div className="flex flex-col gap-6 p-5 sm:p-7 xl:flex-row xl:items-start">
        {/* ------------------------------------------------ controls */}
        <div className="flex w-full flex-col gap-4 xl:w-[32rem] xl:shrink-0">
          <Panel title="Identity">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-slate-900 p-2">
                {draft.logo ? <img src={themeLogoUrl(draft.logo)} alt="Current logo" className="max-h-full max-w-full object-contain" /> : <span className="text-[11px] text-slate-400">Default logo</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className={cx("inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50", (uploading || lockedHere("logo")) && "pointer-events-none opacity-50")}>
                  {uploading ? <Spinner className="h-4 w-4" /> : <ArrowUpTrayIcon className="h-4 w-4" />}
                  Upload logo
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" onChange={(e) => onLogo(e.target.files?.[0])} disabled={lockedHere("logo")} />
                </label>
                {draft.logo && !lockedHere("logo") && (
                  <Button variant="ghost" onClick={() => update({ logo: null })}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <label className="mt-4 grid gap-1 text-sm font-medium text-slate-700">
              Display name
              <input
                value={draft.name || ""}
                maxLength={60}
                placeholder="Defaults to the institute's name"
                onChange={(e) => update({ name: e.target.value })}
                className="rounded-lg border-0 px-3 py-2 text-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-brand"
              />
            </label>
            <p className="mt-2 text-xs text-slate-500">Shown in the browser tab and as the logo's alt text. PNG, JPG, SVG or WebP up to 2 MB; check it reads on the sidebar colour.</p>
          </Panel>

          <Panel title="Start from a preset">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {PRESETS.map((p) => {
                const on = p.brand === draft.brand && p.accent === draft.accent && p.sidebar === draft.sidebar;
                return (
                  <button
                    key={p.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => update(Object.fromEntries(["brand", "accent", "sidebar"].filter((k) => !lockedHere(k)).map((k) => [k, p[k]])))}
                    className={cx("flex flex-col gap-1.5 rounded-xl bg-white p-2 text-left ring-inset", on ? "ring-2 ring-slate-900" : "ring-1 ring-slate-200 hover:ring-slate-300")}
                  >
                    <span className="flex h-7 overflow-hidden rounded-md">
                      <span className="flex-1" style={{ background: p.sidebar }} />
                      <span className="flex-[2]" style={{ background: p.brand }} />
                      <span className="flex-1" style={{ background: p.accent }} />
                    </span>
                    <span className="text-xs font-semibold">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="Colours">
            <ul className="divide-y divide-slate-100">
              {COLOR_TOKENS.map((t) => {
                const locked = lockedHere(t.key);
                return (
                  <li key={t.key} className={cx("py-3 first:pt-0 last:pb-0", locked && "opacity-60")}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex-1">
                        <span className="block text-sm font-semibold">{t.label}</span>
                        <span className="block text-xs text-slate-500">{t.hint}</span>
                      </span>
                      {locked && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                          <LockClosedIcon className="h-3.5 w-3.5" /> Set by platform
                        </span>
                      )}
                    </div>
                    <div role="radiogroup" aria-label={t.label} className="flex flex-wrap items-center gap-2">
                      {SWATCHES[t.key].map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          role="radio"
                          aria-checked={draft[t.key] === hex}
                          aria-label={hex}
                          disabled={locked}
                          onClick={() => update({ [t.key]: hex })}
                          className={cx("h-8 w-8 rounded-full border border-slate-300 disabled:cursor-not-allowed", draft[t.key] === hex && "ring-2 ring-slate-900 ring-offset-2")}
                          style={{ background: hex }}
                        />
                      ))}
                      <label className={cx("relative h-8 w-8 overflow-hidden rounded-full border border-dashed border-slate-400", locked ? "cursor-not-allowed" : "cursor-pointer")} title="Custom colour">
                        <span className="sr-only">Custom {t.label.toLowerCase()} colour</span>
                        <input type="color" value={draft[t.key]} disabled={locked} onChange={(e) => update({ [t.key]: e.target.value })} className="absolute -inset-2 h-12 w-12 cursor-pointer opacity-0" />
                        <span className="pointer-events-none flex h-full w-full items-center justify-center text-slate-500">+</span>
                      </label>
                      <code className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-xs">{draft[t.key]}</code>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Type & shape">
            <p className="mb-2 text-sm font-medium text-slate-700">Font {lockedHere("font") && <span className="text-xs font-semibold text-amber-800">· set by platform</span>}</p>
            <div className="grid grid-cols-3 gap-2">
              {FONTS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={draft.font === f.value}
                  disabled={lockedHere("font")}
                  onClick={() => update({ font: f.value })}
                  style={{ fontFamily: f.css }}
                  className={cx("rounded-lg bg-white px-2 py-2.5 text-sm font-semibold ring-inset disabled:cursor-not-allowed disabled:opacity-50", draft.font === f.value ? "ring-2 ring-slate-900" : "ring-1 ring-slate-200")}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="mb-2 mt-4 text-sm font-medium text-slate-700">Corners {lockedHere("radius") && <span className="text-xs font-semibold text-amber-800">· set by platform</span>}</p>
            {lockedHere("radius") ? (
              <p className="text-sm text-slate-500">{RADII.find((r) => r.value === draft.radius)?.label}</p>
            ) : (
              <Segmented label="Corner style" value={draft.radius} onChange={(v) => update({ radius: v })} options={RADII} />
            )}
          </Panel>

          {E.can_lock && E.scope === "platform" && (
            <Panel title="Locks for institute admins" description="Locked settings always use these platform values; institute admins can't change them.">
              <div className="flex flex-wrap gap-2">
                {E.lockable.map((k) => {
                  const on = E.locks.includes(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={on}
                      disabled={locks.isLoading}
                      onClick={() => locks.mutate(on ? E.locks.filter((x) => x !== k) : [...E.locks, k])}
                      className={cx(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 ring-inset",
                        on ? "bg-amber-50 text-amber-800 ring-amber-300" : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {on ? <LockClosedIcon className="h-4 w-4" /> : <LockOpenIcon className="h-4 w-4" />}
                      {LOCK_LABELS[k] || k}
                    </button>
                  );
                })}
              </div>
            </Panel>
          )}
        </div>

        {/* ------------------------------------------------ preview + checks */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Panel title="Live preview" description="What members will see. Updates as you edit.">
            <div style={previewStyle} className="flex h-[26rem] overflow-hidden rounded-xl border border-slate-200 bg-slate-50" aria-label="Theme preview">
              <div className="hidden w-44 shrink-0 flex-col gap-1 bg-side p-3 sm:flex">
                <div className="mb-3 flex h-10 items-center px-1">
                  {draft.logo ? (
                    <img src={themeLogoUrl(draft.logo)} alt="" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-sm font-bold text-side-active-fg">{draft.name || "Alumni"}</span>
                  )}
                </div>
                {["Profile", "Alumni", "My Network", "Messages", "Events", "News"].map((n) => (
                  <span key={n} className={cx("rounded-lg px-2.5 py-1.5 text-xs font-medium", n === "Events" ? "bg-side-active text-side-active-fg" : "text-side-fg")}>
                    {n}
                  </span>
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wide text-accent">Reunion · Nov 22</span>
                <span className="text-lg font-bold">Class of 2019 reunion dinner</span>
                <div className="flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white p-3.5">
                  <span className="text-sm font-semibold">Are you going?</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <span className="rounded-xl bg-brand py-2 text-center text-xs font-semibold text-brand-ink">Going</span>
                    <span className="rounded-xl py-2 text-center text-xs font-semibold ring-1 ring-inset ring-slate-300">Maybe</span>
                    <span className="rounded-xl py-2 text-center text-xs font-semibold ring-1 ring-inset ring-slate-300">Can’t go</span>
                  </div>
                  <span className="rounded-xl bg-brand-soft px-3 py-2 text-xs">
                    You’re on the list. <span className="font-semibold text-link">Add to calendar</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-3">
                    <span className="text-[11px] font-bold uppercase text-accent">Careers</span>
                    <span className="text-xs font-semibold">12 alumni companies hiring</span>
                    <span className="text-xs font-semibold text-link">Read story</span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-3">
                    <span className="text-xs font-semibold">Dawit Alemu</span>
                    <span className="text-[11px] text-slate-500">Senior Engineer</span>
                    <span className="self-start rounded-lg bg-brand px-2.5 py-1 text-[11px] font-semibold text-brand-ink">Connect</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Readability checks (WCAG AA, 4.5:1)">
            <ul className="space-y-2">
              {E.checks.map((c) => (
                <li key={c.id} className="flex items-center gap-3 text-sm">
                  <span className={cx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white", c.pass ? "bg-emerald-600" : "bg-rose-600")} aria-hidden="true">
                    {c.pass ? <CheckIcon className="h-4 w-4" /> : <ExclamationTriangleIcon className="h-4 w-4" />}
                  </span>
                  <span className="flex-1">
                    {c.label}
                    <span className="sr-only">{c.pass ? " passes" : " fails"}</span>
                  </span>
                  <code className={cx("text-xs font-semibold", c.pass ? "text-emerald-700" : "text-rose-700")}>{c.ratio.toFixed(1)}:1</code>
                  {!c.pass && c.id === "accent_on_white" && !lockedHere("accent") && (
                    <Button size="sm" variant="danger" onClick={() => update({ accent: darkenUntilReadable(draft.accent) })}>
                      Auto-fix
                    </Button>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">Button text and link colours are picked automatically so they stay readable on any brand colour.</p>
          </Panel>

          <Panel title="History">
            {!E.history.length ? (
              <p className="text-sm text-slate-500">Earlier versions appear here after you publish.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {E.history.map((h) => (
                  <li key={h.index} className="flex items-center gap-3 py-2 text-sm">
                    <span className="flex h-4 w-12 overflow-hidden rounded" aria-hidden="true">
                      <span className="flex-1" style={{ background: h.theme.sidebar || E.defaults.sidebar }} />
                      <span className="flex-[2]" style={{ background: h.theme.brand || E.defaults.brand }} />
                    </span>
                    <span className="flex-1 text-slate-600">Published {h.at ? timeAgo(h.at) : ""}</span>
                    <Button size="sm" variant="ghost" loading={restore.isLoading && restore.variables === h.index} onClick={() => restore.mutate(h.index)}>
                      Restore
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}
