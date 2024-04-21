import { InputGroup, Input, Button } from "reactstrap";

const Navbar = () => {
  return (
    <div className="flex flex-column">
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
        <ul className="flex">
          <li className="relative group">
            <a
              href="#"
              className="block py-2 px-4 text-gray-300 hover:text-yellow-400 transition-colors duration-500 "
            >
              ABOUT US
            </a>
            <div className="hidden group-hover:block absolute bg-gray-800 py-2 ">
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                CONTACT
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                DIRECTORY
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                GALLERY
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                NEWS
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                TYPOGRAPHY
              </a>
            </div>
          </li>
          <li className="relative group">
            <a
              href="#"
              className="block py-2 px-4 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
            >
              PROGRAM & EVENTS
            </a>
            <div className="hidden group-hover:block absolute bg-gray-800 py-2">
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                SPONSORSHIP
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                LATEST MEMBERS
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                ALUMNI PROFILE
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                ALUMNI LOGIN
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                ALUMNI REGISTER
              </a>
            </div>
          </li>
          <li className="relative group text-nowrap">
            <a
              href="#"
              className="block py-2 px-4 text-gray-300  hover:text-yellow-400 transition-colors duration-500"
            >
              ALUMNI STORIES
            </a>
            <div className="hidden group-hover:block absolute bg-gray-800 py-2">
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                RESTRICTED MATERIALS
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                WORLD LEVEL MENTORS
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                IMAGE ALIGNMENT
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                SPECIAL CHARACTERS
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                TEXT ALIGNMENT
              </a>
            </div>
          </li>
          <li className="relative group">
            <a
              href="#"
              className="block py-2 px-4 text-gray-300  hover:text-yellow-400 transition-colors duration-500 "
            >
              CAREER OPPORTUNITY
            </a>
            <div className="hidden group-hover:block absolute bg-gray-800 py-2">
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                APPLY TO JOB
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                APPLY TO BOEING
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-300 hover:text-yellow-400 transition-colors duration-500"
              >
                GOOGLE DEVELOPERS
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
