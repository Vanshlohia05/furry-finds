// import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { addToCart } from "../../app/features/cart/cartSlice";
import "./product-details.css";
import { RWebShare } from "react-web-share";

const ProductDetails = ({ selectedProduct }) => {
  // const dispatch = useDispatch();

  // const [quantity, setQuantity] = useState(1);
  // const handleQuantityChange = (e) => {
  //   setQuantity(e.target.value);
  // };
  // const handelAdd = (selectedProduct, quantity) => {
  //   dispatch(addToCart({ product: selectedProduct, num: quantity }));
  //   toast.success("Product has been added to cart!");
  // };

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

            {/* <input
              className="qty-input"
              type="number"
              placeholder="Qty"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <button
              aria-label="Add"
              type="submit"
              className="add"
              onClick={() => handelAdd(selectedProduct, quantity)}
            >
              Add To Cart <br/>
            </button> */}
         <h5>Please order through whatsapp by clicking below.</h5>          
            <button className="wpsx">
              <a href="https://wa.me/+919365324146" className="btn btn-wpsx">
                            Whatsapp Link
                  </a>                   
                
              </button>  

                   <div>
                        <RWebShare
                              data={{
                                src: `./shop/\${productItem.id}`,
                              }}   
                        >
                          <button
                          className="share"
                            aria-label="Share"
                          > <ion-icon name="share"></ion-icon>Share
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
