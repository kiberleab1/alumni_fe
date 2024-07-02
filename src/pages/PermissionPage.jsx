import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  getAllPremissions,
  deletePermission,
  getRoles,
  createPermission,
} from "../api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { formatDate } from "../utils/utils";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "./DeleteModal";
import QueryResult from "src/components/utils/queryResults";

export default function PermissionPage() {
  const [rolesData, setRolesData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);

  const { isError, data, isLoading } = useQuery(
    ["getRolesAndPermissions"],
    async () => {
      try {
        const roleData = await getRoles({ pageNumber: 0, pageSize: 20 });
        console.log(roleData);
        if (roleData) {
          const roles = Object.values(roleData.data.role).map((role) => ({
            roleName: role.role_name,
            roleId: role.id,
          }));
          setRolesData(roles);
        }

        const permissionDataResult = await getAllPremissions({
          pageNumber: 1,
          pageSize: 10,
        });
        console.log(permissionDataResult);
        if (permissionDataResult) {
          setPermissionData(permissionDataResult.data.permission);
        }
        return permissionDataResult;
      } catch (error) {
        console.error(error);
      }
    }
  );

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div>
        <ListPermission permissions={permissionData} roles={rolesData} />
      </div>
    </QueryResult>
  );
}

function Modal({ onClose, roles }) {
  const queryClient = useQueryClient();
  const mutation = useMutation(createPermission, {
    onSuccess: () => {
      queryClient.invalidateQueries("getRolesAndPermissions");
      toast.success("Permission created successfully");
      onClose();
    },
    onError: (error) => {
      queryClient.invalidateQueries("getRolesAndPermissions");
      toast.error(`Error creating permission: ${error}`);
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
          <h3 className="text-xl font-semibold">Create New Permission</h3>
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
            initialValues={{
              role_name: "",
              permission_name: "",
              created_admin_id: "12ww2-ewdew34-dwe23-w-23dw",
            }}
            validationSchema={Yup.object({
              role_name: Yup.string().required("Role Name is required"),
              permission_name: Yup.string().required(
                "Permission Name is required"
              ),
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-10">
                <div>
                  <label
                    htmlFor="permission_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Permission Name
                  </label>
                  <Field
                    type="text"
                    id="permission_name"
                    name="permission_name"
                    placeholder="Enter Permission Name"
                    className="mt-1 block w-full border bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                  <ErrorMessage
                    name="permission_name"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role Name
                  </label>
                  <Field
                    as="select"
                    id="role_name"
                    name="role_name"
                    className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.roleId} value={role.roleName}>
                        {role.roleName}
                      </option>
                    ))}
                  </Field>
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
function ListPermission({ permissions, roles }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = permissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(permissions.length / itemsPerPage);
  const queryClient = useQueryClient();

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

  //

  const openDeleteModal = (permission) => {
    setSelectedPermission(permission);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedPermission(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedPermission);
    if (selectedPermission) {
      deletePermissionModalAction(selectedPermission);
    }
  };

  const { mutate: deletePermissionModalAction } = useMutation(
    deletePermission,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getRolesAndPermissions");
        closeDeleteModal();
        toast.success("Admin Deleted successfully!");
      },
      onError: (error) => {
        closeDeleteModal();
        queryClient.invalidateQueries("getRolesAndPermissions");
        toast.success("Error deleting admin!");
        console.log(error);
      },
    }
  );

  return (
    <div className="flex flex-col">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Permissons
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the permissions in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={openModal}
          >
            Add Permission
          </button>
        </div>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="min-w-full">
          <div className="overflow-x-auto">
            <div className="table-container" style={{ maxHeight: "1000px" }}>
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
                      Permisson Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Permission Given to
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
                  {currentItems.map((permission) => (
                    <tr key={permission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900">
                          {permission.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {permission.permission_name
                            ? permission.permission_name
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {permission.role_name ? permission.role_name : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {formatDate(permission.updatedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium ">
                        <a
                          href="#"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => openDeleteModal(permission)}
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
                  {Math.min(indexOfLastItem, permissions.length)}
                </span>{" "}
                of <span className="font-medium">{permissions.length}</span>{" "}
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
      {isModalOpen && <Modal onClose={closeModal} roles={roles} />}
      {selectedPermission && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          closeModal={closeModal}
          confirmAction={confirmDeletion}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the permission "${selectedPermission.permission_name} To ${selectedPermission.role_name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
