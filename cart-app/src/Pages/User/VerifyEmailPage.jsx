import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

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
        toast.success("Email verified successfully! You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setVerificationStatus("error");
        const errorMessage =
          typeof err === "string"
            ? err
            : err?.error || err?.message || "Email verification failed";
        toast.error(errorMessage);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, dispatch, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto px-5 py-20">
        <div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-8 text-center">
          {verificationStatus === "success" && (
            <>
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You can now log in to
                your account.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Go to Login
              </button>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <div className="text-red-500 text-6xl mb-4">✕</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {typeof error === "string"
                  ? error
                  : error?.error ||
                    error?.message ||
                    "The verification link is invalid or has expired."}
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Back to Login
              </button>
            </>
          )}

          {!verificationStatus && (
            <>
              <div className="text-blue-500 text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Verifying Email...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailPage;
