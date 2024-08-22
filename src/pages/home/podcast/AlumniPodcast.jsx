import { useEffect } from "react";
import imgs from "../../../assets/images/testimonial/2.jpg";

import AOS from "aos";
import "aos/dist/aos.css";
import H1Heading from "src/components/headerHs/header";
const podcastList = [
  {
    topic: "Monetization - Episode 2",
    discription:
      " Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML.",
  },
  {
    topic: "Monetization - Episode 2",
    discription:
      " Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML.",
  },
  {
    topic: "Monetization - Episode 2",
    discription:
      " Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML.",
  },
  {
    topic: "Monetization - Episode 2",
    discription:
      " Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML.",
  },
];
const AlumniPodcast = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);
  return (
    <>
      <div className="min-h-screen">
        <div className="flex justify-center mt-4 ">
          <H1Heading title={"Playlist"} />
        </div>

        <div className=" flex  space-x-18  flex-wrap gap-4 space-x-8  items-center justify-center text-black  mt-8 mb-8">
          {podcastList.map((val, index) => {
            return (
              <div
                className="flex space-x-36  items-center justify-center text-black  m-1 "
                data-aos="fade-left"
              >
                <div
                  className="flex  max-w-sm rounded-xl m-10 "
                  style={{ boxShadow: "-50px 30px #ebfcf8" }}
                >
                  <div
                    className="max-h-lg  rounded-xl max-w-lg bg-gray-900 p-2"
                    style={{ boxShadow: "30px -20px #a4b0ad" }}
                  >
                    <iframe
                      // width="500"
                      height="315"
                      src="https://www.youtube-nocookie.com/embed/4j7Fa2PCMow?si=HKvw1aIpqyJQwVb1"
                      title="YouTube video player"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen="true"
                      className="rounded-xl min-w-[100%]"
                    ></iframe>
                    <div className="flex flex-col text-left pl-4 text-gray-50 ">
                      <h2 className="title text-xl text-white">{val.topic}</h2>
                      <p className="text-left over flow scrol mb-2 ">
                        {val.discription}
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
    </>
  );
};

export default AlumniPodcast;
