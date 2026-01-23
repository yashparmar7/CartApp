import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import {
  getAllProducts,
  searchProducts,
} from "../../features/product/productSlice";
import { RiFilter2Line, RiLayoutGridLine, RiListCheck } from "react-icons/ri";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  const query = searchParams.get("q");
  const category = searchParams.get("category");

  useEffect(() => {
    if (query || category) {
      dispatch(searchProducts({ query: query || "", category: category || "" }));
    } else {
      dispatch(getAllProducts());
    }
  }, [searchParams, dispatch, query, category]);

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
            <RiLayoutGridLine className="text-red-500 cursor-pointer" size={20} />
            <RiListCheck className="hover:text-gray-600 cursor-pointer" size={20} />
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 2. LEFT SIDEBAR (Filters) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter mb-4 flex items-center gap-2">
                <RiFilter2Line className="text-red-500" /> Filters
              </h3>
              
              {/* Categories Filter */}
              <div className="space-y-6">
                <FilterGroup title="Availability">
                  <Checkbox label="In Stock" count="120" />
                  <Checkbox label="Out of Stock" count="12" />
                </FilterGroup>

                <FilterGroup title="Price Range">
                  <div className="space-y-2 mt-3">
                    <input type="range" className="w-full accent-red-500" />
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                      <span>₹0</span>
                      <span>₹50,000+</span>
                    </div>
                  </div>
                </FilterGroup>

                <FilterGroup title="Brand">
                  <Checkbox label="Apple" count="15" />
                  <Checkbox label="Samsung" count="22" />
                  <Checkbox label="Nike" count="10" />
                  <Checkbox label="Adidas" count="8" />
                </FilterGroup>
              </div>
            </div>

            {/* Promo Banner in Sidebar */}
            <div className="bg-red-500 rounded-2xl p-6 text-white overflow-hidden relative group">
               <div className="relative z-10">
                 <p className="text-[10px] font-bold uppercase opacity-80">Flash Sale</p>
                 <p className="text-xl font-black mt-1">Get 20% Off</p>
                 <button className="mt-4 text-[11px] font-black bg-white text-red-500 px-4 py-2 rounded-lg uppercase tracking-wider">Claim Now</button>
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
                  {query ? `Search results for "${query}"` : category ? `${category} Collection` : "All Products"}
                </h2>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wide">
                  Showing {products?.length || 0} items
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Sort By:</span>
                <select className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-100">
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            {/* The Grid */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <Card />
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
    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{title}</h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const Checkbox = ({ label, count }) => (
  <label className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-2">
      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer" />
      <span className="text-sm font-medium text-gray-600 group-hover:text-red-500 transition-colors">{label}</span>
    </div>
    <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">{count}</span>
  </label>
);

export default ShopPage;