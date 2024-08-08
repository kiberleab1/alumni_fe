import { Row, Col, Container, Card } from "reactstrap";
import "./style/style.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ContentCatalogComponent = ({ newsArray }) => {
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
      <div className="blog-home2 spacer">
        <Container>
          <Row className="m-t-0 justify-content-center">
            <Slider {...settings}>
              {newsArray.map((news, idx) => (
                <Col
                  lg="4"
                  md="6"
                  key={idx}
                  className="card-spacing"
                  data-aos="fade-up"
                >
                  <Card className="relative overflow-hidden shadow-lg rounded-lg ">
                    {" "}
                    <a
                      href={news.link}
                      className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 "
                    >
                      <img
                        className="card-img-top object-cover "
                        style={{ width: "100%", height: "200px" }}
                        src={news.thumbnails}
                        alt="news-thumbnail"
                      />
                    </a>
                    <div className="date-pos bg-info-gradiant">
                      {news.date.toLocaleString("default", { month: "short" })}
                      <span>{news.date.getDate()}</span>
                    </div>
                    <div
                      className="text-content text-center flex flex-col justify-items-center justify-center p-2  relative"
                      data-aos="fade-up"
                      style={{ height: "200px" }}
                    >
                      <div className="overlay"></div>
                      <h5 className="font-small flex justify-center flex-col ">
                        <a className="link text-end  text-themecolor">
                          {news?.avenue ? news.avenue : ""}
                        </a>
                      </h5>
                      <h6 className="text-start p-2 flex justify-center flex-col">
                        <a href={news.link} className="link text-xl">
                          {news.header}
                        </a>
                      </h6>
                      <div
                        dangerouslySetInnerHTML={{ __html: news.details }}
                        className="font-medium text-start flex justify-center flex-col p-2"
                      ></div>
                      <a
                        href={news.link}
                        className="linking text-themecolor mt-10 pb-4"
                      >
                        See More <i className="ti-arrow-right"></i>
                      </a>
                    </div>
                  </Card>
                </Col>
              ))}
            </Slider>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ContentCatalogComponent;
