/**
 * One page for everything on the public site: hero slides, about, mission,
 * vision, gallery and testimonials, each a tab with add and delete.
 */
import { useState } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { createTestimonial, createWebContent, deleteTestimonial, deleteWebContentById, getAllTestimonial, getImageBaseUrl, getWebContentByComonent, updateTestimonial } from "src/api";
import { Button, Modal, PageHeader, Tabs } from "src/components/ui";
import { ImagesField, Lead, ResourceList, TextArea, TextField, fmtDate, plainText, useFormState, useSave } from "../kit";

const TABS = [
  { key: "slideshow", label: "Hero slides", needsText: true, needsImage: true },
  { key: "aboutus", label: "About", needsText: true },
  { key: "Mission", label: "Mission", needsText: true },
  { key: "Vision", label: "Vision", needsText: true },
  { key: "gallery", label: "Gallery", needsImage: true },
];

function AddContent({ tab, queryKey, onClose }) {
  const form = useFormState({ title: "", description: "" });
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const save = useSave({ success: `${tab.label} updated`, invalidate: queryKey, onDone: onClose });
  const submit = () => {
    const ok = !tab.needsText || form.validate(["title", "description"]);
    if (tab.needsImage && !images.length) return setImageError("Choose at least one image");
    setImageError("");
    if (ok) save.run(() => createWebContent({ component: tab.key, title: tab.needsText ? form.values.title : "", description: tab.needsText ? form.values.description : "", images }));
  };
  return (
    <Modal
      open
      onClose={onClose}
      title={`Add to ${tab.label}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={save.saving} onClick={submit}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {tab.needsText && (
          <>
            <TextField form={form} name="title" label="Title" required />
            <TextArea form={form} name="description" label="Text" required />
          </>
        )}
        <ImagesField files={images} onChange={(f) => (setImages(f), setImageError(""))} error={imageError} hint={tab.needsImage ? "Required. JPG or PNG, up to 5 MB each." : "Optional. JPG or PNG, up to 5 MB each."} />
        {save.error && <p className="text-sm text-rose-600">{save.error}</p>}
      </div>
    </Modal>
  );
}

function Thumbs({ images }) {
  const list = Array.isArray(images) ? images : [];
  if (!list.length) return "—";
  return (
    <div className="flex items-center gap-1">
      {list.slice(0, 4).map((src) => (
        <img key={src} src={getImageBaseUrl(src)} alt="" loading="lazy" className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200" />
      ))}
      {list.length > 4 && <span className="pl-1 text-xs text-slate-500">+{list.length - 4}</span>}
    </div>
  );
}

function ContentTab({ tab }) {
  const [adding, setAdding] = useState(false);
  const queryKey = `adminWeb:${tab.key}`;
  const textColumns = tab.needsText ? [{ header: "Content", cell: (c) => <Lead title={c.title || "Untitled"} sub={plainText(c.description)} /> }] : [];
  return (
    <>
      <ResourceList
        bare
        title={tab.label}
        queryKey={queryKey}
        loadsAll
        fetch={async () => {
          const r = await getWebContentByComonent({ component: tab.key, pageNumber: 1, pageSize: 200 });
          const rows = Array.isArray(r.data) ? r.data : r.data?.webContent || r.data?.rows || [];
          return { rows, total: rows.length };
        }}
        columns={[...textColumns, { header: "Images", cell: (c) => <Thumbs images={c.image} /> }, { header: "Added", cell: (c) => fmtDate(c.createdAt) }]}
        createLabel="Add"
        onCreate={() => setAdding(true)}
        remove={deleteWebContentById}
        nameOf={(c) => c.title || "This item"}
        emptyIcon={GlobeAltIcon}
        emptyText={`Nothing in ${tab.label} yet.`}
      />
      {adding && <AddContent tab={tab} queryKey={queryKey} onClose={() => setAdding(false)} />}
    </>
  );
}

function TestimonialDialog({ item, onClose }) {
  const form = useFormState({ full_name: item?.full_name || "", credentials: item?.credentials || "", testimony: item?.testimony || "" });
  const save = useSave({ success: item ? "Testimonial updated" : "Testimonial added", invalidate: "adminTestimonials", onDone: onClose });
  const submit = () => {
    if (form.validate(["full_name", "credentials", "testimony"])) save.run(() => (item ? updateTestimonial({ id: item.id, ...form.values }) : createTestimonial(form.values)));
  };
  return (
    <Modal
      open
      onClose={onClose}
      title={item ? "Edit testimonial" : "Add testimonial"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={save.saving} onClick={submit}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <TextField form={form} name="full_name" label="Name" required />
        <TextField form={form} name="credentials" label="Credentials" required hint="For example: Class of 2015, Civil Engineering" />
        <TextArea form={form} name="testimony" label="Testimonial" required />
        {save.error && <p className="text-sm text-rose-600">{save.error}</p>}
      </div>
    </Modal>
  );
}

function TestimonialsTab() {
  const [dialog, setDialog] = useState(null);
  return (
    <>
      <ResourceList
        bare
        title="Testimonials"
        queryKey="adminTestimonials"
        loadsAll
        searchIn={(t) => [t.full_name, t.credentials, t.testimony]}
        fetch={async () => {
          const r = await getAllTestimonial({ pageNumber: 1, pageSize: 200 });
          const rows = Array.isArray(r.data) ? r.data : [];
          return { rows, total: rows.length };
        }}
        columns={[
          { header: "Person", cell: (t) => <Lead title={t.full_name} sub={t.credentials} /> },
          { header: "Testimonial", cell: (t) => <p className="line-clamp-2 max-w-xl">{t.testimony}</p> },
        ]}
        createLabel="Add testimonial"
        onCreate={() => setDialog({})}
        onEdit={(t) => setDialog({ item: t })}
        remove={deleteTestimonial}
        nameOf={(t) => `${t.full_name}'s testimonial`}
        emptyIcon={GlobeAltIcon}
        emptyText="Add a quote from a graduate."
      />
      {dialog && <TestimonialDialog item={dialog.item} onClose={() => setDialog(null)} />}
    </>
  );
}

export default function WebContentPage() {
  const [tab, setTab] = useState("slideshow");
  const current = TABS.find((t) => t.key === tab);
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Website content" subtitle="What visitors see on your public site." />
      <div className="mt-4">
        <Tabs value={tab} onChange={setTab} tabs={[...TABS.map((t) => ({ value: t.key, label: t.label })), { value: "testimonials", label: "Testimonials" }]} />
      </div>
      <div className="mt-5">{current ? <ContentTab key={tab} tab={current} /> : <TestimonialsTab />}</div>
    </div>
  );
}
