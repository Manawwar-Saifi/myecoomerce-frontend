import React, { useEffect, useState, useMemo } from "react";
import {
  useCartByUserId,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "../../hooks/useCart.js";
import { useAuth } from "../../contexts/AuthContext";
import { showSuccess, showError } from "../../utils/Toasty.jsx";
import Loader from "../../utils/Loader.jsx";
import placholder from "../../../public/300x200.svg";
import { NavLink, useNavigate } from "react-router-dom";

const Cart = () => {
  const [total, setTotal] = useState(0);
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  // ✅ Hooks should be declared first
  const {
    data: cart,
    isLoading,
    isError,
    error,
    isPending,
  } = useCartByUserId(userId);
  const { mutateAsync: updateCartQuantity } = useUpdateCartQuantity();
  const { mutateAsync: removeFromCart } = useRemoveFromCart();

  // ✅ Subtotal calculation
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

  // ✅ Return loader after hooks
  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <div className="text-center text-red-500 py-5">
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
      // showSuccess("Quantity updated");
    } catch (err) {
      console.error("Update failed:", err?.response?.data);
      showError(err?.response?.data?.message || "Failed to update");
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!userId || !productId) {
      showError("Invalid request. Missing userId or productId.");
      return;
    }

    try {
      await removeFromCart({ userId, productId });
    } catch (err) {
      console.error("Remove failed:", err?.response?.data);
      showError(err?.response?.data?.message || "Failed to remove item");
    }
  };

  // const handleCheckout = () => {
  //   if (!cart?.data?.items?.length) {
  //     showError("Your cart is empty. Add items to proceed to checkout.");
  //     return;
  //   }

  //   // Navigate to checkout page
  //   navigate(`/checkout/${userId}`);
  // };

  const handleContinueShopping = () => {
    navigate("/products");
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
                  <div className="text-center py-5">
                    <p className="text-gray-600 mb-4">Your cart is empty.</p>
                    <button
                      onClick={handleContinueShopping}
                      className="btn btn-primary px-4 py-2"
                    >
                      Continue Shopping
                    </button>
                  </div>
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
                            <button
                              onClick={() => handleRemoveItem(item.product._id)}
                              disabled={isPending}
                            >
                              X
                            </button>
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
          {cart?.data?.items?.length === 0 ? (
            ""
          ) : (
            <>
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

                  {/* Checkout Button Section */}
                  <div className="checkoutSection mt-4">
                    <NavLink
                      to={`/checkout/${userId}`}
                      disabled={!cart?.data?.items?.length || isPending}
                      className="btn btn-outline-primary w-100 py-2 mb-3"
                    >
                      {isPending ? "Processing..." : "Proceed to Checkout"}
                    </NavLink>

                    <button
                      onClick={handleContinueShopping}
                      className="btn btn-primary w-100 py-2"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cart;
