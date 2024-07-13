import { Row, Col, Container, Card } from "reactstrap";

const ContentCatalogComponent = ({ newsArray }) => {
  return (
    <div>
      <div className="blog-home2 spacer">
        <Container>
          <Row className="m-t-0 justify-content-center ">
            {newsArray.map((news, idx) => {
              console.log(news);
              return (
                <Col lg="4" md="6" key={idx} className="shadow-xl">
                  <Card>
                    <a href={news.link}>
                      <img
                        className="card-img-top"
                        src={news.thumbnails}
                        alt="wrappixel kit"
                      />
                    </a>
                    <div className="date-pos bg-info-gradiant">
                      {news.date.toLocaleString("default", { month: "short" })}
                      <span>{news.date.getDate()}</span>
                    </div>
                    <div className="text-center  flex  flex-col justify-items-center justify-center">
                      <h5 className="font-medium m-t-30 text-center flex justify-center flex-col">
                        <a href={news.link} className="link text-3xl ">
                          {news.header}
                        </a>
                      </h5>
                      <h6 className="text-end italic bold">
                        {news?.avenue != undefined ? news.avenue : ""}
                      </h6>
                      <div
                        dangerouslySetInnerHTML={{ __html: news.details }}
                        className="text-black  line-clamp-3 text-center justify-center"
                      ></div>
                      <a
                        href={news.link}
                        className="linking text-themecolor m-t-10"
                      >
                        Learn More <i className="ti-arrow-right"></i>
                      </a>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ContentCatalogComponent;
