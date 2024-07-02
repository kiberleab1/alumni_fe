// TODO

import ContentCatalogComponent from "src/views/custom-components/sections/conentCatalogComponent";
import SectionHolderComponent from "src/views/custom-components/sections/SectionHeaderComponent";

import img1 from "src/assets/images/blog/blog-home/img3.jpg";
import img2 from "src/assets/images/blog/blog-home/img2.jpg";
import img3 from "src/assets/images/blog/blog-home/img1.jpg";

const sectionContent = {
  title: "News",
  body: `Here you can check Demos we created based on WrapKit. Its quite
           easy to Create your own dream website &amp; dashboard in No-time`,
};
const newsArray = [
  {
    header: "Here you can check Demos we created based on WrapKit. ",
    date: new Date(),
    link: "https://localhost.com/rerererer",
    details:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo dolorum provident nam ad iste laudantium libero voluptate culpa molestiae non consequatur officiis, quam minima quidem. Tenetur ipsum quam molestiae aperiam. ",
    thumbnails: img1,
  },
  {
    header: "Here you can check Demos we created based on WrapKit. ",
    date: new Date(),
    link: "https://localhost.com/rerererer",
    details:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo dolorum provident nam ad iste laudantium libero voluptate culpa molestiae non consequatur officiis, quam minima quidem. Tenetur ipsum quam molestiae aperiam. ",
    thumbnails: img2,
  },
  {
    header: "Here you can check Demos we created based on WrapKit. ",
    date: new Date(),
    link: "https://localhost.com/rerererer",
    details:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo dolorum provident nam ad iste laudantium libero voluptate culpa molestiae non consequatur officiis, quam minima quidem. Tenetur ipsum quam molestiae aperiam. ",
    thumbnails: img3,
  },
  {
    header: "Here you can check Demos we created based on WrapKit. ",
    date: new Date(),
    link: "https://localhost.com/rerererer",
    details:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo dolorum provident nam ad iste laudantium libero voluptate culpa molestiae non consequatur officiis, quam minima quidem. Tenetur ipsum quam molestiae aperiam. ",
    thumbnails: img1,
  },
  {
    header: "Here you can check Demos we created based on WrapKit. ",
    date: new Date(),
    link: "https://localhost.com/rerererer",
    details:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo dolorum provident nam ad iste laudantium libero voluptate culpa molestiae non consequatur officiis, quam minima quidem. Tenetur ipsum quam molestiae aperiam. ",
    thumbnails: img1,
  },
];

function NewsPage() {
  return (
    <>
      <SectionHolderComponent
        title={sectionContent.title}
        body={sectionContent.body}
      />
      <ContentCatalogComponent newsArray={newsArray} />
    </>
  );
}

export default NewsPage;
