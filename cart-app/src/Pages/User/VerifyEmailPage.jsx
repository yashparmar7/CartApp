import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { RiCheckboxCircleFill, RiCloseCircleFill, RiLoader4Line, RiMailCheckLine } from "react-icons/ri";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;
    const verifyToken = async () => {
      try {
        await dispatch(verifyEmail(token)).unwrap();
        setVerificationStatus("success");
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/login"), 4000);
      } catch (err) {
        setVerificationStatus("error");
        const errorMessage = typeof err === "string" ? err : err?.error || err?.message || "Verification failed";
        toast.error(errorMessage);
      }
    };

    verifyToken();
  }, [token, dispatch, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Top Accent Bar */}
        <div className={`h-2 w-full ${
          verificationStatus === "success" ? "bg-emerald-500" : 
          verificationStatus === "error" ? "bg-red-500" : "bg-blue-500"
        }`} />

        <div className="p-8 md:p-12 text-center">
          {verificationStatus === "success" && (
            <div className="animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RiCheckboxCircleFill size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Verified!</h2>
              <p className="text-gray-500 mt-3 font-medium text-sm leading-relaxed">
                Thank you for verifying your email. Your account is now fully active. Redirecting you to login...
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
              >
                Go to Login Now
              </button>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RiCloseCircleFill size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Failed</h2>
              <p className="text-gray-500 mt-3 font-medium text-sm leading-relaxed">
                {typeof error === "string" ? error : "The verification link is invalid or has already been used."}
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full mt-8 bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100"
              >
                Return to Login
              </button>
            </div>
          )}

          {!verificationStatus && (
            <div className="py-4">
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin-slow">
                <RiLoader4Line size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Verifying</h2>
              <p className="text-gray-500 mt-3 font-medium text-sm">
                Validating your credentials, please wait...
              </p>
            </div>
          )}
        </div>

        {/* Brand Footer */}
        <div className="bg-gray-50 py-4 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <RiMailCheckLine className="text-red-500" /> Secure Verification by CartApp
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;