import React from "react";
import { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { TfiEmail } from "react-icons/tfi";
import { FaUserFriends, FaUserPlus } from "react-icons/fa";
import { FcBusinessman, FcBusinesswoman } from "react-icons/fc";
import { getImageBaseUrl, requestConnection, updateConnection } from "src/api";
import { useMutation, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";

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
      if (err?.response?.data?.message && err?.response?.data?.message === "Request already sent.") {
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
      status: 'declined',
      id: profile?.connection_data?.id,
    };
    updateConnectionStatus(updateData);

    toast.info("Connection Request canceled.");
  };

  const renderConnectionButton = () => {
    if ((typeof profile?.connection_data === "string" && profile?.connection_data === "No Connection Data") || (typeof profile?.connection_data === "object" && profile?.connection_data?.status === "declined")) {
      return (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4 flex items-center gap-2"
          onClick={handleSubmit}
        >
          <FaUserPlus /> Send Connection Request
        </button>
      );
    } else if (typeof profile?.connection_data === "object" && profile?.connection_data?.status === "pending") {
      return (
        <>
          <button
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded-full mt-4 flex items-center gap-2"
            disabled
          >
            Connection Already Sent
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-4 flex items-center gap-2"
            onClick={handleCancelRequest}
          >
            Cancel Connection Request
          </button>
        </>
      );
    } else if (typeof profile?.connection_data === "object" && profile?.connection_data?.status === "accepted") {
      return (
        <div className="text-green-500 font-bold py-2 px-4 mt-4">
          You are already friends with {profile?.user_data?.name || "this user"}.
        </div>
      );
    }
  };

  return (
    <div className="fixed md:absolute inset-0 flex justify-center items-start md:items-center z-50 bg-black bg-opacity-50 overflow-scroll ">
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
        <div className="flex flex-col items-center ">
          <div className="relative rounded-full mt-4 border-4 border-transparent w-52 h-52 flex items-center justify-center ">
            {profile?.user_photo && profile?.user_photo.startsWith("uploads/") ? (
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

            <div className="absolute bottom-0 right-0 transform -translate-y-2/3 ">
              <div className="bg-black text-white rounded-full border-2 border-black w-8 h-8 flex items-center justify-center font-extrabold text-3xl outline-offset-4">
                <FaUserPlus />
              </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl mt-4 font-sans">
            {profile?.user_data?.name ? profile?.user_data?.name : "Helen Getachew"}
          </h2>
          <div className="flex items-center hover:text-blue-700 mt-2">
            <TfiEmail className="w-6 h-6 mr-2 mb-2" />
            <a className="text-lg text-blue-500" href={`mailto:${profile?.user_data?.email}`}>
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
            <a href={`tel:${profile?.user_data?.phone_number}`} className="text-blue-400 underline text-left">
              {profile?.user_data?.phone_number ? profile?.user_data?.phone_number : "+251 900 000 000"}
            </a>
          </div>

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
