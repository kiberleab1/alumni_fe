/** Admin screens for news, events, jobs, job history and podcasts. */
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BriefcaseIcon, CalendarDaysIcon, ClockIcon, MicrophoneIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { createEvents, createJobHistory, createPodcast, deleteEvent, deleteJob, deleteJobHistory, deletedNews, deletePodcast, getAllEvents, getAllJobHistory, getAllJobs, getAllNews, getAllPodcast, updateEvent, updateJobHistory, updatePodcast } from "src/api";
import { Field, Pill } from "src/components/ui";
import { FormScreen, FormSection, ImagesField, Lead, ResourceList, SelectField, TextArea, TextField, compact, dateInput, dateTimeInput, fmtDate, plainText, useFormState, useInstitutes, useSave, useSession } from "../kit";

const LEVEL_TONE = { High: "rose", Medium: "amber", Low: "slate" };
const level = (v) => (v ? <Pill tone={LEVEL_TONE[v] || "slate"}>{v}</Pill> : "—");

export function NewsPage({ go }) {
  return (
    <ResourceList
      title="News"
      subtitle="Stories and announcements for alumni."
      queryKey="adminNews"
      fetch={async (p, s) => {
        const r = await getAllNews({ pageNumber: p, pageSize: s });
        return { rows: r.data.news || [], total: r.data.total_items || 0 };
      }}
      columns={[
        { header: "Headline", cell: (n) => <Lead title={n.title || "Untitled"} sub={n.category} /> },
        { header: "Author", cell: (n) => n.adminName || "—" },
        { header: "Institute", cell: (n) => n.instituteName || "—" },
        { header: "Published", cell: (n) => fmtDate(n.createdAt) },
      ]}
      createLabel="Write news"
      onCreate={() => go("Create News")}
      onEdit={(n) => go("Edit News", n)}
      remove={(n) => deletedNews(n.id)}
      nameOf={(n) => n.title || "This story"}
      emptyIcon={NewspaperIcon}
      emptyText="Publish the first story."
    />
  );
}

export function JobsPage({ go }) {
  return (
    <ResourceList
      title="Jobs"
      subtitle="Openings shared with alumni."
      queryKey="adminJobs"
      fetch={async (p, s) => {
        const r = await getAllJobs({ pageNumber: p, pageSize: s });
        return { rows: r.data.jobs || [], total: r.data.total_items || 0 };
      }}
      columns={[
        { header: "Role", cell: (j) => <Lead title={j.title} sub={j.instituteName} /> },
        { header: "Level", cell: (j) => j.level || "—" },
        { header: "Posted by", cell: (j) => j.adminName || "—" },
        { header: "Deadline", cell: (j) => fmtDate(j.deadline) },
        { header: "Posted", cell: (j) => fmtDate(j.createdAt) },
      ]}
      createLabel="Post a job"
      onCreate={() => go("Create Job")}
      onEdit={(j) => go("Edit Job", j)}
      remove={(j) => deleteJob(j.id)}
      nameOf={(j) => j.title}
      emptyIcon={BriefcaseIcon}
      emptyText="Post the first opening."
    />
  );
}

export function EventsPage({ go }) {
  return (
    <ResourceList
      title="Events"
      subtitle="Reunions, talks and meetups."
      queryKey="adminEvents"
      fetch={async (p, s) => {
        const r = await getAllEvents({ pageNumber: p, pageSize: s });
        return { rows: r.data.events || [], total: r.data.total_items || 0 };
      }}
      columns={[
        { header: "Event", cell: (e) => <Lead title={e.title} sub={e.venue} /> },
        { header: "Date", cell: (e) => fmtDate(e.time) },
        { header: "Priority", cell: (e) => level(e.level) },
        { header: "Institute", cell: (e) => e.instituteName || "—" },
        { header: "Created by", cell: (e) => e.adminName || "—" },
      ]}
      createLabel="Create event"
      onCreate={() => go("Create Event")}
      onEdit={(e) => go("Edit Event", e)}
      remove={(e) => deleteEvent(e.id)}
      nameOf={(e) => e.title}
      emptyIcon={CalendarDaysIcon}
      emptyText="Create the first event."
    />
  );
}

