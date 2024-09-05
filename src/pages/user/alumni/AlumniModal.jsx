import React from "react";
import { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { CiSaveDown1, CiSaveUp1 } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import AOS from "aos";
import "aos/dist/aos.css";
import { FcBusinessman } from "react-icons/fc";
import { FcBusinesswoman } from "react-icons/fc";
import { getImageBaseUrl } from "src/api";
const AlumniModal = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;
  console.log(profile);
  return (
    <div className="absolute inset-0 flex justify-center items-start md:items-center z-50 bg-black bg-opacity-50 h-auto ">
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 md:p-8 relative mx-4 my-8 md:mx-8 md:my-12 lg:mx-12 lg:my-16"
        data-aos="fade-down"
      >
        <button
          onClick={onClose}
          className="absolute bg-white top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <div className="rounded-full mt-4">
            {profile?.user_photo && profile?.user_photo.startsWith("uploads/") ? (
              <img
                src={getImageBaseUrl(profile?.user_photo)}
                alt={profile?.user_id}
                className="w-48 h-48 rounded-full mt-4"
              />
            ) : profile?.user_data?.gender === "male" ? (
              <FcBusinessman className="rounded-full object-cover w-full h-[130px] z-10" />
            ) : profile?.user_data?.gender === "female" ? (
              <FcBusinesswoman className="rounded-full object-cover w-full h-[130px] z-10" />
            ) : (
              <FcBusinessman className="rounded-full object-cover w-full h-[130px] z-10" />
            )     
          }
          </div>
          <h2 className="text-3xl md:text-4xl mt-4 font-sans">
            {profile?.user_data?.name ? profile?.user_data?.name : "Helen Getachew"}
          </h2>
          <div className="flex items-center hover:text-blue-700 mt-2">
            <TfiEmail className="w-6 h-6 mr-2 mb-2" />
            <a
              className="text-lg text-blue-500"
              href="mailto:helengetachew@gmail.com"
            >
              {profile?.user_data?.email ? profile?.user_data?.email : "helengetachew@gmail.com"}
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
            <a
              href="tel:+251 900 000 000"
              className="text-blue-400 underline text-left"
            >
              {profile?.user_data?.phone_number ? profile?.user_data?.phone_number : "+251 900 000 000"}
            </a>
          </div>
          <div className="border-b w-full my-2 border-gray-300"></div>
          <div className="w-full">
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden border-b-4 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <Table className="text-left w-full">
                <tbody>
                  <tr>
                    <th className="w-1/4">Degree</th>
                  </tr>
                  <tr className="bg-blue-300">
                    <td className="transform transition-transform duration-300 hover:translate-x-5">
                      {profile.degree}
                    </td>
                  </tr>
                  <tr>
                    <th className="w-1/4">Graduation Date</th>
                  </tr>
                  <tr className="bg-blue-300">
                    <td className="transform transition-transform duration-300 hover:translate-x-5">
                      {profile.graduation_year.split("T")[0]}
                    </td>
                  </tr>
                  <tr>
                    <th className="w-1/4">Location</th>
                  </tr>
                  <tr className="bg-blue-300">
                    <td className="transform transition-transform duration-300 hover:translate-x-5">
                    {profile?.user_data?.address?.country ? profile?.user_data?.address?.country : "Ethiopia"}, {profile?.user_data?.address?.region ? profile?.user_data?.address?.region : "Addis Ababa"}, {profile?.user_data?.address?.city ? profile?.user_data?.address?.city : "Addis Ababa"}
                    </td>
                  </tr>
                  <tr>
                    <th className="w-1/4">Department</th>
                  </tr>
                  <tr className="bg-blue-300">
                    <td className="transform transition-transform duration-300 hover:translate-x-5">
                      {profile.department_name}
                    </td>
                  </tr>
                  <tr>
                    <th className="w-1/4">Skills</th>
                  </tr>
                  <tr className="bg-blue-300">
                    <td className="transform transition-transform duration-300 hover:translate-x-5">
                      {profile.Skills}
                    </td>
                  </tr>
                  <tr>
                    <th className="w-1/4">Language</th>
                  </tr>
                  <tr className="bg-blue-300">
                    <td className="transform transition-transform duration-300 hover:translate-x-5">
                      {profile.Language}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniModal;
