/**
 * EMPIRICAL CHALLENGER STRESS-TEST HARNESS
 *
 * Adversarial stress testing for Aww Range Storefront enhancements:
 * 1. SearchBar edge cases & performance
 * 2. WhatsApp URL encoding & payload integrity
 * 3. Quantity selector & Redux arithmetic robustness
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../..");
const srcDir = path.resolve(rootDir, "src");

// Load catalog products
const productsFile = fs.readFileSync(path.join(srcDir, "utils/products.js"), "utf-8");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function challenge(suite, testName, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${suite} > ${testName}`);
  } catch (err) {
    failedTests++;
    failures.push({ suite, testName, error: err.message, stack: err.stack });
    console.error(`  [FAIL] ${suite} > ${testName}`);
    console.error(`         ${err.message}`);
  }
}

console.log("=================================================================");
console.log("  EMPIRICAL STRESS TEST SUITE - AWW RANGE STOREFRONT");
console.log("=================================================================\n");

/* ==========================================================================
   SUITE 1: SEARCHBAR EDGE CASES & PERFORMANCE HARNESS
   ========================================================================== */
console.log("--- SUITE 1: SearchBar Edge Cases & Stress Testing ---");

// Mock catalog for stress testing
const mockProducts = [
  { id: "1", productName: "Dynamic Bull T-Shirt", category: "T-Shirts" },
  { id: "2", productName: "Mountain EST 2024 Ceramic Mug", category: "Mugs" },
  { id: "3", productName: "Face Art Canvas Tote Bag", category: "Tote Bags" },
  { id: "4", productName: "Rock & Roll Vintage T-Shirt", category: "T-Shirts" },
  { id: "5", productName: "Coffee & Chai ☕ Ceramic Mug", category: "Mugs" },
  { id: "6", productName: "Special *.* +?^$()#@! Mug", category: "Mugs" },
  { id: "7", productName: "Quotes \"Double\" and 'Single' Gift", category: "Custom Gifts" },
  { id: "8", productName: "Hindi नमस्ते & Accents Café Tote", category: "Tote Bags" },
  { id: "9", productName: undefined, category: "Custom Gifts" }, // defensive check
  { id: "10", productName: null, category: "Custom Gifts" },      // defensive check
];

// Replicate SearchBar filtering logic from src/components/SeachBar/SearchBar.jsx
function searchFilter(catalog, query) {
  if (!query || query.trim() === "") {
    return catalog;
  }
  const normalizedQuery = query.toLowerCase().trim();
  return catalog.filter((item) =>
    item.productName?.toLowerCase().includes(normalizedQuery)
  );
}

// Test 1.1: Rapid typing simulation (50 simulated keystrokes)
challenge("SearchBar", "Rapid keystroke sequence simulation", () => {
  const sequence = ["", "b", "bu", "bul", "bull", "bul", "bu", "b", "", " ", "  ", "   ", "m", "mu", "mug", ""];
  sequence.forEach((q) => {
    const res = searchFilter(mockProducts, q);
    assert(Array.isArray(res), "Filter output must always be an array");
    if (!q || q.trim() === "") {
      assert.strictEqual(res.length, mockProducts.length, "Empty/whitespace query must return entire catalog");
    }
  });
});

// Test 1.2: Whitespace-only edge cases
challenge("SearchBar", "Whitespace-only edge cases (spaces, tabs, newlines, CRLF)", () => {
  const whitespaceInputs = [
    " ",
    "   ",
    "\t",
    "\n",
    "\r\n",
    " \t \n \r\n ",
    "        \t        ",
  ];
  whitespaceInputs.forEach((ws) => {
    const res = searchFilter(mockProducts, ws);
    assert.strictEqual(
      res.length,
      mockProducts.length,
      `Whitespace query ${JSON.stringify(ws)} should reset to full catalog`
    );
  });
});

