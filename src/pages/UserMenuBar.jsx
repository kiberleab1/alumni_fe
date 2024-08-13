import {
    AcademicCapIcon,
    ArrowLongLeftIcon,
    BriefcaseIcon,
    CalendarIcon,
    ClipboardDocumentCheckIcon,
    HomeIcon,
    NewspaperIcon,
  } from "@heroicons/react/24/outline";
  import { useState, useEffect } from "react";
  import ComponentRender from "../pages/UserComponentRender";
  import CreateAdminPage from "./admin/admins/createAdmin";
  import { useQuery } from "react-query";
  import { getAllSettings, getImageBaseUrl } from "src/api";
  
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
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  
  function UserMenuBar() {
    const [componentClicked, setComponentClicked] = useState({
      name: "Profile",
      href: "/Profile",
      current: true,
    });
  
    const [navigationItems, setNavigationItems] = useState(navigation);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
      setIsMenuOpen(false); // Close the menu after selecting an item on mobile
    };
  
    const [logo, setLogo] = useState({});
    const [menuBarBackground, setMenuBarBackground] = useState({});
    const [menuBarTextColor, setMenuBarTextColor] = useState({});
    const [menuBarHoverBG, setMenuBarHoverBG] = useState({});
    const [menuBarHoverTextColor, setMenuBarHoverTextColor] = useState({});
    const [menuBarActiveTextColor, setMenuBarActiveTextColor] = useState({});
    const [menuBarActiveBG, setMenuBarActiveBG] = useState({});
  
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
            if (setting_name === "menuBarBackground") {
              setMenuBarBackground(setting_value);
            } else if (setting_name === "menuBarText") {
              setMenuBarTextColor(setting_value);
            } else if (setting_name === "logo") {
              setLogo(getImageBaseUrl(setting_value));
            } else if (setting_name === "menuBarHoverBackgroundColor") {
              setMenuBarHoverBG(setting_value);
            } else if (setting_name === "sideBarHoverTextColor") {
              setMenuBarHoverTextColor(setting_value);
            } else if (setting_name === "menuBarActiveBackgroundColor") {
              setMenuBarActiveBG(setting_value);
            } else if (setting_name === "sideBarActiveTextColor") {
              setMenuBarActiveTextColor(setting_value);
            }
          });
        }
      }
    }, [isError, isLoading, data]);
  
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
        <div style={{ backgroundColor: menuBarBackground || "#cc0000" }}>
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center">
              <span className="text-2xl text-gray-50 font-bold font-mono mr-4">
                X Alumni
              </span>
              <button
                className="md:hidden text-gray-50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
              <nav
                className={`${
                  isMenuOpen ? "block" : "hidden"
                } md:flex flex-col md:flex-row md:space-x-8 absolute md:relative top-12 left-0 md:top-auto md:left-auto w-full md:w-auto bg-gray-800 md:bg-transparent`}
              >
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      componentClicked.name === item.name ? "" : "",
                      "group flex items-center gap-x-2 rounded-md px-4 py-2 text-sm font-semibold"
                    )}
                    style={{
                      color:
                        componentClicked.name === item.name
                          ? menuBarActiveTextColor || "#FFFFFF"
                          : menuBarTextColor || "#ccc",
                      backgroundColor:
                        componentClicked.name === item.name
                          ? menuBarActiveBG || "#4B5563"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color =
                        menuBarHoverTextColor || "#FFFFFF";
                      e.currentTarget.style.backgroundColor =
                        menuBarHoverBG || "#4B5563";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color =
                        componentClicked.name === item.name
                          ? menuBarActiveTextColor || "#FFFFFF"
                          : menuBarTextColor || "#ccc";
                      e.currentTarget.style.backgroundColor =
                        componentClicked.name === item.name
                          ? menuBarActiveBG || "#4B5563"
                          : "transparent";
                    }}
                    onClick={() => handleNavigationItemClick(item.name)}
                  >
                    <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <a
                href="#"
                className="text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-semibold"
              >
                <ArrowLongLeftIcon
                  className="h-6 w-6 inline"
                  aria-hidden="true"
                />
                Logout
              </a>
            </div>
          </div>
        </div>
  
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <ComponentRender
              page={componentClicked.name}
              onPageSet={handlePageSet}
            />
          </div>
        </main>
      </>
    );
  }
  
  export default UserMenuBar;
  