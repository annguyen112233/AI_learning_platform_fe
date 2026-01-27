import { jwtDecode } from "jwt-decode";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const getUserRole = () => {
  const token = sessionStorage.getItem("accessToken");

if (token) {
  const decoded = jwtDecode(token);
  console.log(decoded);
}
};