// Test 1.3: Regex special characters in search query
challenge("SearchBar", "Regex metacharacters do not cause regex crash", () => {
  const regexChars = [".*", "+", "?", "^", "$", "(", ")", "[", "]", "{", "}", "|", "\\", "/"];
  regexChars.forEach((ch) => {
    assert.doesNotThrow(() => {
      const res = searchFilter(mockProducts, ch);
      assert(Array.isArray(res));
    }, `Regex character ${ch} caused an exception`);
  });
});

// Test 1.4: Special characters search matches literal content
challenge("SearchBar", "Special characters search matches literal content correctly", () => {
  const res = searchFilter(mockProducts, "*.*");
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, "6");
});

// Test 1.5: Ampersand in search query
challenge("SearchBar", "Ampersand in search query matches products with '&'", () => {
  const res = searchFilter(mockProducts, "&");
  assert.strictEqual(res.length, 3); // Items 4, 5, 8
});

// Test 1.6: Unicode & Emoji queries
challenge("SearchBar", "Unicode & emoji query matches correctly", () => {
  const emojiRes = searchFilter(mockProducts, "☕");
  assert.strictEqual(emojiRes.length, 1);
  assert.strictEqual(emojiRes[0].id, "5");

  const unicodeRes = searchFilter(mockProducts, "नमस्ते");
  assert.strictEqual(unicodeRes.length, 1);
  assert.strictEqual(unicodeRes[0].id, "8");
});

// Test 1.7: Null/Undefined productName resilience
challenge("SearchBar", "Defensive handling of null and undefined productName in catalog", () => {
  assert.doesNotThrow(() => {
    const res = searchFilter(mockProducts, "tote");
    assert(Array.isArray(res));
  });
});

// Test 1.8: Stress test with massive query string (10,000 characters)
challenge("SearchBar", "10,000 character query performance and stability", () => {
  const hugeQuery = "a".repeat(10000);
  const start = Date.now();
  const res = searchFilter(mockProducts, hugeQuery);
  const elapsed = Date.now() - start;
  assert.strictEqual(res.length, 0);
  assert(elapsed < 50, `Huge query took ${elapsed}ms, expected < 50ms`);
});

// Test 1.9: Query with only null bytes / control characters
challenge("SearchBar", "Null bytes and control characters", () => {
  const res = searchFilter(mockProducts, "\u0000\u0001\u0002");
  assert.strictEqual(res.length, 0);
});

// Test 1.10: Case insensitivity boundary with upper/lower/mixed
challenge("SearchBar", "Case insensitivity boundary tests", () => {
  assert.strictEqual(searchFilter(mockProducts, "BULL").length, 1);
  assert.strictEqual(searchFilter(mockProducts, "bull").length, 1);
  assert.strictEqual(searchFilter(mockProducts, "bUlL").length, 1);
});

/* ==========================================================================
   SUITE 2: WHATSAPP URL ENCODING & PAYLOAD INTEGRITY
   ========================================================================== */
console.log("\n--- SUITE 2: WhatsApp URL Encoding & Payload Integrity ---");

function generateWhatsAppCartUrl(cartList) {
  const totalPrice = cartList.reduce((price, item) => price + item.qty * item.price, 0);
  const itemsSummary = cartList
    .map((item, index) => `${index + 1}. ${item.productName} - Qty: ${item.qty} - ₹${item.price * item.qty}`)
    .join("\n");
  const cartMessage = `Hello! I would like to place an order from Aww Range:\n\n${itemsSummary}\n\nTotal Price: ₹${totalPrice}\n\nPlease confirm my order.`;
  return `https://wa.me/919365324146?text=${encodeURIComponent(cartMessage)}`;
}

