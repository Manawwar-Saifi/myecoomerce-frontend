import React, { useEffect, useState, useMemo } from "react";
import { useCartByUserId, useUpdateCartQuantity } from "../../hooks/useCart.js";
import { useAuth } from "../../contexts/AuthContext";
import { showSuccess, showError } from "../../utils/Toasty.jsx";
import Loader from "../../utils/Loader.jsx";
import placholder from "../../../public/300x200.svg";

const Cart = () => {
  const [total, setTotal] = useState(0);
  const { user } = useAuth();
  const userId = user?.id;
  console.log(userId);
  // ✅ Always declare hooks, even if userId is not available
  const cartQuery = useCartByUserId(userId);
  const { mutateAsync: updateCartQuantity } = useUpdateCartQuantity();

  // ✅ Handle loading/error early but only after all hooks
  if (!userId) {
    return (
      <div className="text-center text-red-500 py-10">
        Please log in to view your cart.
      </div>
    );
  }

  const { data: cart, isLoading, isError, error, isPending } = cartQuery;

  const subtotal = useMemo(() => {
    return (
      cart?.data?.items?.reduce(
        (acc, item) => acc + item.quantity * item.product.sellPrice,
        0
      ) || 0
    );
  }, [cart]);

  useEffect(() => {
    setTotal(subtotal);
  }, [subtotal]);

  useEffect(() => {
    if (isError) {
      showError(error?.response?.data?.message || "Error fetching cart.");
    }
  }, [isError, error]);

  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Something went wrong while loading the cart.
      </div>
    );
  }

  const handleQuantityChange = async (productId, type) => {
    const quantityChange = type === "inc" ? 1 : -1;

    if (!userId || !productId || typeof quantityChange !== "number") {
      showError("Invalid request. Missing userId or productId.");
      return;
    }

    try {
      await updateCartQuantity({ userId, productId, quantityChange });
      showSuccess("Quantity updated");
    } catch (err) {
      console.error("Update failed:", err?.response?.data);
      showError(err?.response?.data?.message || "Failed to update");
    }
  };

  return (
    <section className="mainCartDiv">
      <div className="container">
        <div className="row">
          {/* Left: Cart Items */}
          <div className="col-lg-8">
            <div className="innerDiv">
              <div className="ulDiv">
                {cart?.data?.items?.length === 0 ? (
                  <p className="text-gray-600">Your cart is empty.</p>
                ) : (
                  <ul>
                    <li className="headerLi row">
                      <h6 className="col-lg-4">Product</h6>
                      <h6 className="col-lg-1">Price</h6>
                      <h6 className="col-lg-2 text-end">Quantity</h6>
                      <h6 className="col-lg-4 text-center">Total</h6>
                    </li>
                    {cart?.data?.items.map((item, index) => (
                      <div key={index + 1}>
                        <li
                          className="row bodyLi align-items-center"
                          key={item.product._id}
                        >
                          <div className="col-lg-4 col-sm-12">
                            <div className="details row align-items-center justify-center">
                              <div className="col-lg-5 col-sm-12">
                                <img
                                  src={item.product.image || placholder}
                                  alt={item.product.name}
                                />
                              </div>
                              <div className="col-lg-7 col-sm-12">
                                <p className="text-start">
                                  {item.product.name}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="col-lg-1 text-start col-sm-12 price">
                            ₹{item.product.sellPrice}
                          </p>
                          <div className="cartQuantityDiv col-lg-2 col-sm-12">
                            <button
                              className="rounded-0"
                              onClick={() =>
                                handleQuantityChange(item.product._id, "dec")
                              }
                              disabled={isPending}
                            >
                              -
                            </button>
                            <input type="text" value={item.quantity} readOnly />
                            <button
                              className="rounded-0"
                              onClick={() =>
                                handleQuantityChange(item.product._id, "inc")
                              }
                              disabled={isPending}
                            >
                              +
                            </button>
                          </div>
                          <p className="total col-lg-3 text-center col-sm-12 totalPrice">
                            ₹{item.product.sellPrice * item.quantity}
                          </p>
                          <div className="col-lg-1 cartRemoveBtn col-sm-12">
                            <button>X</button>
                          </div>
                        </li>
                        <hr />
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="col-lg-4 totalDetailRight">
            <div className="innerDiv">
              <h4 className="cartSubtotal">
                <span>Subtotal:</span>
                <span>₹{total}</span>
              </h4>
              <h5>
                <span>Shipping</span>
                <span>₹59</span>
              </h5>
              <hr />
              <h4>
                <span>Total</span>
                <span>₹{total + 59}</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
