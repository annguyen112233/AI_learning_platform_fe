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

  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
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

  // 🔥 TỰ RESTORE KHI LOAD APP
  useEffect(() => {
    fetchSubscription();
  }, []);

  const clearSubscription = () => {
    setSubscription(null);
    sessionStorage.removeItem("subscription");
  };

  return (
    <SubscriptionContext.Provider
      value={{ subscription, setSubscription, fetchSubscription,setSubscriptionStudent: setSubscription, clearSubscription, loading }}
    >
      {!loading && children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
