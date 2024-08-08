import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteEvent, getAllEvents } from "src/api";
import Modal from "src/components/utils/DeleteModal";
import NewsCard from "src/components/utils/NewsCard";
import QueryResult from "src/components/utils/queryResults";
import { formatDate } from "src/utils/utils";

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
    <div className="flex flex-col">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto mb-10">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Events
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the evnets in the system.
          </p>
        </div>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="min-w-full">
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
