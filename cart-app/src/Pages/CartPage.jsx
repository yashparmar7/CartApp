import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlus, FiMinus } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { IoCartSharp } from "react-icons/io5";

const CartPage = () => {
  // temporary dummy data (later from Redux / backend)
  const cartItems = [
    {
      id: 1,
      name: "Shoes",
      price: 1999,
      qty: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4QaRqKWxfrGdQ9r5U5mWg-RWItNxzmphX-Q&s",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 2999,
      qty: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4QaRqKWxfrGdQ9r5U5mWg-RWItNxzmphX-Q&s",
    },
  ];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-5">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 mb-8">
            <span>Shopping Cart</span>
            <IoCartSharp className="text-red-500 text-3xl" />
          </h1>

          {cartItems.length === 0 ? (
            /* Empty Cart */
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
                    key={item.id}
                    className="bg-white rounded-xl shadow p-4 flex gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-red-500 font-medium">₹{item.price}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button className="p-1 border rounded hover:bg-gray-100">
                          <FiMinus />
                        </button>
                        <span className="font-medium">{item.qty}</span>
                        <button className="p-1 border rounded hover:bg-gray-100">
                          <FiPlus />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button className="text-red-500 hover:text-red-600">
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
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

                <button className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition">
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
