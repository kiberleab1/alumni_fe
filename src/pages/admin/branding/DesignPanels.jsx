/**
 * Per-surface design controls and previews for Admin › Branding.
 * Each institute designs its public website, member app and admin console
 * separately; values are clamped again on the server.
 */
import { useState } from "react";
import { toast } from "react-toastify";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpTrayIcon, EyeIcon, EyeSlashIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { uploadThemeLogo } from "src/api";
import { themeLogoUrl } from "src/lib/theme";
import { Button, Segmented, Spinner, Switch, apiError, cx } from "src/components/ui";

const MENU_LABEL = { home: "Home", people: "People", messages: "Messages", jobs: "Jobs", events: "Events", news: "News", groups: "Groups", mentorship: "Mentorship", documents: "Documents" };
const SOCIAL_LABEL = { facebook: "Facebook", linkedin: "LinkedIn", x: "X", instagram: "Instagram", youtube: "YouTube", telegram: "Telegram", tiktok: "TikTok" };
const BG_SWATCHES = ["#ffffff", "#f8fafc", "#f1f5f9", "#fffbeb", "#f0f9ff", "#f0fdf4"];
const SIDE_SWATCHES = ["#0f172a", "#1e3a8a", "#14532d", "#2e1065", "#7f1d1d", "#ffffff"];
const opts = (pairs) => pairs.map(([value, label]) => ({ value, label }));

