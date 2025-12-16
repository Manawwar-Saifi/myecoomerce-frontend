import React from "react";

const Input = ({
  type = "text",
  label,
  name = "",
  value,
  onChange,
  placeholder = "",
  disabled = false,
  error = "",
  autoComplete = "off",
  ...rest
}) => {
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div style={{ marginBottom: "1rem" }} className="inputComponent">
      {label && (
        <label htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: error ? "1px solid red" : "1px solid #ccc",
          borderRadius: "4px",
        }}
        {...rest}
      />

      {error && (
        <span id={`${inputId}-error`} style={{ color: "red", fontSize: "0.875rem" }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
