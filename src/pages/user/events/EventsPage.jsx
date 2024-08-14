import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteEvent, getAllEvents } from "src/api";
import Modal from "src/components/utils/DeleteModal";
import NewsCard from "src/components/utils/NewsCard";
import QueryResult from "src/components/utils/queryResults";
import { formatDate } from "src/utils/utils";

import { CiLocationOn } from "react-icons/ci";
import { TbArrowZigZag } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import image1 from "../../../assets/images/testimonial/2.jpg";
import image2 from "../../../assets/images/testimonial/3.jpg";
import { Button } from "reactstrap";
export default function EventsPage({ onCreateEventClick, onEditEventClick }) {
  const { isError, data, isLoading } = useQuery("getAllEvents", async () => {
    return await getAllEvents({ pageNumber: 1, pageSize: 10 });
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div>
        <ListEvent
          eventsData={data?.data?.events}
          onCreateEventClick={onCreateEventClick}
          onEditEventClick={(event) => onEditEventClick(event)}
        />
      </div>
    </QueryResult>
  );
}

function ListEvent({ eventsData, onCreateEventClick, onEditEventClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [VisibilityType] = useState(["All Alumni", "My alumni"]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = eventsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(eventsData.length / itemsPerPage);
  const cardData = [
    {
      image: image1,
      name: "Alex",
      location: "New York City",
      date: "August 11, 2024",
      type: "Conference",
    },
    {
      image: image2,
      name: "John Doe",
      location: "New York City",
      date: "August 11, 2024",
      type: "Conference",
    },
    {
      image: image1,
      name: "John Doe",
      location: "New York City",
      date: "August 11, 2024",
      type: "Conference",
    },
    {
      image: image1,
      name: "Alex",
      location: "New York City",
      date: "August 11, 2024",
      type: "Conference",
    },
    {
      image: image2,
      name: "John Doe",
      location: "New York City",
      date: "August 11, 2024",
      type: "Conference",
    },
    {
      image: image1,
      name: "John Doe",
      location: "New York City",
      date: "August 11, 2024",
      type: "Conference",
    },
  ];

  const paginate = (pageNumber) => {
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

  const confirmDeletion = () => {
    console.log(selectedEvent);
    if (selectedEvent) {
      deleteEventModalAction(selectedEvent.id);
    }
  };

  const queryClient = useQueryClient();
  const { mutate: deleteEventModalAction } = useMutation(deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllEvents");
      closeModal();
      toast.success("Event Deleted successfully!");
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getAllEvents");
      console.error("Error deleting Event:", error);
      toast.success("Error deleting Event!");
    },
  });

  return (
    <div className="flex flex-col  bg-gray-20 rounded-lg min-w-[100%] ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto ">
          <h1 className="text-2xl font-semibold  text-gray-900 font-sans ">
            Events
          </h1>
          {/* <p className="mt-2 text-sm text-gray-700">
            A list of all the evnets in the system.
          </p> */}
        </div>
      </div>
      <div className=" ">
        {/* <div className="min-w-full">
          <div className="overflow-x-auto">
            <div className="table-container">
              <div className="max-w-5xl mx-auto">
                {currentItems.map((news, index) => (
                  <div key={index} className="w-full">
                    <NewsCard news={news} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        <div className="spacer container  w-[100%] ">
          <div className=" flex flex-wrap md:-m-2 justify-center h-[500px] overflow-y-scroll ">
            {cardData.map((val, idx) => (
              <div
                className="w-[100%] shadow-lg sm:w-[80%] md:w-1/3 lg:w-1/3 xl:w-[22%] bg-white rounded-lg shadow-sm overflow-hidden transform transition duration-500 hover:scale-105 mx-3 md:mx-4 my-4"
                key={idx}
              >
                <div
                  className=" bg-cover bg-center"
                  style={{ backgroundImage: `url(${val.image})` }}
                ></div>
                <div className="p-4">
                  <h2 className="text-xl text-start font-bold mb-3">
                    {val.name}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-2 space-x-2">
                    <SlCalender />
                    <span>September 5-28, 2024</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2 space-x-2">
                    <CiLocationOn />
                    <span>Chicago</span>
                  </div>
                  <div className="flex items-center text-gray-600 space-x-2">
                    <TbArrowZigZag />
                    <span>Class</span>
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
      </div>
      {selectedEvent && (
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          confirmAction={confirmDeletion}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the institute "${selectedEvent.id}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
