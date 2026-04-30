const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i;

const isBrowser = typeof window !== "undefined";

const getFallbackOrigin = () => {
  if (isBrowser && window.location?.origin) return window.location.origin;
  return "";
};

export const getApiOrigin = () => {
  const apiBase = import.meta.env.TEAM_TRACK_API_BASE_URL || "";
  const fallbackOrigin = getFallbackOrigin();

  if (!apiBase) return fallbackOrigin;

  try {
    return new URL(apiBase, fallbackOrigin || undefined).origin;
  } catch {
    return fallbackOrigin;
  }
};

export const resolveAssetUrl = (url, fallback = "/vite.svg") => {
  if (!url) return fallback;

  const value = String(url).trim();
  if (!value) return fallback;

  if (
    ABSOLUTE_URL_RE.test(value) ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const apiOrigin = getApiOrigin();
  if (!apiOrigin) return value;

  try {
    return new URL(value, apiOrigin).toString();
  } catch {
    return value;
  }
};
