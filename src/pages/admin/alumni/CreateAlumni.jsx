import { useState } from "react";
import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createDepartment, getInstitutes } from "src/api";
import QueryResult from "src/components/utils/queryResults";

export default function CreateAlumni() {
  const [institutions, setInstitutions] = useState([]);
  const [alumniError, setAlumniError] = useState("");
  const [alumniFields, setAlumniFields] = useState({
    name: "",
    description: "",
    institute_id: "",
    head_of_department: "",
    email: "",
    phone_number: "",
    twitter: "",
    linkedin: "",
    telegram: "",
    facebook: "",
  });

  const { isError, data, isLoading } = useQuery(["getInstitutes"], async () => {
    try {
      const instituteData = await getInstitutes({
        pageNumber: 1,
        pageSize: 10,
      });
      console.log(instituteData);
      if (instituteData) {
        const instituteNames = Object.values(instituteData.data.institute).map(
          (institute) => ({
            name: institute.name,
            id: institute.id,
          })
        );

        alumniFields.institute_id = instituteData.data.institute[0].id;
        setInstitutions(instituteNames);
      }
      return instituteData;
    } catch (error) {
      console.error(error);
    }
  });

  const clearDepartmentFields = () => {
    setAlumniFields({
      name: "",
      description: "",
      institute_id: "",
      head_of_department: "",
      email: "",
      phone_number: "",
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
      !alumniFields.name ||
      !alumniFields.description ||
      !alumniFields.institute_id
    ) {
      setAluniError("Please fill in all required fields!");
      return;
    }

    const departmentContactInfo = {
      telegram: "telegram:" + alumniFields.telegram,
      twitter: "twitter:" + alumniFields.twitter,
      linkedin: "linkedin:" + alumniFields.linkedin,
      facebook: "facebook:" + alumniFields.facebook,
    };

    const contactInfo = Object.values(departmentContactInfo)
      .filter((value) => value && value !== "")
      .join(", ");

    const newDepartmentInfo = {
      name: alumniFields.name,
      phone_number: alumniFields.phone_number,
      email: alumniFields.email,
      head_of_department: alumniFields.head_of_department,
      description: alumniFields.description,
      institute_id: alumniFields.institute_id,
      contact_info: contactInfo,
    };
    console.log(newDepartmentInfo);
    try {
      const result = await createDepartment(newDepartmentInfo);
      toast.success("Department saved successfully!");
      setAluniError("");
      handleDepartmentClear();
      console.log("Create department result:", result.data);
    } catch (error) {
      toast.success("Error creating institute!");
      console.error("Error creating institute!", error);
      setAluniError(error);
    }
  };

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Department Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please make sure every input is correct and accurately describes
              the department.
            </p>
          </div>

          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="department-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Department Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="department-name"
                      id="department-name"
                      required
                      value={alumniFields.name}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          name: e.target.value,
                        })
                      }
                      autoComplete="department_name"
                      placeholder="Department Name"
                      className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="department-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Department Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="department_email"
                      id="department_email"
                      autoComplete="department_email"
                      value={alumniFields.email}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          email: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="department-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Department Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="department_phone"
                      id="department_phone"
                      autoComplete="tel"
                      value={alumniFields.phone_number}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          phone_number: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="president_name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Department Head Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="president_name"
                      id="president_name"
                      value={alumniFields.head_of_department}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          head_of_department: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Department Head Name"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="institute_id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Department Institute
                  </label>
                  <div className="mt-2">
                    <select
                      value={alumniFields.institute_id}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
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
                <div className="sm:col-span-6">
                  <label
                    htmlFor="institute-contact-info"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Department Contact Info
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <input
                      type="url"
                      name="twitter"
                      id="twitter"
                      value={alumniFields.twitter}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          twitter: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Twitter Link"
                    />
                    <input
                      type="url"
                      name="linkedin"
                      id="linkedin"
                      value={alumniFields.linkedin}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          linkedin: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="LinkedIn Link"
                    />
                    <input
                      type="url"
                      name="telegram"
                      id="telegram"
                      value={alumniFields.telegram}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          telegram: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Telegram Link"
                    />
                    <input
                      type="url"
                      name="facebook"
                      id="facebook"
                      value={alumniFields.facebook}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          facebook: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Facebook Link"
                    />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="department-description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Department Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="department-description"
                      name="department-description"
                      rows={3}
                      required
                      value={alumniFields.description}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
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
              {alumniError && (
                <p className="text-red-600 font-mono">{alumniError}</p>
              )}
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-100"
                onClick={handleDepartmentClear}
              >
                Clear
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleDepartmentSubmit}
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
    </QueryResult>
  );
}
