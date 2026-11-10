import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  Cog6ToothIcon,
  EllipsisHorizontalCircleIcon,
  HomeIcon,
  LightBulbIcon,
  NewspaperIcon,
  RectangleGroupIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MemberRoutes from "./UserComponentRender";
import { logout } from "src/api";
import { ThemeProvider, navItemClass, useSurfaceDesign, useThemeInfo } from "src/lib/theme";
import { deleteUserToken } from "src/helpers/globalStorage";
import { RealtimeProvider, useRealtime } from "src/lib/realtime";
import { PATHS, notificationTarget } from "src/lib/nav";
import NotificationBell from "src/components/NotificationBell";
import { Avatar, CountBadge, cx } from "src/components/ui";
import { FEATURE_FOR_PATH, useInstituteConfig } from "src/lib/config";

// Main navigation (design: Blueprint · navigation). `badge` picks a live
// counter from the realtime context.
const navigation = [
  { key: "home", to: PATHS.home, label: "Home", icon: HomeIcon, end: true },
  { key: "people", to: PATHS.people, label: "People", icon: UserGroupIcon, badge: "pendingRequests" },
  { key: "messages", to: PATHS.messages, label: "Messages", icon: ChatBubbleLeftRightIcon, badge: "unreadChats" },
  { key: "jobs", to: PATHS.jobs, label: "Jobs", icon: BriefcaseIcon },
  { key: "events", to: PATHS.events, label: "Events", icon: CalendarIcon },
  { key: "news", to: PATHS.news, label: "News", icon: NewspaperIcon },
  { key: "groups", to: PATHS.groups, label: "Groups", icon: RectangleGroupIcon },
  { key: "mentorship", to: PATHS.mentorship, label: "Mentorship", icon: LightBulbIcon },
  { key: "documents", to: PATHS.documents, label: "Documents", icon: ClipboardDocumentCheckIcon },
];
const BY_KEY = Object.fromEntries(navigation.map((n) => [n.key, n]));

/** The institute's menu: its order, its names, minus what it hid. */
function designedMenu(design) {
  const menu = design?.menu;
  if (!Array.isArray(menu) || !menu.length) return navigation;
  const listed = menu.filter((m) => BY_KEY[m.key]);
  const rest = navigation.filter((n) => !listed.some((m) => m.key === n.key));
  return [...listed.filter((m) => m.visible !== false).map((m) => ({ ...BY_KEY[m.key], label: m.label || BY_KEY[m.key].label })), ...rest];
}
const secondary = [
  { to: PATHS.profile, label: "My profile", icon: UserCircleIcon },
  { to: PATHS.career, label: "Career history", icon: ClockIcon },
  { to: PATHS.notifications, label: "Notifications", icon: BellIcon, badge: "unreadNotifs" },
  { to: PATHS.settings, label: "Settings", icon: Cog6ToothIcon },
];

const TITLES = Object.fromEntries([...navigation, ...secondary].map((n) => [n.to, n.label]));
function titleFor(pathname) {
  const base = Object.keys(TITLES)
    .filter((p) => p !== PATHS.home)
    .find((p) => pathname === p || pathname.startsWith(`${p}/`));
  return TITLES[base || PATHS.home];
}

