import { useState } from "react";
import { showError, showSuccess,showInfo } from "../../utils/Toasty";

const AddReview = ({ pid }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/review/add/${pid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, review }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess("Review added successfully!");
        setRating(0);
        setReview("");
      } else {
        showInfo(data.message || "Failed to add review.");
      }
    } catch (err) {
      showError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-review-component max-w-[80%] mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Add Your Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
            required
          >
            <option value="">Select rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border rounded px-2 py-1"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        {/* {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>} */}
      </form>
    </div>
  );
};

export default AddReview;
