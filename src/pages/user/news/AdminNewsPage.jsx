// NewsPage.js
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getAllNews } from "src/api";
import { convertDate } from "src/utils/utils";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";
import img from "../../../assets/images/testimonial/2.jpg";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import useAOS from "../aos";
export default function NewsPage({ onNewsDetailClick }) {
  const [newsList, setNewsList] = useState([]);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { isError, data, isLoading } = useQuery(
    ["getAllNews", currentPage],
    async () => {
      const news_data = await getAllNews({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      });
      setNewsList(news_data.data.news);
      setTotalItems(news_data.data.total_items);
      return news_data;
    },
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (!isError && !isLoading && data) {
      console.log(data);

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

  // console.log(currentPage);
  // console.log(itemsPerPage);
  // console.log(indexOfFirstItem);
  // console.log(indexOfLastItem);
  // console.log(totalItems);
  console.log(newsList);
  useAOS({
    duration: 1200,
    once: true,
  });
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
        <div className="container mx-auto sm:px-10 md:px-20 lg:px-52 lg:pt-12 h-full overflow-y-scroll min-w-[100%] ">
          <div className="m-1 flex flex-wrap gap-8 md:-m-2 ">
            {newsList.map((val) => (
              <div
                className="group relative w-full max-w-lg max-h-80 overflow-hidden rounded-lg shadow-lg "
                data-aos="fade-left"
                key={val.id}
              >
                <img
                  src={img}
                  alt="Card Image"
                  className="w-full h-full min-h-72 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />

                <div className="absolute bottom-0 left-0 w-full p-4 text-white bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity duration-300 ease-in-out">
                  <div className="space-y-">
                    <h3 className="text-xl font-semibold text-start text-white">
                      {val.title}
                    </h3>
                    <p className="text-sm transition-opacity duration-500 ease-in-out mt-4 text-start line-clamp-1 truncate">
                      {convertDate(val.deadline)}
                    </p>
                  </div>

                  <div className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-32">
                    <div
                      dangerouslySetInnerHTML={{ __html: val.description }}
                      className="text-sm transition-opacity duration-500 ease-in-out mt-4 text-start truncate text-white"
                    ></div>

                    {/* Button placed at the bottom right */}
                    <div className="flex justify-end ">
                      <button
                        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-300"
                        onClick={() => onNewsDetailClick(val)}
                      >
                        Read more
                      </button>
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
              Showing <span className="font-medium">{indexOfFirstItem}</span> to{" "}
              <span className="font-medium">{indexOfLastItem}</span> of{" "}
              <span className="font-medium">{totalItems}</span> results
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
