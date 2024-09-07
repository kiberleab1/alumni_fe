import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import QueryResult from "src/components/utils/queryResults";
import { getAllJobs } from "src/api";
import useAOS from "../aos";
import { truncateDescription } from "src/utils/utils";
import JobDetailModal from "./JobDetailModal";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function JobsPage({ onCreateJobClick, onEditJobClick }) {
  const [jobs, setJobs] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { isError, data, isLoading } = useQuery(
    ["getAllJobs", currentPage],
    async () => {
      const jobsData = await getAllJobs({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      });
      return jobsData;
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  useAOS({
    duration: 1200,
    once: true,
  });


  const totalPages = Math.ceil(data?.data?.total_items / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, data?.data?.total_items);

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col max-h-screen">
        <div className="sm:flex sm:items-center mb-4" data-aos="fade-down">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900 font-sans">
              Find your dream job
            </h1>
          </div>
        </div>

        <div
          className="flex flex-wrap justify-center item-center h-full overflow-y-scroll"
          data-aos="fade-right"
        >
          {data?.data?.jobs?.map((val, idx) => (
            <div
              key={idx}
              className="max-w-sm w-full h-[250px] shadow-sm bg-white rounded-lg overflow-hidden p-2 m-3 flex flex-col justify-between"
              onClick={() => openModal(val)}
            >
              <div>
                <h2 className="text-lg text-left font-bold text-gray-800">
                  {val.title}
                </h2>
                <p className="text-gray-600 mt-1 text-left">
                  {val.instituteName}
                </p>
                <p className="text-gray-600 text-left">{val.address}</p>
                <div className="mt-3">
                  <p className="text-gray-700 text-left font-semibold">
                    {truncateDescription(val.description, 150)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-600">{val.hiring_type}</span>
                <span className="text-gray-600 font-bold">${val.salary}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem}</span> to{" "}
              <span className="font-medium">{indexOfLastItem}</span> of{" "}
              <span className="font-medium">{data?.data?.total_items}</span> results
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
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border-0 border-gray-300 ${
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
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border-0 border-gray-300 ${
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
        {selectedJob && (
          <JobDetailModal
            isOpen={isModalOpen}
            onClose={closeModal}
            job={selectedJob}
          />
        )}
      </div>
    </QueryResult>
  );
}
