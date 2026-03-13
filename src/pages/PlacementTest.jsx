import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen, Headphones, ChevronRight, ChevronLeft,
    CheckCircle, Clock, Send, Trophy, Star, Target,
    Volume2, ArrowRight, RotateCcw, TrendingUp, XCircle, AlertCircle, Home as HomeIcon, X
} from "lucide-react";
import toast from "react-hot-toast";
import { getPlacementQuestions, submitPlacementTest } from "@/services/placementService";
import { useAuth } from "@/context/AuthContext";

const JLPT_INFO = {
    N5: { color: "#10b981", label: "Sơ cấp", desc: "Hiểu tiếng Nhật cơ bản", icon: "⭐" },
    N4: { color: "#3b82f6", label: "Cơ bản",  desc: "Giao tiếp hàng ngày",    icon: "⭐⭐" },
    N3: { color: "#8b5cf6", label: "Trung cấp",desc: "Đọc văn bản thực tế",  icon: "⭐⭐⭐" },
    N2: { color: "#f59e0b", label: "Nâng cao",  desc: "Gần với bản ngữ",     icon: "⭐⭐⭐⭐" },
    N1: { color: "#ef4444", label: "Thành thạo",desc: "Thành thạo tiếng Nhật",icon: "⭐⭐⭐⭐⭐" },
};

