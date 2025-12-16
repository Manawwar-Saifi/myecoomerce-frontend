import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  // Wait until auth check finishes
  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  // If user not logged in → redirect
  if (!user) return <Navigate to="/login" replace />;

  // If role required, but doesn't match → block access
  if (role && user.role !== role) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;



// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";

// const ProtectedRoute = ({ children, role }) => {
//   const { user, isLoading } = useAuth();

//   if (isLoading) return <p>Loading...</p>;
//   if (!user) return <Navigate to="/login" />;
//   if (role && user.role !== role) return <Navigate to="/unauthorized" />;

//   return children;
// };

// export default ProtectedRoute;
