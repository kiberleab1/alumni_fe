import { useState } from "react";
import { useQuery } from "react-query";
import { getImageBaseUrl, getWebContentByComonent } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import Mission from "./mission";
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";
function AboutUsPage() {
  const { isError, data, isLoading } = useQuery("aboutUs", async () => {
    return await getWebContentByComonent({ component: "aboutus" });
  });
  console.log(data);

  return (
    <>
      <QueryResult isError={isError} data={data} isLoading={isLoading}>
        {/* <SectionHolderComponent
          title={data?.data[0].title}
          body={data?.data[0].description}
        /> */}
        <AboutUsComponent
          body={data?.data[0]?.description}
          title={data?.data[0]?.title}
          images={data?.data[0]?.image}
        />
        <Mission />
      </QueryResult>
    </>
  );
}

export default AboutUsPage;

function AboutUsComponent({ title, body, images }) {
  const [selectedImage, setSelectedImage] = useState(images ? images[0] : null);

  const selectedIndex = images
    ? images.findIndex((img) => img === selectedImage)
    : -1;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);
  return (
    <div className="relative min-h-screen  flex items-center justify-center bg-blue-100 overflow-hidden                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 0">
      <div className="absolute w-[100%] h-[190%] rounded-[50%] bg-blue-50 right-[-30%] top-[-80%] circular overflow-hidden"></div>
      <div className="container py-12 px-4 sm:px-6 lg:px-8 max-h-full min-w-full">
        <div
          className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 mx-auto "
          data-aos="zoom-in"
        >
          <div
            className="w-full lg:w-6/12 flex flex-col space-y-6 lg:space-y-8  "
            data-aos="fade-up"
          >
            <div className=" w-auto ">
              <h1 className="text-3xl lg:text-4xl  text-green-900 dark:text-white font-sans text-start">
                {title}
                <div className="bg-green-800 h-[4px] w-[35%] mt-2 text-start"></div>
              </h1>
            </div>

            <p className="text-lg text-start text-gray-700 dark:text-gray-300 font-sans-serif max-w-[600px] ">
              {body ||
                "Welcome to [Your Company]. We are dedicated to [your mission statement]. Our journey began in [Year] when [founder's name] decided to [reason for founding]. Since then, we've achieved [mention any achievements or milestones]."}
            </p>
          </div>

          <div className="w-full lg:w-5/12 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-2xl h-80" data-aos="zoom-in">
              <img
                className="w-full h-full object-cover rounded-lg shadow-xl transition-transform duration-500 ease-in-out transform hover:scale-105"
                src={selectedImage ? getImageBaseUrl(selectedImage) : ""}
                alt="Main Display"
              />

              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-40 transition-opacity duration-300"></div>
            </div>

            <div className="w-full mt-8 lg:w-11/12 ">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images?.map((imgLink, index) => (
                  <div
                    className={`relative p-1 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 ${
                      selectedIndex === index ? "ring-4 ring-blue-500" : ""
                    }`}
                    key={imgLink}
                    onClick={() => setSelectedImage(imgLink)}
                  >
                    <img
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                      src={getImageBaseUrl(imgLink)}
                      alt={`Thumbnail ${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
