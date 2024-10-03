import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import QueryResult from "src/components/utils/queryResults";
import { getAllJobs } from "src/api";
import useAOS from "../aos";
import { truncateDescription } from "src/utils/utils";
import JobDetailModal from "./JobDetailModal";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Pagination from "src/components/pagination/paginationUpdated";
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
  const indexOfLastItem = Math.min(
    currentPage * itemsPerPage,
    data?.data?.total_items
  );

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

        {selectedJob && (
          <JobDetailModal
            isOpen={isModalOpen}
            onClose={closeModal}
            job={selectedJob}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        totalItems={data?.data?.total_items}
        paginate={paginate}
      />
    </QueryResult>
  );
}
