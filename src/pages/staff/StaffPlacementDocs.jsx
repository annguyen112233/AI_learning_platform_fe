import React, { useState, useEffect, useCallback } from "react";
import {
    Upload, FileText, Headphones, Zap, Trash2, RefreshCw,
    CheckCircle, Clock, AlertCircle, XCircle, ChevronDown,
    ChevronUp, Plus, BookOpen, Layers, Filter
} from "lucide-react";
import toast from "react-hot-toast";
import {
    getAllPlacementDocuments,
    uploadReadingDocument,
    uploadListeningDocument,
    generateReadingQuestions,
    generateListeningQuestions,
    generateMixedQuestions,
    deletePlacementDocument,
} from "@/services/placementService";

const STATUS_CONFIG = {
    PENDING:    { label: "Chờ xử lý",  color: "text-amber-400",   bg: "bg-amber-400/10",  icon: Clock },
    PROCESSING: { label: "Đang xử lý", color: "text-blue-400",    bg: "bg-blue-400/10",   icon: RefreshCw },
    PROCESSED:  { label: "Đã xử lý",   color: "text-emerald-400", bg: "bg-emerald-400/10",icon: CheckCircle },
    FAILED:     { label: "Thất bại",    color: "text-red-400",     bg: "bg-red-400/10",    icon: XCircle },
};

const TYPE_CONFIG = {
    READING:   { label: "Đọc hiểu",  color: "text-violet-400", bg: "bg-violet-400/10", icon: FileText },
    LISTENING: { label: "Nghe",       color: "text-cyan-400",   bg: "bg-cyan-400/10",   icon: Headphones },
};

const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];

