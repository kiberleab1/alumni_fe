import { Container, Row, Col } from "reactstrap";

function SectionHolderComponent({ title, body }) {
  return (
    <div className="spacer  bg-gray-100">
      <Container>
        <Row className="justify-content-center">
          <Col md="7" className="text-center">
            <h1 className="title f text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-sans">
              {title}
            </h1>

            <h6 className="subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans-serif">
              {body}
            </h6>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SectionHolderComponent;
