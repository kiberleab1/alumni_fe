import { useState } from "react";
import { getImageBaseUrl } from "src/api";

export const cx = (...c) => c.filter(Boolean).join(" ");

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
];
const SIZES = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};
const DOT = { xs: "h-2 w-2", sm: "h-2.5 w-2.5", md: "h-3 w-3", lg: "h-3.5 w-3.5", xl: "h-4 w-4" };

function hash(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

/** Photo if we have one, otherwise coloured initials. Optional presence dot. */
export function Avatar({ name, photo, size = "md", online, className }) {
  const src = photo ? (/^https?:/.test(photo) ? photo : getImageBaseUrl(photo)) : null;
  return (
    <span className={cx("relative inline-flex shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt=""
          className={cx(SIZES[size], "rounded-full object-cover ring-1 ring-black/5")}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextSibling.style.display = "inline-flex";
          }}
        />
      ) : null}
      <span
        style={{ display: src ? "none" : "inline-flex" }}
        className={cx(
          SIZES[size],
          AVATAR_COLORS[hash(name) % AVATAR_COLORS.length],
          "items-center justify-center rounded-full font-semibold"
        )}
        aria-hidden="true"
      >
        {initials(name)}
      </span>
      {online !== undefined && (
        <span
          className={cx(
            DOT[size],
            "absolute bottom-0 right-0 rounded-full ring-2 ring-white",
            online ? "bg-emerald-500" : "bg-slate-300"
          )}
          title={online ? "Online" : "Offline"}
        />
      )}
    </span>
  );
}

export function CountBadge({ count, className }) {
  if (!count) return null;
  return (
    <span
      className={cx(
        "inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold leading-5 text-white",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner({ className = "h-5 w-5" }) {
  return (
    <svg className={cx("animate-spin text-current", className)} viewBox="0 0 24 24" fill="none" aria-label="Loading">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-3 p-3">
      <div className="h-11 w-11 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  );
}

const BTN = {
  primary: "bg-brand text-brand-ink hover:bg-brand-hover focus-visible:outline-brand",
  secondary: "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-white text-rose-600 ring-1 ring-inset ring-rose-200 hover:bg-rose-50",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
};
export function Button({ variant = "primary", size = "md", loading, className, children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
        BTN[variant],
        className
      )}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------ formatting */
export function timeAgo(date) {
  if (!date) return "";
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
export function clockTime(date) {
  return new Date(date).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
export function dayLabel(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    ...(d.getFullYear() !== today.getFullYear() && { year: "numeric" }),
  });
}
export function fileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/* ------------------------------------------------------------ form controls */

/** Accessible on/off switch (role="switch"). */
export function Switch({ checked, onChange, label, disabled, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-brand" : "bg-slate-300",
        className
      )}
    >
      <span className={cx("inline-block h-5 w-5 transform rounded-full bg-white shadow transition", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
  );
}

/** Small segmented radio group: options = [{ value, label }]. */
export function Segmented({ value, onChange, options, label, size = "md" }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-lg bg-slate-100 p-1">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cx(
              "rounded-md font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              on ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** "message" from an API error (our { error: { message } } envelope or axios). */
export const apiError = (err, fallback = "Something went wrong") =>
  err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || fallback;

/* --------------------------------------------------------------- layout */

/** White rounded panel used by the redesigned pages. */
export function Card({ className, children, ...props }) {
  return (
    <section {...props} className={cx("rounded-theme border border-slate-200 bg-white shadow-sm", className)}>
      {children}
    </section>
  );
}

/** Page title row: title, optional subtitle and actions on the right. */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Underlined tab bar: tabs = [{ value, label, count? }]. */
export function Tabs({ value, onChange, tabs, className }) {
  return (
    <div role="tablist" className={cx("flex gap-1 overflow-x-auto border-b border-slate-200", className)}>
      {tabs.map((t) => {
        const on = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(t.value)}
            className={cx(
              "-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-semibold transition",
              on ? "border-brand text-link" : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            {t.label}
            {t.count ? <span className={cx("rounded-full px-1.5 text-[11px] leading-5", on ? "bg-brand-soft text-link" : "bg-slate-100 text-slate-600")}>{t.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

/** Rounded filter chips: options = [{ value, label }]. */
export function Chips({ value, onChange, options, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cx(
              "rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition",
              on ? "bg-brand text-brand-ink ring-brand" : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Labelled form field wrapper. */
export function Field({ label, hint, error, children, className, htmlFor }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      {children}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-slate-100 disabled:text-slate-500";

/** Search box with a magnifier icon. */
export function SearchInput({ value, onChange, placeholder = "Search", className }) {
  return (
    <div className={cx("relative", className)}>
      <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a.75.75 0 11-1.06 1.06l-3.08-3.08A7 7 0 012 9z" clipRule="evenodd" />
      </svg>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className={cx(inputClass.replace("px-3", "pr-3"), "pl-9")} />
    </div>
  );
}

/** Small coloured pill. tone: slate | brand | green | amber | rose */
const PILL = {
  slate: "bg-slate-100 text-slate-700",
  brand: "bg-brand-soft text-link",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-800",
  rose: "bg-rose-50 text-rose-700",
};
export function Pill({ tone = "slate", children, className }) {
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", PILL[tone], className)}>{children}</span>;
}

/** Centered modal dialog (no portal library needed). */
export function Modal({ open, onClose, title, children, footer, size = "md" }) {
  if (!open) return null;
  return (
    <div className="ui-scope fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={cx("max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl", size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg")}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

/** "Mar 2021" style month label. */
export function monthYear(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, { month: "short", year: "numeric", timeZone: "UTC" });
}

/**
 * Free-text chips (skills, languages, topics). Enter or comma adds, Backspace
 * on an empty field removes the last one; suggestions are optional quick picks.
 */
export function TagInput({ value = [], onChange, placeholder = "Type and press Enter", suggestions = [], max = 30, id, label }) {
  const [draft, setDraft] = useState("");
  const add = (raw) => {
    const parts = String(raw)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const lower = new Set(value.map((v) => v.toLowerCase()));
    const next = [...value];
    for (const t of parts) if (!lower.has(t.toLowerCase()) && next.length < max) next.push(t.slice(0, 40)) && lower.add(t.toLowerCase());
    onChange(next);
    setDraft("");
  };
  const remove = (t) => onChange(value.filter((v) => v !== t));
  const left = suggestions.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase())).slice(0, 8);
  return (
    <div>
      <div className="flex min-h-[2.75rem] flex-wrap items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2 py-1.5 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-link">
            {t}
            <button type="button" onClick={() => remove(t)} className="rounded-full hover:bg-black/5" aria-label={`Remove ${t}`}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </span>
        ))}
        <input
          id={id}
          aria-label={label || placeholder}
          value={draft}
          onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) remove(value[value.length - 1]);
          }}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={value.length >= max ? "" : placeholder}
          disabled={value.length >= max}
          className="min-w-[8rem] flex-1 border-0 bg-transparent p-1 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0"
        />
      </div>
      {left.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {left.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-dashed border-slate-300 px-2.5 py-0.5 text-xs text-slate-600 hover:border-slate-400 hover:text-slate-800">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
