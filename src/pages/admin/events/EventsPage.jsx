import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdEventAvailable } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteEvent, getAllEvents } from "src/api";
import Pagination from "src/components/adminPagination/adminPagination";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import Modal from "src/components/utils/DeleteModal";
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
      <IconHeaderWithButton
        title="Events"
        Icon={MdEventAvailable}
        buttonText="Add Events"
        ButtonIcon={MdEventAvailable}
        onButtonClick={onCreateEventClick}
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
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Owner Admin
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Owner Institute
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Event Level
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Event Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Created At
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
                  {currentItems.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900">
                          {event.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {event.adminName ? event.adminName : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {event.instituteName ? event.instituteName : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {event.level ? event.level : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {event.time ? event.time : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {formatDate(event.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                        <a
                          href="#"
                          className="text-gray-600 hover:text-green-600"
                          onClick={() => onEditEventClick(event)}
                        >
                          <CiEdit className="text-2xl" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-red-600 pl-5"
                          onClick={() => openModal(event)}
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
          dataLength={eventsData.length}
        />
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
