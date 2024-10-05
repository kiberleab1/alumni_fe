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
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { BiSolidInstitution } from "react-icons/bi";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import Pagination from "src/components/adminPagination/adminPagination";

export default function InstitutionsPage({
  onCreateInstituteClick,
  onInstituteEditClick,
}) {
  const { isError, data, isLoading } = useQuery("getInstitutions", async () => {
    return await getInstitutes({ pageNumber: 1, pageSize: 20 });
  });

  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <div>
        <ListInstitutions
          institutes={data?.data?.institute}
          onCreateInstituteClick={onCreateInstituteClick}
          onInstituteEditClick={(institute) => onInstituteEditClick(institute)}
        />
      </div>
      <div>{/* <StatData /> */}</div>
    </QueryResult>
  );
}

// eslint-disable-next-line react/prop-types
function ListInstitutions({
  institutes,
  onCreateInstituteClick,
  onInstituteEditClick,
}) {
  const itemsPerPage = 5; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const queryClient = useQueryClient();
  // Calculate pagination boundaries
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = institutes.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total number of pages
  const totalPages = Math.ceil(institutes.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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

  console.log(currentItems);

  currentItems = parseContactInfo(currentItems);
  console.log(currentItems);
  return (
    <div className="flex flex-col">
      <IconHeaderWithButton
        title="Institutions"
        Icon={BiSolidInstitution}
        buttonText="Add Institutions"
        ButtonIcon={BiSolidInstitution}
        onButtonClick={onCreateInstituteClick}
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
                <tbody
                  className="bg-white divide-y divide-gray-200"
                  data-aos="fade-down"
                >
                  {currentItems.map((institute) => (
                    <tr key={institute.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-serif text-gray-900 text-start">
                          {institute.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {institute.email ? institute.email : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {institute.phone_number
                            ? institute.phone_number
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {truncateDescription(institute.president_name)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {institute.number_of_students
                            ? institute.number_of_students
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {institute.number_of_alumni
                            ? institute.number_of_alumni
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {institute.type ? institute.type : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {formatDate(institute.starting_year)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                        <a
                          href="#"
                          className="text-gray-600 hover:text-green-900"
                          onClick={() => onInstituteEditClick(institute)}
                        >
                          <CiEdit className="text-2xl" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-red-900 pl-5"
                          onClick={() => openModal(institute)}
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
          dataLength={institutes.length}
        />
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
