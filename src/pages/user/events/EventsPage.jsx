// @ts-ignore
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteEvent, filterEvents, getImageBaseUrl } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import { CiLocationOn } from "react-icons/ci";
import {
  TbArrowZigZag,
  TbSortAscending,
  TbSortDescending,
} from "react-icons/tb";

import { SlCalender } from "react-icons/sl";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdArrowDropdown,
} from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { MdDriveFileRenameOutline, MdLockReset } from "react-icons/md";
import imagess from "../../../assets/images/testimonial/2.jpg";
import useAOS from "../aos";
import { formatInputDate } from "src/utils/utils";
import Pagination from "src/components/pagination/paginationUpdated";
import { FaFilter } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
export default function EventsPage({ onEventsDetailClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("all");
  const [pendingFilterType, setPendingFilterType] = useState("all");
  const [pendingFilterValue, setPendingFilterValue] = useState("all");
  const itemsPerPage = 8;
  const queryClient = useQueryClient();

  const { isError, data, isLoading, refetch } = useQuery(
    ["filterEvents", currentPage, filterType, filterValue],
    async () => {
      const result = await filterEvents({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        keyword: pendingFilterType,
        value: pendingFilterValue,
      });
      return result;
    },
    { keepPreviousData: true }
  );

  const applyFilters = () => {
    console.log(pendingFilterType);
    console.log(pendingFilterValue);
    setFilterType(pendingFilterType);
    setFilterValue(pendingFilterValue);
    refetch();
  };

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
          setPendingFilterType={setPendingFilterType}
          setPendingFilterValue={setPendingFilterValue}
          applyFilters={applyFilters}
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
  setPendingFilterType,
  setPendingFilterValue,
  applyFilters,
}) {
  console.log(eventsData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    type: null,
    value: null,
  });

  const handleFilterChange = (type, value) => {
    setSelectedFilter({ type, value });
    setPendingFilterType(type);
    setPendingFilterValue(value);
  };

  const handleApplyFilters = () => {
    applyFilters();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClearFilters = () => {
    setSelectedFilter({ type: null, value: null });
    setPendingFilterType(null);
    setPendingFilterValue(null);
    setIsDropdownOpen((prev) => !prev);
  };
  useAOS({ duration: 1200, once: true });

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="pt-0 sm:flex sm:items-center justify-end flex flex-end z-100 w-full ">
        <div className="flex flex-row gap-1 items-center ">
          <div className="grid gap-2">
            <input
              id="institute-filter"
              type="text"
              placeholder="Search institute events..."
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
              value={
                selectedFilter.type === "institute" ? selectedFilter.value : ""
              }
              onFocus={() => setIsDropdownOpen(true)}
              // onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              onChange={(e) => handleFilterChange("institute", e.target.value)}
            />
          </div>
          <div className="sm:flex-auto flex flex-row items-center">
            <div className="relative bg-white">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 bg-gray-50 text-gray-700  hover:bg-gray-950 hover:text-white border-black rounded flex flex-row gap-2 items-center text-lg"
              >
                <FaFilter />
              </button>
            </div>
          </div>
        </div>

        <div
          className="absolute right-2 top-40  md:right-8 lg:top-28  xl:top-26 z-50"
          // onClick={() => setIsDropdownOpen(true)}
        >
          {isDropdownOpen && (
            <div className="  bg-white shadow-lg p-6 rounded-md z-50 w-80">
              <div className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-900">
                    Order By
                  </label>
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="desc"
                        name="created"
                        className="mr-2"
                        checked={
                          selectedFilter.type === "created" &&
                          selectedFilter.value === "desc"
                        }
                        onChange={() => handleFilterChange("created", "desc")}
                      />
                      Created Date (Descending)
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="asc"
                        name="created"
                        className="mr-2"
                        checked={
                          selectedFilter.type === "created" &&
                          selectedFilter.value === "asc"
                        }
                        onChange={() => handleFilterChange("created", "asc")}
                      />
                      Created Date (Ascending)
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-900">
                    Order By
                  </label>
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="desc"
                        name="deadline"
                        className="mr-2"
                        checked={
                          selectedFilter.type === "deadline" &&
                          selectedFilter.value === "desc"
                        }
                        onChange={() => handleFilterChange("deadline", "desc")}
                      />
                      Deadline Date (Descending)
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="asc"
                        name="deadline"
                        className="mr-2"
                        checked={
                          selectedFilter.type === "deadline" &&
                          selectedFilter.value === "asc"
                        }
                        onChange={() => handleFilterChange("deadline", "asc")}
                      />
                      Deadline Date (Ascending)
                    </div>
                  </div>
                </div>

                {/* <div className="grid gap-2">
                  <label
                    htmlFor="institute-filter"
                    className="text-sm font-medium text-gray-900"
                  >
                    Institute
                  </label>
                  <input
                    id="institute-filter"
                    type="text"
                    placeholder="Search institute events..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                    value={
                      selectedFilter.type === "institute"
                        ? selectedFilter.value
                        : ""
                    }
                    onChange={(e) =>
                      handleFilterChange("institute", e.target.value)
                    }
                  />
                </div> */}

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 text-gray-400 border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                  <button
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className="flex flex-col justify-between rounded-lg  min-h-screen pb-5 "
        onClick={() => setIsDropdownOpen(false)}
      >
        <div className=" mt- z-10  w-full h-[]" data-aos="fade-down">
          <div className="flex flex-wrap   justify- items-center justify- gap-4 overflow-y-scroll no-scrollbar m-auto content-start p-4">
            {eventsData?.map((val, idx) => (
              <div
                className="relative w-full sm:w-[400px] bg-neutral-50 overflow-visible  rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-[700ms] hover:scale-105 hover:rotate hover:bg-neutral-100 gap-2"
                key={idx}
                // ref={dropdownRef}
              >
                <div className=" ">
                  {/* <div
                    className="bg-cover bg-center p-2"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600)`,
                    }}
                    // style={{
                    //   backgroundImage: `url(${getImageBaseUrl(val.image)})`,
                    // }}
                  ></div> */}
                  <div className="w-full h-full px-4 pt-4 mb-2">
                    <img
                      // src={`${getImageBaseUrl(val.image)}`}
                      src={imagess}
                      className="h-[220px] w-full object-cover rounded-lg mb-2 "
                      // className="h-[200px] w-full bg-cover"
                    />
                  </div>
                  <div className="px-4 mb-2 h-14">
                    <h4 className="text-xl font-semibold text-black text-start line-clamp-2 font-serif">
                      {val.title}
                    </h4>
                  </div>
                  <div className="px-4 ">
                    <div className="flex items-center text-gray-600 mb-2 space-x-2 ">
                      <div className="flex flex-row gap-3 md:gap-2  ">
                        <SlCalender className="text-2xl text-gray-900" />
                        <span className=" text-start text-gray-700 text-lg line-clamp-2 font-serif">
                          {formatInputDate(val.time)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2 space-x-2 ">
                      <div className="flex flex-row gap-3 md:items-center line-clamp-1">
                        <CiLocationOn className="text-2xl text-gray-900" />
                        <span className="line-clamp-2 text-start text-gray-700 text-lg font-serif ">
                          {val.venue}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-gray-600 space-x-2 line-clamp-2">
                      <div className="flex flex-row gap-3 ">
                        <TbArrowZigZag className="text-2xl text-gray-900" />
                        <span className="line-clamp-2 text-start text-gray-700 text-lg font-serif">
                          {val.instituteName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative pt-1 ">
                  <div className=" flex bottom-0 items-center px-4 py-3">
                    <a
                      href={val.link}
                      className="relative inline-flex items-center justify-center px-3 py-1 text-lg font-medium tracking-tighter text-white bg-gray-800 rounded-md group"
                    >
                      <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-gray-400 rounded-md group-hover:mt-0 group-hover:ml-0"></span>
                      <span className="absolute inset-0 w-full h-full bg-gray-800 rounded-md"></span>
                      <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-in-out delay-100 bg-purple-600 rounded-md opacity-0 group-hover:opacity-100"></span>
                      <span
                        className="relative text-gray-200 transition-colors duration-200 ease-in-out delay-100 group-hover:text-gray-300 font-mono px-4 animate-pulse"
                        onClick={() => onEventsDetailClick(val)}
                      >
                        Details
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          totalItems={eventsData?.data?.total_items}
          paginate={paginate}
        />
      </div>{" "}
    </>
  );
}