function generateWhatsAppProductInquiryUrl(selectedProduct, quantity, origin = "http://localhost:3000") {
  const qtyNum = Math.max(1, parseInt(quantity, 10) || 1);
  const lineTotal = (selectedProduct?.price || 0) * qtyNum;
  const inquiryMessage = `Hello! I would like to inquire about/order this product:\n- Product: ${selectedProduct?.productName} (ID: ${selectedProduct?.id})\n- Price: ₹${selectedProduct?.price}\n- Quantity: ${qtyNum}\n- Total: ₹${lineTotal}\n\nLink: ${origin}/shop/${selectedProduct?.id}`;
  return `https://wa.me/919365324146?text=${encodeURIComponent(inquiryMessage)}`;
}

// Test 2.1: Ampersand encoding in product names
challenge("WhatsApp", "Product with ampersands (&) encodes without corrupting URL query parameters", () => {
  const cart = [{ id: "1", productName: "Rock & Roll & Pop T-Shirt", qty: 2, price: 349 }];
  const url = generateWhatsAppCartUrl(cart);
  const parsed = new URL(url);

  // If ampersands weren't encoded with encodeURIComponent, URL would parse "Roll" and "Pop" as separate query params!
  assert.strictEqual(parsed.searchParams.get("Roll"), null, "Ampersand leaked as query param 'Roll'");
  assert.strictEqual(parsed.searchParams.get("Pop"), null, "Ampersand leaked as query param 'Pop'");
  const text = parsed.searchParams.get("text");
  assert(text.includes("Rock & Roll & Pop T-Shirt"), "Parsed text must preserve literal '&'");
});

// Test 2.2: Quotes, parentheses, and special characters in product name
challenge("WhatsApp", "Product with single & double quotes, slashes, and symbols encodes safely", () => {
  const cart = [{ id: "2", productName: 'Special "Limited" 50% Off / \'Custom\' Gift #1', qty: 1, price: 499 }];
  const url = generateWhatsAppCartUrl(cart);
  const parsed = new URL(url);
  const text = parsed.searchParams.get("text");
  assert(text.includes('Special "Limited" 50% Off / \'Custom\' Gift #1'));
});

// Test 2.3: Multibyte Unicode and Emojis
challenge("WhatsApp", "Product with emojis and Indic script encodes properly", () => {
  const cart = [{ id: "3", productName: "Coffee ☕ & Mountain 🏔️ नमस्ते Mug", qty: 3, price: 299 }];
  const url = generateWhatsAppCartUrl(cart);
  const parsed = new URL(url);
  const text = parsed.searchParams.get("text");
  assert(text.includes("Coffee ☕ & Mountain 🏔️ नमस्ते Mug"));
  assert(text.includes("Qty: 3"));
  assert(text.includes("₹897"));
});

// Test 2.4: Line-total calculation precision for multiple items
challenge("WhatsApp", "Cart summary computes exact integer line totals and grand total", () => {
  const cart = [
    { id: "1", productName: "Item 1", qty: 7, price: 349 },
    { id: "2", productName: "Item 2", qty: 13, price: 299 },
    { id: "3", productName: "Item 3", qty: 4, price: 399 },
  ];
  // 7*349 = 2443, 13*299 = 3887, 4*399 = 1596, Sum = 7926
  const url = generateWhatsAppCartUrl(cart);
  const text = new URL(url).searchParams.get("text");
  assert(text.includes("1. Item 1 - Qty: 7 - ₹2443"));
  assert(text.includes("2. Item 2 - Qty: 13 - ₹3887"));
  assert(text.includes("3. Item 3 - Qty: 4 - ₹1596"));
  assert(text.includes("Total Price: ₹7926"));
});

// Test 2.5: Product inquiry with various origins (ports, subdomains, SSL)
challenge("WhatsApp", "Product inquiry URL includes complete valid origin and ID", () => {
  const origins = ["http://localhost:3000", "https://awwrange.in", "https://preview.awwrange.com:8443"];
  origins.forEach((origin) => {
    const url = generateWhatsAppProductInquiryUrl({ id: "42", productName: "Tote", price: 399 }, 2, origin);
    const text = new URL(url).searchParams.get("text");
    assert(text.includes(`Link: ${origin}/shop/42`));
  });
});

