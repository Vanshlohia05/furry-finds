import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./slidercard.css";

const SlideCard = ({ title, desc, cover, badge, ctaText, categoryLink }) => {
  return (
    <Container className="slide-box">
      <Row className="align-items-center">
        <Col md={6} className="slide-content">
          {badge && <span className="slide-badge">{badge}</span>}
          <h1 className="slide-title">{title}</h1>
          <p className="slide-desc">{desc}</p>
          <Link to={categoryLink || "/shop"} className="slide-btn">
            {ctaText || "Explore Shop"}
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </Link>
        </Col>
        <Col md={6} className="slide-image-col">
          <div className="slide-img-backdrop">
            <img src={cover} alt={title || "Featured Product"} className="slide-img" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SlideCard;
