import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { IoIosSend, IoMdArrowRoundBack } from "react-icons/io";

export default function ChatUi() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState({
    Abebe: [
      {
        sender: "Abebe",
        message: "Hey, how's it going?",
        time: "5:30:00 PM",
        isReceived: true,
      },
      {
        sender: "You",
        message: "Hi! I'm doing well, thanks. How about you?",
        time: "5:35:00 PM",
        isReceived: false,
      },
      {
        sender: "Abebe",
        message:
          "I'm great! Just wanted to catch up. Are you planning to attend the alumni event next month?",
        time: "5:40:00 PM",
        isReceived: true,
      },
      {
        sender: "You",
        message: "Hi! I'm doing well, thanks. How about you?",
        time: "5:35:00 PM",
        isReceived: false,
      },
      {
        sender: "Abebe",
        message:
          "I'm great! Just wanted to catch up. Are you planning to attend the alumni event next month?",
        time: "5:40:00 PM",
        isReceived: true,
      },
      {
        sender: "You",
        message: "Hi! I'm doing well, thanks. How about you?",
        time: "5:35:00 PM",
        isReceived: false,
      },
      {
        sender: "Abebe",
        message:
          "I'm great! Just wanted to catch up. Are you planning to attend the alumni event next month? Are you planning to attend the alumni event next month?",
        time: "5:40:00 PM",
        isReceived: true,
      },
      {
        sender: "You",
        message: "Hi! I'm doing well, thanks. How about you?",
        time: "5:35:00 PM",
        isReceived: false,
      },
      {
        sender: "Abebe",
        message:
          "I'm great! Just wanted to catch up. Are you planning to attend the alumni event next month?",
        time: "5:40:00 PM",
        isReceived: true,
      },
    ],
    Alemu: [
      {
        sender: "Alemu",
        message: "Are you coming to the reunion?",
        time: "4:30:00 PM",
        isReceived: true,
      },
    ],
    Beruk: [
      {
        sender: "Beruk",
        message: "Great catching up yesterday!",
        time: "3:30:00 PM",
        isReceived: true,
      },
    ],
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory[selectedChat]]);

  const onSendMessage = () => {
    if (message.trim()) {
      setChatHistory((prev) => ({
        ...prev,
        [selectedChat]: [
          ...prev[selectedChat],
          {
            sender: "You",
            message,
            time: new Date().toLocaleTimeString(),
            isReceived: false,
          },
        ],
      }));
      setMessage("");
    }
  };
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [message]);

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-[90vh] bg-white">
      <div
        className={`w-[100%] md:w-1/3 p-1 md:p-4 border-r overflow-y-auto ${
          selectedChat ? "hidden md:block" : "block"
        }`}
      >
        <h2 className="text-xl font-medium mb-4 border-b-2">Connections</h2>
        {Object.keys(chatHistory).map((name) => (
          <div
            key={name}
            onClick={() => setSelectedChat(name)}
            className={`p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 ${
              selectedChat === name ? "bg-gray-300" : "bg-gray-100 "
            } `}
          >
            <h3 className="font-semibold text-gray-800 text-start">{name}</h3>
            <p className="text-gray-500 text-start line-clamp-1">
              {chatHistory[name][chatHistory[name].length - 1]?.message}
            </p>
          </div>
        ))}
      </div>

      <div
        className={`w-full md:w-2/3 p-1 md:p-4 flex flex-col justify-between  ${
          selectedChat ? "block" : "hidden md:block"
        }`}
      >
        {selectedChat && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedChat}</h2>
              <button
                onClick={handleBackClick}
                className="md:hidden bg-white text-white py-2 px-4 rounded-lg"
              >
                <IoMdArrowRoundBack className="text-black" />
              </button>
            </div>

            <div className="flex flex-col h-full overflow-y-scroll no-scrollbar">
              <div className="flex-1 h- ">
                {chatHistory[selectedChat]?.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 ${
                      msg.isReceived ? "text-left" : "text-right"
                    }`}
                  >
                    <p
                      className={`inline-block p-2 rounded-lg max-w-[60%] ${
                        msg.isReceived
                          ? "bg-gray-300 text-black"
                          : "bg-gray-800 text-white"
                      }`}
                    >
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
                  ref={textareaRef}
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
        )}
      </div>
    </div>
  );
}
