import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getImageBaseUrl,
  myConnectionRequests,
  updateConnection,
} from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { DateFormat } from "src/utils/utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { TiMessages } from "react-icons/ti";
import { FcAcceptDatabase } from "react-icons/fc";
import { BiStopCircle } from "react-icons/bi";
export default function ConnectionNetwork() {
  const [activeTab, setActiveTab] = useState("connections");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingFilterType, setPendingFilterType] = useState("all");
  const [pendingFilterValue, setPendingFilterValue] = useState("accepted");
  const itemsPerPage = 8;
  const queryClient = useQueryClient();

  const { isError, data, isLoading, refetch } = useQuery(
    [
      "myConnectionRequests",
      currentPage,
      pendingFilterType,
      pendingFilterValue,
    ],
    async () => {
      const result = await myConnectionRequests({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        filterKeyword: pendingFilterType,
        value: pendingFilterValue,
      });
      return result;
    },
    { keepPreviousData: true }
  );

  const connectionList = data?.data?.connections || [];
  const totalItems = data?.data?.total_items || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const { mutate: updateConnectionStatus } = useMutation(updateConnection, {
    onSuccess: () => {
      queryClient.invalidateQueries("myConnectionRequests");
    },
    onError: (error) => {
      queryClient.invalidateQueries("myConnectionRequests");
      console.error("Error request action:", error);
      toast.error("Error in request action!");
    },
  });

  const handleAction = (connection, status) => {
    const updateData = {
      status,
      id: connection.id,
    };
    updateConnectionStatus(updateData);

    if (status === "accepted") {
      toast.success(`You have become friends with ${connection?.user?.name}!`);
    } else if (status === "declined") {
      toast.info(
        `You have declined the request from ${connection?.user?.name}.`
      );
    }
  };

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="xl:p-4 ">
        <div className="text-start flex flex-row gap- rounded-sm w-[100%]  ">
          <button
            onClick={() => {
              setActiveTab("connections");
              setPendingFilterValue("accepted");
              setPendingFilterType("all");

            }}
            className={`py-2 xl:px-4 rounded-none hover:border-gray-500 text-start font-serif  transition-all duration-300  ${activeTab === "connections"
                ? "bg-white text-cyan-500 border"
                : "bg-white text-black"
              }`}
          >
            Connections
          </button>
          <button
            onClick={() => {
              setActiveTab("requests");
              setPendingFilterValue("pending");
              setPendingFilterType("status");
            }}
            className={`py-2 xl:px-4 rounded-none font-serif hover:border-gray-500 transition-all duration-300  ${activeTab === "requests"
                ? "bg-white text-cyan-500 border"
                : "bg-white text-black"
              }`}
          >
            Requests
          </button>
          <button
            onClick={() => {
              setActiveTab("myrequests");
              setPendingFilterValue("requesting_user_id");
              setPendingFilterType("requesting_user_id");
              refetch();

            }}
            className={`py-2 xl:px-4 rounded-none font-serif hover:border-gray-500 transition-all duration-300  ${activeTab === "myrequests"
                ? "bg-white text-cyan-500 border  "
                : "bg-white text-black"
              }`}
          >
            My Requests
          </button>
        </div>

        {activeTab === "connections" && (
          <div className="  mt-8 mb-4">
            <div className="space-y-4 flex flex-col gap-y-2">
              {connectionList.length === 0 ? (
                <div className="text-center text-gray-500">
                  No connections found
                </div>
              ) : (
                <div>
                  {connectionList.map((connection) => {
                    const userPhotoUrl = getImageBaseUrl(
                      connection?.alumni?.user_photo
                    );
                    const userName = connection?.user?.name || "";
                    const isPhotoAvailable =
                      userPhotoUrl &&
                      userPhotoUrl.length > 0 &&
                      userPhotoUrl.startsWith("uploads/");

                    const [firstName, lastName] = userName.split(" ");
                    const truncatedFirstName =
                      !isPhotoAvailable && firstName && firstName.length > 11
                        ? `${firstName.slice(0, 5)}...`
                        : firstName;

                    const truncatedLastName =
                      !isPhotoAvailable && lastName && lastName.length > 7
                        ? `${lastName.slice(0, 5)}...`
                        : lastName;
                    const displayName = lastName
                      ? `${truncatedFirstName} ${truncatedLastName}`
                      : truncatedFirstName;

                    return (
                      <div
                        key={connection.id}
                        className="flex flex-rows items-start my-auto sm:flex-row justify-between w-full py-2 sm:p-4 hover:bg-gray-100 shadow-sm rounded max-w-[90%] "
                      >
                        <div className="flex items-center justify-start m-2 ">
                          <img
                            src={userPhotoUrl || "default-placeholder.png"}
                            alt={displayName}
                            className="w-12 h-12 rounded-full mr-4"
                          />
                          <div>
                            <h4
                              className={`text-lg font-semibold font-serif text-start ${!isPhotoAvailable ? "text-lg" : ""
                                }`}
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "200px",
                              }}
                            >
                              {connection?.user?.name}
                            </h4>
                            <p className="text-gray-500 text-sm">
                              Joined on {DateFormat(connection?.createdat)}
                            </p>
                          </div>
                        </div>
                        <button className="bg-gray-100 font-serif text-black py-1 px-3 rounded flex flex-row gap-2 justify-end items-end mt-auto mb-auto hover:bg-gray-300">
                          <TiMessages className="flex items-center justify-center m-auto" />{" "}
                          <span className="hidden sm:flex items-center justify-center m-auto">
                            Message
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="  mt-8 mb-4">
            <div className="space-y-4 flex flex-col gap-y-2">
              {connectionList.map((connection) => {
                const userPhotoUrl = getImageBaseUrl(
                  connection?.alumni?.user_photo
                );
                const userName = connection?.user?.name || "";
                const isPhotoAvailable =
                  userPhotoUrl &&
                  userPhotoUrl.length > 0 &&
                  userPhotoUrl.startsWith("uploads/");

                const [firstName, lastName] = userName.split(" ");
                const truncatedFirstName =
                  !isPhotoAvailable && firstName.length > 11
                    ? `${firstName.slice(0, 5)}...`
                    : firstName;

                const truncatedLastName =
                  !isPhotoAvailable && lastName?.length > 7
                    ? `${lastName.slice(0, 5)}...`
                    : lastName;
                const displayName = lastName
                  ? `${truncatedFirstName} ${truncatedLastName}`
                  : truncatedFirstName;

                return (
                  <div
                    key={connection.id}
                    className="flex flex-col w-[100%] gap-2 items-center sm:flex-row justify-between  sm:py-2 sm:p-4 bg-gray-50 hover:bg-gray-100 shadow rounded xl:max-w-[90%]"
                  >
                    <div className="flex items-center justify-center my-auto ">
                      <img
                        src={userPhotoUrl || "default-placeholder.png"}
                        alt={displayName}
                        className="w-12 h-12 rounded-full mr-4"
                      />

                      <div className="flex flex-col ">
                        <h4
                          className={`text-lg font-semibold text-start ${!isPhotoAvailable ? "text-sm" : ""
                            }`}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "200px",
                          }}
                        >
                          {connection?.user?.name}
                        </h4>
                        <p className="text-gray-500">
                          Requested on {DateFormat(connection?.createdat)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 p-2">
                      <button
                        onClick={() => handleAction(connection, "accepted")}
                        className="hover:bg-green-500 bg-green-100 flex flex-row gap-2 items-center justify-center text-white py-1 px-3 rounded"
                      >
                        <FcAcceptDatabase />{" "}
                        <span className="text-black">Accept</span>
                      </button>
                      <button
                        onClick={() => handleAction(connection, "declined")}
                        className="flex flex-row gap-2 bg-red-100 items-center justify-center  hover:bg-red-500 text-black py-1 px-3 rounded"
                      >
                        <BiStopCircle />
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

       {activeTab === "myrequests" && (
          <div className="  mt-8 mb-4">
            <div className="space-y-4 flex flex-col gap-y-2">
              {connectionList.map((connection) => {
                const userPhotoUrl = getImageBaseUrl(
                  connection?.alumni?.user_photo
                );
                const userName = connection?.user?.name || "";
                const isPhotoAvailable =
                  userPhotoUrl &&
                  userPhotoUrl.length > 0 &&
                  userPhotoUrl.startsWith("uploads/");

                const [firstName, lastName] = userName.split(" ");
                const truncatedFirstName =
                  !isPhotoAvailable && firstName.length > 11
                    ? `${firstName.slice(0, 5)}...`
                    : firstName;

                const truncatedLastName =
                  !isPhotoAvailable && lastName?.length > 7
                    ? `${lastName.slice(0, 5)}...`
                    : lastName;
                const displayName = lastName
                  ? `${truncatedFirstName} ${truncatedLastName}`
                  : truncatedFirstName;

                return (
                  <div
                    key={connection.id}
                    className="flex flex-col w-[100%] gap-2 items-center sm:flex-row justify-between  sm:py-2 sm:p-4 bg-gray-50 hover:bg-gray-100 shadow rounded xl:max-w-[90%]"
                  >
                    <div className="flex items-center justify-center my-auto ">
                      <img
                        src={userPhotoUrl || "default-placeholder.png"}
                        alt={displayName}
                        className="w-12 h-12 rounded-full mr-4"
                      />

                      <div className="flex flex-col ">
                        <h4
                          className={`text-lg font-semibold text-start ${!isPhotoAvailable ? "text-sm" : ""
                            }`}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "200px",
                          }}
                        >
                          {connection?.user?.name}
                        </h4>
                        <p className="text-gray-500">
                          Requested on {DateFormat(connection?.createdat)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 p-2">
                      <button
                        onClick={() => handleAction(connection, "declined")}
                        className="flex flex-row gap-2 bg-red-100 items-center justify-center  hover:bg-red-500 text-black py-1 px-3 rounded"
                      >
                        <BiStopCircle />
                        Cancel Connection Request
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <ToastContainer />
        </div>
      </div>
    </QueryResult>
  );
}
