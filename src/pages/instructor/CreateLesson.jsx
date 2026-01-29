import { useState } from "react";
import { createLessonByUpload } from "../../services/lessonService";
import {
  Upload,
  FileText,
  Video,
  AlertCircle,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const CreateLessonByUpload = ({ moduleId, onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    videoFile: null,
    documentFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!moduleId) {
      setError("Module không hợp lệ");
      return;
    }

    if (!form.title || !form.videoFile) {
      setError("Lesson title và Video là bắt buộc");
      return;
    }

    try {
      setLoading(true);

      await createLessonByUpload({
        title: form.title,
        moduleId,
        videoFile: form.videoFile,
        documentFile: form.documentFile,
      });

      alert("Lesson created ✅ Transcript đang được xử lý ⏳");

      setForm({
        title: "",
        videoFile: null,
        documentFile: null,
      });

      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Upload lesson failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Module Info Badge */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <Sparkles size={20} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs text-emerald-600 font-semibold mb-0.5">
            Tạo lesson cho Module
          </p>
          <p className="text-sm font-mono text-slate-700">ID: {moduleId}</p>
        </div>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
          <FileText size={16} className="text-slate-500" />
          Tên Lesson
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-slate-800 font-medium placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
          placeholder="Ví dụ: Ngữ pháp N1 - Tuần 1"
          disabled={loading}
        />
      </div>

      {/* Video Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
          <Video size={16} className="text-slate-500" />
          Video bài học
          <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            onChange={handleChange}
            className="hidden"
            id="video-upload"
            disabled={loading}
          />
          <label
            htmlFor="video-upload"
            className={`flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed rounded-xl transition-all cursor-pointer
              ${
                form.videoFile
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {form.videoFile ? (
              <>
                <CheckCircle size={32} className="text-emerald-600 mb-3" />
                <p className="text-sm font-bold text-emerald-700 mb-1">
                  {form.videoFile.name}
                </p>
                <p className="text-xs text-emerald-600">
                  {(form.videoFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload size={32} className="text-slate-400 mb-3" />
                <p className="text-sm font-bold text-slate-700 mb-1">
                  Click để chọn video
                </p>
                <p className="text-xs text-slate-500">
                  Hoặc kéo thả file vào đây
                </p>
              </>
            )}
          </label>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Sparkles size={14} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Video sẽ được <span className="font-bold">transcript tự động</span>{" "}
            bằng AI sau khi upload
          </p>
        </div>
      </div>

      {/* Document Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
          <FileText size={16} className="text-slate-500" />
          Tài liệu đính kèm
          <span className="text-xs font-normal text-slate-500">(tùy chọn)</span>
        </label>

        <div className="relative">
          <input
            type="file"
            name="documentFile"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="hidden"
            id="document-upload"
            disabled={loading}
          />
          <label
            htmlFor="document-upload"
            className={`flex flex-col items-center justify-center w-full px-6 py-6 border-2 border-dashed rounded-xl transition-all cursor-pointer
              ${
                form.documentFile
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {form.documentFile ? (
              <>
                <CheckCircle size={24} className="text-blue-600 mb-2" />
                <p className="text-sm font-bold text-blue-700 mb-1">
                  {form.documentFile.name}
                </p>
                <p className="text-xs text-blue-600">
                  {(form.documentFile.size / 1024).toFixed(2)} KB
                </p>
              </>
            ) : (
              <>
                <Upload size={24} className="text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700 mb-0.5">
                  Click để chọn tài liệu
                </p>
                <p className="text-xs text-slate-500">PDF, DOC, DOCX</p>
              </>
            )}
          </label>
        </div>

        <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <Sparkles size={14} className="text-purple-600 mt-0.5 shrink-0" />
          <p className="text-xs text-purple-700 leading-relaxed">
            Dùng để AI <span className="font-bold">mix dữ liệu</span> khi tạo
            Quiz tự động
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700 font-medium leading-relaxed">
            {error}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !moduleId}
        className="w-full py-4 rounded-xl font-bold text-white text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-lg hover:shadow-xl"
        style={{
          background: loading
            ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
            : "linear-gradient(135deg, #10b981 0%, #059669 50%, #0d9488 100%)",
        }}
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Đang upload...
            </>
          ) : (
            <>
              <Upload size={20} />
              Tạo Lesson Mới
            </>
          )}
        </span>
      </button>

      {/* Helper text */}
      <p className="text-xs text-center text-slate-500 leading-relaxed">
        Sau khi tạo, lesson sẽ xuất hiện trong danh sách và transcript sẽ được
        xử lý tự động
      </p>
    </form>
  );
};

export default CreateLessonByUpload;
