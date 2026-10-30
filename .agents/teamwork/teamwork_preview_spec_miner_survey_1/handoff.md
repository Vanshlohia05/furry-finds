# Specification & Feature Inventory: R4 (Category Filter Expansion) & R7 (Framework & Design Integrity Constraint)

## 1. Observation

### 1.1 Category Filter Implementation in `src/components/FilterSelect.jsx`
- **File**: `src/components/FilterSelect.jsx` (lines 1–53)
- **Lines 4–10**:
  ```javascript
  const options = [
      // { value: "sofa", label: "Sofa" },
      // { value: "chair", label: "Chair" },
      // { value: "watch", label: "Watch" },
      { value: "Tshirt", label: "Tshirt" },
      // { value: "wireless", label: "Wireless" },
  ];
  ```
- **Lines 38–50**:
  ```javascript
  const FilterSelect = ({setFilterList}) => {
      const handleChange = (selectedOption)=> {
          setFilterList(products.filter(item => item.category ===selectedOption.value))
      }
      return (
      <Select
      options={options}
      defaultValue={{ value: "", label: "Filter By Category" }}
      styles={customStyles}
      onChange={handleChange}
      />
      );
  };
  ```
- **Direct Observation**:
  - Only `{ value: "Tshirt", label: "Tshirt" }` is currently defined and active. All other options are commented-out legacy furniture/electronics items.
  - `handleChange` strictly filters with `item.category === selectedOption.value`.
  - There is currently no option for "All Products", "Mugs", "Tote Bags", or "Custom Gifts".
  - If an option for "All Products" with value `"All Products"` or `""` or `"all"` were passed to `handleChange`, the existing code would filter `item.category === selectedOption.value`, yielding an empty list `[]` unless an explicit branch for all products is implemented.

### 1.2 Initial Catalog Display in `src/pages/Shop.jsx`
- **File**: `src/pages/Shop.jsx` (lines 10–36)
- **Lines 10–14**:
  ```javascript
  const Shop = () => {
    const [filterList, setFilterList] = useState(
      products.filter((item) => item.category === "Tshirt")
    );
    useWindowScrollToTop();
  ```
- **Direct Observation**:
  - `Shop.jsx` defaults `filterList` state to `products.filter((item) => item.category === "Tshirt")`.
  - When a user lands on `/shop`, only T-shirts are displayed by default, violating R4's requirement that `Shop.jsx` display the full catalog by default.

### 1.3 Catalog Categories and Data in `src/utils/products.js`
- **File**: `src/utils/products.js` (lines 1–517)
- **Lines 77–161 (`discoutProducts`)**:
  - Contains two active products:
    - Line 115: `id: "12"`, `productName: "Realme 8"`, `imgUrl: tshirt03`, `category: "Tshirt"`, `price: 599`
    - Line 138: `id: "13"`, `productName: "One Plus Nord"`, `imgUrl: custmug01`, `category: "Tshirt"`, `price: 799`
- **Lines 163–445 (`products`)**:
  - Contains 9 active products (all having `category: "Tshirt"`):
    1. Line 263: `id: "10"`, `productName: "Dynamic Bull T-Shirt"`, `imgUrl: tshirt02`, `category: "Tshirt"`, `price: 349`
    2. Line 293: `id: "11"`, `productName: "Stylish Profit & Loss Hoodie"`, `imgUrl: tshirt01`, `category: "Tshirt"`, `price: 319`
    3. Line 316: `id: "12"`, `productName: "Playful Bear T-Shirt"`, `imgUrl: tshirt03`, `category: "Tshirt"`, `price: 349`
    4. Line 339: `id: "13"`, `productName: "AURA Moai T-Shirt"`, `imgUrl: tshirt06`, `category: "Tshirt"`, `price: 349`
    5. Line 362: `id: "14"`, `productName: "Festive Antlers T-Shirt"`, `imgUrl: tshirt11`, `category: "Tshirt"`, `price: 299`
    6. Line 385: `id: "15"`, `productName: "Ho Ho Ho T-Shirt"`, `imgUrl: tshirt10`, `category: "Tshirt"`, `price: 349`
    7. Line 408: `id: "30"`, `productName: "Happy Bihu T-Shirt"`, `imgUrl: tshirt12`, `category: "Tshirt"`, `price: 339`
    8. Line 421: `id: "31"`, `productName: "Pepa print T-Shirt"`, `imgUrl: tshirt13`, `category: "Tshirt"`, `price: 339`
    9. Line 434: `id: "32"`, `productName: "Printed Birds T-Shirt"`, `imgUrl: tshirt14`, `category: "Tshirt"`, `price: 339`
