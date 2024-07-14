import { Form, Formik } from "formik";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  Button,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { login } from "src/api";
import * as Yup from "yup";

export default function LoginPage() {
  return (
    <>
      <div>
        <LoginForm />
      </div>
    </>
  );
}
const ErrorMessage = ({ errorText }) => {
  if (!errorText) return null;

  return <div className="text-red-500 text-xl mt-1">{errorText}</div>;
};

const LoginForm = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(login, {
    onSuccess: () => {
      queryClient.invalidateQueries("login");
    },
    onError: () => {
      setErrorMessage("Failed to Login,please retry .....");
    },
  });
  const [errorMes, setErrorMessage] = useState("");
  const handleSubmit = (values) => {
    values.ip_address = "";
    console.log({ values });
    mutation.mutate(values);
  };
  return (
    <div>
      <div className="spacer" id="forms-component">
        <Container>
          <Row className="justify-content-center">
            <Col md="10" className="text-center">
              <h1 className="title font-bold">Login</h1>
              <h6 className="subtitle">Fill the form below to login.</h6>
            </Col>
          </Row>
          <ErrorMessage errorText={errorMes} />
        </Container>
      </div>
      <Container>
        <Row>
          <Col md="12">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string().required("Required").email("Invalid email"),
                password: Yup.string()
                  .required("Required")
                  .min(8, "Too Short! must be at least 8 characters"),
              })}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Form>
                  <Col>
                    <Row>
                      <FormGroup floating>
                        <Input
                          id="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          placeholder="Email"
                          type="email"
                          autoComplete="on"
                          // @ts-ignore
                          valid={formik.touched.email && formik.errors.email}
                        />
                        <Label for="email">Email</Label>
                        <FormFeedback>Enter a valid email</FormFeedback>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup floating>
                        <Input
                          id="password"
                          name="password"
                          placeholder="Password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          type="password"
                          autoComplete="on"
                          // @ts-ignore
                          valid={
                            formik.touched.password && formik.errors.password
                          }
                        />
                        <FormFeedback>
                          Password can not be less than 8 characters.
                        </FormFeedback>
                        <Label for="password">Password</Label>
                      </FormGroup>
                    </Row>
                    <Col md="12"></Col>
                    <div className="text-center flex justify-center  pt-4 ">
                      <Button
                        type="submit"
                        color="primary"
                        className="text-nowrap mr-4"
                        // disabled={formik.}
                        // @ts-ignore
                        onClick={formik.handleSubmit}
                      >
                        Login
                      </Button>
                      <Button
                        type="reset"
                        color="secondary"
                        className="text-nowrap"
                      >
                        Reset
                      </Button>
                    </div>
                  </Col>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
