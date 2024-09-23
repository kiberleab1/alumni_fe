import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getImageBaseUrl, myConnectionRequests, updateConnection } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { DateFormat } from "src/utils/utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ConnectionNetwork() {
  const [activeTab, setActiveTab] = useState("connections");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingFilterType, setPendingFilterType] = useState("all");
  const [pendingFilterValue, setPendingFilterValue] = useState("accepted");
  const itemsPerPage = 8;
  const queryClient = useQueryClient();

  const { isError, data, isLoading, refetch } = useQuery(
    ["myConnectionRequests", currentPage, pendingFilterType, pendingFilterValue],
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
      toast.info(`You have declined the request from ${connection?.user?.name}.`);
    }
  };

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">My Alumni Network</h2>

        <div className="flex m-auto space-x-4 mb-6 max-w-[1600px]">
          <div className="text-start">
            <button
              onClick={() => {
                setActiveTab("connections");
                setPendingFilterValue("accepted");
              }}
              className={`py-2 px-4 rounded text-start ${
                activeTab === "connections" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              My Connections
            </button>
            <button
              onClick={() => {
                setActiveTab("requests");
                setPendingFilterValue("pending");
              }}
              className={`py-2 px-4 rounded ${
                activeTab === "requests" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              Connection Requests
            </button>
          </div>
        </div>

        {activeTab === "connections" && (
          <div>
            <h3 className="text-xl font-semibold mt-8 mb-4">My Connections</h3>
            <div className="space-y-4 flex flex-col gap-y-2">
              {connectionList.map((connection) => {
                const userPhotoUrl = getImageBaseUrl(connection?.alumni?.user_photo);
                    const userName = connection?.user?.name || '';
                    const isPhotoAvailable = userPhotoUrl && userPhotoUrl.length > 0 && userPhotoUrl.startsWith('uploads/');

                    const [firstName, lastName] = userName.split(" ");
                    const truncatedFirstName = !isPhotoAvailable && firstName.length > 11
                      ? `${firstName.slice(0, 5)}...`
                      : firstName;

                    const truncatedLastName = !isPhotoAvailable && lastName.length > 7
                      ? `${lastName.slice(0, 5)}...`
                      : lastName;
                    const displayName = lastName ? `${truncatedFirstName} ${truncatedLastName}` : truncatedFirstName;

                return (
                  <div
                    key={connection.id}
                    className="flex flex-col items-center m-auto sm:flex-row justify-between w-full py-2 sm:p-4 bg-white shadow rounded max-w-[1600px]"
                  >
                    <div className="flex items-center mb-4 sm:mb-0">
                      <img
                        src={userPhotoUrl || "default-placeholder.png"}
                        alt={displayName}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                            <h4
                              className={`text-lg font-semibold text-start ${!isPhotoAvailable ? 'text-sm' : ''}`}
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "200px",
                              }}
                            >
                              {connection?.user?.name}
                            </h4>
                            <p className="text-gray-500">Joined on {DateFormat(connection?.createdat)}</p>
                          </div>
                    </div>
                    <button className="bg-black text-white py-1 px-3 rounded">Message</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div>
            <h3 className="text-xl font-semibold mt-8 mb-4">Connection Requests</h3>
            <div className="space-y-4 flex flex-col gap-y-2">
              {connectionList.map((connection) => {
                const userPhotoUrl = getImageBaseUrl(connection?.alumni?.user_photo);
                const userName = connection?.user?.name || '';
                const isPhotoAvailable = userPhotoUrl && userPhotoUrl.length > 0 && userPhotoUrl.startsWith('uploads/');

                const [firstName, lastName] = userName.split(" ");
                const truncatedFirstName = !isPhotoAvailable && firstName.length > 11
                  ? `${firstName.slice(0, 5)}...`
                  : firstName;

                const truncatedLastName = !isPhotoAvailable && lastName.length > 7
                  ? `${lastName.slice(0, 5)}...`
                  : lastName;
                const displayName = lastName ? `${truncatedFirstName} ${truncatedLastName}` : truncatedFirstName;

                return (
                  <div
                    key={connection.id}
                    className="flex flex-col items-center m-auto sm:flex-row justify-between w-full py-2 sm:p-4 bg-white shadow rounded max-w-[1600px]"
                  >
                    <div className="flex items-center mb-4 sm:mb-0">
                      <img
                        src={userPhotoUrl || "default-placeholder.png"}
                        alt={displayName}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4
                          className={`text-lg font-semibold text-start ${!isPhotoAvailable ? 'text-sm' : ''}`}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "200px",
                          }}
                        >
                          {connection?.user?.name}
                        </h4>
                        <p className="text-gray-500">Requested on {DateFormat(connection?.createdat)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(connection, "accepted")}
                        className="bg-green-500 text-white py-1 px-3 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(connection, "declined")}
                        className="bg-red-500 text-white py-1 px-3 rounded"
                      >
                        Decline
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