const QUILL = { toolbar: [[{ header: [2, 3, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link"], ["clean"]] };

export function EventForm({ record, go }) {
  const editing = Boolean(record);
  const session = useSession();
  const form = useFormState({ title: record?.title || "", venue: record?.venue || "", level: record?.level || "Medium", visibility: record?.visibility || "All Alumni", time: dateTimeInput(record?.time), deadline: dateInput(record?.deadline), description: record?.description || "", ownerInstituteId: record?.ownerInstituteId || session.instituteId, image: [] });
  const { data: institutes = [] } = useInstitutes();
  const save = useSave({ success: editing ? "Event updated" : "Event created", invalidate: ["adminEvents", "adminDashboard"], onDone: () => go("Events") });

  const submit = (e) => {
    e.preventDefault();
    const v = form.values;
    if (!form.validate(["title", "venue", "level", "time", "deadline", "ownerInstituteId"])) return save.setError("Please fill in the highlighted fields.");
    if (!plainText(v.description)) return save.setError("Please add a description.");
    if (new Date(v.deadline) > new Date(v.time)) {
      form.setErrors({ deadline: "The RSVP deadline must be on or before the event" });
      return save.setError("Please fix the highlighted field.");
    }
    save.run(async () => {
      const data = new FormData();
      if (editing) data.append("id", record.id);
      else data.append("visibility", v.visibility);
      data.append("ownerInstituteId", v.ownerInstituteId);
      data.append("title", v.title);
      data.append("venue", v.venue);
      data.append("description", v.description);
      data.append("deadline", v.deadline);
      data.append("time", new Date(v.time).toISOString());
      data.append("level", v.level);
      if (v.image[0]) data.append("image", v.image[0]);
      await (editing ? updateEvent(data) : createEvents(data));
    });
  };
  return (
    <FormScreen title={editing ? "Edit event" : "Create event"} subtitle={record?.title} backLabel="Events" onBack={() => go("Events")} onSubmit={submit} saving={save.saving} error={save.error} submitLabel={editing ? "Save changes" : "Publish event"}>
      <FormSection title="Event details">
        <TextField form={form} name="title" label="Title" required className="sm:col-span-2" />
        <TextField form={form} name="venue" label="Venue" required />
        <SelectField form={form} name="ownerInstituteId" label="Institute" required options={institutes} />
        <TextField form={form} name="time" label="Starts" type="datetime-local" required />
        <TextField form={form} name="deadline" label="RSVP by" type="date" required />
        <SelectField form={form} name="level" label="Priority" required options={["High", "Medium", "Low"]} />
        {!editing && <SelectField form={form} name="visibility" label="Who can see it" required options={["All Alumni", "My alumni"]} />}
        <Field label="Description *" className="sm:col-span-2">
          <ReactQuill theme="snow" modules={QUILL} value={form.values.description} onChange={(h) => form.set("description", h)} />
        </Field>
        <ImagesField label="Cover image" multiple={false} files={form.values.image} onChange={(f) => form.set("image", f)} hint={editing ? "Leave empty to keep the current image." : "Optional. JPG or PNG, up to 5 MB."} className="sm:col-span-2" />
      </FormSection>
    </FormScreen>
  );
}

export function JobHistoryPage({ go }) {
  return (
    <ResourceList
      title="Job history"
      subtitle="Past roles recorded for alumni."
      queryKey="adminJobHistory"
      loadsAll
      searchIn={(j) => [j.title, j.status, j.address]}
      fetch={async () => {
        const r = await getAllJobHistory({ pageNumber: 1, pageSize: 100 });
        const rows = r.data.jobHistory || [];
        return { rows, total: rows.length };
      }}
      columns={[
        { header: "Title", cell: (j) => <Lead title={j.title} sub={j.address} /> },
        { header: "Status", cell: (j) => j.status || "—" },
        { header: "Until", cell: (j) => fmtDate(j.duration) },
        { header: "Added", cell: (j) => fmtDate(j.createdAt) },
      ]}
      createLabel="Add record"
      onCreate={() => go("Create JobHistory")}
      onEdit={(j) => go("Edit JobHistory", j)}
      remove={deleteJobHistory}
      nameOf={(j) => j.title}
      emptyIcon={ClockIcon}
      emptyText="Records appear here when added to a member."
    />
  );
}

export function JobHistoryForm({ record, go }) {
  const editing = Boolean(record);
  const form = useFormState({ user_id: record?.user_id || "", title: record?.title || "", description: record?.description || "", status: record?.status || "", address: record?.address || "", duration: dateInput(record?.duration) });
  const save = useSave({ success: editing ? "Record updated" : "Record added", invalidate: "adminJobHistory", onDone: () => go("Jobs History") });
  const submit = (e) => {
    e.preventDefault();
    if (!form.validate(["title", "description", "status", "address", "duration", ...(editing ? [] : ["user_id"])])) return save.setError("Please fill in the highlighted fields.");
    const { user_id, ...rest } = form.values;
    const fields = compact(rest);
    save.run(() => (editing ? updateJobHistory({ id: record.id, ...fields }) : createJobHistory({ user_id, visibility: "public", ...fields })));
  };
  return (
    <FormScreen title={editing ? "Edit job record" : "Add job record"} subtitle={record?.title} backLabel="Job history" onBack={() => go("Jobs History")} onSubmit={submit} saving={save.saving} error={save.error} submitLabel={editing ? "Save changes" : "Add record"}>
      <FormSection title="Details">
        {!editing && <TextField form={form} name="user_id" label="Member ID" required className="sm:col-span-2" hint="The member's user ID." />}
        <TextField form={form} name="title" label="Job title" required />
        <TextField form={form} name="status" label="Status" required hint="For example: Current, Completed" />
        <TextField form={form} name="address" label="Location" required />
        <TextField form={form} name="duration" label="Until" type="date" required />
        <TextArea form={form} name="description" label="Description" required className="sm:col-span-2" />
      </FormSection>
    </FormScreen>
  );
}

export function PodcastsPage({ go }) {
  return (
    <ResourceList
      title="Podcasts"
      subtitle="Episodes shown on the public Podcasts page."
      queryKey="adminPodcasts"
      loadsAll
      searchIn={(p) => [p.title, p.description]}
      fetch={async () => {
        const r = await getAllPodcast({ pageNumber: 1, pageSize: 200 });
        const rows = Array.isArray(r.data) ? r.data : [];
        return { rows, total: rows.length };
      }}
      columns={[
        { header: "Episode", cell: (p) => <Lead title={p.title} sub={p.description} /> },
        {
          header: "Link",
          cell: (p) => (
            <a href={p.url} target="_blank" rel="noreferrer" className="block max-w-xs truncate text-link hover:underline">
              {p.url}
            </a>
          ),
        },
      ]}
      createLabel="Add podcast"
      onCreate={() => go("Create Podcast")}
      onEdit={(p) => go("Edit Podcast", p)}
      remove={deletePodcast}
      nameOf={(p) => p.title}
      emptyIcon={MicrophoneIcon}
      emptyText="Add the first episode."
    />
  );
}

export function PodcastForm({ record, go }) {
  const editing = Boolean(record);
  const form = useFormState({ name: record?.title || "", url: record?.url || "", description: record?.description || "" });
  const save = useSave({ success: editing ? "Podcast updated" : "Podcast added", invalidate: "adminPodcasts", onDone: () => go("Podcast") });
  const submit = (e) => {
    e.preventDefault();
    if (!form.validate(["name", "url", "description"])) return save.setError("Please fill in the highlighted fields.");
    save.run(() => (editing ? updatePodcast({ id: record.id, ...form.values }) : createPodcast(form.values)));
  };
  return (
    <FormScreen title={editing ? "Edit podcast" : "Add podcast"} subtitle={record?.title} backLabel="Podcasts" onBack={() => go("Podcast")} onSubmit={submit} saving={save.saving} error={save.error} submitLabel={editing ? "Save changes" : "Add podcast"}>
      <FormSection title="Episode">
        <TextField form={form} name="name" label="Title" required className="sm:col-span-2" />
        <TextField form={form} name="url" label="Link" type="url" required className="sm:col-span-2" hint="A YouTube, Spotify or audio file link." placeholder="https://" />
        <TextArea form={form} name="description" label="Description" required className="sm:col-span-2" />
      </FormSection>
    </FormScreen>
  );
}
