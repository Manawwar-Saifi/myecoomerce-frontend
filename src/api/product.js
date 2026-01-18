import axios from "../lib/axiosInstance.js"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";

export const getAllProducts = async ({
  page = 1,
  limit = 12,
  active = true,
  keyword = "",
  category = "",
  min = "",
  max = "",
  sort = "-createdAt",
}) => {
  // Build params object, only including non-empty values
  const params = {
    page,
    limit,
  };

  // Only add parameters if they have values
  if (keyword) params.keyword = keyword;
  if (category) params.category = category;
  if (min) params.min = min;
  if (max) params.max = max;
  if (sort) params.sort = sort;

  const res = await axios.get("/product/search", {
    params,
  });

  const response = res.data?.data;

  return {
    data: response.data || [],
    pagination: response.pagination || {
      total: 0,
      page: 1,
      totalPages: 1,
    },
  };
};

// Get single product by ID (with populated category names)
export const getSingleProduct = async (id) => {
  const res = await axios.get(`/product/single/${id}`);
  return res.data.data;
};


