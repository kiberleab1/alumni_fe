import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BriefcaseIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ComponentRender from "../pages/UserComponentRender";
import { logout } from "src/api";
import { ThemeProvider, useThemeInfo } from "src/lib/theme";
import { deleteUserToken } from "src/helpers/globalStorage";
import { RealtimeProvider, useRealtime } from "src/lib/realtime";
import NotificationBell from "src/components/NotificationBell";
import { Avatar, CountBadge, cx } from "src/components/ui";

// `name` must match a key of componentsMap in UserComponentRender.
// `badge` picks a live counter from the realtime context.
const navigation = [
  { name: "Profile", icon: UserCircleIcon },
  { name: "Alumni", icon: AcademicCapIcon },
  { name: "My Connections", label: "My Network", icon: UserGroupIcon, badge: "pendingRequests" },
  { name: "Chat", label: "Messages", icon: ChatBubbleLeftRightIcon, badge: "unreadChats" },
  { name: "Jobs", icon: BriefcaseIcon },
  { name: "Jobs History", label: "Job History", icon: ClockIcon, child: "Create JobHistory" },
  { name: "Events", icon: CalendarIcon, child: "Event Detail" },
  { name: "News", icon: NewspaperIcon, child: "News Detail" },
  { name: "Document Verification", label: "Verification", icon: ClipboardDocumentCheckIcon },
  { name: "Settings", icon: Cog6ToothIcon },
];

// detail / form pages belong to a section, for highlighting + breadcrumb
const PARENT_OF = {
  "Create JobHistory": "Jobs History",
  "Edit JobHistory": "Jobs History",
  "Create Alumni": "Profile",
  "Edit Alumni": "Profile",
  "Event Detail": "Events",
  "News Detail": "News",
};

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
  const [page, setPage] = useState("Profile");
  // optional hints for the target page, e.g. { tab: "incoming" } for My Network
  const [navParams, setNavParams] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const brand = useThemeInfo();
  const realtime = useRealtime();
  const me = realtime.me;
  const section = PARENT_OF[page] || page;
  const current = navigation.find((n) => n.name === section);

  useEffect(() => {
    const total = realtime.unreadChats + realtime.unreadNotifs;
    document.title = total ? `(${total}) ${brand.name}` : brand.name;
  }, [realtime.unreadChats, realtime.unreadNotifs, brand.name]);

  const go = (name, params = null) => {
    setPage(name);
    setNavParams(params);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };

  const signOut = async () => {
    await logout(); // revoke the session server-side
    deleteUserToken();
    window.location.href = "/login";
  };

  const sidebar = (
    <div className="ui-scope flex h-full flex-col gap-y-5 overflow-y-auto bg-side px-4 pb-4 font-theme">
      <div className="flex h-16 shrink-0 items-center gap-3 px-2">
        <img src={brand.logoUrl} alt={brand.name} className="h-10 w-auto max-w-[9rem] object-contain" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="space-y-1">
          {navigation.map((item) => {
            const active = item.name === section;
            const count = item.badge ? realtime[item.badge] : 0;
            return (
              <li key={item.name}>
                <button
                  onClick={() => go(item.name)}
                  className={cx(
                    "group flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active ? "bg-side-active text-side-active-fg" : "text-side-fg hover:bg-side-hover hover:text-side-active-fg"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="flex-1 text-left">{item.label || item.name}</span>
                  <CountBadge count={count} />
                </button>
              </li>
            );
          })}
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
      {/* mobile drawer */}
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
          <button className="-ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Bars3Icon className="h-6 w-6" />
          </button>
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <button onClick={() => go(section)} className={cx("truncate font-semibold", page === section ? "text-slate-900" : "text-slate-500 hover:text-slate-700")}>
                  {current?.label || section}
                </button>
              </li>
              {page !== section && (
                <>
                  <li className="text-slate-300">/</li>
                  <li className="truncate font-semibold text-slate-900">{page}</li>
                </>
              )}
            </ol>
          </nav>

          {realtime.status !== "online" && (
            <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" /> Reconnecting
            </span>
          )}

          <NotificationBell
            onOpenItem={(n) => {
              if (n.type === "connection_request") go("My Connections", { tab: "incoming" });
              else if (n.type === "connection_accepted") go("Chat");
              else if (n.type?.startsWith("event_") && n.type !== "event_cancelled" && n.entity_id) go("Event Detail", { eventId: n.entity_id });
              else if (n.type === "event_cancelled") go("Events");
            }}
          />

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
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={() => go("Profile")} className={cx("flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700", active && "bg-slate-50")}>
                      <UserCircleIcon className="h-4 w-4" /> My profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={() => go("Settings")} className={cx("flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700", active && "bg-slate-50")}>
                      <Cog6ToothIcon className="h-4 w-4" /> Settings
                    </button>
                  )}
                </Menu.Item>
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

        <main className="px-3 py-4 sm:px-6 lg:px-8">
          {/* NB: the old handlePageSet crashed (selectedPage.name of undefined)
              whenever a page wasn't a nav "child" – e.g. opening Chat from a
              connection card. Navigation is now a plain state change. */}
          <ComponentRender page={page} onPageSet={(name) => go(name)} navParams={navParams} />
        </main>
        {/* one container for the whole member area: page actions and live notifications */}
        <div className="ui-scope">
          <ToastContainer position="bottom-right" newestOnTop limit={4} />
        </div>
      </div>
    </div>
  );
}
