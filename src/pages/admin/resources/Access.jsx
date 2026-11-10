/** Admin screens for roles and permissions; both add through a small dialog. */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { KeyIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { createNewRole, createPermission, deletePermission, deleteRole, getAllPremissions, getRoles } from "src/api";
import { Button, Field, Modal, apiError, inputClass } from "src/components/ui";
import { ResourceList, fmtDate } from "../kit";

const asRows = (list) => Object.values(list || {});

function AddDialog({ title, invalidate, submit, success, canSubmit, onClose, children }) {
  const client = useQueryClient();
  const m = useMutation(submit, {
    onSuccess: () => {
      client.invalidateQueries(invalidate);
      toast.success(success);
      onClose();
    },
    onError: (e) => toast.error(apiError(e, "Couldn't save. Try again.")),
  });
  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!canSubmit} loading={m.isLoading} onClick={() => m.mutate()}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">{children}</div>
    </Modal>
  );
}

export function RolesPage() {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  return (
    <>
      <ResourceList
        title="Roles"
        subtitle="Groups of people with the same access."
        queryKey="adminRoles"
        loadsAll
        searchIn={(r) => [r.role_name]}
        fetch={async () => {
          const rows = asRows((await getRoles({ pageNumber: 1, pageSize: 100 })).data.role);
          return { rows, total: rows.length };
        }}
        columns={[
          { header: "Role", cell: (r) => <span className="font-semibold text-slate-900">{r.role_name}</span> },
          { header: "Created", cell: (r) => fmtDate(r.createdAt) },
        ]}
        createLabel="Add role"
        onCreate={() => setAdding(true)}
        remove={deleteRole}
        nameOf={(r) => r.role_name}
        emptyIcon={ShieldCheckIcon}
        emptyText="Add the first role."
      />
      {adding && (
        <AddDialog title="Add role" invalidate="adminRoles" success="Role added" canSubmit={!!name.trim()} submit={() => createNewRole({ role_name: name.trim() })} onClose={() => (setAdding(false), setName(""))}>
          <Field label="Role name" htmlFor="role-name">
            <input id="role-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
        </AddDialog>
      )}
    </>
  );
}

export function PermissionsPage() {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const { data: roles = [] } = useQuery("adminRoleNames", async () => asRows((await getRoles({ pageNumber: 1, pageSize: 50 })).data.role));
  const close = () => {
    setAdding(false);
    setName("");
    setRole("");
  };
  return (
    <>
      <ResourceList
        title="Permissions"
        subtitle="What each role is allowed to do."
        queryKey="adminPermissions"
        loadsAll
        searchIn={(p) => [p.permission_name, p.role_name]}
        fetch={async () => {
          const rows = asRows((await getAllPremissions({ pageNumber: 1, pageSize: 100 })).data.permission);
          return { rows, total: rows.length };
        }}
        columns={[
          { header: "Permission", cell: (p) => <span className="font-semibold text-slate-900">{p.permission_name}</span> },
          { header: "Role", cell: (p) => p.role_name || "—" },
          { header: "Updated", cell: (p) => fmtDate(p.updatedAt) },
        ]}
        createLabel="Add permission"
        onCreate={() => setAdding(true)}
        remove={deletePermission}
        nameOf={(p) => p.permission_name}
        emptyIcon={KeyIcon}
        emptyText="Add the first permission."
      />
      {adding && (
        <AddDialog title="Add permission" invalidate="adminPermissions" success="Permission added" canSubmit={!!name.trim() && !!role} submit={() => createPermission({ permission_name: name.trim(), role_name: role })} onClose={close}>
          <Field label="Permission name" htmlFor="perm-name">
            <input id="perm-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
          <Field label="Role" htmlFor="perm-role">
            <select id="perm-role" className={inputClass} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.role_name}>
                  {r.role_name}
                </option>
              ))}
            </select>
          </Field>
        </AddDialog>
      )}
    </>
  );
}
