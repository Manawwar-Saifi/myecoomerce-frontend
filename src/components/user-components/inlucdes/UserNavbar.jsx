import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext"; // adjust path if needed
import { useCartByUserId } from "@/hooks/useCart";

const UserNavbar = () => {
  const [ham, setHam] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const handleHam = () => setHam(!ham);

  // Get cart data to display cart items count
  const { data: cartData } = useCartByUserId(user?.id);

  // useEffect(() => {
  //   console.log("Navigation :", cartData.data.items.length);
  // }, [cartData]);

  // Debug logging
  // console.log("🔍 Full cartData object:", JSON.stringify(cartData, null, 2));
  // console.log("🔍 cartData?.items:", cartData?.items);
  // console.log("🔍 Type of cartData:", typeof cartData);
  // console.log(
  //   "🔍 cartData keys:",
  //   cartData ? Object.keys(cartData) : "cartData is undefined"
  // );

  // Calculate total quantity of all items in cart
  const totalCartQuantity = useMemo(() => {
    return cartData?.data?.items?.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0) || 0;
  }, [cartData]);

  return (
    <div className="container">
      <div className="row align-items-center justify-content-center">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <h4>LOGO</h4>
        </div>
        <div className="col-lg-9 col-md-6 col-sm-6">
          <nav className={`${ham ? "showMenu" : "hideMenu"}`}>
            {/* Public Links */}
            <NavItem to="/" label="Home" end={true} />
            <NavItem to="/products" label="Products" />
            <NavItem to="/category" label="Category" />
            {/* <NavItem to="/contact" label="Contact Us" /> */}

            {/* Protected Links */}
            {isAuthenticated && (
              <>
                {/* Cart with Icon and Badge */}
                <NavLink
                  to={`/cart/${user?.id || "me"}`}
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? "text-danger border rounded px-2 py-1"
                        : "px-2 py-1"
                    } flex items-center gap-1`
                  }
                >
                  <Badge
                    badgeContent={totalCartQuantity}
                    color="error"
                    showZero
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </NavLink>

                {/* <NavItem to={`/checkout/${user?.id}`} label="Checkout" /> */}
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
const NavItem = ({ to, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `${isActive ? "text-danger border rounded px-2 py-1" : "px-2 py-1"}`
    }
  >
    {label}
  </NavLink>
);

export default UserNavbar;
