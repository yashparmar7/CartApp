import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import {
  getAllProducts,
  searchProducts,
} from "../../features/product/productSlice";
import { getAllCategories } from "../../features/category/categorySlice";
import {
  RiFilter2Line,
  RiLayoutGridLine,
  RiListCheck,
  RiCloseLine,
} from "react-icons/ri";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useCallback } from "react";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const query = searchParams.get("q");
  const category = searchParams.get("category")?.trim();

  // Filter states
  const [filters, setFilters] = useState({
    availability: [],
    priceRange: [0, 0],
    brands: [],
    categories: category ? [category] : [],
  });

  const [sortBy, setSortBy] = useState("newest");

  const maxProductPrice = useMemo(() => {
    if (!products || products.length === 0) return 0;

    return Math.max(
      ...products
        .map((p) => Number(p.pricing?.price))
        .filter((price) => !Number.isNaN(price)),
    );
  }, [products]);

  useEffect(() => {
    if (maxProductPrice > 0) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, maxProductPrice],
      }));
    }
  }, [maxProductPrice]);

  // Load categories on mount
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Load products based on search params
  useEffect(() => {
    if (query || category) {
      dispatch(
        searchProducts({
          query: query || "",
          category: category || "",
        }),
      );
    } else {
      dispatch(getAllProducts());
    }
  }, [query, category, dispatch]);

  // Get unique brands and categories from products (for filter options)
  const availableBrands = useMemo(() => {
    if (!products || products.length === 0) return [];
    const brands = [
      ...new Set(
        products.map((p) => p.brand).filter((brand) => brand && brand.trim()),
      ),
    ];
    return brands.sort();
  }, [products]);

  const availableCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.map((cat) => cat.name).sort();
  }, [categories]);

  const getFilteredCount = useCallback(
    (filterType, value) => {
      if (!products) return 0;

      let count = 0;

      for (const product of products) {
        let matches = true;

        if (filterType !== "availability" && filters.availability.length) {
          const isInStock = product.stock > 0;
          if (filters.availability.includes("inStock") && !isInStock)
            matches = false;
          if (filters.availability.includes("outOfStock") && isInStock)
            matches = false;
        }

        if (filterType !== "priceRange") {
          const price = product.pricing?.price || 0;
          if (price < filters.priceRange[0] || price > filters.priceRange[1])
            matches = false;
        }

        if (filterType !== "brands" && filters.brands.length) {
          if (!filters.brands.includes(product.brand)) matches = false;
        }

        if (filterType !== "categories" && filters.categories.length) {
          const productCategory = (
            typeof product.category === "string"
              ? product.category
              : product.category?.name
          )
            ?.toLowerCase()
            .trim();

          const selectedCategories = filters.categories.map((c) =>
            c.toLowerCase().trim(),
          );

          if (
            !productCategory ||
            !selectedCategories.includes(productCategory)
          ) {
            matches = false;
          }
        }

        if (!matches) continue;

        if (filterType === "availability") {
          if (value === "inStock" && product.stock > 0) count++;
          if (value === "outOfStock" && product.stock <= 0) count++;
        }

        if (filterType === "brands" && product.brand === value) count++;
        if (filterType === "categories") {
          const productCategory = (
            typeof product.category === "string"
              ? product.category
              : product.category?.name
          )
            ?.toLowerCase()
            .trim();

          if (productCategory === value.toLowerCase().trim()) {
            count++;
          }
        }
      }

      return count;
    },
    [products, filters],
  );

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((product) => {
      // Availability filter
      if (filters.availability.length > 0) {
        const isInStock = product.stock > 0;
        if (filters.availability.includes("inStock") && !isInStock)
          return false;
        if (filters.availability.includes("outOfStock") && isInStock)
          return false;
      }

      // Price range filter
      if (product.pricing?.price != null) {
        const price = Number(product.pricing.price);
        if (
          !Number.isNaN(price) &&
          (price < filters.priceRange[0] || price > filters.priceRange[1])
        ) {
          return false;
        }
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand))
        return false;

      // Category filter (FINAL)
      if (filters.categories.length > 0) {
        const productCategory = (
          typeof product.category === "string"
            ? product.category
            : product.category?.name
        )
          ?.toLowerCase()
          .trim();

        const selectedCategories = filters.categories.map((c) =>
          c.toLowerCase().trim(),
        );

        if (!productCategory || !selectedCategories.includes(productCategory)) {
          return false;
        }
      }

      return true;
    });

    // console.log(
    //   products.map((p) => ({
    //     title: p.title,
    //     category: p.category,
    //     price: p.pricing?.price,
    //   })),
    // );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priceLow":
          return (a.pricing?.price || 0) - (b.pricing?.price || 0);
        case "priceHigh":
          return (b.pricing?.price || 0) - (a.pricing?.price || 0);
        case "rating":
          return (b.ratings?.average || 0) - (a.ratings?.average || 0);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [products, filters, sortBy]);

  // Handle filter changes
  const handleFilterChange = (filterType, value, checked) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...prev[filterType], value]
        : prev[filterType].filter((item) => item !== value),
    }));
  };

  const handlePriceRangeChange = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [min, max],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      availability: [],
      priceRange: [0, maxProductPrice],
      brands: [],
      categories: [],
    });
  };

  const activeFiltersCount =
    filters.availability.length +
    filters.brands.length +
    filters.categories.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000 ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  // Show all categories
  const visibleCategories = useMemo(() => {
    return availableCategories;
  }, [availableCategories]);

  const visibleBrands = useMemo(() => {
    return availableBrands.filter((brand) => {
      return products?.some((p) => p.brand === brand) || false;
    });
  }, [availableBrands, products]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* 1. Sub-Header / Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className="hover:text-red-500 cursor-pointer">Home</span>
            <MdOutlineKeyboardArrowRight />
            <span className="text-gray-900">Shop</span>
            {category && (
              <>
                <MdOutlineKeyboardArrowRight />
                <span className="text-red-500">{category}</span>
              </>
            )}
          </nav>
          <div className="hidden md:flex items-center gap-4 text-gray-400">
            <RiLayoutGridLine
              className="text-red-500 cursor-pointer"
              size={20}
            />
            <RiListCheck
              className="hover:text-gray-600 cursor-pointer"
              size={20}
            />
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 2. LEFT SIDEBAR (Filters) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                  <RiFilter2Line className="text-red-500" /> Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-red-500 hover:text-red-600"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              <div className="space-y-6">
                <FilterGroup title="Availability">
                  <Checkbox
                    label="In Stock"
                    count={getFilteredCount("availability", "inStock")}
                    checked={filters.availability.includes("inStock")}
                    onChange={(checked) =>
                      handleFilterChange("availability", "inStock", checked)
                    }
                  />
                  <Checkbox
                    label="Out of Stock"
                    count={getFilteredCount("availability", "outOfStock")}
                    checked={filters.availability.includes("outOfStock")}
                    onChange={(checked) =>
                      handleFilterChange("availability", "outOfStock", checked)
                    }
                  />
                </FilterGroup>

                <FilterGroup title="Price Range">
                  <div className="space-y-2 mt-3">
                    <input
                      type="range"
                      min="0"
                      max={maxProductPrice}
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handlePriceRangeChange(0, Number(e.target.value))
                      }
                      className="w-full accent-red-500"
                    />

                    <div className="flex justify-between text-xs font-bold text-gray-500">
                      <span>₹0</span>
                      <span>₹{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </FilterGroup>

                {visibleCategories.length > 0 && (
                  <FilterGroup title="Categories">
                    <div className="max-h-60 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
                      {visibleCategories.map((category) => {
                        const count = getFilteredCount("categories", category);
                        return (
                          <Checkbox
                            key={category}
                            label={category}
                            count={count}
                            checked={filters.categories.includes(category)}
                            onChange={(checked) =>
                              handleFilterChange(
                                "categories",
                                category,
                                checked,
                              )
                            }
                          />
                        );
                      })}
                    </div>
                  </FilterGroup>
                )}

                {visibleBrands.length > 0 && (
                  <FilterGroup title="Brand">
                    {visibleBrands.map((brand) => {
                      const count = getFilteredCount("brands", brand);
                      return (
                        <Checkbox
                          key={brand}
                          label={brand}
                          count={count}
                          checked={filters.brands.includes(brand)}
                          onChange={(checked) =>
                            handleFilterChange("brands", brand, checked)
                          }
                        />
                      );
                    })}
                  </FilterGroup>
                )}
              </div>
            </div>

            {/* Promo Banner in Sidebar */}
            <div className="bg-red-500 rounded-2xl p-6 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase opacity-80">
                  Flash Sale
                </p>
                <p className="text-xl font-black mt-1">Get 20% Off</p>
                <button className="mt-4 text-[11px] font-black bg-white text-red-500 px-4 py-2 rounded-lg uppercase tracking-wider">
                  Claim Now
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-500" />
            </div>
          </aside>

          {/* 3. RIGHT CONTENT (Product Grid) */}
          <div className="flex-1">
            {/* Sort & Results Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-gray-900 leading-none">
                  {query
                    ? `Search results for "${query}"`
                    : category
                      ? `${category} Collection`
                      : "All Products"}
                </h2>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wide">
                  Showing {filteredProducts?.length || 0} items
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-100"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* The Grid */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Card products={filteredProducts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* --- UI HELPERS --- */

const FilterGroup = ({ title, children }) => (
  <div className="border-b border-gray-200 pb-6 last:border-0">
    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
      {title}
    </h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const Checkbox = ({ label, count, checked, onChange }) => (
  <label className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer"
      />
      <span className="text-sm font-medium text-gray-600 group-hover:text-red-500 transition-colors">
        {label}
      </span>
    </div>
    <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
      {count}
    </span>
  </label>
);

export default ShopPage;
