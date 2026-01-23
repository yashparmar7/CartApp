import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSellerRequest } from "../../features/sellerRequest/sellerRequestSlice";
import { getAllCategories } from "../../features/category/categorySlice";
import { toast } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { RiStore2Line, RiUserLine, RiShieldCheckLine, RiInformationLine } from "react-icons/ri";

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
    const payload = { ...form, email: user?.email, user: user?.id };

    try {
      await dispatch(createSellerRequest(payload)).unwrap();
      toast.success("Seller request submitted successfully!");
      setForm({ shopName: "", phone: "", category: "", description: "", panNumber: "", aadhaarNumber: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error("Failed to submit request");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Left Side: Info / Branding */}
          <div className="lg:w-2/5 bg-red-500 p-8 lg:p-12 text-white flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-6">Start your <br /> business journey.</h1>
              <p className="text-red-100 mb-10 text-lg">Join thousands of sellers and reach millions of customers across the nation.</p>
              
              <div className="space-y-6">
                <Benefit icon={<RiStore2Line />} title="Digital Storefront" desc="Get your own branded shop page instantly." />
                <Benefit icon={<RiShieldCheckLine />} title="Secure Payments" desc="Get paid directly to your bank account." />
                <Benefit icon={<RiUserLine />} title="Seller Support" desc="Dedicated 24/7 help for your business." />
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-red-400/50">
              <p className="text-sm opacity-80">Already have a request? Contact support for updates.</p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-3/5 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Seller Registration</h2>
                <p className="text-gray-500 text-sm mt-1">Please provide accurate business and KYC details.</p>
              </div>

              <div className="space-y-5">
                {/* Email (Read Only) */}
                <div className="group">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Account Email</label>
                  <input
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                   <CustomInput label="Shop Name" name="shopName" value={form.shopName} onChange={handleChange} placeholder="CartApp Store" />
                   <CustomInput label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Business Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition appearance-none bg-white font-medium"
                  >
                    <option value="" disabled>Choose Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <CustomTextarea label="Business Description" name="description" value={form.description} onChange={handleChange} placeholder="Briefly describe what you sell..." />

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <RiInformationLine className="text-red-500 text-lg" /> KYC Verification
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <CustomInput label="PAN Card" name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="ABCDE1234F" maxLength={10} />
                    <CustomInput label="Aadhaar Number" name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} placeholder="12-digit number" maxLength={12} />
                  </div>
                </div>

                <button
                  onClick={submitRequest}
                  disabled={loading}
                  className="w-full mt-6 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all uppercase tracking-widest active:scale-95"
                >
                  {loading ? "Processing Application..." : "Submit Application"}
                </button>
                
                <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                  By submitting, you agree to our Seller Terms & Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Helper Components --- */

const Benefit = ({ icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-xl">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-sm leading-none mb-1">{title}</h4>
      <p className="text-xs text-red-100">{desc}</p>
    </div>
  </div>
);

const CustomInput = ({ label, ...props }) => (
  <div>
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition font-medium placeholder:text-gray-300"
    />
  </div>
);

const CustomTextarea = ({ label, ...props }) => (
  <div>
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition font-medium placeholder:text-gray-300 resize-none"
    />
  </div>
);

export default BecomeSeller;