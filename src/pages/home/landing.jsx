import { useState } from "react";
import { useQuery } from "react-query";
import { getImageBaseUrl, getWebContentByComonent } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import C2aComponent from "src/views/custom-components/sections/c2aComponent";
import ContactComponent from "src/views/custom-components/sections/contactComponent";
import SlideShowComponent from "src/views/custom-components/sections/slideShowComponent";
import TeamComponent from "src/views/custom-components/sections/teamComponent";
import TestimonialComponent from "src/views/custom-components/sections/testimonialComponent";

function LandingPage() {
  const [slider, setSlider] = useState({
    header: "",
    subheader: "",
    imagesList: [],
  });
  const { isError, data, isLoading } = useQuery(["slideshow"], async () => {
    const data = await getWebContentByComonent({ component: "slideshow" });
    const imgArray = [];
    data.data.map((img) => {
      img.image.map((link) => {
        imgArray.push(getImageBaseUrl(link));
      });
    });
    setSlider({
      header: data.data[0].title,
      subheader: data.data[0].description,
      imagesList: imgArray,
    });

    return data;
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="h-[80svh] -z-10">
        {" "}
        <SlideShowComponent
          images={slider.imagesList}
          header={slider.header}
          subHeader={slider.subheader}
          sliderControl={false}
        />
      </div>{" "}
      <TeamComponent />
      {/* <GalleryComponent img={}/> */}
      <ContactComponent />
      {/* <div className="w-full bg-black h-[80vh]">
      </div> */}
      {/* This can be Profile */}
      {/* <BannerComponent />

<PortfolioComponent />
<FeatureComponent />
<Outlet /> */}
      <TestimonialComponent />
      <C2aComponent />
    </QueryResult>
  );
}

export default LandingPage;
