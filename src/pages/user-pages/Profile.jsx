import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ for redirect
import { useAuth } from "@/contexts/AuthContext"; // ✅ real logoutimport {useAuth}f
import GetSingleUserOrder from "@/utils/GetSingleUserOrder";
import SingleUserReview from "@/utils/SingleUserReview";
const Profile = () => {
  // Mock User Data (would typically come from a backend API)
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 E-commerce Lane",
      city: "Shopville",
      state: "CA",
      zip: "90210",
      country: "USA",
    },
  });
  const { id } = useParams();
  // Mock Current Orders (newly added)
  const [currentOrders, setCurrentOrders] = useState([
    {
      id: "CUR-2024-001",
      date: "2024-06-20",
      total: 55.0,
      status: "In Transit",
      paymentStatus: "Paid",
      deliveryInfo: "Estimated delivery: June 27, 2024. Tracking: TRK123456789",
      items: [
        {
          name: "Cargo Pants",
          quantity: 1,
          price: 55.0,
          image: "https://placehold.co/60x60/6b8e23/000?text=Pants",
        },
      ],
    },
    {
      id: "CUR-2024-002",
      date: "2024-06-24",
      total: 65.0,
      status: "Awaiting Shipment",
      paymentStatus: "Pending", // Example of pending payment
      deliveryInfo:
        "Awaiting payment confirmation. Shipment will be processed upon successful payment.",
      items: [
        {
          name: "V-Neck Sweater",
          quantity: 1,
          price: 65.0,
          image: "https://placehold.co/60x60/f5f5dc/000?text=Sweater",
        },
      ],
    },
    {
      id: "CUR-2024-003",
      date: "2024-06-25",
      total: 29.99,
      status: "Processing",
      paymentStatus: "Paid",
      deliveryInfo:
        "Your order is being prepared for shipment. No tracking available yet.",
      items: [
        {
          name: "Running Shorts",
          quantity: 1,
          price: 29.99,
          image: "https://placehold.co/60x60/404040/fff?text=Shorts",
        },
      ],
    },
  ]);

  // Mock Order History (would typically come from a backend API)
  const [orders, setOrders] = useState([
    {
      id: "ORD-2023-001",
      date: "2023-05-10",
      total: 75.98,
      status: "Delivered",
      items: [
        {
          name: "Classic T-Shirt",
          quantity: 1,
          price: 19.99,
          image: "https://placehold.co/60x60/b0c4de/000?text=T-Shirt",
        },
        {
          name: "Slim Fit Jeans",
          quantity: 1,
          price: 49.99,
          image: "https://placehold.co/60x60/87ceeb/000?text=Jeans",
        },
      ],
    },
    {
      id: "ORD-2023-002",
      date: "2023-06-01",
      total: 34.5,
      status: "Shipped",
      items: [
        {
          name: "Summer Dress",
          quantity: 1,
          price: 34.5,
          image: "https://placehold.co/60x60/ff6347/000?text=Dress",
        },
      ],
    },
    {
      id: "ORD-2023-003",
      date: "2023-06-20",
      total: 120.0,
      status: "Processing",
      items: [
        {
          name: "Leather Jacket",
          quantity: 1,
          price: 120.0,
          image: "https://placehold.co/60x60/cd853f/000?text=Jacket",
        },
      ],
    },
  ]);

  // Mock Reviews Given (would typically come from a backend API)
  const [reviewsGiven, setReviewsGiven] = useState([
    {
      productId: 1,
      productName: "Classic T-Shirt",
      rating: 5,
      reviewText: "Love this T-shirt! Great quality and fits perfectly.",
      date: "2023-05-15",
      productImage: "https://placehold.co/60x60/b0c4de/000?text=T-Shirt",
    },
    {
      productId: 3,
      productName: "Summer Dress",
      rating: 4,
      reviewText:
        "Beautiful dress, but the color was slightly different than expected.",
      date: "2023-06-05",
      productImage: "https://placehold.co/60x60/ff6347/000?text=Dress",
    },
  ]);

  const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'current-orders', 'orders', 'reviews'
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...user });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      setEditFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(editFormData);
    setIsEditingProfile(false);
    alert("Profile updated successfully!");
    // In a real app, you'd send this to your backend
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <span key={i} className="text-yellow-500">
          ⭐
        </span>
      );
    }
    return stars;
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Processing":
      case "Awaiting Shipment":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusClasses = (paymentStatus) => {
    switch (paymentStatus) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ real logout function
  const handleLogout = () => {
    logout(); // will also clear session via mutation
    navigate("/login"); // optional: redirect to login after logout
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-inter mt-5">
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8 p-2">
          User Profile
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 pb-5">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 bg-gray-50 rounded-lg p-4 shadow-sm">
            <nav>
              <ul>
                <li className="mb-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left py-2 px-4 rounded-md font-medium
                                ${
                                  activeTab === "profile"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-200"
                                }
                                transition-colors duration-200`}
                  >
                    Profile Details
                  </button>
                </li>
                <li className="mb-2">
                  <button
                    onClick={() => setActiveTab("current-orders")}
                    className={`w-full text-left py-2 px-4 rounded-md font-medium
                                ${
                                  activeTab === "current-orders"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-200"
                                }
                                transition-colors duration-200`}
                  >
                    Current Orders
                  </button>
                </li>
                {/* <li className="mb-2">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left py-2 px-4 rounded-md font-medium
                                ${
                                  activeTab === "orders"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-200"
                                }
                                transition-colors duration-200`}
                  >
                    Order History
                  </button>
                </li> */}
                <li>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`w-full text-left py-2 px-4 rounded-md font-medium
                                ${
                                  activeTab === "reviews"
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-200"
                                }
                                transition-colors duration-200`}
                  >
                    My Reviews
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left py-2 px-4 rounded-md font-medium text-red-600 hover:bg-red-100 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-5 rounded-lg shadow-md border border-gray-100 profileMainDiv">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Profile Details
                </h2>
                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <fieldset className="border border-gray-200 p-4 rounded-md">
                      <legend className="text-lg font-medium text-gray-800 px-2">
                        Address
                      </legend>
                      <div className="space-y-3 mt-2">
                        <div>
                          <label
                            htmlFor="address.street"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Street
                          </label>
                          <input
                            type="text"
                            id="address.street"
                            name="address.street"
                            value={editFormData.address.street}
                            onChange={handleEditChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label
                              htmlFor="address.city"
                              className="block text-sm font-medium text-gray-700"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              id="address.city"
                              name="address.city"
                              value={editFormData.address.city}
                              onChange={handleEditChange}
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="address.state"
                              className="block text-sm font-medium text-gray-700"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              id="address.state"
                              name="address.state"
                              value={editFormData.address.state}
                              onChange={handleEditChange}
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="address.zip"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Zip
                            </label>
                            <input
                              type="text"
                              id="address.zip"
                              name="address.zip"
                              value={editFormData.address.zip}
                              onChange={handleEditChange}
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="address.country"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            id="address.country"
                            name="address.country"
                            value={editFormData.address.country}
                            onChange={handleEditChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </fieldset>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 text-gray-700">
                    <p>
                      <span className="font-semibold">Name:</span> {user.name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {user.phone || "N/A"}
                    </p>
                    <div>
                      <p className="font-semibold mb-1">Address:</p>
                      <p>{user.address.street}</p>
                      <p>
                        {user.address.city}, {user.address.state}{" "}
                        {user.address.zip}
                      </p>
                      <p>{user.address.country}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsEditingProfile(true);
                        setEditFormData({ ...user });
                      }}
                      className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "current-orders" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Current Orders
                </h2>
                <GetSingleUserOrder id={id} />
              </div>
            )}

            {/* {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Order History
                </h2>
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white my-4"
                      >
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                          <h3 className="font-semibold text-lg text-gray-900">
                            Order ID: {order.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Order Date: {order.date}
                        </p>
                        <div className="space-y-2 mb-3">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center text-gray-700 text-sm"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-md mr-3"
                              />
                              <span>
                                {item.name} (x{item.quantity}) - $
                                {item.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-lg font-bold text-gray-900 text-right">
                          Total: ${order.total.toFixed(2)}
                        </p>
                        <div className="flex justify-end mt-4">
                          <button className="py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">You have no past orders.</p>
                )}
              </div>
            )} */}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  My Reviews
                </h2>
                <SingleUserReview id={id} />
                {reviewsGiven.length > 0 ? (
                  <div className="space-y-6">
                    {reviewsGiven.map((review) => (
                      <div
                        key={review.productId}
                        className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white my-4"
                      >
                        <div className="flex items-start mb-3">
                          <img
                            src={review.productImage}
                            alt={review.productName}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {review.productName}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <div className="flex text-yellow-500 mr-2">
                                {renderStars(review.rating)}
                              </div>
                              <span>{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.reviewText}
                        </p>
                        <div className="flex justify-end mt-4 space-x-2">
                          <button className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
                            Edit Review
                          </button>
                          <button className="py-2 px-4 border border-red-500 text-red-500 rounded-md hover:bg-red-50 text-sm font-medium">
                            Delete Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    You haven't reviewed any products yet.
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;

//  type = "text",
//   label,
//   name,
//   value,
//   onChange,
//   placeholder = "",
//   disabled = false,
//   error = "",
//   ...rest
