import axios from "../lib/axiosInstance.js"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";

export const getAllProducts = async ({
  page = 1,
  limit = 12,
  active = true,
}) => {
  const res = await axios.get("/product/all", {
    params: { page, limit, active },
  });

  const response = res.data?.data;

  if (!Array.isArray(response?.data)) {
    throw new Error("Invalid product response format");
  }

  return response;
};

// Get single product by ID (with populated category names)
export const getSingleProduct = async (id) => {
  const res = await axios.get(`/product/single/${id}`);
  return res.data.data;
};


