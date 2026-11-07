import { NewsForm } from "src/pages/admin/forms/ContentForms";

export default function CreateNews({ goTo }) {
  return <NewsForm onDone={() => goTo?.("News")} />;
}
