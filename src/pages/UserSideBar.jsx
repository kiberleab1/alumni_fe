import { Dialog, Transition } from "@headlessui/react";
import {
  AcademicCapIcon,
  ArrowLongLeftIcon,
  Bars3Icon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  InboxArrowDownIcon,
  NewspaperIcon,
  PlusCircleIcon,
  PlusIcon,
  StarIcon,
  TagIcon,
  UserPlusIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import ComponentRender from "../pages/UserComponentRender";
import CreateAdminPage from "./admin/admins/createAdmin";
import { useQuery } from "react-query";
import { getAllSettings, getImageBaseUrl } from "src/api";
// import { useLocation } from "react-router-dom";

const navigation = [
  {
    name: "Profile",
    href: "#",
    icon: HomeIcon,
    current: false,
    comp: CreateAdminPage,
  },
  { name: "Alumni", href: "#", icon: AcademicCapIcon, current: false },
  { name: "Jobs", href: "#", icon: BriefcaseIcon, current: false },
  { name: "Jobs History", href: "#", icon: BriefcaseIcon, current: false },
  {
    name: "Document Verification",
    href: "#",
    icon: ClipboardDocumentCheckIcon,
    current: false,
  },
  { name: "Events", href: "#", icon: CalendarIcon, current: false },
  { name: "News", href: "#", icon: NewspaperIcon, current: false },
];

const subNavigation = [];

const navigationWithNoSubNavigation = [
  "Profile",
  "Events",
  "News",
  "Jobs",
  "Jobs History",
  "Alumni",
  "Document Verification",
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function UserSideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOpenMain, setSidebarOpenMain] = useState(true);
  const [componentClicked, setComponentClicked] = useState({
    name: "Profile",
    href: "/Profile",
    current: true,
  });

  const [navigationItems, setNavigationItems] = useState(navigation);
  const [openDropDown, setOpenDropDown] = useState({});

  const handleOpenDropDown = (itemName) => {
    setOpenDropDown((prevState) => ({
      ...prevState,
      [itemName]: !prevState[itemName],
    }));
    console.log(itemName);
  };

  const handleNavigationItemClick = (itemName) => {
    const updatedNavigationItems = navigationItems.map((item) => {
      if (item.name === itemName) {
        return { ...item, current: true };
      } else {
        return { ...item, current: false };
      }
    });
    setNavigationItems(updatedNavigationItems);
    setComponentClicked({
      name: itemName,
      href: `/${itemName.toLowerCase()}`,
      current: true,
    });
    console.log(itemName);
  };

  const [logo, setLogo] = useState({});
  const [sideBarBackground, setSideBarBackground] = useState(null);
  const [sideBarTextColor, setSideBarTextColor] = useState(null);
  const [sidebarHoverBG, setSidebarHoverBG] = useState(null);
  const [sideBarHoverTextColor, setSideBarHOverTextColor] = useState(null);
  const [sideBarActuveTextColor, setSideBarActiveTextColor] = useState(null);
  const [sidebarActiveBG, setSidebarActiveBG] = useState(null);

  const { isError, data, isLoading } = useQuery("getAllSettings", async () => {
    return await getAllSettings({ pageNumber: 0, pageSize: 20 });
  });

  useEffect(() => {
    if (!isError && !isLoading && data) {
      const settingsData = data.data.settings;
      console.log(settingsData);
      if (settingsData) {
        settingsData.forEach((setting) => {
          const { setting_name, setting_value } = setting;
          if (setting_name == "sidebarBackground") {
            setSideBarBackground(setting_value);
          } else if (setting_name == "sidebarText") {
            setSideBarTextColor(setting_value);
          } else if (setting_name == "logo") {
            setLogo(getImageBaseUrl(setting_value));
          } else if (setting_name == "sideBarHoverBackgroundColor") {
            setSidebarHoverBG(setting_value);
          } else if (setting_name == "sideBarHoverTextColor") {
            setSideBarHOverTextColor(setting_value);
          } else if (setting_name == "sideBarActiveBackgroundColor") {
            setSidebarActiveBG(setting_value);
          } else if (setting_name == "sideBarActiveTextColor") {
            setSideBarActiveTextColor(setting_value);
          }
        });
      }
    }
  }, [isError, isLoading, data]);

  // const location = useLocation();
  // useEffect(() => {
  //   const item = navigation.find((item) => {
  //     return item.href === location.pathname;
  //   });
  //   handleNavigationItemClick(item.name);
  // }, []);
  const handlePageSet = (pageName) => {
    console.log(`Page set to: ${pageName}`);
    setComponentClicked({
      name: pageName,
      href: `/${pageName.toLowerCase()}`,
      current: true,
    });
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div
                    className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 ring-1 ring-white/10"
                    style={{ backgroundColor: sideBarBackground || "#000000" }}
                  >
                    <div className="flex h-16 shrink-0 items-center">
                      <span className="text-2xl text-gray-50 font-bold font-mono">
                        X Alumni
                      </span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    componentClicked.name === item.name
                                      ? "ring-1 ring-inset"
                                      : "",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                  style={{
                                    color:
                                      componentClicked.name === item.name
                                        ? sideBarActuveTextColor || "#FFFFFF"
                                        : sideBarTextColor || "#ccc",
                                    backgroundColor:
                                      componentClicked.name === item.name
                                        ? sidebarActiveBG || "#4B5563"
                                        : "transparent",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color =
                                      sideBarHoverTextColor || "#FFFFFF";
                                    e.currentTarget.style.backgroundColor =
                                      sidebarHoverBG || "#4B5563";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color =
                                      componentClicked.name === item.name
                                        ? sideBarActuveTextColor || "#FFFFFF"
                                        : sideBarTextColor || "#ccc";
                                    e.currentTarget.style.backgroundColor =
                                      componentClicked.name === item.name
                                        ? sidebarActiveBG || "#4B5563"
                                        : "transparent";
                                  }}
                                  onClick={() =>
                                    handleNavigationItemClick(item.name)
                                  }
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                  <ChevronDownIcon
                                    className="-mr-1 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <ul role="list" className="-mx-2 space-y-1">
                            <li>
                              <a
                                href="#"
                                className={classNames(
                                  "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <ArrowLongLeftIcon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                Logoutsdsds
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <div
          className={`${
            sidebarOpenMain
              ? "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
              : "hidden"
          }`}
        >
          <div
            className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4"
            style={{ backgroundColor: sideBarBackground || "#000000" }}
          >
            <div className="flex h-16 shrink-0 items-center">
              <span className="text-2xl text-gray-50 font-bold font-mono mr-4">
                X Alumni
              </span>
              <button
                type="button"
                className="ml-auto"
                onClick={() => setSidebarOpenMain(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <ArrowLongLeftIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            componentClicked.name === item.name
                              ? "ring-1 ring-inset"
                              : "",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                          style={{
                            color:
                              componentClicked.name === item.name
                                ? sideBarActuveTextColor || "#FFFFFF"
                                : sideBarTextColor || "#FFFFFF",
                            backgroundColor:
                              componentClicked.name === item.name
                                ? sidebarActiveBG || "#4B5563"
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color =
                              sideBarHoverTextColor || "#FFFFFF";
                            e.currentTarget.style.backgroundColor =
                              sidebarHoverBG || "#4B5563";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color =
                              componentClicked.name === item.name
                                ? sideBarActuveTextColor || "#FFFFFF"
                                : sideBarTextColor || "#ccc";
                            e.currentTarget.style.backgroundColor =
                              componentClicked.name === item.name
                                ? sidebarActiveBG || "#4B5563"
                                : "transparent";
                          }}
                          onClick={() => handleNavigationItemClick(item.name)}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                          {!navigationWithNoSubNavigation.includes(item.name) &&
                            openDropDown[item.name] && (
                              <ChevronUpIcon
                                className="-mr-1 h-5 w-5 text-gray-400 ml-auto"
                                aria-hidden="true"
                                onClick={() => handleOpenDropDown(item.name)}
                              />
                            )}
                          {!navigationWithNoSubNavigation.includes(item.name) &&
                            !openDropDown[item.name] && (
                              <ChevronDownIcon
                                className="-mr-1 h-5 w-5 text-gray-400 ml-auto"
                                aria-hidden="true"
                                onClick={() => handleOpenDropDown(item.name)}
                              />
                            )}
                        </a>
                        {openDropDown[item.name] && (
                          <ul role="list" className="pl-4">
                            {subNavigation.map(
                              (subItem) =>
                                subItem.parent === item.name && (
                                  <li key={subItem.name}>
                                    <a
                                      href={subItem.href}
                                      className={classNames(
                                        componentClicked.name === subItem.name
                                          ? "ring-1 ring-inset"
                                          : "",
                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                      )}
                                      style={{
                                        color:
                                          componentClicked.name === subItem.name
                                            ? sideBarActuveTextColor ||
                                              "#FFFFFF"
                                            : sideBarTextColor || "#ccc",
                                        backgroundColor:
                                          componentClicked.name === subItem.name
                                            ? sidebarActiveBG || "#4B5563"
                                            : "transparent",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.color =
                                          sideBarHoverTextColor || "#FFFFFF";
                                        e.currentTarget.style.backgroundColor =
                                          sidebarHoverBG || "#4B5563";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.color =
                                          componentClicked.name === item.name
                                            ? sideBarActuveTextColor ||
                                              "#FFFFFF"
                                            : sideBarTextColor || "#ccc";
                                        e.currentTarget.style.backgroundColor =
                                          componentClicked.name === item.name
                                            ? sidebarActiveBG || "#4B5563"
                                            : "transparent";
                                      }}
                                      onClick={() =>
                                        handleNavigationItemClick(subItem.name)
                                      }
                                    >
                                      <subItem.icon
                                        className="h-6 w-6 shrink-0"
                                        aria-hidden="true"
                                      />
                                      {subItem.name}
                                    </a>
                                  </li>
                                )
                            )}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="mt-auto">
                  <ul role="list" className="-mx-2 space-y-1">
                    <li>
                      <a
                        href="#"
                        className={classNames(
                          "text-gray-400 hover:text-white hover:bg-gray-800",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <ArrowLongLeftIcon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className={`${sidebarOpenMain ? "lg:pl-72" : "lg:pl-85"}`}>
          <div className="flex ml-4 mt-4">
            {!sidebarOpenMain ? (
              <div>
                <button
                  type="button"
                  className="mr-4 p-2.5 text-gray-100"
                  onClick={() => setSidebarOpenMain(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                <span className="text-2xl text-black font-bold font-mono mr-4">
                  X Alumni
                </span>
              </div>
            ) : (
              <div className="flex">
                <button
                  type="button"
                  className="m-4 text-gray-100 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                <nav className="flex ml-4" aria-label="Breadcrumb">
                  <ol role="list" className="flex items-center space-x-4">
                    <li>
                      <div>
                        <a
                          href="#"
                          className="text-gray-900 hover:text-gray-500"
                        >
                          <HomeIcon
                            className="h-5 w-5 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Home</span>
                        </a>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                        </svg>
                        <a
                          href="#"
                          className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                          aria-current={
                            componentClicked.current ? "page" : undefined
                          }
                        >
                          {componentClicked.name}
                        </a>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
            )}
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <ComponentRender
                page={componentClicked.name}
                onPageSet={handlePageSet}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default UserSideBar;
