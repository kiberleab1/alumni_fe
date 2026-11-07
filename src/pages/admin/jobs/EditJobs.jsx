import { JobForm } from "src/pages/admin/forms/ContentForms";

export default function EditJob({ job, goTo }) {
  return <JobForm key={job?.id} job={job} onDone={() => goTo?.("Jobs")} />;
}
