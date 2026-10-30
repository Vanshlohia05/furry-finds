# Technical Survey & Handoff Report: R1, R2, and R6

**Date**: 2026-10-03T16:35:00Z  
**Author**: `teamwork_preview_explorer_survey_1`  
**Recipient**: `teamwork_preview_orchestrator_1` (Conversation ID: `c2d61f7e-6e73-44c4-bc6b-0fa92b48203d`)  
**Scope**: Technical investigation and fix specifications for Requirements R1, R2, and R6.

---

## 1. Observation

### R1. Navigation Performance & Cleanup
- **Target File**: `src/components/Navbar/Navbar.jsx`
- **Line 1**:
  ```javascript
  import {  useState } from "react";
  ```
  `useEffect` is not imported from React.
- **Lines 10–18**:
  ```javascript
  // fixed Header
  function scrollHandler() {
    if (window.scrollY >= 100) {
      setIsFixed(true);
    } else if (window.scrollY <= 50) {
      setIsFixed(false);
    }
  }
  window.addEventListener("scroll", scrollHandler);
  ```
- **Observed Behavior**:
  `window.addEventListener("scroll", scrollHandler)` is called directly in the component's render body outside any lifecycle hook. Every re-render of `NavBar` (from Redux cart count updates, mobile toggle state changes, or `isFixed` transitions) registers an additional scroll listener with a newly allocated function closure. There is no call to `window.removeEventListener`.

---

### R2. Instant Search Responsiveness
- **Target File**: `src/components/SeachBar/SearchBar.jsx`
- **Lines 5–15**:
  ```javascript
  const SearchBar = ({ setFilterList }) => {
    const [searchWord, setSearchWord] = useState(null);
    // const debounceSearchWord = useDebounce(searchWord, 300);
    const handelChange = (input) => {
      setSearchWord(input.target.value);
      setFilterList(
        products.filter((item) =>
          item.productName?.toLowerCase().includes(searchWord?.toLowerCase())
        )
      );
    };
    return (
      <div className="search-container">
        <input type="text" placeholder="Search..." onChange={handelChange} />
        <ion-icon name="search-outline" className="search-icon"></ion-icon>
      </div>
    );
  };
  ```
- **Connected File**: `src/pages/Shop.jsx`
  - **Lines 10–13**:
    ```javascript
    const Shop = () => {
      const [filterList, setFilterList] = useState(
        products.filter((item) => item.category === "Tshirt")
      );
    ```
  - **Lines 25–27**:
    ```javascript
    <Col md={8}>
      <SearchBar setFilterList={setFilterList} />
    </Col>
    ```
- **Observed Behavior**:
  1. `setSearchWord(input.target.value)` is asynchronous. The state update is scheduled for the next render.
  2. Inside `handelChange`, `searchWord?.toLowerCase()` accesses the stale state from the current render rather than the immediate event payload `input.target.value`.
  3. On the first keystroke, `searchWord` is `null`. `searchWord?.toLowerCase()` is `undefined`. `String.prototype.includes(undefined)` coerces `undefined` to string `"undefined"`. Unless a product has `"undefined"` in its name, `filterList` becomes empty `[]`, failing on the first letter.
  4. On subsequent keystrokes, the search runs 1 keystroke behind the user's typed input.
  5. When the search input is cleared (`""`), the closure still reads the previous non-empty character, and there is no condition to reset `filterList` to the full catalog `products`.

---

### R6. Modern Cursor & Catalog Hover Zoom
- **Target Files**:
  - `src/App.css`: Does **not exist** in the repository. All global styling is centralized in `src/index.css` (imported by `src/index.js`).
  - `src/index.css` (lines 3–20, lines 80–85):
    ```css
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }
    body {
      background-color: #ffffff;
      margin: 0;
      font-family: "Lato", sans-serif;
      ...
    }
    /*   ---Shop Pages---   */
    .image-container {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
    }
    ```
  - `src/components/ProductCard/ProductCard.jsx` (lines 20–35):
    ```jsx
    <Col md={3} sm={5} xs={10} className="product mtop">
      {title === "Big Discount" ? (
        <span className="discount">{productItem.discount}% Off</span>
      ) : null}
      <img
        loading="lazy"
        onClick={() => handelClick()}
        src={productItem.imgUrl}
        alt=""
      />
      <div className="product-like">
    ```
  - `src/components/ProductCard/product-card.css` (lines 1–6, 20–27):
    ```css
    .product img {
        width: 100%;
        height: 200px !important;
        object-fit: contain;
        cursor: pointer;
    }
    .product {
        background: #fff;
        padding: 20px;
        position: relative;
        border-radius: 8px;
        box-shadow: rgb(3 0 71 / 9%) 0px 1px 3px;
        margin: 10px;
    }
    ```
