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
  const [newsList, setNewsList] = useState([]);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const queryClient = useQueryClient();

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
  useAOS({ duration: 1200, once: true });
  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <div className="flex flex-col justify-between max-h-[]  ">
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
              {newsList.map((val, idx) => (
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

                // <div className="max-w-sm rounded-lg overflow-hidden shadow-lg">
                //   <div className="relative">
                //     <img
                //       className="w-full h-48 object-cover"
                //       src={img}
                //       alt="Travel"
                //     />
                //     <div className="absolute bottom-0 left-0 bg-white bg-opacity-75 text-sm text-gray-800 px-2 py-1 rounded-tr">
                //       {convertDate(val.deadline)}
                //     </div>
                //   </div>
                //   <div className="px-4 py-3">
                //     <div className="flex items-center text-sm text-gray-500 space-x-4">
                //       <span>Global</span>
                //     </div>
                //     <div className="mt-2 min-w-[350px]">
                //       <p className="text-xl font-semibold text-gray-600 text-start">
                //         {val.title}
                //       </p>
                //     </div>
                //   </div>
                // </div>
                // <figure
                //   key={idx}
                //   className="snip1347 rounded-xl relative overflow-hidden m-4 min-w-[300px] max-w-[350px] w-full text-white text-left leading-relaxed bg-[#141414] font-roboto group sm:min-w-[300px] shadow-lg md:min-w-[340px]"
                // >
                //   <div className="relative w-full overflow-hidden">
                //     <img
                //       src={val.images}
                //       alt="sample87"
                //       className="transform rotate-5 scale-90 transition-transform duration-300 ease-in-out origin-center group-hover:scale-110 group-hover:rotate-0 w-full h-[300px]"
                //     />
                //     <div className="absolute bottom-0 left-0 w-full text-left px-6 pt-3 tracking-wide bg-[black] group-hover:opacity-25">
                //       <div className="absolute bottom-full right-0 w-0 h-0 border-t-0 border-l-[400px] border-t-[40px] border-r-0 border-b-transparent border-l-[black] border-t-transparent border-r-transparent group-hover:opacity-25"></div>
                //     </div>
                //   </div>
                //   <div className="date absolute bg-gray-900 top-0 right-0 w-full px-6 pt-3 text-right text-xs uppercase bg-[#1e1e1e] text-white group-hover:bg-[#141414] transition-colors duration-300 ease-in-out">
                //     {convertDate(val.deadline)}
                //     <div className="absolute top-full left-0 w-0 h-0 border-t-0 border-r-[400px] border-b-[40px] border-l-0 border-r-[#1e1e1e] border-b-transparent group-hover:opacity-25"></div>
                //   </div>
                //   <figcaption className="w-full p-6 bg-gray-800 group-hover:bg-gray-800 transition-colors duration-300 ease-in-out">
                //     <div className="h-auto line-clamp-2">
                //       {" "}
                //       <h2 className="font-light text-2xl leading-snug mb-2 text-gray-400 group-hover:text-white transition-colors duration-300 ease-in-out line-clamp-3 ">
                //         {val.title}
                //       </h2>
                //     </div>
                // <p className="text-sm pt-2 tracking-wide mb-2 opacity-90 group-hover:opacity-100 group-hover:text-white transition-opacity duration-300 ease-in-out  line-clamp-2">
                //   {val.description}
                // </p>
                // <a
                //   href="#"
                //   className="inline-block mt-4 p-2 mx-0 my-2 w-[47%] text-center border border-white text-white hover:text-gray-500 text-xs uppercase tracking-wide font-semibold opacity-65 transition-opacity duration-300 hover:opacity-100"
                // >
                //   Read More
                // </a>
                //   </figcaption>
                // </figure>
                // <div className="group relative w-full max-w-lg max-h-80 overflow-hidden rounded-lg shadow-lg ">
                //   <img
                //     src={img}
                //     alt="Card Image"
                //     className="w-full h-full min-h-72 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                //   />

                //   <div className="absolute bottom-0 left-0 w-full p-4 text-white bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity duration-300 ease-in-out">
                //     <div className="space-y-">
                //       <h3 className="text-xl font-semibold text-start text-white">
                //         {val.title}
                //       </h3>
                //       <p className="text-sm transition-opacity duration-500 ease-in-out mt-4 text-start line-clamp-1 truncate">
                //         {convertDate(val.deadline)}
                //       </p>
                //     </div>

                //     <div className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-32">
                //       <div
                //         dangerouslySetInnerHTML={{ __html: val.description }}
                //         className="text-sm transition-opacity duration-500 ease-in-out mt-4 text-start truncate text-white"
                //       ></div>

                //       {/* Button placed at the bottom right */}
                //       <div className="flex justify-end ">
                //         <button
                // className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-300"
                // onClick={() => onNewsDetailClick(val)}
                //         >
                //           Read more
                //         </button>
                //       </div>
                //     </div>
                //   </div>
                // </div>
              ))}
            </div>
            {/* <section className="py-24 ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
              <div className="flex  justify-center mb-14 gap--8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">
                <div className="group cursor-pointer w-full max-lg:max-w-xl lg:w-1/3 border border-gray-300 rounded-2xl p-5 transition-all duration-300 hover:border-indigo-600">
                  <div className="flex items-center mb-6">
                    <img
                      src="https://pagedone.io/asset/uploads/1696244579.png"
                      alt="John image"
                      className="rounded-lg w-full"
                    />
                  </div>
                  <div className="block">
                    <h4 className="text-gray-900 font-medium leading-8 mb-9 text-start">
                      From Classroom to Cyberspace: The Growing Influence of
                      EdTech in Fintech
                    </h4>
                    <div className="flex items-center justify-between  font-medium">
                      <h6 className="text-sm text-gray-500">By John D.</h6>
                      <span className="text-sm text-indigo-600">
                        2 year ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}
            {/* <div className="max-w-sm rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img
                className="w-full h-48 object-cover"
                src="https://pagedone.io/asset/uploads/1696244579.png"
                alt="Travel"
              />
              <div className="absolute bottom-0 left-0 bg-white bg-opacity-75 text-sm text-gray-800 px-2 py-1 rounded-tr">
                01 Aug 2023
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>Global</span>
              </div>
              <div className="mt-2">
                <p className="text-xl font-semibold text-gray-600 text-start">
                  How technology is revolutionizing the travel experience
                </p>
              </div>
            </div>
          </div> */}
            {/* 
          <div className="max-w-4xl flex  p-6 border border-purple-500 rounded-lg bg-white shadow-md mt-6">
            <img
              className="w-52 h-48 object-cover rounded-lg"
              src="https://pagedone.io/asset/uploads/1696244579.png"
              alt="Fintech"
            />
            <div className="relative ml-6 flex-1 ">
              <h2 className="text-2xl font-semibold text-gray-800 text-start top-0">
                From Payments to Investments: Unveiling the Future of Fintech
              </h2>
              <div className="flex items-center mt-3 absolute bottom-0 min-w-full">
                <div className="flex flex-row w-[100%]">
                  <img
                    className="w-12 h-12 rounded-full"
                    src="https://pagedone.io/asset/uploads/1696244579.png"
                    alt="Author"
                  />
                  <div className=" max-w-[auto] ml-2">
                    <p className="text-base font-medium text-gray-700">
                      Andrea William william william
                    </p>
                    <p className="text-sm text-start text-gray-500">
                      21 Jan 2023
                    </p>
                  </div>
                </div>
                <div className="ml-4 w-full ">
                  <div className=" font-medium text-purple-600 justfiy-end text-end">
                    <h4 className="">Business</h4>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          </div>
        </div>
        <div className="absolute flex justify-end  items-center bottom-0 left-1/2 transform -translate-x-[50%] xl:-translate-x-[40%] min-w-[90%] xl:min-w-[60%] p-2">
          <div className="hidden xl:flex sm:flex-1 sm:items-center sm:justify-start">
            <p className="text-lg font-sans text-gray-700">
              Showing{" "}
              <span className="text-lg text-teal-600">{indexOfFirstItem}</span>{" "}
              to{" "}
              <span className="text-lg text-teal-600">{indexOfLastItem}</span>{" "}
              of <span className="text-lg ">{totalItems}</span> results
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
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
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
              )
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center  px-2 lg:px-2 text-sm sm:w-10 sm:h-10 font-semibold text-gray-900  bg-white border-1 border-teal-500 rounded-lg transition-all duration-300 ${
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
    </QueryResult>
  );
}
