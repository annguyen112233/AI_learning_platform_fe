/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import api from "../../services/api";

export default function CreateCourse({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    status: "DRAFT",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!thumbnailFile) {
      setMessage("❌ Thumbnail là bắt buộc");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("status", form.status);
      formData.append("thumbnailFile", thumbnailFile);

      const res = await api.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Tạo khóa học thành công");
      setForm({
        title: "",
        description: "",
        price: 0,
        status: "DRAFT",
      });
      setThumbnailFile(null);
      onCreated && onCreated();
      console.log(res);
    } catch (err) {
      console.error("CREATE COURSE ERROR:", err);
      setMessage(
        "❌ " + (err.response?.data?.message || "Create course failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Tạo khóa học</h1>

      <input
        name="title"
        className="w-full border p-2 mb-3"
        placeholder="Tên khóa học"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        className="w-full border p-2 mb-3"
        placeholder="Mô tả khóa học"
        value={form.description}
        onChange={handleChange}
      />

      <input
        name="price"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="w-full border p-2 mb-3"
        placeholder="Giá khóa học"
        value={form.price}
        onChange={(e) => {
          const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
          setForm((prev) => ({
            ...prev,
            price: onlyNumber,
          }));
        }}
      />

      {/* <select
        name="status"
        className="w-full border p-2 mb-3"
        value={form.status}
        onChange={handleChange}
      >
        <option value="PENDING">Gửi duyệt ngay</option>
        <option value="DRAFT">Lưu nháp</option>
      </select> */}

      {/* THUMBNAIL */}
      <label className="block">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setThumbnailFile(e.target.files[0])}
        />

        <div className="border border-dashed rounded p-4 cursor-pointer hover:bg-gray-50">
          <p className="text-sm text-gray-600">
            {thumbnailFile ? `🖼 ${thumbnailFile.name}` : "📁 Chọn ảnh bìa"}
          </p>
        </div>
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Đang tạo..." : "Tạo khóa học"}
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
