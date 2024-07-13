import { useQuery } from "react-query";
import { Col, Container, Row } from "reactstrap";
import { getAllStaff, getImageBaseUrl } from "src/api";
import QueryResult from "src/components/utils/queryResults";

const TeamComponent = () => {
  const { isLoading, data, isError } = useQuery("team", async () => {
    return await getAllStaff({ pageNumber: 1, pageSize: 4 });
  });
  const parseData = (data) =>
    data.split(", ").reduce((acc, item) => {
      const [key, value] = item.split(":");
      acc[key] = value;
      return acc;
    }, {});

  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <div>
        <div className="spacer bg-light">
          <Container>
            <Row className="justify-content-center">
              <Col md="7" className="text-center">
                <h1 className="title font-bold">Team</h1>
                <h6 className="subtitle">
                  Here you can check Demos we created based on WrapKit. Its
                  quite easy to Create your own dream website &amp; dashboard in
                  No-time.
                </h6>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="spacer team2">
          <Container>
            <Row className="justify-content-center">
              <Col md="7" className="text-center">
                <h2 className="title">Experienced & Professional Team</h2>
                <h6 className="subtitle">
                  You can relay on our amazing features list and also our
                  customer services will be great experience for you without
                  doubt and in no-time
                </h6>
              </Col>
            </Row>
            <Row>
              {data?.data.staff.map((staff) => {
                const contactInfo = parseData(staff.contact_info);
                console.log(contactInfo);
                return (
                  <Col lg="3" md="6" className="m-b-30" key={staff.id}>
                    <div className="block rounded-lg bg-slate-100 shadow-secondary-1 dark:bg-surface-dark">
                      <a href="#!">
                        <img
                          className="rounded-t-lg w-full"
                          src={getImageBaseUrl(staff.photo)}
                          alt=""
                        />
                      </a>
                      <div className="p-6 text-surface dark:text-white flex flex-col justify-center justify-items-center">
                        <h5 className="mb-2 text-xl font-medium leading-tight">
                          {staff.title}
                        </h5>
                        <p className="mb-4 text-base">{staff.description}</p>
                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <a href={contactInfo.facebook}>
                              <i className="fa fa-facebook"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href={contactInfo.twitter}>
                              <i className="fa fa-twitter"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href={contactInfo.linkedin}>
                              <i className="fa fa-linkedin"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href={contactInfo.telegram}>
                              <i className="fa fa-telegram"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </div>
      </div>
    </QueryResult>
  );
};

export default TeamComponent;
