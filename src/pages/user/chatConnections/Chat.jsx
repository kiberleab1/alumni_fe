import React, { useState, useEffect, useRef } from "react";
import { IoIosSend, IoMdArrowRoundBack } from "react-icons/io";
import { useQuery, useQueryClient } from "react-query";
import { myConnectionRequests, getChatHistory } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { getUserToken } from "src/helpers/globalStorage";

export default function ChatUi({ userId }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatSelected, setChatSelected] = useState("");
  const [chatHistory, setChatHistory] = useState({});
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pendingFilterType, setPendingFilterType] = useState("all");
  const [pendingFilterValue, setPendingFilterValue] = useState("accepted");
  const itemsPerPage = 8;
  const queryClient = useQueryClient();
  const userToken = getUserToken();

  const { isError, data, isLoading, refetch } = useQuery(
    [
      "myConnectionRequests",
      currentPage,
      pendingFilterType,
      pendingFilterValue
    ],
    async () => {
      return await myConnectionRequests({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        filterKeyword: pendingFilterType,
        value: pendingFilterValue,
      });
    },
    { keepPreviousData: true }
  );

  const connectionList = data?.data?.connections || [];
  const totalItems = data?.data?.total_items || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (selectedChat) {
      const fetchChatHistory = async () => {
        const { data: chat_history_data } = await getChatHistory({
          from_user_id: userToken?.user?.id,
          to_user_id: selectedChat?.alumni?.user_id,
        });

        const formattedChatHistory = chat_history_data.reduce((acc, message) => {
          const isReceived = message.from_user_id !== userToken?.user?.id;
          const date = new Date(message.createdAt);

          const options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          };
          const formattedTime = date.toLocaleTimeString('en-US', options);

          return {
            ...acc,
            [selectedChat.alumni.user_id]: [
              ...(acc[selectedChat.alumni.user_id] || []),
              {
                message: message.message,
                isReceived,
                time: formattedTime,
              },
            ],
          };
        }, {});

        setChatHistory((prevHistory) => ({
          ...prevHistory,
          ...formattedChatHistory,
        }));
      };

      setChatHistory((prevHistory) => ({
        ...prevHistory,
        [selectedChat.alumni.user_id]: [],
      }));

      fetchChatHistory();
    }
  }, [selectedChat, userToken?.user?.id]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:4000");

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.current.send(
        JSON.stringify({ type: "register", user_id: userId })
      );
    };

    ws.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      const { from_user_id, message } = receivedMessage;
      setChatHistory((prevHistory) => ({
        ...prevHistory,
        [from_user_id]: [
          ...(prevHistory[from_user_id] || []),
          { message, isReceived: true, time: new Date().toLocaleTimeString() },
        ],
      }));
    };

    return () => {
      ws.current.close();
    };
  }, [userId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const onSendMessage = () => {
    if (message.trim() === "" || !selectedChat) return;

    const messageData = {
      from_user_id: userToken?.user?.id,
      to_user_id: selectedChat?.alumni?.user_id,
      createdAt: new Date().toLocaleTimeString(),
      message,
    };

    ws.current.send(JSON.stringify(messageData));

    setChatHistory((prevHistory) => ({
      ...prevHistory,
      [selectedChat?.alumni?.user_id]: [
        ...(prevHistory[selectedChat?.alumni?.user_id] || []),
        { message, isReceived: false, time: new Date().toLocaleTimeString() },
      ],
    }));

    setMessage("");
  };

  const handleBackClick = () => {
    setSelectedChat(null);
    refetch();
  };

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex h-[90vh] bg-white">
        <div
          className={`w-[100%] md:w-1/3 p-1 md:p-4 border-r overflow-y-auto ${selectedChat?.user.name ? "hidden md:block" : "block"
            }`}
        >
          <h2 className="text-xl font-medium mb-4 border-b-2">Connections</h2>
          {Object.keys(connectionList).map((name) => (
            <div
              key={name}
              onClick={() => {
                setSelectedChat(connectionList[name]);
                setChatSelected(connectionList[name].user?.name);
              }}
              className={`p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 ${selectedChat?.user.name === connectionList[name].user?.name ? "bg-gray-300" : "bg-gray-100"
                }`}
            >
              <h3 className="font-semibold text-gray-800 text-start">{connectionList[name].user?.name}</h3>
              <p className="text-gray-500 text-start line-clamp-1">
                {connectionList[name].messages && connectionList[name].messages.length > 0
                  ? connectionList[name].messages[connectionList[name].messages.length - 1]?.message
                  : 'No messages'}
              </p>
            </div>
          ))}

        </div>

        <div
          className={`w-full md:w-2/3 p-1 md:p-4 flex flex-col justify-between ${selectedChat?.user.name ? "block" : "hidden md:block"
            }`}
        >
          {selectedChat?.user?.name && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedChat?.user?.name}</h2>
                <button
                  onClick={handleBackClick}
                  className="md:hidden bg-white text-white py-2 px-4 rounded-lg"
                >
                  <IoMdArrowRoundBack className="text-black" />
                </button>
              </div>

              <div className="flex flex-col h-full overflow-y-scroll no-scrollbar">
                <div className="flex-1">
                  {chatHistory[selectedChat?.alumni?.user_id]?.map((msg, index) => (
                    <div key={index} className={`p-2 ${msg.isReceived ? "text-left" : "text-right"}`}>
                      <p className={`inline-block p-2 rounded-lg max-w-[60%] ${msg.isReceived ? "bg-gray-300 text-black" : "bg-gray-800 text-white"}`}>
                        {msg.message}
                      </p>
                      <span className="block text-xs mt-1 ml-1 text-gray-500">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex items-center border-t p-2">
                  <textarea
                    type="text"
                    value={message}
                    rows={1}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ minHeight: "40px", maxHeight: "40px" }}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-r-none rounded-l-lg bg-gray-100 text-black resize-none overflow-hidden no-scrollbar"
                  />
                  <button
                    onClick={onSendMessage}
                    className="bg-black text-white px-4 py-2 rounded-l-none"
                  >
                    <IoIosSend />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </QueryResult>

  );
}
