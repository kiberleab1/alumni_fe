import { Carousel } from "reactstrap";

const Slider = () => {
  return (
    <div>
      <Carousel>
        <Carousel.Item interval={1000}>
          <img src="../../assets/images/slider/slide1.avif" alt="slider 1" />
          <Carousel.Caption>
            <h3>Slide 1</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={500}>
          <img src="../../assets/images/slider/slide2.jpg" alt="slider 2" />
          <Carousel.Caption>
            <h3>Slider 2</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src="../../assets/images/slider/slide3.jpg" alt="slider 3" />
          <Carousel.Caption>
            <h3>Slider 3</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Slider;
