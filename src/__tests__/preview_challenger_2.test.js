import React from "react";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import cartSlice from "../app/features/cart/cartSlice";
import NavBar from "../components/Navbar/Navbar";
import ProductCard from "../components/ProductCard/ProductCard";
import Shop from "../pages/Shop";
import FilterSelect from "../components/FilterSelect";
import { products } from "../utils/products";

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock react-web-share
jest.mock("react-web-share", () => ({
  RWebShare: ({ children }) => <div>{children}</div>,
}));

// Mock react-select for deterministic testing of FilterSelect
jest.mock("react-select", () => {
  return function MockSelect({ options, onChange, defaultValue }) {
    return (
      <select
        data-testid="category-select"
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

const createTestStore = (cartList = []) => {
  return configureStore({
    reducer: {
      cart: cartSlice,
    },
    preloadedState: {
      cart: {
        cartList,
      },
    },
  });
};

describe("Preview Challenger 2: UI, CSS Containment & Lifecycle Empirical Tests", () => {
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  /* --------------------------------------------------------------------------
     1. NAVBAR SCROLL LISTENER LIFECYCLE & REFERENCE CLEANUP
     -------------------------------------------------------------------------- */
  describe("1. Navbar Scroll Listener Lifecycle", () => {
    test("registers exactly 1 scroll listener on mount and executes scrollHandler initially", () => {
      const addListenerSpy = jest.spyOn(window, "addEventListener");
      const store = createTestStore();

      render(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      const scrollRegistrations = addListenerSpy.mock.calls.filter(
        (call) => call[0] === "scroll"
      );
      expect(scrollRegistrations.length).toBe(1);
      expect(typeof scrollRegistrations[0][1]).toBe("function");
    });

    test("does NOT duplicate scroll listeners across component re-renders", () => {
      const addListenerSpy = jest.spyOn(window, "addEventListener");
      const store = createTestStore();

      const { rerender } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      const initialCount = addListenerSpy.mock.calls.filter(
        (call) => call[0] === "scroll"
      ).length;

      // Re-render multiple times
      for (let i = 0; i < 5; i++) {
        rerender(
          <Provider store={store}>
            <MemoryRouter>
              <NavBar />
            </MemoryRouter>
          </Provider>
        );
      }

      const postRerenderCount = addListenerSpy.mock.calls.filter(
        (call) => call[0] === "scroll"
      ).length;
      expect(postRerenderCount).toBe(initialCount);
    });

    test("unmounting Navbar cleans up the exact scroll listener reference without leaks", () => {
      const addListenerSpy = jest.spyOn(window, "addEventListener");
      const removeListenerSpy = jest.spyOn(window, "removeEventListener");
      const store = createTestStore();

      const { unmount } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      const addedHandler = addListenerSpy.mock.calls.find(
        (call) => call[0] === "scroll"
      )[1];

      // Unmount the Navbar
      unmount();

      const removedCalls = removeListenerSpy.mock.calls.filter(
        (call) => call[0] === "scroll"
      );
      expect(removedCalls.length).toBe(1);
      expect(removedCalls[0][1]).toBe(addedHandler);

      // Firing scroll event after unmount should be safe with no state errors
      expect(() => {
        window.dispatchEvent(new Event("scroll"));
      }).not.toThrow();
    });

    test("toggles 'fixed' class based on scroll threshold (>= 100 adds fixed, <= 50 removes fixed)", () => {
      const store = createTestStore();
      const { container } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NavBar />
          </MemoryRouter>
        </Provider>
      );

      const navElement = container.querySelector("nav");
      // Initially at scrollY 0, classList should not contain "fixed"
      expect(navElement.classList.contains("fixed")).toBe(false);

      // Scroll past 100
      act(() => {
        window.scrollY = 150;
        window.dispatchEvent(new Event("scroll"));
      });
      expect(navElement.classList.contains("fixed")).toBe(true);

      // Scroll to deadband 75 (remains fixed)
      act(() => {
        window.scrollY = 75;
        window.dispatchEvent(new Event("scroll"));
      });
      expect(navElement.classList.contains("fixed")).toBe(true);

      // Scroll back down <= 50
      act(() => {
        window.scrollY = 40;
        window.dispatchEvent(new Event("scroll"));
      });
      expect(navElement.classList.contains("fixed")).toBe(false);
    });
  });

  /* --------------------------------------------------------------------------
     2. PRODUCTCARD IMAGE ZOOM & CONTAINMENT STRUCTURE
     -------------------------------------------------------------------------- */
  describe("2. ProductCard Image Zoom & Boundary Containment", () => {
    const mockProduct = {
      id: "10",
      productName: "Dynamic Bull T-Shirt",
      imgUrl: "test-bull.png",
      category: "T-Shirts",
      price: 349,
      shortDesc: "Premium soft fabric",
      description: "Sample description",
      discount: 10,
    };

    test("ProductCard isolates img within .product-img-container sibling to .product-details", () => {
      const store = createTestStore();
      const { container } = render(
        <Provider store={store}>
          <MemoryRouter>
            <ProductCard productItem={mockProduct} title="Big Discount" />
          </MemoryRouter>
        </Provider>
      );

      const card = container.querySelector(".product");
      expect(card).toBeInTheDocument();

      const imgContainer = card.querySelector(".product-img-container");
      expect(imgContainer).toBeInTheDocument();

      const img = imgContainer.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img.getAttribute("src")).toBe("test-bull.png");

      const productDetails = card.querySelector(".product-details");
      expect(productDetails).toBeInTheDocument();

      // Crucial containment check: .product-details is NOT a child of .product-img-container
      expect(imgContainer.contains(productDetails)).toBe(false);

      // Stars rating container is strictly inside .product-details
      const starsContainer = productDetails.querySelector(".rate");
      expect(starsContainer).toBeInTheDocument();
      expect(imgContainer.contains(starsContainer)).toBe(false);
    });
  });

  /* --------------------------------------------------------------------------
     3. FILTERSELECT & SHOP CATEGORY TRANSITIONS
     -------------------------------------------------------------------------- */
  describe("3. FilterSelect & Shop Category Transitions", () => {
    test("Shop displays full catalog by default (15 products)", () => {
      const store = createTestStore();
      const { container } = render(
        <Provider store={store}>
          <MemoryRouter>
            <Shop />
          </MemoryRouter>
        </Provider>
      );

      const cards = container.querySelectorAll(".product");
      expect(cards.length).toBe(15);
      expect(cards.length).toBe(products.length);
    });

    test("Category transitions accurately filter and NEVER return empty arrays", () => {
      const store = createTestStore();
      const { container } = render(
        <Provider store={store}>
          <MemoryRouter>
            <Shop />
          </MemoryRouter>
        </Provider>
      );

      const select = screen.getByTestId("category-select");

      const expectedCategories = [
        { value: "T-Shirts", count: 9 },
        { value: "Mugs", count: 2 },
        { value: "Tote Bags", count: 2 },
        { value: "Custom Gifts", count: 2 },
        { value: "all", count: 15 },
      ];

      for (const cat of expectedCategories) {
        act(() => {
          fireEvent.change(select, { target: { value: cat.value } });
        });

        const cards = container.querySelectorAll(".product");
        // Must never be empty
        expect(cards.length).toBeGreaterThan(0);
        expect(cards.length).toBe(cat.count);
      }
    });

    test("Direct FilterSelect callback resets to products on 'all' and filters accurately per category", () => {
      const mockSetFilter = jest.fn();
      render(<FilterSelect setFilterList={mockSetFilter} />);

      const select = screen.getByTestId("category-select");

      // Select Mugs
      act(() => {
        fireEvent.change(select, { target: { value: "Mugs" } });
      });
      expect(mockSetFilter).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ category: "Mugs" }),
        ])
      );
      const mugsResult = mockSetFilter.mock.calls[mockSetFilter.mock.calls.length - 1][0];
      expect(mugsResult.length).toBe(2);
      expect(mugsResult.every((item) => item.category === "Mugs")).toBe(true);

      // Select Tote Bags
      act(() => {
        fireEvent.change(select, { target: { value: "Tote Bags" } });
      });
      const toteResult = mockSetFilter.mock.calls[mockSetFilter.mock.calls.length - 1][0];
      expect(toteResult.length).toBe(2);
      expect(toteResult.every((item) => item.category === "Tote Bags")).toBe(true);

      // Select Custom Gifts
      act(() => {
        fireEvent.change(select, { target: { value: "Custom Gifts" } });
      });
      const giftResult = mockSetFilter.mock.calls[mockSetFilter.mock.calls.length - 1][0];
      expect(giftResult.length).toBe(2);
      expect(giftResult.every((item) => item.category === "Custom Gifts")).toBe(true);

      // Reset to All Products
      act(() => {
        fireEvent.change(select, { target: { value: "all" } });
      });
      expect(mockSetFilter).toHaveBeenLastCalledWith(products);
    });
  });
});
