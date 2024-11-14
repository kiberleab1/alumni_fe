import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  totalItems: number;
  paginate: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  totalItems,
  paginate,
}) => {
  return (
    <div className="absolute flex justify-end  items-center bottom-0 left-1/2 transform -translate-x-[50%] xl:-translate-x-[40%] min-w-[90%] xl:min-w-[60%] p-2 ">
      <div className="hidden xl:flex sm:flex-1 sm:items-center sm:justify-start">
        <p className="text-lg font-sans text-gray-700">
          Showing{" "}
          <span className="text-lg text-teal-600">{indexOfFirstItem}</span> to{" "}
          <span className="text-lg text-teal-600">{indexOfLastItem}</span> of{" "}
          <span className="text-lg ">{totalItems}</span> results
        </p>
      </div>

      <nav
        className=" isolate inline-flex space-x-2 rounded-md items-center justify-center shadow-sm overflow-hidden"
        aria-label="Pagination"
      >
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 sm:w-10 sm:h-10 font-semibold text-gray-900 bg-white border-1 border-teal-500 rounded-lg  transition-all duration-300 ${
            currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
          }`}
        >
          <IoIosArrowBack className="text-lg" />
        </button>

        {Array.from({ length: Math.min(10, totalPages) }, (_, index) => {
          let pageNumber;

          if (currentPage <= 5) {
            pageNumber = index + 1;
          } else if (currentPage + 5 >= totalPages) {
            pageNumber = totalPages - 9 + index;
          } else {
            pageNumber = currentPage - 5 + index;
          }

          if (pageNumber > totalPages || pageNumber < 1) return null;

          return (
            <button
              key={pageNumber}
              onClick={() => paginate(pageNumber)}
              className={`relative inline-flex items-center border-teal-500 px-1 sm:px-2.5 text-sm font-semibold  transition-all duration-500 ${
                currentPage === pageNumber
                  ? " bg-teal-500 text-white rounded-lg sm:w-10 sm:h-10 flex px-1 sm:px-2.5 items-center justify-center"
                  : " text-gray-900  bg-white border-1 sm:w-10 sm:h-10 rounded-lg px-1 sm:px-2.5 flex items-center justify-center"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center  px-2 lg:px-2 text-sm sm:w-10 sm:h-10 font-semibold text-gray-900  bg-white border-1 border-teal-500 rounded-lg transition-all duration-300 ${
            currentPage === totalPages
              ? "cursor-not-allowed"
              : "hover:bg-gray-50"
          }`}
        >
          <IoIosArrowForward className="text-lg" />
        </button>
      </nav>

      <div className=" hidden justify-between items-center mt-10">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`bg-gray-200 hover:bg-gray-400 text-black py-2 px-4 rounded-lg ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
        >
          <IoIosArrowBack className="text-xl" />
        </button>
        <p className="text-sm text-gray-700">
          Showing {indexOfFirstItem} to {indexOfLastItem} of {totalItems}{" "}
          results
        </p>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`bg-gray-200 hover:bg-g-300 text-black py-2 px-4 rounded-lg ${
            currentPage === totalPages ? "cursor-not-allowed" : ""
          }`}
        >
          <IoIosArrowForward className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
