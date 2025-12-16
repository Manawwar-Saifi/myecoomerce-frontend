import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";

const ForgetPassword1 = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="login-page">
      <section>
        <h4>Reset The Password</h4>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // error={errors.email}
            placeholder="Enter your email to receive the otp."
          />

          <Button children="Get Otp" type="submit" />
        </form>
      </section>
    </div>
  );
};

export default ForgetPassword1;
