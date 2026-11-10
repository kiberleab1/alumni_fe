/**
 * Admin forms for jobs and news (design: admin content forms). One form per
 * kind, used for both create and edit. Owner and institute come from the
 * signed-in admin on the server; only a super admin picks the institute.
 */
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ArrowLeftIcon, BriefcaseIcon, MapPinIcon, ClockIcon, NewspaperIcon, PhotoIcon, StarIcon } from "@heroicons/react/24/outline";
import { createJob, createNews, getInstitutes, updateJob, updateNews } from "src/api";
import { getUserToken } from "src/helpers/globalStorage";
import { Button, Card, Field, Pill, Switch, apiError, cx, inputClass } from "src/components/ui";

export const JOB_TYPES = ["Full time", "Part time", "Contract", "Internship", "Volunteer"];
export const JOB_LEVELS = ["Entry level", "Mid level", "Senior", "Lead", "Executive"];
export const NEWS_CATEGORIES = ["General", "Campus", "Alumni stories", "Events", "Careers", "Achievements", "Research"];

const QUILL_MODULES = {
  toolbar: [[{ header: [2, 3, false] }], ["bold", "italic", "underline", "blockquote"], [{ list: "ordered" }, { list: "bullet" }], ["link"], ["clean"]],
};
const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const today = () => new Date().toISOString().slice(0, 10);
const plain = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const deadlineLabel = (d) => (d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "No deadline");

export function useAdminSession() {
  return useMemo(() => {
    const u = getUserToken()?.user || {};
    return { role: u.role_name, instituteId: u.institute_id || u.ownerInstituteId || "", isSuper: u.role_name === "super_admin" };
  }, []);
}

function InstitutePicker({ value, onChange }) {
  const { data = [] } = useQuery("adminInstitutes", async () => {
    const r = await getInstitutes({ pageNumber: 1, pageSize: 100 });
    return Object.values(r?.data?.institute || {}).map((i) => ({ id: i.id, name: i.name }));
  });
  return (
    <Field label="Publish for institute" htmlFor="f-institute" hint="Only super admins can post for another institute">
      <select id="f-institute" className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">My institute</option>
        {data.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}
          </option>
        ))}
      </select>
    </Field>
  );
}

function ImageField({ file, onChange, current }) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  return (
    <Field label="Cover image" htmlFor="f-image" hint="Optional. JPG or PNG, up to 5 MB.">
      <label htmlFor="f-image" className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600 hover:border-slate-400">
        {preview ? <img src={preview} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <PhotoIcon className="h-8 w-8 text-slate-400" />}
        <span className="min-w-0 flex-1 truncate">{file ? file.name : current ? "Keep the current image, or choose a new one" : "Choose an image"}</span>
        <input
          id="f-image"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f && f.size > 5 * 1024 * 1024) return toast.error("That image is larger than 5 MB");
            onChange(f || null);
          }}
        />
      </label>
    </Field>
  );
}

