import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axiosInstance";
import { showError, showSuccess } from "@/utils/Toasty";
import { useEffect, useState } from "react";
import { Select, MenuItem, FormControl } from "@mui/material";
import { Button } from "../../components/ui/button";
import AdminTable from "../../components/admin-components/components/Table";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const Orders = () => {
  const [productData, setProductData] = useState([]);

  // ✅ Two states
  const [paymentStatus, setPaymentStatus] = useState({});
  const [deliveryStatus, setDeliveryStatus] = useState({});

  const queryClient = useQueryClient();

  // ✅ Fetch all orders
  const { data: orderData } = useQuery({
    queryKey: ["all-orders"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/order/all/?page=1&limit=50`
      );
      return res.data.data.data.orders;
    },
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (orderData) {
      setProductData(
        orderData.map((order) => ({
          id: order._id,
          name: order.user?.name || "Unknown",
          product: order.items?.map((i) => i.product?.name).join(", ") || "N/A",
          email: order.user?.email || "N/A",
          phone: order.shippingAddress?.phone || "N/A",
          Totalprice: order.totalAmount || 0,
          address:
            order.shippingAddress?.city +
              " " +
              order.shippingAddress?.state +
              " " +
              order.shippingAddress?.postalCode || "N/A",
          quantity: order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
          paymentStatus: order.paymentStatus || "Pending",
          deliveryStatus: order.status || "Pending",
        }))
      );

      // initialize states
      const initPayment = {};
      const initDelivery = {};
      orderData.forEach((order) => {
        initPayment[order._id] = order.paymentStatus || "Pending";
        initDelivery[order._id] = order.status || "Pending";
      });
      setPaymentStatus(initPayment);
      setDeliveryStatus(initDelivery);
    }
  }, [orderData]);

  // ✅ Handle Payment Update
  const handlePaymentUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/order/update-payment-status/${id}`,
        { paymentStatus: paymentStatus[id] }
      );
      showSuccess("Payment status updated successfully");
      queryClient.invalidateQueries(["all-orders"]);
    } catch (err) {
      showError(err.response?.data?.message || "Payment update failed");
    }
  };

  // ✅ Handle Delivery Update
  const handleDeliveryUpdate = async (id) => {
    try {
      console.log("Sending Delivery Update:", { status: deliveryStatus[id] });
      await axios.put(
        `http://localhost:8000/api/order/update-delivery-status/${id}`,
        { status: deliveryStatus[id] }
      );
      showSuccess("Delivery status updated successfully");
      queryClient.invalidateQueries(["all-orders"]);
    } catch (err) {
      showError(err.response?.data?.message || "Delivery update failed");
    }
  };

  // Example: Test function for delivery/payment update endpoint
  // NOTE: This is a placeholder/test function. You may want to pass an order ID as argument.
  const handleTestingDelviveryPayment = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/order/update-payment-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: "Paid", // or any status you want to test
          }),
        }
      );
      console.log(res,"respoinse22")
      const data = await res.json();
      console.log(data,"respoinse11")
      if (res.ok) {
        showSuccess(data.message || "Test: Payment status updated");
      } else {
        showError(data.message || "Test: Payment update failed");
      }
    } catch (err) {
      showError("Test: Payment update failed");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "User Name", width: 100 },
    { field: "product", headerName: "Product", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Phone", width: 120 },
    {
      field: "Totalprice",
      headerName: "Total Price ₹",
      type: "number",
      width: 80,
    },
    { field: "address", headerName: "Shipping Address", width: 180 },
    { field: "quantity", headerName: "Quantity", type: "number", width: 80 },

    // ✅ Payment Status
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 180,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <FormControl fullWidth>
            <Select
              value={paymentStatus[params.row.id] || "Pending"}
              onChange={(e) =>
                setPaymentStatus((prev) => ({
                  ...prev,
                  [params.row.id]: e.target.value,
                }))
              }
              sx={{ fontSize: "14px" }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
              <MenuItem value="Refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
          <Button size="sm" onClick={() => handlePaymentUpdate(params.row.id)}>
            Save
          </Button>
        </div>
      ),
    },

    // ✅ Delivery Status
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <FormControl fullWidth>
            <Select
              value={deliveryStatus[params.row.id] || "Pending"}
              onChange={(e) =>
                setDeliveryStatus((prev) => ({
                  ...prev,
                  [params.row.id]: e.target.value,
                }))
              }
              sx={{ fontSize: "14px" }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button size="sm" onClick={() => handleDeliveryUpdate(params.row.id)}>
            Save
          </Button>
        </div>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Link to={`/admin/order/single/${params.row.id}`}>
          <Button variant="outline" size="sm" className="text-xs px-2">
            <EditIcon fontSize="small" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="adminMainProductPage">
      <section className="section1 shadow-md rounded-md py-2">
        <h4>All Orders</h4>
      </section>

      <section className="section2 mt-4 orderTableSection">
        <AdminTable rows={productData} columns={columns} />
      </section>
    </div>
  );
};

export default Orders;
