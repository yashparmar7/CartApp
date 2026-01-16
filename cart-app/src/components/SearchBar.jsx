import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { RiGridFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../features/category/categorySlice";
import { searchProducts } from "../features/product/productSlice";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const filteredCategories = ["All", ...(categories || []).map((c) => c.name)];

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();

    const searchQuery = query.trim();
    const searchCategory = category === "All" ? "" : category;

    dispatch(
      searchProducts({
        query: searchQuery,
        category: searchCategory,
      })
    );

    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchCategory) params.set("category", searchCategory);
    navigate(`/shop?${params.toString()}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      onSubmit={handleSearch}
      className="max-w-2xl mx-auto overflow-visible"
    >
      <div className="flex items-center rounded-lg border border-gray-400 bg-neutral-secondary-medium overflow-visible">
        {/* DROPDOWN */}
        <div ref={dropdownRef} className="relative z-[9999]">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-l-lg"
          >
            <RiGridFill />
            <span>{category}</span>
            <FiChevronDown />
          </button>

          {open && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999]">
              {filteredCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-red-100"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INPUT */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
          placeholder="Search products..."
        />

        {/* SEARCH BUTTON */}
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-r-lg hover:bg-red-600"
        >
          <FiSearch />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
