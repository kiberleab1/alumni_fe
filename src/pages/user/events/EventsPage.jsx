import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteEvent, getAllEvents } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { CiLocationOn } from "react-icons/ci";
import { TbArrowZigZag } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";

export default function EventsPage({ onCreateEventClick, onEditEventClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { isError, data, isLoading } = useQuery(
    ["getAllEvents", currentPage],
    async () => {
      return await getAllEvents({ pageNumber: currentPage, pageSize: itemsPerPage });
    },
    { keepPreviousData: true }
  );

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div>
        <ListEvent
          eventsData={data?.data?.events}
          onCreateEventClick={onCreateEventClick}
          onEditEventClick={onEditEventClick}
          totalItems={data?.data?.total_items}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </QueryResult>
  );
}

function ListEvent({
  eventsData,
  onCreateEventClick,
  onEditEventClick,
  totalItems,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const queryClient = useQueryClient();

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePagination = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const { mutate: deleteEventModalAction } = useMutation(deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllEvents");
      closeModal();
      toast.success("Event deleted successfully!");
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getAllEvents");
      console.error("Error deleting event:", error);
      toast.error("Error deleting event!");
    },
  });

  const confirmDeletion = () => {
    if (selectedEvent) {
      deleteEventModalAction(selectedEvent.id);
    }
  };

  return (
    <div className="flex flex-col bg-gray-20 rounded-lg w-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Upcoming Events</h1>
        </div>
      </div>
      <div className="mt-6 container w-full">
        <div className="flex flex-wrap justify-center h-full overflow-y-scroll">
          {eventsData.map((val, idx) => (
            <div
              className="w-full sm:w-[80%] md:w-1/3 lg:w-1/3 xl:w-[22%] bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 mx-3 md:mx-4 my-4"
              key={idx}
            >
              <div
                className="bg-cover bg-center"
                style={{ backgroundImage: `url(${val.image})` }}
              ></div>
              <div className="p-4">
                <h2 className="text-xl text-start font-bold mb-3">{val.title}</h2>
                <div className="flex items-center text-gray-600 mb-2 space-x-2">
                  <SlCalender />
                  <span>{val.time}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2 space-x-2">
                  <CiLocationOn />
                  <span>{val.venue}</span>
                </div>
                <div className="flex items-center text-gray-600 space-x-2">
                  <TbArrowZigZag />
                  <span>{val.instituteName}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2 mt-4">
                  <a
                    href="#_"
                    className="relative inline-flex items-center justify-center px-3 py-2 text-lg font-medium tracking-tighter text-white bg-gray-800 rounded-md group"
                  >
                    <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-gray-600 rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                    <span className="absolute inset-0 w-full h-full bg-white rounded-md"></span>
                    <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-purple-600 rounded-md opacity-0 group-hover:opacity-100"></span>
                    <span className="relative text-yellow-600 transition-colors duration-200 ease-in-out delay-100 group-hover:text-black">
                      Learn More
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{indexOfFirstItem}</span> to{" "}
          <span className="font-medium">{indexOfLastItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 ${
              currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePagination(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border ${
                  currentPage === pageNumber
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "text-gray-900 bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}
          <button
            onClick={() => handlePagination(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 ${
              currentPage === totalPages ? "cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
