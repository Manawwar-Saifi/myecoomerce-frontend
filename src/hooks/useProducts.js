import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getSingleProduct } from "../api/product.js";

import axiosInstance from "../lib/axiosInstance.js";
export const useProducts = ({ page = 1, limit = 12, active = true }) => {
  return useQuery({
    queryKey: ["products", page, limit, active],
    queryFn: () => getAllProducts({ page, limit, active }),
    staleTime: 1000 * 60 * 60, // ✅ 1 hour (change as needed)
    cacheTime: 1000 * 60 * 60 * 2, // ✅ Cache for 2 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false, // ✅ Prevent refetch on reload
  });
};

export const useSingleProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getSingleProduct(id),
    enabled: !!id, // prevents query from running if id is undefined
  });
};

// -------------------------------------------------------------------------------------------------------------

export const fetchAllProducts = async () => {
  const res = await axiosInstance.get("/product/all");
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await res.json();
  return data?.data?.data.map((item) => ({
    ...item,
    id: item._id, // MUI/DataGrid expects an `id` field
  }));
};
export const getSingleProductAdmin = async (id) => {
  try {
    const res = await axiosInstance.get(`/product/single/${id}`);
    console.log(res);
    return {
      ...res.data.data,
      id: res.data.data._id, // For DataGrid or other ID-based logic
    };
  } catch (error) {
    throw new Error("Failed to fetch product: " + error.message);
  }
};
