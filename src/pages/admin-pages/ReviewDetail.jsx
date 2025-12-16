import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../utils/Loader";

const ReviewDetail = () => {
  const [reviewData, setReviewData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    (async function fetchReview() {
      try {
        const res = await fetch(
          `http://localhost:8000/api/review/single/${id}`
        );
        const data = await res.json();
        console.log("Fetched Review:", data.data);
        setReviewData(data.data.data);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    })();
  }, [id]);

  if (!reviewData) return <Loader />;

  return (
    <div className="p-4 shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-2">Review Detail</h2>
      <p>
        <strong>Product:</strong> {reviewData.product?.name}
      </p>
      <p>
        <strong>User:</strong> {reviewData.user?.name} ({reviewData.user?.email}
        )
      </p>
      <p>
        <strong>Rating:</strong> {reviewData.rating} ⭐
      </p>
      <p>
        <strong>Comment:</strong> {reviewData.comment}
      </p>
      <p>
        <strong>Visible:</strong> {reviewData.visible ? "Yes" : "No"}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(reviewData.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default ReviewDetail;
