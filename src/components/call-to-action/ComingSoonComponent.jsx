import { Container, Row, Col } from "reactstrap";
import { HashLink as Link } from "react-router-hash-link";
import SectionHolderComponent from "src/views/custom-components/sections/SectionHeaderComponent";

const ComingSoonComponent = () => {
  const headerMessage = "Coming Son";
  const bodyMessage = "This feature will be available soon ";
  return (
    <>
      <SectionHolderComponent title={headerMessage} body={bodyMessage} />
      <div className="flex flex-col min-h-screen">
        {" "}
        <div className="coming-soon " id="coming">
          <Container className="py-5 mt-5">
            <Row>
              <Col md="6">
                <div className="d-flex align-items-center">
                  <div>
                    <h2 className="title text-white font-weight-bold">
                      Pro Version coming soon
                    </h2>
                    <h6 className="subtitle font-light text-white">
                      We will add Pro Version with tons of great features and
                      multiple category demos which is ready to use...
                    </h6>
                    {/* <a href="/#coming" className="btn btn-outline-light m-r-20 btn-md m-t-30 font-14">Comming Soon</a> */}
                    <Link
                      to="/#coming"
                      className="btn btn-outline-light m-r-20 btn-md m-t-30 font-14"
                    >
                      Comming Soon
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default ComingSoonComponent;
