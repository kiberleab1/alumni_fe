import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { BookmarkIcon, FireIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { getImageBaseUrl, getMemberNews, setNewsSaved } from "src/api";
import { newsPath } from "src/lib/nav";
import { Button, Card, EmptyState, PageHeader, Pill, SearchInput, SkeletonRow, Tabs, apiError, cx, timeAgo } from "src/components/ui";

function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useSaveNews() {
  const queryClient = useQueryClient();
  return useMutation(setNewsSaved, {
    onSuccess: (r) => {
      toast.success(r.saved ? "Saved for later" : "Removed from saved");
      queryClient.invalidateQueries("memberNews");
      queryClient.invalidateQueries(["newsDetail", r.id]);
    },
    onError: (e) => toast.error(apiError(e)),
  });
}

function SaveButton({ story, save }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        save.mutate({ id: story.id, saved: !story.saved });
      }}
      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-link"
      aria-label={story.saved ? `Unsave ${story.title}` : `Save ${story.title}`}
      aria-pressed={story.saved}
    >
      {story.saved ? <BookmarkSolid className="h-5 w-5 text-link" /> : <BookmarkIcon className="h-5 w-5" />}
    </button>
  );
}

const Meta = ({ s }) => (
  <p className="text-xs text-slate-500">
    {timeAgo(s.created_at)} · {s.read_minutes} min read
  </p>
);

/** News (design board 9): featured story, categories, saved, most read. */
export default function NewsPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "All";
  const saved = params.get("saved") === "1";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);
  const save = useSaveNews();
  useEffect(() => setPage(1), [category, saved, q]);
  const { data, isLoading } = useQuery(["memberNews", category, saved, q, page], () => getMemberNews({ category: category === "All" ? "" : category, saved, search: q, page, pageNumber: page }), { keepPreviousData: true });

  const items = data?.items || [];
  const featured = !saved && category === "All" && !q && page === 1 ? data?.featured : null;
  const list = featured ? items.filter((i) => i.id !== featured.id) : items;
  const setFilter = (next) => setParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v)));

  return (
    <div className="ui-scope mx-auto max-w-6xl">
      <PageHeader title="News" subtitle="Stories from campus and the alumni community." actions={<SearchInput value={search} onChange={setSearch} placeholder="Search stories" className="w-64" />} />
      <Tabs
        className="mb-5"
        value={saved ? "__saved" : category}
        onChange={(v) => setFilter(v === "__saved" ? { saved: "1" } : { category: v === "All" ? null : v })}
        tabs={[{ value: "All", label: "All" }, ...(data?.categories || []).map((c) => ({ value: c, label: c })), { value: "__saved", label: "Saved" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {featured && (
            <Link to={newsPath(featured.id)} className="group block overflow-hidden rounded-theme border border-slate-200 bg-white shadow-sm">
              {featured.image && <img src={getImageBaseUrl(featured.image)} alt="" className="aspect-[16/7] w-full object-cover transition group-hover:opacity-95" />}
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Pill tone="brand">Featured</Pill>
                  <Pill>{featured.category}</Pill>
                </div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:underline">{featured.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{featured.excerpt}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Meta s={featured} />
                  <SaveButton story={featured} save={save} />
                </div>
              </div>
            </Link>
          )}

          {isLoading ? (
            <Card>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </Card>
          ) : list.length === 0 && !featured ? (
            <Card>
              <EmptyState icon={NewspaperIcon} title={saved ? "Nothing saved yet" : "No stories found"} description={saved ? "Tap the bookmark on any story to read it later." : "Try another category or search."} />
            </Card>
          ) : (
            <ul className="space-y-4">
              {list.map((s) => (
                <li key={s.id}>
                  <Link to={newsPath(s.id)} className="group flex gap-4 rounded-theme border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
                    {s.image && <img src={getImageBaseUrl(s.image)} alt="" className="hidden h-24 w-36 shrink-0 rounded-lg object-cover sm:block" />}
                    <div className="min-w-0 flex-1">
                      <Pill className="mb-1">{s.category}</Pill>
                      <h3 className="font-semibold text-slate-900 group-hover:underline">{s.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{s.excerpt}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Meta s={s} />
                        <SaveButton story={s} save={save} />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {data?.totalPage > 1 && (
            <div className="flex items-center justify-between">
              <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Newer
              </Button>
              <span className="text-sm text-slate-500">
                Page {page} of {data.totalPage}
              </span>
              <Button variant="secondary" disabled={page >= data.totalPage} onClick={() => setPage((p) => p + 1)}>
                Older
              </Button>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <Card className="p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FireIcon className="h-5 w-5 text-accent" /> Most read
            </h2>
            {data?.most_read?.length ? (
              <ol className="space-y-3">
                {data.most_read.map((m, i) => (
                  <li key={m.id} className="flex gap-3">
                    <span className="w-5 shrink-0 text-lg font-bold text-slate-300">{i + 1}</span>
                    <Link to={newsPath(m.id)} className="text-sm font-medium text-slate-800 hover:underline">
                      {m.title}
                      <span className="block text-xs font-normal text-slate-500">{m.views} reads</span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-500">Read counts show up here once members start reading.</p>
            )}
          </Card>
          <Card className={cx("p-5")}>
            <h2 className="text-sm font-semibold text-slate-900">Get the weekly digest</h2>
            <p className="mt-1 text-sm text-slate-500">Choose which updates reach your inbox in Settings.</p>
            <Link to="/user/settings?tab=notifications" className="mt-3 inline-block text-sm font-semibold text-link hover:underline">
              Email preferences →
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
