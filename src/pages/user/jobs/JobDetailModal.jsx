import React from "react";
import { IoCloseSharp } from "react-icons/io5";

const JobDetailModal = ({ isOpen, onClose, job }) => {
  if (!isOpen) return null;

  // Add Tailwind CSS classes to the job.description HTML string
  const styledDescription = job.description
    .replace(/<h3>/g, '<h3 class="font-bold mb-1">')
    .replace(/<ul>/g, '<ul class="list-disc pl-5">')
    .replace(/<li>/g, '<li class="mb-2">')
    .replace(/<p>/g, '<p class="mb-4">');

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 md:mx-auto relative z-10">
        {/* <button
          onClick={onClose}
         
        >
          &times;
        </button> */}
        <IoCloseSharp
          className="absolute text-2xl top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-left text-black">
            {job.title}
          </h2>
        </div>
        <h3 className="text-gray-800 font-semibold mb-2 text-left">
          {job.instituteName}
        </h3>
        <div
          className="text-sm text-gray-700 mb-4 text-left"
          dangerouslySetInnerHTML={{ __html: styledDescription }}
        ></div>
        <button
          onClick={onClose}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetailModal;
