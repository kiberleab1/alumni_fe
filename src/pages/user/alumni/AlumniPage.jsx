import { useState } from "react";
import { useQuery } from "react-query";
import useAOS from "../aos";
import { filterAlumniProfile } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import AlumniModal from "./AlumniModal";
import { IoPersonAddSharp } from "react-icons/io5";
import { FcBusinessman, FcBusinesswoman } from "react-icons/fc";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const AlumniGrid = ({ onCreateAlumniClick }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { isError, data, isLoading, refetch } = useQuery(
    ["filterAlumniProfile", currentPage],
    () =>
      filterAlumniProfile({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        filterKeyword: selectedFilter,
        value: selectedFilter != "all" ? searchQuery : "all",
      }),
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  useAOS({
    duration: 1200,
    once: true,
  });

  const alumni = data?.data?.alumniProfile || [];
  const totalItems = data?.data?.total_items || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  const openModal = (alumni) => {
    setSelectedAlumni(alumni);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAlumni(null);
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
    setSearchQuery("");
    console.log(event.target.value);
  };

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <select
            className="bg-white text-black border border-black shadow-lg px-4 py-2 rounded-lg focus:outline-none w-full sm:w-auto"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <option value="all">Filter options</option>
            <option value="user_id">Filter by Name</option>
            <option value="graduation_year">Filter by Graduation Year</option>
            <option value="institution_id">Filter by Institution</option>
            <option value="department_id">Filter by Department</option>
            <option value="gender">Filter by Gender</option>
            <option value="disability">Filter by Disability</option>
          </select>
          <input
            type="text"
            placeholder={`Search alumni by ${selectedFilter.replace(
              "_",
              " "
            )}...`}
            className="w-full p-2 border bg-white text-black border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            className="bg-white text-black border border-black shadow-lg px-4 py-2 rounded-lg focus:outline-none w-full sm:w-auto"
            onClick={() => {
              refetch;
            }}
          >
            Apply Filter
          </button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error loading alumni.</p>
        ) : (
          <div>
            <div className="sm:ml-16 sm:mt-0 sm:flex-none text-end mb-2">
              <a
                href="#_"
                className="relative inline-block text-lg group"
                onClick={onCreateAlumniClick}
              >
                <span className="relative z-10 block px-4 py-2 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                  <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                  <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                  <span className="relative flex">
                    <IoPersonAddSharp className="mr-2 text-xl" /> Alumni
                  </span>
                </span>
                <span
                  className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                  data-rounded="rounded-lg"
                ></span>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {alumni.length > 0 ? (
                alumni.map((alum) => (
                  <div
                    className="bg-white shadow-md rounded-lg p-6 text-center"
                    key={alum.id}
                  >
                    <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 mb-4 z-10 overflow-hidden">
                      {alum.user_photo ? (
                        <FcBusinessman className="rounded-full object-cover w-full h-[130px] z-0" />
                      ) : alum.gender === "male" ? (
                        <FcBusinessman className="rounded-full object-cover w-full h-[130px] z-10" />
                      ) : alum.gender === "female" ? (
                        <FcBusinesswoman className="rounded-full object-cover w-full h-[130px] z-10" />
                      ) : (
                        <FcBusinesswoman className="rounded-full object-cover w-full h-[130px] z-10" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {alum?.user_data?.name
                        ? alum?.user_data?.name
                        : "Unknown Name"}
                    </h3>
                    <p className="text-gray-500">
                      Class of {new Date(alum.graduation_year).getFullYear()}
                    </p>
                    <p className="mt-2 text-gray-700 line-clamp-1">
                      {alum.degree}
                    </p>
                    <button
                      className="mt-4 bg-black text-white px-4 py-2 rounded-lg w-full"
                      onClick={() => openModal(alum)}
                    >
                      View Profile
                    </button>
                  </div>
                ))
              ) : (
                <p>No alumni found.</p>
              )}
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between mt-10">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem}</span> to{" "}
                  <span className="font-medium">{indexOfLastItem}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border-0 border-gray-300 transition-all duration-300 ${
                    currentPage === 1
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <IoIosArrowBack className="text-xl" />
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`relative inline-flex items-center px-2 py-2 text-sm font-semibold border transition-all duration-300 ${
                      currentPage === pageNumber
                        ? "bg-gray-200 text-black"
                        : "text-black bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border-0 border-gray-300 transition-all duration-300 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <IoIosArrowForward className="text-xl" />
                </button>
              </nav>
            </div>
            <div className="flex sm:hidden justify-between items-center mt-10">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-lg ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
              >
                <IoIosArrowBack className="text-xl" />
              </button>
              <p className="text-sm text-gray-700">
                Showing {indexOfFirstItem} to {indexOfLastItem} of {totalItems}{" "}
                results
              </p>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-lg ${
                  currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
              >
                <IoIosArrowForward className="text-xl" />
              </button>
            </div>
          </div>
        )}
        {isModalOpen && selectedAlumni && (
          <AlumniModal
            profile={selectedAlumni}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
      </div>
    </QueryResult>
  );
};

export default AlumniGrid;
