import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "@/api/userAuth.js";
import { useNavigate, NavLink } from "react-router-dom";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { showSuccess, showError } from "../../utils/Toasty";
import MiniLoader from "../../utils/MiniLoader";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showIcon, setShowIcon] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      showSuccess("Registered successfully");
      navigate("/login");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Signup failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="register-page">
      <section>
        <h4>Register</h4>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter your name"
          />
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
              type={showIcon ? "text" : "password"}
              label="Password"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
            />
            <i
              onClick={() => setShowIcon(!showIcon)}
              className={`fa-solid ${showIcon ? "fa-eye" : "fa-eye-slash"}`}
            ></i>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <MiniLoader /> Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
          <p>
            {"Already Have Account "}
            <NavLink to="/login">LogIn</NavLink>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;
// children,
// onClick,
// type = "button",
// disabled = false,
// style = {},
// ...rest
