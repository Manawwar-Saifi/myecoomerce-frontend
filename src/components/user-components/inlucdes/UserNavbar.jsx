import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import { useAuth } from "@/contexts/AuthContext"; // adjust path if needed

const UserNavbar = () => {
  const [ham, setHam] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const handleHam = () => setHam(!ham);

  return (
    <div className="container">
      <div className="row align-items-center justify-content-center">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <h4>LOGO</h4>
        </div>
        <div className="col-lg-9 col-md-6 col-sm-6">
          <nav className={`${ham ? "showMenu" : "hideMenu"}`}>
            {/* Public Links */}
            <NavItem to="/" label="Home" />
            <NavItem to="/products" label="Products" />
            <NavItem to="/category" label="Category" />
            <NavItem to="/" label="Contact Us" />

            {/* Protected Links */}
            {isAuthenticated && (
              <>
                <NavItem to={`/cart/${user?.id || "me"}`} label="Cart" />
                <NavItem to={`/checkout/${user?.id}`} label="Checkout" />
                <NavItem
                  to={`/profile/${user?.id || "me"}`}
                  label={user?.name || "Profile"}
                />
              </>
            )}

            {/* Auth Buttons */}
            {!isAuthenticated && (
              <>
                <NavItem to="/login" label="Login" />
                <NavItem to="/register" label="Register" />
              </>
            )}

            <button className="navCloseIcon" onClick={handleHam}>
              <ClearIcon />
            </button>
          </nav>

          <button onClick={handleHam} className="hamButton">
            <MenuIcon className="navHamIcon" fontSize="large" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Small reusable NavLink wrapper
const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${isActive ? "text-danger border rounded px-2 py-1" : "px-2 py-1"}`
    }
  >
    {label}
  </NavLink>
);

export default UserNavbar;
