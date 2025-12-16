import React, { useEffect, useState } from "react";
import "./OrderDetails.css";
import { useParams } from "react-router-dom";
import { showError, showSuccess } from "../../utils/Toasty";
import axios from "axios";
import Loader from "../../utils/Loader";

// Static order data (you can replace this with dynamic data later)
const order = {
  _id: "12345",
  status: "Shipped",
  paymentStatus: "Paid",
  totalAmount: 120.5,
  shippingAddress: {
    fullName: "John Doe",
    phone: "123-456-7890",
    email: "john@example.com",
    street: "123 Main St",
    city: "Springfield",
    state: "IL",
    postalCode: "62701",
    country: "USA",
  },
  billingAddress: {
    fullName: "John Doe",
    phone: "123-456-7890",
    email: "john@example.com",
    street: "123 Main St",
    city: "Springfield",
    state: "IL",
    postalCode: "62701",
    country: "USA",
  },
  items: [
    {
      product: {
        name: "Product 1",
        image: "https://via.placeholder.com/50",
        sellPrice: 50.0,
      },
      quantity: 2,
    },
    {
      product: {
        name: "Product 2",
        image: "https://via.placeholder.com/50",
        sellPrice: 20.0,
      },
      quantity: 1,
    },
  ],
  razorpay: {
    orderId: "razorpay_123",
    paymentId: "razorpay_456",
    signature: "razorpay_signature_789",
  },
  cancellation: {
    reason: "Customer changed mind",
    cancelledAt: "2025-06-21T10:30:00Z",
  },
  return: {
    status: "Returned",
    reason: "Damaged product",
    returnedAt: "2025-06-22T10:30:00Z",
  },
};

const OrderDetails = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/order/detail/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch order");

        setOrderData(data.data.data);
      } catch (error) {
        console.error(error);
        showError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;

  if (!orderData) {
    return <p>No order found</p>;
  }

  return (
    <div className="order-details">
      <h1>Order #{orderData._id}</h1>
      <div className="container">
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-6">
            <div className="order-info">
              <h3>Order Status: {orderData.status}</h3>
              <p>
                <strong>Payment Status:</strong> {orderData.paymentStatus}
              </p>
              <p>
                <strong>Total Amount:</strong> $
                {orderData.totalAmount.toFixed(2)}
              </p>

              {/* Shipping and Billing Address */}
              <div className="address">
                <h3>Shipping Address</h3>
                <p>{orderData.shippingAddress.fullName}</p>
                <p>
                  {orderData.shippingAddress.street},{" "}
                  {orderData.shippingAddress.city},{" "}
                  {orderData.shippingAddress.state},{" "}
                  {orderData.shippingAddress.country} -{" "}
                  {orderData.shippingAddress.postalCode}
                </p>
                <p>{orderData.shippingAddress.phone}</p>
              </div>

              <div className="address">
                <h3>Billing Address</h3>
                <p>{orderData.billingAddress.fullName}</p>
                <p>
                  {orderData.billingAddress.street},{" "}
                  {orderData.billingAddress.city},{" "}
                  {orderData.billingAddress.state},{" "}
                  {orderData.billingAddress.country} -{" "}
                  {orderData.billingAddress.postalCode}
                </p>
                <p>{orderData.billingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-6">
            <div className="innerDiv">
              {/* Order Items */}
              <div className="order-items">
                <h3>Items</h3>
                {orderData.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <p>
                      {item.product.name} (x{item.quantity})
                    </p>
                    <p>
                      ${(item.product.sellPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Razorpay Payment Details */}
              {orderData.razorpay && (
                <div className="payment-info">
                  <h3>Payment Details</h3>
                  <p>
                    <strong>Razorpay Order ID:</strong>{" "}
                    {orderData.razorpay.orderId}
                  </p>
                  <p>
                    <strong>Razorpay Payment ID:</strong>{" "}
                    {orderData.razorpay.paymentId}
                  </p>
                  <p>
                    <strong>Signature:</strong> {orderData.razorpay.signature}
                  </p>
                </div>
              )}

              {/* Cancellation or Return Information */}
              {orderData.cancellation && (
                <div className="cancellation-info">
                  <h3>Cancellation</h3>
                  <p>
                    <strong>Reason:</strong> {orderData.cancellation.reason}
                  </p>
                  <p>
                    <strong>Cancelled At:</strong>{" "}
                    {new Date(
                      orderData.cancellation.cancelledAt
                    ).toLocaleString()}
                  </p>
                </div>
              )}

              {orderData.return &&
                orderData.return.status === "Returned" && (
                  <div className="return-info">
                    <h3>Return</h3>
                    <p>
                      <strong>Reason:</strong> {orderData.return.reason}
                    </p>
                    <p>
                      <strong>Returned At:</strong>{" "}
                      {new Date(
                        orderData.return.returnedAt
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default OrderDetails;