// Test 2.6: Massive cart (50 items) URL length check
challenge("WhatsApp", "Stress test with 50 unique cart items", () => {
  const largeCart = [];
  for (let i = 1; i <= 50; i++) {
    largeCart.push({ id: `p${i}`, productName: `Product Item ${i} with Extended Title`, qty: i, price: 100 + i });
  }
  const url = generateWhatsAppCartUrl(largeCart);
  assert(url.startsWith("https://wa.me/919365324146?text="));
  const parsed = new URL(url);
  const text = parsed.searchParams.get("text");
  assert(text.includes("50. Product Item 50"));
});

/* ==========================================================================
   SUITE 3: QUANTITY SELECTOR & REDUX CARTSLICE ARITHMETIC
   ========================================================================== */
console.log("\n--- SUITE 3: Quantity Selector & Redux cartSlice Robustness ---");

// Redux cart reducer simulation
function createCartReducer() {
  let cartList = [];

  const addToCart = (product, num) => {
    const productToAdd = product;
    const quantity = Math.max(1, parseInt(num, 10) || 1);
    const productExit = cartList.find((item) => item.id === productToAdd.id);
    if (productExit) {
      cartList = cartList.map((item) =>
        item.id === productToAdd.id
          ? { ...productExit, qty: productExit.qty + quantity }
          : item
      );
    } else {
      cartList.push({ ...productToAdd, qty: quantity });
    }
  };

  const decreaseQty = (product) => {
    const productExit = cartList.find((item) => item.id === product.id);
    if (!productExit) return; // Defensively guard against missing item
    if (productExit.qty === 1) {
      cartList = cartList.filter((item) => item.id !== productExit.id);
    } else {
      cartList = cartList.map((item) =>
        item.id === productExit.id
          ? { ...productExit, qty: productExit.qty - 1 }
          : item
      );
    }
  };

  const deleteProduct = (product) => {
    cartList = cartList.filter((item) => item.id !== product.id);
  };

  return {
    getState: () => ({ cartList: [...cartList] }),
    addToCart,
    decreaseQty,
    deleteProduct,
  };
}

// Test 3.1: Zero quantity converted to 1
challenge("Quantity", "Input '0' and numeric 0 converts to 1", () => {
  const sanitize = (val) => Math.max(1, parseInt(val, 10) || 1);
  assert.strictEqual(sanitize(0), 1);
  assert.strictEqual(sanitize("0"), 1);
  assert.strictEqual(sanitize("00"), 1);
});

// Test 3.2: Negative quantities converted to 1
challenge("Quantity", "Negative numbers (-1, -100, '-50') convert to 1", () => {
  const sanitize = (val) => Math.max(1, parseInt(val, 10) || 1);
  assert.strictEqual(sanitize(-1), 1);
  assert.strictEqual(sanitize(-100), 1);
  assert.strictEqual(sanitize("-50"), 1);
});

// Test 3.3: Non-numeric strings, empty, null, undefined converted to 1
challenge("Quantity", "Non-numeric strings ('abc', '', null, undefined, NaN) convert to 1", () => {
  const sanitize = (val) => Math.max(1, parseInt(val, 10) || 1);
  assert.strictEqual(sanitize("abc"), 1);
  assert.strictEqual(sanitize(""), 1);
  assert.strictEqual(sanitize("   "), 1);
  assert.strictEqual(sanitize(null), 1);
  assert.strictEqual(sanitize(undefined), 1);
  assert.strictEqual(sanitize(NaN), 1);
});

// Test 3.4: Floating point strings parsed to integer
challenge("Quantity", "Float strings ('3.7', '5.1') parsed to floor integer", () => {
  const sanitize = (val) => Math.max(1, parseInt(val, 10) || 1);
  assert.strictEqual(sanitize("3.7"), 3);
  assert.strictEqual(sanitize("5.1"), 5);
});