export default function UserSideBar() {
  return (
    <RealtimeProvider>
      <ThemeProvider surface="member">
        <Shell />
      </ThemeProvider>
    </RealtimeProvider>
  );
}

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const brand = useThemeInfo();
  const realtime = useRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const me = realtime.me;
  const design = useSurfaceDesign("member");
  const menu = designedMenu(design);
  const labels = Object.fromEntries(menu.map((n) => [n.to, n.label]));
  const title = labels[Object.keys(labels).find((p) => p !== PATHS.home && (location.pathname === p || location.pathname.startsWith(`${p}/`)))] || titleFor(location.pathname);
  const topbar = design.layout === "topbar";
  const compact = design.density === "compact";

  useEffect(() => {
    const total = realtime.unreadChats + realtime.unreadNotifs;
    const page = title && title !== "Home" ? `${title} · ` : "";
    document.title = `${total ? `(${total}) ` : ""}${page}${brand.name}`;
  }, [realtime.unreadChats, realtime.unreadNotifs, brand.name, title]);

  // new page: close the drawer and start at the top
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const signOut = async () => {
    await logout(); // revoke the session server-side
    deleteUserToken();
    window.location.href = "/login";
  };

  // the super admin can switch features off per institute
  const { on } = useInstituteConfig();
  const visible = (list) => list.filter((i) => on(FEATURE_FOR_PATH[i.to]));

  const navItem = (item) => (
    <li key={item.to}>
      <NavLink
        to={item.to}
        end={item.end}
        className={({ isActive }) => cx("group", navItemClass(design.nav_style, isActive, design.density))}
      >
        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left">{item.label}</span>
        <CountBadge count={item.badge ? realtime[item.badge] : 0} />
      </NavLink>
    </li>
  );

  const sidebar = (
    <div className="ui-scope flex h-full flex-col gap-y-5 overflow-y-auto bg-side px-4 pb-4 font-theme">
      <div className="flex h-16 shrink-0 items-center gap-3 px-2">
        <img src={brand.logoUrl} alt={brand.name} className="h-10 w-auto max-w-[9rem] object-contain" />
      </div>
      <nav className="flex flex-1 flex-col" aria-label="Main">
        <ul role="list" className="space-y-1">
          {visible(menu).map(navItem)}
        </ul>
        <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-side-fg/70">You</p>
        <ul role="list" className="mt-1 space-y-1">
          {visible(secondary).map(navItem)}
        </ul>
        <button
          onClick={signOut}
          className="mt-auto flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium text-side-fg transition hover:bg-side-hover hover:text-side-active-fg"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" /> Log out
        </button>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-page font-theme">
      {/* drawer: phone "More" tab and the tablet menu button */}
      <Transition.Root show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition duration-200 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <button className="ui-scope absolute left-full top-4 ml-3 p-1 text-white" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <XMarkIcon className="h-6 w-6" />
                </button>
                {sidebar}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* desktop sidebar */}
      {!topbar && <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">{sidebar}</div>}

      <div className={topbar ? "" : "lg:pl-64"}>
        <header className="ui-scope sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-top-border bg-top px-4 text-top-fg sm:px-6">
          <img src={brand.logoUrl} alt="" className={cx("h-8 w-auto max-w-[6rem] object-contain", topbar ? "" : "sm:hidden")} />
          {topbar ? (
            <>
              <h1 className="sr-only">{title}</h1>
              <nav aria-label="Main" className="no-scrollbar hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex">
                {visible(menu).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => cx("relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-inherit transition", isActive ? "bg-black/10 font-semibold" : "opacity-80 hover:bg-black/5 hover:opacity-100")}
                  >
                    {item.label}
                    <CountBadge count={item.badge ? realtime[item.badge] : 0} />
                  </NavLink>
                ))}
              </nav>
              <p className="min-w-0 flex-1 truncate text-base font-semibold text-inherit lg:hidden">{title}</p>
            </>
          ) : (
            <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-inherit">{title}</h1>
          )}

          {realtime.status !== "online" && (
            <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" /> Reconnecting
            </span>
          )}

          <NotificationBell onOpenItem={(n) => navigate(notificationTarget(n))} onSeeAll={() => navigate(PATHS.notifications)} />

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 rounded-full p-1 hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <Avatar name={[me?.first_name, me?.last_name].filter(Boolean).join(" ") || me?.email} size="sm" />
              <span className="hidden pr-2 text-sm font-medium sm:block">{me?.first_name}</span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-slate-200 focus:outline-none">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {me?.first_name} {me?.last_name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{me?.email}</p>
                </div>
                {visible(secondary).map((item) => (
                  <Menu.Item key={item.to}>
                    {({ active }) => (
                      <button onClick={() => navigate(item.to)} className={cx("flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700", active && "bg-slate-50")}>
                        <item.icon className="h-4 w-4" /> {item.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={signOut} className={cx("flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600", active && "bg-rose-50")}>
                      <ArrowRightOnRectangleIcon className="h-4 w-4" /> Log out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </header>

        <main className={cx("pb-24 lg:pb-8", compact ? "px-2 pt-3 sm:px-4 lg:px-6" : "px-3 pt-4 sm:px-6 lg:px-8", topbar && "mx-auto max-w-7xl")}>
          {design.welcome && location.pathname === PATHS.home && <p className="ui-scope mx-auto mb-4 max-w-6xl rounded-xl bg-brand-soft px-4 py-3 text-sm font-medium text-slate-800">{design.welcome}</p>}
          <MemberRoutes />
        </main>

        {/* phone bottom bar */}
        <nav aria-label="Main" className="ui-scope fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
          {visible((design.mobile_tabs || ["home", "people", "messages", "jobs"]).map((k) => menu.find((n) => n.key === k) || BY_KEY[k]).filter(Boolean)).slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cx("relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium", isActive ? "text-link" : "text-slate-500")}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
              {item.label}
              <CountBadge count={item.badge ? realtime[item.badge] : 0} className="absolute left-1/2 top-1 ml-2" />
            </NavLink>
          ))}
          <button onClick={() => setMobileOpen(true)} className="relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-slate-500">
            <EllipsisHorizontalCircleIcon className="h-6 w-6" aria-hidden="true" />
            More
          </button>
        </nav>

        {/* one container for the whole member area: page actions and live notifications */}
        <div className="ui-scope">
          <ToastContainer position="bottom-right" newestOnTop limit={4} />
        </div>
      </div>
    </div>
  );
}
