import { useQuery, useQueryClient, useMutation } from 'react-query';
import { createInstitute, getInstitutes } from '../api';

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
import DatePicker from 'react-datepicker'; //
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles Import react-datepicker
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function InstitutionsPage() {
	const { isError, data, error, isFetching } = useQuery(
		'getInstitutions',
		async () => {
			return await getInstitutes({ pageNumber: 0, pageSize: 10 });
		}
	);

	console.log(data);
	if (isFetching) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;
	return (
		<>
			<div>
				<ListInstitutions institutes={data.data.institute} />
			</div>
		</>
	);
}


// eslint-disable-next-line react/prop-types
function ListInstitutions({ institutes }) {

	const itemsPerPage = 5; // Number of items to display per page
	const [currentPage, setCurrentPage] = useState(1);

	// Calculate pagination boundaries
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = institutes.slice(indexOfFirstItem, indexOfLastItem);

	// Calculate total number of pages
	const totalPages = Math.ceil(institutes.length / itemsPerPage);

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
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
											Name
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
											Contact Information
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
											Description
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
											Start Date
										</th>
										<th scope="col" className="relative px-6 py-3">
											<span className="sr-only">Edit</span>
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{currentItems.map(institute => (
										<tr key={institute.name}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex text-start">
													<div className="ml-4 text-start">
														<div className="text-sm font-medium text-gray-900 text-start">{institute.name}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-start">
												<div className="text-sm text-gray-900">{institute.contact_info}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-start">
												<div className="text-sm text-gray-900">{institute.description}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-start">
												<div className="text-sm text-gray-900">{institute.starting_year}</div>
											</td>
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
								Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, institutes.length)}</span> of{' '}
								<span className="font-medium">{institutes.length}</span> results
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
