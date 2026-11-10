import { createContext, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { getImageBaseUrl, getTheme } from "src/api";

/**
 * Institute branding for the member area.
 *
 * GET /theme returns the published theme plus ready-made CSS variables
 * (the server owns the colour maths and the WCAG checks). We write those
 * variables on :root, so Tailwind classes like `bg-brand` / `bg-side`
 * (tailwind.config.js) and plain `var(--brand)` all follow the theme.
 *
 * The last theme is cached in localStorage so a reload paints in the right
 * colours before the request finishes.
 */
const CACHE_KEY = "themeCache:v2";
const FALLBACK_LOGO = "https://kefeta.et/wp-content/uploads/2023/01/cropped-Kefeta-Logo-English-Colors-2048x1479-1-120x87.png";

const ThemeContext = createContext({ theme: null, design: null, logoUrl: FALLBACK_LOGO, name: "Alumni", surface: null });

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  } catch {
    return null;
  }
}
function writeCache(value) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {
    /* private mode / quota: the theme still applies, just not cached */
  }
}

/** Sets CSS variables on an element (default :root). Used by the admin preview too. */
export function applyThemeVars(vars, el = document.documentElement) {
  if (!vars) return;
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
}

/** Loads a Google Fonts stylesheet once per URL. */
export function ensureFont(url) {
  if (!url || document.querySelector(`link[data-theme-font="${CSS.escape(url)}"]`)) return;
  const link = Object.assign(document.createElement("link"), { rel: "stylesheet", href: url });
  link.dataset.themeFont = url;
  document.head.appendChild(link);
}

export const themeLogoUrl = (logo) => (logo ? (/^https?:/.test(logo) ? logo : getImageBaseUrl(logo)) : FALLBACK_LOGO);

// apply the cached theme as early as possible (module load, before React renders)
const cached = typeof window !== "undefined" ? readCache() : null;
if (cached?.vars) {
  const path = window.location.pathname;
  const surface = path.startsWith("/admin") ? "admin" : path.startsWith("/user") ? "member" : "public";
  applyThemeVars({ ...cached.vars, ...cached.surfaces?.[surface] });
  ensureFont(cached.font_url);
}

/**
 * `surface` is "public", "member" or "admin": each institute designs the
 * three separately, so the shell for each applies its own variables over the
 * shared brand ones.
 */
export function ThemeProvider({ children, surface }) {
  const { data } = useQuery("theme", getTheme, {
    staleTime: 5 * 60_000,
    initialData: cached || undefined,
    // the cached copy is only a placeholder: always confirm with the server
    initialDataUpdatedAt: 0,
  });

  useEffect(() => {
    if (!data?.vars) return;
    applyThemeVars({ ...data.vars, ...(surface && data.surfaces?.[surface]) });
    ensureFont(data.font_url);
    writeCache(data);
  }, [data, surface]);

  const theme = data?.theme || null;
  return (
    <ThemeContext.Provider value={{ theme, design: data?.design || theme?.design || null, surface, logoUrl: themeLogoUrl(theme?.logo), name: theme?.name || "Alumni" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeInfo = () => useContext(ThemeContext);

/** The design for one surface, with safe fallbacks while the theme loads. */
export function useSurfaceDesign(surface) {
  const { design } = useContext(ThemeContext);
  return design?.[surface] || {};
}

/** Menu item classes for the member and admin sidebars, per the chosen menu style. */
export function navItemClass(style = "filled", active = false, density = "comfortable") {
  const size = density === "compact" ? "px-3 py-1.5" : "px-3 py-2";
  const base = `relative flex w-full items-center gap-3 rounded-lg ${size} text-left text-sm font-medium transition`;
  if (style === "accent-bar")
    return `${base} ${active ? "bg-side-hover text-side-active-fg before:absolute before:inset-y-1.5 before:left-0 before:w-1 before:rounded-full before:bg-accent" : "text-side-fg hover:bg-side-hover hover:text-side-active-fg"}`;
  if (style === "minimal") return `${base} ${active ? "font-semibold text-side-active-fg" : "text-side-fg opacity-80 hover:opacity-100"}`;
  return `${base} ${active ? "bg-side-active text-side-active-fg" : "text-side-fg hover:bg-side-hover hover:text-side-active-fg"}`;
}