- **Existing Asset Inventory in `src/Images/` & `SliderData`**:
  - `src/Images/cust-mug-01.png` (imported as `custmug01`)
  - `src/Images/mug-02-F.png` & `src/Images/mug-02-B.png` (available for additional mug products)
  - `src/Images/bag-01.png` (imported as `bag01`, defined in `SliderData` as "AWW Range Gift Bag" - Gifting Brand)
  - `src/Images/bag-02.png` (imported as `bag02`, defined in `SliderData` as "Face Art Tote Bag")
  - `src/Images/bag-03.png` (imported as `bag03`, defined in `SliderData` as "Elegant Floral Tote Bag")
  - `src/Images/t-shirt-09.png` (available for additional t-shirt product)
- **Direct Observation**:
  - Zero products in `products` have category `"Mugs"`, `"Tote Bags"`, or `"Custom Gifts"`.
  - All existing items use `category: "Tshirt"` rather than `"T-Shirts"`.
  - `ProductDetails.jsx` line 42 renders `<span>Category:&nbsp;{selectedProduct?.category}</span>`.
  - `Home.jsx` lines 11–13 filters: `(item) => item.category === "Tshirt" || item.category === "Tshirt"`.

### 1.4 Dependency Versions and Build Verification in `package.json`
- **File**: `package.json`
  - React: `"react": "^18.2.0"`, `"react-dom": "^18.2.0"`
  - Redux: `"@reduxjs/toolkit": "^1.9.7"`, `"react-redux": "^8.1.3"`
  - Bootstrap: `"bootstrap": "^5.2.3"`, `"react-bootstrap": "^2.7.4"`
  - Routing: `"react-router-dom": "^6.11.1"`
  - Select: `"react-select": "^5.7.3"`
  - Scripts: `"build": "react-scripts build"`
- **Tool Command Execution**:
  - Command: `npm run build`
  - Exit Code: `0`
  - Output: `Compiled successfully. build\static\js\main.85c97385.js (90.34 kB gzipped)`

### 1.5 Styling System Constraints
- **Global CSS**: `src/index.css`
  - Font: `"Lato", sans-serif`
  - Body Background: `#ffffff`
  - Primary Accent/Navy: `#0f3460`
  - Card & Section Backgrounds: `#f6f9fc`
  - Star Rating Color: `#ffcd4e`
  - WhatsApp Glowing Animations: `@keyframes glowing` (1500ms infinite)
- **Component CSS Files**:
  - 10 component CSS files co-located with JSX: `Banner`, `Footer`, `Loader`, `Navbar`, `ProductCard`, `ProductDetails`, `SeachBar`, `SliderCard`, `wrapper`, `index.css`.
  - No external CSS frameworks (no Tailwind, Emotion, styled-components, MUI). All styles are pure CSS with standard classes.

---

## 2. Logic Chain

