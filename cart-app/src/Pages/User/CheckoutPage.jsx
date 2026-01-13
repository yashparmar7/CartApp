import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaMobileAlt,
} from "react-icons/fa";
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

  const { loading, success, error } = useSelector((state) => state.order);

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
      shippingAddress: {
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
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
    <>
      <Navbar />

      <section className="min-h-[calc(100vh-64px)] bg-gray-100 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto px-4">
          <StepProgress step={step} />

          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
            {step === 1 && (
              <>
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 mb-5">
                  <FaMapMarkerAlt className="text-red-500" />
                  Delivery Address
                </h2>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                  <Input
                    name="phone"
                    placeholder="Mobile Number"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />
                </div>

                <Input
                  name="address"
                  placeholder="House No, Area, Street"
                  value={form.address}
                  onChange={handleChange}
                  error={errors.address}
                  className="mt-3 sm:mt-4"
                />

                <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  <Input
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                    error={errors.city}
                  />
                  <Input
                    name="state"
                    placeholder="State"
                    onChange={handleChange}
                    error={errors.state}
                  />
                  <Input
                    name="pincode"
                    placeholder="Pincode"
                    onChange={handleChange}
                    error={errors.pincode}
                  />
                </div>

                <button
                  onClick={() => validateAddress() && setStep(2)}
                  className="mt-6 w-full h-11 sm:h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                  Continue to Payment
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg sm:text-xl font-semibold mb-5">
                  Payment Method
                </h2>

                <PaymentOption
                  label="Credit / Debit Card"
                  icon={<FaCreditCard />}
                  active={paymentMethod === "card"}
                  onClick={() => setPaymentMethod("card")}
                />

                {paymentMethod === "card" && (
                  <div className="mt-3 space-y-3">
                    <Input
                      name="card"
                      placeholder="Card Number"
                      onChange={handleChange}
                      error={errors.card}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input name="expiry" placeholder="MM / YY" />
                      <Input
                        name="cvv"
                        placeholder="CVV"
                        onChange={handleChange}
                        error={errors.cvv}
                      />
                    </div>
                  </div>
                )}

                <PaymentOption
                  label="UPI"
                  icon={<FaMobileAlt />}
                  active={paymentMethod === "upi"}
                  onClick={() => setPaymentMethod("upi")}
                />

                {paymentMethod === "upi" && (
                  <Input
                    name="upi"
                    placeholder="example@upi"
                    onChange={handleChange}
                    error={errors.upi}
                    className="mt-3"
                  />
                )}

                <PaymentOption
                  label="Cash on Delivery"
                  icon={<FaMoneyBillWave />}
                  active={paymentMethod === "cod"}
                  onClick={() => setPaymentMethod("cod")}
                />

                {errors.payment && (
                  <p className="text-xs text-red-500 mt-2">{errors.payment}</p>
                )}

                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

                <div className="flex gap-3 sm:gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/2 h-11 sm:h-12 rounded-xl border font-semibold"
                  >
                    Back
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-1/2 h-11 sm:h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold disabled:opacity-60"
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="text-center py-10">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Order Confirmed !
                </h2>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                  Your order has been placed successfully.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-6 w-1/2 h-11 sm:h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

const Input = ({ error, className = "", ...props }) => (
  <div className={`w-full ${className}`}>
    <input
      {...props}
      className={`w-full h-11 sm:h-12 rounded-xl border px-4 text-sm focus:outline-none focus:ring-2
      ${error ? "border-red-500 focus:ring-red-400" : "focus:ring-red-300"}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const PaymentOption = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer mt-3 transition
    ${active ? "border-red-500 bg-red-50" : "hover:bg-gray-50"}`}
  >
    <span className="text-red-500 text-lg">{icon}</span>
    <span className="font-medium">{label}</span>
  </div>
);

export default CheckoutPage;
