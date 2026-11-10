/**
 * Building blocks shared by every admin page: a list screen (table on wide
 * screens, cards on phones, paging, delete confirmation) and a form screen
 * (sections, validation, one save button).
 */
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon, PencilSquareIcon, PhotoIcon, PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getActAsInstitute, getAddressById, getDepartments, getInstitutes } from "src/api";
import { getUserToken } from "src/helpers/globalStorage";
import { Button, Card, EmptyState, Field, Modal, PageHeader, SearchInput, apiError, cx, inputClass } from "src/components/ui";

export const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};
export const plainText = (html = "") => String(html || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
/** The API rejects blank optional strings, so leave them out. */
export const compact = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== "" && v != null));
export const fullName = (p) => [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "Unnamed";
/** yyyy-mm-dd for a date input. */
export const dateInput = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};
/** yyyy-mm-ddThh:mm in the viewer's time zone, for a datetime-local input. */
export const dateTimeInput = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

/** contact_info is stored as "telegram:x, twitter:y"; values may contain ":". */
export function parseContact(text) {
  const out = {};
  String(text || "")
    .split(",")
    .forEach((part) => {
      const at = part.indexOf(":");
      if (at > 0) out[part.slice(0, at).trim()] = part.slice(at + 1).trim();
    });
  return out;
}
export const buildContact = (v) =>
  ["telegram", "twitter", "linkedin", "facebook"]
    .filter((k) => v[k]?.trim())
    .map((k) => `${k}:${v[k].trim()}`)
    .join(", ");

export function useSession() {
  return useMemo(() => {
    const u = getUserToken()?.user || {};
    const isSuper = u.role_name === "super_admin";
    const actAs = isSuper ? getActAsInstitute() : null;
    return { role: u.role_name, instituteId: actAs?.id || u.institute_id || u.ownerInstituteId || "", homeInstituteId: u.institute_id || "", actingAs: actAs, isSuper, name: fullName(u), email: u.email };
  }, []);
}

export function useInstitutes() {
  return useQuery(
    "adminInstituteOptions",
    async () => {
      const r = await getInstitutes({ pageNumber: 1, pageSize: 100 });
      return Object.values(r?.data?.institute || {}).map((i) => ({ value: i.id, label: i.name }));
    },
    { staleTime: 60_000 },
  );
}
export function useDepartments() {
  return useQuery(
    "adminDepartmentOptions",
    async () => {
      const r = await getDepartments({ pageNumber: 1, pageSize: 100 });
      return Object.values(r?.data?.department || {}).map((d) => ({ value: d.id, label: d.name, institute: d.institute_id }));
    },
    { staleTime: 60_000 },
  );
}

/* ------------------------------------------------------------ list screen */

function ConfirmDelete({ row, name, onClose, remove, invalidate }) {
  const client = useQueryClient();
  const m = useMutation(() => remove(row), {
    onSuccess: () => {
      client.invalidateQueries(invalidate);
      toast.success(`${name} deleted`);
      onClose();
    },
    onError: (e) => toast.error(apiError(e, "Couldn't delete that. Try again.")),
  });
  return (
    <Modal
      open
      onClose={onClose}
      title="Delete this item?"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" loading={m.isLoading} onClick={() => m.mutate()}>
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-slate-600">
        <span className="font-semibold text-slate-900">{name}</span> will be permanently removed. This can't be undone.
      </p>
    </Modal>
  );
}

