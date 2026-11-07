import { NewsForm } from "src/pages/admin/forms/ContentForms";

export default function EditNews({ news, goTo }) {
  return <NewsForm key={news?.id} news={news} onDone={() => goTo?.("News")} />;
}
