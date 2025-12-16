import { useEffect, useState } from "react";
import { showSuccess, showError } from "../../utils/Toasty";

const Review = ({ pid }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/review/all/${pid}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        // adjust this depending on backend response
        setReviews(data.data?.data || data.reviews || []);
      } catch (err) {
        console.error(err);
        showError(err.message || "Error loading reviews");
      } finally {
        setLoading(false);
      }
    };

    if (pid) fetchReviews();
  }, [pid]);

  //   useEffect(() => {
  //     console.log(reviews);
  //   }, [reviews]);

  return (
    <div className="all-review py-6">
      <div className="max-w-[85%] mx-auto px-4">
        <h4 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Product Reviews
        </h4>

        {loading && (
          <div className="flex justify-center items-center h-24">
            <span className="text-gray-500 animate-pulse">
              Loading reviews...
            </span>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="flex justify-center items-center h-24">
            <span className="text-gray-400">No reviews yet.</span>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div
                key={review._id || idx}
                className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-2 border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-blue-700">
                      {review.user?.email || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <div className="text-gray-700 mb-2">
                    {review.comment || review.review || "No comment provided."}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
