import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartByUserId } from "../../hooks/useCart.js";
import { useAuth } from "../../contexts/AuthContext";
import { showSuccess, showError, showInfo } from "../../utils/Toasty.jsx";
import Loader from "../../utils/Loader.jsx";
import placholder from "../../../public/300x200.svg";
import { useCreateCODOrder } from "../../hooks/useOrder.js";
import axios from "axios";

const Checkout = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
    fullName: user?.fullName || "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IND",
    paymentMethod: "cod",
  });

  const { data: cart, isLoading, isError, error } = useCartByUserId(user?.id);

  const subtotal = useMemo(() => {
    return (
      cart?.data?.items?.reduce(
        (acc, item) => acc + item.quantity * item.product.sellPrice,
        0
      ) || 0
    );
  }, [cart]);

  const shippingCost = 59;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (isError) {
      showError(error?.response?.data?.message || "Error fetching cart.");
      navigate(`/cart/${user?.id}`);
    }
  }, [isError, error, navigate]);

  useEffect(() => {
    if (!user?.id || userId !== user?.id) {
      showError("Unauthorized access");
      navigate(`/cart/${user?.id}`);
    }
  }, [userId, user?.id, navigate]);

  if (isLoading) return <Loader />;
  if (!cart) return null;
  useEffect(() => {
    if (!isLoading && cart && !cart?.data?.items?.length) {
      showInfo("Your cart is empty. Add items to proceed to checkout.");
      navigate(`/cart/${user?.id}`);
    }
  }, [cart, isLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: method,
    }));
  };

  const isFormValid = () => {
    const requiredFields = [
      "email",
      "phone",
      "fullName",
      "street",
      "city",
      "state",
      "postalCode",
      "country",
    ];
    return requiredFields.every((field) => formData[field].trim() !== "");
  };

  const { mutate: createOrder } = useCreateCODOrder();

  const handleCODSubmit = () => {
    if (!isFormValid()) {
      showError("Please fill in all required fields");
      return;
    }

    const orderData = {
      userId,
      shippingAddress: { ...formData },
      billingAddress: { ...formData },
      paymentMode: "COD",
    };

    createOrder(orderData, {
      onSuccess: () => {
        showSuccess("Order placed successfully!");
        // navigate(`/orders/${user?.id}`);
      },
      onError: (err) => {
        showError(err?.response?.data?.message || "Failed to create order.");
      },
    });
  };

  const handleRazorpayPayment = async () => {
    if (!isFormValid()) {
      showError("Please fill in all required fields");
      return;
    }

    const initialOrderData = {
      userId,
      shippingAddress: { ...formData },
      billingAddress: { ...formData },
      paymentMode: "Online",
    };

    let orderIdFromBackend = null;
    let razorpayOrderId = null;
    let amountFromBackend = null;

    try {
      // Step 1: Create the order in backend
      const response = await fetch(
        `http://localhost:8000/api/order/create/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(initialOrderData),
        }
      );
      console.log(await response, "first 111");

      const { order, razorpayOrder } = response.data;
      orderIdFromBackend = order._id;
      razorpayOrderId = razorpayOrder.id;
      amountFromBackend = razorpayOrder.amount;

      showSuccess("Order created. Opening Razorpay...");
    } catch (err) {
      console.error("❌ Order creation failed:", err);
      showError(
        err?.response?.data?.message ||
          "Failed to initiate order. Please try again."
      );
      return;
    }

    // Step 2: Open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_pbs5vJEjLZaBVr",
      amount: amountFromBackend, // amount in paise from backend
      currency: "INR",
      name: "MANAWWAR SAIFI",
      description: `Payment for Order #${orderIdFromBackend}`,
      image: "https://your-ecommerce-site.com/logo.png",
      order_id: razorpayOrderId, // ID from Razorpay backend
      handler: async function (response) {
        try {
          const verifyRes = await fetch(
            `http://localhost:8000/api/order/payment/verify`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderIdFromBackend,
                userId,
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            showSuccess("Payment verified! Order placed.");
            navigate(`/`);
          } else {
            showError(`Payment verification failed: ${verifyData.message}`);
          }
        } catch (err) {
          console.error("❌ Verification error:", err);
          showError("Error during payment verification.");
        }
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.postalCode}`,
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-1 font-inter checkoutPageMainDiv">
      <div className="max-w-8xl w-full bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10 lg:p-16 bg-red-300 checkoutHeadingDiv">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contact & Shipping */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="p-6 rounded-lg shadow-inner p-4 contactInfo">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Contact Information
              </h2>

              {/* ----------------------------------------------------------------------------------------------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner p-4 my-3 shippingAddress">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Street
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pin Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="400001"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    <option value="IND">India</option>
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                    <option value="GBR">United Kingdom</option>
                    <option value="AUS">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------------------------------------------------------- */}

            {/* Payment Method Selection */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner p-4 my-3 paymentMethod">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="cod"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Cash on Delivery (COD)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="online"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Pay Now (Online Payment)
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Information - Only show if online payment is selected */}
            {formData.paymentMethod === "online" && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner p-4 my-3 paymentInfo">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Payment Information
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        You will be redirected to Razorpay for secure payment
                        processing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-inner flex flex-col checkoutRightColumn">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Order Summary
            </h2>
            <div className="space-y-4">
              {cart?.data?.items?.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-start lg:gap-8 gap-4 justify-between rowOneItem"
                >
                  <img
                    src={item.product.image || placholder}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <p className="text-gray-800 productName">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800 px-1">
                    ₹{(item.product.sellPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-4 mt-6 space-y-2 subTotalDiv">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-300 pt-3 mt-3">
                <span>Order Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Conditional Buttons based on payment method */}
            {formData.paymentMethod === "COD" ? (
              <button
                type="button"
                onClick={handleCODSubmit}
                className="placeOrderCheckout mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 rounded-1"
              >
                Place Order (COD)
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleRazorpayPayment}
                className="placeOrderCheckout mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Pay Now - ₹{total.toFixed(2)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
