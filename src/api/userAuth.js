import axios from "@/lib/axiosInstance"; // use the configured instance

// POST /login
export const loginUser = async ({ email, password }) => {
  const { data } = await axios.post("/credentials/login", { email, password });
  return data.data;
};

// GET /verify
export const getMyProfile = async () => {
  try {
    const res = await axios.get("/credentials/verify", {
      withCredentials: true,
    });

    return res.data?.data || null; // user + token
  } catch (err) {
    if (err.response?.status === 401) {
      return null; // Not logged in
    }
    throw err; // Other errors should still be thrown
  }
};

// axios.get("http://localhost:8000/api/credentials/verify", {
//   withCredentials: true, // 🔥 Important
// });

// POST /logout

export const logoutUser = async () => {
  await axios.post("/credentials/logout");
};

// POST /signup
export const signupUser = async ({ name, email, password }) => {
  const { data } = await axios.post("/credentials/signup", {
    name,
    email,
    password,
  });
  return data.data;
};

// POST /forget-password
export const sendResetOtp = async (email) => {
  const { data } = await axios.post("/credentials/forget-password", { email });
  return data;
};

// POST /verify-otp
export const verifyOtp = async ({ email, otp }) => {
  const { data } = await axios.post("/credentials/verify-otp", { email, otp });
  return data.data;
};

// PUT /new-password
export const resetPassword = async ({ token, newPassword }) => {
  const { data } = await axios.put("/credentials/new-password", {
    token,
    newPassword,
  });
  return data;
};
