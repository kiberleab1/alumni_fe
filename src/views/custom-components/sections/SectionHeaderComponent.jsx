import { Container, Row, Col } from "reactstrap";

function SectionHolderComponent({ title, body }) {
  return (
    <div className="spacer bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md="7" className="text-center">
            <h1 className="title font-bold">{title}</h1>

            <h6 className="subtitle">{body}</h6>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SectionHolderComponent;
