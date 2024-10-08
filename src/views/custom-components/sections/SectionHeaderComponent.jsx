import { Container, Row, Col } from "reactstrap";
import H1Heading from "src/components/headerHs/header";

function SectionHolderComponent({ title, body }) {
  return (
    <div className="">
      <Container>
        <Row className="justify-content-center">
          <Col md="7" className="text-center mt-3  w-auto">
            <H1Heading title={title || "Our Story"} />

            {/* <h1 className="title  text-1xl sm:text-2xl md:text-3xl lg:text-4xl font-sans">
              {title}
            </h1> */}
            <h6 className="subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans-serif">
              {/* {body} */}
            </h6>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SectionHolderComponent;
