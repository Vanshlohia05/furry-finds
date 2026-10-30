# Original User Request

## 2026-10-03T16:23:20Z

This is a single self-contained set of fixes and feature additions for the Aww Range e-commerce application. Enhance the storefront by restoring the product-page Add-to-Cart functionality, expanding category filters, eliminating the navigation scroll memory leak, correcting search filtering lag, automating 1-click WhatsApp order generation, adding a modern cursor style, and implementing an image zoom on hover for catalog product cards while strictly preserving the existing visual design and using only React 18, Redux Toolkit, and React-Bootstrap.

Working directory: d:/VS CODE/awwrange/awwrange
Integrity mode: development

## Requirements

### R1. Navigation Performance & Cleanup
Eliminate the scroll memory leak in src/components/Navbar/Navbar.jsx by properly encapsulating the scroll event listener inside a useEffect hook with a cleanup function on unmount.

### R2. Instant Search Responsiveness
Correct the state lag in src/components/SeachBar/SearchBar.jsx by immediately filtering on the incoming input value rather than reading asynchronous state, and resetting the filter when the query is cleared.

### R3. Product Details Purchase Flow
Re-enable the quantity input selector and the Redux-connected "Add To Cart" button in src/components/ProductDetails/ProductDetails.jsx using existing CSS classes (.qty-input and .add). Correct the share URL logic in <RWebShare> to reference the selected product.

### R4. Category Filter Expansion
Expand src/components/FilterSelect.jsx options to include All Products, T-Shirts, Mugs, Tote Bags, and Custom Gifts. Ensure src/utils/products.js contains corresponding items for these categories and that src/pages/Shop.jsx displays the full catalog by default.

### R5. Automated 1-Click WhatsApp Ordering
In src/pages/Cart.jsx, update the WhatsApp checkout link to automatically construct a formatted, URL-encoded order message detailing each cart item (name, quantity, line total) and overall cart total. On the product details page, ensure the direct WhatsApp inquiry pre-fills the viewed product's details.

### R6. Modern Cursor & Catalog Hover Zoom
Add a sleek, modern cursor style across the application. On catalog product cards (ProductCard), implement a smooth and responsive zoom effect when hovering over the product image that magnifies the image smoothly within its frame without breaking card boundaries.

### R7. Framework & Design Integrity Constraint
Strictly maintain the existing visual layout, color palette, animations, and CSS classes. Only React 18, Redux Toolkit, and React-Bootstrap may be used; do not introduce external styling libraries or alternative frameworks.

## Acceptance Criteria

### Performance & Usability
- [ ] No uncleaned window.addEventListener("scroll") calls in Navbar.jsx.
- [ ] Typing in the shop search input filters the product list accurately from the first character without delay.
- [ ] A modern, polished cursor style is visible across the site.
- [ ] Hovering over catalog product images zooms in smoothly without overflowing card boundaries.

### E-Commerce Flow
- [ ] On /shop/:id, the quantity selector allows picking a number and clicking "Add To Cart" dispatches to Redux, triggers toast notification, and increments the navbar cart count.
- [ ] Selecting different categories in FilterSelect.jsx correctly filters products by category.
- [ ] Clicking the WhatsApp button in the cart opens https://wa.me/919365324146?text=... with the itemized cart list and total price formatted in the text.
- [ ] The build succeeds (npm run build) with zero compilation errors.
