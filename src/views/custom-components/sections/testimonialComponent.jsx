import { Row, Col, Container, Card, CardBody } from "reactstrap";

import img1 from "../../../assets/images/testimonial/1.jpg";
import img2 from "../../../assets/images/testimonial/2.jpg";
import img3 from "../../../assets/images/testimonial/3.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
const TestimonialComponent = () => {
  const testimonialData = [
    {
      id: 1,
      text: "“Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras venenatis vel velit vestibulum.”",
      name: "Michelle Anderson",
      image: img1,
    },
    {
      id: 2,
      text: "“Phasellus scelerisque neque et libero volutpat, nec iaculis justo fringilla. Integer nec nisi lorem.”",
      name: "John Doe",
      image: img2,
    },
    {
      id: 3,
      text: "“Donec sit amet mauris nec augue eleifend vulputate. Aliquam erat volutpat.”",
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
    <div>
      <div className="spacer">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h1 className="title text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]">
                Testimonial{" "}
              </h1>
              <h6 className="subtitle">
                Here you can check Demos we created based on WrapKit. Its quite
                easy to Create your own dream website &amp; dashboard in
                No-time.
              </h6>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="testimonial3 spacer bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h2 className="title">Check what our Customers are Saying</h2>
              <h6 className="subtitle">
                You can relay on our amazing features list and also our customer
                services will be great experience for you without doubt and in
                no-time
              </h6>
            </Col>
          </Row>
          <Row className="testi3 m-t-40 justify-content-center">
            {testimonialData.map((testimonial) => (
              <Col
                lg="4"
                md="6"
                key={testimonial.id}
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <Card className="card-shadow transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full">
                  <CardBody className="flex flex-col justify-between h-full">
                    <h6 className="font-light m-b-30 text-base h-20 overflow-hidden">
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
