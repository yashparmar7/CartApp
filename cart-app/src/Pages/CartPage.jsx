import React, { useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlus, FiMinus } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { IoCartSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  removeFromCart,
  updateQuantity,
} from "../features/cart/cartSlice";
import Loader from "../components/Loader";

const CartPage = () => {
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart);
  const cartItems = cart || [];

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // ✅ Quantity handlers
  const handleIncrement = (productId, currentQty) => {
    dispatch(
      updateQuantity({
        productId,
        quantity: currentQty + 1,
      })
    );
  };

  const handleDecrement = (productId, currentQty) => {
    if (currentQty <= 1) return;

    dispatch(
      updateQuantity({
        productId,
        quantity: currentQty - 1,
      })
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.pricing.price * item.quantity,
    0
  );

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-5">
          <h1 className="flex items-center gap-2 text-3xl font-bold mb-8">
            Shopping Cart <IoCartSharp className="text-red-500" />
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-500">
                Looks like you haven’t added anything yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="bg-white rounded-xl shadow p-4 flex gap-4"
                  >
                    <img
                      src={item.product.image?.[0]}
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.title}</h3>
                      <p className="text-red-500 font-medium">
                        ₹{item.product.pricing.price}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            handleDecrement(item.product._id, item.quantity)
                          }
                          disabled={item.quantity <= 1}
                          className={`p-1 border rounded ${
                            item.quantity <= 1
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <FiMinus />
                        </button>

                        <span className="font-medium">{item.quantity}</span>

                        <button
                          onClick={() =>
                            handleIncrement(item.product._id, item.quantity)
                          }
                          className="p-1 border rounded hover:bg-gray-100"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            productId: item.product._id,
                          })
                        )
                      }
                      className="text-red-500 hover:text-red-600"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl shadow p-6 h-fit">
                <h2 className="text-xl font-semibold mb-4">Price Details</h2>

                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Delivery</span>
                  <span className="text-red-500">Free</span>
                </div>

                <hr className="my-3" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>

                <button className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CartPage;
