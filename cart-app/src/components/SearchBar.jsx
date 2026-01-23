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

    dispatch(searchProducts({ query: searchQuery, category: searchCategory }));

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
    <form onSubmit={handleSearch} className="w-full max-w-3xl group">
      <div className="relative flex items-center w-full bg-gray-100 rounded-xl border-2 border-transparent transition-all duration-300 focus-within:bg-white focus-within:border-gray-100 focus-within:shadow-md overflow-visible">
        
        {/* CATEGORY DROPDOWN */}
        <div ref={dropdownRef} className="relative hidden md:block border-r border-gray-300 my-2">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-1 text-xs font-bold text-gray-500 uppercase tracking-tight  transition-colors"
          >
            <RiGridFill className="text-red-500" />
            <span className="truncate max-w-[80px]">{category}</span>
            <FiChevronDown className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute left-0 top-full mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[9999] animate-in fade-in slide-in-from-top-2">
              <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Category</p>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {filteredCategories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setCategory(item);
                      setOpen(false);
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                      category === item 
                        ? "bg-red-50 text-red-600 border-l-4 border-red-500" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* INPUT FIELD */}
        <div className="relative flex-1 flex items-center">
          <FiSearch className="absolute left-4 text-gray-400 pointer-events-none group-focus-within:text-red-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-transparent outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal"
            placeholder="Search for mobiles, fashion, electronics..."
          />
        </div>

        {/* SEARCH BUTTON */}
        <button
          type="submit"
          className="mr-1.5 px-6 py-2 bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-200"
        >
          <span className="hidden sm:inline">Search</span>
          <FiSearch className="sm:hidden text-lg" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;