- **Observed Behavior**:
  1. No custom cursor is defined anywhere in the site's stylesheet; only standard OS default and `cursor: pointer` are used.
  2. In `ProductCard.jsx`, `<img>` is an uncontained direct child of `.product`. If `transform: scale(...)` is added on hover to `.product img` without an enclosing overflow-hidden container, the image visually expands outward over the card padding and overlaps the product title `<h3>` and rating stars below it.

---

## 2. Logic Chain

### For R1:
1. **Premise**: Attaching event listeners to global window objects within the execution body of a React functional component causes listener attachment on every render pass.
2. **Evidence**: `Navbar.jsx` lines 11–18 call `window.addEventListener("scroll", scrollHandler)` with no enclosing hook.
3. **Deduction**: Re-renders add redundant listeners without detaching prior ones. On unmount, listeners remain in memory.
4. **Resolution**: Encapsulate the listener in a `useEffect` with empty dependency array `[]` and return an unmount cleanup function invoking `window.removeEventListener("scroll", scrollHandler)`. Also call `scrollHandler()` once on mount to synchronize `isFixed` with existing scroll position.

### For R2:
1. **Premise**: In React, `setState` is asynchronous; reading state variables within the same event handler execution yields the old closure value, not the newly updated value.
2. **Evidence**: In `SearchBar.jsx` line 9, `setSearchWord(input.target.value)` is followed immediately on line 12 by `searchWord?.toLowerCase()`.
3. **Deduction**: The search filter executes against stale data, causing a 1-character lag, broken first-character matching due to `null`/`undefined` coercion, and failure to reset when cleared.
4. **Resolution**: Directly extract `const query = e.target.value;` at the start of the handler. Update `setSearchWord(query);`. If `!query || query.trim() === ""`, immediately call `setFilterList(products)`. Otherwise, immediately filter `products` using `query.toLowerCase().trim()`.

### For R6:
1. **Premise**: The user requires a modern cursor across the site and a smooth hover zoom on `ProductCard` images without breaking card boundaries. Per R7, only React 18, Redux Toolkit, and React-Bootstrap are allowed; no external CSS/JS libraries.
2. **Evidence**: Global styles reside in `src/index.css`. `ProductCard.jsx` places `<img>` directly in `.product`.
3. **Deduction**:
   - Modern cursor can be achieved natively and efficiently via SVG Data URI custom cursors in `src/index.css` for `body` and interactive elements (`a, button, [role="button"], etc.`).
   - Image hover zoom requires both a containing frame (`.product-img-container` with `overflow: hidden; height: 200px;`) and `.product { overflow: hidden; }` so that scaling `transform: scale(1.12)` smoothly magnifies the image inside its bounds without bleeding into adjacent card elements or breaking card edges.

---

## 3. Caveats

1. `src/App.css` was listed in the prompt instructions, but does not exist in the codebase. All site-wide styles are loaded from `src/index.css`. Modifications should target `src/index.css` to avoid introducing redundant CSS bundles.
2. In `Shop.jsx`, the default filter state is currently `products.filter((item) => item.category === "Tshirt")`. When R4 is implemented, it should default to `products` (all products). The `SearchBar` reset behavior `setFilterList(products)` perfectly aligns with this.
3. For the cursor: High-DPI SVG Data URI cursors work natively across all modern desktop browsers (Chrome, Edge, Firefox, Safari) with zero JavaScript execution overhead and zero click interference. If an interactive animated follower is desired in addition, it can be provided, but the CSS approach is the most robust and performant.

---

## 4. Conclusion & Concrete Implementation Recommendations

### Fix 1: R1 — `src/components/Navbar/Navbar.jsx`
**Action**: Import `useEffect` and wrap `scrollHandler` with cleanup on unmount.

```javascript
// At top of src/components/Navbar/Navbar.jsx:
import { useState, useEffect } from "react";

// Replace lines 10-18 with:
  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY >= 100) {
        setIsFixed(true);
      } else if (window.scrollY <= 50) {
        setIsFixed(false);
      }
    };

    // Check scroll position on mount
    scrollHandler();

    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);
```

---

### Fix 2: R2 — `src/components/SeachBar/SearchBar.jsx`
**Action**: Filter immediately on `e.target.value`, reset to `products` when query is empty, and make the input a controlled component.

