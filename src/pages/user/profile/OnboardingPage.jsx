/**
 * First-run setup (design board: Onboarding). Three short steps right after a
 * member's first sign-in: studies -> what you do now -> make it yours. Step 1
 * creates the alumni profile; the rest is optional and can be skipped.
 */
import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { AcademicCapIcon, BriefcaseIcon, CameraIcon, CheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { finishOnboarding, getMyProfile, saveMyProfile, savePosition, uploadProfilePhoto } from "src/api";
import { PATHS } from "src/lib/nav";
import { Avatar, Button, Card, Field, Spinner, Switch, TagInput, apiError, cx, inputClass } from "src/components/ui";
import { SKILL_SUGGESTIONS } from "./ProfilePage";

const STEPS = [
  { title: "Your studies", icon: AcademicCapIcon },
  { title: "What you do now", icon: BriefcaseIcon },
  { title: "Make it yours", icon: SparklesIcon },
];

function Steps({ step }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {STEPS.map((s, i) => (
        <li key={s.title} className="flex flex-1 items-center gap-2">
          <span
            aria-current={i === step ? "step" : undefined}
            className={cx(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
              i < step ? "bg-brand text-white" : i === step ? "bg-brand-soft text-link ring-2 ring-brand" : "bg-slate-100 text-slate-400"
            )}
          >
            {i < step ? <CheckIcon className="h-4 w-4" /> : i + 1}
          </span>
          <span className={cx("hidden text-sm font-medium sm:block", i === step ? "text-slate-900" : "text-slate-500")}>{s.title}</span>
          {i < STEPS.length - 1 && <span className={cx("h-px flex-1", i < step ? "bg-brand" : "bg-slate-200")} />}
        </li>
      ))}
    </ol>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery("myProfile", getMyProfile);
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const [studies, setStudies] = useState({ department_id: "", degree: "", graduation_year: "" });
  const [work, setWork] = useState({ title: "", company: "", headline: "", open: false });
  const [about, setAbout] = useState({ skills: [], bio: "" });
  const photoRef = useRef(null);

  const save = useMutation(saveMyProfile, {
    onSuccess: (d) => queryClient.setQueryData("myProfile", d),
  });
  const photo = useMutation(uploadProfilePhoto, {
    onSuccess: (d) => (queryClient.setQueryData("myProfile", d), toast.success("Looking good!")),
    onError: (e) => toast.error(apiError(e, "Couldn't upload the photo. You can add it later from your profile.")),
  });
  const done = () => {
    queryClient.invalidateQueries("myProfile");
    queryClient.invalidateQueries("userProfile");
    queryClient.invalidateQueries("myCareer");
    navigate(PATHS.home, { replace: true });
  };
  const skip = async () => {
    await finishOnboarding().catch(() => {});
    queryClient.setQueryData("myProfile", (d) => (d ? { ...d, onboarding: { needed: false } } : d));
    done();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }
  // already set up (e.g. opened the link again): go to the profile
  if (data?.profile && step === 0) return <Navigate to={PATHS.profile} replace />;

  const years = Array.from({ length: new Date().getFullYear() + 6 - 1960 }, (_, i) => new Date().getFullYear() + 5 - i);
  const first = data?.user?.first_name || "there";

  const next = async (e) => {
    e?.preventDefault();
    setError(null);
    try {
      if (step === 0) {
        if (!studies.department_id || !studies.degree.trim() || !studies.graduation_year) return setError("Choose your department, degree and graduation year");
        await save.mutateAsync({ ...studies, graduation_year: Number(studies.graduation_year) });
      } else if (step === 1) {
        if (work.title.trim()) {
          await savePosition({ title: work.title.trim(), company: work.company.trim(), is_current: true, start_date: null, visibility: "members" });
        }
        const headline = work.headline.trim() || (work.title.trim() ? [work.title.trim(), work.company.trim()].filter(Boolean).join(" at ") : "");
        await save.mutateAsync({ ...(headline && { headline: headline.slice(0, 120) }), open_to_opportunities: work.open });
      } else {
        await save.mutateAsync({ skills: about.skills, bio: about.bio, finish_onboarding: true });
        toast.success(`Welcome aboard, ${first}!`);
        return done();
      }
      setStep((s) => s + 1);
    } catch (err) {
      setError(apiError(err));
    }
  };

  const busy = save.isLoading;
  return (
    <div className="ui-scope mx-auto max-w-2xl py-2 sm:py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {first} 👋</h1>
        <p className="mt-1 text-sm text-slate-500">A few details help classmates find you{data?.institute?.name ? ` on ${data.institute.name}'s alumni network` : ""}. It takes about a minute.</p>
      </div>
      <Card className="p-5 sm:p-8">
        <Steps step={step} />
        <form onSubmit={next} className="mt-8 space-y-5" noValidate>
          {step === 0 && (
            <>
              <h2 className="text-lg font-semibold text-slate-900">Where did you study?</h2>
              <Field label="Department" htmlFor="ob-dept">
                <select id="ob-dept" className={inputClass} value={studies.department_id} onChange={(e) => setStudies({ ...studies, department_id: e.target.value })} autoFocus>
                  <option value="">Choose your department</option>
                  {(data?.departments || []).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Degree" htmlFor="ob-degree" className="sm:col-span-2">
                  <input id="ob-degree" className={inputClass} value={studies.degree} onChange={(e) => setStudies({ ...studies, degree: e.target.value })} placeholder="e.g. BSc Accounting" maxLength={120} />
                </Field>
                <Field label="Graduation year" htmlFor="ob-year">
                  <select id="ob-year" className={inputClass} value={studies.graduation_year} onChange={(e) => setStudies({ ...studies, graduation_year: e.target.value })}>
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <p className="text-xs text-slate-500">We'll add you to your class and department groups automatically.</p>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-slate-900">What do you do now?</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Job title" htmlFor="ob-title" hint="Optional">
                  <input id="ob-title" className={inputClass} value={work.title} onChange={(e) => setWork({ ...work, title: e.target.value })} placeholder="e.g. Junior Accountant" autoFocus maxLength={150} />
                </Field>
                <Field label="Company or organisation" htmlFor="ob-company" hint="Optional">
                  <input id="ob-company" className={inputClass} value={work.company} onChange={(e) => setWork({ ...work, company: e.target.value })} placeholder="e.g. Commercial Bank of Ethiopia" maxLength={150} />
                </Field>
              </div>
              <Field label="Headline" htmlFor="ob-headline" hint="Shown under your name. Leave empty to use your job title.">
                <input id="ob-headline" className={inputClass} value={work.headline} onChange={(e) => setWork({ ...work, headline: e.target.value })} placeholder={work.title ? [work.title, work.company].filter(Boolean).join(" at ") : "e.g. Looking for my first role in finance"} maxLength={120} />
              </Field>
              <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Open to opportunities</p>
                  <p className="text-sm text-slate-500">Shows a badge so alumni know you'd welcome referrals and job leads.</p>
                </div>
                <Switch checked={work.open} onChange={(v) => setWork({ ...work, open: v })} label="Open to opportunities" />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-slate-900">Make it yours</h2>
              <div className="flex items-center gap-4">
                <Avatar name={data?.user?.name || first} photo={data?.profile?.photo} size="lg" />
                <div>
                  <Button variant="secondary" loading={photo.isLoading} onClick={() => photoRef.current?.click()}>
                    <CameraIcon className="h-4 w-4" /> {data?.profile?.photo ? "Change photo" : "Add a photo"}
                  </Button>
                  <p className="mt-1 text-xs text-slate-500">Profiles with a photo get far more connection requests.</p>
                </div>
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f && f.size > 5 * 1024 * 1024) return toast.error("Choose an image under 5 MB");
                    if (f) photo.mutate(f);
                  }}
                />
              </div>
              <Field label="Skills" htmlFor="ob-skills">
                <TagInput id="ob-skills" value={about.skills} onChange={(skills) => setAbout({ ...about, skills })} suggestions={SKILL_SUGGESTIONS} placeholder="Add a skill and press Enter" />
              </Field>
              <Field label="A short bio" htmlFor="ob-bio" hint="Optional">
                <textarea id="ob-bio" rows={3} className={inputClass} value={about.bio} onChange={(e) => setAbout({ ...about, bio: e.target.value })} maxLength={2000} placeholder="What you do, and what you could help classmates with" />
              </Field>
            </>
          )}
          {error && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={step === 0 ? skip : () => (step === 2 ? next() : setStep(step + 1))} className="text-sm font-medium text-slate-500 hover:text-slate-800">
              {step === 0 ? "I'll do this later" : "Skip this step"}
            </button>
            <div className="flex gap-2">
              {/* step 1 already created the profile, so "back" only goes from 3 to 2 */}
              {step > 1 && (
                <Button variant="secondary" onClick={() => setStep(step - 1)} disabled={busy}>
                  Back
                </Button>
              )}
              <Button type="submit" loading={busy}>
                {step === 2 ? "Finish" : "Continue"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
