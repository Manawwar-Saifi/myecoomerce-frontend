import { showError, showSuccess } from "./Toasty";
const DeleteCategroy = async (id, navigate, queryClient) => {
  try {
    const res = await fetch(`http://localhost:8000/api/category/delete/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Delete Category failed.");

    showSuccess("Category Added successfully.");

    navigate("/admin/categories");
    queryClient.invalidateQueries({ queryKey: ["delete-category", id] });
    queryClient.invalidateQueries({ queryKey: ["all-categories"] });
  } catch (err) {
    showError(err.message);
  }
};

export default DeleteCategroy;
