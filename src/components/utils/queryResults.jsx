import InternalErrorComponent from "./internalError";
import LoadingSpinnerComponent from "./loading";
import NotFoundComponent from "./notFound";

function QueryResult({ isError, isLoading, data, children }) {
  console.log({ data });
  if (isError) {
    return <InternalErrorComponent />;
  }
  if (isLoading) {
    return <LoadingSpinnerComponent />;
  }
  if (!data) {
    return <NotFoundComponent />;
  }
  if (data) {
    return children;
  }
}

export default QueryResult;
