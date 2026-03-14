import { useState } from "react";
import { Plus, Hash, Type, AlertCircle } from "lucide-react";
import api from "../../services/api";

export default function CreateModule({ courseId, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    orderIndex: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "orderIndex" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Tên module không được để trống");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/modules", {
        title: form.title,
        orderIndex: form.orderIndex,
        courseId,
      });

      setForm({ title: "", orderIndex: 1 });
      onCreated && onCreated();
    } catch (err) {
      console.error("Create module error:", err);
      setError(err.response?.data?.message || "Tạo module thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Type size={16} className="text-emerald-600" />
          Tên module
        </label>
        <input
          name="title"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
          placeholder="VD: Module 1 - Giới thiệu cơ bản"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      {/* Order Index Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Hash size={16} className="text-emerald-600" />
          Thứ tự module
        </label>
        <input
          name="orderIndex"
          type="number"
          min={1}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          placeholder="1"
          value={form.orderIndex}
          onChange={handleChange}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Đang lưu...</span>
          </>
        ) : (
          <>
            <Plus size={20} />
            <span>Thêm module</span>
          </>
        )}
      </button>
    </div>
  );
}
