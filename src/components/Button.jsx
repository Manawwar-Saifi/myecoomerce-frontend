import React from "react";
import "../style.css";
const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  ...rest
}) => {
  return (
    <button
      className="buttonComponent"
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
