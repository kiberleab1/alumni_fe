import { useState } from "react";
import { MdClose } from "react-icons/md";
import { getImageBaseUrl } from "src/api";

const AlumniProfileModal = ({
  isOpen,
  onClose,
  alumniData,
  alumniName,
  alumniImg,
  alumniEmail,
}) => {
  console.log(isOpen);

  if (!isOpen) return null;
  const [toggleStates, setToggleStates] = useState(alumniData.map(() => false));

  const handleToggle = (index) => {
    setToggleStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out scale-100">
        <div onClick={onClose} className=" flex text-end justify-end">
          <button className="text-gray-500 hover:text-gray-700 bg-gray-100 text-xl px-3 py-2 rounded-lg hover:bg-gray-400 transition duration-200 ease-in-out max-w-xl">
            {" "}
            <MdClose />
          </button>
        </div>{" "}
        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex flex-row gap-3 justify-center items-end">
            <img
              src={getImageBaseUrl(alumniImg)}
              alt={`${alumniData.name}'s profile`}
              className="w-20 h-20 rounded-full border"
            />
            <div className="flex flex-col items-start mb-1">
              <p className="text-xl font-semibold font-serif text-gray-800 align-bottom ">
                {alumniName}
              </p>
              <p className="font-sans font- align-top">{alumniEmail}</p>
            </div>
          </div>
        </div>
        <h4 className="text-start text-lg font-semibold mb-3 mt-1 text-teal-400">
          Who can see your privacy ?
        </h4>
        <div className="mt-4 flex flex-col gap-2">
          {alumniData.map((section, index) => (
            <div
              key={index}
              className="flex items-center justify-between b gap-2 p-1"
            >
              <h6 className="text-gray-800 text-lg">{section.title}</h6>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={toggleStates[index]}
                  checked={toggleStates[index]}
                  className="sr-only peer"
                  onChange={() => handleToggle(index)}
                />
                <div
                  className={`relative w-11 h-6  bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 ease-in-out dark:border-gray-600 ${
                    toggleStates[index]
                      ? "peer-checked:bg-teal-400 peer-checked:after:translate-x-full "
                      : ""
                  }`}
                ></div>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-20 border-t-2 p-1">
          <p>
            Choose who can see your personal information, including contact
            details, job history, and more...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfileModal;
