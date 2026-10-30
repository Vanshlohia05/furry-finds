# Handoff Report: Test Suite Fix Strategy for `storefront.test.js` and `App.test.js`

**Author**: `teamwork_preview_explorer_r2_2` (Role: Explorer)  
**Date**: 2026-10-03T17:20:00Z  
**Recipient**: `teamwork_preview_orchestrator_1` (Conversation ID: `c2d61f7e-6e73-44c4-bc6b-0fa92b48203d`)  
**Scope**: Root-cause investigation, exact fix strategy, and before/after code modifications for clean Jest and standalone test runs in `d:/VS CODE/awwrange/awwrange`.

---

## 1. Observation

Direct empirical observations from file inspection of production and test code:

### 1.1 `Navbar.jsx` and Test `R1-5` (`src/__tests__/storefront.test.js`)
- **File**: `src/components/Navbar/Navbar.jsx`, lines 32–36:
  ```jsx
  <Navbar
    fixed="top"
    expand="md"
    className={isFixed ? "navbar fixed" : "navbar"}
  >
  ```
- **CSS Rule**: `src/components/Navbar/navbar.css`, lines 10–15:
  ```css
  .navbar.fixed {
    position: fixed !important;
    width: 100vw;
    left: 0;
    top: 0;
  }
  ```
- **Test Code**: `src/__tests__/storefront.test.js`, lines 229–250:
  ```javascript
  229: test("R1-5: removes navbar fixed class when window.scrollY <= 50", () => {
  ...
  240:   window.scrollY = 150;
  241:   window.dispatchEvent(new Event("scroll"));
  242: });
  243: expect(container.querySelector("nav").className).toContain("fixed");
  244: 
  245: act(() => {
  246:   window.scrollY = 30;
  247:   window.dispatchEvent(new Event("scroll"));
  248: });
  249: expect(container.querySelector("nav").className).not.toContain("fixed");
  250: });
  ```
- **Verbatim Failure**:
  ```text
  expect(received).not.toContain(expected)
  Expected substring: not "fixed"
  Received string: "navbar navbar navbar-expand-md navbar-light fixed-top"
  ```
- **Observation Detail**: React-Bootstrap's `<Navbar fixed="top">` unconditionally appends the Bootstrap CSS class `"fixed-top"` to the rendered `<nav>` element. When `scrollY = 30`, `isFixed` is `false`, so `Navbar.jsx` assigns `className="navbar"`. However, the overall DOM `class` attribute retains `"fixed-top"`. Because `"fixed-top"` contains the substring `"fixed"`, checking `.not.toContain("fixed")` on the string `className` produces a false-positive test failure.

---

### 1.2 Search Clear Reset and Test `T2-1` (`src/__tests__/storefront.test.js`)
- **Component Code**: `src/components/SeachBar/SearchBar.jsx`, lines 5–22:
  ```javascript
  const SearchBar = ({ setFilterList }) => {
    const [searchWord, setSearchWord] = useState("");
    const handelChange = (input) => {
      const query = input.target.value;
      setSearchWord(query);
      if (!query || query.trim() === "") {
        setFilterList(products);
      } else {
        ...
      }
    };
    return (
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchWord}
          onChange={handelChange}
        />
  ```
- **Test Code**: `src/__tests__/storefront.test.js`, lines 649–657:
  ```javascript
  test("T2-1: Search with empty string resets filter to full products list", () => {
    const mockSetFilterList = jest.fn();
    render(<SearchBar setFilterList={mockSetFilterList} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "" } });

    expect(mockSetFilterList).toHaveBeenCalledWith(products);
  });
  ```
- **Verbatim Failure**:
  ```text
  expect(jest.fn()).toHaveBeenCalledWith(...expected)
  Number of calls: 0
  ```
- **Contrast with Passing Test `R2-3`** (`src/__tests__/storefront.test.js`, lines 282–293):
  ```javascript
  test("R2-3: resets filter to full catalog when input is cleared to empty", () => {
    const mockSetFilterList = jest.fn();
    render(<SearchBar setFilterList={mockSetFilterList} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "Bull" } });
    fireEvent.change(input, { target: { value: "" } });

    expect(mockSetFilterList).toHaveBeenCalledTimes(2);
  ```
- **Observation Detail**: The input component initializes with `value={searchWord}` where `searchWord` is `""`. React 18's controlled input tracker compares incoming change events against the element's current value. When `fireEvent.change(input, { target: { value: "" } })` is fired without first changing the value, React sees no value transition (`"" === ""`) and suppresses the synthetic `onChange` event entirely.

---

