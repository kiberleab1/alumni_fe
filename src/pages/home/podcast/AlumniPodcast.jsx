import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import { useState } from "react";
import { useQuery } from "react-query";
import { getAllPodcast } from "src/api";
import QueryResult from "src/components/utils/queryResults";
// const podcastList = [
//   {
//     topic: "Monetization - Episode 2",
//     discription:
//       " Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML.",
//   },
//   {
//     topic: "Monetization - Episode 2",
//     discription:
//       " Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML.",
//   },
//   {
//     topic: "Monetization - Episode 2",
//     discription:
//       " Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML.",
//   },
//   {
//     topic: "Monetization - Episode 2",
//     description:
//       " Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML.",
//   },
// ];
const AlumniPodcast = () => {
  const [podList, setPodList] = useState([]);
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
          <h1 className="title font-sans"> playlist</h1>
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
                  style={{ boxShadow: "-50px 30px #ebf0f0" }}
                >
                  <div
                    className="max-h-lg  rounded-xl max-w-lg bg-gray-900 p-2"
                    style={{ boxShadow: "60px -40px #7c7d7c " }}
                  >
                    <iframe
                      // width="500"
                      height="315"
                      src={pod.url.replace("watch?v=", "embed/")}
                      title="YouTube video player"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen="true"
                      className="rounded-xl min-w-[100%]"
                    ></iframe>
                    <div className="flex flex-col text-left pl-4 text-gray-50 ">
                      <h2 className="title text-xl text-white">{pod.title}</h2>
                      <p className="text-left over flow scroll ">
                        {pod.description}
                      </p>
                    </div>
                    <a href="https://www.youtube-nocookie.com/embed/4j7Fa2PCMow?si=HKvw1aIpqyJQwVb1"></a>
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
