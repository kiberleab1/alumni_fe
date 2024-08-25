import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { clsx } from "clsx";
import { useState } from "react";
import { useQuery } from "react-query";
import { getEventById, getImageBaseUrl, getNewsByID } from "src/api";
import QueryResult from "src/components/utils/queryResults";

function ContentPage() {
  const [searchParams] = useSearchParams();
  const contentType = searchParams.get("type");
  const contentId = searchParams.get("id");
  const [content, setContent] = useState({
    header: "",
    imgLink: "",
    subheader: "",
    content: "",
    venue: "",
    time: "",
  });

  const { data, isError, isLoading } = useQuery("getContent", async () => {
    const data = await getContent({ type: contentType, id: contentId });
    console.log(data);
    setContent({
      header: data.data.title,
      imgLink: getImageBaseUrl(data.data.image),
      subheader: data.data.title,
      content: data.data.description,
      venue: data.data.venue,
      time: data.data.time,
    });
    return data;
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col justify-items-center w-full gap-y-3 min-h-screen">
        <div
          className={clsx("static-slider-head  w-full ")}
          style={{ backgroundImage: `url(${content.imgLink})` }}
        >
          <Container className="relative inset-y-0 bottom-0  bg-gray-900 bg-opacity-30">
            <Row className="absolute inset-y-0 bottom-0 justify-content-center rounded">
              <Col className="align-self-center text-start p-6  bg-gray-900 bg-opacity-30">
                <h1 className="text-white font-medium text-sm sm:text-5xl md:text-6xl lg:text-7xl">
                  {content.header}
                </h1>
                <h4 className="text-gray-300 font-light text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  {content.subheader}
                </h4>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="flex flex-col w-full bg-light h-auto">
          <Container>
            <Row className="justify-content-end">
              <Col lg="12" md="6" className="align-self-center text-center">
                <h2 className="title text-end text-3xl">{content.venue}</h2>
                <h4 className="subtitle font-light text-end  text-red-400">
                  {new Date(content.time).toLocaleDateString()}
                </h4>
              </Col>
            </Row>
          </Container>
          <div className="justify-center flex ql-snow">
            <div
              dangerouslySetInnerHTML={{ __html: content.content }}
              className="ql-editor sm:w-3/4 lg:w-2/3 w-[80%] text-gray-700  justify-items-center justify-center flex flex-col"
              // className=" text-black w-4/5  justify-items-start justify-start flex flex-col"
            ></div>
          </div>
        </div>
      </div>
    </QueryResult>
  );
}

export default ContentPage;

async function getContent({ type, id }) {
  if (type === "news") {
    return await getNewsByID(id);
  }
  if (type === "events") {
    return await getEventById(id);
  }
  throw new Error("Unknown category");
}
