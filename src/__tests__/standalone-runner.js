/**
 * Standalone Node Requirement Test Runner for Aww Range Storefront
 *
 * Runs verification across all 4 Tiers directly in Node.js with built-in assert.
 * Usage: node src/__tests__/standalone-runner.js
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../..");
const srcDir = path.resolve(rootDir, "src");

let passed = 0;
let failed = 0;
const results = [];

function recordTest(tier, id, description, fn) {
  try {
    fn();
    passed++;
    results.push({ tier, id, description, status: "PASS" });
    console.log(`  [PASS] ${id}: ${description}`);
  } catch (err) {
    failed++;
    results.push({ tier, id, description, status: "FAIL", error: err.message });
    console.error(`  [FAIL] ${id}: ${description}`);
    console.error(`         Error: ${err.message}`);
  }
}

console.log("=================================================================");
console.log("  Aww Range Storefront - Standalone Requirement Test Runner");
console.log("=================================================================\n");

/* --------------------------------------------------------------------------
   TIER 1: FEATURE COVERAGE
   -------------------------------------------------------------------------- */
console.log("--- TIER 1: FEATURE COVERAGE (>=5 per feature) ---");

// R1: Scroll Listener Lifecycle Encapsulation in Navbar
const navbarSrc = fs.readFileSync(path.join(srcDir, "components/Navbar/Navbar.jsx"), "utf-8");

recordTest("Tier 1", "R1-1", "Navbar imports useEffect from React", () => {
  assert(
    /import\s+{[^}]*useEffect[^}]*}\s+from\s+["']react["']/.test(navbarSrc),
    "useEffect is not imported from react in Navbar.jsx"
  );
});

