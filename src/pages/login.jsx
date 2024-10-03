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

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className=" border-sky-500  transition-all     duration-700">
        <div className="transition-all duration-700">
          <div className=" f">
            <div className="text-2xl flex  text-center items-center justify-center font-bold m-auto">
              {" "}
              <IoPeopleOutline className="text-8xl" />{" "}
            </div>
            <div className="flex items-center justify-between mb- "></div>

            <form
              onSubmit={loginFormValueAndImplmentation.handleSubmit}
              className="space-y-4"
            >
              <div className="flex flex-wrap -mx-2">
                {Object.keys(loginFormFields).map((field) => (
                  <div key={field} className="px-2 w-full pb-2">
                    <label
                      htmlFor={field}
                      className="block text-left text-black mb-2 font-medium"
                    >
                      {loginFormFields[field].label}
                    </label>

                    <div className="relative">
                      {/* Conditionally render icons for email and password */}
                      {field === "email" && (
                        <span className="absolute  p-2 top-1/2 transform pr-1 -translate-y-1/2 text-gray-500 border-r">
                          <IoMdMail className="text-xl" />
                        </span>
                      )}

                      {field === "password" && (
                        <span className="absolute p-2 top-1/2 pr-1 transform -translate-y-1/2 text-gray-500 border-r">
                          <IoMdLock className="text-xl" />
                        </span>
                      )}

                      <input
                        id={field}
                        name={field}
                        type={loginFormFields[field].type}
                        {...loginFormValueAndImplmentation.getFieldProps(field)}
                        placeholder={loginFormFields[field].placeholder}
                        className="form-input w-[80%] px-12 py-2 placeholder-gray-100 text-black border rounded bg-white"
                      />
                    </div>

                    {loginFormValueAndImplmentation.touched[field] &&
                    loginFormValueAndImplmentation.errors[field] ? (
                      <div className="text-red-500 text-sm">
                        {loginFormValueAndImplmentation.errors[field]}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="block  overflow-hidden space-x-4 0 ">
                <button
                  type="submit"
                  className="transition duration-300 ease-in-out hover:scale-95 bg-gray-800 hover:bg-gray-600 text-white py-2 rounded w-[80%] active:bg-gray-300 p-2"
                >
                  Login
                </button>

                <div className="mt-2 text-sm leading-6 text-gray-600 w-[80%] font-mono text-left flex items-center justify-center">
                  <a href="/landing/program/register" className="">
                    Register
                  </a>
                  <span className="ml-2">if you don't have an account</span>
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
