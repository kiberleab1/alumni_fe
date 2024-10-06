import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deletedNews, getAllNews } from "src/api";
import { formatDate } from "src/utils/utils";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";
import Modal from "src/components/utils/DeleteModal";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import { GiNewspaper } from "react-icons/gi";
import Pagination from "src/components/adminPagination/adminPagination";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function NewsPage({ onCreateNewsClick, onNewsEditClick }) {
  const [newsList, setNewsList] = useState([]);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const queryClient = useQueryClient();

  const { isError, data, isLoading } = useQuery(
    ["getAllNews"],
    async () => {
      const newsData = await getAllNews({ pageNumber: 1, pageSize: 10 });
      console.log(newsData);
      const newsListData = newsData.data.news.map((newss) => ({ ...newss }));
      setNewsList(newsListData);
      return newsData;
    },
    { keepPreviousData: true }
  );

  // const mutation = useMutation(deletedNews, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("getAllNews");
  //   },
  // });

  const { mutate: deleteAdminModalAction } = useMutation(deletedNews, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllNews");
      closeModal();
      toast.success("News Deleted successfully!");
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getAllNews");
      console.error("Error deleting news:", error);
      toast.success("Error deleting news!");
    },
  });

  const openModal = (news) => {
    setSelectedNews(news);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNews(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedNews);
    if (selectedNews) {
      deleteAdminModalAction(selectedNews.id);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <div className="flex flex-col">
        <IconHeaderWithButton
          title="News"
          Icon={GiNewspaper}
          buttonText="Add News"
          ButtonIcon={GiNewspaper}
          onButtonClick={onCreateNewsClick}
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
                        Published By
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        Publisher Institute
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        News Level
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
                    {currentItems.map((news) => (
                      <tr key={news.email}>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm font-medium text-gray-600 text-start">
                            {news.id}{" "}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {news.adminName ? news.adminName : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {news.instituteName ? news.instituteName : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {news.level}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start">
                          <div className="text-sm text-gray-600">
                            {formatDate(news.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                          <a
                            href="#"
                            className="text-gray-600 hover:text-green-900"
                            onClick={() => onNewsEditClick(news)}
                          >
                            <CiEdit className="text-2xl" />
                          </a>
                          <a
                            href="#"
                            className="text-gray-600 hover:text-red-900 pl-5"
                            onClick={() => openModal(news)}
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
            dataLength={newsList.length}
          />
        </div>
        {selectedNews && (
          <Modal
            isOpen={isModalOpen}
            closeModal={closeModal}
            confirmAction={confirmDeletion}
            title="Confirm Deletion"
            message={`Are you sure you want to delete the institute "${selectedNews.id}"? This action cannot be undone.`}
          />
        )}
      </div>
    </QueryResult>
  );
}
