// TODO

import SectionHolderComponent from "src/views/custom-components/sections/SectionHeaderComponent";
import { GalleryComponent } from "./GalleryComponent";
const sectionContent = {
  title: "Gallery",
  body: `Here you can check Demos we created based on WrapKit. Its quite
             easy to Create your own dream website &amp; dashboard in No-time`,
};
function GalleryPage() {
  const imageArray = [
    "https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp",
    "https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(74).webp",
    "https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(75).webp",
    "https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(76).webp",
    "https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(77).webp",
    "https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(78).webp",
    "https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(79).webp",
    "https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(76).webp",
    "https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(77).webp",
  ];
  return (
    <div className="flex flex-col gap-y-4">
      <SectionHolderComponent
        title={sectionContent.title}
        body={sectionContent.body}
      />
      <GalleryComponent imagesArray={imageArray} />
    </div>
  );
}

export default GalleryPage;
