/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  DollarSign,
  FileText,
  BookOpen,
  X,
} from "lucide-react";
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
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            message.includes("✅")
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.includes("✅") ? (
            <Check size={20} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">
            {message.replace("✅ ", "").replace("❌ ", "")}
          </p>
        </div>
      )}

      {/* Course Title */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <BookOpen size={16} className="text-emerald-600" />
          Tên khóa học
        </label>
        <input
          name="title"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all"
          placeholder="VD: Tiếng Nhật cơ bản cho người mới bắt đầu"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      {/* Course Description */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <FileText size={16} className="text-blue-600" />
          Mô tả khóa học
        </label>
        <textarea
          name="description"
          rows={4}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all resize-none"
          placeholder="Mô tả nội dung và mục tiêu của khóa học..."
          value={form.description}
          onChange={handleChange}
        />
      </div>

      {/* Course Price */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <DollarSign size={16} className="text-emerald-600" />
          Giá khóa học (VNĐ)
        </label>
        <div className="relative">
          <input
            name="price"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-all"
            placeholder="0"
            value={form.price}
            onChange={(e) => {
              const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
              setForm((prev) => ({
                ...prev,
                price: onlyNumber,
              }));
            }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
            đ
          </span>
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ImageIcon size={16} className="text-purple-600" />
          Ảnh bìa khóa học
        </label>

        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
          />
          <div className="border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-xl p-8 text-center transition-all hover:bg-emerald-50/30 group">
            <div className="w-16 h-16 bg-slate-100 group-hover:bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
              <Upload
                size={28}
                className="text-slate-400 group-hover:text-emerald-600 transition-colors"
              />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              {thumbnailFile
                ? `🖼 ${thumbnailFile.name}`
                : "Nhấn để tải ảnh lên"}
            </p>
            <p className="text-xs text-slate-500">
              Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
            </p>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-300 disabled:to-slate-400 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Check size={20} />
              Tạo khóa học
            </>
          )}
        </button>
      </div>
    </div>
  );
}
