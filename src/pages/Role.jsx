import { useMutation, useQuery, useQueryClient } from "react-query";
import { createNewRole, deleteRole, getRoles } from "src/api";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";
import * as Yup from "yup";
import DeleteModal from "../components/utils/DeleteModal";
import { formatDate } from "../utils/utils";

export default function RolePage() {
  const { isError, data, isLoading } = useQuery("getRoles", async () => {
    return await getRoles({ pageNumber: 0, pageSize: 10 });
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div>
        <ListRole roles={data?.data?.role} />
      </div>
    </QueryResult>
  );
}

function Modal({ onClose }) {
  const queryClient = useQueryClient();
  const mutation = useMutation(createNewRole, {
    onSuccess: () => {
      queryClient.invalidateQueries("getRoles");
    },
  });
  const handleSubmit = (values) => {
    console.log({ values });
    mutation.mutate(values);
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-xl font-semibold">Create Role</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="mt-4">
          <Formik
            initialValues={{ role_name: "" }}
            validationSchema={Yup.object({
              role_name: Yup.string().required("Role Name is required"),
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-10">
                <div>
                  <label
                    htmlFor="role_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role Name
                  </label>
                  <Field
                    type="text"
                    id="role_name"
                    name="role_name"
                    placeholder="Enter Role Name"
                    className="mt-1 block w-full border bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                  <ErrorMessage
                    name="role_name"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
// eslint-disable-next-line react/prop-types
function ListRole({ roles }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = roles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(roles.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();

  const openDeleteModal = (role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedRole(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedRole);
    if (selectedRole) {
      deletePermissionModalAction(selectedRole);
    }
  };

  const { mutate: deletePermissionModalAction } = useMutation(deleteRole, {
    onSuccess: () => {
      queryClient.invalidateQueries("getRoles");
      closeDeleteModal();
    },
    onError: (error) => {
      closeDeleteModal();
      queryClient.invalidateQueries("getRoles");
      console.log(error);
    },
  });

  // const deleteRoleClickHandler = async (role) => {
  //   mutation.mutate(role);

  // };

  return (
    <div className="flex flex-col">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Roles
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the roles in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={openModal}
          >
            Add Role
          </button>
        </div>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="min-w-full">
          <div className="overflow-x-auto">
            <div className="table-container" style={{ maxHeight: "500px" }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Role Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Created Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Updated Date
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
                  {currentItems.map((role) => (
                    <tr key={role.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900">
                          {role.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {role.role_name ? role.role_name : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {formatDate(role.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {formatDate(role.updatedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium ">
                        <a
                          href="#"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => openDeleteModal(role)}
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
                  {Math.min(indexOfLastItem, roles.length)}
                </span>{" "}
                of <span className="font-medium">{roles.length}</span> results
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
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
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
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
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
      {isModalOpen && <Modal onClose={closeModal} />}
      {selectedRole && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          closeModal={closeModal}
          confirmAction={confirmDeletion}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the role "${selectedRole.role_name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
