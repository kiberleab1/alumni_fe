import React, { useState } from "react";
import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createEvents, createNews, getInstitutes } from "src/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreateEvents() {
  const [institutions, setInstitutions] = useState([]);
  const [eventsLevel, setEventsLevel] = useState(["High", "Medium", "Low"]);
  const [VisibilityType] = useState(["All Alumni", "My alumni"]);

  const [eventFormData, setEventFormData] = useState({
    ownerAdminId: "129ewrd-32323-323",
    ownerInstituteId: "",
    title: "",
    description: "",
    level: "",
    visibility: "",
    venue: "",
    deadline: "",
    time: "",
    image: null,
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

          eventFormData.ownerInstituteId = instituteData.data.institute[0].id;
          setInstitutions(instituteNames);
        }
      } catch (error) {
        console.error(error);
      }
    }
  );

  const handleImageChange = (e) => {
    setEventFormData({ ...eventFormData, image: e.target.files[0] });
  };

  const handleSaveEventClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("ownerAdminId", eventFormData.ownerAdminId);
    formData.append("ownerInstituteId", eventFormData.ownerInstituteId);
    formData.append("title", eventFormData.title);
    formData.append("venue", eventFormData.venue);
    formData.append("visibility", eventFormData.visibility);
    formData.append("description", eventFormData.description);
    formData.append("deadline", eventFormData.deadline);
    formData.append("time", eventFormData.time);
    formData.append("level", eventFormData.level);
    if (eventFormData.image) {
      formData.append("image", eventFormData.image);
    }

    try {
      const result = await createEvents(formData);
      toast.success("Event created successfully!");
      console.log("Create event result:", result.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Event");
    }
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pl-10 pr-10 pt-10 md:grid-cols-2">
        <form
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          encType="multipart/form-data"
        >
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Event Information
            </h2>
          </div>
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="news-title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Event Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="news-title"
                    id="news-title"
                    required
                    value={eventFormData.title}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        title: e.target.value,
                      })
                    }
                    placeholder="Event Title"
                    className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="news-venue"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Event Venue
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="news-venue"
                    id="news-venue"
                    required
                    value={eventFormData.venue}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        venue: e.target.value,
                      })
                    }
                    placeholder="Event Venue"
                    className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="news-time"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Event Time
                </label>
                <div
                  className="mt-2 cursor-pointer"
                  onClick={() =>
                    document.getElementById("news-time").showPicker()
                  }
                >
                  <input
                    type="date"
                    name="news-time"
                    id="news-time"
                    required
                    value={eventFormData.time}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        time: e.target.value,
                      })
                    }
                    className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="news-deadline"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Event Deadline
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
                    value={eventFormData.deadline}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        deadline: e.target.value,
                      })
                    }
                    className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="news-image"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Event Image
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    name="news-image"
                    id="news-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="news-level"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Event Level
                </label>
                <div className="mt-2">
                  <select
                    id="news-level"
                    name="news-level"
                    value={eventFormData.level}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        level: e.target.value,
                      })
                    }
                    className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                  >
                    {eventsLevel.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                  <label
                    htmlFor="job-status"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Visibility
                  </label>
                  <div className="mt-2">
                    <select
                      value={eventFormData.visibility}
                      onChange={(e) =>
                        setEventFormData({
                          ...eventFormData,
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
                  htmlFor="news-institute"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Event Publisher Institute
                </label>
                <div className="mt-2">
                  <select
                    id="news-institute"
                    name="news-institute"
                    value={eventFormData.ownerInstituteId}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        ownerInstituteId: e.target.value,
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
                  htmlFor="news-description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Event Detail
                </label>
                <div className="mt-2">
                  <ReactQuill
                    id="news-description"
                    value={eventFormData.description}
                    onChange={(content) =>
                      setEventFormData({
                        ...eventFormData,
                        description: content,
                      })
                    }
                    theme="snow"
                    style={{ height: "400px" }} // Adjust the height as needed
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-100"
              onClick={() =>
                setEventFormData({
                  ownerAdminId: "129ewrd-32323-323",
                  ownerInstituteId: "",
                  title: "",
                  description: "",
                  level: "",
                  venue: "",
                  deadline: "",
                  time: "",
                  image: null,
                })
              }
            >
              Clear
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSaveEventClick}
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
