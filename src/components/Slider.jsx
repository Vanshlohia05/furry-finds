import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container } from "react-bootstrap";
import SlideCard from "./SliderCard/SlideCard";
import { SliderData } from "../utils/products";

const SliderHome = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: false,
    pauseOnHover: true,
  };
  return (
    <section className="homeSlide">
      <Container>
        <Slider {...settings}>
          {SliderData.map((value, index) => (
            <SlideCard
              key={value.id || index}
              title={value.title}
              badge={value.badge}
              cover={value.cover}
              desc={value.desc}
              ctaText={value.ctaText}
              categoryLink={value.categoryLink}
            />
          ))}
        </Slider>
      </Container>
    </section>
  );
};

export default SliderHome;