### 1.3 Currency Query Ambiguity in Tests `T4-1` and `T4-2` (`src/__tests__/storefront.test.js`)
- **Component Code**: `src/pages/Cart.jsx`, line 57 & line 94:
  - Line 57 (Line item total):
    ```jsx
    <span>₹ {productQty}.00</span>
    ```
  - Line 94 (Cart summary total):
    ```jsx
    <h3>₹ {totalPrice}.00</h3>
    ```
- **Test Code `T4-1`**: `src/__tests__/storefront.test.js`, lines 1013–1016:
  ```javascript
  expect(screen.getByText(new RegExp(selectedMug.productName, "i"))).toBeInTheDocument();
  const expectedTotal = selectedMug.price * 2;
  expect(screen.getByText(new RegExp(`₹ ${expectedTotal}`, "i"))).toBeInTheDocument();
  ```
  *Verbatim Failure*: `TestingLibraryElementError: Found multiple elements with the text: /₹ 598/i` (`<span>₹ 598.00</span>` and `<h3>₹ 598.00</h3>`).
- **Test Code `T4-2`**: `src/__tests__/storefront.test.js`, lines 1058–1060:
  ```javascript
  // Now only mockProduct remains with qty 2, total 698
  expect(screen.getByText(/₹ 698/i)).toBeInTheDocument();
  ```
  *Verbatim Failure*: `TestingLibraryElementError: Found multiple elements with the text: /₹ 698/i` (`<span>₹ 698.00</span>` and `<h3>₹ 698.00</h3>`).
- **Observation Detail**: When the cart contains exactly one product type (such as 2 mugs in `T4-1` or 2 t-shirts after deleting the mug in `T4-2`), the line total (`item.price * item.qty`) is identical to the order total (`totalPrice`). Both match the regex pattern `/₹ <amount>/i`. Testing Library's `screen.getByText` throws an exception whenever more than one matching element exists in the DOM.

---

### 1.4 React Suspense Timing in `src/App.test.js`
- **Application Code**: `src/App.js`, lines 9–16, 28:
  ```javascript
  const Home = lazy(() => import("./pages/Home"));
  const Shop = lazy(() => import("./pages/Shop"));
  const Cart = lazy(() => import("./pages/Cart"));
  const Product = lazy(() => import("./pages/Product"));
  function App() {
    return (
      <Suspense fallback={<Loader />}>
        <Router>
          ...
          <NavBar />
  ```
- **Test Code**: `src/App.test.js`, lines 6–14:
  ```javascript
  test('renders Aww Range brand in storefront header', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const brandElements = screen.getAllByText(/Aww Range/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });
  ```
- **Verbatim Failure**:
  ```text
  TestingLibraryElementError: Unable to find an element with the text: /Aww Range/i
  ```
- **Observation Detail**: Because `<NavBar />` is enclosed inside `<Suspense fallback={<Loader />}>`, React immediately mounts `<Loader />` on the first synchronous pass while lazy routes are being imported. `screen.getAllByText` runs synchronously before the dynamic imports resolve, finding zero elements with text matching `/Aww Range/i`.

---

### 1.5 Scratch Files and Custom Test Runner Exits
- **Filesystem Audit in `src/__tests__/`**:
  - `src/__tests__/debug-test.js`: Confirmed **absent** from filesystem (size 0 / empty scratch file was previously removed).
  - `src/__tests__/standalone-runner.js`: Contains `process.exit(failed > 0 ? 1 : 0)` at line 601. Also contains regex defect at line 47 (`/import\s+[^}]*useEffect[^}]*\s+from\s+["']react["']/` which rejects valid named imports with closing curly brace `}`).
  - `src/__tests__/preview_challenger_2_runner.js`: Contains `process.exit(failedCount > 0 ? 1 : 0)` at line 409.
- **Observation Detail**: CRA Jest discovers all files matching `src/**/__tests__/**/*.{js,jsx,ts,tsx}`. When Jest executes standalone scripts containing unconditional `process.exit()`, the worker child processes are abruptly terminated, resulting in `Jest worker encountered 4 child process exceptions, exceeding retry limit`.

---

## 2. Logic Chain

1. **Step 1 (Fixing `R1-5`)**:
   - The conflict occurs because `nav.className` contains `"fixed-top"` added by `<Navbar fixed="top">`.
   - In `Navbar.jsx:35`, changing `className={isFixed ? "navbar fixed nav-sticky" : "navbar"}`:
     - Maintains `"fixed"` when sticky, ensuring `.navbar.fixed` in `navbar.css` continues to apply exact styling.
     - Adds the dedicated sticky identifier `"nav-sticky"`, which is absent when `isFixed` is `false`.
     - Bootstrap's `fixed-top` does not contain `"nav-sticky"`.
     - In `storefront.test.js`, updating line 243 to `expect(container.querySelector("nav").className).toContain("nav-sticky")` and line 249 to `expect(container.querySelector("nav").className).not.toContain("nav-sticky")` guarantees a clean, deterministic pass.
   - Alternatively, asserting `expect(container.querySelector("nav").classList.contains("fixed")).toBe(false)` on the DOM token list also resolves the issue without touching `Navbar.jsx`. Providing the `nav-sticky` strategy directly implements the orchestrator's guidance.

