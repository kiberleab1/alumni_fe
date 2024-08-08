// NewsPage.js
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deletedNews, getAllNews } from "src/api";
import { formatDate } from "src/utils/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryResult from "src/components/utils/queryResults";
import Modal from "src/components/utils/DeleteModal";
import NewsCard from "src/components/utils/NewsCard";

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
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base mb-10 font-semibold leading-6 text-gray-900">
              News
            </h1>
          </div>
        </div>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <div className="min-w-full">
            <div className="overflow-x-auto">
              <div className="table-container">
                <div className="max-w-6xl mx-auto">
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
