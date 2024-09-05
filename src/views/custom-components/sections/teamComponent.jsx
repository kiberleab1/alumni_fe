import { useEffect } from "react";
import { FaFacebook, FaLinkedin, FaTelegram, FaTwitter } from "react-icons/fa";
import { useQuery } from "react-query";
import Slider from "react-slick";
import { Col, Container, Row } from "reactstrap";
import { getAllStaff, getImageBaseUrl } from "src/api";
import QueryResult from "src/components/utils/queryResults";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./style/team.css";
import AOS from "aos";
import "aos/dist/aos.css";
import H1Heading from "src/components/headerHs/header";
const TeamComponent = () => {
  const { isLoading, data, isError } = useQuery("team", async () => {
    return await getAllStaff({ pageNumber: 1, pageSize: 4 });
  });
  console.log(data);

  const parseData = (data) =>
    data.split(", ").reduce((acc, item) => {
      const [key, value] = item.split(":");
      acc[key] = value;
      return acc;
    }, {});
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 250,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <QueryResult isLoading={isLoading} isError={isError} data={data}>
        <div className="bg-blue-50">
          <div className=" justify-content-center">
            <Container>
              <Row className="justify-content-center">
                <Col md="7" className="text-center mt-3  w-auto">
                  {/* <div className="text-center py-8 px-4 lg:px-32 w-auto"> */}
                  {/* <h1 className="title font-small text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans">
                      Meet the Team
                    </h1> */}
                  <H1Heading title={"Meet the Team"} />
                  {/* <h3 className="title font-sm text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-4 font-sans-serif">
                    Experienced & Professional Team
                  </h3> */}
                  {/* <h6 className="subtitle text-base sm:text-lg md:text-xl lg:text-2xl mt-4 font-sans-serif">
                    You can rely on our amazing features list and also our
                    customer services will be a great experience for you without
                    doubt and in no time
                  </h6> */}
                  {/* </div> */}

                  {/* <h6 className="subtitle">
                  Here you can check Demos we created based on . Its quite easy
                  to Create your own dream
                </h6> */}
                </Col>
              </Row>
            </Container>
          </div>

          <div className="mt-4 mb-4 team2 ">
            <Container>
              <Row className="justify-content-center">
                <Col md="7" className="text-center">
                  {/* Optionally, place your heading or intro text here */}
                </Col>
              </Row>
              <Row>
                <Col className="p-4" data-aos="fade-up">
                  <Slider {...settings} className="flex flex-wrap">
                    {data?.data?.staff.map((staff, index) => {
                      const contactInfo = parseData(staff.contact_info);
                      return (
                        <div
                          className="p-2 w-full"
                          key={staff.id}
                          data-aos="fade-up"
                        >
                          <div className="block rounded-lg bg-slate-100 shadow-lg dark:bg-surface-dark">
                            {/* <a href="/landing/program/profile"> */}
                            <a
                              href={staff.link}
                              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                            >
                              <img
                                className="rounded-t-lg w-full object-cover h-48 transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                                src={getImageBaseUrl(staff.photo)}
                                alt={staff.title}
                                data-aos="zoom-in"
                              />
                            </a>
                            <div className="p-6 text-surface dark:text-white flex flex-col justify-center items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-95 hover:bg-gray-300 duration-300">
                              <h5 className="mb-2 text-xl font-medium leading-tight text-center font-sans">
                                {staff.title}
                              </h5>
                              <p className="mb-4 text-base text-center font-sans-serif line-clamp-4">
                                {staff.description}
                              </p>
                              <ul className="list-inline flex justify-center space-x-4">
                                <li className="list-inline-item">
                                  <a
                                    href={contactInfo.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaFacebook className="text-blue-600" />
                                  </a>
                                </li>
                                <li className="list-inline-item">
                                  <a
                                    href={contactInfo.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaTwitter className="text-blue-400" />
                                  </a>
                                </li>
                                <li className="list-inline-item">
                                  <a
                                    href={contactInfo.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaLinkedin className="text-blue-700" />
                                  </a>
                                </li>
                                <li className="list-inline-item">
                                  <a
                                    href={contactInfo.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaTelegram className="text-blue-500" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </QueryResult>
    </div>
  );
};

export default TeamComponent;
