import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  RiDeleteBin6Line,
  RiShoppingBag3Fill,
  RiHeart3Fill,
  RiArrowRightUpLine,
  RiShoppingCart2Fill,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  getWishlist,
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const WishListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleMoveToCart = (productId) => {
    dispatch(addToCart({ productId }))
      .unwrap()
      .then(() => toast.success("Item moved to cart"))
      .catch(() => toast.error("Move to cart failed"));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        {/* ===================== HEADER SECTION ===================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-red-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-red-200 shrink-0">
              <RiHeart3Fill size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900  leading-none">
                My Wishlist
              </h1>
              <p className="text-[10px] font-bold text-gray-400  tracking-[0.3em] mt-3 ">
                {wishlist.length} Items
              </p>
            </div>
          </div>

          <Link
            to="/shop"
            className="group flex items-center gap-2 text-[10px] font-bold  tracking-widest text-gray-400 hover:text-red-500 transition-all"
          >
            Continue Shopping{" "}
            <RiArrowRightUpLine className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* ===================== CONTENT AREA ===================== */}
        {!loading && wishlist.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 p-20 text-center shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-gray-200 border border-gray-100">
              <RiShoppingBag3Fill size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900  tracking-tight">
              Registry is Empty
            </h2>
            <p className="text-gray-400 mt-3 mb-10 text-sm font-medium ">
              Your saved inventory manifest is currently unpopulated.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-xs  tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              Access Global Catalog
            </button>
          </div>
        ) : (
          /* WISHLIST GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.product._id}
                className="group relative bg-white rounded-[2.5rem] p-5 border border-gray-100 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Image Interface */}
                <div
                  onClick={() => navigate(`/product/${item.product._id}`)}
                  className="relative h-56 bg-[#F9FAFB] rounded-[2rem] overflow-hidden flex items-center justify-center p-8 cursor-pointer group-hover:bg-white transition-colors"
                >
                  <img
                    src={item.product.image?.[0]}
                    alt={item.product.title}
                    className="h-full object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Specification Details */}
                <div className="mt-6 flex-1 px-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400  tracking-widest leading-none ">
                      {item.product.brand || "Industrial"}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-500 ">
                      Available
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900  tracking-tight text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
                    {item.product.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-4">
                    <p className="text-2xl font-bold text-gray-900  ">
                      ₹{item.product.pricing.price.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-400 line-through font-bold opacity-50">
                      ₹{item.product.pricing.mrp?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Execution Bar */}
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => handleMoveToCart(item.product._id)}
                    className="flex-1 flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-2xl font-bold text-[10px]  tracking-widest hover:bg-red-500 transition-all shadow-lg active:scale-95"
                  >
                    <RiShoppingCart2Fill size={18} />
                    Add to Cart
                  </button>

                  <button
                    onClick={() =>
                      dispatch(
                        removeFromWishlist({ productId: item.product._id }),
                      )
                    }
                    className="w-12 h-12 flex items-center justify-center border border-gray-100 rounded-2xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-90 shadow-sm"
                    title="Revoke Asset"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WishListPage;
