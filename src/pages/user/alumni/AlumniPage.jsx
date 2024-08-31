import React, { useState } from "react";
import { useQuery } from "react-query";
import useAOS from "../aos";
import { getAllAlumni } from "src/api";
import defaultImg from "../../../assets/images/testimonial/2.jpg";
import QueryResult from "src/components/utils/queryResults";
import AlumniModal from "./AlumniModal";

const AlumniGrid = () => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const { isError, data, isLoading } = useQuery(
    ["getAllAlumni", currentPage],
    () => getAllAlumni({ pageNumber: currentPage, pageSize: itemsPerPage }),
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


  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>

      <div className="container mx-auto py-12">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error loading alumni.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {alumni.map((alum) => (
                <div className="bg-white shadow-md rounded-lg p-6 text-center" key={alum.id}>
                  <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 mb-4">
                    <img
                      src={alum.user_photo || defaultImg}
                      alt={alum.user_id}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{alum?.user_data?.name ? alum?.user_data?.name : "Unknown Name"}</h3>
                  <p className="text-gray-500">Class of {new Date(alum.graduation_year).getFullYear()}</p>
                  <p className="mt-2 text-gray-700">{alum.degree}</p>
                  <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg w-full" onClick={() => openModal(alum)}>
                    View Profile
                  </button>
                </div>
              ))}
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
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 ${currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"}`}
                  >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border ${currentPage === pageNumber
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "text-gray-900 bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 ${currentPage === totalPages ? "cursor-not-allowed" : "hover:bg-gray-50"}`}
                  >
                  Next
                </button>
              </nav>
            </div>
          </>
        )}
        {selectedAlumni && (
          <AlumniModal
            isOpen={isModalOpen}
            onClose={closeModal}
            profile={selectedAlumni}
            />
        )}
      </div>
    </QueryResult>

  );
};

export default AlumniGrid;