2. **Step 2 (Fixing `T2-1`)**:
   - In `T2-1`, updating the sequence to:
     ```javascript
     fireEvent.change(input, { target: { value: "something" } });
     fireEvent.change(input, { target: { value: "" } });
     ```
   - Step 2a: React detects state change from `""` to `"something"` and invokes `handelChange`.
   - Step 2b: React detects state change from `"something"` to `""` and invokes `handelChange`.
   - Step 2c: In `handelChange`, `!query || query.trim() === ""` evaluates to `true`, triggering `setFilterList(products)`.
   - `expect(mockSetFilterList).toHaveBeenCalledWith(products)` passes cleanly.

3. **Step 3 (Fixing `T4-1 & T4-2`)**:
   - In `Cart.jsx`, both the single cart item line total and the cart summary total display the identical currency string.
   - Using `screen.getAllByText(new RegExp(`₹ ${expectedTotal}`, "i"))` in `T4-1` and `screen.getAllByText(/₹ 698/i)` in `T4-2` returns an array of matching elements without throwing a duplicate element error.
   - Asserting `.length).toBeGreaterThan(0)` or `expect(screen.getAllByText(...)[0]).toBeInTheDocument()` confirms presence while tolerating multiple DOM elements.

4. **Step 4 (Fixing `App.test.js`)**:
   - In `App.js`, `<NavBar />` is inside `<Suspense>`.
   - Making the test callback `async () => { ... }` and wrapping the assertion in `await waitFor(() => { const brandElements = screen.getAllByText(/Aww Range/i); expect(brandElements.length).toBeGreaterThan(0); })`:
     - Allows React to resolve lazy module promises.
     - Automatically retries the assertion on subsequent microtask cycles until `<NavBar />` renders in the DOM.

5. **Step 5 (Preventing Jest Worker Crashes & Runner Failure)**:
   - In `standalone-runner.js`, line 47 regex must be updated to `/import\s+{[^}]*useEffect[^}]*}\s+from\s+["']react["']/` so test `R1-1` passes.
   - Guard `process.exit()` in runner scripts with `if (typeof jest === "undefined" && require.main === module)` so running `node src/__tests__/standalone-runner.js` functions normally, but running Jest does not kill child processes.
   - Confirm `debug-test.js` remains deleted.

---

## 3. Caveats

1. **CSS Selector Preservation**: When adding `"nav-sticky"` to `Navbar.jsx`, `"fixed"` must remain in the className string (`"navbar fixed nav-sticky"`) so that existing CSS `.navbar.fixed` in `navbar.css` continues to work.
2. **Redux `cartSlice.js` Edge Case**: In `decreaseQty` (`src/app/features/cart/cartSlice.js:37`), line `if (productExit.qty === 1)` assumes `productExit` is always found. Although not failing the standard test suite, adding a defensive check `if (productExit && productExit.qty === 1)` prevents unhandled errors when decreasing invalid IDs.
3. **Execution Environment**: In environments where interactive user permission prompts for shell commands may time out, code patches should be applied directly via file edit tools (`replace_file_content` / `write_to_file`).

---

## 4. Conclusion & Exact Fix Strategy

Below is the complete, self-contained specification of code changes required for the implementer agent.

### 4.1 Changes to `src/components/Navbar/Navbar.jsx`
- **Location**: Line 35
- **Before**:
  ```jsx
      className={isFixed ? "navbar fixed" : "navbar"}
  ```
- **After**:
  ```jsx
      className={isFixed ? "navbar fixed nav-sticky" : "navbar"}
  ```

---

### 4.2 Changes to `src/__tests__/storefront.test.js`

#### Change A: Requirement `R1-5` (and `R1-4`)
- **Location**: Lines 220–250
- **Before**:
  ```javascript
      act(() => {
        window.scrollY = 150;
        window.dispatchEvent(new Event("scroll"));
      });

      const navElement = container.querySelector("nav");
      expect(navElement.className).toContain("fixed");
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
      expect(container.querySelector("nav").className).toContain("fixed");

      act(() => {
        window.scrollY = 30;
        window.dispatchEvent(new Event("scroll"));
      });
      expect(container.querySelector("nav").className).not.toContain("fixed");
  ```
- **After**:
  ```javascript
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
  ```
*(Note: If test-only without modifying `Navbar.jsx`, line 249 can alternatively be: `expect(container.querySelector("nav").classList.contains("fixed")).toBe(false);`)*

