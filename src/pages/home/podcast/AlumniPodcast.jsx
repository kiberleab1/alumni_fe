import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import { useState } from "react";
import { useQuery } from "react-query";
import { getAllPodcast } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import H1Heading from "src/components/headerHs/header";
const AlumniPodcast = () => {
  const [podList, setPodList] = useState([]);
  console.log(podList[0]);

  const { isError, data, isLoading } = useQuery(
    ["getAllPodcasts"],
    async () => {
      const allNews = await getAllPodcast({ pageNumber: 1, pageSize: 10 });
      setPodList(allNews.data);
      return allNews;
    }
  );
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);
  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="min-h-screen">
        <div className="flex justify-center mt-4 ">
          <H1Heading title={"Playlist"} />
        </div>

        <div className=" flex  space-x-18  flex-wrap gap-4 space-x-8  items-center justify-center text-black  mt-8 mb-8">
          {podList.map((pod) => {
            return (
              <div
                className="flex space-x-36  items-center justify-center text-black  m-1 "
                data-aos="fade-left"
                key={pod.id}
              >
                <div
                  className="flex  max-w-sm rounded-xl m-10 "
                  style={{ boxShadow: "-50px 30px #ebfcf8" }}
                >
                  <div
                    className="max-h-lg  rounded-xl max-w-lg bg-gray-900 p-2 "
                    style={{ boxShadow: "30px -20px #a4b0ad" }}
                  >
                    <iframe
                      height="315"
                      src={pod.url.replace("watch?v=", "embed/")}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      className="rounded-xl min-w-[100%] aspect-auto"
                    ></iframe>
                    <div className="flex flex-col text-left pl-4 text-gray-50 ">
                      <h2 className="title text-xl text-white line-clamp-2">
                        {pod.title}
                      </h2>
                      <p className="text-left over flow scrol mb-2 line-clamp-3">
                        {pod.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </QueryResult>
  );
};

export default AlumniPodcast;
