import Input from "../../components/Input";
import Button from "../../components/Button";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccess, showError } from "../../utils/Toasty";
import MiniLoader from "../../utils/MiniLoader";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/userAuth.js";

const Login = () => {
  const navigate = useNavigate();
  const [showICon, setShowIcon] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const { login } = useAuth();

  const handleShowIcon = () => {
    setShowIcon(!showICon);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(form); // stores user in context
      showSuccess("Logged in successfully");
      navigate("/"); // redirect after login
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="login-page">
      <section>
        <h4>Login</h4>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
          />
          <div className="passwordRegister">
            <Input
              type={showICon ? "text" : "password"}
              label="Password"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
            />
            <i
              onClick={handleShowIcon}
              className={`fa-solid ${showICon ? "fa-eye" : "fa-eye-slash"}`}
            ></i>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <MiniLoader /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          <p>
            <NavLink to="/forget-password">Forget Password? Reset Now</NavLink>
          </p>
          <p>
            {"Don't Have an Account? "}
            <NavLink to="/register">Register</NavLink>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
