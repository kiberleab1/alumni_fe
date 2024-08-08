import { Col, Container, Row } from "reactstrap";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      {/* <div className="spacer bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h1 className="title font-bold">Call-2-Action</h1>
              <h6 className="subtitle">
                Here you can check Demos we created based on WrapKit. Its quite
                easy to Create your own dream website &amp; dashboard in
                No-time.
              </h6>
            </Col>
          </Row>
        </Container>
      </div> */}
      {/* <div className="mini-spacer bg-info text-white c2a7">
        <Container>
          <div className="d-flex justify-content-between">
            <div className="display-7 align-self-center">
              Are you happy with what we offer? Ask for Free Quote
            </div>
            <div className="ms-auto m-t-10 m-b-10">
              <button className="btn btn-outline-light btn-md">
                Ask for Quatation
              </button>
            </div>
          </div>
        </Container>
      </div> */}
      <div className="bg-gray-800 text-white py-6">
        <Container>
          <Row className="flex flex-col md:flex-row justify-between">
            <Col md="3" className="mb-4 md:mb-0">
              <h5 className="font-bold text-lg mb-2">Contact Us</h5>
              <p className="text-sm md:text-base">
                123 Main Street, City, Country
              </p>
              <p className="text-sm md:text-base">Phone: (123) 456-7890</p>
              <p className="text-sm md:text-base">Email: info@example.com</p>
            </Col>

            <Col md="3" className="mb-4 md:mb-0">
              <h5 className="font-bold text-lg mb-2">Quick Links</h5>
              <ul className="text-sm md:text-base">
                <li>
                  <a href="/landing" className="hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/landing/aboutus" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/landing/events" className="hover:underline">
                    Program & Events
                  </a>
                </li>
              </ul>
            </Col>

            <Col md="3" className="mb-4 md:mb-0">
              <h5 className="font-bold text-lg mb-2">Follow Us</h5>
              <div className="flex space-x-4 justify-center">
                <a
                  href="#"
                  className="text-white hover:text-gray-400 text-xl md:text-2xl"
                >
                  <FaFacebook />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 text-xl md:text-2xl"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 text-xl md:text-2xl"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-400 text-xl md:text-2xl"
                >
                  <FaInstagram />
                </a>
              </div>
            </Col>

            <Col md="3" className="mb-4 md:mb-0 text-center">
              <h5 className="font-bold text-lg mb-2">Download Our App</h5>
              <div className="flex flex-col items-center space-y-2">
                <a href="#" className="flex items-center space-x-2">
                  <FaApple className="text-white text-2xl" />
                  <span className=" sm:inline-block">
                    Download on the App Store
                  </span>
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center text-center space-x-2"
                >
                  <FaGooglePlay className="text-white text-2xl" />
                  <span className=" sm:inline-block">
                    Get it on Google Play
                  </span>
                </a>
              </div>
            </Col>
          </Row>

          <div className="text-center mt-4 text-sm md:text-base">
            <p>
              &copy; {new Date().getFullYear()} Your Company. All rights
              reserved.
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