1. **Category Expansion Logic (R4)**:
   - R4 requires `FilterSelect.jsx` to offer five options: "All Products", "T-Shirts", "Mugs", "Tote Bags", and "Custom Gifts".
   - In `FilterSelect.jsx`, `handleChange` currently performs `setFilterList(products.filter(item => item.category === selectedOption.value))`.
   - To support "All Products", `handleChange` must recognize when "All Products" is chosen (e.g. `selectedOption.value === "all"` or `selectedOption.value === "All Products"` or `""`) and reset `filterList` to `products`.
   - When filtering by specific category, `selectedOption.value` must match the `category` attribute of products in `src/utils/products.js`.
   - The user-facing label for T-shirts in R4 is "T-Shirts". In `products.js`, current items are labeled `"Tshirt"`. To ensure clean presentation on both the filter dropdown and the product details page (`Category: T-Shirts`), the existing items in `products.js` should have their category aligned to `"T-Shirts"`, and `FilterSelect.jsx` option value should be `"T-Shirts"`.
   - In `Home.jsx`, `newArrivalData` currently filters for `item.category === "Tshirt"`. When aligning categories to `"T-Shirts"`, `Home.jsx` should be updated to accept `"T-Shirts"` (or `item.category === "T-Shirts" || item.category === "Tshirt"`) to maintain home page rendering.

2. **Default Catalog View Logic (R4)**:
   - `Shop.jsx` currently initializes `useState` with `products.filter(item => item.category === "Tshirt")`.
   - R4 explicitly requires: `src/pages/Shop.jsx displays the full catalog by default`.
   - Therefore, `useState(products)` must be used in `Shop.jsx`.

3. **Catalog Data Population Logic (R4)**:
   - Currently, selecting "Mugs", "Tote Bags", or "Custom Gifts" would return zero products because none exist in `products`.
   - Assets and descriptions for all three missing categories already exist in `src/Images` and `SliderData`:
     - **Mugs**: `cust-mug-01.png` ('Mountain EST 2024' Mug) and `mug-02-F.png` (Classic Ceramic Mug).
     - **Tote Bags**: `bag-02.png` (Face Art Tote Bag) and `bag-03.png` (Elegant Floral Tote Bag).
     - **Custom Gifts**: `bag-01.png` (AWW Range Gift Bag) and customizable gift sets.
   - Adding product items for each of these categories into `products` array with complete schema (unique string `id`, `productName`, `imgUrl`, `category`, `price`, `shortDesc`, `description`, `reviews`, `avgRating`) fulfills the catalog requirement without needing external placeholder images.

