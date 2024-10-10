import React, { useState } from "react";
import {
  createAddress,
  createDepartment,
  createInstitute,
  editDepartent,
  getInstitutes,
} from "src/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "react-query";

export default function EditDepartment({ department }) {
  console.log(department);
  const [institutions, setInstitutions] = useState([]);
  const [departmentError, setDepartmentError] = useState("");
  const [departmentFields, setDepartmentFields] = useState({
    name: department.name ? department.name : "",
    description: department.description ? department.description : "",
    institute_id: department.institute_id ? department.institute_id : "",
    head_of_department: department.head_of_department
      ? department.head_of_department
      : "",
    email: department.email ? department.email : "",
    phone_number: department.phone_number ? department.phone_number : "",
    twitter: "",
    linkedin: "",
    telegram: "",
    facebook: "",
  });

  const { isError, data, error, isFetching } = useQuery(
    ["getInstitutes"],
    async () => {
      try {
        const instituteData = await getInstitutes({
          pageNumber: 1,
          pageSize: 10,
        });
        console.log(instituteData);
        if (instituteData) {
          const instituteNames = Object.values(
            instituteData.data.institute
          ).map((institute) => ({
            name: institute.name,
            id: institute.id,
          }));

          departmentFields.institute_id = instituteData.data.institute[0].id;
          setInstitutions(instituteNames);
        }
      } catch (error) {
        console.error(error);
      }
    }
  );

  const clearDepartmentFields = () => {
    setDepartmentFields({
      name: department.name ? department.name : "",
      description: department.description ? department.description : "",
      institute_id: department.institute_id ? department.institute_id : "",
      head_of_department: department.head_of_department
        ? department.head_of_department
        : "",
      email: department.email ? department.email : "",
      phone_number: department.phone_number ? department.phone_number : "",
      twitter: "",
      linkedin: "",
      telegram: "",
      facebook: "",
    });
  };

  const handleDepartmentClear = () => {
    clearDepartmentFields();
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    if (
      !departmentFields.name ||
      !departmentFields.description ||
      !departmentFields.institute_id
    ) {
      setDepartmentError("Please fill in all required fields!");
      return;
    }

    const departmentContactInfo = {
      telegram: "telegram:" + departmentFields.telegram,
      twitter: "twitter:" + departmentFields.twitter,
      linkedin: "linkedin:" + departmentFields.linkedin,
      facebook: "facebook:" + departmentFields.facebook,
    };

    const contactInfo = Object.values(departmentContactInfo)
      .filter((value) => value && value !== "")
      .join(", ");

    const newDepartmentInfo = {
      id: department.id,
      name: departmentFields.name,
      phone_number: departmentFields.phone_number,
      email: departmentFields.email,
      head_of_department: departmentFields.head_of_department,
      description: departmentFields.description,
      institute_id: departmentFields.institute_id,
      contact_info: contactInfo,
    };
    console.log(newDepartmentInfo);
    try {
      const result = await editDepartent(newDepartmentInfo);
      toast.success("Department Updated successfully!");
      setDepartmentError();
      console.log("Update department result:", result.data);
    } catch (error) {
      toast.success("Error Updating department!");
      console.error("Error Updating department!", error);
      setDepartmentError(error);
    }
  };

  return (
    <div className=" flex items-center justify-center w-full min-h-screen ">
      <div className="w-[100%] xl:w-[50%] p-2">
        <form className="bg-white sm:w-full p-2 sm:p-6 shadow-sm sm:rounded-xl font-serif border">
          <h1 className="text-2xl text-center text-gray-800 font-serif mb-2">
            Department Information
          </h1>
          <div className="px-6 xl:px-10 py-6 sm:p-8">
            <div className="grid grid-cols- gap-y-2 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 mb-4">
              <div>
                <label
                  htmlFor="department-name"
                  className="block mb-2 text-gray-600 text-start"
                >
                  Department Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="department-name"
                    id="department-name"
                    required
                    value={departmentFields.name}
                    onChange={(e) =>
                      setDepartmentFields({
                        ...departmentFields,
                        name: e.target.value,
                      })
                    }
                    autoComplete="department_name"
                    placeholder="Department Name"
                    className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="department-name"
                  className="block mb-2 text-gray-600 text-start"
                >
                  Department Email
                </label>

                <input
                  type="email"
                  name="department_email"
                  id="department_email"
                  autoComplete="department_email"
                  value={departmentFields.email}
                  onChange={(e) =>
                    setDepartmentFields({
                      ...departmentFields,
                      email: e.target.value,
                    })
                  }
                  className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email Address"
                />
              </div>
            </div>
            <div className="sm:col-span-2 mb-4">
              <label
                htmlFor="department-name"
                className="block mb-2 text-gray-600 text-start"
              >
                Department Phone Number
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  name="department_phone"
                  id="department_phone"
                  autoComplete="tel"
                  value={departmentFields.phone_number}
                  onChange={(e) =>
                    setDepartmentFields({
                      ...departmentFields,
                      phone_number: e.target.value,
                    })
                  }
                  className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div className="sm:col-span-2 mb-4">
              <label
                htmlFor="president_name"
                className="block mb-2 text-gray-600 text-start"
              >
                Department Head Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="president_name"
                  id="president_name"
                  value={departmentFields.head_of_department}
                  onChange={(e) =>
                    setDepartmentFields({
                      ...departmentFields,
                      head_of_department: e.target.value,
                    })
                  }
                  className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Department Head Name"
                />
              </div>
            </div>
            <div className="sm:col-span-2 mb-4">
              <label
                htmlFor="institute_id"
                className="block mb-2 text-gray-600 text-start"
              >
                Department Institute
              </label>
              <div className="mt-2">
                <select
                  value={departmentFields.institute_id}
                  onChange={(e) =>
                    setDepartmentFields({
                      ...departmentFields,
                      institute_id: e.target.value,
                    })
                  }
                  className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                >
                  {institutions.map((institute) => (
                    <option key={institute.id} value={institute.id}>
                      {institute.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2 mb-4">
              <label
                htmlFor="institute-contact-info"
                className="block mb-2 text-gray-600 text-start"
              >
                Department Contact Info
              </label>
              <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <input
                  type="url"
                  name="twitter"
                  id="twitter"
                  value={departmentFields.twitter}
                  onChange={(e) =>
                    setDepartmentFields({
                      ...departmentFields,
                      twitter: e.target.value,
                    })
                  }
                  className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Twitter Link"
                />
                <input
                  type="url"
                  name="linkedin"
                  id="linkedin"
                  value={departmentFields.linkedin}
                  onChange={(e) =>
                    setDepartmentFields({
                      ...departmentFields,
                      linkedin: e.target.value,
                    })
                  }
                  className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="LinkedIn Link"
                />
                <input
                  type="url"
                  name="telegram"
                  id="telegram"
                  value={departmentFields.telegram}
                  onChange={(e) =>
                    setDepartmentFields({
                      ...departmentFields,
                      telegram: e.target.value,
                    })
                  }
                  className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Telegram Link"
                />
                <input
                  type="url"
                  name="facebook"
                  id="facebook"
                  value={departmentFields.facebook}
                  onChange={(e) =>
                    setDepartmentFields({
                      ...departmentFields,
                      facebook: e.target.value,
                    })
                  }
                  className="block w-full bg-white border-gray-500 focus:outline-none rounded-md focus:border-blue-500 border-1 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Facebook Link"
                />
              </div>
            </div>
            <div className="sm:col-span-2 mb-4">
              <label
                htmlFor="department-description"
                className="block mb-2 text-gray-600 text-start"
              >
                Department Description
              </label>
              <div className="mt-2">
                <textarea
                  id="department-description"
                  name="department-description"
                  rows="2"
                  required
                  value={departmentFields.description}
                  onChange={(e) =>
                    setDepartmentFields({
                      ...departmentFields,
                      description: e.target.value,
                    })
                  }
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row  items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            {departmentError && (
              <p className="text-red-600 font-mono">{departmentError}</p>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-100 w-1/2 bg-red-500 py-2 rounded-md"
                onClick={handleDepartmentClear}
              >
                Clear
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-1/2 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-mono"
                onClick={handleDepartmentSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>

      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
