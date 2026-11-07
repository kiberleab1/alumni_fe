import { JobForm } from "src/pages/admin/forms/ContentForms";

export default function CreateJob({ goTo }) {
  return <JobForm onDone={() => goTo?.("Jobs")} />;
}
