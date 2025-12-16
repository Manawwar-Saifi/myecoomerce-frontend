import React from "react";
import Sidebar from "./includes/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
