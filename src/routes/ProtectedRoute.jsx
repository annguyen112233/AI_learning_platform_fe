/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, allowRoles }) {
  const token = sessionStorage.getItem("accessToken");

  // ❌ Chưa login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const { role, exp } = jwtDecode(token);

    // ❌ Token hết hạn
    if (Date.now() >= exp * 1000) {
      sessionStorage.clear();
      return <Navigate to="/login" replace />;
    }

    // ❌ Không đúng role
    if (allowRoles && !allowRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }

    // ✅ OK
    return children;

  } catch (err) {
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }
}
