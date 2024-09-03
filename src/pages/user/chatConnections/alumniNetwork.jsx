import React, { useState } from "react";
import img from "../../../assets/images/testimonial/1.jpg";
import img2 from "../../../assets/images/testimonial/2.jpg";
import img3 from "../../../assets/images/testimonial/3.jpg";
import img4 from "../../../assets/images/testimonial/4.jpg";
const AlumniNetwork = () => {
  const [activeTab, setActiveTab] = useState("connections");
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      date: "Requested on Sep 2, 2023",
      imageUrl: img,
      accepted: false,
    },
    {
      id: 2,
      name: "Bob Brown",
      date: "Requested on Aug 30, 2023",
      imageUrl: img2,
      accepted: false,
    },
  ]);

  const connections = [
    {
      name: "John Doe",
      date: "Joined on Sep 1, 2023",
      imageUrl: img3,
    },
    {
      name: "Jane Smith",
      date: "Joined on Aug 20, 2023",
      imageUrl: img4,
    },
  ];

  const handleAccept = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, accepted: true } : request
      )
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Alumni Network</h2>

      <div className="flex m-auto space-x-4 mb-6 max-w-[1600px]  ">
        <div className="text-start">
          <button
            onClick={() => setActiveTab("connections")}
            className={`py-2 px-4 rounded text-start ${
              activeTab === "connections"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            My Connections
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-2 px-4 rounded ${
              activeTab === "requests"
                ? "bg-black text-white"
                : "bg-white text-black"
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
            {connections.map((connection, index) => (
              <div
                key={connection.id}
                className="flex flex-col items-center m-auto sm:flex-row  justify-between w-full py-2  sm:p-4 bg-white shadow rounded max-w-[1600px]"
              >
                <div className="flex items-center mb-4 sm:mb-0">
                  <img
                    src={connection.imageUrl}
                    alt={connection.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-start">
                      {connection.name}
                    </h4>
                    <p className="text-gray-500">{connection.date}</p>
                  </div>
                </div>
                <button className="bg-black text-white py-1 px-3 rounded">
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "requests" && (
        <div>
          <h3 className="text-xl font-semibold mt-8 mb-4">
            Connection Requests
          </h3>
          <div className="space-y-4 flex flex-col gap-y-2">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col items-center m-auto sm:flex-row  justify-between w-full py-2  sm:p-4 bg-white shadow rounded max-w-[1600px]"
              >
                <div className="flex items-center mb-4 sm:mb-0">
                  <img
                    src={request.imageUrl}
                    alt={request.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-start">
                      {request.name}
                    </h4>
                    <p className="text-gray-500">{request.date}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {request.accepted ? (
                    <button className="bg-black text-white py-1 px-3 rounded">
                      Message
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="bg-green-500 text-white py-1 px-3 rounded"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniNetwork;
