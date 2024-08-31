import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { createAlumniProfile, getDepartments, getInstitutes } from "src/api";
import QueryResult from "src/components/utils/queryResults";

export default function CreateAlumni() {
  const [institutions, setInstitutions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [alumniError, setAlumniError] = useState("");
  const [alumniFields, setAlumniFields] = useState({
    user_id: "92faa361-3246-4f11-acae-cdb599a0d200",
    institution_id: "",
    department_id: "",
    graduation_year: "",
    graduation_institute: "",
    social_media_links: "",
    certification_link: "",
    description: "",
    status: "",
    achievements: "",
    user_photo: "",
    degree: "",
    Skills: "",
    Language: "",
  });
  //scroll anima...
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: false,
    });
  });
  const { isError, data, isLoading } = useQuery(["getInstitutes"], async () => {
    try {
      const instituteData = await getInstitutes({
        pageNumber: 1,
        pageSize: 10,
      });

      const departmentData = await getDepartments({
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

        alumniFields.institution_id = instituteData.data.institute[0].id;
        setInstitutions(instituteNames);
      }

      if (departmentData) {
        const departmentNames = Object.values(
          departmentData.data?.department
        ).map((department) => ({
          name: department.name,
          id: department.id,
        }));

        alumniFields.department_id = departmentData.data?.department[0]?.id;
        setDepartments(departmentNames);
      }

      return instituteData;
    } catch (error) {
      console.error(error);
    }
  });

  const clearAlumniFields = () => {
    setAlumniFields({
      user_id: "92faa361-3246-4f11-acae-cdb599a0d200",
      institution_id: "",
      department_id: "",
      graduation_year: "",
      graduation_institute: "",
      social_media_links: "",
      certification_link: "",
      description: "",
      status: "",
      achievements: "",
      user_photo: "",
      degree: "",
      Skills: "",
      Language: "",
    });
  };

  const handleDepartmentClear = () => {
    clearAlumniFields();
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    if (
      !alumniFields.user_id ||
      !alumniFields.institution_id ||
      !alumniFields.department_id
    ) {
      setAlumniError("Please fill in all required fields!");
      return;
    }

    try {
      const result = await createAlumniProfile(alumniFields);
      toast.success("Alumni saved successfully!");
      setAlumniError("");
      handleDepartmentClear();
      console.log("Create alumni result:", result.data);
    } catch (error) {
      toast.success("Error creating alumni!");
      console.error("Error creating alumni!", error);
      setAlumniError(error);
    }
  };

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="space-y-10 divide-y divide-gray-900/10 min-h-screen ">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 font-sans">
            Create Alumni
          </h1>
        </div>
        <div className="grid grid-cols-1 ml-20 gap-x-8 gap-y-8 pt-10 md:grid-cols-3 ">
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2" data-aos="fade-right">
                  <label
                    htmlFor="department-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Degree Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="department-name"
                      id="department-name"
                      required
                      value={alumniFields.degree}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          degree: e.target.value,
                        })
                      }
                      autoComplete="department_name"
                      placeholder="Alumni Name"
                      className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="department-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Skills
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="department_email"
                      id="department_email"
                      autoComplete="department_email"
                      value={alumniFields.Skills}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          Skills: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Skills list"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2" data-aos="fade-left">
                  <label
                    htmlFor="department-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Language
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="department_phone"
                      id="department_phone"
                      autoComplete="tel"
                      value={alumniFields.Language}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          Language: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Language"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2" data-aos="fade-right">
                  <label
                    htmlFor="social_media_links"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Social Media Links
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="social_media_links"
                      id="social_media_links"
                      value={alumniFields.social_media_links}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          social_media_links: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="social media links"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="certification_link"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Certification Link
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="certification_link"
                      id="certification_link"
                      value={alumniFields.certification_link}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          certification_link: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Certification Link"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2" data-aos="fade-left">
                  <label
                    htmlFor="news-deadline"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Graduation Date
                  </label>
                  <div
                    className="mt-2 cursor-pointer"
                    onClick={() =>
                      // @ts-ignore
                      document.getElementById("news-deadline").showPicker()
                    }
                  >
                    <input
                      type="date"
                      name="news-deadline"
                      id="news-deadline"
                      required
                      value={alumniFields.graduation_year}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          graduation_year: e.target.value,
                        })
                      }
                      className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2" data-aos="fade-right">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Status
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="status"
                      id="status"
                      value={alumniFields.status}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          status: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Status"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2" data-aos="">
                  <label
                    htmlFor="achievements"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Achievements
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="achievements"
                      id="achievements"
                      value={alumniFields.achievements}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          achievements: e.target.value,
                        })
                      }
                      className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                      placeholder="Achievements"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2" data-aos="fade-left">
                  <label
                    htmlFor="institution_id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Alumni Institute
                  </label>
                  <div className="mt-2">
                    <select
                      value={alumniFields.institution_id}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          institution_id: e.target.value,
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
                <div className="sm:col-span-2" data-aos="fade-right">
                  <label
                    htmlFor="institution_id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Alumni Department
                  </label>
                  <div className="mt-2">
                    <select
                      value={alumniFields.institution_id}
                      onChange={(e) =>
                        setAlumniFields({
                          ...alumniFields,
                          institution_id: e.target.value,
                        })
                      }
                      className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                    >
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-6" data-aos="fade-left">
                  <label
                    htmlFor="department-description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Alumni Description
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
              <a
                href="#_"
                className="rounded-2xl px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-red-200 text-indigo-600 text-white bg-red-900"
                onClick={handleDepartmentClear}
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-red-200 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative text-indigo-200 transition duration-300 group-hover:text-black ease ">
                  Clear
                </span>
              </a>

              <a
                href="#_"
                className="rounded-2xl px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-200 text-indigo-600 text-white bg-indigo-600"
                onClick={handleDepartmentSubmit}
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
    </QueryResult>
  );
}
