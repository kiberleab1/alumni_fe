export function GalleryComponent({ imagesArray }) {
  return (
    <div className="container mx-auto px-5 py-2 sm:px-10 md:px-20 lg:px-32 lg:pt-12  min-h-screen">
      <div className="-m-1 flex flex-wrap md:-m-2">
        {imagesArray.map((image, idx) => {
          return (
            <div
              className="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3 flex-wrap"
              key={idx}
            >
              <div className="w-full p-1 md:p-2">
                <img
                  alt="gallery"
                  className="block h-full w-full rounded-lg object-cover object-center"
                  src={image}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
