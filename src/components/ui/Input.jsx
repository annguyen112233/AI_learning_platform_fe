import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  icon: Icon,
  label,
  className = "",
  type = "text",
  showToggle = false, // 👈 bật/tắt con mắt
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const actualType =
    isPassword && showToggle && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Icon bên trái */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        )}

        <input
          type={actualType}
          className={`w-full p-2.5 rounded-lg border border-slate-300 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
            outline-none transition-all
            ${Icon ? "pl-10" : ""} 
            ${isPassword && showToggle ? "pr-10" : ""}
            ${className}`}
          {...props}
        />

        {/* 👁 Con mắt – chỉ hiện khi showToggle=true */}
        {isPassword && showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 
              text-slate-400 hover:text-emerald-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
