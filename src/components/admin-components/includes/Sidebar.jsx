import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2'; // better for Products
import CategoryIcon from '@mui/icons-material/Category'; // better for Categories
import GroupIcon from '@mui/icons-material/Group'; // better for Users
import DescriptionIcon from '@mui/icons-material/Description'; // better for Forms

const pages = [
  { name: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { name: "Products", path: "/admin/products", icon: <Inventory2Icon /> },
  { name: "Categories", path: "/admin/categories", icon: <CategoryIcon /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingCartIcon /> },
  { name: "Users", path: "/admin/users", icon: <GroupIcon /> },
  { name: "Forms", path: "/admin/forms", icon: <DescriptionIcon /> },
  { name: "Review", path: "/admin/reviews", icon: <DescriptionIcon /> },
];

function Sidebar({ isCollapsed }) {
  const location = useLocation();

  const drawerWidth = isCollapsed ? 60 : 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: "width 0.3s",
        },
      }}
    >
      <Toolbar />
      <List>
        {pages.map((page, index) => {
          const isActive = location.pathname === page.path;

          return (
            <Tooltip
              title={isCollapsed ? page.name : ""}
              placement="right"
              key={index}
            >
              <ListItemButton
                component={Link}
                to={page.path}
                selected={isActive}
                sx={{
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  px: 2.5,
                  bgcolor: isActive ? "warning.dark" : "transparent",
                  color: isActive ? "white" : "text.primary",
                  "&:hover": {
                    bgcolor: isActive ? "primary.dark" : "grey.300",
                  },
                  borderRadius: 2,
                  my: 0.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: "center",
                    color: isActive ? "skyblue" : "text.secondary",
                  }}
                >
                  {page.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={page.name}
                    sx={{
                      opacity: isCollapsed ? 0 : 1,
                      fontWeight: isActive ? "bold" : "normal",
                      color: isActive ? "skyblue" : "dark",
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;
