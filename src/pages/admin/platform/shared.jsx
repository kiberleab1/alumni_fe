/** Small pieces shared by the platform admin pages. */
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getAdminConfig } from "src/api";
import { cx, inputClass } from "src/components/ui";
import { useInstitutes, useSession } from "../kit";

/** Institute switcher; only the super admin sees it. */
export function InstituteSelect({ value, onChange, allowAll, className, label = "Institute" }) {
  const { isSuper } = useSession();
  const { data = [] } = useInstitutes();
  if (!isSuper) return null;
  return (
    <label className={cx("block", className)}>
      <span className="sr-only">{label}</span>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {allowAll && <option value="all">All institutes</option>}
        {data.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Default institute filter: the super admin starts on "all" where allowed. */
export function useInstituteFilter(allowAll, initial) {
  const { isSuper, instituteId } = useSession();
  return useState(initial || (isSuper && allowAll ? "all" : instituteId));
}

/** The signed-in admin's capabilities in their institute. */
export function useAdminConfig(instituteId) {
  return useQuery(["adminConfig", instituteId || "mine"], () => getAdminConfig(instituteId), { staleTime: 30_000, retry: false });
}

export function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function KpiTile({ label, value, hint, tone }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={cx("mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl", tone === "warn" ? "text-amber-700" : "text-slate-900")}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export const num = (v) => (v == null ? "—" : Number(v).toLocaleString());
export const when = (d) => {
  if (!d) return "Never";
  const date = new Date(d);
  const days = Math.floor((Date.now() - date) / 86_400_000);
  if (days < 1) return "Today";
  if (days < 2) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

/** Minimal CSV parser: quoted fields, escaped quotes, CRLF. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === "," || c === ";" || c === "\t") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows.map((r) => r.map((x) => x.trim()));
}
