import { useState } from "react";
import "./searchbar.css";
import { products } from "../../utils/products";
// import useDebounce from "../../hooks/useDebounce";
const SearchBar = ({ setFilterList }) => {
  const [searchWord, setSearchWord] = useState("");
  // const debounceSearchWord = useDebounce(searchWord, 300);
  const handelChange = (input) => {
    const query = input.target.value;
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
        onChange={handelChange}
      />
      <ion-icon name="search-outline" className="search-icon"></ion-icon>
    </div>
  );
};

export default SearchBar;
