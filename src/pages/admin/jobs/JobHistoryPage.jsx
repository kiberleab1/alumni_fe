import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { deleteJobHistory, getAllJobHistory } from "src/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { formatDate } from "src/utils/utils";
import Modal from "src/components/utils/DeleteModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import { FaPeopleCarry } from "react-icons/fa";
import Pagination from "src/components/adminPagination/adminPagination";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function JobHistoryPage({
  onCreateJobHistoryClick,
  onEditJobHistoryClick,
}) {
  const [jobHistorys, setJobs] = useState([]);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobHistory, setSelectedJobHistory] = useState(null);
  const queryClient = useQueryClient();

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

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col">
        <IconHeaderWithButton
          title="Jobs History"
          Icon={FaPeopleCarry}
          buttonText="Add Jobs History"
          ButtonIcon={FaPeopleCarry}
          onButtonClick={onCreateJobHistoryClick}
        />

        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <div className="min-w-full">
            <div className="overflow-x-auto">
              <div className="table-container" style={{ maxHeight: "500px" }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead
                    className="sticky top-0 bg-gray-50 z-10"
                    data-aos="fade-up"
                  >
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Id
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        User
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
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="bg-white divide-y divide-gray-200"
                    data-aos="fade-down"
                  >
                    {currentItems.map((jobHistory) => (
                      <tr key={jobHistory.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm font-medium text-gray-900 text-start">
                            {jobHistory.id ? jobHistory.id : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {jobHistory.user_id ? jobHistory.user_id : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {jobHistory.title ? jobHistory.title : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {jobHistory.status ? jobHistory.status : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {formatDate(jobHistory.duration)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {formatDate(jobHistory.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                          <a
                            href="#"
                            className="text-gray-600 hover:text-green-600"
                            onClick={() => onEditJobHistoryClick(jobHistory)}
                          >
                            <CiEdit className="text-2xl" />
                          </a>
                          <a
                            href="#"
                            className="text-gray-600 hover:text-red-600 pl-5"
                            onClick={() => openModal(jobHistory)}
                          >
                            <RiDeleteBin5Line className="text-2xl" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPaginate={paginate}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            dataLength={jobHistorys.length}
          />
        </div>
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
