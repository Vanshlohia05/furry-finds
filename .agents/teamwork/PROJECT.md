# Project: Aww Range Storefront Enhancements

## Architecture
- Single Page Application built on React 18 (`18.2.0`), Redux Toolkit (`1.9.7`), React-Bootstrap (`2.7.4`), and React Router (`6.11.1`).
- Global styles in `src/index.css`; component-scoped styles in co-located CSS files (`navbar.css`, `searchbar.css`, `product-card.css`, `product-details.css`).
- Central Redux store in `src/app/store.js` with `cartSlice` managing `cartList` and persisting to `localStorage`.
- Catalog data in `src/utils/products.js` providing `products` array and `discoutProducts`.
- Routing in `src/App.js`: `/` (Home), `/shop` (Shop), `/shop/:id` (Product Details), `/cart` (Cart).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Scroll Listener Cleanup | Encapsulate scroll listener in `useEffect` with cleanup on unmount in `Navbar.jsx` | M1 | Survey (R1) |
| 2 | Instant Search Filtering | Immediately filter on `e.target.value` in `SearchBar.jsx` without asynchronous state lag | M1 | Survey (R2) |
| 3 | Search Reset on Clear | Reset filter to full catalog `products` when query is empty or whitespace in `SearchBar.jsx` | M1 | Survey (R2) |
| 4 | Sleek Modern Cursor | Implement modern brand-styled (`#0f3460`) custom cursor for default and interactive elements in `index.css` | M1 | Survey (R6) |
| 5 | ProductCard Hover Zoom | Enclose product image in `.product-img-container` with `overflow: hidden` and smooth hover zoom without breaking card bounds | M1 | Survey (R6) |
| 6 | Category Filter Expansion | Expand `FilterSelect.jsx` options to: "All Products", "T-Shirts", "Mugs", "Tote Bags", "Custom Gifts" | M2 | Survey (R4) |
| 7 | Full Catalog Default View | Update `Shop.jsx` initial state to display `products` (full catalog) by default | M2 | Survey (R4) |
| 8 | Multi-Category Catalog Items | Add product items in `products.js` for "Mugs", "Tote Bags", and "Custom Gifts", and align category string to "T-Shirts" | M2 | Survey (R4) |
| 9 | Home Page Category Sync | Ensure `Home.jsx` `newArrivalData` handles "T-Shirts" and "Tshirt" for smooth rendering | M2 | Survey (R4) |
| 10 | Quantity Input Selector | Re-enable `.qty-input` with integer parsing in `ProductDetails.jsx` | M3 | Survey (R3) |
| 11 | Add To Cart Button | Re-enable Redux-connected `button.add` dispatching `addToCart` and triggering `toast.success` | M3 | Survey (R3) |
| 12 | Cart Badge Counter Update | Ensure `Navbar.jsx` cart badge updates when items are added to cart | M3 | Survey (R3) |
| 13 | RWebShare Selected Product URL | Fix `<RWebShare>` data to use `url` pointing to `${window.location.origin}/shop/${selectedProduct?.id}` | M3 | Survey (R3) |
| 14 | WhatsApp Cart Order Link | Construct formatted URL-encoded order message in `Cart.jsx` with itemized items, line totals, and overall total price | M3 | Survey (R5) |
| 15 | WhatsApp Direct Product Inquiry | Construct formatted URL-encoded inquiry link in `ProductDetails.jsx` pre-filling viewed product details and quantity | M3 | Survey (R5) |
| 16 | E2E Testing Suite | Comprehensive test suite covering Tiers 1–4 (Feature, Boundary, Combinations, Workloads) | M4 | Testing Track |
| 17 | Framework & Design Integrity | Zero external CSS frameworks, strictly React 18 / Redux Toolkit / React-Bootstrap, clean build (`npm run build`) | M5 | Audit & Verif (R7) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Navigation Performance & Interactive UI | R1 (Navbar cleanup), R2 (Instant search), R6 (Modern cursor & hover zoom) | Survey complete | DONE |
| M2 | Catalog Expansion & Category Filtering | R4 (FilterSelect options, Shop full catalog default, products.js items, Home sync) | Survey complete | DONE |
| M3 | E-Commerce Purchase Flow & WhatsApp Ordering | R3 (Product details quantity & Add To Cart, RWebShare fix), R5 (WhatsApp 1-click cart & product links) | M2 (catalog items) | DONE |
| M4 | Requirement-Driven Test Suite | Opaque-box E2E test cases across Tiers 1-4 | Survey complete | DONE |
| M5 | Final Verification, Adversarial Hardening & Forensic Audit | Tier 5 adversarial tests, build verification (`npm run build`), forensic integrity audit | M1, M2, M3, M4 | DONE |