// ── Step 0: Landing ──────────────────────────────────────────────────────────
function LandingStep({ onStart, loading }) {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1117] via-[#13111c] to-[#0f1117] flex items-center justify-center p-6 relative">
            {/* Back button for landing */}
            <button 
                onClick={() => navigate("/")}
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
            >
                <ArrowRight className="rotate-180 w-5 h-5" /> Trang chủ
            </button>
            <div className="max-w-2xl w-full text-center">
                {/* Hero icon */}
                <div className="relative mb-8">
                    <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
                        <span className="text-5xl">🎯</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <span className="text-sm">✨</span>
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold text-white mb-3 leading-tight">
                    Kiểm tra trình độ<br />
                    <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                        tiếng Nhật JLPT
                    </span>
                </h1>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    Làm bài test 25 câu trong ~15 phút.<br />
                    AI phân tích trình độ và gợi ý khóa học phù hợp — <strong className="text-violet-400">miễn phí, không cần đăng nhập.</strong>
                </p>

                {/* Level preview */}
                <div className="flex justify-center gap-3 mb-10 flex-wrap">
                    {Object.entries(JLPT_INFO).map(([lv, info]) => (
                        <div key={lv} className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur">
                            <span className="text-lg">{info.icon}</span>
                            <span className="font-bold text-white text-sm">{lv}</span>
                            <span className="text-slate-400 text-xs">{info.label}</span>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: <Clock className="w-5 h-5 text-amber-400" />, title: "~15 phút", desc: "Làm nhanh, không giới hạn thời gian" },
                        { icon: <Target className="w-5 h-5 text-violet-400" />, title: "25 câu hỏi", desc: "Đọc hiểu & nghe" },
                        { icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, title: "AI phân tích", desc: "Kết quả chi tiết tức thì" },
                    ].map((f) => (
                        <div key={f.title} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 text-center backdrop-blur">
                            <div className="flex justify-center mb-2">{f.icon}</div>
                            <div className="font-bold text-white text-sm mb-0.5">{f.title}</div>
                            <div className="text-slate-500 text-xs">{f.desc}</div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onStart}
                    disabled={loading}
                    className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 transition-all duration-200 disabled:opacity-60 hover:scale-105 active:scale-95"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Đang tải câu hỏi...
                        </>
                    ) : (
                        <>
                            Bắt đầu kiểm tra
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// ── Step 1: Quiz ─────────────────────────────────────────────────────────────
function QuizStep({ questions, answers, setAnswers, onSubmit, submitting }) {
    const [current, setCurrent] = useState(0);
    const audioRef = useRef(null);
    const q = questions[current];
    const total = questions.length;
    const answered = Object.keys(answers).length;
    const progress = ((current + 1) / total) * 100;

    const select = (qId, opt) => {
        setAnswers(prev => ({ ...prev, [qId]: opt }));
    };

    const handleSubmit = () => {
        if (answered < total) {
            const unanswered = total - answered;
            if (!window.confirm(`Bạn còn ${unanswered} câu chưa trả lời. Vẫn nộp bài?`)) return;
        }
        onSubmit();
    };

    if (!q) return null;
    const opts = q.options || {};

    return (
        <div className="min-h-screen bg-[#0f1117] flex flex-col">
            {/* Progress bar */}
            <div className="h-1 bg-slate-800">
                <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => window.confirm("Bạn có chắc muốn thoát bài test? Tiến trình sẽ không được lưu.") && (window.location.href = "/")}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
                        title="Thoát"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="h-6 w-[1px] bg-slate-700 mx-1" />
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm">
                            Câu <strong className="text-white">{current + 1}</strong> / {total}
                        </span>
                        {q.jlptLevel && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                {q.jlptLevel}
                            </span>
                        )}
                        {q.questionType === "LISTENING" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                                <Headphones className="w-3 h-3" /> Nghe
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Đã trả lời:</span>
                    <span className="font-bold text-emerald-400">{answered}/{total}</span>
                </div>
            </div>

            {/* Question area */}
            <div className="flex-1 flex items-start justify-center p-6 pt-10">
                <div className="max-w-2xl w-full">
                    {/* Audio player for listening */}
                    {q.questionType === "LISTENING" && q.audioUrl && (
                        <div className="mb-6 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                            <div className="flex items-center gap-3 mb-3">
                                <Volume2 className="w-5 h-5 text-cyan-400" />
                                <span className="text-cyan-300 font-medium text-sm">Hãy nghe đoạn hội thoại sau:</span>
                            </div>
                            <audio ref={audioRef} controls src={q.audioUrl} className="w-full" style={{ colorScheme: "dark" }} />
                        </div>
                    )}

                    {/* Topic badge */}
                    {q.topic && (
                        <span className="inline-block text-xs text-slate-500 mb-3 px-2 py-0.5 rounded-full border border-slate-700">
                            {q.topic}
                        </span>
                    )}

                    {/* Question text */}
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6 backdrop-blur">
                        <p className="text-white text-lg leading-relaxed font-medium">{q.content}</p>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {Object.entries(opts).map(([key, val]) => {
                            const selected = answers[q.questionId] === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => select(q.questionId, key)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                                        selected
                                            ? "border-violet-500 bg-violet-500/15 shadow-lg shadow-violet-500/20"
                                            : "border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/70"
                                    }`}
                                >
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                                        selected ? "bg-violet-600 text-white" : "bg-slate-700 text-slate-300"
                                    }`}>
                                        {key}
                                    </div>
                                    <span className={`text-sm leading-relaxed ${selected ? "text-violet-100" : "text-slate-300"}`}>
                                        {val}
                                    </span>
                                    {selected && <CheckCircle className="w-5 h-5 text-violet-400 ml-auto flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="sticky bottom-0 bg-[#0f1117]/95 backdrop-blur border-t border-slate-800 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => setCurrent(c => Math.max(0, c - 1))}
                        disabled={current === 0}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" /> Trước
                    </button>

                    {/* Dot navigation */}
                    <div className="flex-1 flex items-center justify-center gap-1.5 overflow-x-auto py-1">
                        {questions.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 ${
                                    i === current
                                        ? "bg-violet-500 w-6"
                                        : answers[questions[i]?.questionId]
                                            ? "bg-emerald-500"
                                            : "bg-slate-600"
                                }`}
                            />
                        ))}
                    </div>

                    {current < total - 1 ? (
                        <button
                            onClick={() => setCurrent(c => Math.min(total - 1, c + 1))}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 transition-all"
                        >
                            Tiếp <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-60 transition-all"
                        >
                            {submitting
                                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                : <Send className="w-4 h-4" />
                            }
                            {submitting ? "Đang chấm..." : "Nộp bài"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Step 2: Result ───────────────────────────────────────────────────────────
function ResultStep({ result, onRetry }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const levelInfo = JLPT_INFO[result.estimatedLevel] || JLPT_INFO.N5;
    const levelColor = levelInfo.color;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1117] via-[#13111c] to-[#0f1117] p-6">
            <div className="max-w-3xl mx-auto">
                {/* Result hero */}
                <div className="text-center mb-8 pt-8">
                    <div className="relative inline-block mb-6">
                        <div
                            className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl mx-auto"
                            style={{ background: `${levelColor}20`, border: `2px solid ${levelColor}40` }}
                        >
                            <div className="text-center">
                                <div className="text-4xl font-black" style={{ color: levelColor }}>
                                    {result.estimatedLevel}
                                </div>
                                <div className="text-white text-xs font-medium mt-0.5">{levelInfo.label}</div>
                            </div>
                        </div>
                        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎉</div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-white mb-2">Kết quả của bạn</h2>
                    <p className="text-slate-400">{levelInfo.desc}</p>

                    {/* Score bar */}
                    <div className="mt-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 backdrop-blur">
                        <div className="flex justify-between text-sm text-slate-400 mb-2">
                            <span>Điểm số</span>
                            <span className="font-bold text-white">{result.correctCount}/{result.totalQuestions} câu đúng</span>
                        </div>
                        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${result.scorePercent}%`,
                                    background: `linear-gradient(90deg, ${levelColor}cc, ${levelColor})`
                                }}
                            />
                        </div>
                        <div className="text-right mt-1 font-bold text-xl" style={{ color: levelColor }}>
                            {result.scorePercent?.toFixed(1)}%
                        </div>
                    </div>
                </div>

                {/* AI Comment */}
                {result.overallComment && (
                    <div className="bg-slate-800/50 border border-violet-500/20 rounded-2xl p-5 mb-4 backdrop-blur">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-sm">🤖</div>
                            <span className="text-violet-400 font-semibold text-sm">Nhận xét từ AI</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{result.overallComment}</p>
                    </div>
                )}

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {result.strengths?.length > 0 && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 font-semibold text-sm">Điểm mạnh</span>
                            </div>
                            <ul className="space-y-1.5">
                                {result.strengths.map((s, i) => (
                                    <li key={i} className="text-slate-300 text-xs flex items-start gap-1.5">
                                        <span className="text-emerald-500 mt-0.5">•</span>{s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {result.weaknesses?.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 font-semibold text-sm">Cần cải thiện</span>
                            </div>
                            <ul className="space-y-1.5">
                                {result.weaknesses.map((w, i) => (
                                    <li key={i} className="text-slate-300 text-xs flex items-start gap-1.5">
                                        <span className="text-red-500 mt-0.5">•</span>{w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Study recommendation */}
                {result.studyRecommendation && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400 font-semibold text-sm">Lộ trình học khuyến nghị</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{result.studyRecommendation}</p>
                    </div>
                )}

                {/* Suggested Courses */}
                {result.suggestedCourses?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            Khóa học phù hợp với bạn
                        </h3>
                        <div className="space-y-3">
                            {result.suggestedCourses.map((course) => (
                                <div
                                    key={course.courseId}
                                    className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600 transition-all cursor-pointer group backdrop-blur"
                                    onClick={() => navigate(`/student/course/${course.courseId}`)}
                                >
                                    {course.thumbnailUrl && (
                                        <img
                                            src={course.thumbnailUrl}
                                            alt={course.title}
                                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-white text-sm truncate group-hover:text-violet-300 transition-colors">{course.title}</h4>
                                        <p className="text-slate-400 text-xs truncate mt-0.5">{course.description}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            {course.level && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{course.level}</span>
                                            )}
                                            <span className="text-emerald-400 text-sm font-bold">
                                                {course.price === 0 ? "Miễn phí" : `${course.price?.toLocaleString()}₫`}
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all"
                    >
                        <HomeIcon className="w-4 h-4" /> Về Trang chủ
                    </button>
                    <button
                        onClick={onRetry}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm transition-all"
                    >
                        <RotateCcw className="w-4 h-4" /> Làm lại
                    </button>
                    {!user ? (
                        <button
                            onClick={() => navigate("/register", { state: { suggestedLevel: result.estimatedLevel } })}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-500/25 transition-all"
                        >
                            Đăng ký ngay <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/student/dashboard")}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-500/25 transition-all"
                        >
                            Vào học ngay <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PlacementTest() {
    const [step, setStep] = useState("landing"); // landing | quiz | result
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleStart = async () => {
        try {
            setLoading(true);
            const res = await getPlacementQuestions(25);
            const qs = res.data?.data || res.data || [];
            if (qs.length === 0) {
                toast.error("Chưa có câu hỏi trong hệ thống. Vui lòng thử lại sau!");
                return;
            }
            setQuestions(qs);
            setAnswers({});
            setStep("quiz");
        } catch (err) {
            toast.error("Không thể tải câu hỏi. Backend có đang chạy không?");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const payload = questions.map(q => ({
                questionId: q.questionId,
                selectedAnswer: answers[q.questionId] || null,
            }));
            const res = await submitPlacementTest(payload);
            const data = res.data?.data || res.data;
            setResult(data);
            setStep("result");
            window.scrollTo(0, 0);
        } catch (err) {
            toast.error(err.response?.data?.message || "Nộp bài thất bại. Vui lòng thử lại!");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetry = () => {
        setStep("landing");
        setQuestions([]);
        setAnswers({});
        setResult(null);
    };

    if (step === "landing") return <LandingStep onStart={handleStart} loading={loading} />;
    if (step === "quiz")    return <QuizStep questions={questions} answers={answers} setAnswers={setAnswers} onSubmit={handleSubmit} submitting={submitting} />;
    if (step === "result")  return <ResultStep result={result} onRetry={handleRetry} />;
    return null;
}