function RowActions({ row, onEdit, onDelete, actions }) {
  const btn = "rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900";
  return (
    <div className="flex items-center justify-end gap-0.5">
      {actions?.(row)}
      {onEdit && (
        <button type="button" className={btn} onClick={() => onEdit(row)} aria-label="Edit" title="Edit">
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      )}
      {onDelete && (
        <button type="button" className={cx(btn, "hover:bg-rose-50 hover:text-rose-600")} onClick={() => onDelete(row)} aria-label="Delete" title="Delete">
          <TrashIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

function Pager({ page, pages, total, size, shown, onChange }) {
  if (!total) return null;
  const from = (page - 1) * size + 1;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
      <p>
        {from.toLocaleString()}–{(from + shown - 1).toLocaleString()} of {total.toLocaleString()}
      </p>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Previous page">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <span className="px-2 font-medium text-slate-700">
          {page} / {pages}
        </span>
        <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Next page">
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * fetch(page, size) returns { rows, total }. With `loadsAll`, fetch returns
 * every row and this screen pages and searches them itself (`searchIn`).
 * Without it the server pages, and search isn't offered: filtering one page
 * would silently hide matches on the others.
 */
export function ResourceList({ title, subtitle, queryKey, fetch, columns, rowKey = (r) => r.id, createLabel, onCreate, onEdit, remove, nameOf = () => "Item", actions, emptyIcon, emptyText, loadsAll, searchIn, pageSize = 10, bare }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const { data, isLoading, isError, refetch, isFetching } = useQuery(loadsAll ? [queryKey] : [queryKey, page], () => fetch(page, pageSize), { keepPreviousData: true });

  const view = useMemo(() => {
    if (!data) return { rows: [], total: 0 };
    if (!loadsAll) return { rows: data.rows, total: data.total };
    const q = search.trim().toLowerCase();
    const all = q && searchIn ? data.rows.filter((r) => searchIn(r).filter(Boolean).join(" ").toLowerCase().includes(q)) : data.rows;
    return { rows: all.slice((page - 1) * pageSize, page * pageSize), total: all.length };
  }, [data, loadsAll, search, searchIn, page, pageSize]);
  const pages = Math.max(1, Math.ceil(view.total / pageSize));
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [page, pages]);

  const add = onCreate && (
    <Button onClick={onCreate}>
      <PlusIcon className="h-4 w-4" /> {createLabel}
    </Button>
  );
  const hasActions = onEdit || remove || actions;
  const [lead, ...rest] = columns;

  const body = (
    <>
      {loadsAll && searchIn && (
        <div className="mb-4 flex">
          <SearchInput value={search} onChange={(v) => (setSearch(v), setPage(1))} placeholder={`Search ${title.toLowerCase()}`} className="w-full sm:w-80" />
        </div>
      )}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="animate-pulse divide-y divide-slate-100" aria-label="Loading">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 p-4">
                <div className="h-4 w-1/3 rounded bg-slate-200" />
                <div className="h-4 w-1/4 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-amber-500" />
            <p className="text-sm text-slate-600">We couldn't load this list.</p>
            <Button variant="secondary" size="sm" loading={isFetching} onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : !view.rows.length ? (
          <EmptyState icon={emptyIcon} title={search ? "No matches" : `Nothing here yet`} description={search ? "Try a different search." : emptyText} action={!search ? add : undefined} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    {columns.map((c) => (
                      <th key={c.header} scope="col" className={cx("whitespace-nowrap px-4 py-3", c.className)}>
                        {c.header}
                      </th>
                    ))}
                    {hasActions && (
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {view.rows.map((r) => (
                    <tr key={rowKey(r)} className="transition hover:bg-slate-50">
                      {columns.map((c) => (
                        <td key={c.header} className={cx("px-4 py-3 align-middle text-slate-600", c.className)}>
                          {c.cell(r)}
                        </td>
                      ))}
                      {hasActions && (
                        <td className="px-2 py-2">
                          <RowActions row={r} onEdit={onEdit} onDelete={remove && setDeleting} actions={actions} />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-slate-100 md:hidden">
              {view.rows.map((r) => (
                <li key={rowKey(r)} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 text-sm">{lead.cell(r)}</div>
                    {hasActions && <RowActions row={r} onEdit={onEdit} onDelete={remove && setDeleting} actions={actions} />}
                  </div>
                  {rest.length > 0 && (
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {rest.map((c) => (
                        <div key={c.header} className="min-w-0">
                          <dt className="text-xs text-slate-500">{c.header}</dt>
                          <dd className="break-words text-slate-800">{c.cell(r)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              ))}
            </ul>
            <Pager page={page} pages={pages} total={view.total} size={pageSize} shown={view.rows.length} onChange={setPage} />
          </>
        )}
      </Card>
      {deleting && <ConfirmDelete row={deleting} name={nameOf(deleting)} remove={remove} invalidate={queryKey} onClose={() => setDeleting(null)} />}
    </>
  );
  if (bare) {
    return (
      <>
        {add && <div className="mb-4 flex justify-end">{add}</div>}
        {body}
      </>
    );
  }
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title={title} subtitle={subtitle} actions={add} />
      <div className="mt-6">{body}</div>
    </div>
  );
}

/** Two-line table cell: a bold title with a muted line under it. */
export function Lead({ title, sub, onClick }) {
  return (
    <div className="min-w-0 max-w-sm">
      <p className={cx("truncate font-semibold text-slate-900", onClick && "cursor-pointer hover:underline")}>{title}</p>
      {sub && <p className="truncate text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

/* ------------------------------------------------------------ form screen */

/** values, a field binder, and "required" validation for a form. */
export function useFormState(initial) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => {
    setValues((p) => ({ ...p, [k]: v }));
    setErrors((p) => (p[k] ? { ...p, [k]: undefined } : p));
  };
  const validate = (required) => {
    const next = {};
    required.forEach((k) => {
      if (!String(values[k] ?? "").trim()) next[k] = "This field is required";
    });
    setErrors(next);
    return !Object.keys(next).length;
  };
  return { values, errors, set, setValues, setErrors, validate };
}

export function TextField({ form, name, label, hint, required, className, type = "text", ...props }) {
  const id = `f-${name}`;
  return (
    <Field label={required ? `${label} *` : label} htmlFor={id} hint={hint} error={form.errors[name]} className={className}>
      <input id={id} type={type} className={inputClass} value={form.values[name] ?? ""} onChange={(e) => form.set(name, e.target.value)} {...props} />
    </Field>
  );
}
export function TextArea({ form, name, label, hint, required, className, rows = 4 }) {
  const id = `f-${name}`;
  return (
    <Field label={required ? `${label} *` : label} htmlFor={id} hint={hint} error={form.errors[name]} className={className}>
      <textarea id={id} rows={rows} className={inputClass} value={form.values[name] ?? ""} onChange={(e) => form.set(name, e.target.value)} />
    </Field>
  );
}
export function SelectField({ form, name, label, hint, required, className, options, placeholder = "Select…" }) {
  const id = `f-${name}`;
  return (
    <Field label={required ? `${label} *` : label} htmlFor={id} hint={hint} error={form.errors[name]} className={className}>
      <select id={id} className={inputClass} value={form.values[name] ?? ""} onChange={(e) => form.set(name, e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

export function FormSection({ title, hint, children }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {hint && <p className="mt-0.5 text-sm text-slate-500">{hint}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

export function FormScreen({ title, subtitle, backLabel, onBack, onSubmit, saving, submitLabel = "Save", error, children, wide }) {
  return (
    <div className={cx("mx-auto", wide ? "max-w-5xl" : "max-w-3xl")}>
      {onBack && (
        <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
          <ArrowLeftIcon className="h-4 w-4" /> {backLabel || "Back"}
        </button>
      )}
      <PageHeader title={title} subtitle={subtitle} />
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
        {children}
        {error && (
          <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          {onBack && (
            <Button variant="secondary" onClick={onBack}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={saving}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}

/** Runs an async save with shared saving/error state and a success toast. */
export function useSave({ success, onDone, invalidate }) {
  const client = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const run = async (fn) => {
    setSaving(true);
    setError("");
    try {
      const result = await fn();
      if (invalidate) [].concat(invalidate).forEach((k) => client.invalidateQueries(k));
      toast.success(success);
      onDone?.(result);
    } catch (e) {
      setError(apiError(e, "Couldn't save. Check the form and try again."));
    } finally {
      setSaving(false);
    }
  };
  return { saving, error, setError, run };
}

/* ------------------------------------------------- repeated form sections */

export const ADDRESS_BLANK = { country: "", region: "", city: "", house_number: "" };
export const ADDRESS_REQUIRED = ["country", "region", "city"];

/** Address fields; `prefix` lets one form hold two addresses. */
export function AddressSection({ form, prefix = "", title = "Address", hint, required = true }) {
  const n = (k) => `${prefix}${k}`;
  return (
    <FormSection title={title} hint={hint}>
      <TextField form={form} name={n("country")} label="Country" required={required} />
      <TextField form={form} name={n("region")} label="Region" required={required} />
      <TextField form={form} name={n("city")} label="City" required={required} />
      <TextField form={form} name={n("house_number")} label="House number" />
    </FormSection>
  );
}
export function SocialSection({ form }) {
  return (
    <FormSection title="Social links" hint="Optional. These appear on public pages.">
      <TextField form={form} name="telegram" label="Telegram" />
      <TextField form={form} name="twitter" label="X (Twitter)" />
      <TextField form={form} name="linkedin" label="LinkedIn" />
      <TextField form={form} name="facebook" label="Facebook" />
    </FormSection>
  );
}
export const pickAddress = (v, prefix = "") => ({
  country: v[`${prefix}country`],
  region: v[`${prefix}region`],
  city: v[`${prefix}city`],
  house_number: v[`${prefix}house_number`] || "",
});
/** Loads a saved address into the form once it arrives. */
export function useLoadAddress(id, form, prefix = "") {
  const { data, isLoading } = useQuery(["adminAddress", id], () => getAddressById(id), { enabled: !!id, retry: false, refetchOnWindowFocus: false });
  useEffect(() => {
    const a = data?.data;
    if (!a) return;
    form.setValues((p) => ({ ...p, [`${prefix}country`]: a.country || "", [`${prefix}region`]: a.region || "", [`${prefix}city`]: a.city || "", [`${prefix}house_number`]: a.house_number || "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return isLoading && !!id;
}

/** Choose one or several images, with thumbnails. */
export function ImagesField({ files, onChange, multiple = true, label = "Images", hint = "JPG or PNG, up to 5 MB each.", error, className }) {
  const previews = useMemo(() => files.map((f) => ({ f, url: URL.createObjectURL(f) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);
  const add = (e) => {
    const picked = [...(e.target.files || [])];
    e.target.value = "";
    const ok = picked.filter((f) => f.size <= 5 * 1024 * 1024);
    if (ok.length < picked.length) toast.error("Images must be 5 MB or smaller");
    onChange(multiple ? [...files, ...ok] : ok.slice(0, 1));
  };
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 hover:border-slate-400">
          <PhotoIcon className="h-7 w-7 text-slate-400" />
          <span>{files.length && !multiple ? "Replace image" : "Choose image" + (multiple ? "s" : "")}</span>
          <input type="file" accept="image/*" multiple={multiple} className="sr-only" onChange={add} />
        </label>
        {previews.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {previews.map((p, i) => (
              <li key={p.url} className="relative">
                <img src={p.url} alt={p.f.name} className="h-20 w-20 rounded-lg object-cover ring-1 ring-slate-200" />
                <button type="button" onClick={() => onChange(files.filter((_, x) => x !== i))} className="absolute -right-1.5 -top-1.5 rounded-full bg-slate-900 p-0.5 text-white" aria-label={`Remove ${p.f.name}`}>
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Field>
  );
}
