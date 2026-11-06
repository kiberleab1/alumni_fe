/**
 * Account recovery pages (design board 16). The backend e-mails links to
 * /reset-password, /verify-email and /accept-invite; before these pages
 * existed every one of those links opened "page not found".
 */
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { CheckCircleIcon, EnvelopeIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { acceptInvite, apiErrorMessage, requestPasswordReset, resetPasswordWithToken, verifyEmailToken } from "src/api";
import { Spinner, cx } from "src/components/ui";

const tokenFromUrl = () => new URLSearchParams(window.location.search).get("token") || "";

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="ui-scope flex min-h-screen bg-slate-50">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-white/5" />
        <a href="/landing" className="relative text-lg font-semibold tracking-tight text-white">
          Alumni Network
        </a>
        <div className="relative">
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Stay connected with
            <br />
            the people who shaped you.
          </h1>
          <p className="mt-4 max-w-md text-sky-100">Find classmates, message your network, discover jobs and events from your institute — all in one place.</p>
        </div>
        <p className="relative text-sm text-sky-200">© {new Date().getFullYear()} Alumni Network</p>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          {children}
          <p className="mt-8 text-center text-sm text-slate-500">
            <a href="/login" className="font-semibold text-sky-700 hover:text-sky-600">
              Back to sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputCls = (bad) =>
  cx("block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 text-slate-900 ring-1 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600", bad ? "ring-rose-300" : "ring-slate-300");
const primaryBtn =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-70";

const Alert = ({ tone = "error", children }) => (
  <div role={tone === "error" ? "alert" : "status"} className={cx("mt-6 flex gap-2 rounded-lg px-4 py-3 text-sm ring-1", tone === "error" ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-emerald-50 text-emerald-800 ring-emerald-200")}>
    {tone === "error" ? <ExclamationCircleIcon className="h-5 w-5 shrink-0" /> : <CheckCircleIcon className="h-5 w-5 shrink-0" />}
    <span>{children}</span>
  </div>
);

// same rule as the API: 8+ characters with a letter and a number
const RULES = [
  { test: (p) => p.length >= 8, label: "At least 8 characters" },
  { test: (p) => /[A-Za-z]/.test(p), label: "A letter" },
  { test: (p) => /[0-9]/.test(p), label: "A number" },
];
const passwordOk = (p) => RULES.every((r) => r.test(p)) && p.length <= 72;

function NewPasswordFields({ value, onChange, confirm, onConfirm }) {
  const [show, setShow] = useState(false);
  const mismatch = confirm && confirm !== value;
  return (
    <>
      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
          New password
        </label>
        <div className="relative mt-1.5">
          <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input id="new-password" type={show ? "text" : "password"} autoComplete="new-password" autoFocus value={value} onChange={(e) => onChange(e.target.value)} className={inputCls(false)} />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        <ul className="mt-2 space-y-1" aria-label="Password rules">
          {RULES.map((r) => {
            const ok = r.test(value);
            return (
              <li key={r.label} className={cx("flex items-center gap-1.5 text-xs", ok ? "text-emerald-700" : "text-slate-500")}>
                <CheckCircleIcon className={cx("h-4 w-4", ok ? "text-emerald-600" : "text-slate-300")} /> {r.label}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
          Confirm password
        </label>
        <div className="relative mt-1.5">
          <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input id="confirm-password" type={show ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={(e) => onConfirm(e.target.value)} className={inputCls(mismatch)} aria-invalid={!!mismatch} />
        </div>
        {mismatch && <p className="mt-1 text-sm text-rose-600">Passwords don't match</p>}
      </div>
    </>
  );
}

/** /forgot-password: ask for a reset link. Always answers the same way so it can't be used to test which e-mails have accounts. */
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const m = useMutation(requestPasswordReset, { onSuccess: () => setSent(true) });
  const valid = /^\S+@\S+\.\S+$/.test(email.trim());
  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle={`If an account exists for ${email.trim()}, we've sent a link to reset your password. It's valid for 15 minutes.`}>
        <p className="mt-6 text-sm text-slate-600">
          Didn't get it? Check your spam folder, or{" "}
          <button onClick={() => setSent(false)} className="font-semibold text-sky-700 hover:text-sky-600">
            try again
          </button>
          .
        </p>
      </AuthLayout>
    );
  }
  return (
    <AuthLayout title="Reset your password" subtitle="Enter the email you sign in with and we'll send you a reset link.">
      {m.isError && <Alert>{apiErrorMessage(m.error, "Couldn't send the link. Please try again.")}</Alert>}
      <form
        className="mt-6 space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) m.mutate(email.trim());
        }}
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <div className="relative mt-1.5">
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input id="email" type="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls(false)} placeholder="you@example.com" />
          </div>
        </div>
        <button type="submit" disabled={!valid || m.isLoading} className={primaryBtn}>
          {m.isLoading && <Spinner className="h-4 w-4" />} Send reset link
        </button>
      </form>
    </AuthLayout>
  );
}

function SetPasswordPage({ title, subtitle, action, doneTitle, doneText, missingText }) {
  const token = tokenFromUrl();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const m = useMutation(action);
  if (!token) {
    return (
      <AuthLayout title={title}>
        <Alert>{missingText}</Alert>
      </AuthLayout>
    );
  }
  if (m.isSuccess) {
    return (
      <AuthLayout title={doneTitle} subtitle={doneText}>
        <a href="/login" className={cx(primaryBtn, "mt-6")}>
          Sign in
        </a>
      </AuthLayout>
    );
  }
  const ok = passwordOk(password) && password === confirm;
  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {m.isError && <Alert>{apiErrorMessage(m.error, "This link is invalid or has expired.")}</Alert>}
      <form
        className="mt-6 space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (ok) m.mutate({ token, new_password: password });
        }}
      >
        <NewPasswordFields value={password} onChange={setPassword} confirm={confirm} onConfirm={setConfirm} />
        <button type="submit" disabled={!ok || m.isLoading} className={primaryBtn}>
          {m.isLoading && <Spinner className="h-4 w-4" />} {title}
        </button>
      </form>
      {m.isError && (
        <p className="mt-4 text-center text-sm">
          <a href="/forgot-password" className="font-semibold text-sky-700 hover:text-sky-600">
            Request a new link
          </a>
        </p>
      )}
    </AuthLayout>
  );
}

/** /reset-password?token= */
export function ResetPasswordPage() {
  return (
    <SetPasswordPage
      title="Set a new password"
      subtitle="Choose a password you haven't used here before. You'll be signed out on other devices."
      action={resetPasswordWithToken}
      doneTitle="Password changed"
      doneText="Your password has been reset and other devices were signed out. Sign in with your new password."
      missingText="This reset link is incomplete. Open the link from your email again, or request a new one."
    />
  );
}

/** /accept-invite?token=  (admins invite members and staff) */
export function AcceptInvitePage() {
  return (
    <SetPasswordPage
      title="Activate your account"
      subtitle="You've been invited to your institute's alumni network. Choose a password to finish."
      action={acceptInvite}
      doneTitle="You're all set"
      doneText="Your account is active. Sign in to complete your profile."
      missingText="This invitation link is incomplete. Open the link from your email again."
    />
  );
}

/** /verify-email?token= */
export function VerifyEmailPage() {
  const token = tokenFromUrl();
  const m = useMutation(verifyEmailToken);
  const { mutate } = m;
  useEffect(() => {
    if (token) mutate(token);
  }, [token, mutate]);
  return (
    <AuthLayout title="Verify your email">
      {!token ? (
        <Alert>This verification link is incomplete. Open the link from your email again.</Alert>
      ) : m.isLoading || m.isIdle ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
          <Spinner className="h-4 w-4" /> Checking your link…
        </div>
      ) : m.isError ? (
        <Alert>{apiErrorMessage(m.error, "This link is invalid or has expired.")} Sign in and use “Resend verification email” to get a new one.</Alert>
      ) : (
        <Alert tone="success">Thanks, your email is verified.</Alert>
      )}
    </AuthLayout>
  );
}
