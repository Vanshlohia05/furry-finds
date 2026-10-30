## 2026-10-03T16:39:46Z
You are teamwork_preview_worker_1.
Working Directory: d:/VS CODE/awwrange/awwrange/.agents/teamwork/teamwork_preview_worker_1
Parent: teamwork_preview_orchestrator_1 (Conversation ID: c2d61f7e-6e73-44c4-bc6b-0fa92b48203d)
Original Request: d:/VS CODE/awwrange/awwrange/.agents/teamwork/ORIGINAL_REQUEST.md
Project Document: d:/VS CODE/awwrange/awwrange/.agents/teamwork/PROJECT.md

Read the survey handoff reports thoroughly before starting:
- Explorer 1 Report: d:/VS CODE/awwrange/awwrange/.agents/teamwork/teamwork_preview_explorer_survey_1/handoff.md (Detailed code for R1, R2, R6)
- Explorer 2 Report: d:/VS CODE/awwrange/awwrange/.agents/teamwork/teamwork_preview_explorer_survey_2/handoff.md (Detailed code for R3, R5, cartSlice)
- Spec Miner Report: d:/VS CODE/awwrange/awwrange/.agents/teamwork/teamwork_preview_spec_miner_survey_1/handoff.md (Detailed specs for R4, R7, products.js)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE FILE WRITE OWNERSHIP:
You own these files for implementation:
- `src/components/Navbar/Navbar.jsx` (R1)
- `src/components/SeachBar/SearchBar.jsx` (R2)
- `src/components/ProductCard/ProductCard.jsx` (R6)
- `src/components/ProductCard/product-card.css` (R6)
- `src/index.css` (R6)
- `src/components/FilterSelect.jsx` (R4)
- `src/pages/Shop.jsx` (R4)
- `src/utils/products.js` (R4)
- `src/pages/Home.jsx` (R4)
- `src/components/ProductDetails/ProductDetails.jsx` (R3, R5)
- `src/app/features/cart/cartSlice.js` (R3)
- `src/pages/Cart.jsx` (R5)

IMPLEMENTATION TASKS:
1. R1: In `src/components/Navbar/Navbar.jsx`, import `useEffect` and wrap `scrollHandler` in `useEffect` with cleanup on unmount: `return () => window.removeEventListener("scroll", scrollHandler)`. Call `scrollHandler()` once on mount.
2. R2: In `src/components/SeachBar/SearchBar.jsx`, immediately filter on incoming `e.target.value` (synchronously), trim & lower-case. If empty/whitespace, call `setFilterList(products)`. Make input controlled (`value={searchWord}`).
3. R3: In `src/components/ProductDetails/ProductDetails.jsx`:
   - Uncomment and hook up state, `useDispatch`, `addToCart`, and `toast.success`.
   - In `handleAdd`, defensively parse quantity: `Math.max(1, parseInt(quantity, 10) || 1)`.
   - In `src/app/features/cart/cartSlice.js`, ensure integer arithmetic in `addToCart`: `Math.max(1, parseInt(action.payload.num, 10) || 1)`.
   - In `<RWebShare>`, fix data object: `url: \`${window.location.origin}/shop/\${selectedProduct?.id}\``, `title: selectedProduct?.productName`, `text: selectedProduct?.shortDesc`.
4. R4:
   - In `src/components/FilterSelect.jsx`, expand options to 5: "All Products" (`value: "all"`), "T-Shirts" (`value: "T-Shirts"`), "Mugs" (`value: "Mugs"`), "Tote Bags" (`value: "Tote Bags"`), "Custom Gifts" (`value: "Custom Gifts"`). Update `handleChange` to check for `"all"` / `"All Products"` and call `setFilterList(products)`.
   - In `src/pages/Shop.jsx`, change default state to `useState(products)` so the full catalog is displayed by default.
   - In `src/utils/products.js`, align active products' category from `"Tshirt"` to `"T-Shirts"`. Add genuine product objects for "Mugs", "Tote Bags", and "Custom Gifts" using existing local image assets (`custmug01`, `bag01`, `bag02`, `bag03`, etc.).
   - In `src/pages/Home.jsx`, ensure `newArrivalData` handles `"T-Shirts"` or `"Tshirt"`.
5. R5:
   - In `src/pages/Cart.jsx`, format WhatsApp checkout URL to `https://wa.me/919365324146?text=...` detailing each cart item (name, quantity, line total) and overall cart total. Add `target="_blank"` and `rel="noopener noreferrer"`.
   - In `src/components/ProductDetails/ProductDetails.jsx`, update direct WhatsApp inquiry link to `https://wa.me/919365324146?text=...` pre-filling viewed product's details (product name, ID, unit price, selected quantity, line total, and shop URL). Add `target="_blank"` and `rel="noopener noreferrer"`.
6. R6:
   - In `src/index.css`, implement modern brand-accented SVG Data URI custom cursor for `html, body` and interactive elements.
   - In `src/components/ProductCard/ProductCard.jsx`, wrap `<img>` in `<div className="product-img-container">`.
   - In `src/components/ProductCard/product-card.css`, add `overflow: hidden` to `.product`, set `.product-img-container` with `overflow: hidden` and `height: 200px`, and set smooth hover zoom on the image (`transform: scale(1.12)` with `transition: transform 0.4s ease`).
7. R7:
   - Run `npm run build` using run_command in `d:/VS CODE/awwrange/awwrange` to verify that the build compiles with 0 errors.

OUTPUT REQUIREMENTS:
- Update your progress in `d:/VS CODE/awwrange/awwrange/.agents/teamwork/teamwork_preview_worker_1/progress.md`.
- Write your comprehensive handoff report to `d:/VS CODE/awwrange/awwrange/.agents/teamwork/teamwork_preview_worker_1/handoff.md` with:
  - All modified files and summaries of changes
  - Exact build command and result (`npm run build`)
  - Verification checklist for R1-R7
- Send a message to parent upon completion.
