import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  getAllPremissions,
  deletePermission,
  getRoles,
  createPermission,
} from "src/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { formatDate } from "../utils/utils";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../components/utils/DeleteModal";
import QueryResult from "src/components/utils/queryResults";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import { MdKeyOff } from "react-icons/md";
import Pagination from "src/components/adminPagination/adminPagination";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

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
      <IconHeaderWithButton
        title="Permissons"
        Icon={MdKeyOff}
        buttonText="Add Permissons"
        ButtonIcon={MdKeyOff}
        onButtonClick={openModal}
      />

      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="min-w-full">
          <div className="overflow-x-auto">
            <div className="table-container" style={{ maxHeight: "500px" }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead
                  className="sticky top-0 bg-gray-100 z-10 font-serif"
                  data-aos="fade-up"
                >
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
                <tbody
                  className="bg-white divide-y divide-gray-200"
                  data-aos="fade-down"
                >
                  {permissions.map((permission) => (
                    <tr key={permission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900">
                          {permission.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {permission.permission_name
                            ? permission.permission_name
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {permission.role_name ? permission.role_name : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {formatDate(permission.updatedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                        <a
                          href="#"
                          className="text-gray-600 hover:text-green-900"
                          onClick={() => openDeleteModal(permission)}
                        >
                          <CiEdit className="text-2xl" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-red-900 pl-5"
                          onClick={() => openDeleteModal(permission)}
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
          dataLength={permissions.length}
        />
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
