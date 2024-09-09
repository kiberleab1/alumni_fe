import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteInstitute, getInstitutes } from "src/api";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  formatDate,
  parseContactInfo,
  truncateDescription,
} from "../../../utils/utils";
import { InboxArrowDownIcon, NewspaperIcon } from "@heroicons/react/20/solid";
import { CalendarDaysIcon, UsersIcon } from "@heroicons/react/24/solid";
import Modal from "../../../components/utils/DeleteModal";
import QueryResult from "src/components/utils/queryResults";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function InstitutionsPage({
  onCreateInstituteClick,
  onInstituteEditClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isError, data, isLoading } = useQuery(["getInstitutions", currentPage], async () => {
    return await getInstitutes({ pageNumber: currentPage, pageSize: itemsPerPage });
  });

  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <div>
        <ListInstitutions
          institutes={data?.data?.institute}
          onCreateInstituteClick={onCreateInstituteClick}
          onInstituteEditClick={(institute) => onInstituteEditClick(institute)}
          totalItems={data?.data?.total_items}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </QueryResult>
  );
}

// eslint-disable-next-line react/prop-types
function ListInstitutions({
  institutes,
  onCreateInstituteClick,
  onInstituteEditClick,
  totalItems,
  currentPage,
  itemsPerPage,
  setCurrentPage
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const queryClient = useQueryClient();

  // Change page
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  const { mutate: deleteInstituteModalAction } = useMutation(deleteInstitute, {
    onSuccess: () => {
      queryClient.invalidateQueries("getInstitutions");
      closeModal();
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getInstitutions");
      console.error("Error deleting institute:", error);
    },
  });

  const openModal = (institute) => {
    setSelectedInstitute(institute);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInstitute(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedInstitute);
    if (selectedInstitute) {
      const deleteInstituteData = {
        address_id: selectedInstitute.address_id,
        institute_id: selectedInstitute.id,
      };
      deleteInstituteModalAction(deleteInstituteData);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900 font-mono">
            Institututions
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            A list of all the institutions in the system including their name,
            description, start date.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onCreateInstituteClick}
          >
            Add Institute
          </button>
        </div>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="min-w-full">
          <div className="overflow-x-auto">
            <div className="table-container" style={{ maxHeight: "800px" }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      President Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Number Of Students
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Number Of Alumni
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Start Date
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
                  {institutes.map((institute) => (
                    <tr key={institute.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900 text-start">
                          {institute.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {institute.email ? institute.email : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {institute.phone_number
                            ? institute.phone_number
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {truncateDescription(institute.president_name)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {institute.number_of_students
                            ? institute.number_of_students
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {institute.number_of_alumni
                            ? institute.number_of_alumni
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {institute.type ? institute.type : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {formatDate(institute.starting_year)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium ">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-green-900"
                          onClick={() => onInstituteEditClick(institute)}
                        >
                          Edit
                        </a>
                        <a
                          href="#"
                          className="text-red-600 hover:text-red-900 pl-5"
                          onClick={() => openModal(institute)}
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mt-10">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem}</span> to{" "}
              <span className="font-medium">{indexOfLastItem}</span> of{" "}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm overflow-hidden max-w-full"
            aria-label="Pagination"
          >
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border-0 border-gray-300 transition-all duration-300 ${currentPage === 1
                  ? "cursor-not-allowed"
                  : "hover:bg-gray-50"
                }`}
            >
              <IoIosArrowBack className="text-xl" />
            </button>

            {Array.from(
              { length: Math.min(10, totalPages) },
              (_, index) => {
                let pageNumber;

                if (currentPage <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage + 5 >= totalPages) {
                  pageNumber = totalPages - 9 + index;
                } else {
                  pageNumber = currentPage - 5 + index;
                }

                if (pageNumber > totalPages || pageNumber < 1) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`relative inline-flex items-center px-2 py-2 text-sm font-semibold border transition-all duration-300 ${currentPage === pageNumber
                        ? "bg-gray-200 text-black"
                        : "text-black bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border-0 border-gray-300 transition-all duration-300 ${currentPage === totalPages
                  ? "cursor-not-allowed"
                  : "hover:bg-gray-50"
                }`}
            >
              <IoIosArrowForward className="text-xl" />
            </button>
          </nav>
        </div>
        <div className="flex sm:hidden justify-between items-center mt-10">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-lg ${currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
          >
            <IoIosArrowBack className="text-xl" />
          </button>
          <p className="text-sm text-gray-700">
            Showing {indexOfFirstItem} to {indexOfLastItem} of {totalItems}{" "}
            results
          </p>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-lg ${currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
          >
            <IoIosArrowForward className="text-xl" />
          </button>
        </div>
      </div>
      {selectedInstitute && (
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          confirmAction={confirmDeletion}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the institute "${selectedInstitute.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}

function StatData() {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-4 xl:gap-x-8 mt-5"
    >
      <li key="1" className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <UsersIcon className="h-12 w-12 flex-none rounded-lg bg-white text-green-900 object-cover ring-1 ring-gray-100/10" />
          <div className="text-sm font-medium leading-6 text-gray-900">
            Most Student Enrolled
          </div>
        </div>
        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Bahir Dar University
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">2000</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Addis Ababa Commercial College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1980</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Addis Ababa Science and Technology University
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1657</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Mekelle Business College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1200</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Jimma Engineering College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">870</div>
            </dd>
          </div>
        </dl>
      </li>
      <li key="2" className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <InboxArrowDownIcon className="h-12 w-12 flex-none rounded-lg bg-white text-blue-900 object-cover ring-1 ring-gray-100/10" />
          <div className="text-sm font-medium leading-6 text-gray-900">
            Most Email Sent
          </div>
        </div>
        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Bahir Dar University
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">2000</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Addis Ababa Commercial College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1980</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Addis Ababa Science and Technology University
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1657</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Mekelle Business College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1200</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Jimma Engineering College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">870</div>
            </dd>
          </div>
        </dl>
      </li>
      <li key="3" className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <NewspaperIcon className="h-12 w-12 flex-none rounded-lg bg-white text-pink-900 object-cover ring-1 ring-gray-100/10" />
          <div className="text-sm font-medium leading-6 text-gray-900">
            Most News Published
          </div>
        </div>
        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Bahir Dar University
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">2000</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Addis Ababa Commercial College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1980</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Addis Ababa Science and Technology University
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1657</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Mekelle Business College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1200</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Jimma Engineering College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">870</div>
            </dd>
          </div>
        </dl>
      </li>

      <li key="3" className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <CalendarDaysIcon className="h-12 w-12 flex-none rounded-lg bg-white text-orange-900 object-cover ring-1 ring-gray-100/10" />
          <div className="text-sm font-medium leading-6 text-gray-900">
            Most Event Organized
          </div>
        </div>
        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Bahir Dar University
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">2000</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Addis Ababa Commercial College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1980</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Addis Ababa Science and Technology University
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1657</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Mekelle Business College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">1200</div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="font-mono font-medium text-gray-900">
              Jimma Engineering College
            </dt>
            <dd className="text-gray-700">
              <div className="font-medium text-gray-900">870</div>
            </dd>
          </div>
        </dl>
      </li>
    </ul>
  );
}
