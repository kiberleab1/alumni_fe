import { useQuery, useQueryClient, useMutation } from "react-query";
import { deletePodcast, getAllPodcast } from "src/api";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/utils/DeleteModal";
import QueryResult from "src/components/utils/queryResults";
import Pagination from "src/components/adminPagination/adminPagination";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import { ImPodcast } from "react-icons/im";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function PodcastPage({
  onCreatePodcastClick,
  onEditPodcastClick,
}) {
  const { isError, data, isLoading } = useQuery("getAllPodcast", async () => {
    return await getAllPodcast({ pageNumber: 1, pageSize: 10 });
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div>
        <ListPodcast
          alumnus={data?.data}
          onCreatePodcastCLicked={onCreatePodcastClick}
          onEditPodcastClick={(podcast) => onEditPodcastClick(podcast)}
        />
      </div>
    </QueryResult>
  );
}

// eslint-disable-next-line react/prop-types
function ListPodcast({ alumnus, onCreatePodcastCLicked, onEditPodcastClick }) {
  const itemsPerPage = 5; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const queryClient = useQueryClient();

  // Mutation for deleting a podcast
  const { mutate: deleteDept } = useMutation(deletePodcast, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllPodcast");
      closeModal();
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getAllPodcast");
      console.error("Error deleting podcast:", error);
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

  const openModal = (podcast) => {
    setSelectedPodcast(podcast);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPodcast(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedPodcast);
    if (selectedPodcast) {
      deleteDept(selectedPodcast);
    }
  };

  return (
    <div className="flex flex-col">
      <IconHeaderWithButton
        title="Podcast"
        Icon={ImPodcast}
        buttonText="Add Podcast"
        ButtonIcon={ImPodcast}
        onButtonClick={onCreatePodcastCLicked}
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
                      title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      url
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      description
                    </th>

                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Status
                    </th> */}
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
                  {currentItems.map((podcast) => (
                    <tr key={podcast.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-600">
                          {podcast.title ? podcast.title : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {podcast.url ? podcast.url : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600 line-clamp-1">
                          {podcast.description ? podcast.description : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                        <a
                          href="#"
                          className="text-gray-600 hover:text-green-600"
                          onClick={() => onEditPodcastClick(podcast)}
                        >
                          <CiEdit className="text-2xl" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-red-600 pl-5"
                          onClick={() => openModal(podcast)}
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
          dataLength={alumnus.length}
        />
      </div>
      {selectedPodcast && (
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          confirmAction={confirmDeletion}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the podcast "${selectedPodcast.title}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
