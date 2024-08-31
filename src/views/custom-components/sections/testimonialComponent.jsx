import { Row, Col, Container, Card, CardBody } from "reactstrap";

import img1 from "../../../assets/images/testimonial/1.jpg";
import img2 from "../../../assets/images/testimonial/2.jpg";
import img3 from "../../../assets/images/testimonial/3.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import H1Heading from "src/components/headerHs/header";
import { MdCloseFullscreen } from "react-icons/md";
const TestimonialComponent = () => {
  const [detailsTestimony, setdetailsTfalseestimony] = useState(false);
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
  const getID = (id) => {
    console.log(id);
    setdetailsTfalseestimony(!detailsTestimony);
  };
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 300,
      easing: "ease-in-out",
      once: false,
    });
  }, []);
  return (
    <div className="relative bg-light max-h-auto py-6" data-aos="zoom-in">
      <div className="">
        <Container>
          <Row className="justify-content-center ">
            <Col md="7" className="w-auto ">
              {/* <h1 className="title text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-sans">
                Testimonial
              </h1> */}
              <H1Heading title={"Testimonial"} />
            </Col>
            <h2 className="title">Check what our Customers are Saying</h2>
          </Row>
        </Container>
      </div>
      {detailsTestimony && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-opacity-70 bg-gray-800"
          data-aos="zoom-in"
        >
          <div className="relative max-w-[60%]    ">
            <div className="overflow-hidden rounded-lg bg-white shadow-md duration-300 p-8">
              <div
                onClick={() => setdetailsTfalseestimony(!detailsTestimony)}
                className="absolute top-0 right-0 ml-auto m-2 rounded-md px-4 py-2 font-bold text-black  duration-75 bg-red w-[10%] flex justify-end"
              >
                <MdCloseFullscreen className="flex  text-end justify-contents-end text-2xl" />
              </div>
              <div className="flex flex-row text-center space-x-4">
                <img
                  src={img1}
                  alt=""
                  className="w-[100px] h-[100px] rounded-[50%]"
                />
                <div className="flex flex-col">
                  <h1 className=" text-2xl font-bold text-gray-500">
                    Eyob Addisu
                  </h1>
                  <h5 className=" text-2xl text-gray-500">
                    Software engineer{" "}
                  </h5>
                </div>
              </div>
              <p className="  text-sm text-gray-500  text-start pt-4 ">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words, consectetur, from a Lorem
                Ipsum passage, and going through the cites of the word in
                classical literature, discovered the undoubtable source. Lorem
                Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
                Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                written in 45 BC. This book is a treatise on the theory of
                ethics, very popular during the Renaissance. The first line of
                Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line
                in section 1.10.32. Contrary to popular belief, Lorem Ipsum is
                not simply random text. It has roots in a piece of classical
                Latin literature from 45 BC, making it over 2000 years old.
                Richard McClintock, a Latin professor at Hampden-Sydney College
                in Virginia, looked up one of the more obscure Latin words,
                consectetur, from a Lorem Ipsum passage, and going through the
                cites of the word in classical literature, discovered the
                undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
                1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good
                and Evil) by Cicero, written in 45 BC. This book is a treatise
                on the theory of ethics, very popular during the Renaissance.
                The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                comes from a line in section 1.10.32.
              </p>
            </div>
          </div>
        </div>
      )}

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
                <Card
                  className="card-shadow transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full m-2"
                  onClick={() => getID(testimonial.id)}
                >
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
