import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";
import { deleteStaff, getAllStaff } from "src/api";
import { formatDate } from "src/utils/utils";
import Modal from "src/components/utils/DeleteModal";
import { FaPeopleCarry } from "react-icons/fa";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import Pagination from "src/components/adminPagination/adminPagination";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function StaffPage({ onCreateStaffClick, onEditStaffClick }) {
  const [staffs, setStaffs] = useState([]);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const queryClient = useQueryClient();

  const { isError, data, isLoading } = useQuery(
    ["getAllStaff"],
    async () => {
      const staffData = await getAllStaff({ pageNumber: 1, pageSize: 10 });
      setStaffs(staffData.data.staff);
      return staffData;
    },
    { keepPreviousData: true }
  );

  //   const mutation = useMutation(deleteStaff, {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries("getAllStaff");
  //     },
  //   });

  const { mutate: deleteStaffModalAction } = useMutation(deleteStaff, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllStaff");
      closeModal();
      toast.success("Job Deleted successfully!");
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getAllStaff");
      console.error("Error deleting job:", error);
      toast.success("Error deleting job!");
    },
  });

  const openModal = (job) => {
    setSelectedStaff(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStaff(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedStaff);
    if (selectedStaff) {
      const staffDeleteData = {
        id: selectedStaff.id,
        address_id: selectedStaff.address_id,
      };
      deleteStaffModalAction(staffDeleteData);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = staffs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(staffs.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <div className="flex flex-col">
        <IconHeaderWithButton
          title="Staffs"
          Icon={FaPeopleCarry}
          buttonText="Add Staffs"
          ButtonIcon={FaPeopleCarry}
          onButtonClick={onCreateStaffClick}
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
                        Full Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Title
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
                        Department
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Institute
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
                    {currentItems.map((staff) => (
                      <tr key={staff.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm font-medium text-gray-900 text-start">
                            {staff.full_name ? staff.full_name : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {staff.title ? staff.title : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {staff.email ? staff.email : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {staff.phone_number ? staff.phone_number : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {staff.department_id ? staff.department_id : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {staff.institute_id ? staff.institute_id : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {formatDate(staff.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                          <a
                            href="#"
                            className="text-gray-600 hover:text-green-900"
                            onClick={() => onEditStaffClick(staff)}
                          >
                            <CiEdit className="text-2xl" />
                          </a>
                          <a
                            href="#"
                            className="text-gray-600 hover:text-red-900 pl-5"
                            onClick={() => openModal(staff)}
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
            dataLength={staffs.length}
          />
        </div>
        {selectedStaff && (
          <Modal
            isOpen={isModalOpen}
            closeModal={closeModal}
            confirmAction={confirmDeletion}
            title="Confirm Deletion"
            message={`Are you sure you want to delete the staff "${selectedStaff.full_name}"? This action cannot be undone.`}
          />
        )}
      </div>
    </QueryResult>
  );
}
