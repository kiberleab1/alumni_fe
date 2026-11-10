/** Send an email to everyone in one institution or department. */
import { useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { createEmailTemplates, sendEmail } from "src/api";
import { Button, Card, Field, Modal, PageHeader, Segmented, apiError, inputClass } from "src/components/ui";
import { plainText, useDepartments, useInstitutes } from "../kit";

const QUILL = { toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "blockquote"], [{ list: "ordered" }, { list: "bullet" }], ["link"], ["clean"]] };

export default function ComposeEmail() {
  const [type, setType] = useState("institution");
  const [target, setTarget] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const [confirming, setConfirming] = useState(false);
  const { data: institutes = [] } = useInstitutes();
  const { data: departments = [] } = useDepartments();
  const options = type === "institution" ? institutes : departments;
  const targetName = options.find((o) => o.value === target)?.label;

  const send = useMutation(
    async () => {
      const t = await createEmailTemplates({ header: subject, body });
      await sendEmail({ email_template_id: t.data.id, email_filtering_options: { option_type: type, option_value: target, email_blast_option: "one_time" } });
    },
    {
      onSuccess: () => {
        toast.success(`Email sent to ${targetName}`);
        setConfirming(false);
        setSubject("");
        setBody("");
        setTarget("");
      },
      onError: (e) => {
        setConfirming(false);
        toast.error(apiError(e, "Couldn't send the email. Try again."));
      },
    },
  );

  const review = (e) => {
    e.preventDefault();
    const next = {};
    if (!target) next.target = `Choose a ${type}`;
    if (!subject.trim()) next.subject = "Add a subject";
    if (!plainText(body)) next.body = "Write a message";
    setErrors(next);
    if (!Object.keys(next).length) setConfirming(true);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Email" subtitle="Send a message to a whole institution or department." />
      <form onSubmit={review} noValidate className="mt-6">
        <Card className="space-y-5 p-5 sm:p-6">
          <Field label="Send to">
            <div className="space-y-3">
              <Segmented
                label="Audience type"
                value={type}
                onChange={(v) => (setType(v), setTarget(""))}
                options={[
                  { value: "institution", label: "Institution" },
                  { value: "department", label: "Department" },
                ]}
              />
            </div>
          </Field>
          <Field label={type === "institution" ? "Institution" : "Department"} htmlFor="email-target" error={errors.target}>
            <select id="email-target" className={inputClass} value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="">Select…</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Subject" htmlFor="email-subject" error={errors.subject}>
            <input id="email-subject" className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </Field>
          <Field label="Message" error={errors.body}>
            <ReactQuill theme="snow" modules={QUILL} value={body} onChange={setBody} />
          </Field>
          <div className="flex justify-end">
            <Button type="submit">
              <PaperAirplaneIcon className="h-4 w-4" /> Review and send
            </Button>
          </div>
        </Card>
      </form>
      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Send this email?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Keep editing
            </Button>
            <Button loading={send.isLoading} onClick={() => send.mutate()}>
              Send now
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-slate-600">
          "<span className="font-semibold text-slate-900">{subject}</span>" will go to everyone in <span className="font-semibold text-slate-900">{targetName}</span>. Sent emails can't be recalled.
        </p>
      </Modal>
    </div>
  );
}
