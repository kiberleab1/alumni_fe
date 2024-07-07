//TODO finish this page

import { useQuery } from "react-query";
import { getWebContentByComonent } from "src/api";
import QueryResult from "src/components/utils/queryResults";

function AboutUsPage() {
  const { isError, data, isLoading } = useQuery("aboutUs", async () => {
    return await getWebContentByComonent({ component: "aboutus" });
  });

  return (
    <>
      <QueryResult isError={isError} data={data} isLoading={isLoading}>
        <div></div>
      </QueryResult>
    </>
  );
}

export default AboutUsPage;
