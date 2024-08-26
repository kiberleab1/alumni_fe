import { useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createPodcast } from "src/api";
export default function CreatePodcastComp() {
  const [podcastError, setPodcastError] = useState("");
  const [podcastFields, setPodcastFields] = useState({
    name: "",
    description: "",
    url: "",
  });

  const clearPodcastFields = () => {
    setPodcastFields({
      name: "",
      description: "",
      url: "",
    });
  };

  const handlePodcastClear = () => {
    clearPodcastFields();
  };
  const queryClient = useQueryClient();
  const mutation = useMutation(createPodcast, {
    onSuccess: () => {
      queryClient.invalidateQueries("getPodcasts");
    },
  });

  const handlePodcastSubmit = async (e) => {
    console.log({ e });
    e.preventDefault();
    if (
      !podcastFields.name ||
      !podcastFields.description ||
      !podcastFields.url
    ) {
      setPodcastError("Please fill in all required fields!");
      return;
    }
    setPodcastError("");
    mutation.mutate(podcastFields);
    console.log({ podcastFields });
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10 flex flex-col justify-items-center justify-center">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3 justify-center justify-items-center ">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Podcast Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please make sure every input is correct and accurately describes the
            podcast.
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
                podcast Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="podcast-name"
                  id="podcast-name"
                  required
                  value={podcastFields.name}
                  onChange={(e) =>
                    setPodcastFields({
                      ...podcastFields,
                      name: e.target.value,
                    })
                  }
                  autoComplete="Podcast_name"
                  placeholder="Podcast Name"
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
                podcast url
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="podcast-url"
                  id="podcast-url"
                  required
                  value={podcastFields.url}
                  onChange={(e) =>
                    setPodcastFields({
                      ...podcastFields,
                      url: e.target.value,
                    })
                  }
                  autoComplete="Podcast_url"
                  placeholder="Podcast url"
                  className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-6">
            <label
              htmlFor="podcast-description"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              podcast Description
            </label>
            <div className="mt-2">
              <textarea
                id="podcast-description"
                name="podcast-description"
                rows={3}
                required
                value={podcastFields.description}
                onChange={(e) =>
                  setPodcastFields({
                    ...podcastFields,
                    description: e.target.value,
                  })
                }
                className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          {podcastError && (
            <p className="text-red-600 font-mono">{podcastError}</p>
          )}
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-100"
            onClick={handlePodcastClear}
          >
            Clear
          </button>
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handlePodcastSubmit}
          >
            Save
          </button>
        </div>
      </form>

      <div>
        <ToastContainer />
      </div>
    </div>
  );
}
