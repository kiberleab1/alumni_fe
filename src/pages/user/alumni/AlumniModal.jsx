import React from "react";
import { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { TfiEmail } from "react-icons/tfi";
import { FaCheck, FaUserFriends, FaUserPlus } from "react-icons/fa";
import { FcBusinessman, FcBusinesswoman, FcCancel } from "react-icons/fc";
import { getImageBaseUrl, requestConnection, updateConnection } from "src/api";
import { useMutation, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { BiMessageAltDetail } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineCloseFullscreen } from "react-icons/md";

const AlumniModal = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const queryClient = useQueryClient();
  const mutation = useMutation(requestConnection, {
    onSuccess: () => {
      queryClient.invalidateQueries("requestConnection");
      toast.success("Connection Request successfully!");
    },
    onError: (err) => {
      console.error(err);
      if (
        err?.response?.data?.message &&
        err?.response?.data?.message === "Request already sent."
      ) {
        toast.warning(err?.response?.data?.message);
      } else {
        toast.error("An error occurred while sending the request.");
      }
    },
  });

  const handleSubmit = () => {
    mutation.mutate(profile.user_id);
  };

  const { mutate: updateConnectionStatus } = useMutation(updateConnection, {
    onSuccess: () => {
      queryClient.invalidateQueries("requestConnection");
    },
    onError: (error) => {
      queryClient.invalidateQueries("requestConnection");
      console.error("Error request action:", error);
      toast.error("Error in request action!");
    },
  });

  const handleCancelRequest = () => {
    const updateData = {
      status: "declined",
      id: profile?.connection_data?.id,
    };
    updateConnectionStatus(updateData);

    toast.info("Connection Request canceled.");
  };

  const renderConnectionButton = () => {
    if (
      (typeof profile?.connection_data === "string" &&
        profile?.connection_data === "No Connection Data") ||
      (typeof profile?.connection_data === "object" &&
        profile?.connection_data?.status === "declined")
    ) {
      return (
        <div className="flex flex-rows gap-2 items-center justify-center w-full ">
          <button
            className="bg-sky-50 hover:bg-sky-100 border-2 border-sky-500 w-1/2 justify-center  py-2 px-4 rounded-l-lg mt-4 flex items-center gap-2"
            onClick={handleSubmit}
          >
            <FaUserPlus className="text-sky-500" />{" "}
            <span className="text-black">Send Request</span>
          </button>
          <button
            className="bg-sky-50 hover:bg-sky-100 border-2 border-sky-500 w-1/2  text-black  py-2 px-4 rounded-l-lg mt-4 flex justify-center items-center gap-2"
            onClick={handleSubmit}
          >
            <BiMessageAltDetail className="text-sky-500" /> Message
          </button>
        </div>
      );
    } else if (
      typeof profile?.connection_data === "object" &&
      profile?.connection_data?.status === "pending"
    ) {
      return (
        <div className="flex flex-rows gap-2 items-center justify-center w-full">
          <button
            className="bg-gray-200 w-1/2 text-black hover:bg-green-100  border-solid border-2 border-sky-500 py-2 xl:px-4 rounded-l-lg mt-4 flex justify-center items-center gap-2"
            disabled
          >
            <FaCheck className="text-green-600" />{" "}
            <span className="text-sm line-clamp-1">Request Sent</span>
          </button>
          <button
            className="bg-gray-200  text-black hover:bg-red-100 w-1/2 border-solid border-2 border-sky-500   xl:px-4 py-2 rounded-l-lg mt-4 flex xl:justify-center xl:items-center gap-1"
            onClick={handleCancelRequest}
          >
            <FcCancel className="" />
            <span className="text-sm  w-[100%] line-clamp-1">
              Cancel request
            </span>
          </button>
        </div>
      );
    } else if (
      typeof profile?.connection_data === "object" &&
      profile?.connection_data?.status === "accepted"
    ) {
      return (
        <div className="text-green-500 font-bold py-2 px-2 mt-2 w-full">
          {/* You are friends with {profile?.user_data?.name || "this user"}. */}
          <button className="flex-row w-full bg-white hover:bg-blue-700  text-black border-2 border-sky-500 justify-center font-serif text-lg py-2 px-4 rounded-l-lg mt-2 flex items-center gap-2">
            <BiMessageAltDetail className="text-sky-500 text-xl" /> Message
          </button>
        </div>
      );
    }
  };

  return (
    <div className="fixed md:absolute inset-0 flex justify-center items-start md:items-center z-50 bg-black bg-opacity-50 overflow-scroll ">
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 md:p-12 relative mx-4 my-8 md:mx-8 md:my-12 lg:mx-12 lg:my-16"
        data-aos="fade-down"
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-600 hover:text-gray-800 z-40 bg-white "
        >
          <MdOutlineCloseFullscreen className="text-2xl" />
        </button>
        <div className="relative flex flex-col items-center ">
          <div className="absolute w-full h-36 top-0 bg-black -z-0 "></div>
          <div className="relative rounded-full mt-4 border-4 border-white w-52 h-52 flex items-center justify-center ">
            {profile?.user_photo &&
            profile?.user_photo.startsWith("uploads/") ? (
              <img
                src={getImageBaseUrl(profile?.user_photo)}
                alt={profile?.user_id}
                className="w-full h-full rounded-full object-cover"
              />
            ) : profile?.user_data?.gender === "male" ? (
              <FcBusinessman className="w-full h-full rounded-full" />
            ) : profile?.user_data?.gender === "female" ? (
              <FcBusinesswoman className="w-full h-full rounded-full" />
            ) : (
              <FcBusinessman className="w-full h-full rounded-full " />
            )}

            <div className="absolute bottom-0 right-0 transform -translate-y-2/3 translate-x-3 border-2 border-sky-400 rounded-full">
              <div className="bg-white text-sky-300 p-1 rounded-full  w-10 h-10  flex items-center justify-center font-extrabold text-3xl outline-offset-4">
                <FaUserPlus className="bg-black hover:bg-gray-500  w-full h-full rounded-full" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl mt-4 font-sans">
            {profile?.user_data?.name
              ? profile?.user_data?.name
              : "Helen Getachew"}
          </h2>
          <div className="flex items-center gap-2 justify-center h-full w-full hover:text-blue-900 mt-2 ">
            <TfiEmail className="w-6 h-6 my-auto text-green-200" />
            <a
              className="text-lg text-blue-600"
              href={`mailto:${profile?.user_data?.email}`}
            >
              {profile?.user_data?.email
                ? profile?.user_data?.email
                : "helengetachew@gmail.com"}
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
              href={`tel:${profile?.user_data?.phone_number}`}
              className="text-blue-400 underline text-left"
            >
              {profile?.user_data?.phone_number
                ? profile?.user_data?.phone_number
                : "+251 900 000 000"}
            </a>
          </div> */}

          {/* Render connection button based on connection_data */}
          {renderConnectionButton()}

          <div className="w-full mt-6">
            <Table className="text-left w-full">
              <tbody>
                <tr>
                  <th className="w-1/4">Degree</th>
                  <td>{profile.degree}</td>
                </tr>
                <tr>
                  <th className="w-1/4">Graduation Date</th>
                  <td>{profile.graduation_year.split("T")[0]}</td>
                </tr>
                <tr>
                  <th className="w-1/4">Location</th>
                  <td>
                    {profile?.user_data?.address?.country || "Ethiopia"},
                    {profile?.user_data?.address?.region || "Addis Ababa"},
                    {profile?.user_data?.address?.city || "Addis Ababa"}
                  </td>
                </tr>
                <tr>
                  <th className="w-1/4">Department</th>
                  <td>{profile.department_name}</td>
                </tr>
                <tr>
                  <th className="w-1/4">Skills</th>
                  <td>{profile.Skills}</td>
                </tr>
                <tr>
                  <th className="w-1/4">Language</th>
                  <td>{profile.Language}</td>
                </tr>
                <tr>
                  <th className="w-1/4">Phone</th>
                  <td>
                    {" "}
                    <a
                      href={`tel:${profile?.user_data?.phone_number}`}
                      className="text-blue-400 underline text-left"
                    >
                      {profile?.user_data?.phone_number
                        ? profile?.user_data?.phone_number
                        : "+251 900 000 000"}
                    </a>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AlumniModal;
