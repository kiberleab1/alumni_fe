/** Admin screens for people: alumni, users, admins and staff. */
import { useQuery } from "react-query";
import { AcademicCapIcon, IdentificationIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";
import { createAddress, createAInstituteAdmin, createStaff, deleteAdmin, deleteStaff, getAllAlumni, getAllinstituteAdmins, getAllStaff, getRoleByName, getRoles, updateAddress, updateAdmin, updateStaff } from "src/api";
import { Avatar, Pill } from "src/components/ui";
import { ADDRESS_BLANK, ADDRESS_REQUIRED, AddressSection, FormScreen, FormSection, ImagesField, Lead, ResourceList, SelectField, SocialSection, TextArea, TextField, buildContact, compact, dateInput, fmtDate, fullName, parseContact, pickAddress, useDepartments, useFormState, useInstitutes, useLoadAddress, useSave, useSession } from "../kit";

const Person = ({ name, sub }) => (
  <div className="flex min-w-0 items-center gap-3">
    <Avatar name={name} size="sm" />
    <Lead title={name} sub={sub} />
  </div>
);

async function fetchByRole(roleName, page, size) {
  const role = await getRoleByName({ name: roleName });
  const r = await getAllinstituteAdmins({ pageNumber: page, pageSize: size, value: role.data.id });
  return { rows: r.data.users || [], total: r.data.total_items || 0 };
}

const PERSON_COLUMNS = [
  { header: "Name", cell: (u) => <Person name={fullName(u)} sub={u.email} /> },
  { header: "Phone", cell: (u) => u.phone_number || "—" },
  { header: "Institute", cell: (u) => u.institute_name || "—" },
  { header: "Joined", cell: (u) => fmtDate(u.createdAt || u.createdat) },
];

export function UsersPage({ go }) {
  return <ResourceList title="Users" subtitle="Member accounts on the alumni network." queryKey="adminUsers" fetch={(p, s) => fetchByRole("alumni", p, s)} columns={PERSON_COLUMNS} createLabel="Add user" onCreate={() => go("Create User")} onEdit={(u) => go("Edit User", u)} remove={deleteAdmin} nameOf={fullName} emptyIcon={UsersIcon} emptyText="Accounts appear here when members sign up." />;
}
export function AdminsPage({ go }) {
  return <ResourceList title="Admins" subtitle="People who can manage an institute." queryKey="adminAdmins" fetch={(p, s) => fetchByRole("admin", p, s)} columns={PERSON_COLUMNS} createLabel="Add admin" onCreate={() => go("Create Admin")} onEdit={(u) => go("Edit Admin", u)} remove={deleteAdmin} nameOf={fullName} emptyIcon={UserGroupIcon} emptyText="Add the first admin for an institute." />;
}

const STATUS_TONE = { approved: "green", active: "green", verified: "green", pending: "amber", rejected: "rose" };
export function AlumniPage() {
  return (
    <ResourceList
      title="Alumni"
      subtitle="Graduate profiles across your institutes."
      queryKey="adminAlumni"
      fetch={async (p, s) => {
        const r = await getAllAlumni({ pageNumber: p, pageSize: s });
        return { rows: r.data.alumniProfile || [], total: r.data.total_items || 0 };
      }}
      columns={[
        { header: "Name", cell: (a) => <Person name={a.user_data?.name || "Unknown"} sub={a.user_data?.email} /> },
        { header: "Institute", cell: (a) => a.institute_name || "—" },
        { header: "Department", cell: (a) => a.department_name || "—" },
        { header: "Class of", cell: (a) => (a.graduation_year ? new Date(a.graduation_year).getFullYear() || a.graduation_year : "—") },
        { header: "Status", cell: (a) => (a.status ? <Pill tone={STATUS_TONE[String(a.status).toLowerCase()] || "slate"}>{a.status}</Pill> : "—") },
      ]}
      emptyIcon={AcademicCapIcon}
      emptyText="Profiles appear here when graduates complete sign-up."
    />
  );
}

/* ---- person form: one screen instead of three separately saved sections */

const PERSON_BLANK = { email: "", first_name: "", middle_name: "", last_name: "", phone_number: "", password: "", gender: "", date_of_birth: "", role_id: "", institute_id: "" };

function PersonForm({ record, go, kind, listPage, fixedRole }) {
  const editing = Boolean(record);
  const session = useSession();
  const blankBirth = Object.fromEntries(Object.entries(ADDRESS_BLANK).map(([k, v]) => [`birth_${k}`, v]));
  const form = useFormState(
    editing
      ? { ...PERSON_BLANK, ...ADDRESS_BLANK, ...blankBirth, email: record.email || "", first_name: record.first_name || "", middle_name: record.middle_name || "", last_name: record.last_name || "", phone_number: record.phone_number || "", gender: record.gender || "", date_of_birth: dateInput(record.date_of_birth) }
      : { ...PERSON_BLANK, ...ADDRESS_BLANK, ...blankBirth, institute_id: session.instituteId },
  );
  useLoadAddress(record?.address_id, form);
  useLoadAddress(record?.birth_place_id, form, "birth_");
  const { data: institutes = [] } = useInstitutes();
  const { data: roles = [] } = useQuery(
    ["adminRoleOptions", fixedRole],
    async () => {
      if (fixedRole) {
        const r = await getRoleByName({ name: fixedRole });
        return [{ value: r.data.id, label: fixedRole }];
      }
      const r = await getRoles({ pageNumber: 1, pageSize: 50 });
      return Object.values(r.data.role || {}).map((x) => ({ value: x.id, label: x.role_name }));
    },
    { enabled: !editing },
  );
  const save = useSave({ success: editing ? `${kind} updated` : `${kind} created`, invalidate: ["adminUsers", "adminAdmins", "adminMembers"], onDone: () => go(listPage) });

  const submit = (e) => {
    e.preventDefault();
    const v = form.values;
    const required = ["first_name", "last_name", "phone_number"];
    // seeded accounts can lack these, which mustn't block editing other fields
    if (!editing || record.address_id) required.push(...ADDRESS_REQUIRED);
    if (!editing || record.birth_place_id) required.push(...ADDRESS_REQUIRED.map((k) => `birth_${k}`));
    if (!editing) required.push("gender", "date_of_birth", "email", "password", "institute_id");
    if (!editing && !fixedRole) required.push("role_id");
    if (!form.validate(required)) return save.setError("Please fill in the highlighted fields.");
    save.run(async () => {
      const person = { first_name: v.first_name, middle_name: v.middle_name, last_name: v.last_name, phone_number: v.phone_number, ...compact({ gender: v.gender, date_of_birth: v.date_of_birth }) };
      if (editing) {
        await Promise.all([record.address_id && updateAddress({ id: record.address_id, ...pickAddress(v) }), record.birth_place_id && updateAddress({ id: record.birth_place_id, ...pickAddress(v, "birth_") })]);
        await updateAdmin({ id: record.id, ...person });
      } else {
        const toApi = (a) => ({ ...a, houseNumber: a.house_number });
        const [home, birth] = await Promise.all([createAddress(toApi(pickAddress(v))), createAddress(toApi(pickAddress(v, "birth_")))]);
        await createAInstituteAdmin({ ...person, email: v.email, password: v.password, role_id: fixedRole ? roles[0]?.value : v.role_id, institute_id: v.institute_id, address_id: home.data.id, birth_place_id: birth.data.id });
      }
    });
  };
  return (
    <FormScreen title={`${editing ? "Edit" : "Add"} ${kind.toLowerCase()}`} subtitle={editing ? fullName(record) : `Create a new ${kind.toLowerCase()} account.`} backLabel={listPage} onBack={() => go(listPage)} onSubmit={submit} saving={save.saving} error={save.error} submitLabel={editing ? "Save changes" : `Create ${kind.toLowerCase()}`}>
      <FormSection title="Personal details">
        <TextField form={form} name="first_name" label="First name" required />
        <TextField form={form} name="middle_name" label="Middle name" />
        <TextField form={form} name="last_name" label="Last name" required />
        <SelectField form={form} name="gender" label="Gender" required={!editing} options={["Male", "Female"]} />
        <TextField form={form} name="date_of_birth" label="Date of birth" type="date" required={!editing} max={new Date().toISOString().slice(0, 10)} />
        <TextField form={form} name="phone_number" label="Phone number" type="tel" required />
      </FormSection>
      <FormSection title="Account" hint={editing ? "Email, role and institute can't be changed here." : undefined}>
        <TextField form={form} name="email" label="Email" type="email" required={!editing} disabled={editing} autoComplete="off" />
        {!editing && (
          <>
            <TextField form={form} name="password" label="Temporary password" type="password" required autoComplete="new-password" hint="At least 8 characters. Ask them to change it after signing in." />
            {!fixedRole && <SelectField form={form} name="role_id" label="Role" required options={roles} />}
            <SelectField form={form} name="institute_id" label="Institute" required options={institutes} />
          </>
        )}
      </FormSection>
      {(!editing || record.address_id) && <AddressSection form={form} title="Home address" />}
      {(!editing || record.birth_place_id) && <AddressSection form={form} prefix="birth_" title="Place of birth" />}
    </FormScreen>
  );
}
export const UserForm = (p) => <PersonForm {...p} kind="User" listPage="Members" fixedRole="alumni" />;
export const AdminForm = (p) => <PersonForm {...p} kind="Admin" listPage="Admins" />;

/* --------------------------------------------------------------- staff */

export function StaffPage({ go }) {
  return (
    <ResourceList
      title="Staff"
      subtitle="Faculty and team shown on your institute's pages."
      queryKey="adminStaff"
      fetch={async (p, s) => {
        const r = await getAllStaff({ pageNumber: p, pageSize: s });
        return { rows: r.data.staff || [], total: r.data.total_items || 0 };
      }}
      columns={[
        { header: "Name", cell: (s) => <Person name={s.full_name || "Unnamed"} sub={s.title} /> },
        { header: "Email", cell: (s) => s.email || "—" },
        { header: "Phone", cell: (s) => s.phone_number || "—" },
        { header: "Department", cell: (s) => s.department_name || "—" },
        { header: "Institute", cell: (s) => s.institute_name || "—" },
      ]}
      createLabel="Add staff"
      onCreate={() => go("Create Staff")}
      onEdit={(s) => go("Edit Staff", s)}
      remove={deleteStaff}
      nameOf={(s) => s.full_name || "Staff member"}
      emptyIcon={IdentificationIcon}
      emptyText="Add faculty and team members."
    />
  );
}

export function StaffForm({ record, go }) {
  const editing = Boolean(record);
  const session = useSession();
  const contact = parseContact(record?.contact_info);
  const form = useFormState({ ...ADDRESS_BLANK, full_name: record?.full_name || "", title: record?.title || "", email: record?.email || "", phone_number: record?.phone_number || "", description: record?.description || "", institute_id: record?.institute_id || session.instituteId, department_id: record?.department_id || "", telegram: contact.telegram || "", twitter: contact.twitter || "", linkedin: contact.linkedin || "", facebook: contact.facebook || "", image: [] });
  useLoadAddress(record?.address_id, form);
  const { data: institutes = [] } = useInstitutes();
  const { data: departments = [] } = useDepartments();
  const inInstitute = departments.filter((d) => !form.values.institute_id || d.institute === form.values.institute_id);
  const save = useSave({ success: editing ? "Staff updated" : "Staff added", invalidate: "adminStaff", onDone: () => go("Staff") });

  const submit = (e) => {
    e.preventDefault();
    if (!form.validate(["full_name", "title", "description", "institute_id", "department_id", ...(!editing || record.address_id ? ADDRESS_REQUIRED : [])])) return save.setError("Please fill in the highlighted fields.");
    const v = form.values;
    if (!editing && !v.image.length) return save.setError("Please add a photo.");
    save.run(async () => {
      const body = compact({ full_name: v.full_name, title: v.title, email: v.email, phone_number: v.phone_number, description: v.description, institute_id: v.institute_id, department_id: v.department_id, contact_info: buildContact(v) });
      if (editing) {
        if (record.address_id) await updateAddress({ id: record.address_id, ...pickAddress(v) });
        await updateStaff({ id: record.id, address_id: record.address_id, ...body });
      } else {
        const a = pickAddress(v);
        const address = await createAddress({ ...a, houseNumber: a.house_number });
        await createStaff({ ...body, address_id: address.data.id, image: v.image[0] });
      }
    });
  };
  return (
    <FormScreen title={editing ? "Edit staff member" : "Add staff member"} subtitle={record?.full_name} backLabel="Staff" onBack={() => go("Staff")} onSubmit={submit} saving={save.saving} error={save.error} submitLabel={editing ? "Save changes" : "Add staff member"}>
      <FormSection title="Details">
        <TextField form={form} name="full_name" label="Full name" required />
        <TextField form={form} name="title" label="Job title" required />
        <TextField form={form} name="email" label="Email" type="email" />
        <TextField form={form} name="phone_number" label="Phone number" type="tel" />
        <SelectField form={form} name="institute_id" label="Institute" required options={institutes} />
        <SelectField form={form} name="department_id" label="Department" required options={inInstitute} />
        <TextArea form={form} name="description" label="Short bio" required className="sm:col-span-2" />
        {!editing && <ImagesField label="Photo *" hint="JPG or PNG, up to 5 MB." multiple={false} files={form.values.image} onChange={(f) => form.set("image", f)} className="sm:col-span-2" />}
      </FormSection>
      {(!editing || record.address_id) && <AddressSection form={form} />}
      <SocialSection form={form} />
    </FormScreen>
  );
}
