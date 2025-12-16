// src/context/NotificationContext.jsx
import React, { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ userId, children }) => {
  const [socket, setSocket] = useState(null);
  const queryClient = useQueryClient();

  // 🔗 Setup socket connection
  useEffect(() => {
    if (!userId) return;

    const socketInstance = io("http://localhost:5000", {
      withCredentials: true,
    });

    socketInstance.emit("join", userId); // join personal room

    socketInstance.on("notification", (data) => {
      console.log("📩 New Notification:", data);
      // Update cache with new notification
      queryClient.setQueryData(["notifications"], (old = []) => [
        data,
        ...old,
      ]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, queryClient]);

  // 📌 Fetch user notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:5000/api/notification/get",
        { withCredentials: true }
      );
      return res.data.data; // depends on your sendSuccess format
    },
    enabled: !!userId,
  });

  // 📌 Mark all as read
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: async () => {
      return axios.patch(
        "http://localhost:5000/api/notification/mark-all-read",
        {},
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  return (
    <NotificationContext.Provider
      value={{ notifications, isLoading, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
