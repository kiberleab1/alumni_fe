import { useFormik } from "formik";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { login } from "src/api";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { storeUserToken as storeUserToken } from "src/helpers/globalStorage";

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
      if (data) navigate("/landing/program/profile");
      else throw new Error("Something went wrong");
    },
    onError: () => {
      setErrorMessage("Failed to Login,please retry .....");
    },
  });
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
            <div className="flex items-center justify-center mb-4 text-red-500">
              {errorMes}
            </div>

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
                  <a href="/landing/program/register">Register</a>
                  {"if you don't have an account"}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
