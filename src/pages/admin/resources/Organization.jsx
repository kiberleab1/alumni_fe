/** Admin screens for institutions and departments. */
import { AdjustmentsHorizontalIcon, BuildingLibraryIcon, TagIcon } from "@heroicons/react/24/outline";
import { createAddress, createDepartment, createInstitute, deleteDepartment, deleteInstitute, editDepartent, getDepartments, getInstitutes, updateAddress, updateInstitute } from "src/api";
import { Pill } from "src/components/ui";
import { ADDRESS_BLANK, ADDRESS_REQUIRED, AddressSection, FormScreen, FormSection, Lead, ResourceList, SelectField, SocialSection, TextArea, TextField, buildContact, compact, dateInput, fmtDate, parseContact, pickAddress, useFormState, useInstitutes, useLoadAddress, useSave, useSession } from "../kit";

const count = (v) => (v == null || v === "" ? "—" : Number(v).toLocaleString());

export function InstitutionsPage({ go }) {
  return (
    <ResourceList
      title="Institutions"
      subtitle="Every school on the platform."
      queryKey="adminInstitutes"
      fetch={async (p, s) => {
        const r = await getInstitutes({ pageNumber: p, pageSize: s });
        return { rows: Object.values(r.data.institute || {}), total: r.data.total_items || 0 };
      }}
      columns={[
        { header: "Institution", cell: (i) => <Lead title={i.name} sub={i.email} /> },
        { header: "Type", cell: (i) => (i.type ? <Pill>{i.type}</Pill> : "—") },
        { header: "President", cell: (i) => i.president_name || "—" },
        { header: "Students", cell: (i) => count(i.number_of_students) },
        { header: "Alumni", cell: (i) => count(i.number_of_alumni) },
        { header: "Founded", cell: (i) => (i.starting_year ? new Date(i.starting_year).getFullYear() : "—") },
      ]}
      createLabel="Add institution"
      onCreate={() => go("Create Institute")}
      onEdit={(i) => go("Edit Institute", i)}
      actions={(i) => (
        <button type="button" onClick={() => go("Institute Settings", { id: i.id })} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label={`Settings for ${i.name}`} title="Features, website and admin permissions">
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </button>
      )}
      remove={(i) => deleteInstitute({ address_id: i.address_id, institute_id: i.id })}
      nameOf={(i) => i.name}
      emptyIcon={BuildingLibraryIcon}
      emptyText="Add the first institution."
    />
  );
}

export function InstituteForm({ record, go }) {
  const editing = Boolean(record);
  const c = parseContact(record?.contact_info);
  const form = useFormState({ ...ADDRESS_BLANK, name: record?.name || "", sub_url: record?.sub_url || "", starting_year: dateInput(record?.starting_year), description: record?.description || "", website: record?.website || "", type: record?.type || "", accreditations: record?.accreditations || "", number_of_students: record?.number_of_students ?? "", number_of_alumni: record?.number_of_alumni ?? "", president_name: record?.president_name || "", email: record?.email || "", phone_number: record?.phone_number || "", telegram: c.telegram || "", twitter: c.twitter || "", linkedin: c.linkedin || "", facebook: c.facebook || "" });
  useLoadAddress(record?.address_id, form);
  const save = useSave({ success: editing ? "Institution updated" : "Institution created", invalidate: ["adminInstitutes", "adminInstituteOptions"], onDone: () => go("Institutions") });

  const submit = (e) => {
    e.preventDefault();
    const required = ["name", "description", "type", "email", "phone_number", "website", "accreditations", "president_name", "starting_year", ...(!editing || record.address_id ? ADDRESS_REQUIRED : [])];
    if (!editing) required.push("sub_url");
    if (!form.validate(required)) return save.setError("Please fill in the highlighted fields.");
    const { country, region, city, house_number, telegram, twitter, linkedin, facebook, sub_url, ...fields } = form.values;
    save.run(async () => {
      const body = compact({ ...fields, contact_info: buildContact(form.values) });
      if (editing) {
        if (record.address_id) await updateAddress({ id: record.address_id, ...pickAddress(form.values) });
        await updateInstitute({ id: record.id, ...body });
      } else {
        const a = pickAddress(form.values);
        const address = await createAddress({ ...a, houseNumber: a.house_number });
        await createInstitute({ ...body, sub_url, address_id: address.data.id });
      }
    });
  };
  return (
    <FormScreen title={editing ? "Edit institution" : "Add institution"} subtitle={record?.name} backLabel="Institutions" onBack={() => go("Institutions")} onSubmit={submit} saving={save.saving} error={save.error} submitLabel={editing ? "Save changes" : "Create institution"}>
      <FormSection title="About">
        <TextField form={form} name="name" label="Name" required className="sm:col-span-2" />
        {!editing && <TextField form={form} name="sub_url" label="Web address" required hint="Lowercase letters and hyphens, e.g. abay-college" />}
        <SelectField form={form} name="type" label="Type" required options={["University", "College", "TVET"]} />
        <TextField form={form} name="starting_year" label="Founded on" type="date" required />
        <TextField form={form} name="president_name" label="President" required />
        <TextField form={form} name="accreditations" label="Accreditations" required />
        <TextField form={form} name="number_of_students" label="Number of students" type="number" min="0" />
        <TextField form={form} name="number_of_alumni" label="Number of alumni" type="number" min="0" />
        <TextArea form={form} name="description" label="Description" required className="sm:col-span-2" />
      </FormSection>
      <FormSection title="Contact">
        <TextField form={form} name="email" label="Email" type="email" required />
        <TextField form={form} name="phone_number" label="Phone number" type="tel" required />
        <TextField form={form} name="website" label="Website" type="url" required className="sm:col-span-2" placeholder="https://" />
      </FormSection>
      {(!editing || record.address_id) && <AddressSection form={form} />}
      <SocialSection form={form} />
    </FormScreen>
  );
}

