import { useEffect } from "react";
import { useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTestimonial, updateTestimonial } from "src/api";

export default function CreateTestimonialComp({ item }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testimonyError, setTestimonyError] = useState("");
  const [testimonyFields, setTestimonyFields] = useState({
    full_name: "",
    credentials: "",
    testimony: "",
  });

  useEffect(() => {
    if (item) {
      setTestimonyFields({
        full_name: item.full_name,
        credentials: item.credentials,
        testimony: item.testimony,
      });
      setIsEditing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const clearTestimonyFields = () => {
    setTestimonyFields({
      full_name: "",
      credentials: "",
      testimony: "",
    });
  };

  const handleTestimonyClear = () => {
    clearTestimonyFields();
  };
  const queryClient = useQueryClient();
  const crateMutation = useMutation(createTestimonial, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllTestimonial");
    },
  });
  const updateMutation = useMutation(updateTestimonial, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllTestimonial");
    },
  });

  const handleTestimonySubmit = async (e) => {
    if (isSaving) {
      return;
    }
    setIsSaving(true);
    console.log({ e });

    e.preventDefault();
    if (
      !testimonyFields.full_name ||
      !testimonyFields.credentials ||
      !testimonyFields.testimony
    ) {
      setTestimonyError("Please fill in all required fields!");
      setIsSaving(false);
      return;
    }
    setTestimonyError("");
    if (!isEditing) {
      crateMutation.mutate(testimonyFields);
    } else {
      const data = { id: item.id, ...testimonyFields };
      updateMutation.mutate(data);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10 flex flex-col justify-items-center justify-center">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3 justify-center justify-items-center ">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {isEditing ? "Edit" : "Add"} Testimony Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please make sure every input is correct and accurately describes the
            testimony.
          </p>
        </div>
      </div>

      <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="department-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                testimony Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="testimony-name"
                  id="testimony-name"
                  required
                  value={testimonyFields.full_name}
                  onChange={(e) =>
                    setTestimonyFields({
                      ...testimonyFields,
                      full_name: e.target.value,
                    })
                  }
                  autoComplete="Testimony_name"
                  placeholder="Testimony Name"
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
            </div>
          </div>
          <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="department-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                testimony url
              </label>
              <div className="mt-2">
                <textarea
                  rows={5}
                  name="testimony-url"
                  id="testimony-url"
                  required
                  value={testimonyFields.testimony}
                  onChange={(e) =>
                    setTestimonyFields({
                      ...testimonyFields,
                      testimony: e.target.value,
                    })
                  }
                  autoComplete="Testimony_url"
                  placeholder="Testimony url"
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-6">
            <label
              htmlFor="testimony-description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              testimony Description
            </label>
            <div className="mt-2">
              <textarea
                id="testimony-description"
                name="testimony-description"
                rows={3}
                required
                value={testimonyFields.credentials}
                onChange={(e) =>
                  setTestimonyFields({
                    ...testimonyFields,
                    credentials: e.target.value,
                  })
                }
                className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          {testimonyError && (
            <p className="text-red-600 font-mono">{testimonyError}</p>
          )}
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-100"
            onClick={handleTestimonyClear}
          >
            Clear
          </button>
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleTestimonySubmit}
          >
            {isSaving ? "..." : "Save"}
          </button>
        </div>
      </form>

      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
