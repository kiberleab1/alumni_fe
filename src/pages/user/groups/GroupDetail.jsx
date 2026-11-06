import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, LockClosedIcon, MapPinIcon, RectangleGroupIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MapPinIcon as PinSolid } from "@heroicons/react/24/solid";
import { createGroupPost, deleteGroupPost, getGroup, getGroupMembers, getGroupPosts, pinGroupPost, respondGroupRequest, setGroupMembership } from "src/api";
import { useSocketEvent } from "src/lib/realtime";
import { PATHS, chatPath } from "src/lib/nav";
import { Avatar, Button, Card, EmptyState, Pill, SearchInput, SkeletonRow, Spinner, Tabs, apiError, cx, inputClass, timeAgo } from "src/components/ui";
import { KIND } from "./GroupsPage";

function Composer({ groupId }) {
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const post = useMutation(createGroupPost, {
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries(["groupPosts", groupId]);
    },
    onError: (e) => toast.error(apiError(e)),
  });
  return (
    <Card className="p-4">
      <label htmlFor="group-post" className="sr-only">
        Write a post
      </label>
      <textarea id="group-post" rows={3} value={body} maxLength={4000} onChange={(e) => setBody(e.target.value)} placeholder="Share news, ask a question or plan a meetup…" className={inputClass} />
      <div className="mt-2 flex justify-end">
        <Button disabled={!body.trim()} loading={post.isLoading} onClick={() => post.mutate({ id: groupId, body })}>
          Post
        </Button>
      </div>
    </Card>
  );
}

