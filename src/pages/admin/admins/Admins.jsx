import { useState } from "react";
import {
  deleteAdmin,
  getAllinstituteAdmins as getAllInstituteAdmins,
  getRoleByName,
} from "src/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { formatDate } from "../../../utils/utils";
import {
  AdjustmentsHorizontalIcon,
  BuildingLibraryIcon,
  UserIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/utils/DeleteModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiAdminLine, RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import Pagination from "src/components/adminPagination/adminPagination";
import useAOS from "src/pages/user/aos";

export default function AdminsPage({ onAddAdminClick, onAdminEditClick }) {
  const [, setAdminRoleId] = useState(null);
  const [institutionAdmins, setInstitutionAdmins] = useState([]);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const queryClient = useQueryClient();

  const { isError, data, isLoading } = useQuery(
    ["getRoleByName", "getAllinstituteAdmins"],
    async () => {
      const roleData = await getRoleByName({ name: "admin" });
      const admin_role_id = roleData.data?.id;
      setAdminRoleId(admin_role_id);

      const instituteAdminsData = await getAllInstituteAdmins({
        pageNumber: 1,
        pageSize: 10,
        value: admin_role_id,
      });
      const admins = instituteAdminsData.data.users.map((user) => ({
        ...user,
      }));
      setInstitutionAdmins(admins);
      return { roleData, instituteAdminsData, admins };
    },
    { keepPreviousData: true }
  );
  //   const mutation = useMutation(deleteAdmin, {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries("getAllinstituteAdmins");
  //     },
  //   });

  const { mutate: deleteAdminModalAction } = useMutation(deleteAdmin, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllinstituteAdmins");
      closeModal();
      toast.success("Admin Deleted successfully!");
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getAllinstituteAdmins");
      console.error("Error deleting admin:", error);
      toast.success("Error deleting admin!");
    },
  });

  const openModal = (admin) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAdmin(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    if (selectedAdmin) {
      const deleteAdminData = {
        address_id: selectedAdmin.address_id,
        birth_place_id: selectedAdmin.birth_place_id,
        id: selectedAdmin.id,
      };
      deleteAdminModalAction(deleteAdminData);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = institutionAdmins.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(institutionAdmins.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  console.log("What the fuck is going on here", data);
  useAOS({
    duration: 1200,
    once: false,
  });
  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col bg-white">
        <IconHeaderWithButton
          title="Administrators"
          Icon={RiAdminLine}
          buttonText="Add Administrators"
          ButtonIcon={RiAdminLine}
          onButtonClick={onAddAdminClick}
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
                        Institute Name
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
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="bg-white divide-y divide-gray-200"
                    data-aos="fade-down"
                  >
                    {currentItems.map((admin) => (
                      <tr key={admin.email}>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm font-serif text-gray-900 text-start">
                            {admin.first_name} {admin.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {admin.email ? admin.email : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {admin.phone_number ? admin.phone_number : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {admin.institute_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {formatDate(admin.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-green-900"
                            onClick={() => onAdminEditClick(admin)}
                          >
                            <CiEdit />
                          </a>
                          <a
                            href="#"
                            className="text-red-600 hover:text-red-900 pl-5"
                            onClick={() => openModal(admin)}
                          >
                            <RiDeleteBin5Line />
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
        {selectedAdmin && (
          <Modal
            isOpen={isModalOpen}
            closeModal={closeModal}
            confirmAction={confirmDeletion}
            title="Confirm Deletion"
            message={`Are you sure you want to delete the institute "${selectedAdmin.first_name} ${selectedAdmin.last_name}"? This action cannot be undone.`}
          />
        )}
        {/* <StatData /> */}
      </div>
    </QueryResult>
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
          <UserIcon className="h-12 w-12 flex-none rounded-lg bg-white text-green-900 object-cover ring-1 ring-gray-100/10" />
          <div className="text-sm font-medium leading-6 text-gray-900">
            Recently Active Admins
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
          <BuildingLibraryIcon className="h-12 w-12 flex-none rounded-lg bg-white text-blue-900 object-cover ring-1 ring-gray-100/10" />
          <div className="text-sm font-medium leading-6 text-gray-900">
            Most Number of Institutions with admin
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
      <li key="4" className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <AdjustmentsHorizontalIcon className="h-12 w-12 flex-none rounded-lg bg-white text-pink-900 object-cover ring-1 ring-gray-100/10" />
          <div className="text-sm font-medium leading-6 text-gray-900">
            Recently Added Admins
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