#### Change B: Requirement `T2-1`
- **Location**: Lines 649–657
- **Before**:
  ```javascript
    test("T2-1: Search with empty string resets filter to full products list", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "" } });

      expect(mockSetFilterList).toHaveBeenCalledWith(products);
    });
  ```
- **After**:
  ```javascript
    test("T2-1: Search with empty string resets filter to full products list", () => {
      const mockSetFilterList = jest.fn();
      render(<SearchBar setFilterList={mockSetFilterList} />);

      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: "something" } });
      fireEvent.change(input, { target: { value: "" } });

      expect(mockSetFilterList).toHaveBeenCalledWith(products);
    });
  ```

#### Change C: Requirement `T4-1`
- **Location**: Line 1015
- **Before**:
  ```javascript
      // Verify cart contents & totals
      expect(screen.getByText(new RegExp(selectedMug.productName, "i"))).toBeInTheDocument();
      const expectedTotal = selectedMug.price * 2;
      expect(screen.getByText(new RegExp(`₹ ${expectedTotal}`, "i"))).toBeInTheDocument();
  ```
- **After**:
  ```javascript
      // Verify cart contents & totals
      expect(screen.getByText(new RegExp(selectedMug.productName, "i"))).toBeInTheDocument();
      const expectedTotal = selectedMug.price * 2;
      expect(screen.getAllByText(new RegExp(`₹ ${expectedTotal}`, "i")).length).toBeGreaterThan(0);
  ```

#### Change D: Requirement `T4-2`
- **Location**: Line 1059
- **Before**:
  ```javascript
      // Now only mockProduct remains with qty 2, total 698
      expect(screen.getByText(/₹ 698/i)).toBeInTheDocument();
  ```
- **After**:
  ```javascript
      // Now only mockProduct remains with qty 2, total 698
      expect(screen.getAllByText(/₹ 698/i).length).toBeGreaterThan(0);
  ```

---

### 4.3 Changes to `src/App.test.js`
- **File**: `src/App.test.js`
- **Full Replacement Content**:
  ```javascript
  import { render, screen, waitFor } from '@testing-library/react';
  import App from './App';
  import { Provider } from 'react-redux';
  import { store } from './app/store';

  test('renders Aww Range brand in storefront header', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    await waitFor(() => {
      const brandElements = screen.getAllByText(/Aww Range/i);
      expect(brandElements.length).toBeGreaterThan(0);
    });
  });
  ```

---

### 4.4 Changes to `src/__tests__/standalone-runner.js`
- **Location 1 (Regex fix)**: Line 47
  - **Before**:
    ```javascript
    /import\s+[^}]*useEffect[^}]*\s+from\s+["']react["']/.test(navbarSrc)
    ```
  - **After**:
    ```javascript
    /import\s+{[^}]*useEffect[^}]*}\s+from\s+["']react["']/.test(navbarSrc)
    ```
- **Location 2 (Jest process.exit guard)**: Lines 600–604
  - **Before**:
    ```javascript
    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
    ```
  - **After**:
    ```javascript
    if (typeof jest === "undefined" && require.main === module) {
      if (failed > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    }
    ```

---

### 4.5 Changes to `src/__tests__/preview_challenger_2_runner.js`
- **Location (Jest process.exit guard)**: Lines 408–412
  - **Before**:
    ```javascript
    if (failedCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
    ```
  - **After**:
    ```javascript
    if (typeof jest === "undefined" && require.main === module) {
      if (failedCount > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    }
    ```

---

## 5. Verification Method

To verify these fixes independently:

1. **Verify `storefront.test.js` via Jest**:
   ```powershell
   cd "d:\VS CODE\awwrange\awwrange"
   $env:CI="true"; npm test -- src/__tests__/storefront.test.js --watchAll=false
   ```
   *Expected Result*: `Test Suites: 1 passed, 1 total. Tests: 48 passed, 48 total.`

2. **Verify `App.test.js` via Jest**:
   ```powershell
   cd "d:\VS CODE\awwrange\awwrange"
   $env:CI="true"; npm test -- src/App.test.js --watchAll=false
   ```
   *Expected Result*: `Test Suites: 1 passed, 1 total. Tests: 1 passed, 1 total.`

3. **Verify Standalone Runner**:
   ```powershell
   cd "d:\VS CODE\awwrange\awwrange"
   node src/__tests__/standalone-runner.js
   ```
   *Expected Result*: `Total: 48, Passed: 48, Failed: 0. Exit code: 0.`

4. **Verify Entire Jest Suite**:
   ```powershell
   cd "d:\VS CODE\awwrange\awwrange"
   $env:CI="true"; npm test -- --watchAll=false
   ```
   *Expected Result*: All test suites pass cleanly with 0 failures and 0 child process exceptions.
