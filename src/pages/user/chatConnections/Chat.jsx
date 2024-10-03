import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { FaBinoculars, FaRocketchat } from "react-icons/fa";
import { IoIosArrowDropdown, IoIosSend, IoMdArrowRoundBack, } from "react-icons/io";
import { IoChatbubbleEllipsesSharp, IoCloseSharp, IoTelescope, IoWoman, } from "react-icons/io5";
import { MdOutlineAttachFile, MdTagFaces } from "react-icons/md";
// import "./css.css";
import { useQuery, useQueryClient } from "react-query";
import { myConnectionRequests, getChatHistory } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { getUserToken } from "src/helpers/globalStorage";

export default function ChatUi({ userId }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatSelected, setChatSelected] = useState("");
  const [chatHistory, setChatHistory] = useState({});
  const [message, setMessage] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);
  const [visibleChats, setVisibleChats] = useState(10);
  const messagesEndRef = useRef(null);
  const chatUsers = Object.keys(chatHistory);
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
    if (message.trim() || selectedImages.length > 0) {
      const messageData = {
        from_user_id: userToken?.user?.id,
        images: selectedImages.map((img) => URL.createObjectURL(img)),
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
      setSelectedImages([]);
    }
  };

  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleBackClick = () => {
    setSelectedChat(null);
    refetch();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };
  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };
  console.log(chatHistory);

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex h-[90vh] w-[] ">
        <div
          className={`w-[100%] md:w-1/3  md:p-4 md:border-r overflow-y-scroll no-scrollbar ${selectedChat?.user.name ? "hidden md:block" : "block"
            }`}
        >
          <h2 className="text-xl font-medium mb-4 border-b-2">Connections</h2>
          {connectionList.length < 1 ? (
            <div className="flex flex-col  text-center gap-2  m-auto rounded-lg p-6 ">
              <IoTelescope className="m-auto text-black text-4xl" />

              <p className="text-gray-600 text-xl">
                {" "}
                You have no Connections history
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}

          {visibleChats < chatUsers.length && (
            <button
              onClick={() => setVisibleChats((prev) => prev + 10)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
            >
              See more
            </button>
          )}
        </div>

        <div
          className={`w-full md:w-2/3  md:p-4 flex flex-col justify-between ${selectedChat?.user.name ? "block" : "hidden md:block"
            }`}
        >
          {selectedChat?.user?.name ? (
            <>
              <div className="flex justify-between items-center mb-4 w-[100%] m0">
                <div className="flex flex-row justify-center items-center">
                  {" "}
                  <button
                    onClick={handleBackClick}
                    className="md:hidden bg-white text-white py-2  rounded-lg"
                  >
                    <IoMdArrowRoundBack className="text-black" />
                  </button>{" "}
                  <h2 className="text-2xl font-bold">{selectedChat?.user?.name}</h2>
                </div>
                <IoIosArrowDropdown className="text-3xl hover:text-cyan-500 " />
              </div>

              <div className="flex flex-col h-full overflow-y-scroll no-scrollbar font-sans">
                <div className="flex-1 h- ">
                  {chatHistory[selectedChat?.alumni?.user_id]?.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 ${msg.isReceived ? "text-left " : "text-right"
                        }`}
                    >
                      <div className={`inline-block max-w-[90% lg:max-w-[70%]`}>
                        <div>
                          {msg.images && msg.images.length > 0 && (
                            <div className="flex flex-col gap-2">
                              {msg.images.map((image, idx) => (
                                <img
                                  key={idx}
                                  src={image}
                                  alt="Sent"
                                  className={`rounded-lg w-[12rem]  h-full object-cover mb-1 ${msg.sender === "You"
                                    ? "bg-gray-800"
                                    : "bg-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        {msg.message && (
                          <p
                            className={`flex px-3 py-2 rounded-lg font-serif  ${msg.isReceived
                              ? "bg-gray-300 text-black  text-[1rem]  "
                              : "bg-gray-900 text-white  text-[1rem] text-left"
                              }`}
                          >
                            {msg.message}
                          </p>
                        )}
                      </div>
                      <span className="block text-xs mt-1 ml-1 text-gray-500">
                        {msg.time}
                      </span>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Selected ${index}`}
                          className="w-20 h-24 object-cover rounded-lg"
                        />

                        <button
                          className="absolute top-0 left-0 bg-red-500 text-white rounded-full p-1"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <IoCloseSharp className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center border-t p-2 bg-gray-100 rounded-lg">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      rows={1}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={{ minHeight: "40px", maxHeight: "40px" }}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border-none rounded-r-none w-[100%] rounded-l-lg bg-gray-100 text-black resize-none overflow-hidden no-scrollbar"
                    />
                    <div className="flex flex-row transform">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        multiple
                      />
                      <div className="flex flex-row items-center justify-center">
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer bg-inherit text-2xl  py-2 rounded-lg flex flex-row"
                        >
                          <MdOutlineAttachFile className="text-black" />
                        </label>
                        <span
                          onClick={onSendMessage}
                          className="bg-inherit rounded-l-none"
                        >
                          <IoIosSend className="text-black text-2xl" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="relative text-center bg-inherit  bg-gray-100  h-full">
              <div className="face2  mt-4">
                <div className="sad mt-2 w-8 h-2  !border-none inline-block ">
                  <IoChatbubbleEllipsesSharp className="text-8xl text-yellow-700 " />
                </div>
              </div>
              <div className="shadow move inset-x-0 bottom-0 h-2 bg-gray-300 "></div>
              <div className="message mt-4">
                <p className="text-gray-600 text-lg fony-serf uppercase">
                  {" "}
                  you haven't select chat history{" "}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </QueryResult>

  );
}
