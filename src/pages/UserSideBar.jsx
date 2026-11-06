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
import { ThemeProvider, useThemeInfo } from "src/lib/theme";
import { deleteUserToken } from "src/helpers/globalStorage";
import { RealtimeProvider, useRealtime } from "src/lib/realtime";
import { PATHS, notificationTarget } from "src/lib/nav";
import NotificationBell from "src/components/NotificationBell";
import { Avatar, CountBadge, cx } from "src/components/ui";

// Main navigation (design: Blueprint · navigation). `badge` picks a live
// counter from the realtime context.
const navigation = [
  { to: PATHS.home, label: "Home", icon: HomeIcon, end: true },
  { to: PATHS.people, label: "People", icon: UserGroupIcon, badge: "pendingRequests" },
  { to: PATHS.messages, label: "Messages", icon: ChatBubbleLeftRightIcon, badge: "unreadChats" },
  { to: PATHS.jobs, label: "Jobs", icon: BriefcaseIcon },
  { to: PATHS.events, label: "Events", icon: CalendarIcon },
  { to: PATHS.news, label: "News", icon: NewspaperIcon },
  { to: PATHS.groups, label: "Groups", icon: RectangleGroupIcon },
  { to: PATHS.mentorship, label: "Mentorship", icon: LightBulbIcon },
  { to: PATHS.documents, label: "Documents", icon: ClipboardDocumentCheckIcon },
];
const secondary = [
  { to: PATHS.profile, label: "My profile", icon: UserCircleIcon },
  { to: PATHS.career, label: "Career history", icon: ClockIcon },
  { to: PATHS.notifications, label: "Notifications", icon: BellIcon, badge: "unreadNotifs" },
  { to: PATHS.settings, label: "Settings", icon: Cog6ToothIcon },
];
// phone bottom bar (design: Mobile · 5 tabs)
const bottomTabs = [navigation[0], navigation[1], navigation[2], navigation[3]];

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
      <ThemeProvider>
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
  const title = titleFor(location.pathname);

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

  const navItem = (item) => (
    <li key={item.to}>
      <NavLink
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
          cx(
            "group flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition",
            isActive ? "bg-side-active text-side-active-fg" : "text-side-fg hover:bg-side-hover hover:text-side-active-fg"
          )
        }
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
          {navigation.map(navItem)}
        </ul>
        <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-side-fg/70">You</p>
        <ul role="list" className="mt-1 space-y-1">
          {secondary.map(navItem)}
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
    <div className="min-h-screen bg-slate-50 font-theme">
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">{sidebar}</div>

      <div className="lg:pl-64">
        <header className="ui-scope sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <img src={brand.logoUrl} alt="" className="h-8 w-auto max-w-[6rem] object-contain sm:hidden" />
          <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-slate-900">{title}</h1>

          {realtime.status !== "online" && (
            <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" /> Reconnecting
            </span>
          )}

          <NotificationBell onOpenItem={(n) => navigate(notificationTarget(n))} onSeeAll={() => navigate(PATHS.notifications)} />

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <Avatar name={[me?.first_name, me?.last_name].filter(Boolean).join(" ") || me?.email} size="sm" />
              <span className="hidden pr-2 text-sm font-medium text-slate-700 sm:block">{me?.first_name}</span>
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
                {secondary.map((item) => (
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

        <main className="px-3 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8">
          <MemberRoutes />
        </main>

        {/* phone bottom bar */}
        <nav aria-label="Main" className="ui-scope fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
          {bottomTabs.map((item) => (
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
