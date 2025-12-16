import React from "react";
import { useNotifications } from "../../contexts/NotificationContext";

const Dashboard = () => {
  const { unreadCount } = useNotifications();

  // Sample data
  const stats = [
    {
      title: "Total Sales",
      value: "$45,231",
      change: "+20.1%",
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: "2,350",
      change: "+180.1%",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Customers",
      value: "12,234",
      change: "+19%",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Conversion Rate",
      value: "2.6%",
      change: "+4.75%",
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  const recentOrders = [
    {
      id: "#3210",
      customer: "Olivia Martin",
      amount: "$1,999.00",
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: "#3209",
      customer: "Jackson Lee",
      amount: "$39.00",
      status: "processing",
      date: "2024-01-14",
    },
    {
      id: "#3208",
      customer: "Isabella Nguyen",
      amount: "$299.00",
      status: "completed",
      date: "2024-01-14",
    },
    {
      id: "#3207",
      customer: "William Kim",
      amount: "$99.00",
      status: "completed",
      date: "2024-01-13",
    },
    {
      id: "#3206",
      customer: "Sofia Davis",
      amount: "$39.00",
      status: "cancelled",
      date: "2024-01-13",
    },
  ];

  const topProducts = [
    {
      name: "Wireless Headphones",
      sales: 234,
      revenue: "$12,234",
      growth: "+12.5%",
    },
    { name: "Smart Watch", sales: 189, revenue: "$9,234", growth: "+8.2%" },
    {
      name: "Bluetooth Speaker",
      sales: 156,
      revenue: "$7,890",
      growth: "+15.3%",
    },
    { name: "Gaming Mouse", sales: 134, revenue: "$6,789", growth: "+22.1%" },
    { name: "USB Cable", sales: 123, revenue: "$4,567", growth: "+5.7%" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✓";
      case "processing":
        return "⏱";
      case "cancelled":
        return "✗";
      default:
        return "⏱";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-lg ${
                  unreadCount > 0 ? "bg-red-50" : "bg-blue-50"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      unreadCount > 0 ? "text-red-600" : "text-blue-600"
                    }`}
                  >
                    {unreadCount > 0 ? "🔔" : "📢"}
                  </div>
                  <div
                    className={`text-sm ${
                      unreadCount > 0 ? "text-red-600" : "text-blue-600"
                    }`}
                  >
                    {unreadCount > 0
                      ? `${unreadCount} Unread`
                      : "Notifications"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <div className="w-6 h-6 text-white font-bold text-lg">
                    {stat.title === "Total Sales" && "$"}
                    {stat.title === "Total Orders" && "📦"}
                    {stat.title === "Total Customers" && "👥"}
                    {stat.title === "Conversion Rate" && "📈"}
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all orders
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <span className="text-sm font-bold">
                          {getStatusIcon(order.status)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.customer}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {order.amount}
                      </p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Products
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.sales} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {product.revenue}
                      </p>
                      <p className="text-sm text-green-600">{product.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sales Overview
            </h3>
            <div className="space-y-4">
              {/* Custom Bar Chart */}
              <div className="flex items-end space-x-2 h-32">
                {[65, 78, 90, 81, 56, 55, 40].map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </div>
                    <div className="relative w-full bg-gray-100 rounded-t">
                      <div
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${value}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Conversion Rate
                  </span>
                  <span className="text-sm font-medium text-gray-700">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Customer Satisfaction
                  </span>
                  <span className="text-sm font-medium text-gray-700">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Inventory Turnover
                  </span>
                  <span className="text-sm font-medium text-gray-700">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="w-8 h-8 text-blue-600 mb-2 text-2xl">📦</div>
              <span className="text-sm font-medium text-blue-900">
                Add Product
              </span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="w-8 h-8 text-green-600 mb-2 text-2xl">👥</div>
              <span className="text-sm font-medium text-blue-900">
                View Customers
              </span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="w-8 h-8 text-purple-600 mb-2 text-2xl">📊</div>
              <span className="text-sm font-medium text-purple-900">
                Analytics
              </span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <div className="w-8 h-8 text-orange-600 mb-2 text-2xl">⭐</div>
              <span className="text-sm font-medium text-orange-900">
                Reviews
              </span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  New order #3211 received from John Smith
                </p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Product "Wireless Headphones" stock updated
                </p>
                <p className="text-xs text-gray-600">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  New customer registration: Sarah Johnson
                </p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
