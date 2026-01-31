import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaMobileAlt,
  FaLock,
} from "react-icons/fa";
import { RiArrowLeftLine, RiShieldCheckLine } from "react-icons/ri";
import StepProgress from "../../components/StepProgress";
import { useSelector, useDispatch } from "react-redux";
import { createOrder, resetOrderState } from "../../features/order/orderSlice";
import { useNavigate } from "react-router-dom";

/* ---------------- REGEX ---------------- */
const regex = {
  name: /^[A-Za-z ]{3,30}$/,
  phone: /^[6-9]\d{9}$/,
  pincode: /^[1-9][0-9]{5}$/,
  card: /^\d{16}$/,
  cvv: /^\d{3}$/,
  upi: /^[\w.-]+@[\w.-]+$/,
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    card: "",
    expiry: "",
    cvv: "",
    upi: "",
  });

  const { loading, success } = useSelector((state) => state.order);
  const { cart } = useSelector((state) => state.cart);

  const cartItems = cart || [];
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.pricing.price * item.quantity,
    0,
  );

  // Check if COD is available for all products in cart
  const codAvailable = cartItems.every(
    (item) => item.product.delivery?.codAvailable !== false,
  );

  useEffect(() => {
    if (success) {
      setStep(3);
      dispatch(resetOrderState());
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!regex.name.test(form.name)) newErrors.name = "Enter valid name";
    if (!regex.phone.test(form.phone))
      newErrors.phone = "Invalid mobile number";
    if (!form.address) newErrors.address = "Address required";
    if (!form.city) newErrors.city = "City required";
    if (!form.state) newErrors.state = "State required";
    if (!regex.pincode.test(form.pincode))
      newErrors.pincode = "Invalid pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!paymentMethod) newErrors.payment = "Select payment method";
    if (paymentMethod === "card") {
      if (!regex.card.test(form.card))
        newErrors.card = "16-digit card required";
      if (!regex.cvv.test(form.cvv)) newErrors.cvv = "Invalid CVV";
    }
    if (paymentMethod === "upi") {
      if (!regex.upi.test(form.upi)) newErrors.upi = "Invalid UPI ID";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validatePayment()) return;

    const payload = {
      shippingAddress: { ...form },
      payment: {
        method: paymentMethod,
        paymentId:
          paymentMethod === "cod"
            ? null
            : paymentMethod === "upi"
              ? form.upi
              : form.card,
      },
    };
    dispatch(createOrder(payload));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <StepProgress step={step} />
        </div>

        {step === 3 ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Success!
            </h2>
            <p className="text-gray-500 mt-3 font-medium">
              Your order has been placed and will be with you shortly.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 transition-all"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: FORM (8 Columns) */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8">
                {step === 1 && (
                  <div className="animate-in fade-in duration-500">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="bg-red-500 p-2 rounded-lg text-white">
                        <FaMapMarkerAlt />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                        Shipping Details
                      </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <Input
                        name="name"
                        label="Full Name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                      />
                      <Input
                        name="phone"
                        label="Mobile Number"
                        placeholder="Mobile number"
                        value={form.phone}
                        onChange={handleChange}
                        error={errors.phone}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          name="address"
                          label="Street Address"
                          placeholder="Your address"
                          value={form.address}
                          onChange={handleChange}
                          error={errors.address}
                        />
                      </div>
                      <Input
                        name="city"
                        label="Town/City"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                        error={errors.city}
                      />
                      <Input
                        name="state"
                        label="State"
                        placeholder="State"
                        value={form.state}
                        onChange={handleChange}
                        error={errors.state}
                      />
                      <Input
                        name="pincode"
                        label="Pincode"
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        error={errors.pincode}
                      />
                    </div>

                    <button
                      onClick={() => validateAddress() && setStep(2)}
                      className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      Payment Method <RiArrowLeftLine className="rotate-180" />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-in fade-in duration-500">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-500 mb-4 transition-colors"
                    >
                      <RiArrowLeftLine /> BACK TO ADDRESS
                    </button>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="bg-red-500 p-2 rounded-lg text-white">
                        <FaCreditCard />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                        Payment Method
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <PaymentOption
                        label="Credit / Debit Card"
                        sub="Secure transaction via gateway"
                        icon={<FaCreditCard />}
                        active={paymentMethod === "card"}
                        onClick={() => setPaymentMethod("card")}
                      />
                      {paymentMethod === "card" && (
                        <div className="p-4 bg-gray-50 rounded-2xl space-y-4 border border-gray-100 mt-2">
                          <Input
                            name="card"
                            placeholder="1234 5678 1234 5678"
                            label="Card Number"
                            onChange={handleChange}
                            error={errors.card}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              name="expiry"
                              placeholder="MM/YY"
                              label="Expiry"
                            />
                            <Input
                              name="cvv"
                              placeholder="123"
                              label="CVV"
                              onChange={handleChange}
                              error={errors.cvv}
                            />
                          </div>
                        </div>
                      )}

                      <PaymentOption
                        label="UPI Payment"
                        sub="Pay via GooglePay, PhonePe, or BHIM"
                        icon={<FaMobileAlt />}
                        active={paymentMethod === "upi"}
                        onClick={() => setPaymentMethod("upi")}
                      />
                      {paymentMethod === "upi" && (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
                          <Input
                            name="upi"
                            label="UPI ID"
                            placeholder="user@upi"
                            onChange={handleChange}
                            error={errors.upi}
                          />
                        </div>
                      )}

                      {codAvailable && (
                        <PaymentOption
                          label="Cash on Delivery"
                          sub="Pay when you receive the product"
                          icon={<FaMoneyBillWave />}
                          active={paymentMethod === "cod"}
                          onClick={() => setPaymentMethod("cod")}
                        />
                      )}
                    </div>

                    {errors.payment && (
                      <p className="text-sm text-red-500 mt-4 font-bold">
                        {errors.payment}
                      </p>
                    )}

                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all uppercase tracking-widest disabled:opacity-50"
                    >
                      {loading
                        ? "Processing..."
                        : `Pay ₹${subtotal.toLocaleString()}`}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY (4 Columns) */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">
                  Order Summary
                </h3>
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <img
                        src={item.product.image?.[0]}
                        className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {item.product.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-black text-gray-900">
                        ₹
                        {(
                          item.product.pricing.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Delivery</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-red-500">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                <RiShieldCheckLine className="text-emerald-500 text-2xl" />
                <div>
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider leading-none">
                    Safe & Secure
                  </p>
                  <p className="text-[9px] text-emerald-600 font-medium mt-1">
                    Your data is encrypted and protected by CartApp security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const Input = ({ label, error, className = "", ...props }) => (
  <div className={`w-full ${className}`}>
    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
      {label}
    </label>
    <input
      {...props}
      className={`w-full h-12 rounded-xl border px-4 text-sm font-medium transition-all outline-none focus:ring-2
      ${error ? "border-red-500 focus:ring-red-100 bg-red-50/30" : "border-gray-200 focus:border-red-500 focus:ring-red-50"}`}
    />
    {error && (
      <p className="text-[10px] text-red-500 mt-1 font-bold">{error}</p>
    )}
  </div>
);

const PaymentOption = ({ icon, label, sub, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
    ${active ? "border-red-500 bg-red-50" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
  >
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400"}`}
    >
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-black text-gray-900 leading-tight">{label}</p>
      <p className="text-[10px] text-gray-400 font-bold mt-0.5">{sub}</p>
    </div>
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-red-500" : "border-gray-300"}`}
    >
      {active && <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>}
    </div>
  </div>
);

export default CheckoutPage;
