export type SitePost = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  content?: Record<string, unknown> | null;
  media?: Array<{ url: string; type?: string }>;
  tags?: string[];
  authorName?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type SiteBootstrap = {
  site: {
    id: string;
    code: string;
    name: string;
    config?: Record<string, unknown>;
  };
  blueprint?: Record<string, unknown>;
};

export type SiteFeed<TPost = SitePost> = {
  site: SiteBootstrap["site"];
  posts: TPost[];
};

const API_BASE =
  process.env.NEXT_PUBLIC_MASTER_PANEL_URL ||
  process.env.NEXT_PUBLIC_MASTER_API_URL;
const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE;
const FEED_REVALIDATE_SECONDS = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_FEED_REVALIDATE_SECONDS ?? 300);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 300;
})();
const REQUEST_TIMEOUT_MS = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_PUBLIC_API_TIMEOUT_MS ?? 8000);
  return Number.isFinite(parsed) && parsed >= 1000 ? parsed : 8000;
})();

// The public connector can be hosted on slower infrastructure; a small retry helps
// smooth over transient timeouts/cold starts without changing any API behavior.
const PUBLIC_CONNECTOR_TIMEOUT_MS = 90_000;
const PUBLIC_CONNECTOR_MAX_ATTEMPTS = 2;

function isRetryableConnectorError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const anyErr = error as { code?: unknown; name?: unknown; message?: unknown; cause?: unknown };
  const code = typeof anyErr.code === "string" ? anyErr.code : "";
  const name = typeof anyErr.name === "string" ? anyErr.name : "";
  const message = typeof anyErr.message === "string" ? anyErr.message : "";
  const cause = anyErr.cause as { code?: unknown; name?: unknown; message?: unknown } | undefined;
  const causeCode = typeof cause?.code === "string" ? cause.code : "";
  const causeName = typeof cause?.name === "string" ? cause.name : "";
  const causeMessage = typeof cause?.message === "string" ? cause.message : "";

  return (
    code === "UND_ERR_HEADERS_TIMEOUT" ||
    causeCode === "UND_ERR_HEADERS_TIMEOUT" ||
    name === "HeadersTimeoutError" ||
    causeName === "HeadersTimeoutError" ||
    message.toLowerCase().includes("headers timeout") ||
    causeMessage.toLowerCase().includes("headers timeout")
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getPublicUrl = (path: string) => {
  if (!API_BASE || !SITE_CODE) return null;
  return `${API_BASE.replace(/\/$/, "")}/api/v1/public/${SITE_CODE}${path}`;
};

async function fetchPublicJson<T>(path: string, options?: { fresh?: boolean }): Promise<T | null> {
  const target = getPublicUrl(path);
  if (!target) return null;

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= PUBLIC_CONNECTOR_MAX_ATTEMPTS; attempt += 1) {
    try {
      const signal =
        typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
          ? AbortSignal.timeout(PUBLIC_CONNECTOR_TIMEOUT_MS)
          : undefined;

      const response = await fetch(target, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        ...(signal ? { signal } : {}),
        ...(options?.fresh ? { cache: "no-store" } : { next: { revalidate: FEED_REVALIDATE_SECONDS } }),
      });

      if (!response.ok) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`Public connector request failed (${response.status}) for ${target}`);
        }
        return null;
      }

      const json = (await response.json()) as { success: boolean; data?: T };
      return json.data || null;
    } catch (error) {
      lastError = error;
      const shouldRetry = attempt < PUBLIC_CONNECTOR_MAX_ATTEMPTS && isRetryableConnectorError(error);
      if (!shouldRetry) break;
      await sleep(250 * attempt);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn("Public connector request failed", lastError);
  }
  return null;
}

export async function fetchSiteBootstrap(options?: { fresh?: boolean }): Promise<SiteBootstrap | null> {
  return fetchPublicJson<SiteBootstrap>("/bootstrap", options);
}

export async function fetchSiteFeed<TPost = SitePost>(
  limit = 50,
  options?: { fresh?: boolean; category?: string; task?: string }
): Promise<SiteFeed<TPost> | null> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (typeof options?.category === "string" && options.category.trim()) {
    params.set("category", options.category.trim().toLowerCase());
  }
  if (typeof options?.task === "string" && options.task.trim()) {
    params.set("task", options.task.trim().toLowerCase());
  }
  return fetchPublicJson<SiteFeed<TPost>>(`/feed?${params.toString()}`, options);
}