export function Panel({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Row({ label, hint, children }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, max, placeholder, label }) {
  return (
    <input
      aria-label={label}
      value={value || ""}
      maxLength={max}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border-0 px-3 py-2 text-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-brand"
    />
  );
}

/** Swatches plus a custom picker; `none` adds a "same as brand" choice. */
function ColorChoice({ value, onChange, swatches, none, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-2">
      {none && (
        <button type="button" role="radio" aria-checked={!value} onClick={() => onChange(null)} className={cx("h-8 rounded-full px-3 text-xs font-semibold ring-1 ring-inset ring-slate-300", !value && "ring-2 ring-slate-900")}>
          {none}
        </button>
      )}
      {swatches.map((hex) => (
        <button key={hex} type="button" role="radio" aria-checked={value === hex} aria-label={hex} onClick={() => onChange(hex)} className={cx("h-8 w-8 rounded-full border border-slate-300", value === hex && "ring-2 ring-slate-900 ring-offset-2")} style={{ background: hex }} />
      ))}
      <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-dashed border-slate-400" title="Custom colour">
        <span className="sr-only">Custom {label}</span>
        <input type="color" value={value || "#ffffff"} onChange={(e) => onChange(e.target.value)} className="absolute -inset-2 h-12 w-12 cursor-pointer opacity-0" />
        <span className="pointer-events-none flex h-full w-full items-center justify-center text-slate-500">+</span>
      </label>
      {value && <code className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-xs">{value}</code>}
    </div>
  );
}

/* ------------------------------------------------------------- website */

export function WebsiteControls({ d, set, onOpenSettings }) {
  const [uploading, setUploading] = useState(false);
  const onImage = async (file) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) return toast.error("Image must be under 4 MB");
    setUploading(true);
    try {
      const { logo } = await uploadThemeLogo(file);
      set({ hero_image: logo });
    } catch (e) {
      toast.error(apiError(e, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };
  const links = d.links || [];
  const setLink = (i, patch) => set({ links: links.map((l, k) => (k === i ? { ...l, ...patch } : l)) });
  return (
    <>
      <Panel title="Menu bar">
        <div className="divide-y divide-slate-100">
          <Row label="Style">
            <Segmented size="sm" label="Header style" value={d.header_style} onChange={(v) => set({ header_style: v })} options={opts([["light", "Light"], ["brand", "Brand"], ["dark", "Dark"], ["transparent", "Transparent"]])} />
          </Row>
          <Row label="Layout">
            <Segmented size="sm" label="Header layout" value={d.header_layout} onChange={(v) => set({ header_layout: v })} options={opts([["left", "Logo left"], ["center", "Centered"]])} />
          </Row>
          <Row label="Menu links">
            <Segmented size="sm" label="Menu link style" value={d.nav_style} onChange={(v) => set({ nav_style: v })} options={opts([["text", "Text"], ["underline", "Underline"], ["pill", "Pill"]])} />
          </Row>
          <Row label="Stays on screen while scrolling">
            <Switch checked={d.sticky !== false} onChange={(v) => set({ sticky: v })} label="Sticky menu bar" />
          </Row>
          <Row label="App button text" hint="Shown to signed-in visitors">
            <TextInput label="App button text" value={d.cta_label} max={30} onChange={(v) => set({ cta_label: v })} />
          </Row>
          <Row label="Extra links" hint="Up to 4, e.g. Donate or the main university site">
            <div className="space-y-2">
              {links.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-32 shrink-0">
                    <TextInput label={`Link ${i + 1} label`} value={l.label} max={24} placeholder="Label" onChange={(v) => setLink(i, { label: v })} />
                  </div>
                  <TextInput label={`Link ${i + 1} address`} value={l.url} max={300} placeholder="https://…" onChange={(v) => setLink(i, { url: v })} />
                  <button type="button" onClick={() => set({ links: links.filter((_, k) => k !== i) })} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label={`Remove link ${i + 1}`}>
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {links.length < 4 && (
                <Button size="sm" variant="secondary" onClick={() => set({ links: [...links, { label: "", url: "" }] })}>
                  <PlusIcon className="h-4 w-4" /> Add link
                </Button>
              )}
              <p className="text-xs text-slate-500">Links need a label and an address starting with https:// or /. Incomplete ones aren't saved.</p>
            </div>
          </Row>
          {onOpenSettings && (
            <p className="pt-3 text-xs text-slate-500">
              Which pages appear in the menu, and the home page sections, are under{" "}
              <button type="button" onClick={onOpenSettings} className="font-semibold text-link hover:underline">
                Institute settings → Website
              </button>
              .
            </p>
          )}
        </div>
      </Panel>
      <Panel title="Home page hero">
        <div className="divide-y divide-slate-100">
          <Row label="Layout">
            <Segmented size="sm" label="Hero layout" value={d.hero_layout} onChange={(v) => set({ hero_layout: v })} options={opts([["split", "Split"], ["centered", "Centered"], ["image", "Full photo"]])} />
          </Row>
          <Row label="Headline" hint="Leave empty to use the website content">
            <TextInput label="Headline" value={d.hero_title} max={90} onChange={(v) => set({ hero_title: v })} />
          </Row>
          <Row label="Intro">
            <textarea aria-label="Intro" rows={2} maxLength={240} value={d.hero_subtitle || ""} onChange={(e) => set({ hero_subtitle: e.target.value })} className="w-full rounded-lg border-0 px-3 py-2 text-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-brand" />
          </Row>
          <Row label="Photo">
            <div className="flex flex-wrap items-center gap-3">
              {d.hero_image && <img src={themeLogoUrl(d.hero_image)} alt="" className="h-14 w-24 rounded-lg object-cover" />}
              <label className={cx("inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50", uploading && "pointer-events-none opacity-50")}>
                {uploading ? <Spinner className="h-4 w-4" /> : <ArrowUpTrayIcon className="h-4 w-4" />} Upload photo
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => onImage(e.target.files?.[0])} />
              </label>
              {d.hero_image && (
                <Button size="sm" variant="ghost" onClick={() => set({ hero_image: null })}>
                  Remove
                </Button>
              )}
            </div>
          </Row>
        </div>
      </Panel>
      <Panel title="Footer">
        <div className="divide-y divide-slate-100">
          <Row label="Style">
            <Segmented size="sm" label="Footer style" value={d.footer_style} onChange={(v) => set({ footer_style: v })} options={opts([["dark", "Dark"], ["light", "Light"], ["brand", "Brand"]])} />
          </Row>
          <Row label="Tagline">
            <TextInput label="Footer tagline" value={d.footer_tagline} max={160} placeholder="Built for alumni, by alumni." onChange={(v) => set({ footer_tagline: v })} />
          </Row>
          <Row label="Social links" hint="Full addresses, e.g. https://facebook.com/youralumni">
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.keys(SOCIAL_LABEL).map((k) => (
                <TextInput key={k} label={SOCIAL_LABEL[k]} placeholder={SOCIAL_LABEL[k]} value={d.socials?.[k]} max={300} onChange={(v) => set({ socials: { ...d.socials, [k]: v } })} />
              ))}
            </div>
          </Row>
        </div>
      </Panel>
      <Panel title="Page">
        <div className="divide-y divide-slate-100">
          <Row label="Buttons">
            <Segmented size="sm" label="Button shape" value={d.buttons} onChange={(v) => set({ buttons: v })} options={opts([["square", "Square"], ["rounded", "Rounded"], ["pill", "Pill"]])} />
          </Row>
          <Row label="Content width">
            <Segmented size="sm" label="Content width" value={d.width} onChange={(v) => set({ width: v })} options={opts([["standard", "Standard"], ["wide", "Wide"]])} />
          </Row>
          <Row label="Background">
            <ColorChoice label="website background" value={d.background} swatches={BG_SWATCHES} onChange={(v) => set({ background: v || "#ffffff" })} />
          </Row>
        </div>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------ member app */

export function MemberControls({ d, set }) {
  const menu = d.menu || [];
  const move = (i, by) => {
    const next = [...menu];
    const j = i + by;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ menu: next });
  };
  const tabs = d.mobile_tabs || [];
  const toggleTab = (k) => set({ mobile_tabs: tabs.includes(k) ? tabs.filter((x) => x !== k) : [...tabs, k].slice(0, 4) });
  return (
    <>
      <Panel title="Layout">
        <div className="divide-y divide-slate-100">
          <Row label="Navigation" hint="Top bar puts the menu across the top on computers">
            <Segmented size="sm" label="Navigation layout" value={d.layout} onChange={(v) => set({ layout: v })} options={opts([["sidebar", "Sidebar"], ["topbar", "Top bar"]])} />
          </Row>
          <Row label="Menu colour">
            <ColorChoice label="member menu colour" value={d.sidebar} none="Brand sidebar" swatches={SIDE_SWATCHES} onChange={(v) => set({ sidebar: v })} />
          </Row>
          <Row label="Header">
            <Segmented size="sm" label="Header style" value={d.header_style} onChange={(v) => set({ header_style: v })} options={opts([["light", "Light"], ["brand", "Brand"]])} />
          </Row>
          <Row label="Selected menu item">
            <Segmented size="sm" label="Menu item style" value={d.nav_style} onChange={(v) => set({ nav_style: v })} options={opts([["filled", "Filled"], ["accent-bar", "Accent bar"], ["minimal", "Minimal"]])} />
          </Row>
          <Row label="Spacing">
            <Segmented size="sm" label="Spacing" value={d.density} onChange={(v) => set({ density: v })} options={opts([["comfortable", "Comfortable"], ["compact", "Compact"]])} />
          </Row>
          <Row label="Buttons">
            <Segmented size="sm" label="Button shape" value={d.buttons} onChange={(v) => set({ buttons: v })} options={opts([["square", "Square"], ["rounded", "Rounded"], ["pill", "Pill"]])} />
          </Row>
          <Row label="Background">
            <ColorChoice label="member app background" value={d.background} swatches={BG_SWATCHES} onChange={(v) => set({ background: v || "#f8fafc" })} />
          </Row>
        </div>
      </Panel>
      <Panel title="Menu" description="Order, rename or hide items. Features switched off under Institute settings stay hidden.">
        <ol className="divide-y divide-slate-100 rounded-xl ring-1 ring-slate-200">
          {menu.map((m, i) => (
            <li key={m.key} className={cx("flex items-center gap-2 px-3 py-2", !m.visible && "bg-slate-50")}>
              <div className="min-w-0 flex-1">
                <TextInput label={`Name for ${MENU_LABEL[m.key]}`} value={m.label} max={24} placeholder={MENU_LABEL[m.key]} onChange={(v) => set({ menu: menu.map((x) => (x.key === m.key ? { ...x, label: v } : x)) })} />
              </div>
              <button type="button" disabled={m.key === "home"} onClick={() => set({ menu: menu.map((x) => (x.key === m.key ? { ...x, visible: !x.visible } : x)) })} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label={m.visible ? `Hide ${MENU_LABEL[m.key]}` : `Show ${MENU_LABEL[m.key]}`}>
                {m.visible ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </button>
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label={`Move ${MENU_LABEL[m.key]} up`}>
                <ArrowUpIcon className="h-4 w-4" />
              </button>
              <button type="button" disabled={i === menu.length - 1} onClick={() => move(i, 1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label={`Move ${MENU_LABEL[m.key]} down`}>
                <ArrowDownIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ol>
      </Panel>
      <Panel title="Phone tabs" description={`Pick up to 4 for the bottom bar on phones (${tabs.length}/4). "More" is always last.`}>
        <div className="flex flex-wrap gap-2">
          {menu.map((m) => (
            <label key={m.key} className={cx("flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ring-1 ring-inset", tabs.includes(m.key) ? "bg-brand-soft ring-brand" : "ring-slate-300", !tabs.includes(m.key) && tabs.length >= 4 && "opacity-50")}>
              <input type="checkbox" checked={tabs.includes(m.key)} disabled={!tabs.includes(m.key) && tabs.length >= 4} onChange={() => toggleTab(m.key)} /> {m.label || MENU_LABEL[m.key]}
            </label>
          ))}
        </div>
      </Panel>
      <Panel title="Welcome message" description="Shown at the top of the member home page.">
        <TextInput label="Welcome message" value={d.welcome} max={160} placeholder="Welcome home, Kefeta alumni!" onChange={(v) => set({ welcome: v })} />
      </Panel>
    </>
  );
}

/* --------------------------------------------------------- admin console */

export function AdminControls({ d, set }) {
  return (
    <Panel title="Admin console">
      <div className="divide-y divide-slate-100">
        <Row label="Console name" hint="Under the logo in the sidebar">
          <TextInput label="Console name" value={d.console_name} max={30} onChange={(v) => set({ console_name: v })} />
        </Row>
        <Row label="Sidebar colour">
          <ColorChoice label="admin sidebar colour" value={d.sidebar} none="Brand sidebar" swatches={SIDE_SWATCHES} onChange={(v) => set({ sidebar: v })} />
        </Row>
        <Row label="Header">
          <Segmented size="sm" label="Header style" value={d.header_style} onChange={(v) => set({ header_style: v })} options={opts([["light", "Light"], ["brand", "Brand"]])} />
        </Row>
        <Row label="Selected menu item">
          <Segmented size="sm" label="Menu item style" value={d.nav_style} onChange={(v) => set({ nav_style: v })} options={opts([["filled", "Filled"], ["accent-bar", "Accent bar"], ["minimal", "Minimal"]])} />
        </Row>
        <Row label="Spacing">
          <Segmented size="sm" label="Spacing" value={d.density} onChange={(v) => set({ density: v })} options={opts([["comfortable", "Comfortable"], ["compact", "Compact"]])} />
        </Row>
        <Row label="Background">
          <ColorChoice label="admin background" value={d.background} swatches={BG_SWATCHES} onChange={(v) => set({ background: v || "#f8fafc" })} />
        </Row>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------- previews */

const Logo = ({ draft, className }) =>
  draft.logo ? <img src={themeLogoUrl(draft.logo)} alt="" className={cx("max-h-7 max-w-[5rem] object-contain", className)} /> : <span className={cx("text-xs font-bold", className)}>{draft.name || "Alumni"}</span>;

const pubNav = (style, active) =>
  ({
    text: active ? "font-semibold bg-black/[0.06]" : "opacity-75",
    underline: active ? "font-semibold underline decoration-2 underline-offset-4" : "opacity-75",
    pill: active ? "rounded-full bg-brand text-brand-ink" : "opacity-75",
  })[style] || "";

export function WebsitePreview({ draft, style }) {
  const d = draft.design.public;
  const header = d.header_style === "transparent" ? "bg-transparent text-white absolute inset-x-0 top-0" : "bg-pubhead text-pubhead-fg border-b border-pubhead-border";
  const hero = (
    <div className={cx("relative bg-slate-900 px-5 text-white", d.header_style === "transparent" ? "pb-8 pt-16" : "py-8", d.hero_layout === "centered" && "text-center")}>
      {d.hero_image && <img src={themeLogoUrl(d.hero_image)} alt="" className={cx("absolute inset-0 h-full w-full object-cover", d.hero_layout === "image" ? "opacity-70" : "opacity-30")} />}
      {d.hero_layout !== "image" && <div className="absolute inset-0 bg-gradient-to-br from-brand/90 to-slate-950/80" />}
      <div className={cx("relative flex gap-4", d.hero_layout === "split" ? "items-center" : "flex-col")}>
        <div className={cx("min-w-0 flex-1", d.hero_layout === "centered" && "mx-auto max-w-xs")}>
          <p className="text-base font-bold leading-tight">{d.hero_title || "Stay connected with the people who shaped you."}</p>
          <p className="mt-1.5 line-clamp-2 text-[11px] opacity-80">{d.hero_subtitle || "Find classmates, discover jobs and keep up with events."}</p>
          <span className="mt-3 inline-block rounded-btn bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-900">Join the network</span>
        </div>
        {d.hero_layout === "split" && <div className="hidden h-20 w-32 shrink-0 rounded-xl bg-white/10 ring-1 ring-white/20 sm:block" />}
      </div>
    </div>
  );
  return (
    <div style={style} className="overflow-hidden rounded-xl border border-slate-200 bg-page font-theme" aria-label="Website preview">
      <div className="relative">
        <div className={cx("z-10 flex items-center gap-3 px-4 py-2.5", header, d.header_layout === "center" && "flex-col gap-1.5")}>
          <Logo draft={draft} />
          <div className={cx("flex flex-1 flex-wrap items-center gap-1 text-[11px]", d.header_layout === "center" && "justify-center")}>
            {["Home", "About", "Events", "News", ...(d.links || []).filter((l) => l.label).map((l) => l.label)].map((n, i) => (
              <span key={n + i} className={cx("px-2 py-1", pubNav(d.nav_style, i === 0), d.nav_style !== "pill" && "rounded-md")}>
                {n}
              </span>
            ))}
          </div>
          {d.header_layout !== "center" && <span className="rounded-btn bg-brand px-2.5 py-1 text-[11px] font-semibold text-brand-ink">Join</span>}
        </div>
        {hero}
      </div>
      <div className="grid grid-cols-3 gap-2 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-2">
            <div className="h-8 rounded bg-slate-100" />
            <div className="mt-1.5 h-2 w-3/4 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between bg-pubfoot px-4 py-3 text-[11px] text-pubfoot-muted">
        <span className="font-semibold text-pubfoot-fg">{draft.name || "Alumni"}</span>
        <span className="truncate pl-3">{d.footer_tagline || "Built for alumni, by alumni."}</span>
      </div>
    </div>
  );
}

const sideItem = (style, active, compact) =>
  cx(
    "relative block rounded-md px-2 text-[11px] font-medium",
    compact ? "py-1" : "py-1.5",
    style === "accent-bar" ? (active ? "bg-side-hover text-side-active-fg before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded before:bg-accent" : "text-side-fg") : style === "minimal" ? (active ? "font-bold text-side-active-fg" : "text-side-fg opacity-80") : active ? "bg-side-active text-side-active-fg" : "text-side-fg"
  );

function Body({ compact, button = "Going" }) {
  return (
    <div className={cx("flex min-w-0 flex-1 flex-col", compact ? "gap-2 p-3" : "gap-3 p-4")}>
      <span className="text-[10px] font-bold uppercase tracking-wide text-accent">Reunion · Nov 22</span>
      <span className="text-sm font-bold text-slate-900">Class of 2019 reunion dinner</span>
      <div className="flex gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5">
        <span className="rounded-btn bg-brand px-3 py-1.5 text-[11px] font-semibold text-brand-ink">{button}</span>
        <span className="rounded-btn px-3 py-1.5 text-[11px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-300">Maybe</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-2.5">
            <div className="h-2 w-2/3 rounded bg-slate-200" />
            <div className="mt-1.5 h-2 w-1/2 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemberPreview({ draft, style }) {
  const d = draft.design.member;
  const items = (d.menu || []).filter((m) => m.visible).map((m) => m.label || MENU_LABEL[m.key]);
  const compact = d.density === "compact";
  const top = (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b border-top-border bg-top px-3 text-top-fg">
      {d.layout === "topbar" && <Logo draft={draft} />}
      {d.layout === "topbar" ? (
        <div className="flex min-w-0 flex-1 gap-1 overflow-hidden text-[11px]">
          {items.slice(0, 6).map((n, i) => (
            <span key={n} className={cx("shrink-0 rounded-md px-2 py-1", i === 0 ? "bg-black/10 font-semibold" : "opacity-80")}>
              {n}
            </span>
          ))}
        </div>
      ) : (
        <span className="flex-1 text-xs font-semibold">Home</span>
      )}
      <span className="h-6 w-6 rounded-full bg-brand-soft ring-1 ring-black/10" />
    </div>
  );
  return (
    <div style={style} className="flex h-[24rem] overflow-hidden rounded-xl border border-slate-200 bg-page font-theme" aria-label="Member app preview">
      {d.layout !== "topbar" && (
        <div className="hidden w-40 shrink-0 flex-col gap-0.5 bg-side p-2.5 sm:flex">
          <div className="mb-2 flex h-8 items-center px-1">
            <Logo draft={draft} className="text-side-active-fg" />
          </div>
          {items.map((n, i) => (
            <span key={n} className={sideItem(d.nav_style, i === 0, compact)}>
              {n}
            </span>
          ))}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {top}
        {d.welcome && <p className="mx-3 mt-3 rounded-lg bg-brand-soft px-3 py-2 text-[11px] font-medium text-slate-800">{d.welcome}</p>}
        <Body compact={compact} />
      </div>
    </div>
  );
}

export function AdminPreview({ draft, style }) {
  const d = draft.design.admin;
  const compact = d.density === "compact";
  return (
    <div style={style} className="flex h-[24rem] overflow-hidden rounded-xl border border-slate-200 bg-page font-theme" aria-label="Admin console preview">
      <div className="hidden w-44 shrink-0 flex-col bg-side p-2.5 sm:flex">
        <div className="mb-2 flex items-center gap-2 px-1 text-side-fg">
          <Logo draft={draft} />
          <span className="truncate text-[10px] opacity-70">{d.console_name}</span>
        </div>
        {[["", ["Dashboard"]], ["People", ["Members", "Alumni"]], ["Content", ["News", "Events"]]].map(([g, list]) => (
          <div key={g} className={compact ? "mt-1" : "mt-2"}>
            {g && <p className="px-2 text-[9px] font-semibold uppercase tracking-wider text-side-fg opacity-60">{g}</p>}
            {list.map((n) => (
              <span key={n} className={sideItem(d.nav_style, n === "Members", compact)}>
                {n}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-top-border bg-top px-3 text-xs font-semibold text-top-fg">
          <span className="flex-1">Members</span>
          <span className="opacity-70">View site</span>
        </div>
        <div className={cx("flex flex-col", compact ? "gap-2 p-3" : "gap-3 p-4")}>
          <div className="grid grid-cols-3 gap-2">
            {["Members", "Pending", "Events"].map((k, i) => (
              <div key={k} className="rounded-xl border border-slate-200 bg-white p-2.5">
                <p className="text-[10px] text-slate-500">{k}</p>
                <p className="text-sm font-bold text-slate-900">{[120, 2, 4][i]}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white">
            {["Hana Bekele", "Dawit Alemu", "Sara Tesfaye"].map((n) => (
              <div key={n} className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-[11px] last:border-0">
                <span className="h-5 w-5 rounded-full bg-brand-soft" />
                <span className="flex-1 font-medium text-slate-800">{n}</span>
                <span className="rounded-btn bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-ink">Approve</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
