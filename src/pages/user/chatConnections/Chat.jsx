import React, { useState } from "react";
import { IoIosSend, IoMdArrowRoundBack } from "react-icons/io";

export default function ChatUi() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
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

  const onSendMessage = () => {
    if (message.trim()) {
      const newChat = [
        ...chatHistory[selectedChat],
        {
          sender: "You",
          message,
          time: new Date().toLocaleTimeString(),
          isReceived: false,
        },
      ];
      setChatHistory({ ...chatHistory, [selectedChat]: newChat });
      setMessage("");
    }
  };

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-fit lg:h-[800px]">
      <div
        className={`w-[100%] md:w-1/3 p-1 md:p-4 border-r  ${
          selectedChat ? "hidden md:block" : "block"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Connections</h2>
        {Object.keys(chatHistory).map((name) => (
          <div
            key={name}
            onClick={() => setSelectedChat(name)}
            className={`p-3 mb-3 rounded-lg cursor-pointer ${
              selectedChat === name ? "bg-gray-300" : "bg-white"
            } hover:bg-gray-200`}
          >
            <h3 className="font-semibold text-start">{name}</h3>
            <p className="text-gray-600 text-start">
              {chatHistory[name][chatHistory[name].length - 1]?.message}
            </p>
          </div>
        ))}
      </div>

      <div
        className={`w-full md:w-2/3 p-1 md:p-4 flex flex-col justify-between ${
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
            <div className="flex flex-col overflow-y-auto h-screen space-y-4">
              {chatHistory[selectedChat].map((chat, index) => (
                <div
                  key={index}
                  className={`flex  ${
                    chat.isReceived ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`px-3 py-1  sm:p-3 rounded-lg ${
                      chat.isReceived
                        ? "bg-gray-200 text-black max-w-[60%]"
                        : "bg-black text-white"
                    }`}
                  >
                    <p className="text-start">{chat.message}</p>
                    <span className="text-xs mt-1 block text-start">
                      {chat.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center border-t ">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
