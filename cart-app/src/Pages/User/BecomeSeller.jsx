import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSellerRequest } from "../../features/sellerRequest/sellerRequestSlice";
import { getAllCategories } from "../../features/category/categorySlice";
import { toast } from "react-hot-toast";
import Navbar from "../../components/Navbar";

const BecomeSeller = () => {
  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    shopName: "",
    phone: "",
    category: "",
    description: "",
    panNumber: "",
    aadhaarNumber: "",
  });

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "panNumber") value = value.toUpperCase();

    if (name === "phone" || name === "aadhaarNumber") {
      value = value.replace(/\D/g, "");
    }

    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const aadhaarRegex = /^[0-9]{12}$/;

    if (!form.shopName || !form.phone || !form.category) {
      toast.error("Please fill all required fields");
      return false;
    }

    if (form.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return false;
    }

    if (!panRegex.test(form.panNumber)) {
      toast.error("Invalid PAN number");
      return false;
    }

    if (!aadhaarRegex.test(form.aadhaarNumber)) {
      toast.error("Aadhaar must be exactly 12 digits");
      return false;
    }

    return true;
  };

  const submitRequest = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      ...form,
      email: user?.email,
      user: user?.id,
    };

    try {
      await dispatch(createSellerRequest(payload)).unwrap();

      toast.success(
        "Seller request submitted successfully. Waiting for approval"
      );

      setForm({
        shopName: "",
        phone: "",
        category: "",
        description: "",
        panNumber: "",
        aadhaarNumber: "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error("Failed to submit request");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3">
        <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Become a Seller
          </h2>

          {/* Email */}
          <input
            value={user?.email || ""}
            disabled
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 border rounded bg-gray-100"
          />

          <input
            name="shopName"
            value={form.shopName}
            placeholder="Shop / Business Name *"
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded"
          />

          <input
            name="phone"
            value={form.phone}
            placeholder="Phone Number *"
            maxLength={10}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={form.description}
            placeholder="What do you sell?"
            onChange={handleChange}
            className="w-full mb-3 px-4 py-2 border rounded resize-none"
          />

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">KYC Details</h3>

            <input
              name="panNumber"
              value={form.panNumber}
              placeholder="PAN Number (ABCDE1234F)"
              maxLength={10}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded uppercase"
            />

            <input
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              placeholder="Aadhaar Number (12 digits)"
              maxLength={12}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded"
            />
          </div>

          <button
            onClick={submitRequest}
            disabled={loading}
            className="w-full mt-5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-2 rounded transition"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </>
  );
};

export default BecomeSeller;
