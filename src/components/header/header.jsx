import { Button, Input, InputGroup } from "reactstrap";

const Header = () => {
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
    <div className="flex flex-column z-10">
      <div className="bg-green-400 flex justify-end">
        <InputGroup className="w-1/5 ">
          <Input />
          <Button>
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
      </div>
      <nav className="bg-gray-800 flex justify-center space-x-8 pb-2 pt-8 ">
        <ul className="flex z-10">
          {links.map((mainLink, idx) => {
            return (
              <li className="relative group" key={idx}>
                <a
                  href={mainLink.link}
                  className="uppercase block py-2 px-4 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
                >
                  {mainLink.name}
                </a>
                <div className="hidden group-hover:block absolute bg-gray-800 py-2">
                  {mainLink.subLink.map((subLink, idx) => {
                    return (
                      <a
                        href={subLink.link}
                        key={idx + subLink.name}
                        className="uppercase block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
                      >
                        {subLink.name}
                      </a>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
