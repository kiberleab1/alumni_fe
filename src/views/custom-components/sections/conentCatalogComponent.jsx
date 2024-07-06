import { Row, Col, Container, Card } from "reactstrap";

const ContentCatalogComponent = ({ newsArray }) => {
  return (
    <div>
      <div className="blog-home2 spacer">
        <Container>
          <Row className="justify-content-center">
            <Col md="8" className="text-center">
              <h3 className="title">Recent News</h3>
              <h6 className="subtitle">This is what happened now a day</h6>
            </Col>
          </Row>
          <Row className="m-t-40 justify-content-center">
            {newsArray.map((news, idx) => {
              return (
                <Col lg="4" md="6" key={idx}>
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
                    <h5 className="font-medium m-t-30">
                      <a href={news.link} className="link">
                        {news.header}
                      </a>
                    </h5>
                    <div
                      dangerouslySetInnerHTML={{ __html: news.detail }}
                      className="bg-yellow-50 text-black w-4/5 line-clamp-2"
                    ></div>
                    <a
                      href={news.link}
                      className="linking text-themecolor m-t-10"
                    >
                      Learn More <i className="ti-arrow-right"></i>
                    </a>
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
