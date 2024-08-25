import { Row, Col, Container, Card } from "reactstrap";
import "./style/style.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { convertDate } from "src/utils/utils";

const ContentCatalogComponent = ({ newsArray }) => {
  console.log(newsArray);

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-in-out",
      once: false,
    });
  }, []);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div className="blog-home2 spacer min-h-screen m-4 ">
        <div className="flex flex-wrap gap-12 gap-y-3 justify-center ">
          {newsArray.map((news, idx) => (
            <div className="group relative w-full max-w-lg max-h-80 overflow-hidden rounded-lg shadow-lg ">
              <a
                href={news.link}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              >
                {" "}
                <img
                  src={news.thumbnails}
                  alt="Card Image"
                  className="w-full h-full min-h-72 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </a>

              <div className="absolute bottom-0 left-0 w-full p-4 text-white bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-opacity duration-300 ease-in-out">
                <div className="space-y-">
                  <h3 className="text-xl font-semibold text-start text-white">
                    {news.header}
                  </h3>
                  <p className="text-sm transition-opacity duration-500 ease-in-out mt-4 text-start line-clamp-1 truncate">
                    {convertDate(news.date)}
                  </p>
                </div>

                <div className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-32">
                  <div
                    dangerouslySetInnerHTML={{ __html: news.details }}
                    className="text-sm transition-opacity duration-500 ease-in-out mt-4 text-start truncate text-white"
                  ></div>

                  <div className="flex justify-end ">
                    <a
                      href={news.link}
                      className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                    >
                      {" "}
                      <button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-300">
                        Read more
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentCatalogComponent;
