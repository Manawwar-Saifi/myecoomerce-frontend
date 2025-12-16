import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleUserReview = ({id}) => {
  const [userReviews, setUserReviews] = useState([]);
  useEffect(() => {
    const fetchReview = async () => {
      const res = await fetch(
        `http://localhost:8000/api/review/review-by-user/${id}`
      );
      const data = await res.json();
      console.log(data.data.data);
    };
    fetchReview();
  }, [id]);
  // Show the fetched data (grouped by product) in a nice Tailwind design


 

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">My Product Reviews</h3>
      {userReviews.length === 0 ? (
        <div className="text-gray-500">You haven't reviewed any products yet.</div>
      ) : (
        <div className="space-y-6">
          {userReviews.map((product) => (
            <div
              key={product.productId || product._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="mb-2">
                <span className="font-semibold text-lg text-gray-900">{product.productName}</span>
              </div>
              <div className="space-y-2">
                {product.reviews.map((review, idx) => (
                  <div key={review.reviewId || idx} className="bg-gray-50 rounded-md p-3">
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-500 mr-2">
                        {/* Render stars */}
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 inline"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        ))}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <div className="text-gray-700">{review.comment}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleUserReview;
