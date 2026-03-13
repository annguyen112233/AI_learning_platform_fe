import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2, XCircle, ArrowRight, BrainCircuit, Loader2, Trophy,
  BookOpen, ChevronRight, RotateCcw, Sparkles,
  TrendingUp, AlertTriangle, ThumbsUp, Volume2, Headphones, Eye
} from 'lucide-react';
import { getPlacementQuestions, submitPlacementTest } from '@/services/placementService';
import { useNavigate } from 'react-router-dom';

// ── Màu sắc theo JLPT Level ──────────────────────────────────────────────────
const LEVEL_CONFIG = {
  N1: { color: 'from-red-500 to-rose-600',    badge: 'bg-red-100 text-red-700 border-red-200',       label: 'Thượng cấp',  emoji: '🏆' },
  N2: { color: 'from-orange-500 to-amber-600', badge: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Cao cấp',    emoji: '🥇' },
  N3: { color: 'from-blue-500 to-indigo-600',  badge: 'bg-blue-100 text-blue-700 border-blue-200',    label: 'Trung cấp',   emoji: '⚡' },
  N4: { color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Sơ cấp cao', emoji: '📗' },
  N5: { color: 'from-slate-500 to-slate-600',  badge: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Sơ cấp',     emoji: '🌱' },
};

export default function MockTestPage() {
  const navigate = useNavigate();

  // State làm bài
  const [questions, setQuestions]       = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading]       = useState(true);
  const [isFinished, setIsFinished]     = useState(false);
  const [score, setScore]               = useState(0);
  const [answers, setAnswers]           = useState([]); // [{questionId, selectedAnswer}]

  // State từng câu
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted]       = useState(false);

  // State kết quả AI
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult]       = useState(null);

  // Ref audio (reset khi chuyển câu)
  const audioRef = useRef(null);
  const [playCount, setPlayCount] = useState(0);  // Số lần đã nghe
  const [hasPlayed, setHasPlayed] = useState(false); // Đã nghe ít nhất 1 lần?

  // 1. Lấy câu hỏi
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await getPlacementQuestions(25);
        const data = response.data?.data || response.data || [];
        setQuestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Lỗi khi tải câu hỏi thi:', error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Reset audio khi chuyển câu
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayCount(0);
    setHasPlayed(false);
  }, [currentIndex]);

  // 2. Kiểm tra đáp án
  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);

    const currentQ   = questions[currentIndex];
    const correctAns = currentQ.correctAnswer;
    const selectedValue = currentQ.options[selectedOption];

    const isActuallyCorrect =
      String(selectedOption).trim().toUpperCase() === String(correctAns).trim().toUpperCase() ||
      String(selectedValue).trim() === String(correctAns).trim();

    if (isActuallyCorrect) setScore(prev => prev + 1);

    setAnswers(prev => [
      ...prev,
      { questionId: currentQ.questionId, selectedAnswer: selectedOption }
    ]);
  };

  // 3. Câu tiếp / Nộp bài
  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Hết câu → nộp bài lên backend
      setIsFinished(true);
      setIsAnalyzing(true);
      try {
        const allAnswers = [
          ...answers,
          { questionId: questions[currentIndex].questionId, selectedAnswer: selectedOption || '' }
        ];
        const res = await submitPlacementTest(allAnswers);
        const result = res.data;
        setAiResult(result);
        if (result?.estimatedLevel) {
          localStorage.setItem('jlptLevel', result.estimatedLevel);
        }
      } catch (err) {
        console.error('Lỗi nộp bài:', err);
        const percent  = Math.round((score / questions.length) * 100);
        const fallback = percent >= 85 ? 'N1' : percent >= 70 ? 'N2' : percent >= 55 ? 'N3' : percent >= 40 ? 'N4' : 'N5';
        setAiResult({
          correctCount: score, totalQuestions: questions.length, scorePercent: percent,
          estimatedLevel: fallback,
          overallComment: `Bạn đạt ${score}/${questions.length} câu. Trình độ ước tính: ${fallback}.`,
          strengths:  ['Đã hoàn thành bài kiểm tra'],
          weaknesses: ['Cần ôn luyện thêm'],
          studyRecommendation: 'Hãy luyện tập đều đặn mỗi ngày.',
          suggestedCourses: []
        });
        if (fallback) localStorage.setItem('jlptLevel', fallback);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // ── Loading / Empty ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-green-600 space-y-4 pt-20">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-semibold text-slate-500">Đang tải đề thi...</p>
      </div>
    );
  }
  if (questions.length === 0) {
    return <div className="text-center pt-20 text-slate-500 font-medium">Không tìm thấy câu hỏi nào. Vui lòng thử lại sau!</div>;
  }

  // ── Màn hình kết quả AI ───────────────────────────────────────────────────
  if (isFinished) {
    if (isAnalyzing) {
      return (
        <div className="max-w-xl mx-auto mt-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30 animate-pulse">
            <Sparkles size={44} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Sensei AI đang phân tích...</h2>
          <p className="text-slate-500 mb-8">Đang chấm điểm và xác định trình độ JLPT của bạn</p>
          <div className="flex items-center justify-center gap-3">
            {['Chấm điểm', 'Phân tích', 'Gợi ý khóa học'].map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
                  <span className="text-xs text-slate-400">{s}</span>
                </div>
                {i < 2 && <ChevronRight size={14} className="text-slate-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    const level        = aiResult?.estimatedLevel || 'N5';
    const lvCfg        = LEVEL_CONFIG[level] || LEVEL_CONFIG.N5;
    const scorePercent = aiResult?.scorePercent  ?? Math.round((score / questions.length) * 100);
    const correctCount = aiResult?.correctCount  ?? score;
    const totalQ       = aiResult?.totalQuestions ?? questions.length;

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header Score Card */}
        <div className={`relative bg-gradient-to-br ${lvCfg.color} rounded-3xl p-8 text-white shadow-2xl overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Trophy size={28} className="text-yellow-300" />
                <span className="text-white/80 font-bold text-lg">Kết quả bài thi</span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-6xl">{lvCfg.emoji}</span>
                <div>
                  <div className="text-5xl font-black">{level}</div>
                  <div className="text-white/80 font-bold">{lvCfg.label}</div>
                </div>
              </div>
              <p className="text-white/70 text-sm max-w-sm mt-3 leading-relaxed">
                {aiResult?.overallComment}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[140px] border border-white/20 shrink-0">
              <div className="text-5xl font-black">{scorePercent}%</div>
              <div className="text-white/70 text-sm mt-1">{correctCount}/{totalQ} câu đúng</div>
              <div className="mt-3 w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-300 rounded-full" style={{ width: `${scorePercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Điểm mạnh / Yếu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-100 rounded-xl"><ThumbsUp size={18} className="text-emerald-600" /></div>
              <h3 className="font-bold text-slate-800">Điểm mạnh</h3>
            </div>
            <ul className="space-y-2">
              {(aiResult?.strengths || ['Đã hoàn thành bài kiểm tra']).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-100 rounded-xl"><AlertTriangle size={18} className="text-amber-600" /></div>
              <h3 className="font-bold text-slate-800">Cần cải thiện</h3>
            </div>
            <ul className="space-y-2">
              {(aiResult?.weaknesses || ['Cần ôn luyện thêm']).map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <XCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lộ trình học */}
        {aiResult?.studyRecommendation && (
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 rounded-xl"><TrendingUp size={18} className="text-blue-600" /></div>
              <h3 className="font-bold text-slate-800">Lộ trình học đề xuất</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{aiResult.studyRecommendation}</p>
          </div>
        )}

        {/* Khóa học gợi ý */}
        {aiResult?.suggestedCourses?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-100 rounded-xl"><Sparkles size={18} className="text-emerald-600" /></div>
              <h3 className="font-bold text-lg text-slate-800">Khóa học phù hợp với bạn</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${lvCfg.badge}`}>{level}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiResult.suggestedCourses.slice(0, 4).map(course => (
                <div
                  key={course.courseId}
                  onClick={() => navigate(`/student/course/${course.courseId}`)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="h-36 overflow-hidden relative">
                    <img
                      src={course.thumbnailUrl || `https://placehold.co/400x200/059669/white?text=${course.level}`}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${(LEVEL_CONFIG[course.level] || LEVEL_CONFIG.N5).badge}`}>
                        {course.level}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs font-bold px-3 py-1 rounded-lg">
                      {!course.price || Number(course.price) === 0 ? 'MIỄN PHÍ' : `${Number(course.price).toLocaleString()}đ`}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">{course.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={18} /> Làm lại
          </button>
          <button
            onClick={() => {
              localStorage.setItem('jlptLevel', level);
              navigate('/student/dashboard');
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold bg-gradient-to-r ${lvCfg.color} hover:opacity-90 shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <BookOpen size={18} />
            Xem khóa học phù hợp trình độ {level}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── Màn hình câu hỏi ─────────────────────────────────────────────────────
  const currentQuestionData = questions[currentIndex];
  const isListening = currentQuestionData?.questionType === 'LISTENING';
  const contentParts = currentQuestionData?.content?.split('「');
  const instruction  = contentParts?.[0] || currentQuestionData?.content;
  const sentence     = contentParts?.[1] ? contentParts[1].replace('」', '') : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isListening ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
          }`}>
            {isListening ? <Headphones size={20} strokeWidth={2.5} /> : <BrainCircuit size={20} strokeWidth={2.5} />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {isListening ? '🎧 Câu nghe • ' : ''}{currentQuestionData.jlptLevel || 'N5'}
            </h1>
            <p className="text-sm font-medium text-slate-500">Chủ đề: {currentQuestionData.topic}</p>
          </div>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
          Câu hỏi {currentIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Progress bar tổng */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

        {/* Badge loại câu hỏi */}
        <div className="flex items-center gap-2 mb-4">
          {isListening ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-bold">
              <Headphones size={13} /> Phần Nghe (Listening)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
              <Eye size={13} /> Phần Đọc (Reading)
            </span>
          )}
        </div>

        <h2 className="text-lg font-semibold text-slate-700 mb-6 leading-relaxed">{instruction}</h2>

        {/* Audio Player — chỉ hiện cho câu LISTENING */}
        {isListening && currentQuestionData.audioUrl && (
          <div className="mb-6 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/30">
                <Volume2 size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-purple-800 text-sm">Nghe đoạn hội thoại</p>
                <p className="text-purple-600 text-xs">
                  Đã nghe: {playCount} lần
                  {!hasPlayed && ' • Hãy nghe trước khi chọn đáp án'}
                </p>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={currentQuestionData.audioUrl}
              controls
              className="w-full h-12 rounded-xl"
              onPlay={() => { setHasPlayed(true); }}
              onEnded={() => setPlayCount(prev => prev + 1)}
              style={{ accentColor: '#7c3aed' }}
            />
            {!hasPlayed && (
              <p className="text-xs text-purple-500 mt-2 text-center font-medium animate-pulse">
                ⚠️ Nhớ nghe audio trước khi chọn đáp án nhé!
              </p>
            )}
          </div>
        )}

        {sentence && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 mb-8 flex justify-center">
            <p className="text-3xl font-bold text-slate-800 tracking-wider">{sentence}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {Object.entries(currentQuestionData.options || {}).map(([key, value]) => {
            const correctAns = currentQuestionData.correctAnswer;
            const isCorrect  =
              String(key).trim().toUpperCase() === String(correctAns).trim().toUpperCase() ||
              String(value).trim() === String(correctAns).trim();
            const isSelected = key === selectedOption;

            let btn  = 'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 group w-full ';
            let icon = 'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ';

            if (!isSubmitted) {
              btn  += isSelected ? 'border-green-500 bg-green-50 text-green-800 shadow-sm' : 'border-slate-200 bg-white hover:border-green-300 hover:bg-slate-50 text-slate-700';
              icon += isSelected ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-600';
            } else {
              if (isCorrect)             { btn += 'border-green-500 bg-green-50 text-green-800 ring-2 ring-green-500/20'; icon += 'bg-green-500 text-white'; }
              else if (isSelected)       { btn += 'border-rose-500 bg-rose-50 text-rose-800'; icon += 'bg-rose-500 text-white'; }
              else                       { btn += 'border-slate-100 bg-slate-50 opacity-60 text-slate-400 cursor-not-allowed'; icon += 'bg-slate-200 text-slate-400'; }
            }

            return (
              <button key={key} disabled={isSubmitted} onClick={() => setSelectedOption(key)} className={btn}>
                <div className={icon}>{key}</div>
                <span className="font-semibold text-lg flex-1">{value}</span>
                {isSubmitted && isCorrect  && <CheckCircle2 className="text-green-500" size={24} />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="text-rose-500" size={24} />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
          <div className="text-sm text-slate-400 font-medium">✅ {score} câu đúng</div>
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                selectedOption ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Kiểm tra đáp án
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3.5 bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-all hover:-translate-y-0.5 shadow-md"
            >
              {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : '🎯 Nộp bài & xem kết quả AI'}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="text-center text-slate-400 text-xs font-medium">
        Question ID: {currentQuestionData.questionId}
      </div>
    </div>
  );
}