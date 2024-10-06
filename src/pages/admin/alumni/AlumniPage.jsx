import { useQuery, useQueryClient, useMutation } from "react-query";
import { getAllAlumni, deleteDepartment } from "src/api";
import { useState } from "react";
import { formatDate, parseContactInfo } from "../../../utils/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/utils/DeleteModal";
import QueryResult from "src/components/utils/queryResults";
import { BiSolidInstitution } from "react-icons/bi";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import Pagination from "src/components/adminPagination/adminPagination";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function AlumniPage({ onCreateAlumniClick, onEditAlumniClick }) {
  const { isError, data, isLoading } = useQuery("getAllAlumni", async () => {
    return await getAllAlumni({ pageNumber: 1, pageSize: 10 });
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div>
        <ListDepartment
          alumnus={data?.data?.alumniProfile}
          onCreateAlumniClick={onCreateAlumniClick}
          onEditAlumniClick={(alumni) => onEditAlumniClick(alumni)}
        />
      </div>
    </QueryResult>
  );
}

// eslint-disable-next-line react/prop-types
function ListDepartment({ alumnus, onCreateAlumniClick, onEditAlumniClick }) {
  const itemsPerPage = 5; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const queryClient = useQueryClient();

  // Mutation for deleting a alumni
  const { mutate: deleteDept } = useMutation(deleteDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllAlumni");
      closeModal();
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getAllAlumni");
      console.error("Error deleting alumni:", error);
    },
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = alumnus.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(alumnus.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openModal = (alumni) => {
    setSelectedDepartment(alumni);
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
        title="Alumni"
        Icon={BiSolidInstitution}
        buttonText="Add Alumni"
        ButtonIcon={BiSolidInstitution}
        onButtonClick={onCreateAlumniClick}
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
                      User
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
                      Department
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Graduation Year
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
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="bg-white divide-y divide-gray-200"
                  data-aos="fade-down"
                >
                  {currentItems.map((alumni) => (
                    <tr key={alumni.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900">
                          {alumni.user_id ? alumni.user_id : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {alumni.institution_id ? alumni.institution_id : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {alumni.department_id ? alumni.department_id : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {alumni.graduation_year
                            ? formatDate(alumni.graduation_year)
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {alumni.status ? alumni.status : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                        <a
                          href="#"
                          className="text-gray-600 hover:text-green-900"
                          onClick={() => onEditAlumniClick(alumni)}
                        >
                          <CiEdit className="text-2xl" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-red-900 pl-5"
                          onClick={() => openModal(alumni)}
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
          dataLength={alumnus.length}
        />
      </div>
      {selectedDepartment && (
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          confirmAction={confirmDeletion}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the alumni "${selectedDepartment.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
