import { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { CiEdit, CiSaveDown1, CiSaveUp1 } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import AOS from "aos";
import "aos/dist/aos.css";
import "./css/almnuIProfileAnim.css";
import { useQuery } from "react-query";
import { getAlumniProfileById, getImageBaseUrl } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { SlOptionsVertical } from "react-icons/sl";
import { MdOutlineReadMore } from "react-icons/md";
import { FaUserEdit, FaUserFriends } from "react-icons/fa";
import { FaCodePullRequest } from "react-icons/fa6";
import { LuServer } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

const AlumniProfile = ({ onCreateAlumniClick, onEditAlumniClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOptionOpen, setOptionOpen] = useState(false);
  const [absolutePos, setabsolutePos] = useState(false);

  const user_id = "92faa361-3246-4f11-acae-cdb599a0d200";
  const { isError, data, isLoading } = useQuery(
    ["getAlumniProfileById"],
    () => getAlumniProfileById(user_id),
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdown = () => {
    setOptionOpen((prev) => !prev);
    console.log(isOptionOpen);
  };
  SlOptionsVertical;
  const toggleOverlay = () => {
    setabsolutePos(!absolutePos);
    setOptionOpen(false);
  };
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: false,
    });
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      {data != null && data?.data && data?.data?.graduation_year ? (
        <div
          className="relative flex flex-col items-center  min-h-screen  m-auto w-[100%] xl:w-[70%] z-0 bg-gray-100"
          data-aos="fade-down"
        >
          <div className="absolute bg-gray-900 h-[18%] w-[100%]  z-10 rounded-t-xl"></div>
          <div className="absolute top-0 right-0 z-40 ">
            <SlOptionsVertical
              onClick={() => toggleDropdown()}
              className="text-xl text-white m-2"
            />
          </div>
          {isOptionOpen && (
            <div className=" absolute rounded-md right-2 mt-11 ml-5 w-48 bg-white border border-gray-300 shadow-lg z-50 ">
              <div className=" absolute right-1  rotate-45 -translate-y-1/3 w-6 h-6   bg-white overflow-x-hidden -z-40"></div>
              <ul className="text-black p-2 z-10">
                <li
                  className="px-4 py-2 flex flex-row gap-3 hover:bg-gray-100 z-50 overflow-hidden "
                  onClick={() => onEditAlumniClick(data?.data)}
                >
                  <FaUserEdit className="text-xl overflow-hidden " />
                  Edit
                </li>
                <li className="px-4 py-2 flex flex-row gap-3 hover:bg-gray-100">
                  {" "}
                  <FaUserFriends className="text-xl " /> Connections{" "}
                </li>
                <li className="px-4 py-2 flex flex-row gap-3 hover:bg-gray-100">
                  {" "}
                  <FaCodePullRequest className="text-xl " /> Option 4
                </li>
                <li
                  className=" xl:hidden px-4 py-2 flex flex-row gap-3 hover:bg-gray-100"
                  onClick={toggleOverlay}
                >
                  {" "}
                  <LuServer className="text-xl " /> Information
                </li>
              </ul>
            </div>
          )}
          <div className="relative flex flex-col items-center justify-center gap-3 w-[100%] lg:min-w-[80%]">
            {/* <div className="absolute bg-gray-600 h-[45%] w-[90%] xl:w-[70%] z-0"></div> */}
            <h1 className="text-3xl sm:text-5xl font-normal text-white  mt-2 z-50">
              Alumni Profile
            </h1>
            {/* <div>
              <CiEdit
                className="text-2xl"
                onClick={() => onEditAlumniClick(data?.data)}
              />
            </div> */}{" "}
            <img
              src={getImageBaseUrl(data?.data?.user_photo)}
              alt={data?.data?.user_id}
              className="w-40 h-40 md:w-52 md:h-52 rounded-full mt-3 object-cover z-40 border-4 border-gray-200 shadow-lg shadow-blue-500/50 "
            />
          </div>

          <h2 className="text-2xl xl:4xl mt-2 font-lora">
            {data?.data?.user_data?.name}
          </h2>

          <div className="flex items-center hover:text-blue-700 mt-">
            <a
              className="text-lg text-gray-500 flex flex-row gap-2 font-serif"
              href="mailto:helengetachew@gmail.com"
            >
              <TfiEmail className="text-md lg:text-xl m-auto  " />
              {data?.data?.user_data?.email}
            </a>
          </div>

          {/* <div className="flex items-center hover:text-blue-700">
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
            <a
              href="tel:+251 900 000 000"
              className="text-gray-350 underline ml-2 text-md"
            >
              {data?.data?.user_data?.phone_number}
            </a>
          </div> */}

          <div className="border-b w-1/2 my-2 border-gray-300"></div>

          <div className="relative w-full max-w-[1150px] overflow-hidden">
            <div className="flex flex-row justify-start mx-auto transition-all duration-500 ease-in-out ">
              <div
                className={`transition-all duration-500 ease-in-out w-[100%] xl:w-[50%] ${
                  isOpen
                    ? "translate-x-[-0%] m-auto  "
                    : "translate-x-[0%] sm:translate-x-[55%]"
                }`}
              >
                <div className="min-w-full rounded-lg p-6 max-w-sm  items-start w-[50%]">
                  <div className="mb-4  text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Degree
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.degree}
                    </div>
                  </div>
                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Graduation Date
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.graduation_year.split("T")[0]}
                    </div>
                  </div>

                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Location
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.user_data?.address?.country ?? "Ethiopia"},{" "}
                      {data?.data?.user_data?.address?.region ?? "Addis Ababa"},{" "}
                      {data?.data?.user_data?.address?.city ?? "Addis Ababa"}{" "}
                    </div>
                  </div>
                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Department
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.department_name}
                    </div>
                  </div>
                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Skills
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.Skills}
                    </div>
                  </div>
                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Language
                    </div>

                    <div className="flex gap-2 mt-1">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        English
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Spanish
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Node.js
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        SQL
                      </span>
                    </div>
                  </div>

                  <div className="text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Phone
                    </div>
                    <div className="text-sm text-gray-600">
                      <a
                        href="tel:+251 900 000 000"
                        className="text-gray-600 underline ml-2 text-md"
                      >
                        {data?.data?.user_data?.phone_number}
                      </a>
                    </div>
                  </div>
                </div>

                {/* <Table className="text-left">
                  <tbody>
                    <tr>
                      <th className="w-1/4">Degree</th>
                    </tr>
                    <tr className="bg-blue-300">
                      <td className="transform transition-transform duration-300 hover:translate-x-5">
                        {data?.data?.degree}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-1/4">Graduation Date</th>
                    </tr>
                    <tr className="bg-blue-300">
                      <td className="transform transition-transform duration-300 hover:translate-x-5">
                      
                        {data?.data?.graduation_year.split("T")[0]}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-1/4">Location</th>
                    </tr>
                    <tr className="bg-blue-300">
                      <td className="transform transition-transform duration-300 hover:translate-x-5">
                      
                        {data?.data?.user_data?.address?.country ?? "Ethiopia"},{" "}
                        {data?.data?.user_data?.address?.region ??
                          "Addis Ababa"}
                        ,{" "}
                        {data?.data?.user_data?.address?.city ?? "Addis Ababa"}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-1/4">Department</th>
                    </tr>
                    <tr className="bg-blue-300">
                      <td className="transform transition-transform duration-300 hover:translate-x-5">
                        {data?.data?.department_name}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-1/4">Skills</th>
                    </tr>
                    <tr className="bg-blue-300">
                      <td className="transform transition-transform duration-300 hover:translate-x-5">
                        {data?.data?.Skills}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-1/4">Language</th>
                    </tr>
                    <tr className="bg-blue-300">
                      <td className="transform transition-transform duration-300 hover:translate-x-5">
                        {data?.data?.Language}
                      </td>
                    </tr>
                  </tbody>
                </Table> */}
              </div>

              {isOpen && (
                <div className="hidden relative xl:flex items-center ">
                  <div className="w-[2px] bg-black  hidden xl:block h-full mx-4 z-0"></div>
                  {isOpen ? (
                    <MdOutlineReadMore
                      className="z-50 p-2  w-full rounded-[50%] h-auto my-auto items-center justify-center mx-auto absolute text-black  bg-gray-200  rotate-180 text-2xl top-1/2 transform -translate-y-1/2 translate-x-/2 cursor-pointer"
                      onClick={toggle}
                    />
                  ) : (
                    ""
                  )}
                </div>
              )}

              {isOpen && (
                <div
                  className={` transition-all duration-500  ease-in-out overflow-hidden hidden xl:block w-1/2 `}
                >
                  <div className="min-w-full rounded-lg p-6 max-w-sm w-[50%] ">
                    <div className="mb-4  text-end">
                      <div className="text-sm font-semibold text-gray-700">
                        Degree
                      </div>
                      <div className="text-sm text-gray-600">
                        {data?.data?.degree}
                      </div>
                    </div>
                    <div className="mb-4 text-end">
                      <div className="text-sm font-semibold text-gray-700">
                        Graduation Date
                      </div>
                      <div className="text-sm text-gray-600">
                        {data?.data?.graduation_year.split("T")[0]}
                      </div>
                    </div>
                    <div className="mb-4 text-end">
                      <div className="text-sm font-semibold text-gray-700">
                        Location
                      </div>
                      <div className="text-sm text-gray-600">
                        {data?.data?.user_data?.address?.country ?? "Ethiopia"},{" "}
                        {data?.data?.user_data?.address?.region ??
                          "Addis Ababa"}
                        ,{" "}
                        {data?.data?.user_data?.address?.city ?? "Addis Ababa"}{" "}
                      </div>
                    </div>
                    <div className="mb-4 text-end">
                      <div className="text-sm font-semibold text-gray-700">
                        Department
                      </div>
                      <div className="text-sm text-gray-600">
                        {data?.data?.department_name}
                      </div>
                    </div>
                    <div className="mb-4 text-end">
                      <div className="text-sm font-semibold text-gray-700">
                        Skills
                      </div>
                      <div className="text-sm text-gray-600">
                        {data?.data?.Skills}
                      </div>
                    </div>
                    <div className="mb-4 text-end">
                      <div className="text-sm font-semibold text-gray-700">
                        Language
                      </div>

                      <div className="flex flex-row-reverse it gap-2 mt-1">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          English
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Spanish
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Node.js
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          SQL
                        </span>
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="text-sm font-semibold text-gray-700">
                        Phone
                      </div>
                      <div className="text-sm text-gray-600">
                        <a
                          href="tel:+251 900 000 000"
                          className="text-gray-600 underline ml-2 text-md"
                        >
                          {data?.data?.user_data?.phone_number}
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* <Table className="text-left">
                    <tbody>
                      <tr>
                        <th className="w-1/4">Additional Info</th>
                      </tr>
                      <tr className="bg-blue-300">
                        <td className="transform transition-transform duration-300 hover:translate-x-5">
                          {data?.data?.additionalInfo}
                        </td>
                      </tr>
                    </tbody>
                  </Table> */}
                </div>
              )}
            </div>
          </div>
          {/* 
          <button className="block xl:hidden" onClick={toggleOverlay}>
            close
          </button> */}
          {!isOpen && (
            <div
              className={`hidden xl:flex border-none ${
                isOpen
                  ? "hidden"
                  : "text-black bg-inherit text-3xl py-2 px-4 mt-4 border"
              }`}
              style={{
                animation: "zoomInOut 2s infinite",
                transformOrigin: "center",
              }}
              onClick={toggle}
            >
              {isOpen ? (
                ""
              ) : (
                <MdOutlineReadMore className="text-black rotate-360 hover:text-red-400" />
              )}
            </div>
          )}

          {absolutePos && (
            <div className="absolute h-full w-[100%] xl:hidden top-0 z-50 bg-gray-100 flex items-center justify-center">
              <button
                className="absolute right-0 top-0 m-2 bg-gray-100 "
                onClick={toggleOverlay}
              >
                <IoMdClose className="text-black " />
              </button>
              <div
                className={` h-full w-[95%] transition-all duration-500 ease-in-out `}
              >
                <div className="min-w-full rounded-lg p-6 max-w-sm  items-start w-[50%]">
                  <div className="mb-4  text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Degree
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.degree}
                    </div>
                  </div>
                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Graduation Date
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.graduation_year.split("T")[0]}
                    </div>
                  </div>

                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Location
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.user_data?.address?.country ?? "Ethiopia"},{" "}
                      {data?.data?.user_data?.address?.region ?? "Addis Ababa"},{" "}
                      {data?.data?.user_data?.address?.city ?? "Addis Ababa"}{" "}
                    </div>
                  </div>
                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Department
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.department_name}
                    </div>
                  </div>
                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Skills
                    </div>
                    <div className="text-sm text-gray-600">
                      {data?.data?.Skills}
                    </div>
                  </div>
                  <div className="mb-4 text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Language
                    </div>

                    <div className="flex gap-2 mt-1">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        English
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Spanish
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Node.js
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        SQL
                      </span>
                    </div>
                  </div>

                  <div className="text-start">
                    <div className="text-sm font-semibold text-gray-700">
                      Phone
                    </div>
                    <div className="text-sm text-gray-600">
                      <a
                        href="tel:+251 900 000 000"
                        className="text-gray-600 underline ml-2 text-md"
                      >
                        {data?.data?.user_data?.phone_number}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">
              NO ALUMNI PROFILE FOUND
            </h1>
            <p className="text-gray-600 mb-6">
              It looks like you haven't filled out your alumni profile yet.
              <br />
              Please take a moment to create your profile and connect with other
              alumni.
            </p>
            <button
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              onClick={onCreateAlumniClick}
            >
              CREATE ALUMNI
            </button>
          </div>
        </div>
      )}
    </QueryResult>
  );
};

export default AlumniProfile;