function FormShell({ title, subtitle, onBack, preview, children, onSubmit, saving, submitLabel, error }) {
  return (
    <div className="ui-scope mx-auto max-w-6xl">
      {onBack && (
        <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </button>
      )}
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="space-y-5 p-5 sm:p-6 lg:col-span-2">
          {children}
          {error && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            {onBack && (
              <Button variant="secondary" onClick={onBack}>
                Cancel
              </Button>
            )}
            <Button type="submit" loading={saving}>
              {submitLabel}
            </Button>
          </div>
        </Card>
        <aside className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How members will see it</p>
          {preview}
        </aside>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------- jobs */

export function JobForm({ job, onDone }) {
  const queryClient = useQueryClient();
  const session = useAdminSession();
  const [f, setF] = useState(() => ({
    title: job?.title || "",
    company: job?.company || "",
    hiring_type: job?.hiring_type || "Full time",
    level: job?.level || "Mid level",
    salary: job?.salary || "",
    address: job?.address || "",
    deadline: toDateInput(job?.deadline),
    description: job?.description || "",
    institute_id: "",
    image: null,
  }));
  const [error, setError] = useState(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e?.target ? e.target.value : e }));
  const save = useMutation((fd) => (job ? updateJob(fd) : createJob(fd)), {
    onSuccess: () => {
      toast.success(job ? "Job updated" : "Job posted. Members can see it now.");
      queryClient.invalidateQueries();
      onDone?.();
    },
    onError: (e) => setError(apiError(e, "Couldn't save the job")),
  });
  const submit = (e) => {
    e.preventDefault();
    setError(null);
    if (!f.title.trim()) return setError("Add a job title");
    if (!f.company.trim()) return setError("Add the company or organisation");
    if (!f.address.trim()) return setError("Add a location, or write Remote");
    if (!f.deadline) return setError("Choose an application deadline");
    if (!job && f.deadline < today()) return setError("The deadline is in the past");
    if (!plain(f.description)) return setError("Describe the role");
    const fd = new FormData();
    if (job) fd.append("id", job.id);
    for (const k of ["title", "company", "hiring_type", "level", "address", "deadline", "description"]) fd.append(k, f[k].trim ? f[k].trim() : f[k]);
    fd.append("salary", f.salary.trim() || "Not disclosed");
    if (!job && session.isSuper && f.institute_id) fd.append("institute_id", f.institute_id);
    if (f.image) fd.append("image", f.image);
    save.mutate(fd);
  };
  return (
    <FormShell
      title={job ? "Edit job" : "Post a job"}
      subtitle="Jobs appear on the member Jobs board. Members can save them, track applications and see alumni at the company."
      onBack={onDone}
      onSubmit={submit}
      saving={save.isLoading}
      submitLabel={job ? "Save changes" : "Post job"}
      error={error}
      preview={
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <BriefcaseIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">{f.title || "Job title"}</p>
              <p className="text-sm text-slate-600">{f.company || "Company"}</p>
              <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5" /> {f.address || "Location"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" /> Closes {deadlineLabel(f.deadline)}
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Pill>{f.hiring_type}</Pill>
                <Pill>{f.level}</Pill>
                {f.salary && <Pill tone="green">{f.salary}</Pill>}
              </div>
            </div>
          </div>
          <p className="mt-3 line-clamp-4 text-sm text-slate-600">{plain(f.description) || "The description appears here."}</p>
        </Card>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Job title" htmlFor="f-title">
          <input id="f-title" className={inputClass} value={f.title} onChange={set("title")} placeholder="e.g. Junior Data Analyst" maxLength={200} />
        </Field>
        <Field label="Company or organisation" htmlFor="f-company" hint="Used to show members which alumni work there">
          <input id="f-company" className={inputClass} value={f.company} onChange={set("company")} placeholder="e.g. Ethio Telecom" maxLength={200} />
        </Field>
        <Field label="Job type" htmlFor="f-type">
          <select id="f-type" className={inputClass} value={f.hiring_type} onChange={set("hiring_type")}>
            {[...new Set([...JOB_TYPES, f.hiring_type])].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Experience level" htmlFor="f-level">
          <select id="f-level" className={inputClass} value={f.level} onChange={set("level")}>
            {[...new Set([...JOB_LEVELS, f.level])].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Location" htmlFor="f-address">
          <input id="f-address" className={inputClass} value={f.address} onChange={set("address")} placeholder="City, or Remote" />
        </Field>
        <Field label="Salary" htmlFor="f-salary" hint="Optional">
          <input id="f-salary" className={inputClass} value={f.salary} onChange={set("salary")} placeholder="e.g. 25,000–35,000 ETB / month" />
        </Field>
        <Field label="Application deadline" htmlFor="f-deadline">
          <input id="f-deadline" type="date" min={job ? undefined : today()} className={inputClass} value={f.deadline} onChange={set("deadline")} />
        </Field>
        {session.isSuper && !job && <InstitutePicker value={f.institute_id} onChange={set("institute_id")} />}
      </div>
      <Field label="Description" hint="Responsibilities, requirements and how to apply">
        <div className="overflow-hidden rounded-xl border border-slate-200 [&_.ql-container]:min-h-[220px] [&_.ql-container]:border-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200">
          <ReactQuill theme="snow" value={f.description} onChange={set("description")} modules={QUILL_MODULES} />
        </div>
      </Field>
      <ImageField file={f.image} onChange={set("image")} current={!!job?.image} />
    </FormShell>
  );
}

/* ---------------------------------------------------------------- news */

export function NewsForm({ news, onDone }) {
  const queryClient = useQueryClient();
  const session = useAdminSession();
  const [f, setF] = useState(() => ({
    title: news?.title || "",
    category: news?.category || "General",
    featured: !!news?.featured,
    deadline: toDateInput(news?.deadline) || toDateInput(Date.now() + 30 * 864e5),
    description: news?.description || "",
    institute_id: "",
    image: null,
  }));
  const [error, setError] = useState(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e?.target ? e.target.value : e }));
  const save = useMutation((fd) => (news ? updateNews(fd) : createNews(fd)), {
    onSuccess: () => {
      toast.success(news ? "Story updated" : "Story published");
      queryClient.invalidateQueries();
      onDone?.();
    },
    onError: (e) => setError(apiError(e, "Couldn't save the story")),
  });
  const submit = (e) => {
    e.preventDefault();
    setError(null);
    if (!f.title.trim()) return setError("Add a headline");
    if (!plain(f.description)) return setError("Write the story");
    if (!f.deadline) return setError("Choose how long the story stays up");
    const fd = new FormData();
    if (news) fd.append("id", news.id);
    fd.append("title", f.title.trim());
    fd.append("description", f.description);
    fd.append("deadline", f.deadline);
    fd.append("category", f.category.trim() || "General");
    fd.append("featured", String(f.featured));
    fd.append("visibility", news?.visibility || "public");
    if (!news && session.isSuper && f.institute_id) fd.append("ownerInstituteId", f.institute_id);
    if (f.image) fd.append("image", f.image);
    save.mutate(fd);
  };
  const minutes = Math.max(1, Math.round(plain(f.description).split(" ").filter(Boolean).length / 200));
  return (
    <FormShell
      title={news ? "Edit story" : "Publish a story"}
      subtitle="Stories appear in member News. A featured story is pinned to the top of the page."
      onBack={onDone}
      onSubmit={submit}
      saving={save.isLoading}
      submitLabel={news ? "Save changes" : "Publish"}
      error={error}
      preview={
        <Card className={cx("overflow-hidden", f.featured && "ring-2 ring-brand")}>
          <div className="flex h-28 items-center justify-center bg-slate-100 text-slate-400">
            <NewspaperIcon className="h-8 w-8" />
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-1">
              <Pill tone="brand">{f.category || "General"}</Pill>
              {f.featured && (
                <Pill tone="amber">
                  <StarIcon className="h-3 w-3" /> Featured
                </Pill>
              )}
            </div>
            <p className="mt-2 font-semibold text-slate-900">{f.title || "Headline"}</p>
            <p className="mt-1 line-clamp-3 text-sm text-slate-600">{plain(f.description) || "The first lines of the story appear here."}</p>
            <p className="mt-2 text-xs text-slate-400">{minutes} min read</p>
          </div>
        </Card>
      }
    >
      <Field label="Headline" htmlFor="f-title">
        <input id="f-title" className={inputClass} value={f.title} onChange={set("title")} placeholder="e.g. Class of 2015 reunion raises funds for the library" maxLength={200} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category" htmlFor="f-category" hint="Pick one or type a new category">
          <input id="f-category" list="news-categories" className={inputClass} value={f.category} onChange={set("category")} maxLength={60} />
          <datalist id="news-categories">
            {NEWS_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Show until" htmlFor="f-deadline" hint="The story is hidden from members after this date">
          <input id="f-deadline" type="date" className={inputClass} value={f.deadline} onChange={set("deadline")} />
        </Field>
        {session.isSuper && !news && <InstitutePicker value={f.institute_id} onChange={set("institute_id")} />}
      </div>
      <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Feature this story</p>
          <p className="text-sm text-slate-500">Shown large at the top of member News. If several stories are featured, the newest one is shown.</p>
        </div>
        <Switch checked={f.featured} onChange={set("featured")} label="Feature this story" />
      </div>
      <Field label="Story">
        <div className="overflow-hidden rounded-xl border border-slate-200 [&_.ql-container]:min-h-[260px] [&_.ql-container]:border-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200">
          <ReactQuill theme="snow" value={f.description} onChange={set("description")} modules={QUILL_MODULES} />
        </div>
      </Field>
      <ImageField file={f.image} onChange={set("image")} current={!!news?.image} />
    </FormShell>
  );
}