export function DepartmentsPage({ go }) {
  return (
    <ResourceList
      title="Departments"
      subtitle="Academic departments within each institute."
      queryKey="adminDepartments"
      fetch={async (p, s) => {
        const r = await getDepartments({ pageNumber: p, pageSize: s });
        return { rows: r.data.department || [], total: r.data.total_items || 0 };
      }}
      columns={[
        { header: "Department", cell: (d) => <Lead title={d.name} sub={d.email} /> },
        { header: "Head", cell: (d) => d.head_of_department || "—" },
        { header: "Phone", cell: (d) => d.phone_number || "—" },
        { header: "Institute", cell: (d) => d.institute_name || "—" },
        { header: "Created", cell: (d) => fmtDate(d.createdAt || d.createdat) },
      ]}
      createLabel="Add department"
      onCreate={() => go("Create Department")}
      onEdit={(d) => go("Edit Department", d)}
      remove={deleteDepartment}
      nameOf={(d) => d.name}
      emptyIcon={TagIcon}
      emptyText="Add the first department."
    />
  );
}

export function DepartmentForm({ record, go }) {
  const editing = Boolean(record);
  const session = useSession();
  const c = parseContact(record?.contact_info);
  const form = useFormState({ name: record?.name || "", description: record?.description || "", institute_id: record?.institute_id || session.instituteId, head_of_department: record?.head_of_department || "", email: record?.email || "", phone_number: record?.phone_number || "", telegram: c.telegram || "", twitter: c.twitter || "", linkedin: c.linkedin || "", facebook: c.facebook || "" });
  const { data: institutes = [] } = useInstitutes();
  const save = useSave({ success: editing ? "Department updated" : "Department created", invalidate: ["adminDepartments", "adminDepartmentOptions"], onDone: () => go("Departments") });

  const submit = (e) => {
    e.preventDefault();
    if (!form.validate(["name", "description", "institute_id", "head_of_department"])) return save.setError("Please fill in the highlighted fields.");
    const v = form.values;
    save.run(async () => {
      const body = compact({ name: v.name, description: v.description, institute_id: v.institute_id, head_of_department: v.head_of_department, email: v.email, phone_number: v.phone_number, contact_info: buildContact(v) });
      await (editing ? editDepartent({ id: record.id, ...body }) : createDepartment(body));
    });
  };
  return (
    <FormScreen title={editing ? "Edit department" : "Add department"} subtitle={record?.name} backLabel="Departments" onBack={() => go("Departments")} onSubmit={submit} saving={save.saving} error={save.error} submitLabel={editing ? "Save changes" : "Create department"}>
      <FormSection title="Details">
        <TextField form={form} name="name" label="Name" required />
        <SelectField form={form} name="institute_id" label="Institute" required options={institutes} />
        <TextField form={form} name="head_of_department" label="Head of department" required />
        <TextField form={form} name="email" label="Email" type="email" />
        <TextField form={form} name="phone_number" label="Phone number" type="tel" />
        <TextArea form={form} name="description" label="Description" required className="sm:col-span-2" />
      </FormSection>
      <SocialSection form={form} />
    </FormScreen>
  );
}
