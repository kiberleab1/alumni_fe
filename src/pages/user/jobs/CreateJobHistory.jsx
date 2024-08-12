import React, { useState } from "react";
import useAOS from "../aos";
import {
  createAddress,
  createJobHistory,
  createInstitute,
  getInstitutes,
} from "src/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "react-query";

export default function CreateJobHistory() {
  const [institutions, setInstitutions] = useState([]);
  const [johHistoryError, setJobHistoryError] = useState("");
  const [VisibilityType] = useState(["All", "My Connection", "Only Me"]);

  const [jobHistoryFields, setJobHistoryFields] = useState({
    user_id: "rtete",
    title: "",
    description: "",
    status: "",
    visibility: "",
    address: "",
    duration: "",
  });

  const clearJobHistoryFields = () => {
    setJobHistoryFields({
      user_id: "rtete",
      title: "",
      description: "",
      status: "",
      visibility: "",
      address: "",
      duration: "",
    });
  };

  const handleJobHistoryClear = () => {
    clearJobHistoryFields();
  };

  const handleJobHistorySubmit = async (e) => {
    e.preventDefault();
    if (
      !jobHistoryFields.title ||
      !jobHistoryFields.description ||
      !jobHistoryFields.status
    ) {
      setJobHistoryError("Please fill in all required fields!");
      return;
    }

    const newJobHistory = {
      title: jobHistoryFields.title,
      description: jobHistoryFields.description,
      status: jobHistoryFields.status,
      duration: jobHistoryFields.duration,
      visibility: jobHistoryFields.visibility,
      address: jobHistoryFields.address,
      user_id: jobHistoryFields.user_id,
    };
    console.log(newJobHistory);
    try {
      const result = await createJobHistory(newJobHistory);
      toast.success("Department saved successfully!");
      setJobHistoryError("");
      handleJobHistoryClear();
      console.log("Create department result:", result.data);
    } catch (error) {
      toast.success("Error creating institute!");
      console.error("Error creating institute!", error);
      setJobHistoryError(error);
    }
  };
  useAOS({
    duration: 1200,
    once: true,
  });
  return (
    <div className="space-y-10 divide-y divide-gray-900/10 min-h-screen">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pl-10 pr-10 pt-10 md:grid-cols-2">
        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900 font-sans">
              Job History Information
            </h2>
          </div>
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2" data-aos="fade-up">
                <label
                  htmlFor="job-title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Job Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    title="job-title"
                    id="job-title"
                    required
                    value={jobHistoryFields.title}
                    onChange={(e) =>
                      setJobHistoryFields({
                        ...jobHistoryFields,
                        title: e.target.value,
                      })
                    }
                    autoComplete="job_title"
                    placeholder="Job Title"
                    className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="job-duration"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Duration
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    title="job_duration"
                    id="job_duration"
                    autoComplete="job_duration"
                    value={jobHistoryFields.duration}
                    onChange={(e) =>
                      setJobHistoryFields({
                        ...jobHistoryFields,
                        duration: e.target.value,
                      })
                    }
                    className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    placeholder="Job Duration"
                  />
                </div>
              </div>
              <div className="sm:col-span-2" data-aos="fade-left">
                <label
                  htmlFor="job-status"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Status
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    title="job_history_status"
                    id="job_history_status"
                    autoComplete="text"
                    value={jobHistoryFields.status}
                    onChange={(e) =>
                      setJobHistoryFields({
                        ...jobHistoryFields,
                        status: e.target.value,
                      })
                    }
                    className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    placeholder="Status"
                  />
                </div>
              </div>
              <div className="sm:col-span-2" data-aos="fade-up">
                <label
                  htmlFor="job-status"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Visibility
                </label>
                <div className="mt-2">
                  <select
                    value={jobHistoryFields.visibility}
                    onChange={(e) =>
                      setJobHistoryFields({
                        ...jobHistoryFields,
                        visibility: e.target.value,
                      })
                    }
                    className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                  >
                    {VisibilityType.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="job_address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    title="job_address"
                    id="job_address"
                    value={jobHistoryFields.address}
                    onChange={(e) =>
                      setJobHistoryFields({
                        ...jobHistoryFields,
                        address: e.target.value,
                      })
                    }
                    className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    placeholder="Job Address"
                  />
                </div>
              </div>

              <div className="sm:col-span-6" data-aos="fade-left">
                <label
                  htmlFor="department-description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Job Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="department-description"
                    title="department-description"
                    required
                    value={jobHistoryFields.description}
                    onChange={(e) =>
                      setJobHistoryFields({
                        ...jobHistoryFields,
                        description: e.target.value,
                      })
                    }
                    className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            {johHistoryError && (
              <p className="text-red-600 font-mono">{johHistoryError}</p>
            )}

            <a
              href="#_"
              className="rounded-2xl px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-red-200 text-indigo-600 text-white bg-red-900"
              onClick={handleJobHistoryClear}
            >
              <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-red-200 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
              <span className="relative text-indigo-200 transition duration-300 group-hover:text-black ease ">
                Clear
              </span>
            </a>

            <a
              href="#_"
              className="rounded-2xl px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-200 text-indigo-600 text-white bg-indigo-600"
              onClick={handleJobHistorySubmit}
            >
              <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-200 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
              <span className="relative text-indigo-100 transition duration-300 group-hover:text-black ease">
                Save
              </span>
            </a>
          </div>
        </form>
      </div>

      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
