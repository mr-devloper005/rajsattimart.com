import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { fetchSiteFeed } from "@/lib/site-connector";
import { buildPostUrl, getPostTaskKey } from "@/lib/task-data";
import { getMockPostsForTask } from "@/lib/mock-posts";
import { SITE_CONFIG, type TaskKey } from "@/lib/site-config";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { cn } from "@/lib/utils";

export const revalidate = 3;

const matchText = (value: string, query: string) =>
  value.toLowerCase().includes(query);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

const compactText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return stripHtml(value).replace(/\s+/g, " ").trim().toLowerCase();
};

function buildSearchHref(parts: {
  q?: string;
  location?: string;
  category?: string;
  task?: string;
}) {
  const sp = new URLSearchParams();
  sp.set("master", "1");
  if (parts.q?.trim()) sp.set("q", parts.q.trim());
  if (parts.location?.trim()) sp.set("location", parts.location.trim());
  if (parts.category?.trim()) sp.set("category", parts.category.trim());
  if (parts.task?.trim()) sp.set("task", parts.task.trim());
  const qs = sp.toString();
  return qs ? `/search?${qs}` : "/search";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    task?: string;
    master?: string;
    location?: string;
  }>;
}) {
  const resolved = (await searchParams) || {};
  const query = (resolved.q || "").trim();
  const normalized = query.toLowerCase();
  const locationQuery = (resolved.location || "").trim().toLowerCase();
  const category = (resolved.category || "").trim().toLowerCase();
  const task = (resolved.task || "").trim().toLowerCase();
  const useMaster = resolved.master !== "0";
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster
      ? { fresh: true, category: category || undefined, task: task || undefined }
      : undefined
  );
  const posts =
    feed?.posts?.length
      ? feed.posts
      : useMaster
        ? []
        : SITE_CONFIG.tasks.flatMap((task) => getMockPostsForTask(task.key));

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === "object" ? post.content : {};
    const typeText = compactText((content as any).type);
    if (typeText === "comment") return false;
    const description = compactText((content as any).description);
    const body = compactText((content as any).body);
    const excerpt = compactText((content as any).excerpt);
    const categoryText = compactText((content as any).category);
    const tags = Array.isArray(post.tags) ? post.tags.join(" ") : "";
    const tagsText = compactText(tags);
    const derivedCategory = categoryText || tagsText;
    const postLocation = compactText((content as any).location);
    if (category && !derivedCategory.includes(category)) return false;
    if (task && typeText && typeText !== task) return false;
    if (locationQuery.length && !postLocation.includes(locationQuery)) return false;
    if (!normalized.length) return true;
    return (
      matchText(compactText(post.title || ""), normalized) ||
      matchText(compactText(post.summary || ""), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    );
  });

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24);
  const primaryClassifiedRoute =
    SITE_CONFIG.tasks.find((t) => t.key === "classified" && t.enabled)?.route ||
    "/classifieds";

  return (
    <div className="min-h-screen bg-[#eef1f6] text-[#0f172a]">
      <NavbarShell />
      <main>
        <section className="border-b border-slate-200/80 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
              Search listings
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#64748b]">
              {query
                ? `Results for “${query}”${locationQuery ? ` near ${resolved.location?.trim()}` : ""}.`
                : "Search across local ads and listings. Add a location to narrow results."}
            </p>

            <form action="/search" method="GET" className="mt-8">
              <input type="hidden" name="master" value="1" />
              {category ? (
                <input type="hidden" name="category" value={category} />
              ) : null}
              {task ? <input type="hidden" name="task" value={task} /> : null}
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
                <div className="flex min-h-11 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:flex-row">
                  <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 border-b border-slate-200 px-3 sm:border-b-0 sm:border-r">
                    <Search
                      className="h-4 w-4 shrink-0 text-slate-400"
                      aria-hidden
                    />
                    <input
                      name="q"
                      defaultValue={query}
                      className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#0f172a] placeholder:text-slate-400 focus:outline-none"
                      placeholder={`Search ${SITE_CONFIG.name}`}
                      autoComplete="off"
                    />
                  </label>
                  <label className="flex min-h-11 min-w-0 flex-[0.85] items-center gap-2 border-slate-200 px-3 sm:border-l">
                    <MapPin
                      className="h-4 w-4 shrink-0 text-slate-400"
                      aria-hidden
                    />
                    <input
                      name="location"
                      defaultValue={resolved.location || ""}
                      className="w-full min-w-0 bg-transparent py-2.5 text-sm text-[#0f172a] placeholder:text-slate-400 focus:outline-none"
                      placeholder="Location"
                      autoComplete="off"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="flex h-11 shrink-0 items-center justify-center rounded-lg bg-[#22c55e] px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16a34a] sm:px-10"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                Category
              </span>
              <Link
                href={buildSearchHref({
                  q: query,
                  location: resolved.location,
                  task,
                })}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  !category
                    ? "bg-[#22c55e] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-[#334155] hover:border-[#22c55e]/50"
                )}
              >
                All
              </Link>
              {CATEGORY_OPTIONS.slice(0, 10).map((cat) => {
                const active = category === cat.slug;
                return (
                  <Link
                    key={cat.slug}
                    href={buildSearchHref({
                      q: query,
                      location: resolved.location,
                      category: cat.slug,
                      task,
                    })}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      active
                        ? "bg-[#22c55e] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-[#334155] hover:border-[#22c55e]/50"
                    )}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.07)] sm:p-8">
            <div className="mb-6 flex flex-col gap-1 border-b border-slate-100 pb-6 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-sm font-semibold text-[#0f172a]">
                {results.length} result{results.length === 1 ? "" : "s"}
              </p>
              <p className="text-xs text-[#64748b]">
                Tip: combine keywords with a category or location for faster matches.
              </p>
            </div>

            {results.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((post) => {
                  const taskKey = getPostTaskKey(post);
                  const href = taskKey
                    ? buildPostUrl(taskKey, post.slug)
                    : `/posts/${post.slug}`;
                  const cardTask: TaskKey = taskKey ?? "classified";
                  return (
                    <TaskPostCard
                      key={post.id}
                      post={post}
                      href={href}
                      taskKey={cardTask}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
                <p className="text-base font-semibold text-[#0f172a]">
                  No matching listings
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#64748b]">
                  Try different keywords, clear the category filter, or browse all
                  classifieds.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f172a] shadow-sm hover:bg-slate-50"
                  >
                    Clear search
                  </Link>
                  <Link
                    href={primaryClassifiedRoute}
                    className="inline-flex items-center justify-center rounded-md bg-[#22c55e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16a34a]"
                  >
                    Browse classifieds
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
