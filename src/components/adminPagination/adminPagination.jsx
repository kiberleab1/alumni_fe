import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({
  currentPage,
  totalPages,
  onPaginate,
  indexOfFirstItem,
  indexOfLastItem,
  dataLength,
}) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPaginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
        >
          <IoIosArrowBack className="h-5 w-5" aria-hidden="true" />
          <span className="ml-2">Previous</span>
        </button>
        <button
          onClick={() => onPaginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage === totalPages ? "cursor-not-allowed" : ""
          }`}
        >
          <span className="mr-2">Next</span>
          <IoIosArrowForward className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="absolute flex justify-end items-center bottom-0 left-1/2 transform -translate-x-[50%] xl:-translate-x-[40%] min-w-[90%] xl:min-w-[60%] p-2">
        <div className="hidden xl:flex sm:flex-1 sm:items-center sm:justify-start">
          <p className="text-lg font-sans text-gray-700">
            Showing{" "}
            <span className="text-lg text-teal-600">
              {indexOfFirstItem + 1}
            </span>{" "}
            to{" "}
            <span className="text-lg text-teal-600">
              {Math.min(indexOfLastItem, dataLength)}
            </span>{" "}
            of <span className="text-lg">{dataLength}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex space-x-2 rounded-md items-center justify-center shadow-sm overflow-hidden"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPaginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 sm:w-10 sm:h-10 font-semibold text-gray-900 bg-white border-1 border-teal-500 rounded-lg  transition-all duration-300 ${
                currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              <IoIosArrowBack className="text-lg" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => onPaginate(pageNumber)}
                  className={`relative inline-flex items-center border-teal-500 px-1 sm:px-2.5 text-sm font-semibold transition-all duration-500 ${
                    currentPage === pageNumber
                      ? " bg-teal-500 text-white rounded-lg sm:w-10 sm:h-10 flex px-1 sm:px-2.5 items-center justify-center"
                      : " text-gray-900  bg-white border-1 sm:w-10 sm:h-10 rounded-lg px-1 sm:px-2.5 flex items-center justify-center"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              onClick={() => onPaginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 lg:px-2 text-sm sm:w-10 sm:h-10 font-semibold text-gray-900 bg-white border-1 border-teal-500 rounded-lg transition-all duration-300 ${
                currentPage === totalPages
                  ? "cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <IoIosArrowForward className="text-lg" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
