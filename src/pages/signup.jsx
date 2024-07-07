import { useQueryClient, useMutation } from "react-query";
import { signup } from "src/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, FormGroup, Label, Button } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SignupPage() {
  return (
    <>
      <div>
        <SignupForm />
      </div>
    </>
  );
}

const SignupForm = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(signup, {
    onSuccess: () => {
      queryClient.invalidateQueries("signup");
    },
  });

  const handleSubmit = (values) => {
    console.log({ "new user": values });
    mutation.mutate(values);
  };

  return (
    <div>
      <div className="spacer" id="forms-component">
        <Container>
          <Row className="justify-content-center">
            <Col md="12" className="text-center">
              <h1 className="title font-bold">Sign Up</h1>
              <h6 className="subtitle">
                Fill the form below to create a new account.
              </h6>
            </Col>
          </Row>
          <Formik
            //TODO
            //when fetching possible options from api for dropdown fields set the first option as default
            initialValues={{
              email: "",
              first_name: "",
              middle_name: "",
              last_name: "",
              phone_number: "",
              password: "",
              gender: "Male",
              date_of_birth: "",
              role_id: "",
              address_id: "",
              birth_place_id: "",
              institute_id: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address")
                .required("Required"),
              first_name: Yup.string().required("Required"),
              middle_name: Yup.string().required("Required"),
              last_name: Yup.string().required("Required"),
              phone_number: Yup.string().required("Required"),
              password: Yup.string().required("Required"),
              gender: Yup.string().required("Required"),
              date_of_birth: Yup.date().required("Required"),
              role_id: Yup.string().required("Required"),
              address_id: Yup.string().required("Required"),
              birth_place_id: Yup.string().required("Required"),
              institute_id: Yup.string().required("Required"),
            })}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form className="">
                <Row md="16">
                  <Col>
                    <Row>
                      <FormGroup>
                        <Col>
                          <Row className="">
                            <div className="flex justify-end items-center mt-2">
                              <Label htmlFor="email" className="m-2 w-1/3">
                                Email
                              </Label>
                              <Field
                                type="text"
                                className="form-control w-2/3"
                                id="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                name="email"
                                placeholder="Enter Email"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="error text-danger"
                              />
                            </div>
                          </Row>
                        </Col>
                        <Col />
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Col>
                          <Row>
                            <div className="flex justify-between items-center mt-2">
                              <Label
                                htmlFor="first_name"
                                className="text-nowrap w-1/3 w-1/3"
                              >
                                First Name
                              </Label>
                              <Field
                                type="text"
                                className="form-control w-2/3 w-2/3"
                                id="first_name"
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                name="first_name"
                                placeholder="Enter First Name"
                              />
                              <ErrorMessage
                                name="first_name"
                                component="div"
                                className="error text-danger"
                              />
                            </div>
                          </Row>
                        </Col>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-between items-center mt-2">
                            <Label
                              htmlFor="middle_name"
                              className="text-nowrap w-1/3"
                            >
                              Middle Name
                            </Label>
                            <Field
                              type="text"
                              className="form-control w-2/3"
                              id="middle_name"
                              value={formik.values.middle_name}
                              onChange={formik.handleChange}
                              name="middle_name"
                              placeholder="Enter Middle Name"
                            />
                            <ErrorMessage
                              name="middle_name"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-end items-center mt-2">
                            <Label
                              htmlFor="last_name"
                              className="text-nowrap w-1/3"
                            >
                              Last Name
                            </Label>
                            <Field
                              type="text"
                              className="form-control w-2/3"
                              id="last_name"
                              value={formik.values.last_name}
                              onChange={formik.handleChange}
                              name="last_name"
                              placeholder="Enter Last Name"
                            />
                            <ErrorMessage
                              name="last_name"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-end items-center mt-2">
                            <Label
                              htmlFor="phone_number"
                              className="text-nowrap w-1/3"
                            >
                              Phone Number
                            </Label>
                            <Field
                              type="text"
                              className="form-control w-2/3"
                              id="phone_number"
                              value={formik.values.phone_number}
                              onChange={formik.handleChange}
                              name="phone_number"
                              placeholder="Enter Phone Number"
                            />
                            <ErrorMessage
                              name="phone_number"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-end items-center mt-2">
                            <Label
                              htmlFor="password"
                              className="text-nowrap w-1/3"
                            >
                              Password
                            </Label>
                            <Field
                              type="password"
                              className="form-control w-2/3"
                              id="password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              name="password"
                              placeholder="Enter Password"
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-end items-center mt-2">
                            <Label
                              htmlFor="gender"
                              className="text-nowrap w-1/3"
                            >
                              Gender
                            </Label>
                            <select
                              className="form-control w-2/3"
                              id="gender"
                              name="gender"
                              value={formik.values.gender}
                              onChange={formik.handleChange}
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <ErrorMessage
                              name="gender"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-right items-center mt-2">
                            <Label
                              htmlFor="date_of_birth"
                              className="text-nowrap w-1/3"
                            >
                              Date of Birth
                            </Label>
                            <DatePicker
                              id="date_of_birth"
                              name="date_of_birth"
                              placeholderText="dd-mm-yyyy"
                              dateFormat="dd-MM-yyyy"
                              openToDate={new Date()}
                              maxDate={new Date()}
                              showIcon={true}
                              // eslint-disable-next-line react/jsx-no-undef
                              icon={
                                <i
                                  className="fa fa-calendar  ml-24 "
                                  aria-hidden="true"
                                ></i>
                              }
                              selected={formik.values.date_of_birth}
                              onChange={(date) =>
                                formik.setFieldValue("date_of_birth", date)
                              }
                              className="form-control w-2/3 "
                            />
                            <ErrorMessage
                              name="date_of_birth"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-end items-center mt-2">
                            <label
                              htmlFor="role_id"
                              className="text-nowrap w-1/3"
                            >
                              Role Id
                            </label>
                            <select
                              className="form-control w-2/3"
                              id="role_id"
                              value={formik.values.role_id}
                              onChange={formik.handleChange}
                              name="role_id"
                            >
                              <option value="1">Role 1</option>
                              <option value="2">Role 2</option>
                              <option value="3">Role 3</option>
                              <option value="4">Role 4</option>
                            </select>
                            <ErrorMessage
                              name="role_id"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-end items-center mt-2">
                            <label
                              htmlFor="address_id"
                              className="text-nowrap w-1/3"
                            >
                              Address Id
                            </label>
                            <select
                              className="form-control w-2/3"
                              id="address_id"
                              value={formik.values.address_id}
                              onChange={formik.handleChange}
                              name="address_id"
                            >
                              <option value="1">Address 1</option>
                              <option value="2">Address 2</option>
                              <option value="3">Address 3</option>
                              <option value="4">Address 4</option>
                              <option value="5">Address 5</option>
                            </select>
                            <ErrorMessage
                              name="address_id"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-end items-center mt-2">
                            <label
                              htmlFor="birth_place_id"
                              className="text-nowrap w-1/3"
                            >
                              Birth Place Id
                            </label>
                            <select
                              className="form-control w-2/3"
                              id="birth_place_id"
                              value={formik.values.birth_place_id}
                              onChange={formik.handleChange}
                              name="birth_place_id"
                            >
                              <option value="1">Birth Place 1</option>
                              <option value="2">Birth Place 2</option>
                              <option value="3">Birth Place 3</option>
                              <option value="4">Birth Place 4</option>
                              <option value="5">Birth Place 5</option>
                            </select>
                            <ErrorMessage
                              name="birth_place_id"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="flex justify-end items-center mt-2">
                            <label
                              htmlFor="institute_id"
                              className="text-nowrap w-1/3"
                            >
                              Institute Id
                            </label>
                            <select
                              className="form-control w-2/3"
                              id="institute_id"
                              value={formik.values.institute_id}
                              onChange={formik.handleChange}
                              name="institute_id"
                            >
                              <option value="1">Institute 1</option>
                              <option value="2">Institute 2</option>
                              <option value="3">Institute 3</option>
                              <option value="4">Institute 4</option>
                            </select>
                            <ErrorMessage
                              name="institute_id"
                              component="div"
                              className="error text-danger"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                  </Col>
                </Row>

                <Col md="12" className="text-center ">
                  <div className="flex justify-center gap-8 items-center my-4 pb-4">
                    <Button
                      color="primary"
                      onClick={formik.handleSubmit}
                      type="submit"
                    >
                      Signup
                    </Button>
                    <Button color="secondary" onClick={formik.handleReset}>
                      Reset
                    </Button>
                  </div>
                </Col>
              </Form>
            )}
          </Formik>
        </Container>
      </div>
    </div>
  );
};
