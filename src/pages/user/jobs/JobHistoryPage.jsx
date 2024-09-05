import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { deleteJobHistory, getAllJobHistory, getImageBaseUrl } from "src/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { formatDate } from "src/utils/utils";
import Modal from "src/components/utils/DeleteModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import QueryResult from "src/components/utils/queryResults";
import useAOS from "../aos";
import { GrHistory } from "react-icons/gr";
import { MdMessage } from "react-icons/md";
import { LuPlus } from "react-icons/lu";

export default function JobHistoryPage({
  onCreateJobHistoryClick,
  onEditJobHistoryClick,
}) {
  const [jobHistories, setJobHistories] = useState([]);
  const [selectedJobHistory, setSelectedJobHistory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showJobHistoryDetails, setShowJobHistoryDetails] = useState(false);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const { isError, data, isLoading } = useQuery(
    ["getAllJobHistory"],
    async () => {
      const jobsData = await getAllJobHistory({ pageNumber: 1, pageSize: 50 }); // Adjust pagination as needed
      setJobHistories(jobsData.data.jobHistory);
      return jobsData;
    },
    { keepPreviousData: true }
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobHistories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobHistories.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleUserClick = (jobHistory) => {
    // Check if the modal is open and the same user is clicked
    if (isModalOpen && selectedJobHistory?.user_id === jobHistory.user_id) {
      // Close the modal if the same user is clicked
      setIsModalOpen(false);
      setShowJobHistoryDetails(false);
    } else {
      // Open the modal and set the new user data
      setSelectedJobHistory(jobHistory);
      setShowJobHistoryDetails(true);
      setIsModalOpen(true);
    }
  };
  useAOS({ duration: 1200, once: true });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="sm:flex sm:items-center mb-4 mt-4" data-aos="fade-down">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900 font-sans">
              Our Alumnis Job History
            </h1>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <a
              href="#_"
              className="relative inline-block text-lg group "
              onClick={onCreateJobHistoryClick}
            >
              <span className="relative z-10 block px-4 py-2 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                <span className="relative flex ">
                  <GrHistory className="mr-2 text-xl" /> JobHistory
                </span>
              </span>
              <span
                className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                data-rounded="rounded-lg"
              ></span>
            </a>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row space-x-6 p-4"
          data-aos="fade-right"
        >
          <div className="w-full shadow-md rounded-lg bg-gray-100">
            {currentItems.map((user, index) => (
              <div
                key={user.user_id}
                className="flex items-center p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={getImageBaseUrl(user?.user_photo)}
                  alt={user.user_name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div className="flex-grow text-left">
                  <p className="text-lg font-semibold text-gray-800">
                    {user.user_name}
                  </p>
                  <p className="text-sm text-gray-600">{user.degree}</p>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-4">
                  <MdMessage className="text-blue-500 hover:text-blue-900" />
                  <LuPlus className="text-green-500 hover:text-green-900" />
                </div>
              </div>
            ))}
          </div>

          {isModalOpen && showJobHistoryDetails && selectedJobHistory && (
            <div className="w-full shadow-md rounded-lg bg-gray-200">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Job History</h2>
              </div>
              {selectedJobHistory?.job_history.map((job, index) => (
                <div>
                  <div className="flex items-center p-2">
                    <div className="flex-grow text-left">
                      <p className="text-lg font-semibold text-gray-800 block">
                        {job?.title}
                      </p>
                      <i className="text-sm text-gray-600 block">
                        {job?.title}
                      </i>
                    </div>

                    <div className="flex-shrink-0 flex items-center space-x-4">
                      {job?.duration}
                    </div>
                  </div>
                  <div>
                    <p className="text-left p-2">{job?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center p-4 sticky bottom-0 bg-white border-t">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-900 bg-white"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-900 bg-white"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </QueryResult>
  );
}
