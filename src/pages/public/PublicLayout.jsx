/**
 * Shell for every public page: sticky header (logo, navigation, sign in /
 * join, mobile menu), the page itself, and a footer with the institute's
 * contact details. Wraps the pages in the theme so admin branding applies.
 */
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Bars3Icon,
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getPublic } from "src/api";
import { ThemeProvider, useSurfaceDesign, useThemeInfo } from "src/lib/theme";
import { useInstituteConfig } from "src/lib/config";
import { cx } from "src/components/ui";
import { getUserToken } from "src/helpers/globalStorage";
import { Container, P } from "./kit";

const ALL_NAV = [
  { to: P.home, label: "Home", end: true },
  { to: P.about, label: "About", key: "about" },
  { to: P.events, label: "Events", key: "events" },
  { to: P.news, label: "News", key: "news" },
  { to: P.jobs, label: "Jobs", key: "jobs" },
  { to: P.stories, label: "Stories", key: "stories" },
  { to: P.podcasts, label: "Podcasts", key: "podcasts", feature: "podcasts" },
  { to: P.gallery, label: "Gallery", key: "gallery" },
  { to: P.contact, label: "Contact", key: "contact" },
];

/** Menu items the institute's admin left switched on. */
function useNav() {
  const { website, on } = useInstituteConfig();
  return ALL_NAV.filter((n) => (!n.key || website?.nav?.[n.key] !== false) && on(n.feature));
}

/** Optional bar above the header, set under Institute settings → Website. */
function Banner() {
  const { website } = useInstituteConfig();
  const b = website?.banner;
  if (!b?.enabled || !b.text) return null;
  const inner = <span className="font-medium">{b.text}</span>;
  return (
    <div className="bg-brand px-4 py-2 text-center text-sm text-brand-ink">
      {b.link ? (
        <a href={b.link} className="hover:underline" {...(/^https?:/.test(b.link) ? { target: "_blank", rel: "noreferrer" } : {})}>
          {inner} <span aria-hidden="true">→</span>
        </a>
      ) : (
        inner
      )}
    </div>
  );
}

/** Title and description for search engines and browser tabs. */
function Seo() {
  const { website } = useInstituteConfig();
  useEffect(() => {
    if (website?.seo_title) document.title = website.seo_title;
    if (website?.seo_description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = website.seo_description;
    }
  }, [website?.seo_title, website?.seo_description]);
  return null;
}

function signedInHome() {
  try {
    const role = getUserToken()?.user?.role_name;
    if (!role) return null;
    return role === "admin" || role === "super_admin" ? "/admin" : "/user";
  } catch {
    return null;
  }
}

function Brand({ onClick }) {
  const { logoUrl, name } = useThemeInfo() || {};
  const { data } = useQuery("publicHome", () => getPublic("home"), {
    staleTime: 60_000,
    retry: false,
  });
  const title = data?.institute?.name || name || "Alumni";
  return (
    <Link
      to={P.home}
      onClick={onClick}
      className="flex min-w-0 items-center gap-3 text-inherit"
    >
      {logoUrl && (
        <img
          src={logoUrl}
          alt=""
          className="h-9 w-auto max-w-[120px] object-contain"
        />
      )}
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[15px] font-bold">
          {title}
        </span>
        <span className="block text-xs font-medium opacity-70">
          Alumni network
        </span>
      </span>
    </Link>
  );
}

const NAV_STYLE = {
  text: (a) => (a ? "font-semibold opacity-100 bg-black/[0.06]" : "opacity-75 hover:opacity-100 hover:bg-black/5"),
  underline: (a) => (a ? "font-semibold opacity-100 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-current" : "opacity-75 hover:opacity-100"),
  pill: (a, onBrand) => (a ? (onBrand ? "rounded-full bg-white text-slate-900" : "rounded-full bg-brand text-brand-ink") : "rounded-full opacity-80 hover:opacity-100 hover:bg-black/5"),
};

