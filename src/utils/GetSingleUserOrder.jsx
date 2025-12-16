import React, { useEffect, useState } from "react";

const GetSingleUserOrder = ({ id }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/api/order/user-order/${id}`
        );
        const data = await res.json();
        
        // Debug: Log the entire response to see the structure
        console.log("Full API Response:", data);
        
        // Handle different possible response structures
        let orderData = [];
        if (data.data && Array.isArray(data.data)) {
          orderData = data.data;
        } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
          orderData = data.data.data;
        } else if (Array.isArray(data)) {
          orderData = data;
        } else if (data.orders && Array.isArray(data.orders)) {
          orderData = data.orders;
        } else if (data.result && Array.isArray(data.result)) {
          orderData = data.result;
        }
        
        console.log("Processed order data:", orderData);
        setOrders(orderData);
        
      } catch (error) {
        console.error("Failed to fetch user order:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-gray-500 text-center py-4">
        Loading orders...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No orders found for this user.
        <div className="text-xs text-gray-400 mt-2">
          Debug: orders array length is {orders ? orders.length : 'undefined'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                Order ID: <span className="font-mono">{order._id}</span>
              </h3>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status || "N/A"}
                </span>
              </p>
              {order.createdAt && (
                <p className="text-xs text-gray-400">
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="mt-2 md:mt-0">
              <span className="text-lg font-bold text-gray-900">
                Total: $
                {order.items && Array.isArray(order.items)
                  ? order.items
                      .reduce(
                        (sum, item) =>
                          sum +
                          (item.price
                            ? item.price * (item.quantity || 1)
                            : 0),
                        0
                      )
                      .toFixed(2)
                  : "0.00"}
              </span>
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Shipping Address:</span>
            <div className="text-sm text-gray-600 ml-2">
              {order.shippingAddress
                ? (
                    <>
                      <div>
                        {order.shippingAddress.street}, {order.shippingAddress.city}
                      </div>
                      <div>
                        {order.shippingAddress.state} {order.shippingAddress.zip}
                      </div>
                      <div>{order.shippingAddress.country}</div>
                    </>
                  )
                : "N/A"}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Items:</span>
            <ul className="divide-y divide-gray-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <li key={idx} className="flex items-center py-2">
                    {item.product && item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded mr-3 border"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-800">
                        {item.product && item.product.name
                          ? item.product.name
                          : item.name || "Product"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: {item.quantity || 1} &nbsp;|&nbsp; $
                        {item.price ? item.price.toFixed(2) : "0.00"}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm py-2">No items</li>
              )}
            </ul>
          </div>
          {/* Show cancellation/return info if present */}
          {(order.cancellation || order.return) && (
            <div className="mt-2">
              {order.cancellation && order.cancellation.status && (
                <div className="text-xs text-red-600">
                  Cancelled: {order.cancellation.status}
                  {order.cancellation.reason && (
                    <span className="ml-2 text-gray-500">
                      (Reason: {order.cancellation.reason})
                    </span>
                  )}
                </div>
              )}
              {order.return && order.return.status && (
                <div className="text-xs text-yellow-700">
                  Returned: {order.return.status}
                  {order.return.reason && (
                    <span className="ml-2 text-gray-500">
                      (Reason: {order.return.reason})
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GetSingleUserOrder;
