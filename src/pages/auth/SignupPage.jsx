/**
 * Join (design board: Sign up). Two short steps instead of the old three-page
 * address form: account -> about you. Address is optional; the institute comes
 * from the site the member signs up on (the server resolves it), and the
 * alumni profile itself is filled in by onboarding after the first sign-in.
 */
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { CheckCircleIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { apiErrorMessage, createAddress, getRoleByName, signup } from "src/api";
import { Spinner, cx } from "src/components/ui";
import { AuthLayout } from "./AuthPages";

const RULES = [
  { test: (p) => p.length >= 8, label: "At least 8 characters" },
  { test: (p) => /[A-Za-z]/.test(p), label: "A letter" },
  { test: (p) => /[0-9]/.test(p), label: "A number" },
];
const input = (bad) =>
  cx("block w-full rounded-lg border-0 px-3 py-2.5 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600", bad ? "ring-rose-300" : "ring-slate-300");
const primaryBtn =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-70";
const maxBirth = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 15);
  return d.toISOString().slice(0, 10);
};

function Label({ htmlFor, children, optional }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
      {children} {optional && <span className="font-normal text-slate-400">(optional)</span>}
    </label>
  );
}
function Err({ children }) {
  return children ? <p className="mt-1 text-sm text-rose-600">{children}</p> : null;
}

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({});
  const [f, setF] = useState({ first_name: "", last_name: "", email: "", password: "", phone_number: "", gender: "", date_of_birth: "", city: "", country: "Ethiopia" });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const touch = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const role = useQuery("alumniRole", async () => (await getRoleByName({ name: "alumni" })).data, { staleTime: Infinity, retry: 1 });

  const errors = {
    first_name: !f.first_name.trim() && "Add your first name",
    last_name: !f.last_name.trim() && "Add your last name",
    email: !/^\S+@\S+\.\S+$/.test(f.email.trim()) && "Enter a valid email",
    password: !RULES.every((r) => r.test(f.password)) && "Your password doesn't meet the rules yet",
    phone_number: !/^\+?[0-9 ()-]{7,20}$/.test(f.phone_number.trim()) && "Enter a phone number, e.g. +251 91 234 5678",
    gender: !f.gender && "Choose one",
    date_of_birth: !f.date_of_birth && "Add your date of birth",
  };
  const stepFields = [["first_name", "last_name", "email", "password"], ["phone_number", "gender", "date_of_birth"]];
  const stepOk = (i) => stepFields[i].every((k) => !errors[k]);
  const showErr = (k) => touched[k] && errors[k];

  const create = useMutation(async () => {
    let address_id = null;
    if (f.city.trim() && f.country.trim()) {
      // address is optional: a failure here shouldn't block joining
      address_id = await createAddress({ country: f.country.trim(), region: f.city.trim(), city: f.city.trim() })
        .then((r) => r.data?.id || null)
        .catch(() => null);
    }
    if (!role.data?.id) throw new Error("Sign-up is unavailable right now. Please try again shortly.");
    return signup({
      first_name: f.first_name.trim(),
      last_name: f.last_name.trim(),
      email: f.email.trim().toLowerCase(),
      password: f.password,
      phone_number: f.phone_number.trim(),
      gender: f.gender,
      date_of_birth: f.date_of_birth,
      role_id: role.data.id,
      address_id,
    });
  });

  if (create.isSuccess) {
    return (
      <AuthLayout title="Check your email" subtitle={`We've sent a link to ${f.email.trim()} to verify your address.`}>
        <div className="mt-6 flex gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-200">
          <CheckCircleIcon className="h-5 w-5 shrink-0" />
          <span>Your account is ready. Sign in now; after your first sign-in we'll help you set up your alumni profile in about a minute.</span>
        </div>
        <a href="/login" className={cx(primaryBtn, "mt-6")}>
          Sign in
        </a>
      </AuthLayout>
    );
  }

  const next = (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(stepFields[step].map((k) => [k, true])));
    if (!stepOk(step)) return;
    if (step === 0) return setStep(1);
    create.mutate();
  };

  return (
    <AuthLayout title="Join your alumni network" subtitle={step === 0 ? "Create your account. It's free and takes a minute." : "A little about you. Only you and admins see your birth date."}>
      <ol className="mt-6 flex items-center gap-2 text-xs font-medium" aria-label="Progress">
        {["Account", "About you"].map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span className={cx("flex h-6 w-6 items-center justify-center rounded-full", i <= step ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-500")} aria-current={i === step ? "step" : undefined}>
              {i < step ? "✓" : i + 1}
            </span>
            <span className={i === step ? "text-slate-900" : "text-slate-500"}>{label}</span>
            {i === 0 && <span className={cx("h-px flex-1", step > 0 ? "bg-sky-600" : "bg-slate-200")} />}
          </li>
        ))}
      </ol>

      {create.isError && (
        <div role="alert" className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {apiErrorMessage(create.error, create.error?.message || "Couldn't create your account. Please try again.")}
          {create.error?.response?.data?.error?.code === "EMAIL_TAKEN" || /already/i.test(apiErrorMessage(create.error, "")) ? (
            <>
              {" "}
              <a href="/login" className="font-semibold underline">
                Sign in instead
              </a>
              {" or "}
              <a href="/forgot-password" className="font-semibold underline">
                reset your password
              </a>
              .
            </>
          ) : null}
        </div>
      )}

      <form className="mt-6 space-y-5" noValidate onSubmit={next}>
        {step === 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="su-first">First name</Label>
                <input id="su-first" autoComplete="given-name" autoFocus className={cx(input(showErr("first_name")), "mt-1.5")} value={f.first_name} onChange={set("first_name")} onBlur={touch("first_name")} maxLength={100} />
                <Err>{showErr("first_name")}</Err>
              </div>
              <div>
                <Label htmlFor="su-last">Last name</Label>
                <input id="su-last" autoComplete="family-name" className={cx(input(showErr("last_name")), "mt-1.5")} value={f.last_name} onChange={set("last_name")} onBlur={touch("last_name")} maxLength={100} />
                <Err>{showErr("last_name")}</Err>
              </div>
            </div>
            <div>
              <Label htmlFor="su-email">Email</Label>
              <div className="relative mt-1.5">
                <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="su-email" type="email" autoComplete="email" className={cx(input(showErr("email")), "pl-10")} value={f.email} onChange={set("email")} onBlur={touch("email")} placeholder="you@example.com" />
              </div>
              <Err>{showErr("email")}</Err>
            </div>
            <div>
              <Label htmlFor="su-password">Password</Label>
              <div className="relative mt-1.5">
                <input id="su-password" type={show ? "text" : "password"} autoComplete="new-password" className={cx(input(showErr("password")), "pr-10")} value={f.password} onChange={set("password")} onBlur={touch("password")} maxLength={72} />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600" aria-label={show ? "Hide password" : "Show password"}>
                  {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <Err>{showErr("password")}</Err>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1" aria-label="Password rules">
                {RULES.map((r) => {
                  const ok = r.test(f.password);
                  return (
                    <li key={r.label} className={cx("flex items-center gap-1 text-xs", ok ? "text-emerald-700" : "text-slate-500")}>
                      <CheckCircleIcon className={cx("h-4 w-4", ok ? "text-emerald-600" : "text-slate-300")} /> {r.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="su-phone">Phone number</Label>
              <input id="su-phone" type="tel" autoComplete="tel" autoFocus className={cx(input(showErr("phone_number")), "mt-1.5")} value={f.phone_number} onChange={set("phone_number")} onBlur={touch("phone_number")} placeholder="+251 91 234 5678" />
              <Err>{showErr("phone_number")}</Err>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="su-gender">Gender</Label>
                <select id="su-gender" className={cx(input(showErr("gender")), "mt-1.5")} value={f.gender} onChange={set("gender")} onBlur={touch("gender")}>
                  <option value="">Choose</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
                <Err>{showErr("gender")}</Err>
              </div>
              <div>
                <Label htmlFor="su-dob">Date of birth</Label>
                <input id="su-dob" type="date" max={maxBirth()} className={cx(input(showErr("date_of_birth")), "mt-1.5")} value={f.date_of_birth} onChange={set("date_of_birth")} onBlur={touch("date_of_birth")} />
                <Err>{showErr("date_of_birth")}</Err>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="su-city" optional>
                  City
                </Label>
                <input id="su-city" autoComplete="address-level2" className={cx(input(false), "mt-1.5")} value={f.city} onChange={set("city")} placeholder="Addis Ababa" />
              </div>
              <div>
                <Label htmlFor="su-country" optional>
                  Country
                </Label>
                <input id="su-country" autoComplete="country-name" className={cx(input(false), "mt-1.5")} value={f.country} onChange={set("country")} />
              </div>
            </div>
          </>
        )}
        <div className="flex gap-3">
          {step === 1 && (
            <button type="button" onClick={() => setStep(0)} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
              Back
            </button>
          )}
          <button type="submit" disabled={create.isLoading} className={primaryBtn}>
            {create.isLoading && <Spinner className="h-4 w-4" />} {step === 0 ? "Continue" : "Create account"}
          </button>
        </div>
        <p className="text-center text-xs text-slate-500">By joining you agree to keep the network respectful and to use it for alumni purposes.</p>
      </form>
    </AuthLayout>
  );
}
