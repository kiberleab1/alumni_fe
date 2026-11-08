import { useState } from "react";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { apiErrorMessage, login } from "src/api";
import { storeUserToken } from "src/helpers/globalStorage";
import { Spinner } from "src/components/ui";

const HOME_BY_ROLE = { super_admin: "/admin", admin: "/admin", user: "/user", alumni: "/user" };

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const expired = new URLSearchParams(window.location.search).get("expired");

  const mutation = useMutation(login, {
    onSuccess: (res) => {
      const data = storeUserToken(res.data);
      // full reload so the app boots with the new session
      const home = HOME_BY_ROLE[data?.user?.role_name] || "/landing";
      // ?next= from the public site (e.g. "Sign in to RSVP"); members' area only, never another site
      const next = new URLSearchParams(window.location.search).get("next") || "";
      window.location.href = home === "/user" && /^\/user(\/[\w\-/?=&]*)?$/.test(next) ? next : home;
    },
  });

  const form = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required").email("Enter a valid email"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => mutation.mutate({ ...values, email: values.email.trim() }),
  });

  const fieldError = (name) => form.touched[name] && form.errors[name];
  const serverError = mutation.isError ? apiErrorMessage(mutation.error, "Login failed, please try again.") : null;

  return (
    <div className="ui-scope flex min-h-screen bg-slate-50">
      {/* brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-white/5" />
        <p className="relative text-lg font-semibold tracking-tight text-white">Alumni Network</p>
        <div className="relative">
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Stay connected with
            <br />
            the people who shaped you.
          </h1>
          <p className="mt-4 max-w-md text-sky-100">
            Find classmates, message your network, discover jobs and events from your institute — all in one place.
          </p>
        </div>
        <p className="relative text-sm text-sky-200">© {new Date().getFullYear()} Alumni Network</p>
      </div>

      {/* form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to your alumni account.</p>

          {expired && !serverError && (
            <div className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
              Your session has ended. Please sign in again.
            </div>
          )}
          {serverError && (
            <div role="alert" className="mt-6 flex gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
              <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={form.handleSubmit} className="mt-6 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative mt-1.5">
                <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  {...form.getFieldProps("email")}
                  className={`block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 ${
                    fieldError("email") ? "ring-rose-300" : "ring-slate-300"
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={!!fieldError("email")}
                />
              </div>
              {fieldError("email") && <p className="mt-1 text-sm text-rose-600">{form.errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm font-medium text-sky-700 hover:text-sky-600">
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1.5">
                <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...form.getFieldProps("password")}
                  className={`block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 ${
                    fieldError("password") ? "ring-rose-300" : "ring-slate-300"
                  }`}
                  placeholder="••••••••"
                  aria-invalid={!!fieldError("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {fieldError("password") && <p className="mt-1 text-sm text-rose-600">{form.errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={mutation.isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-70"
            >
              {mutation.isLoading && <Spinner className="h-4 w-4" />}
              {mutation.isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            New here?{" "}
            <a href="/signup" className="font-semibold text-sky-700 hover:text-sky-600">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
