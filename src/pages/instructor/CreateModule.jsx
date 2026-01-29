import { useState } from "react";
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
        courseId, // ✅ gửi courseId rõ ràng
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
    <div className="mt-3 space-y-2">
      <input
        name="title"
        className="border p-2 w-full rounded"
        placeholder="Tên module"
        value={form.title}
        onChange={handleChange}
      />

      <input
        name="orderIndex"
        type="number"
        min={1}
        className="border p-2 w-full rounded"
        placeholder="Thứ tự module"
        value={form.orderIndex}
        onChange={handleChange}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Đang lưu..." : "Thêm module"}
      </button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
