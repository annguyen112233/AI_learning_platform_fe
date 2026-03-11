/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSubscriptionStudent } from "@/services/subscriptionService";

export const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(() => {
    const stored = sessionStorage.getItem("subscription");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const fetchSubscription = async () => {
    // ✅ Chỉ fetch khi đã có token (tránh 403 khi chưa đăng nhập)
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getSubscriptionStudent();
      const data = res.data.data;
      setSubscription(data);
      sessionStorage.setItem("subscription", JSON.stringify(data));
      return data;
    } catch (e) {
      console.error("Fetch subscription failed", e);
      setSubscription(null);
      sessionStorage.removeItem("subscription");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Chỉ fetch khi app load NẾU đã có token
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      fetchSubscription();
    }
  }, []);

  const clearSubscription = () => {
    setSubscription(null);
    sessionStorage.removeItem("subscription");
  };

  return (
    // ✅ Luôn render children — không block trang Login
    <SubscriptionContext.Provider
      value={{ subscription, setSubscription, fetchSubscription, setSubscriptionStudent: setSubscription, clearSubscription, loading }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