## Interface Contracts
### `FilterSelect.jsx` ↔ `Shop.jsx`
- `FilterSelect` receives `setFilterList` function from `Shop.jsx`.
- When "All Products" (value `"all"` or `"All Products"`) is selected, `FilterSelect` invokes `setFilterList(products)`.
- When a specific category is selected, `FilterSelect` invokes `setFilterList(products.filter(item => item.category === selectedOption.value))`.

### `SearchBar.jsx` ↔ `Shop.jsx`
- `SearchBar` receives `setFilterList` function from `Shop.jsx`.
- When query is empty or whitespace, calls `setFilterList(products)`.
- When query is non-empty, immediately filters `products` matching `productName.toLowerCase().includes(query.toLowerCase().trim())`.

### `ProductDetails.jsx` ↔ Redux `cartSlice`
- Dispatch payload format: `addToCart({ product: selectedProduct, num: qtyNum })` where `qtyNum` is `Math.max(1, parseInt(quantity, 10) || 1)`.
- `cartSlice.js` ensures integer arithmetic for `qty`: `productExit.qty + quantity`.

### `Cart.jsx` WhatsApp Checkout Link
- URL format: `https://wa.me/919365324146?text=${encodeURIComponent(cartMessage)}`
- Message format:
  ```
  Hello! I would like to place an order from Aww Range:

  1. <Product Name> - Qty: <Qty> - ₹<Line Total>
  ...

  Total Price: ₹<Total Price>

  Please confirm my order.
  ```

### `ProductDetails.jsx` WhatsApp Inquiry Link
- URL format: `https://wa.me/919365324146?text=${encodeURIComponent(inquiryMessage)}`
- Message format:
  ```
  Hello! I would like to inquire about/order this product:
  - Product: <Product Name> (ID: <ID>)
  - Price: ₹<Price>
  - Quantity: <Qty>
  - Total: ₹<Line Total>

  Link: <Origin>/shop/<ID>
  ```

## Code Layout
- `src/components/Navbar/Navbar.jsx`: Scroll event encapsulation and cleanup. (M1 - DONE)
- `src/components/SeachBar/SearchBar.jsx`: Instant filtering on `e.target.value`. (M1 - DONE)
- `src/components/ProductCard/ProductCard.jsx` & `product-card.css`: Image container wrapping and hover zoom. (M1 - DONE)
- `src/index.css`: Modern cursor SVG Data URIs for html/body and interactive elements. (M1 - DONE)
- `src/components/FilterSelect.jsx`: 5 category options and reset logic. (M2 - DONE)
- `src/pages/Shop.jsx`: Full catalog default state. (M2 - DONE)
- `src/utils/products.js`: Category alignment ("T-Shirts") and new products for "Mugs", "Tote Bags", "Custom Gifts". (M2 - DONE)
- `src/pages/Home.jsx`: Category matching for New Arrivals. (M2 - DONE)
- `src/components/ProductDetails/ProductDetails.jsx`: Quantity input, Add To Cart, WhatsApp link, RWebShare. (M3 - DONE)
- `src/app/features/cart/cartSlice.js`: Integer quantity arithmetic in `addToCart` and defensive `decreaseQty`. (M3 - DONE)
- `src/pages/Cart.jsx`: WhatsApp checkout URL with itemized order message. (M3 - DONE)
- `src/__tests__/`: Comprehensive requirement and adversarial test suites. (M4, M5 - DONE)
