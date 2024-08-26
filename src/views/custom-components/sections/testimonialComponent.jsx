import { Row, Col, Container, Card, CardBody } from "reactstrap";

import img1 from "../../../assets/images/testimonial/1.jpg";
import img2 from "../../../assets/images/testimonial/2.jpg";
import img3 from "../../../assets/images/testimonial/3.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import H1Heading from "src/components/headerHs/header";
const TestimonialComponent = () => {
  const testimonialData = [
    {
      id: 1,
      text: "“Kefeta's campus training focused on life skills, work habits, and job search strategies. Eyob, a trainee, says, “I learned to actively search for jobs and strategize my future. This training feels as important as my degree.””",
      name: "Eyob Addisu",
      image: img1,
    },
    {
      id: 2,
      text: "“Kefeta's campus training focused on life skills, work habits, and job search strategies. Eyob, a trainee, says, “I learned to actively search for jobs and strategize my future. This training feels as important as my degree.””",
      name: "Nur Eshete",
      image: img2,
    },
    {
      id: 3,
      text: "“Kefeta's campus training focused on life skills, work habits, and job search strategies. Eyob, a trainee, says, “I learned to actively search for jobs and strategize my future. This training feels as important as my degree.””",
      name: "Jane Smith",
      image: img3,
    },
  ];
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 300,
      easing: "ease-in-out",
      once: false,
    });
  }, []);
  return (
    <div className="bg-light max-h-screen py-6 spacer">
      <div className="">
        <Container>
          <Row className="justify-content-center ">
            <Col md="7" className="w-auto mt-4">
              {/* <h1 className="title text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-sans">
                Testimonial
              </h1> */}
              <H1Heading title={"Testimonial"} />
            </Col>
            <h2 className="title">Check what our Customers are Saying</h2>
          </Row>
        </Container>
      </div>
      <div className="testimonial3 ">
        <Container>
          {/* <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h2 className="title">Check what our Customers are Saying</h2>
              <h6 className="subtitle">
                You can relay on our amazing features list and also our customer
                services will be great experience for you without doubt and in
                no-time
              </h6>
            </Col>
          </Row> */}
          <Row className="testi3 m-t-40 justify-content-center">
            {testimonialData.map((testimonial) => (
              <Col
                lg="4"
                md="6"
                key={testimonial.id}
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <Card className="card-shadow transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full m-2">
                  <CardBody className="flex flex-col justify-between h-full">
                    <h6 className="font-light m-b-30 text-base h-20 overflow-hiddencfont-sans-serif">
                      {testimonial.text}
                    </h6>
                    <div className="d-flex no-block align-items-center">
                      <span className="thumb-img transition-transform duration-300 hover:scale-110">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="circle w-16 h-16 object-cover"
                        />
                      </span>
                      <div className="m-l-20 flex-1">
                        <h6 className="m-b-0 customer text-gray-800 text-lg">
                          {testimonial.name}
                        </h6>
                        <div className="font-10 text-gray-700">
                          <a
                            href="#"
                            className="text-success transition-colors duration-300 hover:text-yellow-500"
                          >
                            <i className="fa fa-star"></i>
                          </a>
                          <a
                            href="#"
                            className="text-success transition-colors duration-300 hover:text-yellow-500"
                          >
                            <i className="fa fa-star"></i>
                          </a>
                          <a
                            href="#"
                            className="text-success transition-colors duration-300 hover:text-yellow-500"
                          >
                            <i className="fa fa-star"></i>
                          </a>
                          <a
                            href="#"
                            className="text-success transition-colors duration-300 hover:text-yellow-500"
                          >
                            <i className="fa fa-star"></i>
                          </a>
                          <a
                            href="#"
                            className="text-muted transition-colors duration-300 hover:text-yellow-300"
                          >
                            <i className="fa fa-star"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default TestimonialComponent;
