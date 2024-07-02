export function GalleryComponent({ imagesArray }) {
  return (
    <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
      <div className="-m-1 flex flex-wrap md:-m-2">
        {imagesArray.map((image, idx) => {
          return (
            <div className="flex w-1/3 flex-wrap" key={idx}>
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
