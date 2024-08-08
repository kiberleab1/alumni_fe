// TODO

import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { useQuery } from "react-query";
import { getDepartments } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import SectionHolderComponent from "src/views/custom-components/sections/SectionHeaderComponent";

function DirectoryPage() {
  const { isError, data, isLoading } = useQuery("getDepartments", async () => {
    return await getDepartments({ pageNumber: 1, pageSize: 10 });
  });
  const section = {
    header: "Our Departments",
    body: "Here is list of our departments",
  };

  return (
    <>
      <SectionHolderComponent title={section.header} body={section.body} />
      <QueryResult isError={isError} isLoading={isLoading} data={data}>
        <DirectoryLists directories={data?.data?.department} />
      </QueryResult>
    </>
  );
}

export default DirectoryPage;

function DirectoryLists({ directories }) {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 mt-5 m-48"
    >
      {directories.map((directory) => {
        return (
          <li
            key={directory.id}
            className="overflow-hidden rounded-xl border border-gray-200"
          >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
              <BuildingLibraryIcon className="h-12 w-12 flex-none rounded-lg bg-white text-green-900 object-cover ring-1 ring-gray-100/10" />
              <div className="text-sm font-medium leading-6 text-gray-900">
                {directory.name}
              </div>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="font-mono font-medium text-gray-900">
                  President
                </dt>
                <dd className="text-gray-700">
                  <div className="font-medium text-gray-900">
                    {directory.head_of_department}
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="font-mono font-medium text-gray-900">
                  Phone Number
                </dt>
                <dd className="text-gray-700">
                  <div className="font-medium text-gray-900">
                    {directory.phone_number}
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="font-mono font-medium text-gray-900">Email</dt>
                <dd className="text-gray-700">
                  <div className="font-medium text-gray-900">
                    {directory.email}
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="font-mono font-medium text-gray-900">
                  Description
                </dt>
                <dd className="text-gray-700">
                  <div className="font-medium text-gray-900 line-clamp-3">
                    {directory.description}
                  </div>
                </dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}
