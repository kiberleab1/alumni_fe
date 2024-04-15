import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function getStatusColorClass(status) {
    switch (status.toLowerCase()) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'deactivated':
            return 'bg-red-100 text-red-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'update':
            return 'bg-blue-100 text-blue-800';
        default:
            return '';
    }
}

export default function Table({ data, headers }) {
    const itemsPerPage = 5; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination boundaries
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);
    console.log(data)
    console.log(headers)
    // Change page
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <div className="min-w-full">
                    <div className="overflow-x-auto">
                        <div className="table-container" style={{ maxHeight: "500px" }}>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="sticky top-0 bg-gray-50 z-10">
                                    <tr>
                                        {headers.map((header, index) => (
                                            <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            {headers.map((header, index) => (
                                                header === 'name' && item['image'] ? (
                                                    <td className="px-6 py-4 whitespace-nowrap" key={index}>
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded-full" src={item['image']} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{item[header]}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                ) :
                                                    (header === 'status' ? (
                                                        <td className="px-6 py-4 whitespace-nowrap text-start" key={index}>
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(item[header])}`}>
                                                                {item[header].toUpperCase()}
                                                            </span>
                                                        </td>
                                                    )
                                                        :
                                                        (
                                                            <td className="px-6 py-4 whitespace-nowrap text-start" key={index}>
                                                                <div className="text-sm text-gray-900">{item[header]}</div>
                                                            </td>
                                                        )
                                                    )
                                            ))}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                    Edit
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
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, data.length)}</span> of{' '}
                                <span className="font-medium">{data.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`mr-2 ml-2 relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
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
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
