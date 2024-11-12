import { useFormik } from "formik";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { login } from "src/api";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { storeUserToken as storeUserToken } from "src/helpers/globalStorage";
import { ToastContainer } from "react-toastify";
import { IoPeopleOutline } from "react-icons/io5";
import { IoMdLock, IoMdMail } from "react-icons/io";
import { RiEyeCloseFill } from "react-icons/ri";
import { RxEyeOpen } from "react-icons/rx";
import { MdOutlinePeople } from "react-icons/md";
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
    onSuccess: (res) => {
      queryClient.invalidateQueries("login");

      const data = storeUserToken(res.data);
      if (data) {
        switch (data.user.role_name) {
          case "super_admin":
            // navigate("/admin");
            window.location.href = "/admin";
            break;
          case "admin":
            // navigate("/admin");
            window.location.href = "/admin";

            break;
          case "user":
            // navigate("/user");
            window.location.href = "/user";

            break;
          case "alumni":
            // navigate("/user");
            window.location.href = "/user";

            break;
          default:
            navigate("/landing");
        }
      } else throw new Error("Something went wrong");
    },
    onError: () => {
      setErrorMessage("Failed to Login,please retry .....");
    },
  });
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  const [errorMes, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const loginFormFields = {
    email: {
      label: "Email",
      placeholder: "Email",
      type: "email",
    },
    password: {
      label: "Password",
      placeholder: "Password",
      type: passwordVisible ? "text" : "password",
    },
  };
  const loginFormValueAndImplmentation = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Required").email("Invalid email"),
      password: Yup.string()
        .required("Required")
        .min(8, "Too Short! must be at least 8 characters"),
    }),
    onSubmit: (values) => {
      let data = { ...values, ip_address: "" };
      mutation.mutate(data);
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className=" border-sky-500  transition-all  duration-700">
        <div className="transition-all duration-700  flex flex-col justify-center items-center bg-gray-400 rounded-xl mx-2">
          <div className=" md:w-2/3 rounded-xl px-4  ">
            <div className="text-2xl flex  text-center items-end justify-center font-bold m-auto">
              <MdOutlinePeople className="text-8xl text-gray-500" />
              <h2 className="mb-3 font-serif text-3xl text-gray-500">
                Welcome back
              </h2>
            </div>
            <div className="flex items-center justify-between mb- "></div>

            <form
              onSubmit={loginFormValueAndImplmentation.handleSubmit}
              className="space-y-6 py-4 px-4 "
            >
              <div className="flex flex-wrap -mx-2 gap-1 ">
                {Object.keys(loginFormFields).map((field) => (
                  <div key={field} className="w-full">
                    <label
                      htmlFor={field}
                      className="block text-left text-white mb-1 font-medium font-serif"
                    >
                      {loginFormFields[field].label}
                    </label>

                    <div className="relative w-full ">
                      {field === "email" && (
                        <span className="absolute p-2 top-1/2 transform pr-1 -translate-y-1/2 text-gray-500 border-r border-gray-500">
                          <IoMdMail className="text-xl text-gray-300" />
                        </span>
                      )}

                      {field === "password" && (
                        <span className="absolute p-2 top-1/2 pr-1 transform -translate-y-1/2 text-gray-500 border-r  border-gray-500">
                          <IoMdLock className="text-xl text-gray-300" />
                        </span>
                      )}

                      <input
                        id={field}
                        name={field}
                        type={
                          field === "password"
                            ? passwordVisible
                              ? "text"
                              : "password"
                            : loginFormFields[field].type
                        }
                        {...loginFormValueAndImplmentation.getFieldProps(field)}
                        placeholder={
                          field === "password"
                            ? "Password"
                            : loginFormFields[field].placeholder
                        }
                        className="form-input w-full pl-12 pr-14 py-2 placeholder-gray-200 text-black  border rounded bg-gray-400 focus:border focus:bg-gray-500"
                      />

                      {field === "password" && (
                        <span
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        >
                          {passwordVisible ? (
                            <RiEyeCloseFill className="text-xl text-gray-200" />
                          ) : (
                            <RxEyeOpen className="text-xl text-gray-200" />
                          )}
                        </span>
                      )}
                    </div>

                    {loginFormValueAndImplmentation.touched[field] &&
                    loginFormValueAndImplmentation.errors[field] ? (
                      <div className="text-red-500 text-sm flex items-end justify-end">
                        {loginFormValueAndImplmentation.errors[field]}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="block  overflow-hidden 0 pt-4 ">
                <button
                  type="submit"
                  className="transition duration-300 ease-in-out hover:scale-95 bg-green-700 hover:bg-gray-600 text-white py-2 rounded w-full active:bg-gray-300 "
                >
                  Login
                </button>

                <div className="mt-3 text-sm leading-6 text-gray-600 w-[95%] font-mono text-left flex items-center justify-start">
                  <p className="ml-2">
                    <a href="/landing/program/register" className="pr-2">
                      Register
                    </a>
                    if you don't have an account
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
