/**
 * Admin shell: themed sidebar grouped by task, top bar with breadcrumb and
 * account menu, and the current page. The page lives in ?page= so reload and
 * the browser's back button work.
 */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowRightOnRectangleIcon, ArrowTopRightOnSquareIcon, Bars3Icon, ChevronRightIcon, Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { deleteUserToken, getUserToken } from "src/helpers/globalStorage";
import { PAGE_PARENT, pageLabel, possibleNavigationMenus } from "src/helpers/role_maaping";
import { ThemeProvider, navItemClass, useSurfaceDesign, useThemeInfo } from "src/lib/theme";
import { useAdminConfig } from "./admin/platform/shared";
import { Avatar, cx } from "src/components/ui";
import ComponentRender, { isAdminPage } from "./PageRender";

const ROLE_LABEL = { super_admin: "Super admin", admin: "Admin", aumni: "Alumni office" };

function NavItem({ item, active, onClick, icon: Icon = item.icon }) {
  const d = useSurfaceDesign("admin");
  return (
    <button type="button" onClick={onClick} aria-current={active ? "page" : undefined} className={navItemClass(d.nav_style, active, d.density)}>
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label || item.name}</span>
    </button>
  );
}

function Sidebar({ groups, active, onPick, onClose }) {
  const { logoUrl, name } = useThemeInfo() || {};
  const d = useSurfaceDesign("admin");
  return (
    <div className="flex h-full flex-col bg-side font-theme">
      <div className="flex h-16 shrink-0 items-center gap-3 px-5">
        {logoUrl && <img src={logoUrl} alt="" className="h-8 w-auto max-w-[72px] rounded bg-white/90 object-contain p-0.5" />}
        <div className="min-w-0 flex-1 leading-tight text-side-fg">
          <p className="truncate text-sm font-bold">{name || "Alumni"}</p>
          <p className="truncate text-xs opacity-70">{d.console_name || "Admin console"}</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-side-fg hover:bg-side-hover" aria-label="Close menu">
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>
      <nav className={cx("flex-1 overflow-y-auto px-3 py-3", d.density === "compact" ? "space-y-3" : "space-y-5")} aria-label="Admin">
        {groups.map((g, i) => (
          <div key={g.label || i}>
            {g.label && <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-side-fg opacity-60">{g.label}</p>}
            <div className="space-y-0.5">
              {g.items.map((item) => (
                <NavItem key={item.name} item={item} active={active === item.name} onClick={() => onPick(item.name)} />
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-white/10 p-3">
        <NavItem item={{ name: "Settings" }} icon={Cog6ToothIcon} active={active === "Settings"} onClick={() => onPick("Settings")} />
      </div>
    </div>
  );
}

function AdminFrame({ children }) {
  return <div className="ui-scope min-h-screen bg-page font-theme text-slate-900 antialiased">{children}</div>;
}

function AdminMain({ children }) {
  const d = useSurfaceDesign("admin");
  return (
    <main id="admin-main" className={d.density === "compact" ? "p-3 sm:p-4 lg:p-6" : "p-4 sm:p-6 lg:p-8"}>
      {children}
    </main>
  );
}

function SideBar() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const user = getUserToken()?.user;
  const { data: adminConfig } = useAdminConfig();
  const groups = user ? possibleNavigationMenus(user.role_name, adminConfig?.my_caps) : null;

  useEffect(() => {
    if (!groups) navigate("/landing/program/login", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const requested = params.get("page");
  const page = requested && isAdminPage(requested) ? requested : "Dashboard";
  const parent = PAGE_PARENT[page];

  useEffect(() => {
    document.querySelector("#admin-main")?.scrollTo?.(0, 0);
    window.scrollTo(0, 0);
  }, [page]);
  useEffect(() => {
    if (!drawer) return undefined;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  if (!groups) return null;

  const open = (name) => {
    setParams({ page: name });
    setDrawer(false);
  };
  const signOut = () => {
    deleteUserToken();
    navigate("/landing/program/login");
  };
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <ThemeProvider surface="admin">
      <AdminFrame>
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
          <Sidebar groups={groups} active={parent || page} onPick={open} />
        </aside>
        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
            <div className="absolute inset-0 bg-slate-900/60" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl">
              <Sidebar groups={groups} active={parent || page} onPick={open} onClose={() => setDrawer(false)} />
            </div>
          </div>
        )}
        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-top-border bg-top px-4 text-top-fg sm:px-6">
            <button type="button" onClick={() => setDrawer(true)} className="-ml-1 rounded-lg p-2 hover:bg-black/5 lg:hidden" aria-label="Open menu">
              <Bars3Icon className="h-6 w-6" />
            </button>
            <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
              {parent && (
                <>
                  <button type="button" onClick={() => open(parent)} className="hidden truncate font-medium opacity-70 hover:opacity-100 sm:block">
                    {pageLabel(parent)}
                  </button>
                  <ChevronRightIcon className="hidden h-4 w-4 shrink-0 opacity-50 sm:block" />
                </>
              )}
              <span className="truncate font-semibold">{pageLabel(page)}</span>
            </nav>
            <a href="/landing" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-inherit opacity-80 hover:bg-black/5 hover:opacity-100 sm:inline-flex">
              View site <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
            <div className="flex items-center gap-2 border-l border-top-border pl-3">
              <Avatar name={displayName} size="sm" />
              <div className="hidden max-w-[160px] leading-tight md:block">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                <p className="text-xs opacity-70">{ROLE_LABEL[user.role_name]}</p>
              </div>
              <button type="button" onClick={signOut} className="rounded-lg p-2 opacity-70 hover:bg-black/5 hover:opacity-100" aria-label="Sign out" title="Sign out">
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </header>
          <AdminMain>
            <ComponentRender page={page} onPageSet={open} />
          </AdminMain>
        </div>
        <ToastContainer position="bottom-right" newestOnTop limit={4} />
      </AdminFrame>
    </ThemeProvider>
  );
}

export default SideBar;
