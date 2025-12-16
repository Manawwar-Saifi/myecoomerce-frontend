import React, { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useParams } from "react-router-dom";

// Dummy Data for User Information
const dummyUserData = {
  id: "user-001",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, CA 90210, USA",
  memberSince: "2022-03-15",
  lastLogin: "2024-06-21T14:30:00Z",
  accountStatus: "Active",
  userType: "Customer",
};

// Dummy Data for Order History
const dummyOrderHistory = [
  {
    orderId: "ORD-2024-54321",
    date: "2024-06-19",
    total: 129.99,
    status: "Delivered",
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 79.99 },
      { name: "Smartphone Case", quantity: 1, price: 25.0 },
      { name: "Screen Protector", quantity: 2, price: 12.5 },
    ],
  },
  {
    orderId: "ORD-2024-98765",
    date: "2024-05-22",
    total: 25.5,
    status: "Shipped",
    items: [
      { name: "USB-C Cable (2m)", quantity: 1, price: 10.0 },
      { name: "Portable Charger", quantity: 1, price: 15.5 },
    ],
  },
  {
    orderId: "ORD-2024-11223",
    date: "2024-04-10",
    total: 599.0,
    status: "Cancelled",
    items: [{ name: "Smartwatch Series 7", quantity: 1, price: 599.0 }],
  },
  {
    orderId: "ORD-2024-67890",
    date: "2024-03-01",
    total: 49.95,
    status: "Delivered",
    items: [{ name: "Bluetooth Speaker", quantity: 1, price: 49.95 }],
  },
];

// UserProfilePage Component
function UserProfilePage() {
  // State to hold user data and order history
  const [userData, setUserData] = useState(null);
  const [orderHistory, setOrderHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/user/single/${id}`);
        const data = await res.json();
        console.log(data.data.user);
        setUserData(data.data.user);
        setOrderHistory(dummyOrderHistory);
      } catch (err) {
        setError("Failed to load user data.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-gray-700">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 text-lg p-8">
        <p>Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center text-gray-600 text-lg p-8">
        <p>No user data available.</p>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-2 md:p-2">
      {/* User Information Section */}
      <section className="border-b pb-6 border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <User className="mr-3 text-blue-600" size={24} /> User Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center">
            <Mail className="mr-2 text-gray-500" size={18} />
            <strong>Email:</strong>{" "}
            <span className="ml-2">{userData.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 text-gray-500" size={18} />
            <strong>Phone:</strong>{" "}
            <span className="ml-2">{userData.phone}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="mr-2 text-gray-500 mt-0.5" size={18} />
            <strong>Address:</strong>{" "}
            <span className="ml-2">{userData.address}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-500" size={18} />
            <strong>Member Since:</strong>{" "}
            <span className="ml-2">{formatDate(userData.memberSince)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-500" size={18} />
            <strong>Last Login:</strong>{" "}
            <span className="ml-2">
              {new Date(userData.lastLogin).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center">
            <CreditCard className="mr-2 text-gray-500" size={18} />
            <strong>Account Status:</strong>{" "}
            <span
              className={`ml-2 font-medium ${
                userData.accountStatus === "Active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {userData.accountStatus}
            </span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 text-gray-500" size={18} />
            <strong>User Type:</strong>{" "}
            <span className="ml-2">{userData.userType}</span>
          </div>
        </div>
      </section>

      {/* Order History Section */}
      <section className="mt-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <ShoppingBag className="mr-3 text-blue-600" size={24} /> Order History
          ({orderHistory.length})
        </h2>
        {orderHistory.length === 0 ? (
          <p className="text-gray-600 italic">No orders found for this user.</p>
        ) : (
          <div className="space-y-6">
            {orderHistory.map((order) => (
              <div
                key={order.orderId}
                className="bg-blue-50 p-5 mt-5 rounded-lg shadow-sm border border-blue-100"
              >
                <div className="flex justify-between items-center mb-3 border-b pb-2 border-blue-200">
                  <h3 className="text-lg font-bold text-blue-800">
                    Order ID: {order.orderId}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      order.status === "Delivered"
                        ? "bg-green-200 text-green-800"
                        : order.status === "Shipped"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(order.date)}
                </p>
                <p className="text-gray-600 mb-3">
                  <span className="font-medium">Total:</span> $
                  {order.total.toFixed(2)}
                </p>
                <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const UserDetails = () => {
  return (
    <div className="min-h-screen p-4 font-sans antialiased">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-4 md:mt-8">
        Admin User Profile View
      </h1>
      <UserProfilePage />
    </div>
  );
};

export default UserDetails;
