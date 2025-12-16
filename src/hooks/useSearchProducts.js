// hooks/useSearchProducts.js
import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axiosInstance.js";

export const getProductsByCategory = async ({
  category,
  page = 1,
  limit = 12,
}) => {
  const res = await axios.get("/product/search", {
    params: { category, page, limit },
  });
  return res.data?.data;
};

export const useSearchProducts = ({ category, page, limit }) =>
  useQuery({
    queryKey: ["search-products", category, page],
    queryFn: () => getProductsByCategory({ category, page, limit }),
    keepPreviousData: true,
    enabled: !!category,
  });
