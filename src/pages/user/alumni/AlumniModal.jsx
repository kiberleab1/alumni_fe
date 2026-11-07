import React from "react";
import { Link } from "react-router-dom";
import { profilePath } from "src/lib/nav";
import { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { TfiEmail } from "react-icons/tfi";
import { FaCheck, FaUserFriends, FaUserPlus } from "react-icons/fa";
import { FcAcceptDatabase, FcBusinessman, FcBusinesswoman, FcCancel } from "react-icons/fc";
import { apiErrorMessage, getConnectionStatus, getImageBaseUrl, respondToConnection, sendConnectionRequest } from "src/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { BiMessageAltDetail } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineCloseFullscreen } from "react-icons/md";

const AlumniModal = ({ isOpen, onClose, profile, onSelectChatClick }) => {
  const queryClient = useQueryClient();
  const peerId = profile?.user_id ? String(profile.user_id) : null;
  const peerName = profile?.user_data?.name || "this member";

  // live relationship with this person (the list row may be stale)
  const { data: rel, isLoading: relLoading } = useQuery(
    ["connectionStatus", peerId],
    () => getConnectionStatus(peerId),
    { enabled: !!isOpen && !!peerId, staleTime: 5_000 }
  );

  const refresh = () => {
    queryClient.invalidateQueries(["connectionStatus", peerId]);
    queryClient.invalidateQueries("filterAlumniProfile");
    queryClient.invalidateQueries("connections");
    queryClient.invalidateQueries("connectionCounts");
  };
  const onError = (err) => {
    toast.error(apiErrorMessage(err, "Something went wrong, please try again."));
    refresh();
  };

  const connect = useMutation(sendConnectionRequest, {
    onSuccess: (data) => {
      toast.success(data.auto_accepted ? `You're now connected with ${peerName}!` : "Connection request sent!");
      refresh();
    },
    onError,
  });
  const respond = useMutation(respondToConnection, {
    onSuccess: (data) => {
      if (data.status === "accepted") toast.success(`You're now connected with ${peerName}!`);
      else if (data.status === "declined") toast.info(`You declined the request from ${peerName}.`);
      else toast.info("Request withdrawn.");
      refresh();
    },
    onError,
  });

  // NB: must come after every hook – returning earlier broke the rules of hooks
  if (!isOpen) return null;

  const busy = connect.isLoading || respond.isLoading;
  const connectionId = rel?.connection?.id;
  const btn =
    "w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-60";

  const renderConnectionButton = () => {
    if (relLoading || !rel) {
      return <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-gray-100" />;
    }
    switch (rel.state) {
      case "self":
        return null;
      case "connected":
        return (
          <button
            className={`${btn} bg-brand text-brand-ink hover:bg-brand-hover`}
            onClick={() => onSelectChatClick({ peer: { id: peerId, name: peerName, photo: profile?.user_photo } })}
          >
            <BiMessageAltDetail className="text-xl" /> Message
          </button>
        );
      case "pending_received":
        return (
          <div className="flex w-full gap-2">
            <button
              disabled={busy}
              className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}
              onClick={() => respond.mutate({ id: connectionId, status: "accepted" })}
            >
              <FaCheck /> Accept request
            </button>
            <button
              disabled={busy}
              className={`${btn} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
              onClick={() => respond.mutate({ id: connectionId, status: "declined" })}
            >
              Ignore
            </button>
          </div>
        );
      case "pending_sent":
        return (
          <div className="flex w-full gap-2">
            <button disabled className={`${btn} bg-gray-100 text-gray-600`}>
              <FaCheck className="text-green-600" /> Request sent
            </button>
            <button
              disabled={busy}
              className={`${btn} border border-rose-200 bg-white text-rose-600 hover:bg-rose-50`}
              onClick={() => respond.mutate({ id: connectionId, status: "cancelled" })}
            >
              Withdraw
            </button>
          </div>
        );
      default:
        return (
          <div className="w-full">
            <button
              disabled={busy}
              className={`${btn} bg-brand text-brand-ink hover:bg-brand-hover`}
              onClick={() => connect.mutate({ user_id: peerId })}
            >
              <FaUserPlus /> Connect
            </button>
            {rel.mutual_connections > 0 && (
              <p className="mt-2 text-center text-xs text-gray-500">
                {rel.mutual_connections} mutual connection{rel.mutual_connections > 1 ? "s" : ""}
              </p>
            )}
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
        {peerId && (
          <Link to={profilePath(peerId)} className="absolute left-4 top-3 z-40 text-sm font-semibold text-link hover:underline">
            View full profile →
          </Link>
        )}
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

            <div className="absolute bottom-0 right-0 transform -translate-y-2/3 translate-x-3 border-2 border-brand rounded-full">
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
      </div>
    </div>
  );
};

export default AlumniModal;
