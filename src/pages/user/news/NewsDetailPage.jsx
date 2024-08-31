import React from "react";
import img from "../../../assets/images/testimonial/4.jpg";
const defaultImage =
  "https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA=";
const NewsDetailPage = ({news}) => {
  console.log(news)

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const deadline = new Date(news.deadline); 
  // @ts-ignore
  const formattedDeadline = deadline.toLocaleDateString('en-US', options);
  return (
    <div className="flex justify-center py-8">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex flex-col items-start">
          {/* <img
            src={news.image}
            alt="News"
            className="rounded-lg object-cover object-center w-full h-full md:h-auto md:max-h-100"
          /> */}
          <div className="w-full h-[500px]  ">
            <img
              src={news.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 w-full">
            <h1 className="text-4xl text-black font-bold mt-2 text-justify">
              {news.title}
            </h1>
            <p className="text-gray-500 text-justify mt-4 text-lg">
              {formattedDeadline} - {news.adminName}
            </p>
            <p className="mt-4 text-justify font-serif text-lg text-gray-500" dangerouslySetInnerHTML={{ __html: news.description || "No Description" }}>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NewsDetailPage;
