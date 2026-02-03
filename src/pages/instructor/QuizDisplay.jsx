import { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getLessonQuiz } from "../../services/lessonService";

const QuizDisplay = ({ lessonId, quizStatus }) => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  /* ================= FETCH QUIZ ================= */
  const fetchQuiz = async () => {
    if (!lessonId) return;

    try {
      setLoading(true);
      setError("");
      const res = await getLessonQuiz(lessonId);
      setQuizData(res.data.data);
    } catch (err) {
      // Nếu chưa có quiz (404) thì không hiển thị error
      if (err.response?.status === 404) {
        setQuizData(null);
      } else {
        setError(err.response?.data?.message || "Không thể tải quiz");
        console.error("Fetch quiz failed:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch khi lessonId thay đổi
  useEffect(() => {
    if (lessonId) {
      fetchQuiz();
      setIsExpanded(false); // Reset expanded state when lesson changes
    } else {
      setQuizData(null);
      setIsExpanded(false);
    }
  }, [lessonId]);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div>
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600" />
          Quiz Questions
        </h4>
        <div className="flex items-center justify-center p-8 bg-purple-50 rounded-xl border border-purple-200">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <span className="ml-3 text-sm text-purple-700 font-medium">
            Đang tải quiz...
          </span>
        </div>
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error) {
    return (
      <div>
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600" />
          Quiz Questions
        </h4>
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 text-center">
          <XCircle size={32} className="text-red-500 mx-auto mb-3" />
          <p className="text-sm text-red-700 mb-3">{error}</p>
          <button
            onClick={fetchQuiz}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  /* ================= EMPTY STATE (No Quiz) ================= */
  if (!quizData && quizStatus === "COMPLETED") {
    return (
      <div>
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600" />
          Quiz Questions
        </h4>
        <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
          <p className="text-sm text-yellow-700 mb-3">
            Quiz đã được tạo nhưng chưa tải được dữ liệu. Vui lòng thử lại.
          </p>
          <button
            onClick={fetchQuiz}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold text-sm hover:bg-yellow-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Tải lại Quiz
          </button>
        </div>
      </div>
    );
  }

  /* ================= NO QUIZ YET ================= */
  // Không hiển thị gì nếu chưa có quiz hoặc đang processing
  if (
    !quizData &&
    (!quizStatus || quizStatus === "PENDING" || quizStatus === "PROCESSING")
  ) {
    return null;
  }

  // Fallback cho trường hợp không có data và status không rõ ràng
  if (!quizData) {
    return (
      <div>
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600" />
          Quiz Questions
        </h4>
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <p className="text-sm text-slate-500">Chưa có quiz cho lesson này</p>
        </div>
      </div>
    );
  }

  /* ================= HELPER: Parse Options ================= */
  // Convert options object {A: "text", B: "text"...} to array format
  const parseOptions = (optionsObj) => {
    if (!optionsObj) return [];
    return Object.entries(optionsObj).map(([key, text]) => ({
      optionId: key,
      optionText: text,
      isCorrect: false, // Will be set later
    }));
  };

  /* ================= QUIZ DATA DISPLAY ================= */
  return (
    <div>
      {/* Expandable Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              {quizData.title || "Quiz Questions"}
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {quizData.totalQuestions || quizData.questions?.length || 0} câu
              hỏi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchQuiz();
            }}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-600"
            title="Làm mới quiz"
          >
            <RefreshCw size={16} />
          </button>

          <div
            className={`p-2 rounded-lg transition-all ${isExpanded ? "bg-purple-100 text-purple-700" : "text-slate-400 group-hover:text-purple-600"}`}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Quiz Questions */}
          {quizData.questions?.map((question, index) => {
            // Parse options and mark correct answer
            const options = parseOptions(question.options);
            options.forEach((opt) => {
              if (opt.optionId === question.correctAnswer) {
                opt.isCorrect = true;
              }
            });

            return (
              <div
                key={question.questionId}
                className="p-5 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 rounded-xl border border-purple-200 hover:border-purple-300 transition-all"
              >
                {/* Question */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                    {index + 1}
                  </div>
                  <p className="text-slate-800 font-semibold flex-1 leading-relaxed text-base">
                    {question.content || question.questionText}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2 ml-11">
                  {options.map((option) => (
                    <div
                      key={option.optionId}
                      className={`p-3.5 rounded-lg border-2 transition-all ${
                        option.isCorrect
                          ? "bg-green-50 border-green-300 ring-2 ring-green-200 shadow-sm"
                          : "bg-white border-purple-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Option Label */}
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            option.isCorrect
                              ? "bg-green-500 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {option.optionId}
                        </span>

                        {/* Option Content */}
                        <div className="flex-1">
                          <span
                            className={`text-sm leading-relaxed block ${
                              option.isCorrect
                                ? "font-semibold text-green-900"
                                : "text-slate-700"
                            }`}
                          >
                            {option.optionText}
                          </span>
                          {option.isCorrect && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                              <span className="text-green-600 font-bold text-xs">
                                Đáp án đúng
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="mt-4 ml-11 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold text-sm shrink-0">
                        💡 Giải thích:
                      </span>
                      <p className="text-sm text-blue-900 leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quiz Metadata */}
          <div className="p-5 bg-gradient-to-r from-slate-50 to-purple-50/30 rounded-xl border border-slate-200">
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
              Thông tin Quiz
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles size={18} className="text-purple-600" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    Quiz ID
                  </span>
                  <p className="text-sm text-slate-700 font-mono truncate max-w-[200px]">
                    {quizData.quizId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle size={18} className="text-blue-600" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    Ngày tạo
                  </span>
                  <p className="text-sm text-slate-700 font-semibold">
                    {new Date(quizData.createdAt).toLocaleString("vi-VN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              {quizData.lessonTitle && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <CheckCircle size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      Lesson
                    </span>
                    <p className="text-sm text-slate-700 font-semibold">
                      {quizData.lessonTitle}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDisplay;
