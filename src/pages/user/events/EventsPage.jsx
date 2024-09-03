// @ts-ignore
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteEvent, getAllEvents } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { CiLocationOn } from "react-icons/ci";
import {
  TbArrowZigZag,
  TbSortAscending,
  TbSortDescending,
} from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { MdDriveFileRenameOutline, MdLockReset } from "react-icons/md";

export default function EventsPage({ onEventsDetailClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { isError, data, isLoading } = useQuery(
    ["getAllEvents", currentPage],
    async () => {
      return await getAllEvents({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      });
    },
    { keepPreviousData: true }
  );

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div>
        <ListEvent
          eventsData={data?.data?.events}
          onEventsDetailClick={(event) => onEventsDetailClick(event)}
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
  onEventsDetailClick,
  totalItems,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) {
  // @ts-ignore
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

  // @ts-ignore
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

  // @ts-ignore
  const confirmDeletion = () => {
    if (selectedEvent) {
      deleteEventModalAction(selectedEvent.id);
    }
  };
  const [filteredItems, setFilteredItems] = useState(eventsData);
  console.log(filteredItems);

  const [isAscending, setIsAscending] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const uniqueInstitutes = [
    // @ts-ignore
    ...new Set(eventsData.map((item) => item.instituteName)),
  ];

  const filterByInstitute = (institute) => {
    console.log(institute);

    setFilteredItems(
      eventsData.filter((item) => item.instituteName == institute)
    );

    setIsDropdownOpen(false);
  };

  const sortByDate = () => {
    const sortedItems = [...filteredItems].sort((a, b) =>
      isAscending
        ? // @ts-ignore
          new Date(a.createdAt) - new Date(b.createdAt)
        : // @ts-ignore
          new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredItems(sortedItems);
    setIsAscending(!isAscending);
    setIsDropdownOpen(false);
  };

  const resetFilters = () => {
    setFilteredItems(eventsData);
    setIsAscending(true);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col bg-gray-20 rounded-lg w-full">
      <div className="sticky top-0 sm:flex sm:items-center flex flex-row z-50 bg-gray-100">
        <div className="sm:flex-auto flex flex-row justify-between items-center ">
          <h1 className="text-2xl font-semibold text-gray-900 mx-auto">
            Upcoming Events
          </h1>
          <div className="relative bg-white">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 bg-gray-50 border-black text-black rounded flex flex-row gap-2 items-center text-lg"
            >
              <FiFilter /> Filter
            </button>
          </div>
        </div>
      </div>
      <div>
        {isDropdownOpen && (
          <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-gray-300  ring-1 ring-black ring-opacity-5 right-0 top-[200px] sm:top-[150px] z-50 m-2">
            <div className="w-8 h-8  bg-gray-300 items-center justify-center m-auto rotate-45 -translate-y-3"></div>
            <div className="py-2">
              {uniqueInstitutes.map((val, idx) => (
                <button
                  onClick={() => filterByInstitute(val)}
                  className=" px-4 py-2 text-gray-700 bg-inherit text-start hover:bg-gray-100 hover:text-black cursor-pointer flex flex-row gap-2 text-sm"
                  key={idx}
                >
                  <MdDriveFileRenameOutline className="text-4xl text-start flex gap-2" />{" "}
                  {val}
                </button>
              ))}

              <div
                onClick={sortByDate}
                className=" px-4 py-2 text-gray-700 hover:bg-gray-100  hover:text-black cursor-pointer flex flex-row items-center gap-2"
              >
                {isAscending ? <TbSortDescending /> : <TbSortAscending />} Date
              </div>
              <div
                onClick={resetFilters}
                className=" px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer flex flex-row gap-2"
              >
                <MdLockReset /> Reset
              </div>
            </div>
          </div>
        )}
        {/* <ul className="mt-4">
          {filteredItems.map((item, index) => (
            <li key={index} className="mb-2 p-2 border border-gray-300 rounded">
              {item.createdAt} - {item.instituteName}
            </li>
          ))}
        </ul> */}
      </div>
      <div className=" mt-6 container w-full z-10">
        <div className="flex flex-wrap items-center overflow-y-scroll scroll-auto">
          {filteredItems.map((val, idx) => (
            <div
              className="relative w-full sm:w-[80%] md:w-1/3 lg:w-1/3 xl:w-[22%] bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 mx-3 md:mx-4 my-4"
              key={idx}
            >
              <div className="h-[520px]">
                <div
                  className="bg-cover bg-center"
                  style={{ backgroundImage: `url(${val.image})` }}
                ></div>
                <div className="p-4">
                  <h2 className="text-md text-start font-bold mb-3 line-clamp-2">
                    {val.title}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-2 space-x-2">
                    <div className="flex flex-row gap-2 items-center">
                      <SlCalender />
                      <span className="line-clamp-1">{val.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2 space-x-2 ">
                    <div className="flex flex-row gap-2 items-center line-clamp-1">
                      <CiLocationOn />
                      <span>{val.venue}</span>
                    </div>
                  </div>
                  <div className="flex text-gray-600 space-x-2 line-clamp-2">
                    <div className="flex flex-row gap-2 ">
                      <TbArrowZigZag />
                      <span className="text-start">{val.instituteName}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute flex bottom-0 items-center p-4">
                <a
                  href={val.link}
                  className="relative inline-flex items-center justify-center px-3 py-2 text-lg font-medium tracking-tighter text-white bg-gray-800 rounded-md group"
                >
                  <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-gray-600 rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                  <span className="absolute inset-0 w-full h-full bg-white rounded-md"></span>
                  <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-purple-600 rounded-md opacity-0 group-hover:opacity-100"></span>
                  <span
                    className="relative text-black transition-colors duration-200 ease-in-out delay-100 group-hover:text-gray-300"
                    onClick={() => onEventsDetailClick(val)}
                  >
                    Learn More
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between z-10">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{indexOfFirstItem}</span> to{" "}
          <span className="font-medium">{indexOfLastItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border-0 border-gray-300 ${
              currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <IoIosArrowBack className="text-xl" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePagination(pageNumber)}
                className={`relative inline-flex items-center px-2 py-2 text-sm font-semibold border ${
                  currentPage === pageNumber
                    ? "bg-gray-200 text-black "
                    : "text-black bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}
          <button
            onClick={() => handlePagination(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 bg-white border-0 border-gray-300 ${
              currentPage === totalPages
                ? "cursor-not-allowed"
                : "hover:bg-gray-50"
            }`}
          >
            <IoIosArrowForward className="text-xl" />
          </button>
        </nav>
      </div>
    </div>
  );
}