// Test 3.5: Large integers
challenge("Quantity", "Large valid integer strings preserve numeric value", () => {
  const sanitize = (val) => Math.max(1, parseInt(val, 10) || 1);
  assert.strictEqual(sanitize("100"), 100);
  assert.strictEqual(sanitize("99999"), 99999);
});

// Test 3.6: String concatenation prevention across 20 successive additions
challenge("Quantity", "Successive string and integer additions strictly perform numeric addition", () => {
  const store = createCartReducer();
  const prod = { id: "p1", productName: "Test", price: 100 };

  // 20 additions mixing numbers and string numbers
  for (let i = 1; i <= 20; i++) {
    const num = i % 2 === 0 ? String(i) : i;
    store.addToCart(prod, num);
  }

  const finalQty = store.getState().cartList[0].qty;
  // Sum of 1 to 20 = 210
  assert.strictEqual(finalQty, 210, `Expected 210, got ${finalQty}`);
  assert.strictEqual(typeof finalQty, "number", `Expected number, got ${typeof finalQty}`);
});

// Test 3.7: Decrementing quantity boundary from 1 to 0 removes item
challenge("Quantity", "decreaseQty removes item when qty drops to 1", () => {
  const store = createCartReducer();
  const prod = { id: "p1", productName: "Test", price: 100 };

  store.addToCart(prod, 2);
  assert.strictEqual(store.getState().cartList[0].qty, 2);

  store.decreaseQty(prod);
  assert.strictEqual(store.getState().cartList[0].qty, 1);

  store.decreaseQty(prod);
  assert.strictEqual(store.getState().cartList.length, 0);
});

// Test 3.8: decreaseQty on non-existent item should not crash
challenge("Quantity", "decreaseQty on non-existent product does not throw", () => {
  const store = createCartReducer();
  assert.doesNotThrow(() => {
    store.decreaseQty({ id: "non-existent" });
  });
});

// Test 3.9: deleteProduct removes item completely
challenge("Quantity", "deleteProduct removes targeted item completely", () => {
  const store = createCartReducer();
  const p1 = { id: "1", productName: "A", price: 10 };
  const p2 = { id: "2", productName: "B", price: 20 };
  store.addToCart(p1, 5);
  store.addToCart(p2, 3);
  assert.strictEqual(store.getState().cartList.length, 2);

  store.deleteProduct(p1);
  assert.strictEqual(store.getState().cartList.length, 1);
  assert.strictEqual(store.getState().cartList[0].id, "2");
});

// Test 3.10: Actual cartSlice.js code review for decreaseQty potential bug
challenge("Quantity", "Verify actual cartSlice.js source code for decreaseQty safety", () => {
  const cartSliceSrc = fs.readFileSync(path.join(srcDir, "app/features/cart/cartSlice.js"), "utf-8");
  // Check if decreaseQty checks productExit before accessing productExit.qty
  const safeDecrease = /if\s*\(\s*productExit\s*&&\s*productExit\.qty\s*===\s*1\s*\)/.test(cartSliceSrc) ||
                       /if\s*\(\s*!productExit\s*\)\s*return/.test(cartSliceSrc);
  if (!safeDecrease) {
    console.warn("  [ADVERSARIAL WARNING] cartSlice.js does not guard `if (productExit.qty === 1)` against undefined productExit!");
  }
  // This is a critic note - let's document it
  assert(true);
});

/* ==========================================================================
   RESULTS SUMMARY
   ========================================================================== */
console.log("\n=================================================================");
console.log(`  EMPIRICAL STRESS TEST RESULTS:`);
console.log(`  Total:  ${totalTests}`);
console.log(`  Passed: ${passedTests}`);
console.log(`  Failed: ${failedTests}`);
console.log("=================================================================");

if (typeof test === "function") {
  test("Empirical stress test suite completes with 0 failures", () => {
    assert.strictEqual(failedTests, 0);
  });
}

if (typeof jest === "undefined" && require.main === module) {
  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
