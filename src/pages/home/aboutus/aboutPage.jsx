import { useQuery } from "react-query";
import { getImageBaseUrl, getWebContentByComonent } from "src/api";
import QueryResult from "src/components/utils/queryResults";

function AboutUsPage() {
  const { isError, data, isLoading } = useQuery("aboutUs", async () => {
    return await getWebContentByComonent({ component: "aboutus" });
  });

  return (
    <>
      <QueryResult isError={isError} data={data} isLoading={isLoading}>
        {/* <SectionHolderComponent
          title={data?.data[0].title}
          body={data?.data[0].description}
        /> */}
        <AboutUsComponent
          body={data?.data[0].description}
          title={data?.data[0].title}
          images={data?.data[0].image}
        />
      </QueryResult>
    </>
  );
}

export default AboutUsPage;

function AboutUsComponent({ title, body, images }) {
  return (
    <>
      <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4 ">
        <div className="flex flex-col lg:flex-row justify-between gap-8 min-h-full">
          <div className="w-full lg:w-6/12 flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 dark:text-white pb-4">
              About Us
            </h1>
            <p className="font-normal text-base leading-6 text-gray-600 dark:text-white">
              {title}
            </p>
            <p className="font-normal text-base leading-6 text-gray-600 dark:text-white">
              {body}
            </p>
          </div>
          <div className="w-full lg:w-6/12 flex flex-col justify-center">
            <img
              className="w-full h-1/2"
              src={getImageBaseUrl(images[0])}
              alt="A group of People"
            />
            <div className="w-full lg:pt-8 flex-1">
              <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
                {images.map((imgLink) => {
                  return (
                    <div
                      className="p-4 pb-6 flex justify-center flex-col items-center"
                      key={imgLink}
                    >
                      <img
                        className="md:block hidden"
                        src={getImageBaseUrl(imgLink)}
                        alt="Alexa featured Image"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
