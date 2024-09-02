import { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { CiEdit, CiSaveDown1, CiSaveUp1 } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import AOS from "aos";
import "aos/dist/aos.css";

const AlumniProfile = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: false,
    });
  });
  return (
    <div
      className="flex flex-col items-center  min-h-screen"
      data-aos="fade-down"
    >
      <div className="flex flex-row items-center justify-center gap-3 min-w-[80%]">
        <h1 className="text-5xl font-normal">Alumni Profile</h1>
        <div>
          <CiEdit className="text-2xl " />
        </div>
      </div>

      <img
        src="../../public/profile_pic.jpg"
        alt="profile picture"
        className="w-48 h-48 rounded-full mt-4"
      />

      <h2 className="text-4xl  mt-2 font-sans">Helen Getachew </h2>
      <div className="flex items-center  hover:text-blue-700 mt-2">
        <a
          className="text-lg text-gray-500 flex flex-row gap-3"
          href="mailto:helengetachew@gmail.com"
        >
          <TfiEmail className="text-2xl " />
          helengetachew@gmail.com{" "}
        </a>
      </div>

      <div className="flex items-center hover:text-blue-700">
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
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
          />
        </svg>
        <a href="tel:+251 900 000 000" className="text-gray-350 underline ml-2">
          +251 900 000 000
        </a>
      </div>

      <div className="border-b w-1/2 my-2 border-gray-300 "></div>
      <div className="">
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden border-b-4 min-w-[550px] ${
            isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Table className="text-left">
            <tbody>
              <tr>
                <th className="w-1/4">Degree</th>
              </tr>
              <tr className="bg-blue-300">
                <td className="transform transition-transform duration-300 hover:translate-x-5 ">
                  Sociology
                </td>
              </tr>
              <tr>
                <th className="w-1/4">Graduation Date</th>
              </tr>
              <tr className="bg-blue-300">
                <td className="transform transition-transform duration-300 hover:translate-x-5 ">
                  2022-10-15
                </td>
              </tr>
              <tr>
                <th className="w-1/4">Location</th>
              </tr>
              <tr className="bg-blue-300">
                <td className="transform transition-transform duration-300 hover:translate-x-5  ">
                  Shashamane
                </td>
              </tr>
              <tr>
                <th className="w-1/4">Department</th>
              </tr>
              <tr className="bg-blue-300">
                <td className="transform transition-transform duration-300 hover:translate-x-5  max-w-[500px]">
                  Human behaviour and development studies
                </td>
              </tr>
              <tr>
                <th className="w-1/4">Skills</th>
              </tr>
              <tr className="bg-blue-300">
                <td className="transform transition-transform duration-300 hover:translate-x-5 max-w-[500px] ">
                  Communication, Leadership, Listening, Team-work, Negotiation,
                  Speaking Leadership, Listening, Team-work, Negotiation,
                  Speaking
                </td>
              </tr>
              <tr>
                <th className="w-1/4 ">Language</th>
              </tr>
              <tr className="bg-blue-300">
                <td className="transform transition-transform duration-300 hover:translate-x-5  ">
                  English, Swahili, French
                </td>
              </tr>
              <tr>
                <th className="w-1/4">Resume</th>
              </tr>
            </tbody>
          </Table>
          <div className=" flex flex-col items-center text-center pb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="black"
              className="w-10 h-10"
            >
              <path
                fillRule="evenodd"
                d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm5.845 17.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V12a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
                clipRule="evenodd"
              />
              <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
            </svg>

            <a
              href="https://drive.google.com/file/d/1mXg4b5xI9XsGnqg0wQHb2K5JgUy5UxP6/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-300"
            >
              View Resume
            </a>
          </div>
        </div>
        <button
          className=" text-black bg-white text-3xl py-2 px-4 "
          onClick={toggle}
        >
          {isOpen ? (
            <CiSaveUp1 className="text-red-800 hover:text-red-400" />
          ) : (
            <CiSaveDown1 className="text-blue-800 hover:text-blue-400" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AlumniProfile;
