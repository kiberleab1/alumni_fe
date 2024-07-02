import { useQuery, useQueryClient, useMutation } from 'react-query';
import { getAllEvents, deleteEvent, createEvents } from '../api';
import Modal from './DeleteModal';

import {
    Container,
    Row,
    Col,
    FormGroup,
    Label,
    Button,
    Table,
} from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { formatDate } from '../utils/utils';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function EventsPage({ onCreateEventClick, onEditEventClick }) {
    const { isError, data, error, isFetching } = useQuery(
        'getAllEvents',
        async () => {
            return await getAllEvents({ pageNumber: 1, pageSize: 10 });
        }
    );

    console.log(data);
    if (isFetching) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;
    return (
        <>
            <div>
                <ListEvent eventsData={data.data.events} onCreateEventClick={onCreateEventClick} onEditEventClick={(event) => onEditEventClick(event)} />
            </div>
        </>
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
        console.log(selectedEvent)
        if (selectedEvent) {
            deleteEventModalAction(selectedEvent.id);
        }
    };

    const queryClient = useQueryClient();
    const { mutate: deleteEventModalAction } = useMutation(deleteEvent, {
        onSuccess: () => {
            queryClient.invalidateQueries('getAllEvents');
            closeModal();
            toast.success('Event Deleted successfully!');

        },
        onError: (error) => {
            closeModal();
            queryClient.invalidateQueries('getAllEvents');
            console.error('Error deleting Event:', error.message);
            toast.success('Error deleting Event!');

        },
    });

    return (
        <div className="flex flex-col">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Events</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the evnets in the system.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={onCreateEventClick}
                    >
                        Add New Event
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
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                            Owner Admin
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                            Owner Institute
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                            Event Level
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                            Event Time
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.map(event => (
                                        <tr key={event.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-start">
                                                <div className="text-sm font-medium text-gray-900">{event.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-start">
                                                <div className="text-sm text-gray-900">{event.ownerAdminId ? event.ownerAdminId : "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-start">
                                                <div className="text-sm text-gray-900">{event.ownerInstituteId ? event.ownerInstituteId : "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-start">
                                                <div className="text-sm text-gray-900">{event.level ? event.level : "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-start">
                                                <div className="text-sm text-gray-900">{event.time ? event.time : "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-start">
                                                <div className="text-sm text-gray-900">{formatDate(event.createdAt)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium ">
                                                <a href="#" className="text-indigo-600 hover:text-green-900" onClick={() => onEditEventClick(event)}>
                                                    Edit
                                                </a>
                                                <a href="#" className="text-red-600 hover:text-red-900 pl-5" onClick={() => openModal(event)}>
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
                            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                        >
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="ml-2">Previous</span>
                        </button>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
                        >
                            <span className="mr-2">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, eventsData.length)}</span> of{' '}
                                <span className="font-medium">{eventsData.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => paginate(pageNumber)}
                                        className={`relative ${currentPage === pageNumber ? 'z-10 bg-indigo-600 text-white' : 'text-gray-900 bg-white hover:bg-gray-50'} inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
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