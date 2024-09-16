// NewsPage.js
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deletedNews, getAllNews, getImageBaseUrl } from "src/api";
import { convertDate, formatDate, truncateDescription } from "src/utils/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";
import img from "../../../assets/images/testimonial/2.jpg";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import useAOS from "../aos";
export default function NewsPage({ onNewsDetailClick }) {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const { isError, data, isLoading } = useQuery(
    ["getAllNews", currentPage],
    async () => {
      const news_data = await getAllNews({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      });
      return news_data;
    },
    { keepPreviousData: true }
  );

  const totalPages = Math.ceil(data?.data?.total_items / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, data?.data?.total_items);
  useAOS({ duration: 1200, once: true });
  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <div className="flex flex-col  bg-gray-20  w-[100%]">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl mb-10 font-semibold text-gray-900 font-sans">
              Latest news
            </h1>
          </div>
        </div>
        <div className="container mx-auto  h-full overflow-y-scroll max-w-[100%] ">
          <div className=" flex flex-wrap justify-center w-[100%]">
            {data?.data?.news.map((val, idx) => (
              <div
                key={idx}
                className="w-[450px] h-fit sm:m-4"
                data-aos="fade-down"
              >
                <div className="group cursor-pointer border border-gray-300 rounded-2xl p-2 sm:p-5 transition-all duration-300 hover:border-indigo-600">
                  <div className="flex justify-center mb-6">
                    <img
                      src={getImageBaseUrl(val.image)}
                      alt="Event"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="relative h-[100px]">
                    <p className="text-gray-900 font-medium leading-8 mb-4 p-1 text-start line-clamp-2">
                      {val.title}
                    </p>
                    <div className="absolute w-[100%] bottom-0 right-0 flex items-center justify-between font-medium ">
                      <a
                        className="py-2 px-4 rounded bg-gray-200 text-black hover:bg-gray-400  transition-colors duration-300"
                        onClick={() => onNewsDetailClick(val)}
                      >
                        Read More
                      </a>

                      <span className="text-sm text-indigo-600">
                        {convertDate(val.deadline)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem}</span> to
              <span className="font-medium"> {indexOfLastItem}</span> of 
              <span className="font-medium"> {data?.data?.total_items}</span> results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative border-0 inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white  ${
                  currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                <IoIosArrowBack className="text-xl" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`relative inline-flex items-center px-2 py-2 text-sm font-semibold border ${
                      currentPage === pageNumber
                        ? "bg-gray-200 text-black "
                        : "text-black bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border-0  ${
                  currentPage === totalPages
                    ? "cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <IoIosArrowForward className="text-xl" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </QueryResult>
  );
}