export default function StaffPlacementDocs() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [showUpload, setShowUpload] = useState(false);
    const [uploadType, setUploadType] = useState("READING");
    const [generatingId, setGeneratingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [mixGenerating, setMixGenerating] = useState(false);

    // Upload form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetLevel, setTargetLevel] = useState("");
    const [file, setFile] = useState(null);
    const [questionCount, setQuestionCount] = useState(10);
    const [uploading, setUploading] = useState(false);

    const fetchDocs = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAllPlacementDocuments(filter === "ALL" ? null : filter);
            setDocuments(res.data?.data || res.data || []);
        } catch {
            toast.error("Không lấy được danh sách tài liệu");
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { fetchDocs(); }, [fetchDocs]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title.trim()) {
            toast.error("Vui lòng điền tiêu đề và chọn file");
            return;
        }
        const fd = new FormData();
        // ── DEBUG: kiểm tra file object ──
        console.log("File object:", file);
        console.log("File name:", file?.name);
        console.log("File size (bytes):", file?.size);
        console.log("File type:", file?.type);
        console.log("File instanceof File:", file instanceof File);
        // ────────────────────────────────
        fd.append("file", file, file.name); // explicit filename
        fd.append("title", title.trim());
        if (description) fd.append("description", description.trim());
        if (targetLevel) fd.append("targetLevel", targetLevel);
        // Log FormData entries
        for (const [key, val] of fd.entries()) {
            console.log(`FormData [${key}]:`, val instanceof File ? `File(${val.name}, ${val.size}B, ${val.type})` : val);
        }


        try {
            setUploading(true);
            const fn = uploadType === "READING" ? uploadReadingDocument : uploadListeningDocument;
            await fn(fd);
            toast.success("Upload tài liệu thành công!");
            setShowUpload(false);
            setTitle(""); setDescription(""); setTargetLevel(""); setFile(null);
            fetchDocs();
        } catch (err) {
            // Log chi tiết để debug
            console.error("Upload error status:", err.response?.status);
            console.error("Upload error data:", err.response?.data);
            console.error("Upload error headers:", err.response?.headers);
            const msg = err.response?.data?.message || err.response?.data?.error || JSON.stringify(err.response?.data) || "Upload thất bại";
            toast.error(msg);
        } finally {
            setUploading(false);
        }

    };

    const handleGenerate = async (doc) => {
        try {
            setGeneratingId(doc.documentId);
            const fn = doc.documentType === "READING" ? generateReadingQuestions : generateListeningQuestions;
            const defaultCount = doc.documentType === "READING" ? questionCount : 3;
            const res = await fn(doc.documentId, defaultCount);
            const count = res.data?.data?.questionsGenerated ?? res.data?.questionsGenerated ?? "?";
            toast.success(`✅ Đã sinh ${count} câu hỏi từ tài liệu!`);
            fetchDocs();
        } catch (err) {
            toast.error(err.response?.data?.message || "Sinh câu hỏi thất bại");
        } finally {
            setGeneratingId(null);
        }
    };

    const handleDelete = async (doc) => {
        if (!window.confirm(`Xóa tài liệu "${doc.title}"?`)) return;
        try {
            setDeletingId(doc.documentId);
            await deletePlacementDocument(doc.documentId);
            toast.success("Đã xóa tài liệu");
            fetchDocs();
        } catch {
            toast.error("Xóa thất bại");
        } finally {
            setDeletingId(null);
        }
    };

    const handleMixGenerate = async () => {
        try {
            setMixGenerating(true);
            const res = await generateMixedQuestions(20);
            const count = res.data?.data?.questionsGenerated ?? res.data?.questionsGenerated ?? "?";
            toast.success(`🎉 Đã sinh ${count} câu hỏi tổng hợp!`);
            fetchDocs();
        } catch (err) {
            toast.error(err.response?.data?.message || "Sinh câu hỏi tổng hợp thất bại");
        } finally {
            setMixGenerating(false);
        }
    };

    const processedCount = documents.filter(d => d.status === "PROCESSED").length;
    const totalQuestions = documents.reduce((s, d) => s + (d.generatedQuestionCount || 0), 0);

    return (
        <div className="min-h-screen bg-[#0f1117] text-white p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-violet-500/20">
                        <BookOpen className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Ngân hàng Placement Test</h1>
                        <p className="text-slate-400 text-sm">Quản lý tài liệu & sinh câu hỏi kiểm tra trình độ JLPT bằng AI</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Tổng tài liệu", value: documents.length, color: "text-white", sub: "đã upload" },
                    { label: "Đã xử lý", value: processedCount, color: "text-emerald-400", sub: "tài liệu" },
                    { label: "Câu hỏi AI", value: totalQuestions, color: "text-violet-400", sub: "đã sinh" },
                ].map((s) => (
                    <div key={s.label} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur">
                        <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                        <div className="text-slate-300 font-medium text-sm">{s.label}</div>
                        <div className="text-slate-500 text-xs">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-3 mb-6">
                {/* Filter */}
                <div className="flex gap-1 bg-slate-800/60 border border-slate-700/50 rounded-xl p-1">
                    {["ALL", "READING", "LISTENING"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                filter === f
                                    ? "bg-violet-600 text-white shadow"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            {f === "ALL" ? "Tất cả" : f === "READING" ? "📄 Đọc hiểu" : "🎧 Nghe"}
                        </button>
                    ))}
                </div>

                <div className="flex-1" />

                {/* Mix generate */}
                <button
                    onClick={handleMixGenerate}
                    disabled={mixGenerating || processedCount < 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-medium text-sm hover:bg-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    {mixGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                    Sinh câu hỏi tổng hợp (AI Mix)
                </button>

                {/* Upload button */}
                <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 transition-all"
                >
                    {showUpload ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    Upload tài liệu
                </button>
            </div>

            {/* Upload Form */}
            {showUpload && (
                <div className="mb-6 bg-slate-800/60 border border-violet-500/30 rounded-2xl p-6 backdrop-blur">
                    <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-violet-400" />
                        Upload tài liệu mới
                    </h3>

                    {/* Type selector */}
                    <div className="flex gap-3 mb-5">
                        {[
                            { v: "READING", label: "📄 PDF/DOC (Đọc hiểu)", desc: "Tối đa 20MB" },
                            { v: "LISTENING", label: "🎧 MP3/Audio (Nghe)", desc: "Tối đa 50MB" },
                        ].map((t) => (
                            <button
                                key={t.v}
                                onClick={() => setUploadType(t.v)}
                                className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-xl border-2 font-medium text-sm transition-all ${
                                    uploadType === t.v
                                        ? "border-violet-500 bg-violet-500/15 text-violet-300"
                                        : "border-slate-600 text-slate-400 hover:border-slate-500"
                                }`}
                            >
                                <span className="text-base">{t.label}</span>
                                <span className="text-xs text-slate-500">{t.desc}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5">Tiêu đề tài liệu *</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Ví dụ: N3 Grammar - Minna no Nihongo..."
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5">Cấp độ JLPT mục tiêu</label>
                                <select
                                    value={targetLevel}
                                    onChange={e => setTargetLevel(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                >
                                    <option value="">Không chỉ định</option>
                                    {JLPT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">Mô tả nội dung (giúp AI sinh câu hỏi tốt hơn)</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={2}
                                placeholder="Ví dụ: Tài liệu ngữ pháp N3, chủ đề giao tiếp hàng ngày..."
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none transition-colors"
                            />
                        </div>

                        {uploadType === "READING" && (
                            <div>
                                <label className="block text-sm text-slate-400 mb-1.5">Số câu hỏi sẽ sinh sau upload</label>
                                <input
                                    type="number" min={1} max={50} value={questionCount}
                                    onChange={e => setQuestionCount(Number(e.target.value))}
                                    className="w-32 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">
                                File {uploadType === "READING" ? "PDF/DOC/DOCX" : "MP3/WAV/M4A/OGG"} *
                            </label>
                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-violet-500 transition-colors bg-slate-700/20 group">
                                <input
                                    type="file"
                                    accept={uploadType === "READING" ? ".pdf,.doc,.docx" : ".mp3,.wav,.m4a,.ogg"}
                                    onChange={e => setFile(e.target.files[0])}
                                    className="hidden"
                                />
                                {file ? (
                                    <div className="text-center">
                                        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                                        <p className="text-emerald-400 text-sm font-medium">{file.name}</p>
                                        <p className="text-slate-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-violet-400 mx-auto mb-1 transition-colors" />
                                        <p className="text-slate-400 text-sm">Kéo thả hoặc click để chọn file</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm disabled:opacity-60 transition-all shadow-lg shadow-violet-500/25"
                            >
                                {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                {uploading ? "Đang upload..." : "Upload tài liệu"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowUpload(false)}
                                className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold text-sm transition-all"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Document List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
                </div>
            ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <BookOpen className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">Chưa có tài liệu nào</p>
                    <p className="text-sm">Upload tài liệu đầu tiên để bắt đầu sinh câu hỏi</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc) => {
                        const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.PENDING;
                        const typeCfg = TYPE_CONFIG[doc.documentType] || TYPE_CONFIG.READING;
                        const StatusIcon = statusCfg.icon;
                        const TypeIcon = typeCfg.icon;
                        const isGenerating = generatingId === doc.documentId;
                        const isDeleting = deletingId === doc.documentId;

                        return (
                            <div
                                key={doc.documentId}
                                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-5 hover:border-slate-600 transition-all backdrop-blur"
                            >
                                {/* Type icon */}
                                <div className={`p-3 rounded-xl ${typeCfg.bg} flex-shrink-0`}>
                                    <TypeIcon className={`w-6 h-6 ${typeCfg.color}`} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-white truncate">{doc.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeCfg.bg} ${typeCfg.color} font-medium flex-shrink-0`}>
                                            {typeCfg.label}
                                        </span>
                                        {doc.targetLevel && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 flex-shrink-0">
                                                {doc.targetLevel}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-400 text-xs truncate mb-2">{doc.description || "Không có mô tả"}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span>📁 {doc.fileType}</span>
                                        <span>🤖 {doc.generatedQuestionCount || 0} câu hỏi</span>
                                        <span>👤 {doc.uploadedByName || "Staff"}</span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusCfg.bg} flex-shrink-0`}>
                                    <StatusIcon className={`w-3.5 h-3.5 ${statusCfg.color} ${doc.status === "PROCESSING" ? "animate-spin" : ""}`} />
                                    <span className={`text-xs font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleGenerate(doc)}
                                        disabled={isGenerating || doc.status === "PROCESSING"}
                                        title="AI sinh câu hỏi từ tài liệu này"
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium text-xs transition-all ${
                                            doc.status === "PROCESSED"
                                                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
                                                : "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 border border-violet-500/30"
                                        } disabled:opacity-40`}
                                    >
                                        {isGenerating
                                            ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            : <Zap className="w-3.5 h-3.5" />
                                        }
                                        {doc.status === "PROCESSED" ? "Sinh thêm" : "Sinh câu hỏi"}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(doc)}
                                        disabled={isDeleting}
                                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-40"
                                    >
                                        {isDeleting
                                            ? <RefreshCw className="w-4 h-4 animate-spin" />
                                            : <Trash2 className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
