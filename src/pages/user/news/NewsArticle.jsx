import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { ArrowLeftIcon, BookmarkIcon, LinkIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { getImageBaseUrl, getNewsDetail, reactToNews } from "src/api";
import { PATHS, newsPath } from "src/lib/nav";
import { Button, Card, EmptyState, Pill, Spinner, apiError, cx, timeAgo } from "src/components/ui";
import { useSaveNews } from "./NewsPage";

const REACTIONS = [
  { value: "like", label: "Like", emoji: "👍" },
  { value: "celebrate", label: "Celebrate", emoji: "🎉" },
  { value: "insightful", label: "Insightful", emoji: "💡" },
];

/** Reading layout for one story (design board 9, article view). */
export default function NewsArticle() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const save = useSaveNews();
  const { data: story, isLoading, isError } = useQuery(["newsDetail", id], () => getNewsDetail(id), { staleTime: 30_000 });
  const html = useMemo(() => DOMPurify.sanitize(story?.description || ""), [story?.description]);
  const react = useMutation(reactToNews, {
    onMutate: ({ reaction }) => {
      const prev = queryClient.getQueryData(["newsDetail", id]);
      if (prev) {
        const reactions = { ...prev.reactions };
        if (prev.my_reaction) reactions[prev.my_reaction] = Math.max(0, reactions[prev.my_reaction] - 1);
        if (reaction) reactions[reaction] = (reactions[reaction] || 0) + 1;
        queryClient.setQueryData(["newsDetail", id], { ...prev, reactions, my_reaction: reaction });
      }
      return { prev };
    },
    onSuccess: (r) => queryClient.setQueryData(["newsDetail", id], (d) => (d ? { ...d, ...r } : d)),
    onError: (e, _, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["newsDetail", id], ctx.prev);
      toast.error(apiError(e));
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <Spinner />
      </div>
    );
  }
  if (isError || !story) {
    return (
      <Card className="ui-scope mx-auto max-w-2xl">
        <EmptyState icon={NewspaperIcon} title="Story not found" description="It may have been removed." action={<Link to={PATHS.news} className="font-semibold text-link">Back to News</Link>} />
      </Card>
    );
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <div className="ui-scope mx-auto max-w-3xl">
      <Link to={PATHS.news} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline">
        <ArrowLeftIcon className="h-4 w-4" /> News
      </Link>
      <article>
        <Pill tone="brand">{story.category}</Pill>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{story.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {new Date(story.created_at).toLocaleDateString(undefined, { dateStyle: "long" })} · {story.read_minutes} min read · {story.views} reads
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => save.mutate({ id: story.id, saved: !story.saved })} aria-pressed={story.saved}>
            {story.saved ? <BookmarkSolid className="h-4 w-4 text-link" /> : <BookmarkIcon className="h-4 w-4" />} {story.saved ? "Saved" : "Save"}
          </Button>
          <Button variant="ghost" size="sm" onClick={copyLink}>
            <LinkIcon className="h-4 w-4" /> Copy link
          </Button>
        </div>
        {story.image && <img src={getImageBaseUrl(story.image)} alt="" className="mt-6 w-full rounded-theme object-cover" />}
        <div className="rich-text mt-6 text-base leading-7 text-slate-800" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      <div className="mt-8 flex flex-wrap items-center gap-2 border-y border-slate-200 py-4">
        <span className="mr-2 text-sm font-medium text-slate-600">React:</span>
        {REACTIONS.map((r) => {
          const on = story.my_reaction === r.value;
          return (
            <button
              key={r.value}
              onClick={() => react.mutate({ id: story.id, reaction: on ? null : r.value })}
              aria-pressed={on}
              className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset transition", on ? "bg-brand-soft text-link ring-brand" : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50")}
            >
              <span aria-hidden="true">{r.emoji}</span> {r.label}
              <span className="text-xs font-normal text-slate-500">{story.reactions?.[r.value] || 0}</span>
            </button>
          );
        })}
      </div>

      {story.related?.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-base font-semibold text-slate-900">More from {story.category}</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {story.related.map((s) => (
              <li key={s.id}>
                <Link to={newsPath(s.id)} className="block overflow-hidden rounded-theme border border-slate-200 bg-white shadow-sm transition hover:border-slate-300">
                  {s.image && <img src={getImageBaseUrl(s.image)} alt="" className="aspect-video w-full object-cover" />}
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-900">{s.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{timeAgo(s.created_at)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
