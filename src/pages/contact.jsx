import { Container, Row, Col, FormGroup, Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Contact = () => {
  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log(values);
  };

  return (
    <div>
      <Container>
        <Row>
          <h1>Contact Map</h1>
        </Row>
        <Row>
          <Col>
            <h2>Visit Us</h2>
            <p>
              Sheger Plaza, 11th floor, office number 1123.Bole sub city, Addis
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
              email: Yup.string().required("Email is required"),
              message: Yup.string().required("Message is required"),
            })}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form className="flex flex-col items-center">
                <Row>
                  <FormGroup>
                    <Field
                      type="text"
                      name="full_name"
                      placeholder="Full Name"
                      value={formik.values.full_name}
                      className=" form-control"
                    />
                    <ErrorMessage
                      name="full_name"
                      component="div"
                      className="error"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Field
                      type="text"
                      name="phone_number"
                      placeholder="Phone Number"
                      value={formik.values.phone_number}
                      className="form-control"
                    />
                    <ErrorMessage
                      name="phone_number"
                      component="div"
                      className="error"
                    />
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup>
                    <Field
                      type="text"
                      name="email"
                      placeholder="Email"
                      className="form-control"
                      value={formik.values.email}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error"
                    />
                  </FormGroup>

                  <FormGroup>
                    <div>
                      
                    </div>
                    <Field
                      type="textarea"
                      
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
                </Row>
                <Row className="">
                  <Col>
                    <Button type="submit" className="bg-yellow-500 hover:bg-yellow-200 hover:text-black hover:font-semibold">Submit</Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
