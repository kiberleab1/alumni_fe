import React from "react";
import img from "../../../assets/images/testimonial/4.jpg";
const defaultImage =
  "https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA=";
const NewsDetailPage = () => {
  const news = {
    image: img,
    publishDate: "August 18, 2024",
    title: "The Future of Web Development: Embracing the Power of Tailwind CSS",
    publishedBy: "Your Publisher",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a turpis sit amet enim aliquam suscipit at vel dolor. Proin id leo quis est viverra placerat. Nullam et ultrices nunc. Quisque rhoncus purus id nibh aliquam posuere. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae arcu fermentum, luctus eros ut, porta metus. Proin aliquam facilisis lacus sit amet rhoncus. Maecenas vel lacus metus. Nam eu suscipit lacus. Phasellus id justo et mi luctus luctus ac varius erat. Ut sodales, augue non tristique tempor, nisi mi iaculis augue, vel fringilla dolor mauris quis ligula. Duis facilisis dignissim felis, nec iaculis massa euismod eget. Sed hendrerit rhoncus ligula, vel porta est dictum ut. Fusce dictum laoreet tincidunt. Mauris a luctus purus. Maecenas ornare luctus quam at lobortis. Quisque bibendum, justo non consequat aliquam, leo lacus bibendum odio, eget efficitur erat sapien vitae lorem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas est tortor, pretium a urna non, ullamcorper porttitor massa. Etiam nisl turpis, consequat at auctor id, commodo sed arcu. Suspendisse potenti. Ut eros elit, malesuada eget eros ac, ultrices feugiat tellus. Proin ac varius eros. Pellentesque hendrerit dolor eu ipsum bibendum, non tincidunt lectus rhoncus. Fusce scelerisque mauris in nisi placerat, ac sodales nisl vestibulum. Ut convallis condimentum mauris et tincidunt. Nullam sem nulla, finibus ac varius non, varius gravida libero. Donec eu bibendum sem. Ut euismod felis metus. Aliquam sit amet elit ipsum. Integer pellentesque fermentum ullamcorper. Integer iaculis augue nisl, ut finibus dui scelerisque aliquam. Etiam non pretium sem. Quisque ut libero risus. Vivamus libero eros, ultrices quis pulvinar vel, posuere in metus. Nulla sodales nunc nec ante dapibus, quis finibus enim cursus. Curabitur egestas arcu eget eros iaculis rhoncus. Donec tincidunt, dui sed egestas tincidunt, turpis quam posuere nisl, sed vestibulum purus neque ut dolor. Sed quis tristique orci. In faucibus pellentesque cursus. Cras vitae elit non dui egestas maximus ultricies et mi. Aliquam interdum efficitur enim rhoncus dignissim. Sed quis ultricies augue. Ut varius efficitur fermentum. Maecenas id mollis est. Quisque vestibulum maximus justo, vel tempor velit vestibulum pellentesque. Sed scelerisque congue lorem ac pretium. Integer eu ultrices lacus. Aenean vel nibh sed nulla semper viverra. Nunc risus massa, ultrices ac magna eget, euismod sagittis tellus. Nunc quis porta magna. Curabitur id libero non dolor varius consectetur accumsan lacinia diam. Pellentesque bibendum hendrerit metus ac laoreet. Pellentesque in faucibus nulla. Morbi eu mauris scelerisque, aliquam nibh non, elementum erat. Proin nisl nibh, sodales malesuada convallis a, pulvinar auctor lectus. Nunc nec consequat erat. Etiam vel suscipit velit, vitae dapibus nunc. Etiam condimentum mauris sed egestas vestibulum. Integer id felis sed purus ornare auctor eget vel odio. Vestibulum porta sapien nulla, ac molestie sem lobortis ac. Donec ac sagittis massa. Morbi dolor magna, faucibus ac odio eget, ornare fermentum tortor. Nunc nisi quam, convallis non euismod at, ornare sed nisl. Maecenas enim tellus, faucibus et commodo ut, fermentum eu ligula. Nam laoreet lacus vitae quam faucibus, non tempor magna accumsan. Mauris orci ante, rhoncus et mollis ut, sollicitudin eu tellus. Etiam semper, mauris sed vehicula facilisis, lacus magna venenatis quam, nec efficitur nisi purus non nulla. Morbi tincidunt efficitur eros quis viverra. In hac habitasse platea dictumst. Nam sit amet convallis mi, vitae condimentum orci. Morbi ultrices felis massa, vitae venenatis lacus efficitur sed. Fusce malesuada blandit egestas. Proin fermentum, orci quis tincidunt mattis, augue orci pellentesque neque, in volutpat elit magna ac justo. ",
  };
  return (
    <div className="flex justify-center py-8">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex flex-col items-start">
          {/* <img
            src={news.image}
            alt="News"
            className="rounded-lg object-cover object-center w-full h-full md:h-auto md:max-h-100"
          /> */}
          <div className="w-full h-[500px]  ">
            <img
              src={news.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 w-full">
            <h1 className="text-4xl text-black font-bold mt-2 text-justify">
              {news.title}
            </h1>
            <p className="text-gray-500 text-justify mt-4 text-lg">
              {news.publishDate} - {news.publishedBy}
            </p>
            <p className="mt-4 text-justify font-serif text-lg text-gray-500">
              {news.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NewsDetailPage;
