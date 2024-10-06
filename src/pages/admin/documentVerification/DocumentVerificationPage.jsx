import { useQuery, useQueryClient, useMutation } from "react-query";
import { getAllVerificationRequest, deleteDepartment } from "src/api";
import { useState } from "react";
import { formatDate, parseContactInfo } from "../../../utils/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/utils/DeleteModal";
import QueryResult from "src/components/utils/queryResults";
import useAOS from "src/pages/user/aos";
import { BsPersonWorkspace } from "react-icons/bs";
import { IoDocumentsOutline } from "react-icons/io5";
import IconHeaderWithButton from "src/components/IconHeader/IconHeaderWithButton";
import Pagination from "src/components/adminPagination/adminPagination";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function DocumentVerificationPage({
  onCreateDocumentVerificationClick,
  onEditDocumentVerififcationClick,
}) {
  const { isError, data, isLoading } = useQuery(
    "getAllVerificationRequest",
    async () => {
      return await getAllVerificationRequest({ pageNumber: 1, pageSize: 10 });
    }
  );

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div>
        <ListDepartment
          documents={data?.data?.requests}
          onCreateDocumentVerificationClick={onCreateDocumentVerificationClick}
          onEditDocumentVerififcationClick={(document) =>
            onEditDocumentVerififcationClick(document)
          }
        />
      </div>
    </QueryResult>
  );
}

// eslint-disable-next-line react/prop-types
function ListDepartment({
  documents,
  onCreateDocumentVerificationClick,
  onEditDocumentVerififcationClick,
}) {
  const itemsPerPage = 5; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const queryClient = useQueryClient();

  // Mutation for deleting a document
  const { mutate: deleteDept } = useMutation(deleteDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllVerificationRequest");
      closeModal();
    },
    onError: (error) => {
      closeModal();
      queryClient.invalidateQueries("getAllVerificationRequest");
      console.error("Error deleting document:", error);
    },
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = parseContactInfo(
    documents.slice(indexOfFirstItem, indexOfLastItem)
  );

  const totalPages = Math.ceil(documents.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openModal = (document) => {
    setSelectedItem(document);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    console.log(selectedItem);
    if (selectedItem) {
      deleteDept(selectedItem);
    }
  };
  useAOS({
    duration: 1200,
    once: false,
  });
  return (
    <div className="flex flex-col min-h-screen">
      <IconHeaderWithButton
        title="Institut  Document Verification Requestsions"
        Icon={IoDocumentsOutline}
        buttonText="Add Document"
        ButtonIcon={IoDocumentsOutline}
        onButtonClick={onCreateDocumentVerificationClick}
      />

      <div
        data-aos="fade-left"
        className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
      >
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
                      Requesting User Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      Requesting Institute Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      User Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      User Fullname
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                    >
                      User Institute
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
                  {currentItems.map((document) => (
                    <tr key={document.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm font-medium text-gray-900">
                          {document.requesting_user_email
                            ? document.requesting_user_email
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {document.requesting_institute_name
                            ? document.requesting_institute_name
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {document.user_email ? document.user_email : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {document.user_email ? document.user_first_name : ""}{" "}
                          {document.user_last_name
                            ? document.user_last_name
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-600">
                          {document.user_institute
                            ? document.user_institute
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-row">
                        <a
                          href="#"
                          className="text-gray-600 hover:text-green-900"
                          onClick={() =>
                            onEditDocumentVerififcationClick(document)
                          }
                        >
                          <CiEdit className="text-2xl" />
                        </a>
                        <a
                          href="#"
                          className="text-gray-600 hover:text-red-900 pl-5"
                          onClick={() => openModal(document)}
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
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPaginate={paginate}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        dataLength={documents.length}
      />
      {selectedItem && (
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          confirmAction={confirmDeletion}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the document "${selectedItem.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
