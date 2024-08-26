import {
  Row,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Button,
} from "reactstrap";
import H1Heading from "src/components/headerHs/header";

const ContactComponent = () => {
  return (
    <div className="min-h-screen">
      <div className=" ">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center w-auto mt-4">
              {/* <h1 className="title font-bold">Contact Form</h1> */}
              <H1Heading title={"Contact form"} />
              {/* <h6 className="subtitle">
                Here you can check Demos we created based on WrapKit. Its quite
                easy to Create your own dream website &amp; dashboard in
                No-time.
              </h6> */}
            </Col>
          </Row>
        </Container>
      </div>
      <div className="spacer contact1">
        <Container>
          <Row>
            <div className="my-8">
              <Row className="m-0 justify-content-center">
                <Col lg="8 ">
                  <div className="contact-box p-r-40 mb-4">
                    <h4 className="title text-black">Quick Contact</h4>
                    <Form>
                      <Row>
                        <Col lg="6">
                          <FormGroup className="m-t-15">
                            <Input type="text" placeholder="name" />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup className="m-t-15">
                            <Input type="text" placeholder="email" />
                          </FormGroup>
                        </Col>
                        <Col lg="12">
                          <FormGroup className="m-t-15">
                            <Input
                              type="textarea"
                              name="text"
                              placeholder="message"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="12">
                          <Button
                            type="submit"
                            className="btn bg-green-800 m-t-20 btn-arrow hover:bg-green-700"
                          >
                            <span>
                              {" "}
                              SUBMIT <i className="ti-arrow-right"></i>
                            </span>
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
                {/* <Col lg="4">
                  <div className="detail-box p-40 bg-info">
                    <h2 className="text-white">Wrappixel Headquarters</h2>
                    <p className="text-white m-t-30 op-8">
                      251 546 9442
                      <br /> info@wrappixel.com
                    </p>
                    <p className="text-white op-8">
                      601 Sherwood Ave.
                      <br /> San Bernandino, CA 92404
                    </p>
                  </div>
                </Col> */}
              </Row>
            </div>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ContactComponent;
