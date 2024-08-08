import { useEffect, useState } from "react";
// @ts-ignore
import _ from "lodash";
import { Button, Input, InputGroup } from "reactstrap";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [controlNavColor, setNavColor] = useState(false);
  const [isActive, setisActive] = useState(false);
  const [meanNav, setmeanNav] = useState(true);
  const [inputControler, setinputControler] = useState(false);
  const navHandler = () => {
    setisActive((prev) => !prev);
  };
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
      name: "about us",
      link: "/landing/aboutus",
      subLink: [
        {
          name: "contact",
          link: "/landing/aboutus/contact",
        },
        {
          name: "directory",
          link: "/landing/aboutus/directory",
        },
        {
          name: "gallery",
          link: "/landing/aboutus/gallery",
        },
        {
          name: "news",
          link: "/landing/aboutus/news",
        },
      ],
    },
    {
      name: "program & events",
      link: "/landing/events",
      subLink: [
        {
          name: "upcoming events",
          link: "/landing/events",
        },
        {
          name: "latest members",
          link: "/landing/program/members",
        },
        {
          name: "alumni profile",
          link: "/landing/program/profile",
        },
        {
          name: "alumni login",
          link: "/landing/program/login",
        },
        {
          name: "alumni register",
          link: "/landing/program/register",
        },
      ],
    },
    {
      name: "alumni stories",
      link: "/landing/alumni",
      subLink: [],
    },
    {
      name: "career opportunities",
      link: "/landing/career",
      subLink: [
        {
          name: "apply to job",
          link: "/landing/career/apply",
        },
      ],
    },
  ];
  return (
    <>
      <div className="bg-green-800 flex items-center justify-between text-white px-2 min-h-16">
        {!inputControler && (
          <div className="flex items-center">
            <Button
              className="md:hidden p-2 text-white bg-green-800 hover:bg-green-900 ml-2 transition duration-300 ease-in-out"
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
              ? "text-white hover:bg-green-900 p-2 text-left"
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
            ? "sticky top-0 flex flex-col opacity-100"
            : "opacity-0 -translate-y-4 pointer-events-none hidden"
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
              className={`transition duration-300 ease-in-out ${
                isActive
                  ? "absolute right-0 top-0 text-left bg-gray-800 p-1 w-full"
                  : "hidden md:flex z-50 p-1"
              }`}
            >
              {links.map((mainLink, idx) => (
                <li
                  className={`relative group transition-transform duration-300 ease-in-out ${
                    isActive
                      ? "justify-start hover:translate-x-1 hover:scale-70"
                      : "hover:translate-y-1 hover:scale-70 transition ease-in delay-300 text-xl w-fit block after:block after:content-[''] after:absolute after:h-[4px] after:bg-green-800 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                  }`}
                  key={idx}
                >
                  <a
                    href={mainLink.link}
                    className={`transition-colors duration-500 ease-in-out ${
                      isActive
                        ? "uppercase block py-2 px-1 text-gray-200 hover:text-yellow-400 transition ease-in delay-300 text-xl w-fit block after:block after:content-[''] after:absolute after:h-[4px] after:bg-green-800 after:w-1/5 after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                        : "text-lg md:text-xl uppercase block py-2 px-4 text-gray-200 hover:text-yellow-400"
                    }`}
                  >
                    {mainLink.name}
                  </a>

                  <div
                    className={`transition-transform duration-300 ease-in-out ${
                      isActive
                        ? "hidden group-hover:block relative right-15 bg-gray-700 m-0 p-0"
                        : "hidden transition ease-in delay-300 group-hover:block absolute right-15 bg-gray-800 py-2 p-0"
                    }`}
                  >
                    {mainLink.subLink.map((subLink, idx) => (
                      <a
                        onMouseOver={dropOptionsControl}
                        href={subLink.link}
                        key={idx + subLink.name}
                        className="uppercase block transition delay-300 hover:translate-x-1 px-4 py-2 text-yellow-100 hover:text-yellow-400 transition-colors duration-500"
                      >
                        {subLink.name}
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
