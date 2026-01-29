import { jwtDecode } from "jwt-decode";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const getDecodedToken = () => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
};

export const getUserRole = () => {
  const decoded = getDecodedToken();
  return decoded?.role || decoded?.roles?.[0] || null;
};

export const getUserId = () => {
  const decoded = getDecodedToken();
  return decoded?.id || decoded?.userId || decoded?.sub || null;
};
