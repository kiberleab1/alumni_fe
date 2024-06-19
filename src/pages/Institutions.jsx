import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteInstitute, getInstitutes } from '../api';
import 'react-datepicker/dist/react-datepicker.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { formatDate, handleContactInfo, parseContactInfo, truncateDescription } from '../utils/utils';
import { EllipsisHorizontalIcon, InboxArrowDownIcon, NewspaperIcon } from '@heroicons/react/20/solid'
import { CalendarDaysIcon, UsersIcon } from '@heroicons/react/24/solid';

export default function InstitutionsPage({ onCreateInstituteClick, onInstituteEditClick }) {
	const { isError, data, error, isFetching } = useQuery(
		'getInstitutions',
		async () => {
			return await getInstitutes({ pageNumber: 1, pageSize: 20 });
		}
	);

	console.log(data);
	if (isFetching) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;
	return (
		<>
			<div>
				<ListInstitutions institutes={data.data.institute} onCreateInstituteClick={onCreateInstituteClick} onInstituteEditClick={(institute) => onInstituteEditClick(institute)} />
			</div>
			<div>
				<StatData />
			</div>
		</>
	);
}

// eslint-disable-next-line react/prop-types
function ListInstitutions({ institutes, onCreateInstituteClick, onInstituteEditClick }) {

	const itemsPerPage = 5; // Number of items to display per page
	const [currentPage, setCurrentPage] = useState(1);

	// Calculate pagination boundaries
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	let currentItems = institutes.slice(indexOfFirstItem, indexOfLastItem);

	// Calculate total number of pages
	const totalPages = Math.ceil(institutes.length / itemsPerPage);

	// Change page
	const paginate = (pageNumber) => {
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			setCurrentPage(pageNumber);
		}
	};

	const queryClient = useQueryClient();
    const mutation = useMutation(deleteInstitute, {
        onSuccess: () => {
            queryClient.invalidateQueries('getInstitutions');
        },
    });

	const onInstituteDeleteButtonClick = async (institute) => { // Add 'async' here
		console.log(institute);
		const deleteInstituteData = {
			address_id: institute.address_id,
			institute_id: institute.id
		};
        mutation.mutate(deleteInstituteData);
		console.log(deleteResult);
	};

	console.log(currentItems)

	currentItems = parseContactInfo(currentItems);
	console.log(currentItems)
	return (
		<div className="flex flex-col">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900 font-mono">Institututions</h1>
					<p className="mt-2 text-sm text-gray-500 font-mono">
						A list of all the institutions in the system including their name, description, start date.
					</p>
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						type="button"
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						onClick={onCreateInstituteClick}
					>
						Add Institute
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
											Name
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
											Email
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
											Phone Number
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
											Description
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
											Start Date
										</th>
										<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
											Action
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{currentItems.map(institute => (
										<tr key={institute.name}>
											<td className="px-6 py-4 whitespace-nowrap text-start">
												<div className="text-sm font-medium text-gray-900 text-start">{institute.name}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-start">
												<div className="text-sm text-gray-900">{institute.contact_obj.email ? institute.contact_obj.email : 'N/A'}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-start">
												<div className="text-sm text-gray-900">{institute.contact_obj.phone ? institute.contact_obj.phone : 'N/A'}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-start">
												<div className="text-sm text-gray-900">{truncateDescription(institute.description)}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-start">
												<div className="text-sm text-gray-900">{formatDate(institute.starting_year)}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-start text-sm font-medium ">
												<a href="#" className="text-indigo-600 hover:text-green-900" onClick={() => onInstituteEditClick(institute)}>
													Edit
												</a>
												<a href="#" className="text-red-600 hover:text-red-900 pl-5" onClick={() => onInstituteDeleteButtonClick(institute)}>
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

function StatData() {
	return (
		<ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-4 xl:gap-x-8 mt-5">
			<li key="1" className="overflow-hidden rounded-xl border border-gray-200">
				<div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
					<UsersIcon className="h-12 w-12 flex-none rounded-lg bg-white text-green-900 object-cover ring-1 ring-gray-100/10" />
					<div className="text-sm font-medium leading-6 text-gray-900">Most Student Enrolled</div>
				</div>
				<dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Bahir Dar University</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">2000</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Addis Ababa Commercial College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1980</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Addis Ababa Science and Technology University</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1657</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Mekelle Business College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1200</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Jimma Engineering College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">870</div>
						</dd>
					</div>
				</dl>
			</li>
			<li key="2" className="overflow-hidden rounded-xl border border-gray-200">
				<div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
					<InboxArrowDownIcon className="h-12 w-12 flex-none rounded-lg bg-white text-blue-900 object-cover ring-1 ring-gray-100/10" />
					<div className="text-sm font-medium leading-6 text-gray-900">Most Email Sent</div>
				</div>
				<dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Bahir Dar University</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">2000</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Addis Ababa Commercial College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1980</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Addis Ababa Science and Technology University</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1657</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Mekelle Business College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1200</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Jimma Engineering College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">870</div>
						</dd>
					</div>
				</dl>
			</li>
			<li key="3" className="overflow-hidden rounded-xl border border-gray-200">
				<div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
					<NewspaperIcon className="h-12 w-12 flex-none rounded-lg bg-white text-pink-900 object-cover ring-1 ring-gray-100/10" />
					<div className="text-sm font-medium leading-6 text-gray-900">Most News Published</div>
				</div>
				<dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Bahir Dar University</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">2000</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Addis Ababa Commercial College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1980</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Addis Ababa Science and Technology University</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1657</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Mekelle Business College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1200</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Jimma Engineering College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">870</div>
						</dd>
					</div>
				</dl>
			</li>

			<li key="3" className="overflow-hidden rounded-xl border border-gray-200">
				<div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
					<CalendarDaysIcon className="h-12 w-12 flex-none rounded-lg bg-white text-orange-900 object-cover ring-1 ring-gray-100/10" />
					<div className="text-sm font-medium leading-6 text-gray-900">Most Event Organized</div>
				</div>
				<dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Bahir Dar University</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">2000</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Addis Ababa Commercial College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1980</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Addis Ababa Science and Technology University</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1657</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Mekelle Business College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">1200</div>
						</dd>
					</div>
					<div className="flex justify-between gap-x-4 py-3">
						<dt className="font-mono font-medium text-gray-900">Jimma Engineering College</dt>
						<dd className="text-gray-700">
							<div className="font-medium text-gray-900">870</div>
						</dd>
					</div>
				</dl>
			</li>
		</ul>
	);
}

