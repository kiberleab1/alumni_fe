// TODO

import { useQuery } from "react-query";
import { getImageBaseUrl, getWebContentByComonent } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import SectionHolderComponent from "src/views/custom-components/sections/SectionHeaderComponent";
import { GalleryComponent } from "./GalleryComponent";
import { useState } from "react";
function GalleryPage() {
  const [gallery, setGallery] = useState({
    header: "",
    subheader: "",
    imagesList: [],
  });
  const { isError, data, isLoading } = useQuery(["gallery"], async () => {
    const data = await getWebContentByComonent({ component: "gallery" });
    const imgArray = [];
    data.data.map((img) => {
      img.image.map((link) => {
        imgArray.push(getImageBaseUrl(link));
      });
    });
    setGallery({
      header: data.data[0].title,
      subheader: data.data[0].description,
      imagesList: imgArray,
    });

    return data;
  });
  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col gap-y-4">
        <SectionHolderComponent
          title={gallery.header}
          body={gallery.subheader}
        />
        <GalleryComponent imagesArray={gallery.imagesList} />
      </div>
    </QueryResult>
  );
}

export default GalleryPage;