function Posts({ group }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery(["groupPosts", group.id], () => getGroupPosts({ id: group.id }), { retry: false });
  useSocketEvent("group:post", (e) => e.group_id === String(group.id) && queryClient.invalidateQueries(["groupPosts", group.id]));
  const refresh = () => queryClient.invalidateQueries(["groupPosts", group.id]);
  const remove = useMutation(deleteGroupPost, { onSuccess: refresh, onError: (e) => toast.error(apiError(e)) });
  const pin = useMutation(pinGroupPost, { onSuccess: refresh, onError: (e) => toast.error(apiError(e)) });

  if (isError) {
    return (
      <Card>
        <EmptyState icon={LockClosedIcon} title="This group is private" description={apiError(error)} />
      </Card>
    );
  }
  if (isLoading) {
    return (
      <Card>
        <SkeletonRow />
        <SkeletonRow />
      </Card>
    );
  }
  if (!data?.items?.length) {
    return (
      <Card>
        <EmptyState icon={ChatBubbleLeftRightIcon} title="No posts yet" description={group.can_post ? "Start the conversation." : "Join the group to post."} />
      </Card>
    );
  }
  return (
    <ul className="space-y-3">
      {data.items.map((p) => (
        <li key={p.id}>
          <Card className={cx("p-4", p.pinned && "border-brand")}>
            <div className="flex items-start gap-3">
              <Avatar name={p.author.name} photo={p.author.photo} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{p.author.name}</p>
                  {p.author.graduation_year && <span className="text-xs text-slate-500">Class of {p.author.graduation_year}</span>}
                  <span className="text-xs text-slate-400">· {timeAgo(p.created_at)}</span>
                  {p.pinned && (
                    <Pill tone="brand">
                      <PinSolid className="h-3 w-3" /> Pinned
                    </Pill>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-line break-words text-sm text-slate-800">{p.body}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                {group.can_moderate && (
                  <button onClick={() => pin.mutate({ id: group.id, postId: p.id, pinned: !p.pinned })} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={p.pinned ? "Unpin post" : "Pin post"}>
                    <MapPinIcon className="h-4 w-4" />
                  </button>
                )}
                {p.can_delete && (
                  <button
                    onClick={() => window.confirm("Delete this post?") && remove.mutate({ id: group.id, postId: p.id })}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Delete post"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function Members({ group, status = "active" }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery(["groupMembers", group.id, status, search], () => getGroupMembers({ id: group.id, status, search }), { keepPreviousData: true });
  const respond = useMutation(respondGroupRequest, {
    onSuccess: (_, v) => {
      toast.success(v.approve ? "Member approved" : "Request declined");
      queryClient.invalidateQueries(["groupMembers", group.id]);
      queryClient.invalidateQueries(["group", group.id]);
    },
    onError: (e) => toast.error(apiError(e)),
  });
  return (
    <Card className="p-4">
      {status === "active" && <SearchInput value={search} onChange={setSearch} placeholder="Search members" className="mb-3" />}
      {isLoading ? (
        <SkeletonRow />
      ) : !data?.items?.length ? (
        <p className="py-6 text-center text-sm text-slate-500">{status === "pending" ? "No pending requests." : "No members found."}</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {data.items.map((m) => (
            <li key={m.user.id} className="flex items-center gap-3 py-3">
              <Avatar name={m.user.name} photo={m.user.photo} size="sm" online={m.user.online} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {m.user.name} {m.role === "admin" && <Pill tone="brand">Admin</Pill>}
                </p>
                <p className="truncate text-xs text-slate-500">{[m.user.department_name, m.user.graduation_year && `Class of ${m.user.graduation_year}`].filter(Boolean).join(" · ")}</p>
              </div>
              {status === "pending" ? (
                <>
                  <Button size="sm" onClick={() => respond.mutate({ id: group.id, userId: m.user.id, approve: true })}>
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => respond.mutate({ id: group.id, userId: m.user.id, approve: false })}>
                    Decline
                  </Button>
                </>
              ) : m.connection_state === "connected" ? (
                <Button size="sm" variant="secondary" onClick={() => navigate(chatPath(m.user.id), { state: { peer: m.user } })}>
                  Message
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** One group: posts, members, join requests (design board 11, group view). */
export default function GroupDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("posts");
  const { data: group, isLoading, isError } = useQuery(["group", id], () => getGroup(id), { retry: false });
  const membership = useMutation((join) => setGroupMembership({ id, join }), {
    onSuccess: (g) => {
      queryClient.setQueryData(["group", id], g);
      queryClient.invalidateQueries("groups");
      queryClient.invalidateQueries(["groupPosts", id]);
      toast.success(g.my_status === "active" ? `Welcome to ${g.name}` : g.my_status === "pending" ? "Request sent to the group admins" : "You left the group");
    },
    onError: (e) => toast.error(apiError(e)),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <Spinner />
      </div>
    );
  }
  if (isError || !group) {
    return (
      <Card className="ui-scope mx-auto max-w-2xl">
        <EmptyState icon={RectangleGroupIcon} title="Group not found" action={<Link to={PATHS.groups} className="font-semibold text-link">Back to Groups</Link>} />
      </Card>
    );
  }
  const K = KIND[group.kind] || KIND.interest;
  const tabs = [
    { value: "posts", label: "Posts" },
    { value: "members", label: "Members", count: group.member_count },
    ...(group.can_moderate ? [{ value: "requests", label: "Requests", count: group.pending_requests }] : []),
  ];

  return (
    <div className="ui-scope mx-auto max-w-5xl">
      <Link to={PATHS.groups} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
        <ArrowLeftIcon className="h-4 w-4" /> Groups
      </Link>
      <Card className="mb-5 overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-brand to-accent" />
        <div className="flex flex-wrap items-end gap-4 px-5 pb-5">
          {/* only the icon overlaps the cover; the name stays on white */}
          <span className="relative -mt-8 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-link shadow ring-1 ring-slate-200">
            <K.icon className="h-8 w-8" />
          </span>
          <div className="min-w-0 flex-1 pt-3">
            <h1 className="text-xl font-bold text-slate-900">{group.name}</h1>
            <p className="text-sm text-slate-500">
              {K.label} group · {group.privacy === "private" ? "Private" : "Open"} · {group.member_count} member{group.member_count === 1 ? "" : "s"}
            </p>
          </div>
          {group.my_status === "active" ? (
            <Button variant="secondary" loading={membership.isLoading} onClick={() => window.confirm(`Leave ${group.name}?`) && membership.mutate(false)}>
              Leave group
            </Button>
          ) : group.my_status === "pending" ? (
            <Button variant="secondary" loading={membership.isLoading} onClick={() => membership.mutate(false)}>
              Cancel request
            </Button>
          ) : (
            <Button loading={membership.isLoading} onClick={() => membership.mutate(true)}>
              {group.privacy === "private" ? "Ask to join" : "Join group"}
            </Button>
          )}
        </div>
        {group.description && <p className="border-t border-slate-100 px-5 py-4 text-sm text-slate-700">{group.description}</p>}
      </Card>

      <Tabs className="mb-4" value={tab} onChange={setTab} tabs={tabs} />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {tab === "posts" && (
            <>
              {group.can_post && <Composer groupId={group.id} />}
              <Posts group={group} />
            </>
          )}
          {tab === "members" && <Members group={group} />}
          {tab === "requests" && <Members group={group} status="pending" />}
        </div>
        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900">About</h2>
            <dl className="mt-2 space-y-1 text-sm text-slate-600">
              <div>{group.automatic ? "Created automatically from alumni profiles." : `Created ${timeAgo(group.created_at)}.`}</div>
              {group.last_post_at && <div>Last post {timeAgo(group.last_post_at)}.</div>}
            </dl>
            {group.admins?.length > 0 && (
              <>
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Admins</h3>
                <ul className="mt-2 space-y-2">
                  {group.admins.map((a) => (
                    <li key={a.id} className="flex items-center gap-2 text-sm text-slate-800">
                      <Avatar name={a.name} photo={a.photo} size="xs" /> {a.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
