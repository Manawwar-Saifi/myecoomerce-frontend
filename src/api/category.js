import axios from "@/lib/axiosInstance"; // use the configured instance

// ✅ Get all categories
export const getAllCategories = async () => {
  const res = await axios.get("/category/all");
  const categoryArray = res.data?.data?.data;
  if (!Array.isArray(categoryArray)) {
    console.error("⚠️ Invalid response structure:", res.data);
    throw new Error("Expected an array of categories.");
  }
  return categoryArray;
};
// category.js
export const getCategories = async (active) => {
  const query = active !== null ? `?active=${active}` : "";
  const res = await axios.get(`/category/all${query}`);
  return res.data?.data?.data || []; // Ensure it's always an array
};

// ✅ Get single category
export const getCategoryById = async (id) => {
  const res = await axios.get(`/category/single/${id}`);
  return res.data?.data;
};
