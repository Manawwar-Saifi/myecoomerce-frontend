import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance.js";
import { showSuccess, showError } from "../utils/Toasty.jsx";

export const useCreateCODOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      shippingAddress,
      billingAddress,
      paymentMode,
    }) => {
      const res = await axiosInstance.post(`/order/create/${userId}`, {
        shippingAddress,
        billingAddress,
        paymentMode,
      });

      if (!res?.data?.success) {
        throw new Error(res?.data?.message || "Order failed");
      }

      return res.data.data; // { order, razorpayOrder }
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["cart", variables.userId]);

      showSuccess("Order placed successfully");

      // You can redirect or handle the result here
      // Example: navigate(`/orders/${data.order._id}`);
    },

    onError: (err) => {
      showError(
        err?.response?.data?.message || err.message || "Failed to place order"
      );
    },
  });
};
