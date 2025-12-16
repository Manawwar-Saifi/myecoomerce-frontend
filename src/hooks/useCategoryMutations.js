// src/hooks/useCategoryMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/category.js";
import { showError, showSuccess } from "@/utils/Toasty";

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const onSuccess = (msg) => {
    showSuccess(msg);
    // Invalidate all relevant category queries
    queryClient.invalidateQueries({ queryKey: ["category"] });
  };

  const onError = (err) => {
    showError(err?.response?.data?.message || "Something went wrong");
  };

  const addCategory = useMutation({
    mutationFn: createCategory,
    onSuccess: () => onSuccess("Category added successfully"),
    onError,
  });

  const editCategory = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => onSuccess("Category updated successfully"),
    onError,
  });

  const removeCategory = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => onSuccess("Category deleted"),
    onError,
  });

  return { addCategory, editCategory, removeCategory };
};
