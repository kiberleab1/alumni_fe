import { useQuery, useQueryClient, useMutation } from "react-query";
import { getAllAlumni, deleteDepartment } from "src/api";
import { useState, useEffect } from "react";
import { formatDate, parseContactInfo } from "../../../utils/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/utils/DeleteModal";
import QueryResult from "src/components/utils/queryResults";
import CreateAlumni from "./CreateAlumni";
import { IoPersonAddSharp } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import useAOS from "../aos";
import "./style.css";
// @ts-ignore
import img from "../../../assets/images/team/t1.jpg";
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
  //scroll anim
  useAOS({
    duration: 1200,
    once: true,
  });
  const data = [
    {
      id: 1,
      image:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/pr-sample15.jpg",
      name: "John Doe",
      department: "Computer Science",
      graduationYear: 2023,
      link: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      image: img,
      name: "John Doe2",
      department: "Electrical Engineering",
      graduationYear: 2022,
      link: "https://via.placeholder.com/50",
    },
  ];
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
    <div className="flex flex-col min-h-screen">
      <div className="sm:flex sm:items-center mb-4" data-aos="fade-down">
        <div className="sm:flex-auto">
          <h1 className="leading-6 text-3xl text-black font-sans">Alumni</h1>
          <p className="mt-2 text-lg text-gray-500 font-sans-serif">
            A list of your all the alumnus in the system including their name,
            description, start date.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {/* <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          ></button> */}
          <a
            href="#_"
            className="relative inline-block text-lg group "
            onClick={onCreateAlumniClick}
          >
            <span className="relative z-10 block px-4 py-2 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
              <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
              <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
              <span className="relative flex ">
                <IoPersonAddSharp className="mr-2 text-xl" /> Alumni
              </span>
            </span>
            <span
              className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
              data-rounded="rounded-lg"
            ></span>
          </a>
        </div>
      </div>

      {/* <div
        className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg "
        data-aos="fade-up"
      >
        <div className="">
          <div className="overflow-x-auto ">
           
            <div className="table-container" style={{ maxHeight: "500px" }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-gray-200 z-10">
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
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((alumni) => (
                    <tr key={alumni.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900">
                          {alumni.user_id ? alumni.user_id : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {alumni.institution_id ? alumni.institution_id : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {alumni.department_id ? alumni.department_id : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {alumni.graduation_year
                            ? formatDate(alumni.graduation_year)
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {alumni.status ? alumni.status : ""}
                        </div>
                      </td>
                      <td className="flex px-6 py-4 whitespace-nowrap text-start text-sm font-medium">
                        <a
                          href="#"
                          className="  text-indigo-600 text-xl hover:text-indigo-900"
                          onClick={() => onEditAlumniClick(alumni)}
                        >
                          <GrEdit />
                        </a>
                        <a
                          href="#"
                          className="text-red-600 text-xl hover:text-red-900 pl-5"
                          onClick={() => openModal(alumni)}
                        >
                          <RiDeleteBin6Fill />
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
                  {Math.min(indexOfLastItem, alumnus.length)}
                </span>{" "}
                of <span className="font-medium">{alumnus.length}</span> results
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
                        ? "z-10 bg-white text-black t"
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
      </div> */}
      <div className="container mx-auto px-5 py-2 sm:px-10 md:px-20 lg:px-32 lg:pt-12  min-h-screen">
        <div className="-m-1 flex flex-wrap md:-m-2 justify-center">
          {data.map((val, idx) => {
            return (
              <figure className="snip1369 green">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/pr-sample15.jpg"
                  alt="pr-sample15"
                />
                <div className="image">
                  <img
                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/pr-sample15.jpg"
                    alt="pr-sample15"
                  />
                </div>
                <figcaption>
                  <h3 className="text-yellow-400">{val.name}</h3>
                  <span>Graduation Year</span> -{" "}
                  <span>{val.graduationYear} </span>
                  <p>
                    {val.department}
                    {/* I suppose if we couldn't laugh at things that don't make
                    sense, we couldn't react to a lot of life. */}
                  </p>
                </figcaption>

                <span className="read-more">
                  Read More <i className="ion-android-arrow-forward"></i>
                </span>
                <a href="#"></a>
              </figure>
            );
          })}
        </div>
      </div>
      {/* <div className="container mx-auto p-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-center">Image</th>
              <th className="p-4 text-center">User</th>
              <th className="p-4 text-center">Department</th>
              <th className="p-4 text-center">Graduation Year</th>
              <th className="p-4 text-center">Link</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                </td>
                <td className="p-4 text-center">{item.name}</td>
                <td className="p-4 text-center">{item.department}</td>
                <td className="p-4 text-center">{item.graduationYear}</td>
                <td className="p-4 text-center">{item.link}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
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