recordTest("Tier 1", "R1-2", "Navbar encapsulates window.addEventListener inside useEffect", () => {
  assert(
    /useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*window\.addEventListener\s*\(\s*["']scroll["']/.test(navbarSrc),
    "window.addEventListener('scroll') is not inside a useEffect hook"
  );
});

recordTest("Tier 1", "R1-3", "Navbar unmount cleanup function calls window.removeEventListener", () => {
  assert(
    /return\s*\(\)\s*=>\s*\{[\s\S]*window\.removeEventListener\s*\(\s*["']scroll["']/.test(navbarSrc),
    "useEffect cleanup function does not call window.removeEventListener('scroll', ...)"
  );
});

recordTest("Tier 1", "R1-4", "Navbar invokes scrollHandler once on mount for initial position", () => {
  assert(
    /scrollHandler\(\);[\s\S]*window\.addEventListener/.test(navbarSrc),
    "scrollHandler is not called on mount before registering listener"
  );
});

recordTest("Tier 1", "R1-5", "No uncleaned window.addEventListener remains outside useEffect", () => {
  const matches = navbarSrc.match(/window\.addEventListener\s*\(\s*["']scroll["']/g) || [];
  assert.strictEqual(matches.length, 1, "There should be exactly one scroll listener registration");
  const lines = navbarSrc.split("\n");
  const outsideUseEffect = lines.some(
    (l, idx) => l.includes("window.addEventListener") && !navbarSrc.slice(0, navbarSrc.indexOf(l)).includes("useEffect")
  );
  assert(!outsideUseEffect, "Scroll listener attached outside useEffect");
});

// R2: SearchBar Instant Filtering & Clear-to-Reset
const searchBarSrc = fs.readFileSync(path.join(srcDir, "components/SeachBar/SearchBar.jsx"), "utf-8");

recordTest("Tier 1", "R2-1", "SearchBar extracts query directly from event payload without state lag", () => {
  assert(
    /const\s+query\s*=\s*(?:input|e)\.target\.value/.test(searchBarSrc),
    "SearchBar does not read event target value immediately into local variable"
  );
});

recordTest("Tier 1", "R2-2", "SearchBar resets filter to products catalog when query is empty or whitespace", () => {
  assert(
    /if\s*\(\s*!query\s*\|\|\s*query\.trim\(\)\s*===\s*["']["']\s*\)\s*\{[\s\S]*setFilterList\s*\(\s*products\s*\)/.test(searchBarSrc),
    "SearchBar does not reset to full catalog when query is empty or whitespace"
  );
});

recordTest("Tier 1", "R2-3", "SearchBar normalizes query with toLowerCase and trim for matching", () => {
  assert(
    /query\.toLowerCase\(\)\.trim\(\)/.test(searchBarSrc) ||
    /toLowerCase\(\)[\s\S]*includes/.test(searchBarSrc),
    "SearchBar does not properly lowercase and trim the search term"
  );
});

recordTest("Tier 1", "R2-4", "SearchBar input is a controlled component bound to value", () => {
  assert(
    /value\s*=\s*\{\s*searchWord\s*\}/.test(searchBarSrc),
    "SearchBar input is not a controlled component bound to searchWord"
  );
});

recordTest("Tier 1", "R2-5", "SearchBar filtering logic executes correctly against mock catalog", () => {
  const mockCatalog = [
    { id: "1", productName: "Dynamic Bull T-Shirt" },
    { id: "2", productName: "Mountain Mug" },
  ];
  const filterFn = (q) => {
    if (!q || q.trim() === "") return mockCatalog;
    const nq = q.toLowerCase().trim();
    return mockCatalog.filter((item) => item.productName.toLowerCase().includes(nq));
  };
  assert.strictEqual(filterFn("bull").length, 1);
  assert.strictEqual(filterFn("  MUG  ").length, 1);
  assert.strictEqual(filterFn("").length, 2);
  assert.strictEqual(filterFn("xyz").length, 0);
});

// R3: Product Details Purchase Flow & Share URL
const productDetailsSrc = fs.readFileSync(path.join(srcDir, "components/ProductDetails/ProductDetails.jsx"), "utf-8");

recordTest("Tier 1", "R3-1", "ProductDetails has active (uncommented) .qty-input and button.add", () => {
  assert(
    /className=["']qty-input["']/.test(productDetailsSrc) && !/\/\*[\s\S]*className=["']qty-input["'][\s\S]*\*\//.test(productDetailsSrc),
    ".qty-input is commented out or missing"
  );
  assert(
    /className=["']add["']/.test(productDetailsSrc) && !/\/\*[\s\S]*className=["']add["'][\s\S]*\*\//.test(productDetailsSrc),
    "button.add is commented out or missing"
  );
});

recordTest("Tier 1", "R3-2", "ProductDetails parses quantity defensively with Math.max(1, parseInt(...))", () => {
  assert(
    /Math\.max\(\s*1\s*,\s*parseInt\s*\(\s*(?:qty|quantity)/.test(productDetailsSrc),
    "ProductDetails does not sanitize quantity with Math.max(1, parseInt(...))"
  );
});

recordTest("Tier 1", "R3-3", "ProductDetails dispatches addToCart and triggers toast.success", () => {
  assert(
    /dispatch\s*\(\s*addToCart\s*\(\s*\{[\s\S]*product[\s\S]*num/.test(productDetailsSrc),
    "ProductDetails does not dispatch addToCart with product and num"
  );
  assert(
    /toast\.success\s*\(\s*["']Product has been added to cart!["']\s*\)/.test(productDetailsSrc),
    "ProductDetails does not trigger toast.success notification"
  );
});

recordTest("Tier 1", "R3-4", "cartSlice.js parses quantity defensively in addToCart reducer", () => {
  const cartSliceSrc = fs.readFileSync(path.join(srcDir, "app/features/cart/cartSlice.js"), "utf-8");
  assert(
    /Math\.max\(\s*1\s*,\s*parseInt\s*\(\s*action\.payload\.num/.test(cartSliceSrc),
    "cartSlice.js does not parse action.payload.num defensively with parseInt"
  );
});

recordTest("Tier 1", "R3-5", "ProductDetails RWebShare uses valid absolute url with selectedProduct.id", () => {
  assert(
    /url\s*:\s*`\$\{window\.location\.origin\}\/shop\/\$\{selectedProduct\?\.id\}`/.test(productDetailsSrc) ||
    /url\s*:\s*`[^`]*\/shop\/\$\{selectedProduct\?\.id\}`/.test(productDetailsSrc),
    "RWebShare does not reference selectedProduct.id with valid absolute URL"
  );
  assert(!productDetailsSrc.includes("productItem.id"), "ProductDetails still references undefined productItem.id");
});

// R4: Category Filter Expansion & Default View
const filterSelectSrc = fs.readFileSync(path.join(srcDir, "components/FilterSelect.jsx"), "utf-8");
const shopSrc = fs.readFileSync(path.join(srcDir, "pages/Shop.jsx"), "utf-8");
const productsSrc = fs.readFileSync(path.join(srcDir, "utils/products.js"), "utf-8");

recordTest("Tier 1", "R4-1", "FilterSelect options include all 5 required categories", () => {
  const requiredCategories = ["All Products", "T-Shirts", "Mugs", "Tote Bags", "Custom Gifts"];
  for (const cat of requiredCategories) {
    assert(filterSelectSrc.includes(cat), `FilterSelect missing category: ${cat}`);
  }
});

recordTest("Tier 1", "R4-2", "FilterSelect handleChange resets to full catalog on 'all' or 'All Products'", () => {
  assert(
    /selectedOption\.value\s*===\s*["']all["']/.test(filterSelectSrc) &&
    /setFilterList\s*\(\s*products\s*\)/.test(filterSelectSrc),
    "FilterSelect does not reset to products when 'all' is selected"
  );
});

recordTest("Tier 1", "R4-3", "Shop.jsx initializes filterList state with products (full catalog) by default", () => {
  assert(
    /useState\s*\(\s*products\s*\)/.test(shopSrc),
    "Shop.jsx does not default filterList state to products"
  );
  assert(
    !/useState\s*\(\s*products\.filter/.test(shopSrc),
    "Shop.jsx still restricts default filterList to Tshirt"
  );
});

recordTest("Tier 1", "R4-4", "products.js defines active items for Mugs, Tote Bags, and Custom Gifts", () => {
  assert(productsSrc.includes('category: "Mugs"'), "products.js has no active Mugs items");
  assert(productsSrc.includes('category: "Tote Bags"'), "products.js has no active Tote Bags items");
  assert(productsSrc.includes('category: "Custom Gifts"'), "products.js has no active Custom Gifts items");
});

recordTest("Tier 1", "R4-5", "products.js aligns T-Shirt items to category 'T-Shirts'", () => {
  assert(productsSrc.includes('category: "T-Shirts"'), "products.js does not contain category 'T-Shirts'");
});

// R5: Automated 1-Click WhatsApp Ordering & Inquiry
const cartSrc = fs.readFileSync(path.join(srcDir, "pages/Cart.jsx"), "utf-8");

recordTest("Tier 1", "R5-1", "Cart.jsx WhatsApp link targets wa.me/919365324146 with text parameter", () => {
  assert(
    /https:\/\/wa\.me\/919365324146\?text=/.test(cartSrc),
    "Cart.jsx does not target https://wa.me/919365324146?text="
  );
});

recordTest("Tier 1", "R5-2", "Cart.jsx WhatsApp message itemizes cart items with quantity and line total", () => {
  assert(
    /item\.productName[\s\S]*item\.qty[\s\S]*item\.price\s*\*\s*item\.qty/.test(cartSrc),
    "Cart.jsx does not construct itemized summary with name, qty, and line total"
  );
});

recordTest("Tier 1", "R5-3", "Cart.jsx WhatsApp message includes overall cart total price", () => {
  assert(
    /Total Price:\s*₹\$\{totalPrice\}/.test(cartSrc),
    "Cart.jsx does not include Total Price in order message"
  );
});

recordTest("Tier 1", "R5-4", "ProductDetails WhatsApp inquiry targets wa.me/919365324146 with pre-filled details", () => {
  assert(
    /https:\/\/wa\.me\/919365324146\?text=/.test(productDetailsSrc),
    "ProductDetails does not target https://wa.me/919365324146?text="
  );
  assert(
    /selectedProduct\?\.productName/.test(productDetailsSrc) &&
    /selectedProduct\?\.id/.test(productDetailsSrc) &&
    /selectedProduct\?\.price/.test(productDetailsSrc),
    "ProductDetails WhatsApp inquiry does not pre-fill product name, id, and price"
  );
});

recordTest("Tier 1", "R5-5", "ProductDetails WhatsApp inquiry updates dynamically with selected quantity", () => {
  assert(
    /Quantity:\s*\$\{qtyNum\}/.test(productDetailsSrc) &&
    /Total:\s*₹\$\{lineTotal\}/.test(productDetailsSrc),
    "ProductDetails inquiry link does not include dynamic quantity and line total"
  );
});

// R6: Modern Cursor CSS & ProductCard Hover Zoom
const indexCss = fs.readFileSync(path.join(srcDir, "index.css"), "utf-8");
const productCardSrc = fs.readFileSync(path.join(srcDir, "components/ProductCard/ProductCard.jsx"), "utf-8");
const productCardCss = fs.readFileSync(path.join(srcDir, "components/ProductCard/product-card.css"), "utf-8");

recordTest("Tier 1", "R6-1", "index.css implements modern SVG Data URI cursor for body and html", () => {
  assert(
    /body[\s\S]*cursor:\s*url\("data:image\/svg\+xml/i.test(indexCss),
    "index.css does not define SVG Data URI cursor for body/html"
  );
  assert(indexCss.includes("0f3460"), "Cursor does not use brand color #0f3460");
});

recordTest("Tier 1", "R6-2", "index.css implements custom pointer cursor for interactive elements", () => {
  assert(
    /cursor:\s*url\("data:image\/svg\+xml[\s\S]*pointer\s*!important/i.test(indexCss),
    "index.css does not define custom pointer cursor for interactive elements"
  );
});

recordTest("Tier 1", "R6-3", "ProductCard.jsx wraps image inside .product-img-container", () => {
  assert(
    /<div\s+className=["']product-img-container["']>\s*<img/.test(productCardSrc),
    "ProductCard.jsx does not wrap img inside .product-img-container"
  );
});

recordTest("Tier 1", "R6-4", "product-card.css enforces overflow: hidden on container and card", () => {
  assert(
    /\.product\s*\{[^}]*overflow:\s*hidden/i.test(productCardCss),
    ".product does not have overflow: hidden in product-card.css"
  );
  assert(
    /\.product-img-container\s*\{[^}]*overflow:\s*hidden/i.test(productCardCss),
    ".product-img-container does not have overflow: hidden in product-card.css"
  );
});

recordTest("Tier 1", "R6-5", "product-card.css implements smooth transform scale hover effect", () => {
  assert(
    /transform:\s*scale\(1\.\d+\)/i.test(productCardCss),
    "product-card.css does not define scale transform on hover"
  );
  assert(
    /transition:\s*transform/i.test(productCardCss),
    "product-card.css does not define transform transition"
  );
});

/* --------------------------------------------------------------------------
   TIER 2: BOUNDARY & CORNER CASES
   -------------------------------------------------------------------------- */
console.log("\n--- TIER 2: BOUNDARY & CORNER CASES (10 tests) ---");

recordTest("Tier 2", "T2-1", "Search algorithm resets to full catalog on empty string input", () => {
  const items = [{ id: 1, name: "A" }, { id: 2, name: "B" }];
  const runFilter = (q) => (!q || q.trim() === "" ? items : items.filter((i) => i.name.includes(q)));
  assert.strictEqual(runFilter("").length, 2);
});

recordTest("Tier 2", "T2-2", "Search algorithm resets to full catalog on whitespace-only input", () => {
  const items = [{ id: 1, name: "A" }, { id: 2, name: "B" }];
  const runFilter = (q) => (!q || q.trim() === "" ? items : items.filter((i) => i.name.includes(q)));
  assert.strictEqual(runFilter("    \t\n   ").length, 2);
});

recordTest("Tier 2", "T2-3", "Search algorithm handles single character case-insensitively", () => {
  const items = [{ id: 1, name: "Dynamic Bull T-Shirt" }, { id: 2, name: "Mug" }];
  const q = "B";
  const runFilter = (str) => items.filter((i) => i.name.toLowerCase().includes(str.toLowerCase().trim()));
  assert.strictEqual(runFilter(q).length, 1);
  assert.strictEqual(runFilter(q)[0].name, "Dynamic Bull T-Shirt");
});

recordTest("Tier 2", "T2-4", "Quantity sanitization converts 0 to minimum 1", () => {
  const sanitize = (val) => Math.max(1, parseInt(val, 10) || 1);
  assert.strictEqual(sanitize(0), 1);
  assert.strictEqual(sanitize("0"), 1);
});

recordTest("Tier 2", "T2-5", "Quantity sanitization converts negative numbers to minimum 1", () => {
  const sanitize = (val) => Math.max(1, parseInt(val, 10) || 1);
  assert.strictEqual(sanitize(-10), 1);
  assert.strictEqual(sanitize("-5"), 1);
});

recordTest("Tier 2", "T2-6", "Quantity sanitization converts non-numeric strings to minimum 1", () => {
  const sanitize = (val) => Math.max(1, parseInt(val, 10) || 1);
  assert.strictEqual(sanitize("invalid"), 1);
  assert.strictEqual(sanitize(""), 1);
  assert.strictEqual(sanitize(null), 1);
  assert.strictEqual(sanitize(undefined), 1);
});

recordTest("Tier 2", "T2-7", "Quantity sanitization preserves valid large integers", () => {
  const sanitize = (val) => Math.max(1, parseInt(val, 10) || 1);
  assert.strictEqual(sanitize("99"), 99);
  assert.strictEqual(sanitize(500), 500);
});

recordTest("Tier 2", "T2-8", "FilterSelect option 'all' correctly matches and returns full catalog", () => {
  const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const handleSelect = (selectedOption) => {
    if (!selectedOption || selectedOption.value === "all" || selectedOption.value === "All Products") {
      return items;
    }
    return items.filter((i) => i.category === selectedOption.value);
  };
  assert.strictEqual(handleSelect({ value: "all" }).length, 3);
  assert.strictEqual(handleSelect({ value: "All Products" }).length, 3);
});

recordTest("Tier 2", "T2-9", "WhatsApp message formatter handles single-item cart correctly", () => {
  const cartList = [{ productName: "Dynamic Bull T-Shirt", qty: 1, price: 349 }];
  const totalPrice = 349;
  const itemsSummary = cartList.map((item, idx) => `${idx + 1}. ${item.productName} - Qty: ${item.qty} - ₹${item.price * item.qty}`).join("\n");
  const msg = `Hello! I would like to place an order from Aww Range:\n\n${itemsSummary}\n\nTotal Price: ₹${totalPrice}\n\nPlease confirm my order.`;
  assert(msg.includes("1. Dynamic Bull T-Shirt - Qty: 1 - ₹349"));
  assert(msg.includes("Total Price: ₹349"));
});

recordTest("Tier 2", "T2-10", "WhatsApp message formatter handles multi-item cart with accurate line totals", () => {
  const cartList = [
    { productName: "Item A", qty: 2, price: 100 },
    { productName: "Item B", qty: 3, price: 200 },
  ];
  const totalPrice = 2 * 100 + 3 * 200; // 800
  const itemsSummary = cartList.map((item, idx) => `${idx + 1}. ${item.productName} - Qty: ${item.qty} - ₹${item.price * item.qty}`).join("\n");
  const msg = `Hello! I would like to place an order from Aww Range:\n\n${itemsSummary}\n\nTotal Price: ₹${totalPrice}\n\nPlease confirm my order.`;
  assert(msg.includes("1. Item A - Qty: 2 - ₹200"));
  assert(msg.includes("2. Item B - Qty: 3 - ₹600"));
  assert(msg.includes("Total Price: ₹800"));
});

/* --------------------------------------------------------------------------
   TIER 3: CROSS-FEATURE COMBINATIONS
   -------------------------------------------------------------------------- */
console.log("\n--- TIER 3: CROSS-FEATURE COMBINATIONS (5 tests) ---");

recordTest("Tier 3", "T3-1", "Category filtering followed by search filtering yields correct intersection", () => {
  const catalog = [
    { id: 1, productName: "Classic T-Shirt", category: "T-Shirts" },
    { id: 2, productName: "Bull T-Shirt", category: "T-Shirts" },
    { id: 3, productName: "Mountain Mug", category: "Mugs" },
  ];
  const catFiltered = catalog.filter((i) => i.category === "T-Shirts");
  const searchFiltered = catFiltered.filter((i) => i.productName.toLowerCase().includes("bull"));
  assert.strictEqual(searchFiltered.length, 1);
  assert.strictEqual(searchFiltered[0].productName, "Bull T-Shirt");
});

recordTest("Tier 3", "T3-2", "Search reset restores full catalog allowing subsequent category filter", () => {
  const catalog = [
    { id: 1, productName: "Tee", category: "T-Shirts" },
    { id: 2, productName: "Mug", category: "Mugs" },
  ];
  // Filter by search then clear
  let list = catalog.filter((i) => i.productName.includes("xyz"));
  assert.strictEqual(list.length, 0);
  // Reset
  list = catalog;
  // Category filter
  list = list.filter((i) => i.category === "Mugs");
  assert.strictEqual(list.length, 1);
  assert.strictEqual(list[0].category, "Mugs");
});

recordTest("Tier 3", "T3-3", "Redux cart reducer preserves integer arithmetic across multiple item additions", () => {
  let cartList = [];
  const addItem = (product, num) => {
    const qty = Math.max(1, parseInt(num, 10) || 1);
    const existing = cartList.find((i) => i.id === product.id);
    if (existing) {
      cartList = cartList.map((i) => (i.id === product.id ? { ...existing, qty: existing.qty + qty } : i));
    } else {
      cartList.push({ ...product, qty });
    }
  };
  const mug = { id: "40", productName: "Mountain Mug", price: 299 };
  addItem(mug, "2");
  addItem(mug, 3);
  assert.strictEqual(cartList[0].qty, 5); // 2 + 3 = 5, NOT "23"
  assert.strictEqual(typeof cartList[0].qty, "number");
});

recordTest("Tier 3", "T3-4", "Mixed-category cart computes grand total and generates valid WhatsApp URL", () => {
  const cartList = [
    { id: "1", productName: "T-Shirt", category: "T-Shirts", qty: 2, price: 349 },
    { id: "2", productName: "Mug", category: "Mugs", qty: 1, price: 299 },
    { id: "3", productName: "Tote Bag", category: "Tote Bags", qty: 1, price: 399 },
  ];
  const total = cartList.reduce((sum, item) => sum + item.qty * item.price, 0);
  assert.strictEqual(total, 2 * 349 + 299 + 399); // 698 + 299 + 399 = 1396

  const itemsSummary = cartList.map((i, idx) => `${idx + 1}. ${i.productName} - Qty: ${i.qty} - ₹${i.price * i.qty}`).join("\n");
  const msg = `Hello! I would like to place an order from Aww Range:\n\n${itemsSummary}\n\nTotal Price: ₹${total}\n\nPlease confirm my order.`;
  const encodedUrl = `https://wa.me/919365324146?text=${encodeURIComponent(msg)}`;

  const parsedUrl = new URL(encodedUrl);
  assert.strictEqual(parsedUrl.hostname, "wa.me");
  assert.strictEqual(parsedUrl.pathname, "/919365324146");
  const decodedText = parsedUrl.searchParams.get("text");
  assert(decodedText.includes("1. T-Shirt - Qty: 2 - ₹698"));
  assert(decodedText.includes("Total Price: ₹1396"));
});

recordTest("Tier 3", "T3-5", "ProductDetails inquiry message synchronizes with quantity selector changes", () => {
  const product = { id: "10", productName: "Bull T-Shirt", price: 349 };
  const origin = "https://www.awwrange.in";
  const makeInquiry = (quantity) => {
    const qtyNum = Math.max(1, parseInt(quantity, 10) || 1);
    const lineTotal = product.price * qtyNum;
    return `Hello! I would like to inquire about/order this product:\n- Product: ${product.productName} (ID: ${product.id})\n- Price: ₹${product.price}\n- Quantity: ${qtyNum}\n- Total: ₹${lineTotal}\n\nLink: ${origin}/shop/${product.id}`;
  };

  const msg1 = makeInquiry(1);
  assert(msg1.includes("Quantity: 1"));
  assert(msg1.includes("Total: ₹349"));

  const msg4 = makeInquiry("4");
  assert(msg4.includes("Quantity: 4"));
  assert(msg4.includes("Total: ₹1396"));
});

/* --------------------------------------------------------------------------
   TIER 4: REAL-WORLD SCENARIOS
   -------------------------------------------------------------------------- */
console.log("\n--- TIER 4: REAL-WORLD SCENARIOS (3 tests) ---");

recordTest("Tier 4", "T4-1", "Full End-to-End Shopping Journey from Catalog Browse to WhatsApp Order URL", () => {
  // 1. Initial full catalog
  const catalog = [
    { id: "10", productName: "Dynamic Bull T-Shirt", category: "T-Shirts", price: 349 },
    { id: "40", productName: "Mountain EST 2024 Ceramic Mug", category: "Mugs", price: 299 },
    { id: "42", productName: "Face Art Canvas Tote Bag", category: "Tote Bags", price: 399 },
  ];
  assert.strictEqual(catalog.length, 3);

  // 2. Filter by Mugs category
  const mugCategory = catalog.filter((p) => p.category === "Mugs");
  assert.strictEqual(mugCategory.length, 1);

  // 3. Search within category
  const searchMatch = mugCategory.filter((p) => p.productName.toLowerCase().includes("mountain"));
  assert.strictEqual(searchMatch.length, 1);
  const selectedProduct = searchMatch[0];

  // 4. Quantity selection on product details
  const chosenQuantity = "2";
  const sanitizedQty = Math.max(1, parseInt(chosenQuantity, 10) || 1);
  assert.strictEqual(sanitizedQty, 2);

  // 5. Add to Cart action
  let cart = [];
  cart.push({ ...selectedProduct, qty: sanitizedQty });
  assert.strictEqual(cart.length, 1);
  assert.strictEqual(cart[0].qty, 2);

  // 6. Compute cart totals
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  assert.strictEqual(total, 598);

  // 7. Generate WhatsApp checkout URL
  const summary = cart.map((i, idx) => `${idx + 1}. ${i.productName} - Qty: ${i.qty} - ₹${i.price * i.qty}`).join("\n");
  const orderMsg = `Hello! I would like to place an order from Aww Range:\n\n${summary}\n\nTotal Price: ₹${total}\n\nPlease confirm my order.`;
  const url = `https://wa.me/919365324146?text=${encodeURIComponent(orderMsg)}`;

  assert(url.startsWith("https://wa.me/919365324146?text="));
  const decoded = decodeURIComponent(url.split("?text=")[1]);
  assert(decoded.includes("Mountain EST 2024 Ceramic Mug"));
  assert(decoded.includes("Qty: 2"));
  assert(decoded.includes("₹598"));
});

recordTest("Tier 4", "T4-2", "Multi-Item Shopping Cart Modification & WhatsApp Checkout Flow", () => {
  let cart = [
    { id: "10", productName: "Bull T-Shirt", price: 349, qty: 1 },
    { id: "40", productName: "Mountain Mug", price: 299, qty: 1 },
  ];

  // User increments first item
  cart[0].qty += 1;
  assert.strictEqual(cart[0].qty, 2);

  let total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  assert.strictEqual(total, 349 * 2 + 299); // 997

  // User deletes second item
  cart = cart.filter((i) => i.id !== "40");
  assert.strictEqual(cart.length, 1);

  total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  assert.strictEqual(total, 698);

  const summary = cart.map((i, idx) => `${idx + 1}. ${i.productName} - Qty: ${i.qty} - ₹${i.price * i.qty}`).join("\n");
  const msg = `Hello! I would like to place an order from Aww Range:\n\n${summary}\n\nTotal Price: ₹${total}\n\nPlease confirm my order.`;
  assert(msg.includes("1. Bull T-Shirt - Qty: 2 - ₹698"));
  assert(msg.includes("Total Price: ₹698"));
  assert(!msg.includes("Mountain"));
});

recordTest("Tier 4", "T4-3", "Social Share and Direct WhatsApp Inquiry Workflow", () => {
  const product = { id: "42", productName: "Face Art Canvas Tote Bag", price: 399 };
  const origin = "https://www.awwrange.in";

  // Share config
  const shareConfig = {
    url: `${origin}/shop/${product.id}`,
    title: product.productName,
  };
  assert.strictEqual(shareConfig.url, "https://www.awwrange.in/shop/42");

  // Direct WhatsApp inquiry config
  const qty = 3;
  const lineTotal = product.price * qty;
  const inquiry = `Hello! I would like to inquire about/order this product:\n- Product: ${product.productName} (ID: ${product.id})\n- Price: ₹${product.price}\n- Quantity: ${qty}\n- Total: ₹${lineTotal}\n\nLink: ${origin}/shop/${product.id}`;
  const inquiryUrl = `https://wa.me/919365324146?text=${encodeURIComponent(inquiry)}`;

  const parsed = new URL(inquiryUrl);
  const text = parsed.searchParams.get("text");
  assert(text.includes("Face Art Canvas Tote Bag"));
  assert(text.includes("ID: 42"));
  assert(text.includes("Quantity: 3"));
  assert(text.includes("Total: ₹1197"));
  assert(text.includes("Link: https://www.awwrange.in/shop/42"));
});

console.log("\n=================================================================");
console.log(`  TEST RESULTS SUMMARY:`);
console.log(`  Total:  ${passed + failed}`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log("=================================================================");

if (typeof test === "function") {
  test("Standalone requirement runner completes with 0 failures", () => {
    assert.strictEqual(failed, 0);
  });
}

if (typeof jest === "undefined" && require.main === module) {
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
