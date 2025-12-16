// const handleAddToCart = async (id) => {
//   if (!user?.id) {
//     showError("Please log in to add items to your cart");
//     return;
//   }

//   try {
//     const payload = {
//       productId: id,
//       quantity: 1,
//       userId: user.id,
//     };

//     await addToCart(payload);
//     showSuccess("Product added to cart! 🎉");
//   } catch (error) {
//     console.error("Add to cart error:", error);
//     showError(error?.response?.data?.message || "Failed to add to cart");
//   }
// };

import { showError, showSuccess } from "./Toasty";

export const handleAddToCart = async ({
  productId,
  userId,
  quantity = 1,
  addToCartMutation,
}) => {
  if (!userId) {
    showError("Please log in to add items to your cart");
    return null;
  }

  try {
    const payload = { productId, quantity, userId };
    await addToCartMutation(payload);
    showSuccess("Product added to cart! 🎉");
  } catch (error) {
    console.error("Add to cart error:", error);
    showError("Failed to add to cart");
  }
};
