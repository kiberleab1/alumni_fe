import { useEffect, useState } from "react";
// @ts-ignore
import _ from "lodash";
import { Button, Input, InputGroup } from "reactstrap";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [controlNavColor, setNavColor] = useState(false);
  const [isActive, setisActive] = useState(false);
  const [meanNav, setmeanNav] = useState(true);
  const [inputControler, setinputControler] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setisActive(false);
  };
  const navHandler = () => {
    setisActive((prev) => !prev);
    setIsSidebarOpen(true);
  };
  console.log(isActive, isSidebarOpen);

  const handleResize = _.debounce(() => {
    setWindowWidth(window.innerWidth);
  }, 300);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    if (windowWidth > 768) {
      setisActive(false);
      setNavColor(true);
      setinputControler(true);
    } else {
      setNavColor(false);
      setinputControler(false);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);
  const dropOptionsControl = () => {};
  const links = [
    {
      name: "Home",
      link: "/landing",
      subLink: [],
    },
    {
      name: "About us",
      link: "/landing/aboutus",
      subLink: [
        {
          name: "Contact",
          link: "/landing/aboutus/contact",
        },
        {
          name: "Directory",
          link: "/landing/aboutus/directory",
        },
        {
          name: "Gallery",
          link: "/landing/aboutus/gallery",
        },
        {
          name: "News",
          link: "/landing/aboutus/news",
        },
      ],
    },
    {
      name: "Program & events",
      link: "/landing/events",
      subLink: [
        {
          name: "Upcoming events",
          link: "/landing/events",
        },
        {
          name: "Latest members",
          link: "/landing/program/members",
        },
        {
          name: "Alumni profile",
          link: "/landing/program/profile",
        },
        {
          name: "Alumni login",
          link: "/landing/program/login",
        },
        {
          name: "Alumni register",
          link: "/landing/program/register",
        },
      ],
    },
    {
      name: "Alumni stories",
      link: "/landing/alumni",
      subLink: [{ name: "Alumni podcast", link: "/landing/alumni/podcast" }],
    },
    {
      name: "Career opportunities",
      link: "/landing/career",
      subLink: [
        {
          name: "Apply to job",
          link: "/landing/career/apply",
        },
      ],
    },
  ];
  return (
    <>
      <div className="bg-green-800 flex items-center justify-between text-white px-2 min-h-16 ">
        {!inputControler && (
          <div className="flex items-center">
            <Button
              className="md:hidden p-2 text-white bg-green-800 hover:bg-green-900  transition duration-300 ease-in-out"
              onClick={navHandler}
            >
              {isActive ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        )}
        <div
          className={`transition duration-300 ease-in-out ${
            inputControler
              ? "text-white hover:bg-green-900 p-2 mr-2 text-left"
              : "text-right"
          }`}
        >
          Logo
        </div>

        {inputControler && (
          <InputGroup
            className={`transition duration-300 ease-in-out ${
              !controlNavColor ? "w-1/2 max-w-md" : "max-w-80"
            }`}
          >
            <Input className="rounded-l-lg border-green-800 ml-6" />
            <Button className="rounded-r-lg p-2 bg-green-800 h-13 transition-colors duration-300 ease-in-out hover:bg-green-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </Button>
          </InputGroup>
        )}
      </div>

      <div
        className={`absolute top-0 transition-all duration-500 ease-in-out ${
          meanNav
            ? "sticky top-0 flex flex-col opacity-100 z-40"
            : "opacity-0 -translate-y-4 pointer-events-none hidden z-40"
        } z-10`}
      >
        <div
          className={`transition duration-300 ease-in-out ${
            !controlNavColor && !isActive ? "hidden" : "block bg-gray-800"
          }`}
        >
          <nav
            className={`transition duration-300 ease-in-out ${
              isActive
                ? "flex space-x-8 justify-start pb-2 pt-8 relative z-50"
                : "flex justify-center space-x-8 pb-2 pt-8"
            }`}
          >
            <ul
              className={`transition duration-300 ease-in-out font-serif  ${
                isActive && isSidebarOpen
                  ? "absolute right-0 top-0 text-left bg-gray-800 p-1 w-full"
                  : "hidden md:flex z-50 p-1"
              }`}
            >
              {links.map((mainLink, idx) => {
                const isSubLinkActive = mainLink.subLink.some(
                  (subLink) => location.pathname === subLink.link
                );

                return (
                  <li
                    className={`relative group transition-transform duration-300 ease-in-out mr-2 ml-2  ${
                      isActive && isSidebarOpen
                        ? "justify-start hover:translate-x-1 hover:scale-70"
                        : "hover:translate-y-1 hover:scale-70 transition ease-in delay-300 text-xl w-fit block after:block after:content-[''] after:absolute after:h-[4px] after:bg-green-800 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                    }`}
                    key={idx}
                  >
                    <a
                      href={mainLink.link}
                      className={`flex flex-inline transition-colors duration-500 ease-in-out justify-center text-center ${
                        location.pathname === mainLink.link || isSubLinkActive
                          ? "text-yellow-600 "
                          : ""
                      } ${
                        isActive && isSidebarOpen
                          ? " block py-2  text-gray-200 hover:text-yellow-400 transition ease-in delay-300 text-xl w-fit block after:block after:content-[''] after:absolute after:h-[4px] after:bg-green-800 after:w-1/5 after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                          : "text-lg md:text-xl  block py-1 px-2 text-gray-200 hover:text-yellow-400"
                      }`}
                      onClick={toggleSidebar}
                    >
                      {mainLink.name}{" "}
                      {mainLink.subLink.length > 0 ? (
                        <RiArrowDropDownLine className=" m-auto group-hover:rotate-180 duration-500 pt-1 pb-1 text-3xl " />
                      ) : (
                        ""
                      )}
                    </a>
                    <div
                      className={`transition-all duration-1000 delay-200 ease-in-out max-h-0  overflow-hidden bg-opacity-0 group-hover:opacity-80  ${
                        isActive && isSidebarOpen
                          ? " group-hover:max-h-56 min-w-48 group-hover:block relative right-15 bg-opacity-50 m-0 p-0 rounded-b group-hover:bg-green-500"
                          : "group-hover:max-h-56 min-w-48 group-hover:opacity-100 group-hover:block absolute right-15 bg-opacity-80 rounded-b group-hover:bg-green-500"
                      }`}
                    >
                      {mainLink.subLink.map((subLink, idx) => (
                        <a
                          href={subLink.link}
                          key={idx + subLink.name}
                          className={`drop-shadow-sm text-start rounded-b group-hover:bg-gray-600 hover:text-gray-700  group-hover:bg-opacity-80 block transition delay-300 hover:translate-x-1 px-2 py-2 text-white transition-colors duration-500 ${
                            location.pathname === subLink.link
                              ? "text-yellow-600"
                              : ""
                          }`}
                          onClick={toggleSidebar}
                        >
                          {subLink.name}
                        </a>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
