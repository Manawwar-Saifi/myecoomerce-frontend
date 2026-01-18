// useCategories.js
import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategoryById } from "../api/category.js";
export const useAllCategories = () =>
  useQuery({
    queryKey: ["category", "all"],
    queryFn: () => getCategories(null),
  });

export const useActiveCategories = () =>
  useQuery({
    queryKey: ["category", "active"],
    queryFn: () => getCategories(true),
  });

export const useCategory = (id) =>
  useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
