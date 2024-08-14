import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { deleteJobHistory, getAllJobHistory } from "src/api";
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
import image1 from "../../../assets/images/testimonial/2.jpg";
import image2 from "../../../assets/images/testimonial/3.jpg";
import image3 from "../../../assets/images/testimonial/4.jpg";
const users = [
  {
    id: 1,
    name: "Joe Doe",
    Department: "Senior Software Engineer",
    img: image1,
  },
  {
    id: 2,
    name: "Joe Doe2",
    Department: "Senior Software Engineer",
    img: image2,
  },
  {
    id: 3,
    name: "Joe Doe3",
    Department: "Senior Software Engineer",
    img: image3,
  },
  {
    id: 4,
    name: "Joe Doe3",
    Department: "Senior Software Engineer",
    img: image3,
  },
];
export default function JobHistoryPage({
  onCreateJobHistoryClick,
  onEditJobHistoryClick,
}) {
  const [jobHistorys, setJobs] = useState([]);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobHistory, setSelectedJobHistory] = useState(null);
  const [jobHistory, setjobHistory] = useState(false);

  const [getId, setgetId] = useState("");
  const queryClient = useQueryClient();

  const displayHistory = (getId) => {
    console.log(getId);
    setjobHistory(!jobHistory);
  };
  const { isError, data, isLoading } = useQuery(
    ["getAllJobHistory"],
    async () => {
      const jobsData = await getAllJobHistory({ pageNumber: 1, pageSize: 10 });
      setJobs(jobsData.data.jobHistory);
      return jobsData;
    },
    { keepPreviousData: true }
  );

  // @ts-ignore
  // const mutation = useMutation(deleteJobHistory, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("getAllJobHistory");
  //   },
  // });

  const { mutate: deleteJobHistoryModalAction } = useMutation(
    deleteJobHistory,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getAllJobHistory");
        closeModal();
        toast.success("Job Deleted successfully!");
      },
      onError: (error) => {
        closeModal();
        queryClient.invalidateQueries("getAllJobHistory");
        console.error("Error deleting jobHistory:", error);
        toast.success("Error deleting jobHistory!");
      },
    }
  );

  const openModal = (jobHistory) => {
    setSelectedJobHistory(jobHistory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJobHistory(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedJobHistory);
    if (selectedJobHistory) {
      deleteJobHistoryModalAction(selectedJobHistory);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobHistorys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobHistorys.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  useAOS({
    duration: 1200,
    once: true,
  });
  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="sm:flex sm:items-center mb-4 mt-4" data-aos="fade-down">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900 font-sans">
              Jobs History
            </h1>
            <p className="mt-2 text-lg text-gray-500 font-sans-serif">
              A list of all the jobHistorys in the system.
            </p>
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
        {/* /////// */}

        <div
          className=" max-w-8xl flex flex-col md:flex-row items-center justify-center space-x-6 p-4 "
          data-aos="fade-right"
        >
          <div className=" w-full h-auto justify-top  bg-gray-100 shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-left text-gray-800">
                Users
              </h2>
            </div>
            {users.map((val, index) => {
              return (
                <div
                  className="flex items-center p-4 hover:bg-gray-200"
                  onClick={() => displayHistory(`${val.id}`)}
                >
                  <img
                    src={val.img}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-grow text-left">
                    <p className="text-lg font-semibold text-gray-800 block">
                      {val.name}
                    </p>
                    <p className="text-sm text-gray-600 block">
                      {val.Department}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-4">
                    <MdMessage className="text-blue-500 hover:text-blue-900 bg-gray-100" />

                    <LuPlus className="text-green-500 hover:text-green-900 bg-gray-100" />
                  </div>
                </div>
              );
            })}
          </div>
          {jobHistory && (
            <div className=" w-full shadow-md rounded-lg overflow-hidden bg-gray-200 ">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-left text-gray-800">
                  Job History
                </h2>
              </div>

              <div>
                <div className="flex items-center p-2">
                  <div className="flex-grow text-left">
                    <p className="text-lg font-semibold text-gray-800 block">
                      Senior Software Engineer
                    </p>
                    <i className="text-sm text-gray-600 block">Acme lnc.</i>
                  </div>

                  <div className="flex-shrink-0 flex items-center space-x-4">
                    Jan 2020 - Present
                  </div>
                </div>
                <div>
                  <p className="text-left p-2">
                    Integrated your provided card structure for Senior Software
                    Engineer as the second card, maintaining its original
                    styling.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center p-2">
                  <div className="flex-grow text-left">
                    <p className="text-lg font-semibold text-gray-800 block">
                      Front-End Developer
                    </p>
                    <i className="text-sm text-gray-600 block">XYZ Corp.</i>
                  </div>

                  <div className="flex-shrink-0 flex items-center space-x-4">
                    Jun 2018 - Dec 2019
                  </div>
                </div>
                <div>
                  <p className="text-left p-2">
                    Integrated your provided card structure for Senior Software
                    Engineer as the second card, maintaining its original
                    styling.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center p-2">
                  <div className="flex-grow text-left">
                    <p className="text-lg font-semibold text-gray-800 block">
                      Intern
                    </p>
                    <i className="text-sm text-gray-600 block">startup lnc..</i>
                  </div>

                  <div className="flex-shrink-0 flex items-center space-x-4">
                    May 2017 - Aug 2017
                  </div>
                </div>
                <div>
                  <p className="text-left p-2">
                    Integrated your provided card structure for Senior Software
                    Engineer as the second card, maintaining its original
                    styling.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* //////////// */}
        {/* <div
          data-aos="fade-right"
          className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-14"
        >
          <div className="min-w-full">
            <div className="overflow-x-auto">
              <div className="table-container" style={{ maxHeight: "500px" }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="sticky top-0 bg-gray-200 z-10">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        User Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Job Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Duration
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((jobHistory) => (
                      <tr key={jobHistory.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-900">
                            {jobHistory.user_id ? jobHistory.user_id : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-900">
                            {jobHistory.title ? jobHistory.title : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-900">
                            {jobHistory.status ? jobHistory.status : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-900">
                            {formatDate(jobHistory.duration)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium ">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-green-900"
                            onClick={() => onEditJobHistoryClick(jobHistory)}
                          >
                            Detail
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                <span className="ml-2">Previous</span>
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
              >
                <span className="mr-2">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, jobHistorys.length)}
                  </span>{" "}
                  of <span className="font-medium">{jobHistorys.length}</span>{" "}
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
                    className={`mr-2 ml-2 relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === 1 ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`relative ${
                        currentPage === pageNumber
                          ? "z-10 bg-indigo-600 text-white"
                          : "text-gray-900 bg-white hover:bg-gray-50"
                      } inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === totalPages ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div> */}
        {selectedJobHistory && (
          <Modal
            isOpen={isModalOpen}
            closeModal={closeModal}
            confirmAction={confirmDeletion}
            title="Confirm Deletion"
            message={`Are you sure you want to delete the jobHistory "${selectedJobHistory.title}"? This action cannot be undone.`}
          />
        )}
      </div>
    </QueryResult>
  );
}
