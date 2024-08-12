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

const newsdData = [
  {
    day: "September 14th, 2015",
    headline: "The world ended yesterday",
    discription:
      "I'm looking for something that can deliver a 50-pound payload of snow on a small feminine target. Can you suggest something? Hello...?",
  },
  {
    day: "NOvember 14th, 2015",
    headline: "The world ended today",
    discription:
      "I'm looking for something that can deliver a 50-pound payload of snow on a small feminine target. Can you suggest something? Hello...?",
  },
];
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
      <div className="flex flex-col   ">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl mb-10 font-semibold leading-6 text-gray-900 font-sans">
              News
            </h1>
          </div>
        </div>
        {/* <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
        </div> */}

        <div className="container mx-auto px-7 py-2 sm:px-10 md:px-20 lg:px-32 lg:pt-12  min-h-screen bg-red-50 pt-4 ">
          <div className="-m-1 flex flex-wrap md:-m-2 justify-center">
            {newsdData.map((val, idx) => {
              return (
                <figure className="snip1347 relative overflow-hidden m-2 min-w-[230px] max-w-[315px] w-full text-white text-left leading-relaxed bg-[#141414] font-roboto group">
                  <div className="relative w-full overflow-hidden">
                    <img
                      src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample87.jpg"
                      alt="sample87"
                      className="transform rotate-5 scale-150 transition-transform duration-300 ease-in-out origin-center group-hover:scale-110 group-hover:rotate-0"
                    />

                    <div className="absolute bottom-0 left-0 w-full text-left  px-6 pt-3 tracking-wide bg-[black] group-hover:opacity-25">
                      <div className="absolute bottom-full right-0 w-0 h-0 border-t-0 border-l-[400px] border-t-[40px] border-r-0 border-b-transparent border-l-[black] border-t-transparent border-r-transparent group-hover:opacity-25  "></div>
                    </div>
                  </div>
                  <div className="date absolute bg-gray-900 top-0 right-0 w-full px-6 pt-3 text-right text-xs uppercase bg-[#1e1e1e] text-white group-hover:bg-[#141414] transition-colors duration-300 ease-in-out">
                    {val.day}
                    <div className="absolute top-full left-0 w-0 h-0 border-t-0 border-r-[400px] border-b-[40px] border-l-0 border-r-[#1e1e1e] border-b-transparent group-hover:opacity-25  "></div>
                  </div>
                  <figcaption className="w-full p-6 pb-6 bg-gray-900 group-hover:bg-[#1e1e1e] transition-colors duration-300 ease-in-out">
                    <h2 className="font-light text-2xl leading-snug mb-2 text-gray-300 group-hover:text-white transition-colors duration-300 ease-in-out">
                      {val.headline}
                    </h2>
                    <p className="text-xs tracking-wide mb-2 opacity-90 group-hover:opacity-100 group-hover:text-white transition-opacity duration-300 ease-in-out">
                      {val.discription}
                    </p>
                    <a
                      href="#"
                      className="inline-block mx-0 my-2 w-[47%] text-center border border-white text-white hover:text-gray-500 text-xs uppercase tracking-wide font-semibold opacity-65 transition-opacity duration-300 hover:opacity-100"
                    >
                      Read More
                    </a>
                  </figcaption>
                </figure>
              );
            })}
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
