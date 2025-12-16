import React, { lazy, Suspense } from "react";
import {
  createRoutesFromElements,
  Routes,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import UserLayout from "./components/UserRouter.jsx";
import AdminLayout from "./components/AdminRouter.jsx";
import Loader from "./utils/Loader";
import ProtectedRoute from "@/utils/ProtectedRoute";
// 🔄 Lazy Load Pages - Admin
const Dashboard = lazy(() => import("./pages/admin-pages/Dashboard"));
const Orders = lazy(() => import("./pages/admin-pages/Orders"));
const SingleOrders = lazy(() => import("./pages/admin-pages/SingleOrder"));
const Products = lazy(() => import("./pages/admin-pages/Products"));
const Reviews = lazy(() => import("./pages/admin-pages/Reviews.jsx"));
const ReviewDetail = lazy(() => import("./pages/admin-pages/ReviewDetail.jsx"));
const AddProduct = lazy(() => import("./pages/admin-pages/AddProduct.jsx"));
const UpdateProduct = lazy(() =>
  import("./pages/admin-pages/UpdateProduct.jsx")
);
const ACategory = lazy(() => import("./pages/admin-pages/Category"));
const AddCategory = lazy(() => import("./pages/admin-pages/AddCategory.jsx"));
const UpdateCategory = lazy(() =>
  import("./pages/admin-pages/UpdateCategory.jsx")
);
const Users = lazy(() => import("./pages/admin-pages/Users"));
const UserDetails = lazy(() => import("./pages/admin-pages/UserDetails.jsx"));
const Forms = lazy(() => import("./pages/admin-pages/Forms"));
const FormDetails = lazy(() => import("./pages/admin-pages/FormDetails.jsx"));
const NotFound = lazy(() => import("./pages/admin-pages/NotFound"));

// 🧍 Lazy Load Pages - User
const Home = lazy(() => import("./pages/user-pages/Home"));
const About = lazy(() => import("./pages/user-pages/About"));
const Register = lazy(() => import("./pages/user-pages/Register"));
const Login = lazy(() => import("./pages/user-pages/Login"));
const UserProducts = lazy(() => import("./pages/user-pages/Products"));
const Category = lazy(() => import("./pages/user-pages/Category"));
const SingleCategory = lazy(() => import("./pages/user-pages/SingleCategory"));
const SingleProduct = lazy(() => import("./pages/user-pages/SingleProduct"));
const Cart = lazy(() => import("./pages/user-pages/Cart"));
const Checkout = lazy(() => import("./pages/user-pages/Checkout"));
const ProceedCheckout = lazy(() =>
  import("./pages/user-pages/ProceedCheckout")
);
const Profile = lazy(() => import("./pages/user-pages/Profile"));
const ForgetPassword1 = lazy(() =>
  import("./pages/user-pages/ForgetPassword1")
);
const OtpVerify = lazy(() => import("./pages/user-pages/OtpVerify"));

// 🛠️ Router Setup
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 👤 USER ROUTES */}
      <Route path="/" element={<UserLayout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forget-password" element={<ForgetPassword1 />} />
        <Route path="otp-verify" element={<OtpVerify />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        {/* Public browsing routes */}
        <Route path="products" element={<UserProducts />} />
        <Route path="product-detail/:id" element={<SingleProduct />} />
        <Route path="category" element={<Category />} />
        <Route path="category-single/:id" element={<SingleCategory />} />

        {/* ✅ Protected routes */}
        <Route
          path="cart/:id"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout/:id"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="proceed-checkout/:id"
          element={
            <ProtectedRoute>
              <ProceedCheckout />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 🛡️ ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="review-detail/:id" element={<ReviewDetail />} />
        <Route path="product/add" element={<AddProduct />} />
        <Route path="products/update/:id" element={<UpdateProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order/single/:id" element={<SingleOrders />} />
        <Route path="categories" element={<ACategory />} />
        <Route path="category/add" element={<AddCategory />} />
        <Route path="category/update/:id" element={<UpdateCategory />} />
        <Route path="users" element={<Users />} />
        <Route path="user/:id" element={<UserDetails />} />
        <Route path="forms" element={<Forms />} />
        <Route path="form/details/:id" element={<FormDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;

{
  /* <Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminPage />
    </ProtectedRoute>
  }
/>; */
}
