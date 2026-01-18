import { Outlet } from "react-router-dom";
import Sidebar from "./admin-components/includes/Sidebar";
import Navbar from "./admin-components/includes/Navbar";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { useState } from "react";
import { NotificationProvider } from "../contexts/NotificationContext";
import ScrollToTop from "../utils/ScrollToTop";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <NotificationProvider>
      <ScrollToTop />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} />

        <Box sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
          {/* Navbar */}
          <Navbar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

          {/* Push content below Navbar */}
          <Toolbar />

          {/* Actual page content */}
          <Outlet />
        </Box>
      </Box>
    </NotificationProvider>
  );
}