function Header() {
  const NAV = useNav();
  const d = useSurfaceDesign("public");
  const links = d.links || [];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const home = signedInHome();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onBrand = d.header_style === "brand";
  const link = ({ isActive }) => cx("relative rounded-lg px-3 py-2 text-sm font-medium text-inherit transition", (NAV_STYLE[d.nav_style] || NAV_STYLE.text)(isActive, onBrand));
  // the main button must stand out on a brand-coloured menu bar
  const cta = onBrand ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-brand text-brand-ink hover:bg-brand-hover";
  const clear = d.header_style === "transparent" && !scrolled && !open;
  const centered = d.header_layout === "center";
  const nav = (
    <nav className={cx("hidden items-center gap-0.5 xl:flex", centered && "justify-center")} aria-label="Main">
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} className={link}>
          {n.label}
        </NavLink>
      ))}
      {links.map((l) => (
        <a key={l.url} href={l.url} className={link({ isActive: false })} {...(/^https?:/.test(l.url) ? { target: "_blank", rel: "noreferrer" } : {})}>
          {l.label}
        </a>
      ))}
    </nav>
  );
  // the menu panel is rendered next to the header, not inside it: the header's
  // backdrop blur would make it the containing block for "fixed" children
  return (
    <>
      <header
        className={cx(
          "z-40 border-b transition",
          d.sticky !== false && "sticky top-0",
          d.header_style === "transparent" ? (clear ? "border-transparent bg-transparent text-slate-900" : "border-slate-200 bg-white text-slate-900 shadow-sm") : "bg-pubhead text-pubhead-fg",
          d.header_style !== "transparent" && (scrolled ? "border-pubhead-border shadow-sm" : "border-transparent"),
        )}
      >
        <Container className={cx("flex h-16 items-center justify-between gap-4", centered && "xl:justify-center")}>
          <div className={cx(centered && "xl:hidden")}>
            <Brand />
          </div>
          {centered ? <div className="hidden xl:block"><Brand /></div> : nav}
          <div className={cx("hidden items-center gap-2 xl:flex", centered && "xl:absolute xl:right-8")}>
            {home ? (
              <a
                href={home}
                className={cx("rounded-btn px-4 py-2 text-sm font-semibold shadow-sm", cta)}
              >
                {d.cta_label || "Open the app"}
              </a>
            ) : (
              <>
                <a
                  href={P.login}
                  className="rounded-btn px-4 py-2 text-sm font-semibold text-inherit opacity-90 hover:bg-black/5 hover:opacity-100"
                >
                  Sign in
                </a>
                <a
                  href={P.signup}
                  className={cx("rounded-btn px-4 py-2 text-sm font-semibold shadow-sm", cta)}
                >
                  Join
                </a>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 rounded-lg p-2 hover:bg-black/5 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </Container>
        {centered && <Container className="hidden justify-center pb-2 xl:flex">{nav}</Container>}
      </header>
      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-slate-200 bg-white xl:hidden"
        >
          <nav className="flex flex-col gap-1 p-4" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cx(
                    "rounded-xl px-4 py-3 text-base font-medium",
                    isActive
                      ? "bg-brand-soft text-link"
                      : "text-slate-800 hover:bg-slate-50",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            {links.map((l) => (
              <a key={l.url} href={l.url} className="rounded-xl px-4 py-3 text-base font-medium text-slate-800 hover:bg-slate-50">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="grid gap-3 border-t border-slate-100 p-4">
            {home ? (
              <a
                href={home}
                className="rounded-btn bg-brand px-4 py-3 text-center text-sm font-semibold text-brand-ink"
              >
                {d.cta_label || "Open the app"}
              </a>
            ) : (
              <>
                <a
                  href={P.signup}
                  className="rounded-btn bg-brand px-4 py-3 text-center text-sm font-semibold text-brand-ink"
                >
                  Join the network
                </a>
                <a
                  href={P.login}
                  className="rounded-btn px-4 py-3 text-center text-sm font-semibold text-slate-800 ring-1 ring-inset ring-slate-300"
                >
                  Sign in
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const SOCIAL_LABEL = {
  facebook: "Facebook",
  twitter: "X (Twitter)",
  x: "X",
  telegram: "Telegram",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};

function Footer() {
  const NAV = useNav();
  const { data } = useQuery("publicAbout", () => getPublic("about"), {
    staleTime: 5 * 60_000,
    retry: false,
  });
  const i = data?.institute;
  const d = useSurfaceDesign("public");
  const col = "text-sm text-pubfoot-muted hover:text-pubfoot-fg";
  // the institute's own social links plus any set in the website design
  const social = [...(i?.social || []), ...Object.entries(d.socials || {}).filter(([, url]) => url).map(([network, url]) => ({ network, url }))].filter((s, k, a) => a.findIndex((x) => x.url === s.url) === k);
  return (
    <footer className="bg-pubfoot text-pubfoot-fg">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-lg font-bold">
            {i?.name || "Alumni network"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-pubfoot-muted">
            The official alumni community: stay in touch with classmates, find
            opportunities and give back.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {NAV.slice(1, 7).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className={col}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Members</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a href={P.signup} className={col}>
                Join the network
              </a>
            </li>
            <li>
              <a href={P.login} className={col}>
                Sign in
              </a>
            </li>
            <li>
              <a href="/forgot-password" className={col}>
                Forgot password
              </a>
            </li>
            <li>
              <Link to={P.contact} className={col}>
                Help &amp; contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Get in touch</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {i?.email && (
              <li>
                <a
                  href={`mailto:${i.email}`}
                  className={cx(
                    col,
                    "inline-flex items-center gap-2 break-all",
                  )}
                >
                  <EnvelopeIcon className="h-4 w-4 shrink-0" /> {i.email}
                </a>
              </li>
            )}
            {i?.phone && (
              <li>
                <a
                  href={`tel:${i.phone.replace(/[^\d+]/g, "")}`}
                  className={cx(col, "inline-flex items-center gap-2")}
                >
                  <PhoneIcon className="h-4 w-4 shrink-0" /> {i.phone}
                </a>
              </li>
            )}
            {i?.website && (
              <li>
                <a
                  href={i.website}
                  target="_blank"
                  rel="noreferrer"
                  className={cx(col, "inline-flex items-center gap-2")}
                >
                  <GlobeAltIcon className="h-4 w-4 shrink-0" />{" "}
                  {i.website
                    .replace(/^https?:\/\/(www\.)?/, "")
                    .replace(/\/$/, "")}
                </a>
              </li>
            )}
          </ul>
          {social.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {social.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-pubfoot-muted ring-1 ring-inset ring-[color:var(--pub-footer-muted)] hover:text-pubfoot-fg"
                >
                  {SOCIAL_LABEL[s.network] || s.network}
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>
      <div className="border-t border-[color:var(--pub-footer-muted)] border-opacity-30">
        <Container className="flex flex-col gap-2 py-6 text-xs text-pubfoot-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {i?.name || "Alumni network"}. All
            rights reserved.
          </p>
          <p>{d.footer_tagline || "Built for alumni, by alumni."}</p>
        </Container>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // block body: scrollTo may return a Promise, which React must not get
  }, [pathname]);
  return null;
}

export default function PublicLayout() {
  return (
    <ThemeProvider surface="public">
      <div className="ui-scope flex min-h-screen flex-col bg-page font-theme text-slate-900 antialiased">
        <ScrollToTop />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <Seo />
        <Banner />
        <Header />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
