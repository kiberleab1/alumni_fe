import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { FaFileAlt, FaFilePdf } from "react-icons/fa";
import { VscClose } from "react-icons/vsc";
import {
  IoIosArrowDropdown,
  IoMdArrowRoundBack,
  IoMdArrowUp,
} from "react-icons/io";
import {
  IoChatbubbleEllipsesSharp,
  IoClose,
  IoTelescope,
} from "react-icons/io5";
import { MdAutoDelete, MdOutlineAttachFile, MdTagFaces } from "react-icons/md";
import "./css.css";
import { BsFiletypeCsv } from "react-icons/bs";

import { GiUnfriendlyFire } from "react-icons/gi";
import { useQuery, useQueryClient } from "react-query";
import {
  myConnectionRequests,
  getChatHistory,
  getImageBaseUrl,
  sendFiles,
} from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { getUserToken } from "src/helpers/globalStorage";
import { BiDotsHorizontalRounded, BiDotsVerticalRounded } from "react-icons/bi";

export default function ChatUi({ chat }) {
  const [isOptionOpen, setOptionOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(chat);
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
  const [currentImage, setCurrentImage] = useState(null);
  const itemsPerPage = 8;
  const queryClient = useQueryClient();
  const userToken = getUserToken();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleImageClick = (imageUrl) => {
    setIsFullScreen(true);
    setCurrentImage(imageUrl);
  };

  const handleCloseModal = () => {
    setIsFullScreen(false);
    setCurrentImage(null);
  };
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
            const formattedTime = date.toLocaleDateString("en-US", options);

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
      ws.current.send(
        JSON.stringify({ type: "register", user_id: userToken?.user?.id })
      );
    };

    ws.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      const { from_user_id, message } = receivedMessage;
      setChatHistory((prevHistory) => ({
        ...prevHistory,
        [from_user_id]: [
          ...(prevHistory[from_user_id] || []),
          {
            message,
            isReceived: true,
            time:
              new Date().toLocaleDateString() +
              " " +
              new Date().toLocaleTimeString(),
          },
        ],
      }));
    };

    return () => {
      ws.current.close();
    };
  }, [chat?.user_id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const onSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    if (!selectedChat) return;

    const to_user_id = selectedChat?.alumni?.user_id;

    let success = false;

    if (selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append("from_user_id", userToken?.user?.id);
      formData.append("to_user_id", to_user_id);

      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });

      try {
        const response = await sendFiles(formData);
        console.log(response);
        if (response) {
          const result = await response?.data;

          if (result?.url_list.length > 0) {
            for (let i = 0; i < result?.url_list.length; i++) {
              const messageData = {
                from_user_id: userToken?.user?.id,
                to_user_id: to_user_id,
                message: result?.url_list[i],
                createdAt: new Date().toLocaleTimeString(),
              };

              ws.current.send(JSON.stringify(messageData));
              setChatHistory((prevHistory) => ({
                ...prevHistory,
                [to_user_id]: [
                  ...(prevHistory[to_user_id] || []),
                  {
                    message: result?.url_list[i],
                    isReceived: false,
                    time:
                      new Date().toLocaleDateString() +
                      " " +
                      new Date().toLocaleTimeString(),
                  },
                ],
              }));
            }

            setMessage("");
            setSelectedFiles([]);
            success = true;
          }
          setSelectedFiles([]);
          success = true;
        }
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }

    if (message.trim()) {
      const messageData = {
        from_user_id: userToken?.user?.id,
        to_user_id: to_user_id,
        message: message.trim(),
        createdAt: new Date().toLocaleTimeString(),
      };

      ws.current.send(JSON.stringify(messageData));

      setChatHistory((prevHistory) => ({
        ...prevHistory,
        [to_user_id]: [
          ...(prevHistory[to_user_id] || []),
          {
            message: message.trim(),
            isReceived: false,
            time:
              new Date().toLocaleDateString() +
              " " +
              new Date().toLocaleTimeString(),
          },
        ],
      }));
      setMessage("");
      setSelectedFiles([]);
      success = true;
    }
    let previousChat = selectedChat;
    setSelectedChat(null);
    setSelectedChat(previousChat);
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

    const firstPart = input.slice(0, 14);
    const lastPart = input.slice(-10);

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
                <div className=" absolute   rounded-md right-12 mt-14 ml-5 w-60 bg-gray-400 border border-gray-300 shadow-lg z-50 ">
                  <div className=" absolute right-4  rotate-45 -translate-y-1/3 w-6 h-6   bg-gray-400 overflow-x-hidden -z-40"></div>
                  <ul className="text-black p-1 ">
                    <li className=" px-2 py-2 flex flex-row gap-2 hover:bg-gray-100 hover:rounded-xl  z-50 overflow-hidden text-xs ">
                      <GiUnfriendlyFire className="text-xl overflow-hidden " />
                      Unfriend {selectedChat?.user?.name}
                    </li>
                    <li className=" px-2 py-2 flex flex-row gap-2 hover:bg-gray-100 hover:rounded-xl  z-50 overflow-hidden text-xs ">
                      <MdAutoDelete className="text-xl " />
                      Clear History
                    </li>
                  </ul>
                </div>
              )}
              <div className="flex flex-col h-full overflow-y-scroll no-scrollbar font-sans">
                <div className="flex-1 md:bg-gray-200 rounded-lg">
                  {chatHistory[selectedChat?.alumni?.user_id]?.map(
                    (msg, index) => {
                      const isLongMessage =
                        msg.message && msg.message.length > 100;

                      return (
                        <div
                          key={index}
                          className={`p- flex ${
                            msg.isReceived ? "justify-start" : "justify-end"
                          } w-full`}
                        >
                          <div
                            className={`inline-block max-w-[90%] lg:max-w-[70%] ${
                              isLongMessage ? "block w-full" : ""
                            } rounded-lg p-2 relative`}
                          >
                            {/* <div className={`${msg.isReceived ? "text-left" : "text-right"} mb-2`}>
                            <div className="inline-block relative group">
                              <button className="text-gray-500">
                                <BiDotsHorizontalRounded />
                              </button>
                              <div className="absolute mt-2 w-28 bg-white border border-gray-300 rounded-md shadow-lg hidden group-hover:block z-10">
                                <ul className="text-black p-2">
                                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Copy</li>
                                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Forward</li>
                                </ul>
                              </div>
                            </div>
                          </div> */}

                            {msg.message &&
                            msg.message.startsWith("uploads/") ? (
                              <>
                                {[
                                  ".JPG",
                                  ".jpg",
                                  ".jpeg",
                                  ".png",
                                  ".gif",
                                  ".bmp",
                                  ".webp",
                                ].some((ext) => msg.message.endsWith(ext)) ? (
                                  <div>
                                    <img
                                      src={getImageBaseUrl(msg.message)}
                                      alt="Sent file"
                                      className="rounded-lg w-full h-auto object-cover mb-1 cursor-pointer"
                                      onClick={() =>
                                        handleImageClick(
                                          getImageBaseUrl(msg.message)
                                        )
                                      }
                                    />

                                    {isFullScreen && currentImage && (
                                      <div
                                        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center p-4 justify-center"
                                        onClick={handleCloseModal}
                                      >
                                        <div className="absolute text-white right-10 top-3 text-4xl">
                                          <VscClose />
                                        </div>
                                        <img
                                          src={currentImage}
                                          alt="Full screen"
                                          className="max-w-full max-h-full object-contain"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ) : null}

                                {msg.message.endsWith(".pdf") ? (
                                  <div className=" rounded-lg text-white flex justify-end space-x-2 w-auto">
                                    <div className="flex flex-row gap-2 px-4 py-3 bg-red-900 rounded-lg">
                                      {" "}
                                      <FaFilePdf className="text-xl" />
                                      <a
                                        href={getImageBaseUrl(msg.message)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-300"
                                      >
                                        {formatString(
                                          msg.message.split("uploads/")[1]
                                        )}
                                      </a>
                                    </div>
                                  </div>
                                ) : null}

                                {msg.message.endsWith(".csv") ? (
                                  <div className="  rounded-lg text-white flex justify-end space-x-2 w-auto">
                                    <div className="flex flex-row gap-2 px-4 py-3 bg-green-900 rounded-lg">
                                      {" "}
                                      <BsFiletypeCsv className="text-xl" />
                                      <a
                                        href={getImageBaseUrl(msg.message)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-300"
                                      >
                                        {formatString(
                                          msg.message.split("uploads/")[1]
                                        )}
                                      </a>
                                    </div>
                                  </div>
                                ) : null}

                                {[
                                  ".doc",
                                  ".docx",
                                  ".xls",
                                  ".xlsx",
                                  ".txt",
                                ].some((ext) => msg.message.endsWith(ext)) ? (
                                  <div className="bg-blue-900 p-2 rounded-lg text-white flex items-center space-x-2">
                                    <FaFileAlt className="text-xl" />
                                    <a
                                      href={getImageBaseUrl(msg.message)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline"
                                    >
                                      {formatString(
                                        msg.message.split("uploads/")[1]
                                      )}
                                    </a>
                                  </div>
                                ) : null}
                              </>
                            ) : (
                              <p
                                className={` flex flex-col-reverse px-3 py-2 ${
                                  msg.isReceived
                                    ? "bg-gray-100 text-gray-900 text-[16px]  rounded-r-lg rounded-tl-2xl  font-serif "
                                    : "bg-gray-300 text-gray-900 text-[16px] text-left  rounded-l-2xl rounded-tr-2xl"
                                }`}
                                style={{
                                  textAlign: msg.isReceived ? "left" : "left",
                                  alignSelf: msg.isReceived
                                    ? "flex-start"
                                    : "flex-end",
                                  height: isLongMessage ? "auto" : "initial",
                                  minHeight: isLongMessage ? "100px" : "auto",
                                }}
                              >
                                {msg.message}
                              </p>
                            )}
                            <span className="block text-xs mt-1 text-gray-500 text-end">
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}

                  <div ref={messagesEndRef} />
                </div>
                <div className="flex flex-wrap gap-2 bg-gray-200 mt-2 rounded-xl">
                  {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-2">
                      {selectedFiles.map((file, index) =>
                        renderFilePreview(file, index)
                      )}
                    </div>
                  )}

                  <div className="flex w-full items-end justify-between border-t mt- overflow-hidden bg-gray-600  rounded-xl m- relative p- focus-within:bg-gray-500">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-inherit text-2xl py-2 rounded-lg flex mb-2"
                    >
                      <MdOutlineAttachFile className="text-gray-100 text-2.5xl translate rotate-45 hover:text-gray-900 pl-1" />
                      <input
                        type="file"
                        accept="image/*,application/pdf,.csv,.txt"
                        onChange={handleFileUpload}
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
                      style={{ height: "auto", maxHeight: "200px" }}
                      className="w-full text-lg pl-4 p-2 bg-gray-600 text-gray-800 resize-none overflow-y-scroll no-scrollbar rounded-lg placeholder-gray-400 focus:bg-gray-500 focus:placeholder-gray-500 h-fit mb-2"
                    />

                    <div className=" bg-gray-500 hover:bg-gray-700 p-2.5 h-fit rounded-xl  group flex justify-center items-center m-auto">
                      <span
                        onClick={onSendMessage}
                        className="flex items-center justify-center"
                      >
                        <IoMdArrowUp className="text-white group-hover:text-gray-200 text-3xl" />
                      </span>
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
