import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import AdminTable from "../../components/admin-components/components/Table";
import proudimg from "../../assets/2149635272.webp";
import { useState, useEffect } from "react";

const Reviews = () => {
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch("http://localhost:8000/api/review/all-admin");
        const data = await res.json();

        // Convert `_id` to `id` and keep `visible` as boolean for toggling
        const formattedData = data.data.data.map((item) => ({
          id: item._id,
          productname: item.product?.name || "N/A",
          user: item.user?.name || "Unknown",
          rating: item.rating,
          comment: item.comment,
          // Keep raw boolean for toggle
          visible: Boolean(item.visible),
          // Derive human-readable status string for table display
          status: Boolean(item.visible) ? "visible" : "hidden",
        }));

        setReviewData(formattedData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleToggle = async (id) => {
    // Find the current review
    const currentReview = reviewData.find((review) => review.id === id);
    if (!currentReview) return;

    const newVisible = !currentReview.visible;

    try {
      // Call your API to update the review visibility
      const response = await fetch(
        `http://localhost:8000/api/review/visible/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ show: newVisible }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update review visibility");
      }

      // Update local state
      const updatedReviews = reviewData.map((review) =>
        review.id === id ? { ...review, visible: newVisible } : review
      );
      setReviewData(updatedReviews);
    } catch (error) {
      console.error("Failed to update review visibility:", error);
      // Optionally show error message to user
    }
  };

  const handleDelete = async (id) => {
    try {
      // Call your API to delete the review
      await fetch(`http://localhost:8000/api/review/delete/${id}`, {
        method: "DELETE",
      });

      // Update local state after successful deletion
      const updatedReviews = reviewData.filter((review) => review.id !== id);
      setReviewData(updatedReviews);
    } catch (error) {
      console.error("Failed to delete review:", error);
      // Optionally, show an error message to the user here
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "productname", headerName: "Product Name", width: 150 },
    { field: "user", headerName: "User", width: 200 },
    { field: "rating", headerName: "Rating", width: 100 },
    {
      field: "comment",
      headerName: "Comment",
      type: "string",
      width: 130,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      sortable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          {/* Edit Button */}
          <Link to={`/admin/review-detail/${params.row.id}`}>
            <Button variant="outline" size="sm" className="text-xs px-2">
              <EditIcon fontSize="small" />
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="text-xs px-2"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </div>
      ),
    },
    {
      field: "toggleVisibility",
      headerName: "Visibility",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Switch
          checked={Boolean(params?.row?.visible)}
          onChange={() => handleToggle(params.row.id)}
          color="primary"
        />
      ),
    },
  ];

  return (
    <div className="adminMainProductPage">
      <section className="section1 shadow-md rounded-md py-2">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h4>All Reviews</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="section2 mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 p-0">
              <AdminTable rows={reviewData} columns={columns} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
