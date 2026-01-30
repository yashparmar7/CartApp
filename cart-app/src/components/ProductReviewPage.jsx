import React, { useEffect, useMemo, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import {
  RiChatQuoteFill,
  RiEditCircleFill,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviews,
  addReview,
  resetReviewState,
} from "../features/review/reviewSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProductReviewPage = () => {
  const dispatch = useDispatch();
  const { id: productId } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const {
    reviews = [],
    loading = false,
    success = false,
    error = null,
  } = useSelector((state) => state.review || {});

  // ===================== FETCH REVIEWS =====================
  useEffect(() => {
    if (productId) {
      dispatch(fetchReviews(productId));
    }
  }, [dispatch, productId]);

  // ===================== SUCCESS / ERROR =====================
  useEffect(() => {
    if (success) {
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      dispatch(fetchReviews(productId));
      dispatch(resetReviewState());
    }

    if (error) {
      toast.error(error);
      dispatch(resetReviewState());
    }
  }, [success, error, dispatch, productId]);

  // ===================== AVERAGE RATING =====================
  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // ===================== RATING DISTRIBUTION =====================
  const ratingStats = useMemo(() => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => stats[r.rating]++);
    return stats;
  }, [reviews]);

  const totalReviews = reviews.length;

  // ===================== SUBMIT REVIEW =====================
  const submitReviewHandler = () => {
    if (!rating) {
      toast.error("Please select rating");
      return;
    }

    dispatch(
      addReview({
        productId,
        reviewData: { rating, comment },
      }),
    );
  };

  return (
    <section className="mt-10 border-t border-gray-200 pt-12 max-w-7xl mx-auto">
      {/* ===================== SECTION HEADER ===================== */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
          <RiChatQuoteFill size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">
            Product <span className="text-red-500"> Reviews</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mt-2">
            Verified Audit & Feedback
          </p>
        </div>
      </div>

      {/* ===================== RATING OVERVIEW ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-gray-200">
          <FaStar className="absolute -right-4 -bottom-4 text-white/5 text-[10rem]" />
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-4">
            Average Rating
          </p>
          <p className="text-7xl font-bold">{averageRating}</p>

          <div className="flex gap-1 mt-4 text-yellow-400 text-xl">
            {[...Array(5)].map((_, i) =>
              i < Math.round(averageRating) ? (
                <FaStar key={i} />
              ) : (
                <FaStar key={i} className="opacity-30" />
              ),
            )}
          </div>

          <p className="text-[10px] font-semibold text-gray-500 mt-6 tracking-widest">
            Pulse: {totalReviews} Reviews
          </p>
        </div>

        <div className="md:col-span-2 bg-white rounded-[2.5rem]  p-8 space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-6 border-b pb-4">
            Rating Distribution
          </h3>

          {[5, 4, 3, 2, 1].map((star) => {
            const percent = totalReviews
              ? Math.round((ratingStats[star] / totalReviews) * 100)
              : 0;

            return (
              <div key={star} className="flex items-center gap-4">
                <span className="text-xs font-bold w-8">{star} ★</span>

                <div className="flex-1 bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className={`h-full ${
                      star >= 4
                        ? "bg-emerald-500"
                        : star === 3
                          ? "bg-amber-400"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="text-[10px] font-semibold text-gray-400">
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== FEEDBACK SUBMISSION ===================== */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 mb-12 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <RiEditCircleFill className="text-red-500 text-2xl" />
          <h3 className="text-sm font-bold">Post Your Experience</h3>
        </div>

        <div className="flex gap-3 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)}>
              <FaStar
                size={32}
                className={star <= rating ? "text-yellow-400" : "text-gray-200"}
              />
            </button>
          ))}
        </div>

        <textarea
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
          className="w-full px-6 py-5 rounded-3xl border border-gray-100 bg-gray-50 font-medium text-sm text-gray-400 outline-none  resize-none"
        />

        <div className="mt-5 flex justify-end">
          <button
            onClick={submitReviewHandler}
            disabled={loading}
            className="px-10 py-4 bg-red-500 text-white rounded-2xl font-bold text-[10px]  tracking-widest  border border-gray-200"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>

      {/* ===================== TESTIMONIAL FEED ===================== */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] ml-2">
          Customer Reviews
        </h3>

        {reviews.slice(0, visibleCount).map((rev) => (
          <div
            key={rev._id}
            className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex justify-between mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center font-bold text-red-500">
                  {rev.user?.userName?.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{rev.user?.userName}</p>
                    <RiCheckboxCircleFill className="text-emerald-500" />
                  </div>

                  <div className="flex text-yellow-400 text-[10px] mt-1">
                    {[...Array(5)].map((_, i) =>
                      i < rev.rating ? (
                        <FaStar key={i} />
                      ) : (
                        <FaRegStar key={i} className="text-gray-200" />
                      ),
                    )}
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-gray-400">
                {new Date(rev.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-600 text-sm border-l-4 pl-6">
              "{rev.comment}"
            </p>
          </div>
        ))}
        {reviews.length > visibleCount && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="px-8 py-3 border border-red-500 text-red-500 rounded-full text-sm font-bold hover:bg-red-50 transition"
            >
              Show more reviews
            </button>
          </div>
        )}
        {visibleCount >= reviews.length && reviews.length > 3 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setVisibleCount(3)}
              className="px-8 py-3 border border-red-500 text-red-500 rounded-full text-sm font-bold hover:bg-red-50 transition"
            >
              Show less
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviewPage;