4. **Framework & Design Integrity Logic (R7)**:
   - `package.json` confirms React 18 (`^18.2.0`), Redux Toolkit (`^1.9.7`), and React-Bootstrap (`^2.7.4`).
   - The project uses standard CSS modules and global CSS files without any Tailwind or CSS-in-JS libraries.
   - The verified build (`npm run build` -> exit code 0) proves the existing build toolchain is functional and must not be altered with external styling dependencies.
   - All styling for other requirements (such as R6 cursor style and catalog hover zoom) must use pure CSS added to `index.css` or `product-card.css`, preserving the existing `#0f3460` palette and card geometry.

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | R4 Category Filter | FilterSelect "All Products" Option | Allows users to display the complete product catalog across all categories | `selectedOption = { value: "all", label: "All Products" }` | `setFilterList(products)` | If handled by strict equality filter without branch, returns empty array `[]` | `src/components/FilterSelect.jsx` (lines 38–50) |
| 2 | R4 Category Filter | FilterSelect "T-Shirts" Option | Filters shop catalog to T-Shirts | `selectedOption = { value: "T-Shirts", label: "T-Shirts" }` | `filterList` contains items with `category === "T-Shirts"` | Returns `[]` if product category string is `"Tshirt"` instead of `"T-Shirts"` | `src/components/FilterSelect.jsx`, `src/utils/products.js` |
| 3 | R4 Category Filter | FilterSelect "Mugs" Option | Filters shop catalog to Mugs | `selectedOption = { value: "Mugs", label: "Mugs" }` | `filterList` contains items with `category === "Mugs"` | Returns `[]` currently because no items in `products` have `category === "Mugs"` | `src/components/FilterSelect.jsx`, `src/utils/products.js` |
| 4 | R4 Category Filter | FilterSelect "Tote Bags" Option | Filters shop catalog to Tote Bags | `selectedOption = { value: "Tote Bags", label: "Tote Bags" }` | `filterList` contains items with `category === "Tote Bags"` | Returns `[]` currently because no items in `products` have `category === "Tote Bags"` | `src/components/FilterSelect.jsx`, `src/utils/products.js` |
| 5 | R4 Category Filter | FilterSelect "Custom Gifts" Option | Filters shop catalog to Custom Gifts | `selectedOption = { value: "Custom Gifts", label: "Custom Gifts" }` | `filterList` contains items with `category === "Custom Gifts"` | Returns `[]` currently because no items in `products` have `category === "Custom Gifts"` | `src/components/FilterSelect.jsx`, `src/utils/products.js` |
| 6 | R4 Category Filter | FilterSelect Custom Styling | React-select component styling with brand colors | `customStyles` prop passed to `<Select />` | Dark navy `#0f3460` control bar, white text, 200px width, 40px height | Falls back to default react-select gray borders if styles removed | `src/components/FilterSelect.jsx` (lines 12–36) |
| 7 | R4 Shop Catalog | Shop Full Catalog Default View | Initial display on `/shop` route before user interaction | Page navigation to `/shop` | `filterList` initialized to full `products` array | Currently defaults to `products.filter(item => item.category === "Tshirt")` | `src/pages/Shop.jsx` (lines 11–13) |
| 8 | R4 Catalog Data | Products Catalog Data Schema | Product data structure consumed across Shop, ProductDetails, Cart | Product object definition in `src/utils/products.js` | `{ id, productName, imgUrl, category, price, shortDesc, description, reviews, avgRating }` | Missing fields cause render errors in ProductDetails or NaN in Cart total | `src/utils/products.js`, `src/pages/Product.jsx`, `src/pages/Cart.jsx` |
| 9 | R4 Product Details | Category Metadata Display | Displays selected product category in detail view | `selectedProduct.category` | `<span>Category: {selectedProduct.category}</span>` | Shows raw database string (e.g. "Tshirt" if not aligned to "T-Shirts") | `src/components/ProductDetails/ProductDetails.jsx` (line 42) |
| 10 | R4 Product Details | Related Products by Category | Renders carousel/grid of related products from matching category | `selectedProduct.category` | `products.filter(item => item.category === selectedProduct.category && item.id !== selectedProduct.id)` | Returns empty list if only 1 item in category | `src/pages/Product.jsx` (lines 23–28) |
| 11 | R4 Home Synchronization | Home New Arrivals Category Filter | Filters items for "New Arrivals" section on Home page | `products` array | `products.filter(item => item.category === "Tshirt" ...)` | If category is renamed to "T-Shirts" without updating Home.jsx, New Arrivals section becomes empty | `src/pages/Home.jsx` (lines 11–13) |
| 12 | R7 Framework Stack | React 18 & Redux Toolkit Constraint | E-commerce application core runtime dependencies | React 18.2.0, Redux Toolkit 1.9.7, React-Bootstrap 2.7.4 | Single Page Application bundle | Strict violation if external state/UI libraries added | `package.json` (lines 5–24) |
| 13 | R7 Build Script | Production Build Execution | Webpack build via Create React App | `npm run build` / `react-scripts build` | Optimized static assets in `build/` | Exit code non-zero on compilation/lint error | `package.json` (line 28), verified with exit code 0 |
| 14 | R7 Styling Architecture | Pure CSS Class & Palette Preservation | Styling convention across application components | 10 component CSS files + `index.css` | Uniform look & feel with `#0f3460` primary, `#f6f9fc` subtle background, `Lato` font | Introducing Tailwind/MUI alters bundle size and breaks layout consistency | `src/index.css`, `src/components/**/*.css` |

