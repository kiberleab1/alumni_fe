import { useQuery, useQueryClient, useMutation } from "react-query";
import { getDepartments, deleteDepartment } from "src/api";
import { useState } from "react";
import { parseContactInfo } from "../../../utils/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/utils/DeleteModal";
import QueryResult from "src/components/utils/queryResults";

export default function DepartmentPage({
  onCreateDepartmentClick,
  onDepartmentEditClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { isError, data, isLoading } = useQuery(["getDepartments", currentPage], async () => {
    return await getDepartments({ pageNumber: currentPage, pageSize: itemsPerPage });
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div>
        <ListDepartment
          departments={data?.data?.department}
          onCreateDepartmentClick={onCreateDepartmentClick}
          onDepartmentEditClick={(department) =>
            onDepartmentEditClick(department)
          }
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
function ListDepartment({
  departments,
  onCreateDepartmentClick,
  onDepartmentEditClick,
  totalItems,
  currentPage,
  itemsPerPage,
  setCurrentPage
}) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const queryClient = useQueryClient();

  // Mutation for deleting a department
  const { mutate: deleteDept } = useMutation(deleteDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries("getDepartments");
      closeModal();
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getDepartments");
      console.error("Error deleting department:", error);
    },
  });

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };


  const openModal = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDepartment(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedDepartment);
    if (selectedDepartment) {
      deleteDept(selectedDepartment);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900 font-mono">
            Departments
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            A list of all the departments in the system including their name,
            description, start date.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onCreateDepartmentClick}
          >
            Add Department
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
                      Head Of Department
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Institute Id
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
                  {departments.map((department) => (
                    <tr key={department.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900">
                          {department.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {department.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {department.phone_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {department.head_of_department || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {department.institute_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-green-900"
                          onClick={() => onDepartmentEditClick(department)}
                        >
                          Edit
                        </a>
                        <a
                          href="#"
                          className="text-red-600 hover:text-red-900 pl-5"
                          onClick={() => openModal(department)}
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
                  {Math.min(indexOfLastItem, departments.length)}
                </span>{" "}
                of <span className="font-medium">{departments.length}</span>{" "}
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
      </div>
      {selectedDepartment && (
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          confirmAction={confirmDeletion}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the department "${selectedDepartment.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
