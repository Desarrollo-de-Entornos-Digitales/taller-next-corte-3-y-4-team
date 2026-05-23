"use client";

import { useNotifications } from "@/context/NotificationContext";

export default function Toast() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(({ id, message, type }) => (
        <div
          key={id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white ${
            type === "success"
              ? "bg-green-500"
              : type === "error"
              ? "bg-red-500"
              : type === "warning"
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
        >
          {message}
        </div>
      ))}
    </div>
  );
}