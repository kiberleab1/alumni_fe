import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { deleteJobHistory, getAllJobHistory } from "src/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { formatDate } from "src/utils/utils";
import Modal from "src/components/utils/DeleteModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import QueryResult from "src/components/utils/queryResults";
import useAOS from "../aos";
import { GrHistory } from "react-icons/gr";
import { MdMessage } from "react-icons/md";
import { LuPlus } from "react-icons/lu";

export default function JobHistoryPage({
  onCreateJobHistoryClick,
  onEditJobHistoryClick,
}) {
  const [jobHistorys, setJobs] = useState([]);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobHistory, setSelectedJobHistory] = useState(null);
  const [jobHistory, setjobHistory] = useState(false);

  const [getId, setgetId] = useState("");
  const queryClient = useQueryClient();

  const displayHistory = (getId, jobHistoryData) => {
    console.log(getId);
    console.log(jobHistoryData);
    setjobHistory(!jobHistory);
    setSelectedJobHistory(jobHistoryData);
  };
  const { isError, data, isLoading } = useQuery(
    ["getAllJobHistory"],
    async () => {
      const jobsData = await getAllJobHistory({ pageNumber: 1, pageSize: 10 });
      setJobs(jobsData.data.jobHistory);
      return jobsData;
    },
    { keepPreviousData: true }
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobHistorys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobHistorys.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  useAOS({
    duration: 1200,
    once: true,
  });

  console.log(jobHistorys);
  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="sm:flex sm:items-center mb-4 mt-4" data-aos="fade-down">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900 font-sans">
              Our Alumnis Job History
            </h1>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <a
              href="#_"
              className="relative inline-block text-lg group "
              onClick={onCreateJobHistoryClick}
            >
              <span className="relative z-10 block px-4 py-2 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                <span className="relative flex ">
                  <GrHistory className="mr-2 text-xl" /> JobHistory
                </span>
              </span>
              <span
                className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                data-rounded="rounded-lg"
              ></span>
            </a>
          </div>
        </div>

        <div
          className=" max-w-8xl flex flex-col md:flex-row items-center justify-center space-x-6 p-4 "
          data-aos="fade-right"
        >
          <div className=" w-full h-auto  bg-gray-100 shadow-md rounded-lg overflow-hidden">
            {jobHistorys.map((val, index) => {
              return (
                <div
                  className="flex items-center p-4 hover:bg-gray-200"
                  onClick={() => displayHistory(`${index}`, val)}
                >
                  <img
                    src={val?.user_photo}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-grow text-left">
                    <p className="text-lg font-semibold text-gray-800 block">
                      {val.user_name}
                    </p>
                    <p className="text-sm text-gray-600 block">{val.degree}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-4">
                    <MdMessage className="text-blue-500 hover:text-blue-900 bg-gray-100" />

                    <LuPlus className="text-green-500 hover:text-green-900 bg-gray-100" />
                  </div>
                </div>
              );
            })}
          </div>
          {jobHistory && (
            <div className=" w-full shadow-md rounded-lg overflow-hidden bg-gray-200 ">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-left text-gray-800">
                  Job History
                </h2>
              </div>
              {selectedJobHistory?.job_history.map((val, index) => {
                return (
                  <div>
                    <div className="flex items-center p-2">
                      <div className="flex-grow text-left">
                        <p className="text-lg font-semibold text-gray-800 block">
                          {val?.title}
                        </p>
                        <i className="text-sm text-gray-600 block">
                          {val?.title}
                        </i>
                      </div>

                      <div className="flex-shrink-0 flex items-center space-x-4">
                        {val?.duration}
                      </div>
                    </div>
                    <div>
                      <p className="text-left p-2">{val?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </QueryResult>
  );
}

{
  /* <div
className=" max-w-8xl flex flex-col md:flex-row items-center justify-center space-x-6 p-4 "
data-aos="fade-right"
>
<div className=" w-full h-auto justify-top  bg-gray-100 shadow-md rounded-lg overflow-hidden">
  <div className="p-4 border-b">
    <h2 className="text-xl font-bold text-left text-gray-800">
      Users
    </h2>
  </div>
  {users.map((val, index) => {
    return (
      <div
        className="flex items-center p-4 hover:bg-gray-200"
        onClick={() => displayHistory(`${val.id}`)}
      >
        <img
          src={val.img}
          alt="User"
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div className="flex-grow text-left">
          <p className="text-lg font-semibold text-gray-800 block">
            {val.name}
          </p>
          <p className="text-sm text-gray-600 block">
            {val.Department}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center space-x-4">
          <MdMessage className="text-blue-500 hover:text-blue-900 bg-gray-100" />

          <LuPlus className="text-green-500 hover:text-green-900 bg-gray-100" />
        </div>
      </div>
    );
  })}
</div>
{jobHistory && (
  <div className=" w-full shadow-md rounded-lg overflow-hidden bg-gray-200 ">
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold text-left text-gray-800">
        Job History
      </h2>
    </div>

    <div>
      <div className="flex items-center p-2">
        <div className="flex-grow text-left">
          <p className="text-lg font-semibold text-gray-800 block">
            Senior Software Engineer
          </p>
          <i className="text-sm text-gray-600 block">Acme lnc.</i>
        </div>

        <div className="flex-shrink-0 flex items-center space-x-4">
          Jan 2020 - Present
        </div>
      </div>
      <div>
        <p className="text-left p-2">
          Integrated your provided card structure for Senior Software
          Engineer as the second card, maintaining its original
          styling.
        </p>
      </div>
    </div>

    <div>
      <div className="flex items-center p-2">
        <div className="flex-grow text-left">
          <p className="text-lg font-semibold text-gray-800 block">
            Front-End Developer
          </p>
          <i className="text-sm text-gray-600 block">XYZ Corp.</i>
        </div>

        <div className="flex-shrink-0 flex items-center space-x-4">
          Jun 2018 - Dec 2019
        </div>
      </div>
      <div>
        <p className="text-left p-2">
          Integrated your provided card structure for Senior Software
          Engineer as the second card, maintaining its original
          styling.
        </p>
      </div>
    </div>

    <div>
      <div className="flex items-center p-2">
        <div className="flex-grow text-left">
          <p className="text-lg font-semibold text-gray-800 block">
            Intern
          </p>
          <i className="text-sm text-gray-600 block">startup lnc..</i>
        </div>

        <div className="flex-shrink-0 flex items-center space-x-4">
          May 2017 - Aug 2017
        </div>
      </div>
      <div>
        <p className="text-left p-2">
          Integrated your provided card structure for Senior Software
          Engineer as the second card, maintaining its original
          styling.
        </p>
      </div>
    </div>
  </div>
)}
</div> */
}

// import React, { useState } from 'react';
// import { MdMessage } from 'react-icons/md';
// import { LuPlus } from 'react-icons/lu';

// const JobHistoryPage = () => {
//   const [selectedUser, setSelectedUser] = useState(null);

//   const users = [
//     {
//       id: 1,
//       name: 'John Doe',
//       Department: 'Engineering',
//       img: 'path/to/image1.jpg',
//       jobHistory: [
//         {
//           title: 'Senior Software Engineer',
//           company: 'Acme Inc.',
//           duration: 'Jan 2020 - Present',
//           description: 'Working on various software engineering projects.',
//         },
//         {
//           title: 'Front-End Developer',
//           company: 'XYZ Corp.',
//           duration: 'Jun 2018 - Dec 2019',
//           description: 'Developed front-end features for multiple clients.',
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: 'Jane Smith',
//       Department: 'Marketing',
//       img: 'path/to/image2.jpg',
//       jobHistory: [
//         {
//           title: 'Marketing Specialist',
//           company: 'Marketing Gurus',
//           duration: 'Jan 2019 - Present',
//           description: 'Leading marketing campaigns and strategies.',
//         },
//       ],
//     },
//   ];

//   const displayHistory = (userId) => {
//     const user = users.find((u) => u.id === userId);
//     setSelectedUser(user);
//   };

//   return (
//     <div className="flex">
//       <div className="w-1/3 h-auto bg-gray-100 shadow-md rounded-lg overflow-hidden">
//         <div className="p-4 border-b">
//           <h2 className="text-xl font-bold text-left text-gray-800">Users</h2>
//         </div>
//         {users.map((val) => (
//           <div
//             key={val.id}
//             className="flex items-center p-4 hover:bg-gray-200 cursor-pointer"
//             onClick={() => displayHistory(val.id)}
//           >
//             <img
//               src={val.img}
//               alt="User"
//               className="w-16 h-16 rounded-full object-cover mr-4"
//             />
//             <div className="flex-grow text-left">
//               <p className="text-lg font-semibold text-gray-800 block">
//                 {val.name}
//               </p>
//               <p className="text-sm text-gray-600 block">{val.Department}</p>
//             </div>
//             <div className="flex-shrink-0 flex items-center space-x-4">
//               <MdMessage className="text-blue-500 hover:text-blue-900 bg-gray-100" />
//               <LuPlus className="text-green-500 hover:text-green-900 bg-gray-100" />
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedUser && (
//         <div className="w-2/3 shadow-md rounded-lg overflow-hidden bg-gray-200 ml-4">
//           <div className="p-4 border-b">
//             <h2 className="text-xl font-bold text-left text-gray-800">
//               {selectedUser.name}'s Job History
//             </h2>
//           </div>

//           {selectedUser.jobHistory.map((job, index) => (
//             <div key={index}>
//               <div className="flex items-center p-2">
//                 <div className="flex-grow text-left">
//                   <p className="text-lg font-semibold text-gray-800 block">
//                     {job.title}
//                   </p>
//                   <i className="text-sm text-gray-600 block">{job.company}</i>
//                 </div>
//                 <div className="flex-shrink-0 flex items-center space-x-4">
//                   {job.duration}
//                 </div>
//               </div>
//               <div>
//                 <p className="text-left p-2">{job.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobHistoryPage;
