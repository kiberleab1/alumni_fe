import Paginations from "../components/pagination/pagination";

const Gallery = () => {
  const galleryData = Array.from({ length: 12 }, (_, index) => {
    const imageIndex = index + 1;
    return {
      id: imageIndex,
      image: `../../public/gallery/gallery_${imageIndex}.jpg`,
      title: `Image ${imageIndex}`,
    };
  });

  return (
    <div>
      <h1 className="text-4xl font-bold my-4">Alumni Gallery</h1>
      <div className="flex flex-wrap justify-start">
        {galleryData.map((item) => (
          <div className="w-1/4 p-1" key={item.id}>
            <img src={item.image} alt={item.title} className="w-full" />
            {/* <h3 className="mt-2 text-center text-lg">{item.title}</h3> */}
          </div>
        ))}
      </div>
      <div className="pb-4">
        <Paginations />
      </div>
    </div>
  );
};

export default Gallery;
