import { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { CiEdit, CiSaveDown1, CiSaveUp1 } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import AOS from "aos";
import "aos/dist/aos.css";
import { useQuery } from "react-query";
import { getAlumniProfileById } from "src/api";
import QueryResult from "src/components/utils/queryResults";

const AlumniProfile = () => {
  const [isOpen, setIsOpen] = useState(true);
  const user_id = "92faa361-3246-4f11-acae-cdb599a0d200";
  const { isError, data, isLoading } = useQuery(
    ["getAlumniProfileById"],
    () => getAlumniProfileById(user_id),
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const toggle = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: false,
    });
  });
  console.log(data)
  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>

      <div
        className="flex flex-col items-center min-h-screen"
        data-aos="fade-down"
      >
        <h1 className="text-5xl font-normal pt-8">Alumni Profile</h1>
        <img
          src={data?.data?.user_photo}
          alt={data?.data?.user_id}
          className="w-48 h-48 rounded-full mt-4"
        />
        <h2 className="text-4xl  mt-4 font-sans">{data?.data?.user_data?.name}</h2>
        <div className="flex items-center  hover:text-blue-700 mt-2">
          <TfiEmail className="w-6 h-6 mr-2 mb-2 " />

          <a
            className="text-lg text-blue-500"
            href="mailto:helengetachew@gmail.com"
          >
            {data?.data?.user_data?.email}
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
          <a href="tel:+251 900 000 000" className="text-blue-400 underline ml-2">
            {data?.data?.user_data?.phone_number}
          </a>
        </div>
        <div className="border-b w-1/2 my-2 border-gray-300 "></div>
        <div className="">
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden border-b-4  ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <Table className="text-left">
              <tbody>
                <tr>
                  <th className="w-1/4">Degree</th>
                </tr>
                <tr className="bg-blue-300">
                  <td className="transform transition-transform duration-300 hover:translate-x-5 ">
                    {data?.data?.degree}
                  </td>
                </tr>
                <tr>
                  <th className="w-1/4">Graduation Date</th>
                </tr>
                <tr className="bg-blue-300">
                  <td className="transform transition-transform duration-300 hover:translate-x-5 ">
                    {data?.data?.graduation_year.split('T')[0]}
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
                  <td className="transform transition-transform duration-300 hover:translate-x-5  ">
                    {data?.data?.department_name}
                  </td>
                </tr>
                <tr>
                  <th className="w-1/4">Skills</th>
                </tr>
                <tr className="bg-blue-300">
                  <td className="transform transition-transform duration-300 hover:translate-x-5  ">
                    {data?.data?.Skills}
                  </td>
                </tr>
                <tr>
                  <th className="w-1/4 ">Language</th>
                </tr>
                <tr className="bg-blue-300">
                  <td className="transform transition-transform duration-300 hover:translate-x-5  ">
                    {data?.data?.Language}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </QueryResult>

  );
};

export default AlumniProfile;
