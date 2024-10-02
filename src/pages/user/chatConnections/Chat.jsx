import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { FaBinoculars, FaRocketchat } from "react-icons/fa";
import {
  IoIosArrowDropdown,
  IoIosSend,
  IoMdArrowRoundBack,
} from "react-icons/io";
import {
  IoChatbubbleEllipsesSharp,
  IoCloseSharp,
  IoTelescope,
  IoWoman,
} from "react-icons/io5";
import { MdOutlineAttachFile, MdTagFaces } from "react-icons/md";
import "./css.css";
export default function ChatUi() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);

  const [visibleChats, setVisibleChats] = useState(10);
  const messagesEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState({
    // Alemu: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    //   {
    //     sender: "You",
    //     message: "fuck u",
    //     image: null,
    //     time: "5:35:00 PM",
    //     isReceived: false,
    //   },
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
    Alx: [
      {
        sender: "Abebe",
        message: "Hey, how's it going?",
        image: null,
        time: "5:30:00 PM",
        isReceived: true,
      },
      {
        sender: "You",
        message: "fuck u",
        image: null,
        time: "5:35:00 PM",
        isReceived: false,
      },
      {
        sender: "Abebe",
        message: "Hey, how's it going?",
        image: null,
        time: "5:30:00 PM",
        isReceived: true,
      },
    ],
    // Abd: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
    // Abdw: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
    // Abwd: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
    // Awbd: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
    // Abswd: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
    // Abad: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
    // Abvd: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
    // Abawd: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
    // Abvqd: [
    //   {
    //     sender: "Abebe",
    //     message: "Hey, how's it going?",
    //     image: null,
    //     time: "5:30:00 PM",
    //     isReceived: true,
    //   },
    // ],
  });
  const chatUsers = Object.keys(chatHistory);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory[selectedChat]]);

  const onSendMessage = () => {
    if (message.trim() || selectedImages.length > 0) {
      const messageData = {
        message: message,
        images: selectedImages.map((img) => URL.createObjectURL(img)), // Convert images to URLs
        time: new Date().toLocaleTimeString(),
        sender: "You",
      };

      setChatHistory((prevChatHistory) => ({
        ...prevChatHistory,
        [selectedChat]: [...(prevChatHistory[selectedChat] || []), messageData],
      }));

      setMessage("");
      setSelectedImages([]); // Clear selected images after sending
    }
  };
  // const onSendMessage = () => {
  //   if (message.trim()) {
  //     setChatHistory((prev) => ({
  //       ...prev,
  //       [selectedChat]: [
  //         ...prev[selectedChat],
  //         {
  //           sender: "You",
  //           message,
  //           image: image,
  //           time: new Date().toLocaleTimeString(),
  //           isReceived: false,
  //         },
  //       ],
  //     }));
  //     setMessage("");
  //     setImage(null);
  //   }
  // };
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleBackClick = () => {
    setSelectedChat(null);
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
  console.log(chatHistory[selectedChat]);

  return (
    <div className="flex h-[90vh] w-[] ">
      <div
        className={`w-[100%] md:w-1/3  md:p-4 md:border-r overflow-y-scroll no-scrollbar ${
          selectedChat ? "hidden md:block" : "block"
        }`}
      >
        <h2 className="text-xl font-medium mb-4 border-b-2 ">Connections</h2>
        {chatUsers.length < 1 ? (
          <div className="flex flex-col  text-center gap-2  m-auto rounded-lg p-6 ">
            <IoTelescope className="m-auto text-black text-4xl" />

            <p className="text-gray-600 text-xl">
              {" "}
              You have no Connections history
            </p>
          </div>
        ) : (
          chatUsers.slice(0, visibleChats).map((name) => (
            <div
              key={name}
              onClick={() => {
                setSelectedChat(name);
                setMessage("");
              }}
              className={`p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
                selectedChat === name ? "bg-gray-300" : "bg-gray-100"
              }`}
            >
              <h3 className="font-semibold text-gray-800 text-start">{name}</h3>
              <p className="text-gray-500 text-start line-clamp-1 text-[.8rem]">
                {chatHistory[name][chatHistory[name].length - 1]?.message}
              </p>
            </div>
          ))
        )}

        {visibleChats < chatUsers.length && (
          <button
            onClick={() => setVisibleChats((prev) => prev + 10)} //  10 more users on click
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          >
            See more
          </button>
        )}
      </div>

      <div
        className={`w-full md:w-2/3  md:p-4 flex flex-col justify-between  ${
          selectedChat ? "block" : "hidden md:block"
        }`}
      >
        {selectedChat ? (
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
                <h2 className="text-2xl font-bold">{selectedChat}</h2>
              </div>
              <IoIosArrowDropdown className="text-3xl hover:text-cyan-500 " />
            </div>

            <div className="flex flex-col h-full overflow-y-scroll no-scrollbar font-sans">
              <div className="flex-1 h- ">
                {chatHistory[selectedChat]?.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 ${
                      msg.isReceived ? "text-left " : "text-right"
                    }`}
                  >
                    <div className={`inline-block max-w-[90% lg:max-w-[70%]`}>
                      {/* {msg.image && (
                        <img
                          src={msg.image}
                          alt="Sent"
                          className={`rounded-lg mb-1 ${
                            msg.isReceived ? "bg-gray-300" : "bg-gray-800"
                          }`}
                        />
                      )} */}
                      <div>
                        {msg.images && msg.images.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {msg.images.map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt="Sent"
                                className={`rounded-lg w-[12rem]  h-full object-cover mb-1 ${
                                  msg.sender === "You"
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
                          className={`flex px-3 py-2 rounded-lg font-serif  ${
                            msg.isReceived
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

                {/* {image && (
                  <div className="relative bottom-0 flex justify-start">
                    <img
                      src={image}
                      alt="Selected"
                      className="w-12 h-12 object-cover rounded-full ml-2 cursor-pointer"
                      onClick={handleRemoveImage}
                    />
                  </div>
                )} */}
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

            {/* <div className="flex items-center border-t ">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-1 border rounded-r-none rounded-l-lg border-collapse bg-gray-100 text-black"
              />
              <button
                onClick={onSendMessage}
                className=" bg-black text-white  py-2 rounded-l-none border-collapse"
              >
                <IoIosSend />
              </button>
            </div> */}
          </>
        ) : (
          <div className="relative text-center bg-inherit  bg-gray-100  h-full">
            {/* <div className="dot w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
            <div className="dot two w-4 h-4 bg-red-500 rounded-full animate-bounce ml-2"></div> */}
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
  );
}
