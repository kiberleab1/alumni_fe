import { TECarousel, TECarouselItem } from "tw-elements-react";

function SlideShowComponent({
  images,
  header,
  subHeader,
  sliderControl = false,
}) {
  return (
    <div className="bg-fuchsia-600 min-w-full h-full">
      <TECarousel
        showControls={sliderControl}
        showIndicators
        ride="carousel"
        className="max-h-full h-full"
      >
        <div className="w-full h-full after:clear-both after:block after:content-['']">
          {images.map((img, idx) => {
            return (
              <TECarouselItem
                itemID={idx}
                key={idx}
                className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[1200ms] ease-in-out motion-reduce:transition-none h-full"
              >
                <div className="relative w-full h-full">
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="Slide image"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-60"></div>
                  <div className="absolute inset-x-0 bottom-5 py-4 text-center text-white md:block">
                    <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 font-bold">
                      {header}
                    </p>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4">
                      {subHeader}
                    </p>
                    {/* <button className="text-xl bg-yellow-500">Read Story</button> */}
                  </div>
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
