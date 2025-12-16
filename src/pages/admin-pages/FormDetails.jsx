import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Mail, Phone, MapPin, Calendar, CreditCard, MessageSquare, HelpCircle } from 'lucide-react';

// Dummy Data for User Information
const dummyUserData = {
  id: 'user-001',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, Anytown, CA 90210, USA',
  memberSince: '2022-03-15',
  lastLogin: '2024-06-21T14:30:00Z',
  accountStatus: 'Active',
  userType: 'Customer',
};

// Dummy Data for Order History
const dummyOrderHistory = [
  {
    orderId: 'ORD-2024-54321',
    date: '2024-06-19',
    total: 129.99,
    status: 'Delivered',
    items: [
      { name: 'Wireless Headphones', quantity: 1, price: 79.99 },
      { name: 'Smartphone Case', quantity: 1, price: 25.00 },
      { name: 'Screen Protector', quantity: 2, price: 12.50 },
    ],
  },
  {
    orderId: 'ORD-2024-98765',
    date: '2024-05-22',
    total: 25.50,
    status: 'Shipped',
    items: [
      { name: 'USB-C Cable (2m)', quantity: 1, price: 10.00 },
      { name: 'Portable Charger', quantity: 1, price: 15.50 },
    ],
  },
  {
    orderId: 'ORD-2024-11223',
    date: '2024-04-10',
    total: 599.00,
    status: 'Cancelled',
    items: [
      { name: 'Smartwatch Series 7', quantity: 1, price: 599.00 },
    ],
  },
  {
    orderId: 'ORD-2024-67890',
    date: '2024-03-01',
    total: 49.95,
    status: 'Delivered',
    items: [
      { name: 'Bluetooth Speaker', quantity: 1, price: 49.95 },
    ],
  },
];

// Dummy Data for User Queries
const dummyUserQueries = [
  {
    queryId: 'Q-2024-001',
    date: '2024-06-20',
    subject: 'Issue with recent order ORD-2024-54321',
    status: 'Open', // Could be 'Open', 'In Progress', 'Resolved', 'Closed'
    message: 'I received the Wireless Headphones from my last order, but they seem to be defective. The left ear cup is not producing any sound. Can you please assist?',
    response: null, // Admin response to the query
  },
  {
    queryId: 'Q-2024-002',
    date: '2024-06-15',
    subject: 'Question about product warranty',
    status: 'Resolved',
    message: 'Hi, I bought a portable charger a few months ago and I have a question regarding its warranty. How long is the warranty period and what does it cover?',
    response: 'The portable charger has a 1-year manufacturer\'s warranty covering defects in materials and workmanship. Please refer to the product manual for full details.',
  },
  {
    queryId: 'Q-2024-003',
    date: '2024-06-10',
    subject: 'Feature request for mobile app',
    status: 'Closed',
    message: 'I would like to suggest a new feature for your mobile app. It would be great if users could track their order in real-time on a map. Is this something you are considering?',
    response: 'Thank you for your valuable feedback! We are always looking for ways to improve our app. Your suggestion has been forwarded to our development team for consideration.',
  },
];

// UserProfilePage Component
function UserProfilePage() {
  // State to hold user data, order history, and user queries
  const [userData, setUserData] = useState(null);
  const [orderHistory, setOrderHistory] = useState(null);
  const [userQueries, setUserQueries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching data with a delay
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setUserData(dummyUserData);
        setOrderHistory(dummyOrderHistory);
        setUserQueries(dummyUserQueries); // Load dummy user queries
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="">
      {/* User Information Section */}
      <section className="border-b pb-6 border-gray-200  pb-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <User className="mr-3 text-blue-600" size={24} /> Form Query Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center">
            <Mail className="mr-2 text-gray-500" size={18} />
            <strong>Email:</strong> <span className="ml-2">{userData.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 text-gray-500" size={18} />
            <strong>Phone:</strong> <span className="ml-2">{userData.phone}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="mr-2 text-gray-500 mt-0.5" size={18} />
            <strong>Address:</strong> <span className="ml-2">{userData.address}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-500" size={18} />
            <strong>Member Since:</strong> <span className="ml-2">{formatDate(userData.memberSince)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-500" size={18} />
            <strong>Last Login:</strong> <span className="ml-2">{new Date(userData.lastLogin).toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <CreditCard className="mr-2 text-gray-500" size={18} />
            <strong>Account Status:</strong> <span className={`ml-2 font-medium ${userData.accountStatus === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{userData.accountStatus}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 text-gray-500" size={18} />
            <strong>User Type:</strong> <span className="ml-2">{userData.userType}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

const FormDetails = () => {
  return (
    <div className=" p-4 font-sans antialiased">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-4 md:mt-8">Form Query Information</h1>
      <UserProfilePage />
    </div>
  );s
}

export default FormDetails