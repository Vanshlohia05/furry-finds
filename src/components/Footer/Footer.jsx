import React from "react"
import "./style.css"
import { Col, Container, Row } from "react-bootstrap"

const Footer = () => {
  return (
    <footer>
        <Container>
          <Row className="footer-row">
            <Col md={3} sm={5} className='box'>
              <div className="logo">
                  <ion-icon name="paw"></ion-icon>
                  <h1>Furry Finds</h1>
              </div>
              <h2>About Us</h2>

              <p>Furry Finds is a hyper-minimalist online shop — browse, pick, and order entirely via WhatsApp. No fuss, no forms. Just tap, chat, and we'll handle the rest.</p>


            </Col>
            <Col md={3} sm={5} className='box'>
              <h2>Privacy Policy</h2>
              <ul>
                <li>1. We collect your name and address for orders and service.</li>
                <li>2. Data is used only for orders, updates, and improvements.</li>
                <li>3. Data shared only with trusted delivery partners.</li>
              </ul>
              <h2>Steps to Buy</h2>
              <ul>
                <li>1. Select your favorite product.</li>
                <li>2. Copy the product name.</li>
                <li>3. Tap the WhatsApp icon from the cart.</li>
                <li>4. Share product details, name, and address via WhatsApp.</li>
                <li>5. Our team will confirm and guide you further.</li>
              </ul>
            </Col>
            <Col md={3} sm={5} className='box'>
              <h2>Terms &amp; Conditions</h2>
              <ul>
                <li>Payment: Full UPI payment required at checkout.</li>
                <li>Cancellations: Within 24 hours for non-custom items; no refunds for custom orders.</li>
                <li>Delivery: Not liable for unforeseen delays.</li>
                <li>Returns: Only for damaged or incorrect items.</li>
                <li>Refunds: Within 7-10 business days after verification.</li>
              </ul>
            </Col>
            <Col md={3} sm={5} className='box'>
              <h2>Reach Us</h2>
              <ul>
                <li>Somewhere in India 🇮🇳</li>
                <li>📞 +91 00000 00000</li>
                <li className="wpsx"><button className="wpsx">
              <a href="https://wa.me/910000000000" className="btn btn-wpsx">
                            💬 Chat on WhatsApp
                  </a>                   
                
              </button>   </li>
              </ul>
            </Col>
          </Row>
        </Container>
    </footer>
  )
}

export default Footer
