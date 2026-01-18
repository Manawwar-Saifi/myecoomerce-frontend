import { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, getMyProfile } from "../api/userAuth.js";
import { showSuccess } from "../utils/Toasty";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [authToken, setAuthToken] = useState(null); // not used for auth, optional

  const {
    data,
    isLoading: userLoading,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMyProfile,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.invalidateQueries(["me"]);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries(["me"]);
      setAuthToken(null);
      showSuccess("Logged out successfully");
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: data?.user || null,
        token: data?.token || authToken,
        isLoading: userLoading,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        isAuthenticated: !!data?.user,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
