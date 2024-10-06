import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import {
  FaBinoculars,
  FaFileCsv,
  FaFilePdf,
  FaRocketchat,
  FaUserEdit,
} from "react-icons/fa";
import {
  IoIosArrowDropdown,
  IoIosSend,
  IoMdArrowRoundBack,
} from "react-icons/io";
import {
  IoChatbubbleEllipsesSharp,
  IoClose,
  IoCloseSharp,
  IoCloudDownloadOutline,
  IoSend,
  IoTelescope,
  IoWoman,
} from "react-icons/io5";
import { MdAutoDelete, MdOutlineAttachFile, MdTagFaces } from "react-icons/md";
import "./css.css";
import { BsFiletypeCsv } from "react-icons/bs";
import img from "../../../assets/images/testimonial/3.jpg";
import { GiUnfriendlyFire } from "react-icons/gi";
import { useQuery, useQueryClient } from "react-query";
import { myConnectionRequests, getChatHistory, getImageBaseUrl } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { getUserToken } from "src/helpers/globalStorage";

export default function ChatUi({ userId }) {
  const [isOptionOpen, setOptionOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatSelected, setChatSelected] = useState("");
  const [chatHistory, setChatHistory] = useState({});
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [visibleChats, setVisibleChats] = useState(10);
  const messagesEndRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
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
      pendingFilterValue,
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

        const formattedChatHistory = chat_history_data.reduce(
          (acc, message) => {
            const isReceived = message.from_user_id !== userToken?.user?.id;
            const date = new Date(message.createdAt);

            const options = {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            };
            const formattedTime = date.toLocaleTimeString("en-US", options);

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
          },
          {}
        );

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
      ws.current.send(JSON.stringify({ type: "register", user_id: userId }));
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
    if (message.trim() || selectedFiles.length > 0) {
      const messageData = {
        from_user_id: userToken?.user?.id,
        images: selectedFiles.map((file) => ({
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
        })),
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
      setSelectedFiles([]);
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSendMessage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };
  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };
  const toggleDropdown = () => {
    setOptionOpen((prev) => !prev);
    console.log(isOptionOpen);
  };
  const renderFilePreview = (file, index) => {
    if (!file || !file.name) {
      console.error("File or file name is missing:", file);
      return null;
    }

    const fileURL = URL.createObjectURL(file);

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (file.type.startsWith("image/")) {
      return (
        <div key={index} className="relative w-fit">
          <img
            src={fileURL}
            alt={`Selected ${file.name}`}
            className="w-40 h-24 object-cover rounded-lg mb-1"
          />
          <button
            className="absolute top-0 right-0 transform -translate-y-3 translate-x-3  bg-red-500 text-white rounded-full p-1"
            onClick={() => handleRemoveFile(index)}
          >
            <IoClose className="w-4 h-4" />
          </button>
        </div>
      );
    } else if (file.type === "application/pdf") {
      return (
        <div key={index} className="relative bg-red-900 rounded-lg ">
          <div className="flex flex-row gap-2 p-2 rounded-lg ">
            <span>
              <FaFilePdf className="text-3xl text-white" />
            </span>{" "}
            <p> {formatString(file.name)}</p>
          </div>
          <button
            className="absolute top-0 right-0 transform -translate-y-3 translate-x-3  bg-red-500 text-white rounded-full p-1"
            onClick={() => handleRemoveFile(index)}
          >
            <IoClose className="w-4 h-4" />
          </button>
        </div>
      );
    } else if (fileExtension === "csv" || fileExtension === "txt") {
      return (
        <div key={index} className="relative">
          <div className="bg-green-900 flex flex-row gap-2   p-2 rounded-lg">
            <div className="flex flex-row gap-2">
              <span>
                <BsFiletypeCsv className="text-3xl text-white" />
              </span>{" "}
              <p> {formatString(file.name)}</p>
            </div>
          </div>
          <button
            className="absolute top-0 right-0 transform -translate-y-3 translate-x-3  bg-red-500 text-white rounded-full p-1"
            onClick={() => handleRemoveFile(index)}
          >
            <IoClose className="w-4 h-4" />
          </button>
        </div>
      );
    }
  };
  function formatString(input) {
    if (input.length <= 15) {
      return input;
    }

    const firstPart = input.slice(0, 5);
    const lastPart = input.slice(-9);

    return `${firstPart}...${lastPart}`;
  }

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex h-[95vh] w-[] ">
        <div
          className={`w-[100%] md:w-1/3  md:p-4 md:border-r overflow-y-scroll no-scrollbar ${
            selectedChat?.user.name ? "hidden md:block" : "block"
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
            Object.keys(connectionList).map((name) => (
              <div
                key={name}
                onClick={() => {
                  setSelectedChat(connectionList[name]);
                  setChatSelected(connectionList[name].user?.name);
                  setMessage("");
                }}
                className={`p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
                  selectedChat?.user.name === connectionList[name].user?.name
                    ? "bg-gray-300"
                    : "bg-gray-100"
                }`}
              >
                <div className="flex flex-row items-center gap-2">
                  <img
                    src={getImageBaseUrl(
                      connectionList[name].alumni?.user_photo
                    )}
                    alt="profile"
                    className="w-12 h-12 rounded-full mr-2"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-start">
                      {connectionList[name].user?.name}
                    </h3>
                    <p className="text-gray-500 text-start line-clamp-1 text-[.8rem]">
                      {connectionList[name].messages &&
                      connectionList[name].messages.length > 0
                        ? connectionList[name].messages[
                            connectionList[name].messages.length - 1
                          ]?.message
                        : "No messages"}
                    </p>
                  </div>
                </div>
              </div>
            ))
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
          className={`w-full md:w-2/3  md:p-4 flex flex-col justify-between ${
            selectedChat?.user.name ? "block" : "hidden md:block"
          }`}
        >
          {selectedChat?.user?.name ? (
            <>
              <div className="flex justify-between items-center mb-4 w-[100%] px-2 py-2 bg-gray-200 rounded-xl  text-black">
                <div className="flex flex-row items-center gap-1 ml-4">
                  {" "}
                  <IoMdArrowRoundBack
                    className="text-black md:hidden text-2xl  rounded-lg"
                    onClick={handleBackClick}
                  />
                  <h2 className="text-2xl font-bold">
                    {selectedChat?.user?.name}
                  </h2>
                </div>
                <IoIosArrowDropdown
                  className="text-3xl hover:text-cyan-500 "
                  onClick={() => toggleDropdown()}
                />
              </div>
              {isOptionOpen && (
                <div className=" absolute rounded-md right-2 mt-11 ml-5 w-52 bg-white border border-gray-300 shadow-lg z-50 ">
                  <div className=" absolute right-1  rotate-45 -translate-y-1/3 w-6 h-6   bg-white overflow-x-hidden -z-40"></div>
                  <ul className="text-black p-2 z-10">
                    <li className="px-4 py-2 flex flex-row gap-3 hover:bg-gray-100 z-50 overflow-hidden text-xs ">
                      <GiUnfriendlyFire className="text-xl overflow-hidden " />
                      Unfriend {selectedChat?.user?.name}
                    </li>
                    <li className="px-4 py-2 flex flex-row gap-3 hover:bg-gray-100 z-50 overflow-hidden text-xs ">
                      <MdAutoDelete className="text-xl overflow-hidden " />
                      Clear History
                    </li>
                  </ul>
                </div>
              )}
              <div className="flex flex-col h-full  overflow-y-scroll no-scrollbar font-sans">
                <div className="flex-1 md:bg-gray-200 rounded-lg">
                  {chatHistory[selectedChat?.alumni?.user_id]?.map(
                    (msg, index) => (
                      <div
                        key={index}
                        className={` p-1 ${
                          msg.isReceived ? "text-left" : "text-right"
                        }`}
                      >
                        <div className=" inline-block max-w-[90%] lg:max-w-[70%] ">
                          {/* Display images first */}

                          {msg.images && msg.images.length > 0 && (
                            <div className="flex flex-col gap-">
                              {msg.images.map((file, idx) => {
                                const fileName = file.name || "Unknown file";
                                const fileType = file.type || "";

                                const fileExtension = fileName
                                  .split(".")
                                  .pop()
                                  .toLowerCase();

                                const isImage = fileType.startsWith("image/");
                                const isPDF = fileType === "application/pdf";
                                const isCSV = fileExtension === "csv";

                                return (
                                  <div key={idx} className="relative">
                                    {isImage && (
                                      <img
                                        src={file.url}
                                        alt={`Sent Image: ${fileName}`}
                                        className={`rounded-lg w-full h-auto object-cover mb-1 ${
                                          msg.isReceived
                                            ? "bg-gray-300"
                                            : "bg-gray-800"
                                        }`}
                                      />
                                    )}

                                    {isPDF && (
                                      <div
                                        className={`flex flex-row items-center justify-center px-3 py-2 rounded-lg font-serif ${
                                          msg.isReceived
                                            ? "bg-gray-300 text-black text-[1rem]"
                                            : "bg-gray-900 text-white text-[1rem] text-left"
                                        }`}
                                      >
                                        <div className="flex flex-row items-center justify-center gap-2 p-3">
                                          <FaFilePdf className="text-3xl text-white" />
                                          <span className="text-white truncate">
                                            {formatString(fileName)}
                                          </span>
                                        </div>
                                        <a
                                          href={file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-gray-100 underline"
                                        >
                                          <IoCloudDownloadOutline className="text-2xl" />
                                        </a>
                                      </div>
                                    )}

                                    {isCSV && (
                                      <div
                                        className={`flex flex-row items-center justify-center px-3 py-2 rounded-lg font-serif ${
                                          msg.isReceived
                                            ? "bg-gray-300 text-black text-[1rem]"
                                            : "bg-gray-900 text-white text-[1rem] text-left"
                                        }`}
                                      >
                                        <div className="flex flex-row items-center justify-center gap-2 p-3">
                                          <FaFileCsv className="text-3xl text-white" />
                                          <span className="text-white truncate max-w-48">
                                            {formatString(fileName)}
                                          </span>
                                        </div>
                                        <a
                                          href={file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-gray-100 underline"
                                        >
                                          <IoCloudDownloadOutline className="text-2xl" />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {msg.message && (
                            <p
                              className={` flex flex-col-reverse px-3 py-2   rounded-lg font-serif ${
                                msg.isReceived
                                  ? "bg-gray-100 text-gray-500 text-[16px]"
                                  : "bg-gray-300 text-gray-900 text-[16px] text-left"
                              }`}
                            >
                              <span className="block text-xs mt-1 text-gray-500">
                                {msg.time}
                              </span>
                              {msg.message}
                            </p>
                          )}
                        </div>

                        {/* <span className="block text-xs mt-1 ml-1 text-gray-500">
                          {msg.time}
                        </span> */}
                      </div>
                    )
                  )}

                  <div ref={messagesEndRef} />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 bg-black "></div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {selectedFiles.map((file, index) =>
                      renderFilePreview(file, index)
                    )}
                  </div>

                  <div className="flex items-center border-t p- m-1 bg-gray-100 rounded-lg">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-inherit text-2xl  py-2 rounded-lg flex flex-row"
                    >
                      <MdOutlineAttachFile className="text-black" />
                      <input
                        type="file"
                        accept="image/*,application/pdf,.csv,.txt"
                        onChange={handleFileUpload}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            onSendMessage();
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                        multiple
                      />
                    </label>
                    <textarea
                      ref={textareaRef}
                      value={message}
                      rows={1}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 p-1 border-none rounded-r-none w-[100%] rounded-l-lg bg-gray-100 text-black resize-none overflow-hidden no-scrollbar"
                    />
                    <div className="flex flex-row transform bg-gray-900 hover:bg-gray-400 p-3 rounded-r-lg group">
                      <div className="flex flex-row items-center justify-center">
                        <span onClick={onSendMessage} className="bg-inherit ">
                          <IoSend className="text-gray-50 group-hover:text-gray-900 text-xl " />
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
                  <IoChatbubbleEllipsesSharp className="text-8xl text-gray-600 " />
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
