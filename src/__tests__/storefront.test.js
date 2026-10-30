/**
 * Comprehensive Requirement-Driven E2E Test Suite for Aww Range Storefront
 *
 * Test Organization:
 * - Tier 1: Feature Coverage (>=5 per feature across R1, R2, R3, R4, R5, R6)
 * - Tier 2: Boundary & Corner Cases (search edge cases, quantity bounds, cart variations)
 * - Tier 3: Cross-Feature Combinations (category + search, new categories in cart, WhatsApp flows)
 * - Tier 4: Real-World Scenarios (Full E2E shopping journey from catalog to WhatsApp order)
 */

import React from "react";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import fs from "fs";
import path from "path";

// Components & Redux
import cartSlice, {
  addToCart,
  decreaseQty,
  deleteProduct,
} from "../app/features/cart/cartSlice";
import NavBar from "../components/Navbar/Navbar";
import SearchBar from "../components/SeachBar/SearchBar";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import FilterSelect from "../components/FilterSelect";
import ProductCard from "../components/ProductCard/ProductCard";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import { products } from "../utils/products";

// Mocks
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
  ToastContainer: () => null,
}));

jest.mock("react-web-share", () => ({
  RWebShare: ({ children, data }) => (
    <div data-testid="rwebshare" data-share-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
}));

// Mock react-select for deterministic DOM interactions
jest.mock("react-select", () => {
  return function MockSelect({ options, onChange, defaultValue }) {
    return (
      <select
        data-testid="mock-select"
        defaultValue={defaultValue?.value || ""}
        onChange={(e) => {
          const selected = options.find((opt) => opt.value === e.target.value);
          onChange(selected || { value: e.target.value, label: e.target.value });
        }}
      >
        <option value="">Filter By Category</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };
});

// Helper store factory
const createTestStore = (initialCartList = []) => {
  return configureStore({
    reducer: {
      cart: cartSlice,
    },
    preloadedState: {
      cart: {
        cartList: initialCartList,
      },
    },
  });
};

// Mock product fixture
const mockProduct = {
  id: "10",
  productName: "Dynamic Bull T-Shirt",
  imgUrl: "/test-bull.png",
  category: "T-Shirts",
  price: 349,
  shortDesc: "Premium soft fabric, striking design",
  description: "Unleash inner strength with Dynamic Bull T-Shirt.",
  avgRating: 4.8,
};

const mockMug = {
  id: "40",
  productName: "Mountain EST 2024 Ceramic Mug",
  imgUrl: "/test-mug.png",
  category: "Mugs",
  price: 299,
  shortDesc: "Sturdy ceramic mug with bold mountain range design",
  description: "Embrace adventure with Mountain EST 2024 mug.",
  avgRating: 4.8,
};

const mockTote = {
  id: "42",
  productName: "Face Art Canvas Tote Bag",
  imgUrl: "/test-bag.png",
  category: "Tote Bags",
  price: 399,
  shortDesc: "Minimalist face art line drawing on durable canvas",
  description: "Elevate your style with Face Art Tote Bag.",
  avgRating: 4.9,
};

describe("Aww Range Storefront - Comprehensive Requirement Test Suite", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    window.scrollY = 0;
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /* ==========================================================================
     TIER 1: FEATURE COVERAGE (>=5 per feature across R1-R6)
     ========================================================================== */

  describe("Tier 1: Feature R1 - Scroll Listener Lifecycle Encapsulation in Navbar", () => {
    test("R1-1: registers scroll event listener on window upon mounting", () => {
      const addSpy = jest.spyOn(window, "addEventListener");
      const store = createTestStore();

      render(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      const scrollCalls = addSpy.mock.calls.filter((c) => c[0] === "scroll");
      expect(scrollCalls.length).toBeGreaterThanOrEqual(1);
      expect(typeof scrollCalls[0][1]).toBe("function");
      addSpy.mockRestore();
    });

    test("R1-2: unregisters scroll listener with matching handler reference upon unmount", () => {
      const addSpy = jest.spyOn(window, "addEventListener");
      const removeSpy = jest.spyOn(window, "removeEventListener");
      const store = createTestStore();

      const { unmount } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      const registeredHandler = addSpy.mock.calls.find((c) => c[0] === "scroll")[1];
      unmount();

      const removedCalls = removeSpy.mock.calls.filter((c) => c[0] === "scroll");
      expect(removedCalls.length).toBeGreaterThanOrEqual(1);
      expect(removedCalls[0][1]).toBe(registeredHandler);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    test("R1-3: listener attachment is encapsulated inside useEffect and does not leak across re-renders", () => {
      const addSpy = jest.spyOn(window, "addEventListener");
      const store = createTestStore();

      const { rerender } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      const initialScrollCalls = addSpy.mock.calls.filter((c) => c[0] === "scroll").length;

      // Re-render
      rerender(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      const postRerenderCalls = addSpy.mock.calls.filter((c) => c[0] === "scroll").length;
      expect(postRerenderCalls).toBe(initialScrollCalls);
      addSpy.mockRestore();
    });

    test("R1-4: applies navbar fixed class when window.scrollY >= 100", () => {
      const store = createTestStore();
      const { container } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      act(() => {
        window.scrollY = 150;
        window.dispatchEvent(new Event("scroll"));
      });

      const navElement = container.querySelector("nav");
      expect(navElement.className).toContain("nav-sticky");
    });

    test("R1-5: removes navbar fixed class when window.scrollY <= 50", () => {
      const store = createTestStore();
      const { container } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      act(() => {
        window.scrollY = 150;
        window.dispatchEvent(new Event("scroll"));
      });
      expect(container.querySelector("nav").className).toContain("nav-sticky");

      act(() => {
        window.scrollY = 30;
        window.dispatchEvent(new Event("scroll"));
      });
      expect(container.querySelector("nav").className).not.toContain("nav-sticky");
    });
  });

  describe("Tier 1: Feature R2 - Instant Search Responsiveness & Reset", () => {
    test("R2-1: immediately filters on input value from first character without delay", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "d" } });

      expect(mockSetFilterList).toHaveBeenCalledTimes(1);
      const filteredResult = mockSetFilterList.mock.calls[0][0];
      expect(Array.isArray(filteredResult)).toBe(true);
      expect(filteredResult.length).toBeGreaterThan(0);
      filteredResult.forEach((item) => {
        expect(item.productName.toLowerCase()).toContain("d");
      });
    });

    test("R2-2: filters correctly when typing a specific product keyword", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "Bull" } });

      expect(mockSetFilterList).toHaveBeenCalledTimes(1);
      const filteredResult = mockSetFilterList.mock.calls[0][0];
      expect(filteredResult.some((item) => item.productName.includes("Bull"))).toBe(true);
    });

    test("R2-3: resets filter to full catalog when input is cleared to empty", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "Bull" } });
      fireEvent.change(input, { target: { value: "" } });

      expect(mockSetFilterList).toHaveBeenCalledTimes(2);
      const secondCallResult = mockSetFilterList.mock.calls[1][0];
      expect(secondCallResult).toHaveLength(products.length);
    });

    test("R2-4: trims leading and trailing whitespace before matching", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "   Bull   " } });

      const filteredResult = mockSetFilterList.mock.calls[0][0];
      expect(filteredResult.some((item) => item.productName.includes("Bull"))).toBe(true);
    });

    test("R2-5: returns empty array for queries that do not match any catalog item", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "NonExistentItem99999" } });

      const filteredResult = mockSetFilterList.mock.calls[0][0];
      expect(filteredResult).toHaveLength(0);
    });
  });

  describe("Tier 1: Feature R3 - Product Details Purchase Flow & Share URL", () => {
    test("R3-1: renders .qty-input with default value and allows input updates", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const qtyInput = document.querySelector(".qty-input");
      expect(qtyInput).toBeInTheDocument();
      expect(qtyInput.value).toBe("1");

      fireEvent.change(qtyInput, { target: { value: "3" } });
      expect(qtyInput.value).toBe("3");
    });

    test("R3-2: clicking Add To Cart dispatches addToCart action with integer quantity to Redux store", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const qtyInput = document.querySelector(".qty-input");
      const addButton = document.querySelector("button.add");

      fireEvent.change(qtyInput, { target: { value: "3" } });
      fireEvent.click(addButton);

      const state = store.getState().cart;
      expect(state.cartList).toHaveLength(1);
      expect(state.cartList[0].id).toBe(mockProduct.id);
      expect(state.cartList[0].qty).toBe(3);
      expect(typeof state.cartList[0].qty).toBe("number");
    });

    test("R3-3: clicking Add To Cart triggers toast.success notification", () => {
      const { toast } = require("react-toastify");
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const addButton = document.querySelector("button.add");
      fireEvent.click(addButton);

      expect(toast.success).toHaveBeenCalledWith("Product has been added to cart!");
    });

    test("R3-4: multiple Add To Cart actions accumulate quantity as integers without string concatenation", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const qtyInput = document.querySelector(".qty-input");
      const addButton = document.querySelector("button.add");

      fireEvent.change(qtyInput, { target: { value: "2" } });
      fireEvent.click(addButton);

      fireEvent.change(qtyInput, { target: { value: "3" } });
      fireEvent.click(addButton);

      const state = store.getState().cart;
      expect(state.cartList[0].qty).toBe(5); // 2 + 3, not "23"
    });

    test("R3-5: RWebShare config uses valid absolute url referencing selectedProduct", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const shareContainer = screen.getByTestId("rwebshare");
      const shareData = JSON.parse(shareContainer.getAttribute("data-share-data"));

      expect(shareData.url).toContain(`/shop/${mockProduct.id}`);
      expect(shareData.url).not.toContain("productItem");
      expect(shareData.title).toBe(mockProduct.productName);
    });
  });

  describe("Tier 1: Feature R4 - Category Filter Expansion & Default View", () => {
    test("R4-1: FilterSelect includes all 5 required category options", () => {
      render(<FilterSelect setFilterList={jest.fn()} />);
      const select = screen.getByTestId("mock-select");

      const options = Array.from(select.querySelectorAll("option")).map((o) => o.textContent);
      expect(options).toContain("All Products");
      expect(options).toContain("T-Shirts");
      expect(options).toContain("Mugs");
      expect(options).toContain("Tote Bags");
      expect(options).toContain("Custom Gifts");
    });

    test("R4-2: selecting All Products invokes setFilterList with the full products catalog", () => {
      const mockSetFilterList = jest.fn();
      render(<FilterSelect setFilterList={mockSetFilterList} />);

      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "all" } });

      expect(mockSetFilterList).toHaveBeenCalledWith(products);
    });

    test("R4-3: selecting Mugs filters catalog strictly to Mugs products", () => {
      const mockSetFilterList = jest.fn();
      render(<FilterSelect setFilterList={mockSetFilterList} />);

      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "Mugs" } });

      const filtered = mockSetFilterList.mock.calls[0][0];
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((item) => expect(item.category).toBe("Mugs"));
    });

    test("R4-4: selecting Tote Bags filters catalog strictly to Tote Bags products", () => {
      const mockSetFilterList = jest.fn();
      render(<FilterSelect setFilterList={mockSetFilterList} />);

      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "Tote Bags" } });

      const filtered = mockSetFilterList.mock.calls[0][0];
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((item) => expect(item.category).toBe("Tote Bags"));
    });

    test("R4-5: Shop page displays full catalog products by default on initial mount", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Shop />
          </MemoryRouter>
        </Provider>
      );

      // Verify that the rendered product cards equal the total catalog items
      const renderedHeadings = screen.getAllByRole("heading", { level: 3 });
      expect(renderedHeadings.length).toBe(products.length);
    });
  });

  describe("Tier 1: Feature R5 - Automated 1-Click WhatsApp Ordering & Inquiry", () => {
    test("R5-1: Cart WhatsApp checkout link targets wa.me/919365324146", () => {
      const cartItems = [{ ...mockProduct, qty: 1 }];
      const store = createTestStore(cartItems);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Cart />
          </MemoryRouter>
        </Provider>
      );

      const link = document.querySelector(".btn-wp");
      expect(link).toBeInTheDocument();
      expect(link.getAttribute("href")).toContain("https://wa.me/919365324146?text=");
      expect(link.getAttribute("target")).toBe("_blank");
    });

    test("R5-2: Cart WhatsApp URL contains URL-encoded itemized cart items and line totals", () => {
      const cartItems = [
        { ...mockProduct, qty: 2, price: 349 },
        { ...mockMug, qty: 1, price: 299 },
      ];
      const store = createTestStore(cartItems);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Cart />
          </MemoryRouter>
        </Provider>
      );

      const link = document.querySelector(".btn-wp");
      const url = link.getAttribute("href");
      const urlTextParam = new URL(url).searchParams.get("text");

      expect(urlTextParam).toContain("Dynamic Bull T-Shirt");
      expect(urlTextParam).toContain("Qty: 2");
      expect(urlTextParam).toContain("₹698");
      expect(urlTextParam).toContain("Mountain EST 2024 Ceramic Mug");
      expect(urlTextParam).toContain("Qty: 1");
      expect(urlTextParam).toContain("₹299");
    });

    test("R5-3: Cart WhatsApp URL contains total price matching computed cart summary", () => {
      const cartItems = [
        { ...mockProduct, qty: 2, price: 349 },
        { ...mockMug, qty: 1, price: 299 },
      ];
      const expectedTotal = 2 * 349 + 1 * 299; // 997
      const store = createTestStore(cartItems);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Cart />
          </MemoryRouter>
        </Provider>
      );

      const link = document.querySelector(".btn-wp");
      const urlTextParam = new URL(link.getAttribute("href")).searchParams.get("text");
      expect(urlTextParam).toContain(`Total Price: ₹${expectedTotal}`);
    });

    test("R5-4: ProductDetails WhatsApp inquiry link targets wa.me/919365324146 and pre-fills product details", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const inquiryLink = document.querySelector(".btn-wpsx");
      expect(inquiryLink).toBeInTheDocument();

      const href = inquiryLink.getAttribute("href");
      expect(href).toContain("https://wa.me/919365324146?text=");

      const textParam = new URL(href).searchParams.get("text");
      expect(textParam).toContain(mockProduct.productName);
      expect(textParam).toContain(`ID: ${mockProduct.id}`);
      expect(textParam).toContain(`Price: ₹${mockProduct.price}`);
      expect(textParam).toContain(`/shop/${mockProduct.id}`);
    });

    test("R5-5: ProductDetails WhatsApp inquiry updates dynamically when quantity selector changes", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const qtyInput = document.querySelector(".qty-input");
      fireEvent.change(qtyInput, { target: { value: "4" } });

      const inquiryLink = document.querySelector(".btn-wpsx");
      const textParam = new URL(inquiryLink.getAttribute("href")).searchParams.get("text");

      expect(textParam).toContain("Quantity: 4");
      expect(textParam).toContain(`Total: ₹${mockProduct.price * 4}`);
    });
  });

  describe("Tier 1: Feature R6 - Modern Cursor CSS & ProductCard Hover Zoom", () => {
    test("R6-1: index.css defines modern brand-styled SVG Data URI cursor for html and body", () => {
      const cssPath = path.resolve(__dirname, "../index.css");
      const cssContent = fs.readFileSync(cssPath, "utf-8");

      expect(cssContent).toMatch(/cursor:\s*url\("data:image\/svg\+xml/);
      expect(cssContent).toMatch(/0f3460/i);
    });

    test("R6-2: index.css defines custom modern pointer cursor for interactive elements", () => {
      const cssPath = path.resolve(__dirname, "../index.css");
      const cssContent = fs.readFileSync(cssPath, "utf-8");

      expect(cssContent).toMatch(/a,\s*button/);
      expect(cssContent).toMatch(/pointer\s*!important/);
    });

    test("R6-3: ProductCard wraps product image inside .product-img-container", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductCard productItem={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const imgContainer = document.querySelector(".product-img-container");
      expect(imgContainer).toBeInTheDocument();
      const img = imgContainer.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img.getAttribute("src")).toBe(mockProduct.imgUrl);
    });

    test("R6-4: product-card.css enforces overflow: hidden on card and container to bound zoom", () => {
      const cssPath = path.resolve(__dirname, "../components/ProductCard/product-card.css");
      const cssContent = fs.readFileSync(cssPath, "utf-8");

      expect(cssContent).toMatch(/\.product\s*\{[^}]*overflow:\s*hidden/);
      expect(cssContent).toMatch(/\.product-img-container\s*\{[^}]*overflow:\s*hidden/);
    });

    test("R6-5: product-card.css defines smooth scale transform hover animation on image", () => {
      const cssPath = path.resolve(__dirname, "../components/ProductCard/product-card.css");
      const cssContent = fs.readFileSync(cssPath, "utf-8");

      expect(cssContent).toMatch(/transform:\s*scale\(/);
      expect(cssContent).toMatch(/transition:\s*transform/);
    });
  });

  /* ==========================================================================
     TIER 2: BOUNDARY & CORNER CASES (10 tests)
     ========================================================================== */

  describe("Tier 2: Boundary & Corner Cases", () => {
    test("T2-1: Search with empty string resets filter to full products list", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "Test" } });
      fireEvent.change(input, { target: { value: "" } });

      expect(mockSetFilterList).toHaveBeenCalledWith(products);
    });

    test("T2-2: Search with whitespace-only ('   ') safely resets filter to full catalog", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "     " } });

      expect(mockSetFilterList).toHaveBeenCalledWith(products);
    });

    test("T2-3: Single character search is case-insensitive (uppercase 'B' matches lowercase)", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "B" } });

      const filtered = mockSetFilterList.mock.calls[0][0];
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((p) => {
        expect(p.productName.toLowerCase()).toContain("b");
      });
    });

    test("T2-4: ProductDetails quantity of 0 is sanitized to minimum 1 upon Add To Cart", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const qtyInput = document.querySelector(".qty-input");
      const addButton = document.querySelector("button.add");

      fireEvent.change(qtyInput, { target: { value: "0" } });
      fireEvent.click(addButton);

      const state = store.getState().cart;
      expect(state.cartList[0].qty).toBe(1);
    });

    test("T2-5: ProductDetails negative quantity (e.g. -5) is sanitized to minimum 1", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const qtyInput = document.querySelector(".qty-input");
      const addButton = document.querySelector("button.add");

      fireEvent.change(qtyInput, { target: { value: "-5" } });
      fireEvent.click(addButton);

      const state = store.getState().cart;
      expect(state.cartList[0].qty).toBe(1);
    });

    test("T2-6: ProductDetails non-numeric string quantity (e.g. 'abc') safely falls back to 1", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const qtyInput = document.querySelector(".qty-input");
      const addButton = document.querySelector("button.add");

      fireEvent.change(qtyInput, { target: { value: "abc" } });
      fireEvent.click(addButton);

      const state = store.getState().cart;
      expect(state.cartList[0].qty).toBe(1);
    });

    test("T2-7: ProductDetails large quantity (e.g. 99) computes correct total and passes integer to Redux", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockProduct} />
          </MemoryRouter>
        </Provider>
      );

      const qtyInput = document.querySelector(".qty-input");
      const addButton = document.querySelector("button.add");

      fireEvent.change(qtyInput, { target: { value: "99" } });
      fireEvent.click(addButton);

      const state = store.getState().cart;
      expect(state.cartList[0].qty).toBe(99);

      const inquiryLink = document.querySelector(".btn-wpsx");
      const textParam = new URL(inquiryLink.getAttribute("href")).searchParams.get("text");
      expect(textParam).toContain(`Total: ₹${mockProduct.price * 99}`);
    });

    test("T2-8: FilterSelect 'All Products' dropdown selection resets full catalog without returning empty", () => {
      const mockSetFilterList = jest.fn();
      render(<FilterSelect setFilterList={mockSetFilterList} />);

      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "all" } });

      expect(mockSetFilterList).toHaveBeenCalledWith(products);
      expect(mockSetFilterList.mock.calls[0][0].length).toBeGreaterThan(0);
    });

    test("T2-9: Empty cart hides WhatsApp order button", () => {
      const store = createTestStore([]);
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Cart />
          </MemoryRouter>
        </Provider>
      );

      const wpButton = document.querySelector(".btn-wp");
      expect(wpButton).toBeNull();
      expect(screen.getByText(/No Items are added in Cart/i)).toBeInTheDocument();
    });

    test("T2-10: Cart WhatsApp message formats accurately for single-item cart vs multi-item cart", () => {
      // 1-item cart
      const store1 = createTestStore([{ ...mockProduct, qty: 1 }]);
      const { unmount } = render(
        <Provider store={store1}>
          <MemoryRouter>
            <Cart />
          </MemoryRouter>
        </Provider>
      );

      const link1 = document.querySelector(".btn-wp");
      const textParam1 = new URL(link1.getAttribute("href")).searchParams.get("text");
      expect(textParam1).toContain(`1. ${mockProduct.productName} - Qty: 1 - ₹${mockProduct.price}`);
      unmount();

      // Multi-item cart
      const store2 = createTestStore([
        { ...mockProduct, qty: 1 },
        { ...mockMug, qty: 2 },
      ]);
      render(
        <Provider store={store2}>
          <MemoryRouter>
            <Cart />
          </MemoryRouter>
        </Provider>
      );

      const link2 = document.querySelector(".btn-wp");
      const textParam2 = new URL(link2.getAttribute("href")).searchParams.get("text");
      expect(textParam2).toContain(`1. ${mockProduct.productName} - Qty: 1`);
      expect(textParam2).toContain(`2. ${mockMug.productName} - Qty: 2`);
    });
  });

  /* ==========================================================================
     TIER 3: CROSS-FEATURE COMBINATIONS (5 tests)
     ========================================================================== */

  describe("Tier 3: Cross-Feature Combinations", () => {
    test("T3-1: Category filtering followed by search filtering within Shop catalog", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Shop />
          </MemoryRouter>
        </Provider>
      );

      // Select Mugs
      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "Mugs" } });

      // Search for "Mountain"
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: "Mountain" } });

      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings.some((h) => h.textContent.includes("Mountain"))).toBe(true);
    });

    test("T3-2: Searching then clearing search resets full catalog, allowing category selection", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Shop />
          </MemoryRouter>
        </Provider>
      );

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: "Bull" } });
      fireEvent.change(searchInput, { target: { value: "" } });

      // After clearing, select Tote Bags
      const select = screen.getByTestId("mock-select");
      fireEvent.change(select, { target: { value: "Tote Bags" } });

      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings.length).toBeGreaterThan(0);
      headings.forEach((h) => {
        const item = products.find((p) => p.productName === h.textContent);
        if (item) expect(item.category).toBe("Tote Bags");
      });
    });

    test("T3-3: Adding products from newly added categories (Mugs, Tote Bags, Custom Gifts) to Redux cart", () => {
      const store = createTestStore();

      store.dispatch(addToCart({ product: mockMug, num: 2 }));
      store.dispatch(addToCart({ product: mockTote, num: 1 }));

      const cartList = store.getState().cart.cartList;
      expect(cartList).toHaveLength(2);
      expect(cartList[0].category).toBe("Mugs");
      expect(cartList[0].qty).toBe(2);
      expect(cartList[1].category).toBe("Tote Bags");
      expect(cartList[1].qty).toBe(1);
    });

    test("T3-4: Mixed category cart generates multi-line itemized WhatsApp order URL with correct total", () => {
      const cartItems = [
        { ...mockProduct, qty: 1, price: 349 }, // T-Shirt
        { ...mockMug, qty: 2, price: 299 },     // Mug
        { ...mockTote, qty: 1, price: 399 },    // Tote Bag
      ];
      const grandTotal = 1 * 349 + 2 * 299 + 1 * 399; // 349 + 598 + 399 = 1346
      const store = createTestStore(cartItems);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <Cart />
          </MemoryRouter>
        </Provider>
      );

      const link = document.querySelector(".btn-wp");
      const message = new URL(link.getAttribute("href")).searchParams.get("text");

      expect(message).toContain("1. Dynamic Bull T-Shirt - Qty: 1 - ₹349");
      expect(message).toContain("2. Mountain EST 2024 Ceramic Mug - Qty: 2 - ₹598");
      expect(message).toContain("3. Face Art Canvas Tote Bag - Qty: 1 - ₹399");
      expect(message).toContain(`Total Price: ₹${grandTotal}`);
    });

    test("T3-5: Quantity update in ProductDetails synchronizes direct inquiry URL and Add To Cart payload", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockMug} />
          </MemoryRouter>
        </Provider>
      );

      const qtyInput = document.querySelector(".qty-input");
      const addButton = document.querySelector("button.add");

      fireEvent.change(qtyInput, { target: { value: "3" } });

      // Verify inquiry URL updated
      const inquiryLink = document.querySelector(".btn-wpsx");
      const textParam = new URL(inquiryLink.getAttribute("href")).searchParams.get("text");
      expect(textParam).toContain("Quantity: 3");
      expect(textParam).toContain(`Total: ₹${mockMug.price * 3}`);

      // Click Add To Cart
      fireEvent.click(addButton);

      const cartItem = store.getState().cart.cartList[0];
      expect(cartItem.qty).toBe(3);
      expect(cartItem.id).toBe(mockMug.id);
    });
  });

  /* ==========================================================================
     TIER 4: REAL-WORLD SCENARIOS (3 tests)
     ========================================================================== */

  describe("Tier 4: Real-World Scenarios", () => {
    test("T4-1: Full End-to-End Shopping Journey: Browse Catalog -> Filter Category -> Search -> View Details -> Change Quantity -> Add to Cart -> Verify Cart Totals -> Generate WhatsApp Order", () => {
      const store = createTestStore();

      // Step 1: User visits Shop page
      const { unmount: unmountShop } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/shop"]}>
            <Shop />
          </MemoryRouter>
        </Provider>
      );

      // Verify full catalog is loaded
      expect(screen.getAllByRole("heading", { level: 3 }).length).toBe(products.length);

      // Step 2: User filters by category "Mugs"
      const categorySelect = screen.getByTestId("mock-select");
      fireEvent.change(categorySelect, { target: { value: "Mugs" } });

      // Step 3: User searches for "Mountain"
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: "Mountain" } });

      const mugHeading = screen.getByRole("heading", { name: /Mountain/i });
      expect(mugHeading).toBeInTheDocument();
      unmountShop();

      // Step 4: User opens Product Details page for the matched Mug
      const selectedMug = products.find((p) => p.productName.includes("Mountain")) || mockMug;
      const { unmount: unmountDetails } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[`/shop/${selectedMug.id}`]}>
            <ProductDetails selectedProduct={selectedMug} />
          </MemoryRouter>
        </Provider>
      );

      // Step 5: User changes quantity to 2
      const qtyInput = document.querySelector(".qty-input");
      fireEvent.change(qtyInput, { target: { value: "2" } });

      // Step 6: User clicks Add To Cart
      const addButton = document.querySelector("button.add");
      fireEvent.click(addButton);
      unmountDetails();

      // Step 7: User navigates to Cart
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/cart"]}>
            <Cart />
          </MemoryRouter>
        </Provider>
      );

      // Verify cart contents & totals
      expect(screen.getByText(new RegExp(selectedMug.productName, "i"))).toBeInTheDocument();
      const expectedTotal = selectedMug.price * 2;
      const matches = screen.getAllByText(new RegExp(`₹ ${expectedTotal}`, "i"));
      expect(matches.length).toBeGreaterThanOrEqual(1);

      // Step 8: Verify WhatsApp checkout link
      const whatsappButton = document.querySelector(".btn-wp");
      expect(whatsappButton).toBeInTheDocument();
      const orderMessage = new URL(whatsappButton.getAttribute("href")).searchParams.get("text");

      expect(orderMessage).toContain(selectedMug.productName);
      expect(orderMessage).toContain("Qty: 2");
      expect(orderMessage).toContain(`Total Price: ₹${expectedTotal}`);
    });

    test("T4-2: Multi-Item Shopping Cart Modification & WhatsApp Checkout Flow", () => {
      const store = createTestStore([
        { ...mockProduct, qty: 1, price: 349 },
        { ...mockMug, qty: 1, price: 299 },
      ]);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/cart"]}>
            <Cart />
          </MemoryRouter>
        </Provider>
      );

      // Increment quantity of first item
      const incButtons = document.querySelectorAll(".incCart");
      fireEvent.click(incButtons[0]); // mockProduct qty becomes 2

      // Verify updated total price: (349 * 2) + 299 = 698 + 299 = 997
      expect(screen.getByText(/₹ 997/i)).toBeInTheDocument();

      // Verify updated WhatsApp checkout URL reflects the new quantity and total
      const whatsappButton = document.querySelector(".btn-wp");
      const orderMessage = new URL(whatsappButton.getAttribute("href")).searchParams.get("text");
      expect(orderMessage).toContain("Dynamic Bull T-Shirt - Qty: 2 - ₹698");
      expect(orderMessage).toContain("Total Price: ₹997");

      // Delete the mug item
      const deleteButtons = document.querySelectorAll(".delete");
      fireEvent.click(deleteButtons[1]); // delete mug

      // Now only mockProduct remains with qty 2, total 698
      const matches = screen.getAllByText(/₹ 698/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
      const updatedMessage = new URL(document.querySelector(".btn-wp").getAttribute("href")).searchParams.get("text");
      expect(updatedMessage).toContain("Total Price: ₹698");
      expect(updatedMessage).not.toContain("Mountain");
    });

    test("T4-3: Social Share & Direct WhatsApp Inquiry Workflow", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductDetails selectedProduct={mockTote} />
          </MemoryRouter>
        </Provider>
      );

      // 1. Verify RWebShare metadata
      const shareEl = screen.getByTestId("rwebshare");
      const shareData = JSON.parse(shareEl.getAttribute("data-share-data"));
      expect(shareData.url).toContain(`/shop/${mockTote.id}`);
      expect(shareData.title).toBe(mockTote.productName);

      // 2. Verify direct WhatsApp product inquiry pre-fills viewed product details
      const inquiryLink = document.querySelector(".btn-wpsx");
      const inquiryText = new URL(inquiryLink.getAttribute("href")).searchParams.get("text");
      expect(inquiryText).toContain(`Product: ${mockTote.productName}`);
      expect(inquiryText).toContain(`ID: ${mockTote.id}`);
      expect(inquiryText).toContain(`Price: ₹${mockTote.price}`);
      expect(inquiryText).toContain(`Quantity: 1`);
      expect(inquiryText).toContain(`Link: ${window.location.origin}/shop/${mockTote.id}`);
    });
  });
});