---

## 4. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | FilterSelect "All Products" | User selects "All Products" from dropdown | If `handleChange` runs `item.category === selectedOption.value`, 0 products match because no product has category "All Products". Must branch: `if (selectedOption.value === "all" \|\| selectedOption.value === "All Products") setFilterList(products)`. |
| 2 | Category Filter + SearchBar Interaction | User selects "Mugs" then types search term in `SearchBar` | `SearchBar.jsx` currently filters `products.filter(...)` from the full `products` list, bypassing current category selection. If search is cleared, `SearchBar` should reset correctly without crashing. |
| 3 | Category Naming Case Sensitivity | Value `"T-Shirts"` vs existing `"Tshirt"` | Strict equality `===` in `FilterSelect` will fail if case or hyphenation differs (`"T-Shirts"` !== `"Tshirt"`). Category strings in `products.js` must match option values exactly. |
| 4 | Shop Initial Load | User navigates directly to `/shop` | `Shop.jsx` currently initializes `filterList` with only T-shirts. Must be initialized with `products` so full catalog is immediately visible. |
| 5 | Related Products on Single-Item Category | User visits product page of category with only 1 item (e.g. only 1 Mug) | `relatedProducts` filters `item.id !== selectedProduct.id`, resulting in 0 items. `<ShopList productItems={[]} />` renders `not-found` or empty section. Adding at least 2 items per category ensures related products section always renders recommendations. |
| 6 | Numeric ID Parsing | User navigates to `/shop/:id` where ID is a new item (e.g. `"33"`) | `Product.jsx` uses `parseInt(item.id) === parseInt(id)`. New IDs in `products.js` must be numeric strings (e.g. `"33"`, `"34"`) to prevent NaN comparison failures. |
| 7 | Product Cart Arithmetic | Adding product from new category to Cart | `Cart.jsx` performs `price * qty` and `reduce((price, item) => price + item.qty * item.price, 0)`. The `price` property on all new products in `products.js` must be a valid number (e.g. `299`), not a string with currency symbols. |
| 8 | Product Details Share URL | User clicks Share button on new product | `ProductDetails.jsx` uses `<RWebShare>` with `src: ./shop/${productItem.id}`. The product object must have a valid `id` so the shared link is well-formed. |
| 9 | Mobile Viewport on FilterSelect | Viewport width < 576px | `FilterSelect.jsx` has fixed width `width: "200px"`. In `Shop.jsx`, the row has `justify-content-center` with `Col md={4}` and `Col md={8}`. Row wrapping handles mobile screens without overflowing. |
| 10 | Production Build Linting | Build executed with strict CRA linter | `react-scripts build` treats unused variables or malformed imports as warnings/errors. Adding new imports in `products.js` (e.g. `custmug01`, `bag01`) must not introduce broken paths or unused variables. |

---

## 5. Specification & Implementation Contract for Subsequent Milestones

### Specification for R4:
1. **`src/components/FilterSelect.jsx`**:
   - `options` array must be updated to:
     ```javascript
     const options = [
         { value: "all", label: "All Products" },
         { value: "T-Shirts", label: "T-Shirts" },
         { value: "Mugs", label: "Mugs" },
         { value: "Tote Bags", label: "Tote Bags" },
         { value: "Custom Gifts", label: "Custom Gifts" },
     ];
     ```
   - `handleChange` must be updated to:
     ```javascript
     const handleChange = (selectedOption) => {
         if (!selectedOption || selectedOption.value === "all" || selectedOption.value === "All Products") {
             setFilterList(products);
         } else {
             setFilterList(products.filter(item => item.category === selectedOption.value));
         }
     };
     ```
   - `defaultValue` or `placeholder`:
     ```javascript
     defaultValue={{ value: "all", label: "All Products" }}
     ```
     (or placeholder `{ value: "", label: "Filter By Category" }` with "All Products" as selectable option).

