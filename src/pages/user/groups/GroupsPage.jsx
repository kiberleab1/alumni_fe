import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { AcademicCapIcon, BuildingLibraryIcon, LockClosedIcon, PlusIcon, RectangleGroupIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { createGroup, getGroups, setGroupMembership } from "src/api";
import { groupPath } from "src/lib/nav";
import { Button, Card, Chips, EmptyState, Field, Modal, PageHeader, Pill, SearchInput, Segmented, SkeletonRow, Tabs, apiError, inputClass, timeAgo } from "src/components/ui";

export const KIND = {
  class: { label: "Class", icon: AcademicCapIcon, tone: "brand" },
  department: { label: "Department", icon: BuildingLibraryIcon, tone: "green" },
  interest: { label: "Interest", icon: SparklesIcon, tone: "amber" },
};

function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function CreateGroup({ open, onClose }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", description: "", privacy: "open" });
  const [error, setError] = useState(null);
  const create = useMutation(createGroup, {
    onSuccess: (g) => {
      queryClient.invalidateQueries("groups");
      toast.success("Group created");
      onClose();
      navigate(groupPath(g.id));
    },
    onError: (e) => setError(apiError(e)),
  });
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a group"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={create.isLoading} disabled={form.name.trim().length < 3} onClick={() => create.mutate(form)}>
            Create group
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" htmlFor="g-name" hint="e.g. Addis Ababa chapter, Women in Tech, Class of 2015 football">
          <input id="g-name" className={inputClass} value={form.name} maxLength={80} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
        </Field>
        <Field label="What's it about?" htmlFor="g-desc">
          <textarea id="g-desc" rows={3} className={inputClass} value={form.description} maxLength={1000} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Who can join" hint={form.privacy === "open" ? "Anyone in your institute can join and read posts." : "People ask to join; you approve them. Posts are hidden from non-members."}>
          <Segmented
            value={form.privacy}
            onChange={(v) => setForm({ ...form, privacy: v })}
            label="Who can join"
            options={[
              { value: "open", label: "Open" },
              { value: "private", label: "Private" },
            ]}
          />
        </Field>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
      </div>
    </Modal>
  );
}

export function GroupCard({ g, onJoin, joining }) {
  const K = KIND[g.kind] || KIND.interest;
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-link">
          <K.icon className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <Link to={groupPath(g.id)} className="font-semibold text-slate-900 hover:underline">
            {g.name}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Pill tone={K.tone}>{K.label}</Pill>
            {g.privacy === "private" && (
              <Pill>
                <LockClosedIcon className="h-3 w-3" /> Private
              </Pill>
            )}
          </div>
        </div>
      </div>
      {g.description && <p className="mt-3 line-clamp-2 text-sm text-slate-600">{g.description}</p>}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <p className="text-xs text-slate-500">
          {g.member_count} member{g.member_count === 1 ? "" : "s"}
          {g.last_post_at ? ` · active ${timeAgo(g.last_post_at)}` : ""}
        </p>
        {g.my_status === "active" ? (
          <Link to={groupPath(g.id)} className="text-sm font-semibold text-link hover:underline">
            Open
          </Link>
        ) : g.my_status === "pending" ? (
          <Pill tone="amber">Requested</Pill>
        ) : (
          <Button size="sm" onClick={() => onJoin(g)} loading={joining}>
            {g.privacy === "private" ? "Ask to join" : "Join"}
          </Button>
        )}
      </div>
    </Card>
  );
}

/** Groups & class pages (design board 11). */
export default function GroupsPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "mine";
  const [kind, setKind] = useState("");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const q = useDebounced(search);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["groups", tab, kind, q], () => getGroups({ tab, kind, search: q }), { keepPreviousData: true });
  const join = useMutation((g) => setGroupMembership({ id: g.id, join: true }), {
    onSuccess: (g) => {
      toast.success(g.my_status === "pending" ? "Request sent to the group admins" : `You joined ${g.name}`);
      queryClient.invalidateQueries("groups");
    },
    onError: (e) => toast.error(apiError(e)),
  });
  const items = data?.items || [];

  return (
    <div className="ui-scope mx-auto max-w-6xl">
      <PageHeader
        title="Groups"
        subtitle="Your class, your department and the communities you choose."
        actions={
          <Button onClick={() => setCreating(true)}>
            <PlusIcon className="h-4 w-4" /> Create group
          </Button>
        }
      />
      <Tabs
        className="mb-4"
        value={tab}
        onChange={(v) => setParams(v === "mine" ? {} : { tab: v })}
        tabs={[
          { value: "mine", label: "My groups", count: data?.counts?.mine },
          { value: "discover", label: "Discover" },
        ]}
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search groups" className="sm:w-72" />
        <Chips
          value={kind}
          onChange={setKind}
          label="Group type"
          options={[
            { value: "", label: "All" },
            { value: "class", label: "Class" },
            { value: "department", label: "Department" },
            { value: "interest", label: "Interest" },
          ]}
        />
      </div>
      {isLoading ? (
        <Card>
          <SkeletonRow />
          <SkeletonRow />
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={RectangleGroupIcon}
            title={tab === "mine" ? "You're not in any groups yet" : "No groups to discover"}
            description={tab === "mine" ? "Add your graduation year and department to your profile to join your class and department automatically, or browse Discover." : "Be the first: create a group for your city, industry or hobby."}
            action={tab === "mine" ? <Button variant="secondary" onClick={() => setParams({ tab: "discover" })}>Discover groups</Button> : <Button onClick={() => setCreating(true)}>Create group</Button>}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <GroupCard key={g.id} g={g} onJoin={(x) => join.mutate(x)} joining={join.isLoading && join.variables?.id === g.id} />
          ))}
        </div>
      )}
      <CreateGroup open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}
