import { Container, Row, Col, FormGroup, Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Contact = () => {
  const handleSubmit = (values, { setSubmitting }) => {
    // Handle form submission logic here, e.g., sending data to server
    console.log(values);
    // After handling submission, you can optionally set submitting state
    setSubmitting(false);
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1>Contact Map</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Visit Us</h2>
            <p>
              Sheger Plaza, 11th floor, office number 1123. Bole sub city, Addis
              Ababa
            </p>
            <p>Monday to Friday: 9am - 5pm</p>
            <a href="#">Get Directions</a>
          </Col>
          <Col>
            <h2>Get in touch</h2>
            <p>Tel: +251 123 456 789</p>
            <p>Email: info@ethalumini.com</p>
            <p>ethalumini.et</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>We would love to hear from you</h1>
            <Formik
              initialValues={{
                full_name: "",
                phone_number: "",
                email: "",
                message: "",
              }}
              validationSchema={Yup.object({
                full_name: Yup.string().required("Full name is required"),
                phone_number: Yup.string().required("Phone number is required"),
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Email is required"),
                message: Yup.string().required("Message is required"),
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Field
                          type="text"
                          name="full_name"
                          placeholder="Full Name"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="full_name"
                          component="div"
                          className="error"
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Field
                          type="text"
                          name="phone_number"
                          placeholder="Phone Number"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="phone_number"
                          component="div"
                          className="error"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error"
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Field
                          as="textarea"
                          name="message"
                          placeholder="Message"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="message"
                          component="div"
                          className="error"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-yellow-500 hover:bg-yellow-200 hover:text-black hover:font-semibold"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
