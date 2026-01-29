import { jwtDecode } from "jwt-decode";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatDateVN = (isoString) => {
  if (!isoString) return "—";

  const date = new Date(isoString);

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const getUserRole = () => {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    const decoded = jwtDecode(token);
    console.log(decoded);
  }
};
