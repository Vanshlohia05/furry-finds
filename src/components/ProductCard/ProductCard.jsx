import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { RWebShare } from "react-web-share";

const ProductCard = ({ title, productItem }) => {
  const dispatch = useDispatch();
  const router = useNavigate();
  
  const handelClick = () => {
    router(`/shop/${productItem.id}`);
  };

  const handelAdd = (productItem, e) => {
    e.stopPropagation();
    dispatch(addToCart({ product: productItem, num: 1 }));
    toast.success(`${productItem.productName} added to cart!`);
  };

  const openWhatsApp = (e) => {
    e.stopPropagation();
    const message = encodeURI(
      `Hi Furry Finds! I want to order "${productItem.productName}" (Price: ₹${productItem.price}). Could you please guide me on how to proceed?`
    );
    window.open(`https://wa.me/910000000000?text=${message}`, "_blank");
  };

  return (
    <Col md={3} sm={6} xs={12} className="product-col mb-4">
      <div className="product-card" onClick={handelClick}>
        {productItem.discount ? (
          <span className="card-badge discount">{productItem.discount}% Off</span>
        ) : productItem.category ? (
          <span className="card-badge category">{productItem.category}</span>
        ) : null}

        <div className="product-img-wrapper">
          <img
            loading="lazy"
            src={productItem.imgUrl}
            alt={productItem.productName || "Product"}
            className="product-img"
          />
        </div>

        <div className="product-body">
          <div className="product-rating">
            <span className="stars">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
            </span>
            <span className="rating-num">({productItem.avgRating || 4.8})</span>
          </div>

          <h3 className="product-title" title={productItem.productName}>
            {productItem.productName}
          </h3>

          <div className="product-footer">
            <div className="product-pricing">
              <span className="currency">₹</span>
              <span className="amount">{productItem.price}</span>
            </div>

            <div className="product-actions" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="action-btn whatsapp-btn"
                aria-label="Order via WhatsApp"
                title="Order directly on WhatsApp"
                onClick={openWhatsApp}
              >
                <ion-icon name="logo-whatsapp"></ion-icon>
              </button>

              <RWebShare
                data={{
                  text: productItem.shortDesc || productItem.productName,
                  title: productItem.productName,
                  url: `${window.location.origin}/shop/${productItem.id}`,
                }}
              >
                <button
                  type="button"
                  className="action-btn share-btn"
                  aria-label="Share"
                  title="Share this product"
                >
                  <ion-icon name="share-social-outline"></ion-icon>
                </button>
              </RWebShare>

              <button
                type="button"
                className="action-btn add-btn"
                aria-label="Add to Cart"
                title="Add to Cart"
                onClick={(e) => handelAdd(productItem, e)}
              >
                <ion-icon name="add"></ion-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
