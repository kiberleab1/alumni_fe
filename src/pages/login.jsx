import { Form, Formik, useFormik } from "formik";
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
import FormErrorMessage from "src/components/utils/formErrorMessage";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  return (
    <>
      <div>
        <LoginForm />
      </div>
    </>
  );
}

const LoginForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(login, {
    onSuccess: () => {
      queryClient.invalidateQueries("login");
      navigate("/landing/program/profile");
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
  const loginFormFields = {
    email: {
      label: "Email",
      placeholder: "Email",
      type: "email",
    },
    password: {
      label: "Password",
      placeholder: "Password",
      type: "password",
    },
  };
  const loginFormValueAndImplmentation = useFormik({
    initialValues: Object.keys(loginFormFields).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {}),
    validationSchema: Yup.object(
      Object.keys(loginFormFields).reduce((acc, key) => {
        acc[key] = Yup.string().required(
          `${loginFormFields[key].label} is required`
        );
        return acc;
      }, {})
    ),
    onSubmit: (values) => {
      console.log("Form values login:", values);
      // submit here
      navigate("/user");
    },
  });
  return (
    <div>
      <div
        className="
        p-8
        max-w-xl
        mt-16
        mx-auto
        border-sky-500
        transition-all
        duration-700"
      >
        <div className="transition-all duration-700">
          <div>
            <h1 className="text-2xl text-center font-bold">Login Form</h1>
            <div className="flex items-center justify-between mb-4 "></div>

            <form
              onSubmit={loginFormValueAndImplmentation.handleSubmit}
              className="space-y-4"
            >
              <div className="flex flex-wrap -mx-2">
                {Object.keys(loginFormFields).map((field, index) => (
                  <div key={field} className="px-2 w-full pb-2">
                    <label
                      htmlFor={field}
                      className="block text-left text-black mb-2 font-medium"
                    >
                      {loginFormFields[field].label}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type={field}
                      {...loginFormValueAndImplmentation.getFieldProps(field)}
                      placeholder={loginFormFields[field].placeholder}
                      className="form-input w-full px-3 py-2 placeholder-gray-400 text-black border rounded bg-white"
                    />
                    {loginFormValueAndImplmentation.touched[field] &&
                    loginFormValueAndImplmentation.errors[field] ? (
                      <div className="text-red-500 text-sm">
                        {loginFormValueAndImplmentation.errors[field]}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="block  overflow-hidden space-x-4">
                <button
                  type="submit"
                  className="transition duration-300 ease-in-out hover:scale-110 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded w-full active:bg-gray-300"
                >
                  Login
                </button>

                <p className="mt-1 text-sm leading-6 text-gray-600 font-mono text-left">
                  <a href="/landing/program/register">Register</a> if you don't
                  have an account
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="spacer" id="forms-component">
        <Container>
          <Row className="justify-content-center">
            <Col md="10" className="text-center">
              <h1 className="title font-bold ">Login</h1>
              <h6 className="subtitle">Fill the form below to login.</h6>
            </Col>
          </Row>
          <FormErrorMessage errorText={errorMes} />
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
                <div className="flex justify-center items-center border-black ">
                  <Form className="w-2/3 p-4  rounded-lg border-black shadow-lg shadow-gray-500/30 ">
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
                          <Label for="email" className="text-gray-600 ">
                            Email
                          </Label>
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
                          <Label for="password" className="text-gray-600 ">
                            Password
                          </Label>
                        </FormGroup>
                      </Row>
                      <Col md="12"></Col>
                      <div className="text-center flex justify-center  pt-4 ">
                        <Button
                          type="submit"
                          className="text-nowrap mr-4 bg-blue-500 hover:bg-blue-500 hover:text-green-400   hover:shadow-lg hover:shadow-blue-500/30"
                          // disabled={formik.}
                          // @ts-ignore
                          onClick={formik.handleSubmit}
                        >
                          Login
                        </Button>
                        <Button
                          type="reset"
                          color="secondary"
                          className="text-nowrap hover:text-red-500 hover:bg-gray-500   hover:shadow-lg hover:shadow-red-500/30"
                        >
                          Reset
                        </Button>
                      </div>
                    </Col>
                  </Form>
                </div>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
