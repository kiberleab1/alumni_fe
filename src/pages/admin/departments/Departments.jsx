import { useQuery, useQueryClient, useMutation } from "react-query";
import { getDepartments, deleteDepartment } from "src/api";
import { useState } from "react";
import { parseContactInfo } from "../../../utils/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/utils/DeleteModal";
import QueryResult from "src/components/utils/queryResults";
import { BiSolidInstitution } from "react-icons/bi";
import { FcDepartment } from "react-icons/fc";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaNetworkWired } from "react-icons/fa";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import Pagination from "src/components/adminPagination/adminPagination";

export default function DepartmentPage({
  onCreateDepartmentClick,
  onDepartmentEditClick,
}) {
  const { isError, data, isLoading } = useQuery("getDepartments", async () => {
    return await getDepartments({ pageNumber: 1, pageSize: 10 });
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
}) {
  const itemsPerPage = 5; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = parseContactInfo(
    departments.slice(indexOfFirstItem, indexOfLastItem)
  );

  const totalPages = Math.ceil(departments.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
      <IconHeaderWithButton
        title="Institutions"
        Icon={FaNetworkWired}
        buttonText="Add Institutions"
        ButtonIcon={FaNetworkWired}
        onButtonClick={onCreateDepartmentClick}
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
                <tbody
                  className="bg-white divide-y divide-gray-200"
                  data-aos="fade-down"
                >
                  {currentItems.map((department) => (
                    <tr key={department.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900">
                          {department.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {department.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {department.phone_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {department.head_of_department || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {department.institute_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                        <a
                          href="#"
                          className="text-gray-600 hover:text-green-900"
                          onClick={() => onDepartmentEditClick(department)}
                        >
                          <CiEdit className="text-2xl" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-red-900 pl-5"
                          onClick={() => openModal(department)}
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
          dataLength={departments.length}
        />
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
