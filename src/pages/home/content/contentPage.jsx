import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
//url  = http://localhost:3000/main/ride?type=send
import { clsx } from "clsx";
import img from "src/assets/images/landingpage/banner-bg.jpg";

import { useQuery } from "react-query";
import QueryResult from "src/components/utils/queryResults";
import { getImageBaseUrl, getNewsByID } from "src/api";
import { useState } from "react";

function ContentPage() {
  const [searchParams] = useSearchParams();
  const contentType = searchParams.get("type");
  const contentId = searchParams.get("id");
  const [content, setContent] = useState({
    header: "",
    imgLink: "",
    subheader: "",
    content: "",
  });

  const { data, isError, isLoading } = useQuery("getContent", async () => {
    const data = await getContent({ type: contentType, id: contentId });
    console.log(data);
    setContent({
      header: data.data.title,
      imgLink: getImageBaseUrl(data.data.image),
      subheader: data.data.title,
      content: data.data.description,
    });
    return data;
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col justify-center justify-items-center w-full gap-y-3">
        <div
          className={clsx("static-slider-head  w-full ")}
          style={{ backgroundImage: `url(${content.imgLink})` }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg="12" md="6" className="align-self-center text-center">
                <h1 className="title">{content.header}</h1>
                <h4 className="subtitle font-light">{content.subheader}</h4>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="justify-items-center justify-center flex w-full bg-yellow-50">
          <div
            dangerouslySetInnerHTML={{ __html: content.content }}
            className=" text-black w-4/5 "
          ></div>
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
  throw new Error("Unknown category");
}
