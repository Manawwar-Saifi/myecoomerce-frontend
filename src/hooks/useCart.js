// src/hooks/useCart.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance.js";
import { showSuccess, showError } from "../utils/Toasty.jsx";

/**
 * Add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity, userId }) => {
      const { data } = await axiosInstance.post("/cart/add", {
        productId,
        quantity,
        userId,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["cart", variables.userId]);
      // console.log("Item added to cart");
    },
    onError: (err) => {
      showError(err?.response?.data?.message || "Failed to add item to cart");
    },
  });
};

/**
 * Get cart by user ID
 */
export const useCartByUserId = (userId) => {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/cart/get/${userId}`);
      return data.data; // Make sure your backend returns { data: { ...cart } }
    },
    enabled: !!userId,
    retry: false, // don’t retry on 404
    onError: (err) => {
      showError(err?.response?.data?.message || "Failed to load cart");
    },
  });
};

/**
 * Update item quantity in cart
 */
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, productId, quantityChange }) => {
      try {
        const { data } = await axiosInstance.put(`/cart/update/${userId}`, {
          productId,
          quantityChange,
        });
        return data.data;
      } catch (err) {
        console.error("❌ Cart Update Failed:", err?.response?.data);
        throw new Error(
          err?.response?.data?.message || "Failed to update cart quantity"
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["cart", variables.userId]); // Refetch cart
      showSuccess("Cart updated");
    },
    onError: (err) => {
      showError(err.message || "Quantity update failed");
    },
  });
};

/**
 * Remove item from cart
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, userId }) => {
      const { data } = await axiosInstance.delete(`/cart/remove/${userId}`, {
        data: { productId },
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["cart", variables.userId]);
      showSuccess("Item removed from cart");
    },
    onError: (err) => {
      showError(
        err?.response?.data?.message || "Failed to remove item from cart"
      );
    },
  });
};
