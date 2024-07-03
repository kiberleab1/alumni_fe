import { useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
//url  = http://localhost:3000/main/ride?type=send
import { clsx } from "clsx";
import img from "src/assets/images/landingpage/banner-bg.jpg";

import { useQuery } from "react-query";
import QueryResult from "src/components/utils/queryResults";

function ContentPage() {
  const [searchParams] = useSearchParams();
  const contentType = searchParams.get("type");
  const contentId = searchParams.get("id");

  const { data, isError, isLoading } = useQuery("getContent", async () => {
    return await getContent({ type: contentType, id: contentId });
  });

  return (
    <QueryResult isError={isError} isLoading={isLoading} data={data}>
      <div className="flex flex-col justify-center justify-items-center w-full gap-y-3">
        <div
          className={clsx("static-slider-head  w-full ")}
          style={{ backgroundImage: `url(${img})` }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg="12" md="6" className="align-self-center text-center">
                <h1 className="title">{data.header}</h1>
                <h4 className="subtitle font-light">{data.subheader}</h4>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="justify-items-center justify-center flex">
          <div
            dangerouslySetInnerHTML={{ __html: data.conetnt }}
            className="bg-yellow-50 text-black w-4/5 "
          ></div>
        </div>
      </div>
    </QueryResult>
  );
}

export default ContentPage;

async function getContent({ type, id }) {
  return {
    header: "Life is boring and you should just give up",
    subheader: "Skip tell you",
    bannerImage: img,
    conetnt: "<p>This is a parageraphs</p>",
  };
}
