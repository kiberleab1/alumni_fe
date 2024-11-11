import { useQueryClient, useMutation, useQuery } from "react-query";
import {
  createAddress,
  getInstitutes,
  getRoleByName,
  getRoles,
  signup,
} from "src/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, FormGroup, Label, Button } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormErrorMessage from "src/components/utils/formErrorMessage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  return (
    <>
      <div>
        <SignupForm />
      </div>
    </>
  );
}
import "react-datepicker/dist/react-datepicker.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  const [addressError, setAddressError] = useState("");
  const [roles, setRoles] = useState([]);
  const [addressData, setAddressData] = useState(null);
  const [birthPlaceAddress, setBirthPlaceAddress] = useState(null);
  const [stepTwo, setstepTwo] = useState(false);
  const [stepOne, setstepOne] = useState(true);
  const [stepThree, setstepThree] = useState(false);
  const mutation = useMutation(signup, {
    onSuccess: () => {
      queryClient.invalidateQueries("signup");
      toast.success("Signup success. Welcome to the alumni system!");

      setTimeout(() => {
        navigate("/landing/program/login");
      }, 1000);
    },
    onError: () => {
      setErrorMsg(
        "Something went wrong in the sign-up process, please fix the errors and try again."
      );
    },
  });

  const { isError, data, isLoading } = useQuery(
    ["getRoleByName"],
    async () => {
      const roleData = await getRoleByName({ name: "alumni" });

      setRoles(roleData.data.id);
    },
    { keepPreviousData: true }
  );

  const handleSubmit = (values) => {
    console.log({ "new user": values });
    mutation.mutate(values);
  };

  const birthFormFields = {
    country: {
      label: "Country",
      placeholder: "Country",
    },
    region: {
      label: "Region",
      placeholder: "Region",
    },
    city: {
      label: "City",
      placeholder: "City",
    },
    house_number: {
      label: "House Number",
      placeholder: "House Number",
    },
  };

  const userInformationFields = {
    first_name: {
      label: "First Name",
      placeholder: "First Name",
      type: "text",
    },
    middle_name: {
      label: "Middl eName",
      placeholder: "Middle Name",
      type: "text",
    },
    last_name: {
      label: "Last Name",
      placeholder: "Last Name",
      type: "text",
    },
    email: {
      label: "Email",
      placeholder: "Email",
      type: "email",
    },

    phone_number: {
      label: "Phone Number",
      placeholder: "Phone Number",
      type: "number",
    },
    password: {
      label: "Password",
      placeholder: "Password",
    },
    gender: {
      label: "Gender",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
    date_of_birth: {
      label: "Date of Birth",
      placeholder: "Date of Birth",
      type: "date",
    },
  };
  const addressFormFields = {
    addresscountry: {
      label: "Country",
      placeholder: "Country",
    },
    addressregion: {
      label: "Region",
      placeholder: "Region",
    },
    addresscity: {
      label: "City",
      placeholder: "City",
    },
    addresshouse_number: {
      label: "House Number",
      placeholder: "House Number",
    },
  };
  const addressFormValueAndImplmentation = useFormik({
    initialValues: Object.keys(addressFormFields).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {}),
    validationSchema: Yup.object(
      Object.keys(addressFormFields).reduce((acc, key) => {
        acc[key] = Yup.string().required(
          `${addressFormFields[key].label} is required`
        );
        return acc;
      }, {})
    ),
    onSubmit: async (values) => {
      console.log("Form values address:", values);
      const keyMapping = {
        addresscity: "city",
        addresscountry: "country",
        addresshouse_number: "house_number",
        addressregion: "region",
      };
      const renamedAddress = Object.keys(values).reduce((acc, key) => {
        const newKey = keyMapping[key] || key;
        acc[newKey] = values[key];
        return acc;
      }, {});
      const result = await createAddress(renamedAddress);
      if (result.data) {
        setAddressData(result.data.id);
      }

      setstepOne(false);
      setstepTwo(true);
      setstepThree(false);
    },
  });
  const birthFormValueAndImplmentation = useFormik({
    initialValues: Object.keys(birthFormFields).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {}),
    validationSchema: Yup.object(
      Object.keys(birthFormFields).reduce((acc, key) => {
        acc[key] = Yup.string().required(
          `${birthFormFields[key].label} is required`
        );
        return acc;
      }, {})
    ),
    onSubmit: async (values) => {
      console.log("Form values birth:", values);
      const result = await createAddress(values);
      if (result.data) {
        setBirthPlaceAddress(result.data.id);
      }

      setstepOne(false);
      setstepTwo(false);
      setstepThree(true);
    },
  });
  const userInFoValueAndImplmentation = useFormik({
    initialValues: Object.keys(userInformationFields).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {}),
    validationSchema: Yup.object(
      Object.keys(userInformationFields).reduce((acc, key) => {
        acc[key] = Yup.string().required(
          `${userInformationFields[key].label} is required`
        );
        return acc;
      }, {})
    ),
    onSubmit: async (values) => {
      values["role_id"] = roles;
      values["address_id"] = addressData;
      values["birth_place_id"] = birthPlaceAddress;
      values["institute_id"] = "714642fd-c7d5-4372-9c57-17858b4c1933";

      console.log("Form values user info:", values);
      // submit here
      handleSubmit(values);

      // navigate("/landing/program/login");
    },
  });
  const calculateProgress = () => {
    const totalFields = 16;
    const mergedObj = {
      ...addressFormValueAndImplmentation.values,
      ...birthFormValueAndImplmentation.values,
      ...userInFoValueAndImplmentation.values,
    };
    console.log(mergedObj);

    const filledFields = Object.values(mergedObj).filter(
      (value) => value !== ""
    ).length;
    return (filledFields / totalFields) * 100;
  };
  const toPrevForm = (bool, str) => {
    switch (str) {
      case "stepTwo":
        setstepTwo(!bool);
        setstepOne(true);
        break;
      case "stepThree":
        setstepThree(!bool);
        setstepTwo(true);
        setstepOne(false);
      default:
        break;
    }
  };
  return (
    <div className="min-h-screen bg-black">
      <div className="flex items-center justify-center min-h-screen">
        <div className="px-4 py-5 xl:p-14 max-w-2xl  my-auto border border-gray-800 transition-all duration-700 rounded-xl bg-gray-800">
          <div className="sticky top-2 mt-2 z-0 w-90 bg-gray-400 rounded-full h-2.5 mb-4 overflow-hidden">
            <div
              className="bg-green-900 h-2.5 z-0 rounded-full transition-all duration-700 "
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          {stepOne && (
            <div className="transition-all duration-700 ">
              <div>
                <h1 className="text-xl text-left font-bold text-gray-400">
                  Address Information
                </h1>
                <div className="flex items-center justify-between mb-4 ">
                  <p className="mt-1 text-sm leading-6 text-gray-500 font-mono text-left">
                    Please provide updated and accurate information
                  </p>
                  <span className="ml-7 text-sm font-semibold text-gray-800">
                    Step 1/3
                  </span>
                </div>

                <form
                  onSubmit={addressFormValueAndImplmentation.handleSubmit}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap -mx-2">
                    {Object.keys(addressFormFields).map((field, index) => (
                      <div
                        key={field}
                        className={`px-2 ${
                          index < 2 ? "w-full md:w-1/2" : "w-full"
                        }`}
                      >
                        <label
                          htmlFor={field}
                          className="block text-left text-gray-400 mb-2 font-medium"
                        >
                          {addressFormFields[field].label}
                        </label>
                        <input
                          id={field}
                          name={field}
                          type="text"
                          {...addressFormValueAndImplmentation.getFieldProps(
                            field
                          )}
                          placeholder={addressFormFields[field].placeholder}
                          className="form-input w-full px-3 py-2 placeholder-gray-800 text-black  rounded bg-gray-600 focus:border focus:border-e-white"
                        />
                        {addressFormValueAndImplmentation.touched[field] &&
                        addressFormValueAndImplmentation.errors[field] ? (
                          <div className="text-red-500 text-sm">
                            {addressFormValueAndImplmentation.errors[field]}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between w-full">
                    <button
                      type="button"
                      className="relative group inline-flex  items-center  text-white py-2 px-8 rounded transition duration-300 ease-in-out  bg-red-900 hover:bg-red-700 active:bg-red-400"
                      onClick={() =>
                        addressFormValueAndImplmentation.resetForm()
                      }
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="relative group inline-flex  items-center  text-white py-2 px-8 rounded transition duration-300 ease-in-out  bg-gray-950 hover:bg-gray-600 active:bg-green-400 "
                    >
                      <span className=" ">Next</span>
                      <span className="hidden absolute ml-9 group-hover:inline pl-2">
                        <FaLongArrowAltRight />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {stepTwo && (
            <div className="transition-all duration-700">
              <div>
                <div className="flex items-center">
                  <FaLongArrowAltLeft
                    onClick={() => toPrevForm(stepTwo, "stepTwo")}
                    className="mr-2 text-5xl text-green-800 transition ease-in-out delay-150 transform hover:-translate-y-1 hover:scale-110 hover:bg-green-900 hover:text-white duration-300 p-1 rounded"
                  />

                  <h1 className="text-xl font-bold text-gray-400">
                    User Place Of Birth Information
                  </h1>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="mt-1 text-sm leading-6 text-gray-500 font-mono text-left">
                    Please provide updated and accurate information
                  </p>

                  <span className="ml-7 text-sm font-semibold text-gray-500">
                    Step 2/3
                  </span>
                </div>

                <form
                  onSubmit={birthFormValueAndImplmentation.handleSubmit}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap -mx-2">
                    {Object.keys(birthFormFields).map((field, index) => (
                      <div
                        key={field}
                        className={`px-2 ${
                          index < 2 ? "w-full md:w-1/2" : "w-full"
                        }`}
                      >
                        <label
                          htmlFor={field}
                          className="block text-left text-gray-400 mb-2 font-medium"
                        >
                          {birthFormFields[field].label}
                        </label>
                        <input
                          id={field}
                          name={field}
                          type="text"
                          {...birthFormValueAndImplmentation.getFieldProps(
                            field
                          )}
                          placeholder={birthFormFields[field].placeholder}
                          className="form-input w-full px-3 py-2 placeholder-gray-800 text-black  rounded bg-gray-600 focus:border focus:border-e-white"
                        />
                        {birthFormValueAndImplmentation.touched[field] &&
                        birthFormValueAndImplmentation.errors[field] ? (
                          <div className="text-red-500 text-sm">
                            {birthFormValueAndImplmentation.errors[field]}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between w-full">
                    <button
                      type="button"
                      className="relative group inline-flex  items-center  text-white py-2 px-8 rounded transition duration-300 ease-in-out  bg-red-900 hover:bg-red-700 active:bg-red-400 text-white py-2 px-4 rounded"
                      onClick={() => birthFormValueAndImplmentation.resetForm()}
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="relative group inline-flex  items-center  text-white py-2 px-8 rounded transition duration-300 ease-in-out  bg-gray-950 hover:bg-gray-600 active:bg-green-400 "
                    >
                      <span className=" ">Next</span>
                      <span className="hidden absolute ml-9 group-hover:inline pl-2">
                        <FaLongArrowAltRight />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}{" "}
          {stepThree && (
            <div>
              <div>
                <div>
                  <div className="flex items-center">
                    <FaLongArrowAltLeft
                      onClick={() => toPrevForm(stepThree, "stepThree")}
                      className="mr-2 text-5xl text-green-800 transition ease-in-out delay-150 transform hover:-translate-y-1 hover:scale-110 hover:bg-green-900 hover:text-white duration-300 p-1 rounded"
                    />

                    <h1 className="text-xl font-bold text-gray-400">
                      User Information
                    </h1>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <p className="mt-1 text-sm leading-6 text-gray-500 font-mono text-left">
                      Please provide updated and accurate information
                    </p>

                    <span className="ml-7 text-sm font-semibold text-gray-800">
                      Step 3/3
                    </span>
                  </div>
                  <form
                    onSubmit={userInFoValueAndImplmentation.handleSubmit}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap -mx-2 ">
                      {Object.keys(userInformationFields).map(
                        (field, index) => (
                          <div
                            key={field}
                            className={
                              index < 2
                                ? "w-full md:w-1/2 space-x-2  pr-1"
                                : index === 3
                                ? "w-1/2 space-x-2 pr-1"
                                : index === 4
                                ? "w-1/2 space-x-2 px-1"
                                : "w-full px-1"
                            }
                          >
                            <label
                              htmlFor={field}
                              className="block text-left text-gray-400 mb-2 font-medium "
                            >
                              {userInformationFields[field].label}
                            </label>
                            {field === "gender" ? (
                              <select
                                id={field}
                                name={field}
                                {...userInFoValueAndImplmentation.getFieldProps(
                                  field
                                )}
                                className="form-select w-full px-2 py-2 placeholder-gray-800 text-black  rounded bg-gray-600 focus:border focus:border-e-white"
                              >
                                <option value="" label="Select Gender" />
                                {userInformationFields[field].options.map(
                                  (option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  )
                                )}
                              </select>
                            ) : field === "dateOfBirth" ? (
                              <DatePicker
                                openToDate={new Date()}
                                maxDate={new Date()}
                                showIcon={true}
                                toggleCalendarOnIconClick
                                dateFormat="dd-MM-yyyy"
                                id={field}
                                name={field}
                                selected={
                                  userInFoValueAndImplmentation.values[field]
                                    ? new Date(
                                        userInFoValueAndImplmentation.values[
                                          field
                                        ]
                                      )
                                    : null
                                }
                                onChange={(date) =>
                                  userInFoValueAndImplmentation.setFieldValue(
                                    field,
                                    date
                                  )
                                }
                                className="form-input w-full px-5 py-2 pl-7 placeholder-gray-800 text-black border rounded bg-gray-800 justify:center item-center "
                                placeholderText={
                                  userInformationFields[field].placeholder
                                }
                                icon={
                                  <i
                                    className="fa fa-calendar  "
                                    aria-hidden="true"
                                  ></i>
                                }
                              />
                            ) : (
                              <input
                                id={field}
                                name={field}
                                type="text"
                                {...userInFoValueAndImplmentation.getFieldProps(
                                  field
                                )}
                                placeholder={
                                  userInformationFields[field].placeholder
                                }
                                className="form-input w-full px-3 py-2 placeholder-gray-800 rounded bg-gray-600 text-black focus:border focus:border-e-white"
                              />
                            )}
                            {userInFoValueAndImplmentation.touched[field] &&
                            userInFoValueAndImplmentation.errors[field] ? (
                              <div className="text-red-500 text-sm">
                                {userInFoValueAndImplmentation.errors[field]}
                              </div>
                            ) : null}
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex justify-between w-full">
                      <button
                        type="button"
                        className="relative group inline-flex  items-center  transition duration-300 ease-in-out  bg-red-900 hover:bg-red-700 active:bg-red-400 text-white py-2 px-4 rounded"
                        onClick={() =>
                          userInFoValueAndImplmentation.resetForm()
                        }
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        className="ml-auto text-white rounded transition duration-300 ease-in-out  bg-gray-950 hover:bg-gray-600 active:bg-green-400"
                      >
                        Sumbit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* 
      <div className="spacer" id="forms-component">
        <Container>
          <Row className="justify-content-center">
            <Col md="12" className="text-center">
              <h1 className="title font-bold">Sign Up</h1>
              <h6 className="subtitle">
                Fill the form below to create a new account.
              </h6>
            </Col>
            <FormErrorMessage errorText={errorMsg} />
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
              role_id: "1",
              address_id: "1",
              birth_place_id: "1",
              institute_id: "1",
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
                          <Row className="mb-0 ">
                            <div className="block lg:flex lg:justify-end lg:items-center mt-2 ">
                              <Label
                                htmlFor="email"
                                className="block text-gray-700 text-left pl-6  mb-2 lg:mb-0 text-black text-lg"
                              >
                                Email
                              </Label>
                              <Field
                                type="text"
                                class="form-control w-2/3 px-3 py-2 ml-4 placeholder-gray-400 border rounded"
                                id="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                name="email"
                                placeholder="Enter Email"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="error text-danger absolute  pl-6"
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
                            <div className="block lg:flex lg:justify-end lg:items-center mt-0  ">
                              <Label
                                htmlFor="first_name"
                                className="block text-gray-700 text-left pl-6  mb-2 lg:mb-0 text-black text-lg"
                              >
                                First Name
                              </Label>
                              <Field
                                type="text"
                                className="form-control w-2/3 px-3 py-2 ml-4 placeholder-gray-400 border rounded"
                                id="first_name"
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                name="first_name"
                                placeholder="Enter First Name"
                              />
                              <ErrorMessage
                                name="first_name"
                                component="div"
                                className="error text-danger absolute  pl-6"
                              />
                            </div>
                          </Row>
                        </Col>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="block lg:flex lg:justify-end lg:items-center mt-2 ">
                            <Label
                              htmlFor="middle_name"
                              className="block text-gray-700 text-left pl-6  mb-2 lg:mb-0 text-black text-lg"
                            >
                              Middle Name
                            </Label>
                            <Field
                              type="text"
                              className="form-control w-2/3 px-3 py-2 ml-4 placeholder-gray-400 border rounded"
                              id="middle_name"
                              value={formik.values.middle_name}
                              onChange={formik.handleChange}
                              name="middle_name"
                              placeholder="Enter Middle Name"
                            />
                            <ErrorMessage
                              name="middle_name"
                              component="div"
                              className="error text-danger absolute  pl-6"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="block lg:flex lg:justify-end lg:items-center mt-2 ">
                            <Label
                              htmlFor="last_name"
                              className="block text-gray-700 text-left pl-6  mb-2 lg:mb-0 text-black text-lg"
                            >
                              Last Name
                            </Label>
                            <Field
                              type="text"
                              className="form-control w-2/3 px-3 py-2 ml-4 placeholder-gray-400 border rounded"
                              id="last_name"
                              value={formik.values.last_name}
                              onChange={formik.handleChange}
                              name="last_name"
                              placeholder="Enter Last Name"
                            />
                            <ErrorMessage
                              name="last_name"
                              component="div"
                              className="error text-danger absolute  pl-6"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="block lg:flex lg:justify-end lg:items-center mt-2 ">
                            <Label
                              htmlFor="phone_number"
                              className="block text-gray-700 text-left pl-6  mb-2 lg:mb-0 text-black text-lg"
                            >
                              Phone Number
                            </Label>
                            <Field
                              type="text"
                              className="form-control w-2/3 px-3 py-2 ml-4 placeholder-gray-400 border rounded"
                              id="phone_number"
                              value={formik.values.phone_number}
                              onChange={formik.handleChange}
                              name="phone_number"
                              placeholder="Enter Phone Number"
                            />
                            <ErrorMessage
                              name="phone_number"
                              component="div"
                              className="error text-danger absolute  pl-6"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row>
                          <div className="block lg:flex lg:justify-end lg:items-center mt-2 ">
                            <Label
                              htmlFor="password"
                              className="block text-gray-700 text-left bg:blue-500 pl-6  mb-2 lg:mb-0 text-black text-lg"
                            >
                              Password
                            </Label>
                            <Field
                              type="password"
                              className="form-control w-2/3 px-3 py-2 ml-4 placeholder-gray-400 border rounded"
                              id="password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              name="password"
                              placeholder="Enter Password"
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="error text-danger absolute  pl-6"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Row className="  ">
                          <div className="block lg:flex lg:justify-end items-center mt-2 ">
                            <Label
                              htmlFor="gender"
                              className="block text-gray-700 text-left pl-6  mb-2 lg:mb-0 text-black text-lg"
                            >
                              Gender
                            </Label>
                            <select
                              className="form-control w-2/3 px-3 py-2 ml-4 placeholder-gray-400 border rounded"
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
                              className="error text-danger absolute  pl-6"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row>

                    <Row className="">
                      <FormGroup className="">
                        <Row className=" w-2/3 justify:center ml-14 ">
                          <div className="block lg:flex lg:justify-center lg:items-center mt-2 ">
                            <Label
                              htmlFor="date_of_birth"
                              className="block text-gray-700 text-left pl-6  mb-2 lg:mb-0 text-black text-lg"
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
                              toggleCalendarOnIconClick
                              className="form-control w-2/3 ml-4 lg:justify-start text-red-500  border rounded "
                              // eslint-disable-next-line react/jsx-no-undef
                              icon={
                                <i
                                  className="fa fa-calendar  ml-5  text:center justify:center"
                                  aria-hidden="true"
                                ></i>
                              }
                              selected={formik.values.date_of_birth}
                              onChange={(date) =>
                                formik.setFieldValue("date_of_birth", date)
                              }
                            />
                            <ErrorMessage
                              name="date_of_birth"
                              component="div"
                              className="error text-danger absolute  pl-6"
                            />
                          </div>
                        </Row>
                      </FormGroup>
                    </Row> */}
      {/* <Row>
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
                    </Row> */}
      {/* <Row>
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
                    </Row> */}
      {/* </Col>
                </Row>

                <Col md="12" className="text-center ">
                  <div className="flex justify-center gap-8 items-center my-4 pb-4">
                    <Button
                      color="primary"
                      // onClick={handleSubmit(e)}get
                      type="submit"
                      className="text-nowrap mr-4 bg-blue-500 hover:bg-blue-500 hover:text-green-400   hover:shadow-lg hover:shadow-blue-500/30"
                    >
                      Signup
                    </Button>
                    <Button
                      color="secondary"
                      onClick={formik.handleReset}
                      className="text-nowrap hover:text-red-500 hover:bg-gray-500   hover:shadow-lg hover:shadow-red-500/30"
                    >
                      Reset
                    </Button>
                  </div>
                </Col>
              </Form>
            )}
          </Formik>
        </Container> */}
      {/* </div> */}
      <ToastContainer />
    </div>
  );
};
