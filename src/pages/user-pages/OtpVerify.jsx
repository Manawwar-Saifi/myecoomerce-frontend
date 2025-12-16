import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
const OtpVerify = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="login-page">
      <section>
        <h4>Enter the otp - 10 min later otp expire</h4>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="OTP"
            name="otp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // error={errors.email}
            placeholder="Enter your OTP you get on Email"
          />

          <Button children="Get Otp" type="submit" />
        </form>
      </section>
    </div>
  );
};

export default OtpVerify;
