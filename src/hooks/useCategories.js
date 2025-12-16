// useCategories.js
import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategoryById } from "../api/category.js";
export const useAllCategories = () =>
  useQuery({
    queryKey: ["category", "all"],
    queryFn: () => getCategories(null), // all categories
    staleTime: 5 * 60 * 1000,
  });

export const useActiveCategories = () =>
  useQuery({
    queryKey: ["category", "active"],
    queryFn: () => getCategories(true), // only active ones
    staleTime: 5 * 60 * 1000,
  });

export const useCategory = (id) =>
  useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