2. **`src/pages/Shop.jsx`**:
   - Line 11–13 update:
     ```javascript
     const [filterList, setFilterList] = useState(products);
     ```

3. **`src/utils/products.js`**:
   - **T-Shirts Alignment**: Update the existing 9 active items' category from `"Tshirt"` to `"T-Shirts"`.
   - **Mugs**: Add items with `category: "Mugs"`, using `custmug01` ('Mountain EST 2024' Mug) and `mug02F` (from `../Images/mug-02-F.png`).
   - **Tote Bags**: Add items with `category: "Tote Bags"`, using `bag02` (Face Art Tote Bag) and `bag03` (Elegant Floral Tote Bag).
   - **Custom Gifts**: Add items with `category: "Custom Gifts"`, using `bag01` (AWW Range Gift Bag) and customizable gift packs.
   - **Schema Conformance**: Each added item must have `id`, `productName`, `imgUrl`, `category`, `price`, `shortDesc`, `description`, `reviews`, `avgRating`.
   - **Home Page Compatibility**: In `src/pages/Home.jsx`, line 12:
     ```javascript
     const newArrivalData = products.filter(
       (item) => item.category === "T-Shirts" || item.category === "Tshirt"
     );
     ```

### Specification for R7:
1. **Framework Strictness**: Maintain existing `package.json` dependencies: React 18, Redux Toolkit, React-Bootstrap. Do not install any additional styling frameworks or alternate runtimes.
2. **Visual & Styling Integrity**: Maintain existing CSS class names (`.product`, `.qty-input`, `.add`, `.filter-bar`, etc.) and brand palette (`#0f3460`, `#ffffff`, `#f6f9fc`).
3. **Build Requirement**: Any modifications must pass `npm run build` cleanly with exit code 0.

---

## 6. Caveats

- In `src/utils/products.js`, `discoutProducts` is currently commented out in `Home.jsx`. It contains placeholder names ("Realme 8", "One Plus Nord") that are not currently displayed in the UI. Aligning active `products` array takes precedence.
- In `src/pages/Home.jsx`, `newArrivalData` specifically filters by category. Modifying category names in `products.js` requires updating or providing backwards-compatibility in `Home.jsx`.
- No assumptions were made regarding external assets; all images for Mugs, Tote Bags, and Custom Gifts are sourced directly from the local `src/Images/` folder and `SliderData`.

---

## 7. Conclusion

The specification for R4 (Category Filter Expansion) and R7 (Framework & Design Integrity Constraint) is fully mined, verified against the running codebase and build system, and documented.
- R4 requires updating `FilterSelect.jsx` (options and reset logic), fixing `Shop.jsx` default state from `"Tshirt"` filter to full `products`, and adding missing products in `products.js` for "Mugs", "Tote Bags", and "Custom Gifts" with category alignment to "T-Shirts".
- R7 verifies that React 18, Redux Toolkit, and React-Bootstrap are the sole allowable frameworks, with strict preservation of the CSS architecture, color palette, and a clean build pipeline (`npm run build` passing with exit code 0).

---

## 8. Verification Method

1. **Verify Files**:
   - `src/components/FilterSelect.jsx`: Check options array and `handleChange` logic.
   - `src/pages/Shop.jsx`: Check initial `useState` argument.
   - `src/utils/products.js`: Check categories in `products` array and ensure all 4 categories have items.
   - `package.json`: Check framework versions and dependencies.
2. **Verify Build**:
   - Run `npm run build` in `d:/VS CODE/awwrange/awwrange`.
   - Expected Result: Exits with code 0 and outputs production bundle in `build/`.
3. **Invalidation Conditions**:
   - If `FilterSelect.jsx` options do not include all 5 requested options.
   - If selecting "All Products" displays an empty product list.
   - If navigating to `/shop` only displays T-shirts.
   - If any new external styling library is installed in `package.json`.
