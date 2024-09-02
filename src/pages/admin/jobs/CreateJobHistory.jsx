import React, { useState } from "react";
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
  const [departmentError, setDepartmentError] = useState("");
  const [jobHistoryFields, setJobHistoryFields] = useState({
    user_id: "92faa361-3246-4f11-acae-cdb599a0d200",
    title: "",
    description: "",
    status: "",
    address: "",
    duration: "",
  });

  const clearJobHistoryFields = () => {
    setJobHistoryFields({
      user_id: "92faa361-3246-4f11-acae-cdb599a0d200",
      title: "",
      description: "",
      status: "",
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
      setDepartmentError("Please fill in all required fields!");
      return;
    }

    const newJobHistory = {
      title: jobHistoryFields.title,
      description: jobHistoryFields.description,
      status: jobHistoryFields.status,
      duration: jobHistoryFields.duration,
      address: jobHistoryFields.address,
      user_id: jobHistoryFields.user_id,
    };
    console.log(newJobHistory);
    try {
      const result = await createJobHistory(newJobHistory);
      toast.success("Department saved successfully!");
      setDepartmentError();
      handleJobHistoryClear();
      console.log("Create department result:", result.data);
    } catch (error) {
      toast.success("Error creating institute!");
      console.error("Error creating institute!", error);
      setDepartmentError(error);
    }
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pl-10 pr-10 pt-10 md:grid-cols-2">
        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Job History Information
            </h2>
          </div>
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
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
              <div className="sm:col-span-2">
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
              {/* <div className="sm:col-span-2">
                                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                                    Department Institute
                                </label>
                                <div className="mt-2">
                                    <select
                                        value={jobHistoryFields.status}
                                        onChange={(e) => setJobHistoryFields({ ...jobHistoryFields, status: e.target.value })}
                                        className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                                    >
                                        {institutions.map((institute) => (
                                            <option key={institute.id} value={institute.id}>
                                                {institute.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div> */}
              <div className="sm:col-span-6">
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
                    rows="3"
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
            {departmentError && (
              <p className="text-red-600 font-mono">{departmentError}</p>
            )}
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-100"
              onClick={handleJobHistoryClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleJobHistorySubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>

      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
