import { GiFlagObjective } from "react-icons/gi";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import "./style/story.css";
import img1 from "src/assets/images/features/feature13/img1.jpg";
import img2 from "src/assets/images/features/feature13/img2.jpg";
import img3 from "src/assets/images/features/feature13/img3.jpg";
import img4 from "src/assets/images/features/feature13/img4.jpg";

const FeatureComponent = () => {
  return (
    <div>
      <div className="min-h-screen  bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col className="text-center">
              <h1 className="title font-bold">Trending Stories</h1>
              {/* <h6 className="subtitle">
                Here you can check Demos we created based on WrapKit. Its quite
                easy to Create your own dream website &amp; dashboard in
                No-time.
              </h6> */}
            </Col>
          </Row>
        </Container>
        <div className="flex flex-wrap items-center justify-center text-black">
          <div className="blog-slider">
            <div className="blog-slider__wrp swiper-wrapper">
              <div className="blog-slider__item swiper-slide">
                <div className="blog-slider__img">
                  <img src={img1} alt="" />
                </div>
                <div className="__content">
                  <span className="blog-slider__code">26 December 2019</span>
                  <div className="blog-slider__title">Lorem Ipsum Dolor</div>
                  <div className="blog-slider__text">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Recusandae voluptate repellendus magni illo ea animi?
                  </div>
                  <a href="#" className="blog-slider__button">
                    READ MORE
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="blog-slider">
            <div className="blog-slider__wrp swiper-wrapper">
              <div className="blog-slider__item swiper-slide">
                <div className="blog-slider__img">
                  <img src={img1} alt="" />
                </div>
                <div className="__content">
                  <span className="blog-slider__code">26 December 2019</span>
                  <div className="blog-slider__title">Lorem Ipsum Dolor</div>
                  <div className="blog-slider__text">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Recusandae voluptate repellendus magni illo ea animi?
                  </div>
                  <a href="#" className="blog-slider__button">
                    READ MORE
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="relative flex   md:items-start min-h-[300px] bg-red-800 rounded-xl max-w-md md:max-w-2xl  "> */}

      {/* <div className="absolute w-[250px] h-full md:relative h-24 md:flex-block top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2  md:left-[-0px] md:top-1/2 md:translate-y-[60%]  ">
            <img src={img1} className="object-cover rounded-xl " />
          </div> */}
      {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4  ">
            <img src={img1} />
          </div> */}
      {/* <div className="  flex flex-col ml-[-130px] w-[80%] md:justify- text-start  text-white  bg-yellow-900 items-start">
            <h2 className="text-xl font-bold text-white ">Alumni Podcast</h2>
            <h5 className="subtitle mb-3">phd</h5>
            <p className="text-gray-50">
              This is some descriptive text that goes next to the image. The
              text will remain inline and will not overlap with the image.
            </p>
          </div> */}
      {/* </div> */}
      {/* <div className="relative flex md:flex  lg:items-start min-h-[300px] bg-gray-800 rounded-xl max-w-md md:max-w-2xl  ">
          <div className="md:shrink-0 m-auto md:bg-red-500">
            <img
              src={img1}
              className="object-cover absolute h-full left-[-70px] top-1/2 transform -translate-y-1/2 h-[150px] lg:h-[200px] w-[150px] lg:w-[200px] rounded-xl bg-red-400 lg:mb-4 mb-4"
            />
          </div>

          <div className=" w-[80%] text-start p-3 mt-4 text-white ">
            <h2 className="text-xl font-bold text-white ">Alumni Podcast</h2>
            <h5 className="subtitle mb-3">phd</h5>
            <p className="text-gray-50">
              This is some descriptive text that goes next to the image. The
              text will remain inline and will not overlap with the image.
            </p>
          </div>
        </div> */}
      {/* </div> */}

      {/* <div className="spacer feature4">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h2 className="title text-2xl">
                Awesome with Extra Ordinary Flexibility
              </h2>
              <h6 className="subtitle">
                You can relay on our amazing features list and also our customer
                services will be great experience for you without doubt and in
                no-time
              </h6>
            </Col>
          </Row>
          <Row className="m-t-40">
            <Col md="6" className="wrap-feature4-box">
              <Card>
                <CardBody>
                  <div className="icon-round bg-light-info">
                    <i className="fa fa-star"></i>
                  </div>
                  <h5 className="font-medium">Instant Solutions</h5>
                  <p className="m-t-20">
                    You can relay on our amazing features list and also our
                    customer services will be great experience. Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit. Praesent
                    tristique pellentesque ipsum.
                  </p>
                  <a href="#" className="linking text-themecolor">
                    Explore More<i className="ti-arrow-right"></i>
                  </a>
                </CardBody>
              </Card>
            </Col>
            <Col md="6" className="wrap-feature4-box">
              <Card>
                <CardBody>
                  <div className="icon-round bg-light-info">
                    <i className="fa fa-check-circle"></i>
                  </div>
                  <h5 className="font-medium">Powerful Techniques </h5>
                  <p className="m-t-20">
                    You can relay on our amazing features list and also our
                    dolor sit amet, consectetur adipiscing elit. Praesent
                    tristique pellentesque ipsum.{" "}
                  </p>
                  <a className="linking text-themecolor" href="#">
                    Explore More <i className="ti-arrow-right"></i>
                  </a>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="bg-light spacer feature20 up">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h2 className="title">Awesome with Extra Ordinary Flexibility</h2>
              <h6 className="subtitle">
                You can relay on our amazing features list and also our customer
                services will be great experience for you without doubt and in
                no-time
              </h6>
            </Col>
          </Row>
          <Row className="wrap-feature-20">
            <Col lg="6">
              <Card>
                <Row>
                  <Col md="8">
                    <CardBody className="d-flex no-block">
                      <div className="m-r-20">
                        <img
                          src={img1}
                          width="70"
                          className="rounded"
                          alt="img"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">
                          Make your website in no-time with us.
                        </h5>
                      </div>
                    </CardBody>
                  </Col>
                  <Col md="4" className="text-center">
                    <a
                      href="#"
                      className="text-white linking bg-success-gradiant"
                    >
                      Lets Talk <i className="ti-arrow-right"></i>
                    </a>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <Row>
                  <Col md="8">
                    <CardBody className="d-flex no-block">
                      <div className="m-r-20">
                        <img
                          src={img2}
                          width="70"
                          className="rounded"
                          alt="img"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">
                          Make your website in no-time with us.
                        </h5>
                      </div>
                    </CardBody>
                  </Col>
                  <Col md="4" className="text-center">
                    <a
                      href="#"
                      className="text-white linking bg-success-gradiant"
                    >
                      Lets Talk <i className="ti-arrow-right"></i>
                    </a>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <Row>
                  <Col md="8">
                    <CardBody className="d-flex no-block">
                      <div className="m-r-20">
                        <img
                          src={img3}
                          width="70"
                          className="rounded"
                          alt="img"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">
                          Make your website in no-time with us.
                        </h5>
                      </div>
                    </CardBody>
                  </Col>
                  <Col md="4" className="text-center">
                    <a
                      href="#"
                      className="text-white linking bg-success-gradiant"
                    >
                      Lets Talk <i className="ti-arrow-right"></i>
                    </a>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <Row>
                  <Col md="8">
                    <CardBody className="d-flex no-block">
                      <div className="m-r-20">
                        <img
                          src={img4}
                          width="70"
                          className="rounded"
                          alt="img"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">
                          Make your website in no-time with us.
                        </h5>
                      </div>
                    </CardBody>
                  </Col>
                  <Col md="4" className="text-center">
                    <a
                      href="#"
                      className="text-white linking bg-success-gradiant"
                    >
                      Lets Talk <i className="ti-arrow-right"></i>
                    </a>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </div> */}
    </div>
  );
};

export default FeatureComponent;
