import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../app/features/cart/cartSlice";
import "./product-details.css";
import { RWebShare } from "react-web-share";

const ProductDetails = ({ selectedProduct }) => {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };
  const handleAdd = (product, qty) => {
    const qtyNum = Math.max(1, parseInt(qty, 10) || 1);
    dispatch(addToCart({ product, num: qtyNum }));
    toast.success("Product has been added to cart!");
  };

  const qtyNum = Math.max(1, parseInt(quantity, 10) || 1);
  const lineTotal = (selectedProduct?.price || 0) * qtyNum;
  const inquiryMessage = `Hello! I would like to inquire about/order this product:\n- Product: ${selectedProduct?.productName} (ID: ${selectedProduct?.id})\n- Price: ₹${selectedProduct?.price}\n- Quantity: ${qtyNum}\n- Total: ₹${lineTotal}\n\nLink: ${window.location.origin}/shop/${selectedProduct?.id}`;
  const whatsappProductUrl = `https://wa.me/919365324146?text=${encodeURIComponent(inquiryMessage)}`;

  return (
    <section className="product-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <img loading="lazy" src={selectedProduct?.imgUrl} alt="" />
          </Col>
          <Col md={6}>
            <h2>{selectedProduct?.productName}</h2>
            <div className="rate">
              <div className="stars">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>
              <span>{selectedProduct?.avgRating} ratings</span>
            </div>
            <div className="info">
              <span className="price">₹ {selectedProduct?.price}</span>
              <span>Category:&nbsp;{selectedProduct?.category}</span>
            </div>
            <p>{selectedProduct?.shortDesc}</p>
            <p>{selectedProduct?.description}</p>

            <input
              className="qty-input"
              type="number"
              min="1"
              placeholder="Qty"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <button
              aria-label="Add"
              type="submit"
              className="add"
              onClick={() => handleAdd(selectedProduct, quantity)}
            >
              Add To Cart
            </button>
            <h5>Please order through whatsapp by clicking below.</h5>          
            <button className="wpsx">
              <a
                href={whatsappProductUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wpsx"
              >
                Whatsapp Link
              </a>                   
            </button>  

            <div>
              <RWebShare
                data={{
                  text: selectedProduct?.shortDesc,
                  title: selectedProduct?.productName,
                  url: `${window.location.origin}/shop/${selectedProduct?.id}`,
                }}   
              >
                <button
                  className="share"
                  aria-label="Share"
                > 
                  <ion-icon name="share"></ion-icon>Share
                </button>
              </RWebShare>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductDetails;
