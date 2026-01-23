import React, { useEffect } from "react";
import { RiDeleteBin6Line, RiArrowRightLine, RiShoppingBagLine } from "react-icons/ri";
import { FiPlus, FiMinus } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { IoCartSharp, IoShieldCheckmarkOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeFromCart, updateQuantity } from "../../features/cart/cartSlice";
import { selectIsAuthenticated } from "../../features/auth/authSlice";
import Loader from "../../components/Loader";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = cart || [];

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleIncrement = (productId, currentQty) => {
    dispatch(updateQuantity({ productId, quantity: currentQty + 1 }));
  };

  const handleDecrement = (productId, currentQty) => {
    if (currentQty <= 1) return;
    dispatch(updateQuantity({ productId, quantity: currentQty - 1 }));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.pricing.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }
    navigate("/checkout");
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Page Heading */}
        <div className="flex items-baseline gap-3 mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">SHOPPING CART</h1>
          <span className="text-gray-400 font-bold">({cartItems.length} Items)</span>
        </div>

        {error && error !== "Access Denied" && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm">
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-20 text-center shadow-sm">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <RiShoppingBagLine size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Your cart is empty!</h2>
            <p className="text-gray-500 mt-2 mb-8 max-w-xs mx-auto text-sm font-medium">
              Explore our top categories and add some items to your cart.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-red-500 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all">
              Start Shopping <RiArrowRightLine />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 1. LEFT: Items List (8 Columns) */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow relative group"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <img
                      src={item.product.image?.[0]}
                      alt={item.product.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1 leading-tight cursor-pointer transition-colors">
                          {item.product.title}
                        </h3>
                        <button
                          onClick={() => dispatch(removeFromCart({ productId: item.product._id }))}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          title="Remove Item"
                        >
                          <RiDeleteBin6Line size={20} />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase mt-1 tracking-wider">
                        Brand: {item.product.brand || "CartApp Exclusive"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-end justify-between mt-6 gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => handleDecrement(item.product._id, item.quantity)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
                        >
                          <FiMinus size={14} className="text-gray-600" />
                        </button>
                        <span className="w-10 text-center font-black text-gray-800 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item.product._id, item.quantity)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all"
                        >
                          <FiPlus size={14} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Item Pricing */}
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total Price</p>
                        <p className="text-xl font-black text-gray-900">
                          ₹{(item.product.pricing.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. RIGHT: Summary Sidebar (4 Columns) */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                    Order Summary
                  </h2>

                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between text-gray-500">
                      <span>Price ({cartItems.length} Items)</span>
                      <span className="text-gray-900 font-bold">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Discount</span>
                      <span className="text-green-600 font-bold">-  ₹0</span>
                    </div>
                    <div className="flex justify-between text-gray-500 border-b border-gray-50 pb-4">
                      <span>Delivery Charges</span>
                      <span className="text-green-600 font-bold uppercase">Free</span>
                    </div>
                    
                    <div className="flex justify-between text-xl font-black text-gray-900 pt-2">
                      <span>Total Amount</span>
                      <span className="text-red-500">₹{subtotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-green-600 font-bold mt-4 bg-green-50 p-2 rounded text-center">
                    You will save ₹0 on this order
                  </p>

                  <button
                    onClick={handleCheckout}
                    className="w-full mt-8 bg-red-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    Checkout Now
                  </button>
                </div>
                
                {/* Security Badge */}
                <div className="bg-gray-50 p-4 flex items-center justify-center gap-2 text-gray-400 border-t border-gray-100">
                  <IoShieldCheckmarkOutline size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">100% Secure Payments</span>
                </div>
              </div>

              {/* Promo Code Suggestion */}
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 border-dashed flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center text-red-500 font-bold text-xs">%</div>
                   <span className="text-xs font-bold text-gray-600 tracking-tight">Apply Coupon Code</span>
                </div>
                <button className="text-red-500 text-xs font-black hover:underline">SELECT</button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;