```javascript
// src/components/SeachBar/SearchBar.jsx
import { useState } from "react";
import "./searchbar.css";
import { products } from "../../utils/products";

const SearchBar = ({ setFilterList }) => {
  const [searchWord, setSearchWord] = useState("");

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchWord(query);

    if (!query || query.trim() === "") {
      setFilterList(products);
    } else {
      const normalizedQuery = query.toLowerCase().trim();
      setFilterList(
        products.filter((item) =>
          item.productName?.toLowerCase().includes(normalizedQuery)
        )
      );
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchWord}
        onChange={handleChange}
      />
      <ion-icon name="search-outline" className="search-icon"></ion-icon>
    </div>
  );
};

export default SearchBar;
```

---

### Fix 3: R6 — Modern Cursor & Catalog Hover Zoom

#### 3.1 Modern Cursor in `src/index.css`
**Action**: Add sleek brand-styled SVG cursors to `src/index.css` (primary brand color `#0f3460`).

```css
/* ================= Modern Custom Cursor ================= */
html, body {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='4' fill='%230f3460'/%3E%3Ccircle cx='12' cy='12' r='8' fill='none' stroke='%230f3460' stroke-width='1.5' stroke-opacity='0.4'/%3E%3C/svg%3E") 12 12, auto;
}

a, button, [role="button"], input[type="submit"], input[type="button"],
.cart, .nav-link, .search-icon, .navbar-toggler, .product-like,
.product img, .product h3, .price button, select, .qty-input, .add {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Ccircle cx='14' cy='14' r='6' fill='%230f3460' fill-opacity='0.25'/%3E%3Ccircle cx='14' cy='14' r='11' fill='none' stroke='%230f3460' stroke-width='2'/%3E%3C/svg%3E") 14 14, pointer !important;
}
```

#### 3.2 ProductCard Hover Zoom in `src/components/ProductCard/ProductCard.jsx`
**Action**: Wrap the `<img>` element in `<div className="product-img-container">`.

```jsx
// In src/components/ProductCard/ProductCard.jsx lines 24-29:
      <div className="product-img-container">
        <img
          loading="lazy"
          onClick={() => handelClick()}
          src={productItem.imgUrl}
          alt={productItem.productName || "Product"}
        />
      </div>
```

#### 3.3 ProductCard CSS in `src/components/ProductCard/product-card.css`
**Action**: Update `.product` and define `.product-img-container` with smooth scale transition and bounds clipping.

```css
/* Replace .product and .product img rules in src/components/ProductCard/product-card.css: */

.product {
    background: #fff;
    padding: 20px;
    position: relative;
    border-radius: 8px;
    box-shadow: rgb(3 0 71 / 9%) 0px 1px 3px;
    margin: 10px;
    overflow: hidden; /* Prevent any bleed outside card boundaries */
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.product-img-container {
    width: 100%;
    height: 200px;
    overflow: hidden; /* Clips image within its frame */
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
}

.product-img-container img {
    width: 100%;
    height: 100% !important;
    object-fit: contain;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
}

.product:hover .product-img-container img {
    transform: scale(1.12);
}
```

---

## 5. Verification Method

1. **Static Analysis & Inspection**:
   - `Navbar.jsx`: Verify that `window.addEventListener("scroll", ...)` is called only inside `useEffect` and that `window.removeEventListener("scroll", ...)` is returned in the cleanup function.
   - `SearchBar.jsx`: Verify that filtering logic operates on `e.target.value` (synchronous) instead of `searchWord`, and that clearing input dispatches `setFilterList(products)`.
   - `index.css`: Verify that custom cursor definitions are present for default and pointer elements.
   - `ProductCard.jsx` & `product-card.css`: Verify that `.product-img-container` wraps the image with `overflow: hidden`, and hovering applies `transform: scale(...)`.

2. **Build Validation**:
   - Run in root:
     `npm run build`
   - Invalidation conditions: Any syntax error, missing import, or compile failure in React.

3. **Runtime & Browser Validation**:
   - Scroll the window up and down across pages: Navbar toggles `.fixed` correctly without listener pileup in DevTools Performance/Memory monitor.
   - Open `/shop`:
     - Type `"T"` into search input: immediately displays items matching "T" without delay or empty result.
     - Backspace to empty input: restores all products.
   - Hover over product cards on `/` and `/shop`:
     - Image zooms smoothly by ~12%.
     - Image edges remain strictly inside the 200px container and never overlap card edges or title text.
   - Cursor: Modern brand-styled geometric cursor is active across the site.
