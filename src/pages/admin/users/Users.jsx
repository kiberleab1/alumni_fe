import {
  AdjustmentsHorizontalIcon,
  BuildingLibraryIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";
import { deleteAdmin, getAllinstituteAdmins, getRoleByName } from "src/api";
import { formatDate } from "src/utils/utils";
import Modal from "src/components/utils/DeleteModal";
import { FaUserFriends } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import Pagination from "src/components/adminPagination/adminPagination";
import useAOS from "src/pages/user/aos";

export default function Users({ onCreateUserClick, onUserEditClick }) {
  const [, setAdminRoleId] = useState(null);
  const [institutionAdmins, setInstitutionAdmins] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  const { isError, data, isLoading } = useQuery(
    ["getAllinstituteAdmins"],
    async () => {
      const roleData = await getRoleByName({ name: "alumni" });
      const admin_role_id = roleData.data.id;
      setAdminRoleId(admin_role_id);

      const instituteAdminsData = await getAllinstituteAdmins({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        value: admin_role_id,
      });

      console.log(instituteAdminsData);
      const admins = instituteAdminsData.data.users.map((user) => ({
        ...user,
      }));
      return { roleData, instituteAdminsData, admins };

    },
    { keepPreviousData: true }
  );

  const { mutate: deleteUserModalAction } = useMutation(deleteAdmin, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllinstituteAdmins");
      closeModal();
      toast.success("Admin Deleted successfully!");
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getAllinstituteAdmins");
      console.error("Error deleting user:", error);
      toast.success("Error deleting user!");
    },
  });

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedUser);
    if (selectedUser) {
      const deleteUserData = {
        address_id: selectedUser.address_id,
        birth_place_id: selectedUser.birth_place_id,
        id: selectedUser.id,
      };
      deleteUserModalAction(deleteUserData);
    }
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(
    currentPage * itemsPerPage,
    data?.instituteAdminsData.data.total_items
  );
  const totalPages = Math.ceil(
    data?.instituteAdminsData.data.total_items / itemsPerPage
  );

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  useAOS({
    duration: 1200,
    once: false,
  });
  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <div className="flex flex-col">
        <IconHeaderWithButton
          title="Users"
          Icon={FaUserFriends}
          buttonText="Add User"
          ButtonIcon={FaUserFriends}
          onButtonClick={onCreateUserClick}
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
                        Gender
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Institute Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Registered Date
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
                    {data?.admins.map((user) => (
                      <tr key={user.email}>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm font-medium text-gray-900 text-start">
                            {user.first_name} {user.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {user.email ? user.email : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {user.phone_number ? user.phone_number : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {user.gender}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {user.institute_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                          <a
                            href="#"
                            className="text-gray-600 hover:text-green-900"
                            onClick={() => onUserEditClick(user)}
                          >
                            <CiEdit className="text-2xl" />
                          </a>
                          <a
                            href="#"
                            className="text-gray-600 hover:text-red-900 pl-5"
                            onClick={() => openModal(user)}
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
            dataLength={institutionAdmins.length}
          />
        </div>
        {selectedUser && (
          <Modal
            isOpen={isModalOpen}
            closeModal={closeModal}
            confirmAction={confirmDeletion}
            title="Confirm Deletion"
            message={`Are you sure you want to delete alumni user "${selectedUser.first_name} ${selectedUser.last_name}"? This action cannot be undone.`}
          />
        )}
      </div>
    </QueryResult>
  );
}
