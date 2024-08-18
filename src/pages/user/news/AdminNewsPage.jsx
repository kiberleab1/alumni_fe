// NewsPage.js
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deletedNews, getAllNews } from "src/api";
import { convertDate, formatDate, truncateDescription } from "src/utils/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";


export default function NewsPage({ onCreateNewsClick, onNewsEditClick }) {
  const [newsList, setNewsList] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const queryClient = useQueryClient();

  const { isError, data, isLoading } = useQuery(
    ["getAllNews", currentPage],
    async () => {
      const news_data = await getAllNews({ pageNumber: currentPage, pageSize: itemsPerPage });
      setNewsList(news_data.data.news);
      setTotalItems(news_data.data.total_items);
      return news_data;
    },
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (!isError && !isLoading && data) {
      console.log(data)

      setNewsList(data.data.news);
    }
  }, [isError, isLoading, data]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  console.log(currentPage)
  console.log(itemsPerPage)
  console.log(indexOfFirstItem)
  console.log(indexOfLastItem)
  console.log(totalItems)
  console.log(newsList)
  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <div className="flex flex-col  bg-gray-20  w-[100%]">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl mb-10 font-semibold text-gray-900 font-sans">
              latest news
            </h1>
          </div>
        </div>
        <div className="container mx-auto px-1 py-2 sm:px-10 md:px-20 lg:px-52 lg:pt-12 h-full overflow-y-scroll min-w-[100%] ">
          <div className="m-1 flex flex-wrap md:-m-2 justify-center">
            {newsList.map((val, idx) => (
              <figure
                key={idx}
                className="snip1347 rounded-xl relative overflow-hidden m-4 min-w-[250px] max-w-[300px] w-full text-white text-left leading-relaxed bg-[#141414] font-roboto group sm:min-w-[300px] shadow-lg md:min-w-[340px]"
              >
                <div className="relative w-full overflow-hidden">
                  <img
                    src={val.images}
                    alt="sample87"
                    className="transform rotate-5 scale-90 transition-transform duration-300 ease-in-out origin-center group-hover:scale-110 group-hover:rotate-0 w-full h-[300px]"
                  />
                  <div className="absolute bottom-0 left-0 w-full text-left px-6 pt-3 tracking-wide bg-[black] group-hover:opacity-25">
                    <div className="absolute bottom-full right-0 w-0 h-0 border-t-0 border-l-[400px] border-t-[40px] border-r-0 border-b-transparent border-l-[black] border-t-transparent border-r-transparent group-hover:opacity-25"></div>
                  </div>
                </div>
                <div className="date absolute bg-gray-900 top-0 right-0 w-full px-6 pt-3 text-right text-xs uppercase bg-[#1e1e1e] text-white group-hover:bg-[#141414] transition-colors duration-300 ease-in-out">
                  {convertDate(val.deadline)}
                  <div className="absolute top-full left-0 w-0 h-0 border-t-0 border-r-[400px] border-b-[40px] border-l-0 border-r-[#1e1e1e] border-b-transparent group-hover:opacity-25"></div>
                </div>
                <figcaption className="w-full p-6 bg-gray-800 group-hover:bg-gray-800 transition-colors duration-300 ease-in-out">
                  <h2 className="font-light text-2xl leading-snug mb-2 text-gray-400 group-hover:text-white transition-colors duration-300 ease-in-out">
                    {val.title}
                  </h2>
                  <p className="text-sm pt-2 tracking-wide mb-2 opacity-90 group-hover:opacity-100 group-hover:text-white transition-opacity duration-300 ease-in-out">
                    {truncateDescription(val.description, 150)}
                  </p>
                  <a
                    href="#"
                    className="inline-block mt-4 p-2 mx-0 my-2 w-[47%] text-center border border-white text-white hover:text-gray-500 text-xs uppercase tracking-wide font-semibold opacity-65 transition-opacity duration-300 hover:opacity-100"
                  >
                    Read More
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem}</span> to{" "}
              <span className="font-medium">
                {indexOfLastItem}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {totalItems}
              </span>{" "}
              results
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
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 ${currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"}`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border ${currentPage === pageNumber
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "text-gray-900 bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 ${currentPage === totalPages ? "cursor-not-allowed" : "hover:bg-gray-50"}`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </QueryResult>
  );
}
