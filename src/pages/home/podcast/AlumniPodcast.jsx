import imgs from "../../../assets/images/testimonial/2.jpg";
import "./css.css";

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
  return (
    <div>
      <div className="flex  justify-center mt-4 ">
        <h1 className="title font-sans"> playlist</h1>
      </div>

      <div className=" flex  space-x-18  flex-wrap gap-4 space-x-8  items-center justify-center text-black  mt-8 mb-8">
        {podcastList.map((val, index) => {
          return (
            <div className="flex space-x-36     items-center justify-center text-black  m-1 ">
              <div
                className="flex  max-w-lg rounded-xl m-10 "
                style={{ boxShadow: "-50px 30px #ebf0f0" }}
              >
                <div
                  className="max-h-lg  rounded-xl max-w-lg bg-gray-900 p-2"
                  style={{ boxShadow: "60px -40px #7c7d7c " }}
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
                    <p className="text-left over flow scroll ">
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
  );
};

export default AlumniPodcast;
