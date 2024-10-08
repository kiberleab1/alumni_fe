import { useState } from "react";
import { useQuery } from "react-query";
import { getImageBaseUrl, getWebContentByComonent } from "src/api";
import QueryResult from "src/components/utils/queryResults";

import ContactComponent from "src/views/custom-components/sections/contactComponent";
import SlideShowComponent from "src/views/custom-components/sections/slideShowComponent";
import TeamComponent from "src/views/custom-components/sections/teamComponent";
import TestimonialComponent from "src/views/custom-components/sections/testimonialComponent";

import LandingEventsPage from "./program/events";
import AboutUsPage from "./aboutus/aboutPage";

function LandingPage() {
  const [slider, setSlider] = useState({
    header: "",
    subheader: "",
    imagesList: [],
  });
  const { isError, data, isLoading } = useQuery(["slideshow"], async () => {
    const data = await getWebContentByComonent({
      component: "slideshow",
      pageNumber: 1,
      pageSize: 1,
    });
    const imgArray = [];
    data.data.map((img) => {
      img.image.map((link) => {
        imgArray.push(getImageBaseUrl(link));
      });
    });
    setSlider({
      header: data?.data[0].title,
      subheader: data?.data[0].description,
      imagesList: imgArray,
    });

    return data;
  });
  {
    {
      console.log(data);
    }
  }
  return (
    <div className="bg-light">
      <QueryResult isError={isError} isLoading={isLoading} data={data}>
        <div className="h-screen -z-10">
          {" "}
          <SlideShowComponent
            images={slider.imagesList}
            header={slider.header}
            subHeader={slider.subheader}
            sliderControl={false}
          />
        </div>{" "}
      </QueryResult>
      <AboutUsPage />
      <LandingEventsPage />
      <TeamComponent />
      <TestimonialComponent />
      <ContactComponent />
      {/* <div className="w-full bg-black h-[80vh]">
      </div> */}
      {/* This can be Profile */}
      {/* <BannerComponent />

<PortfolioComponent />
<FeatureComponent />
<Outlet /> */}
    </div>
  );
}

export default LandingPage;
