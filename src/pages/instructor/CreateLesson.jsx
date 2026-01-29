import { useState } from "react";
import { createLessonByUpload } from "@/services/lessonService";

const CreateLessonByUpload = ({ moduleId }) => {
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
        moduleId, // ✅ gửi qua query param ở service
        videoFile: form.videoFile,
        documentFile: form.documentFile,
      });

      alert("Lesson created ✅ Transcript đang được xử lý ⏳");

      setForm({
        title: "",
        videoFile: null,
        documentFile: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Upload lesson failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md bg-white p-4 rounded shadow"
    >
      <h3 className="font-bold text-lg">Create Lesson</h3>

      {/* MODULE INFO */}
      <div className="text-sm text-gray-500">
        Module ID: <span className="font-mono">{moduleId}</span>
      </div>

      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium">
          Lesson title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Ví dụ: Ngữ pháp N1 - Tuần 1"
          disabled={loading}
        />
      </div>

      {/* VIDEO */}
      <div>
        <label className="block text-sm font-medium">
          Video <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="videoFile"
          accept="video/*"
          onChange={handleChange}
          className="w-full"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Video sẽ được transcript tự động bằng AI
        </p>
      </div>

      {/* DOCUMENT */}
      <div>
        <label className="block text-sm font-medium">Document (optional)</label>
        <input
          type="file"
          name="documentFile"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="w-full"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Dùng để AI mix dữ liệu khi tạo Quiz
        </p>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading || !moduleId}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Create Lesson"}
      </button>
    </form>
  );
};

export default CreateLessonByUpload;
