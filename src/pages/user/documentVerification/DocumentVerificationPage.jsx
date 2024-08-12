import { useQuery, useQueryClient, useMutation } from "react-query";
import { getAllVerificationRequest, deleteDepartment } from "src/api";
import { useState } from "react";
import { formatDate, parseContactInfo } from "../../../utils/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/utils/DeleteModal";
import QueryResult from "src/components/utils/queryResults";

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
  useEffect;
  return (
    <div className="flex flex-col">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900 font-mono">
            Document Verification Requests
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            A list of all the document verification in the system including
            their name, description, start date.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onCreateDocumentVerificationClick}
          >
            Add New Document Verification
          </button>
        </div>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="min-w-full">
          <div className="overflow-x-auto">
            <div className="table-container" style={{ maxHeight: "500px" }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-gray-50 z-10">
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
                <tbody className="bg-white divide-y divide-gray-200">
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
                        <div className="text-sm text-gray-900">
                          {document.requesting_institute_name
                            ? document.requesting_institute_name
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {document.user_email ? document.user_email : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {document.user_email ? document.user_first_name : ""}{" "}
                          {document.user_last_name
                            ? document.user_last_name
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <div className="text-sm text-gray-900">
                          {document.user_institute
                            ? document.user_institute
                            : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-green-900"
                          onClick={() =>
                            onEditDocumentVerififcationClick(document)
                          }
                        >
                          Edit
                        </a>
                        <a
                          href="#"
                          className="text-red-600 hover:text-red-900 pl-5"
                          onClick={() => openModal(document)}
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              <span className="ml-2">Previous</span>
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
            >
              <span className="mr-2">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, documents.length)}
                </span>{" "}
                of <span className="font-medium">{documents.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`mr-2 ml-2 relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === 1 ? "cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`relative ${
                      currentPage === pageNumber
                        ? "z-10 bg-indigo-600 text-white"
                        : "text-gray-900 bg-white hover:bg-gray-50"
                    } inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === totalPages ? "cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
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
