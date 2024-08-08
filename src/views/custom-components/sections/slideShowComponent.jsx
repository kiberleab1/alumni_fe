import { TECarousel, TECarouselItem } from "tw-elements-react";

function SlideShowComponent({
  images,
  header,
  subHeader,
  sliderControl = false,
}) {
  return (
    <div className="bg-fuchsia-600  min-w-full  h-full ">
      <TECarousel
        showControls={sliderControl}
        showIndicators
        ride="carousel"
        className="max-h-full h-full"
      >
        <div className="w-full h-full after:clear-both after:block after:content-[''] ">
          {images.map((img, idx) => {
            return (
              <TECarouselItem
                itemID={idx}
                key={idx}
                className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[1200ms] ease-in-out motion-reduce:transition-none h-full"
              >
                <img src={img} className="w-full h-full" alt="..." />
                <div className="absolute inset-x-[15%] bottom-5 hidden  py-12 text-center text-white md:block">
                  <p className="text-6xl mb-4 font-bold">{header}</p>
                  <p className="text-3xl mb-4">{subHeader}</p>
                  {/* <button className="text-xl bg-yellow-500">Read Story</button> */}
                </div>
              </TECarouselItem>
            );
          })}
        </div>
      </TECarousel>
    </div>
  );
}

export default SlideShowComponent;
