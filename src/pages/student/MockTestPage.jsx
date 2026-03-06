import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, BrainCircuit, Loader2, Trophy } from 'lucide-react';
// Import API của bạn vào đây (Sửa lại đường dẫn import cho đúng với project của bạn nhé)
import { getTest } from '@/services/test';

export default function MockTestPage() {
    // 1. Các State quản lý dữ liệu và luồng làm bài
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);

    // State cho từng câu hỏi
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // 2. Gọi API khi component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoading(true);
                const response = await getTest();

                // Giả sử API trả về mảng trực tiếp trong response.data
                // Tùy theo format BE của bạn, có thể là response.data.data hoặc response.data.questions
                const data = response.data || [];
                setQuestions(data);
            } catch (error) {
                console.error("Lỗi khi tải câu hỏi thi:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    // 3. Xử lý logic
    const handleSubmit = () => {
        if (!selectedOption) return;
        setIsSubmitted(true);

        const currentQ = questions[currentIndex];
        const correctAns = currentQ.correctAnswer;
        const selectedValue = currentQ.options[selectedOption]; // Lấy nội dung text của đáp án đã chọn

        // Kiểm tra bao lô: So sánh Key (A, B...) và so sánh cả Value (nội dung text) + loại bỏ khoảng trắng
        const isActuallyCorrect =
            String(selectedOption).trim().toUpperCase() === String(correctAns).trim().toUpperCase() ||
            String(selectedValue).trim() === String(correctAns).trim();

        if (isActuallyCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            // Chuyển sang câu tiếp theo
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            // Đã hết câu hỏi -> Hiện màn hình kết quả
            setIsFinished(true);
        }
    };

    // 4. Các màn hình UI (Loading, Empty, Kết quả)
    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-green-600 space-y-4 pt-20">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-semibold text-slate-500">Đang tải đề thi...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center pt-20 text-slate-500 font-medium">
                Không tìm thấy câu hỏi nào. Vui lòng thử lại sau!
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Hoàn thành bài thi!</h2>
                <p className="text-slate-500 mb-8">Bạn đã trả lời đúng <strong className="text-green-600 text-xl">{score}/{questions.length}</strong> câu hỏi.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors w-full"
                >
                    Làm lại bài thi
                </button>
            </div>
        );
    }

    // 5. Màn hình câu hỏi hiện tại
    const currentQuestionData = questions[currentIndex];

    // (Optional) Xử lý tách chuỗi nếu API trả câu hỏi gộp ví dụ: "Chọn trợ từ... 「私（　）学生です。」"
    // Tách phần instruction và phần câu cần điền để UI đẹp hơn.
    const contentParts = currentQuestionData?.content?.split('「');
    const instruction = contentParts?.[0] || currentQuestionData?.content;
    const sentence = contentParts?.[1] ? contentParts[1].replace('」', '') : null;

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <BrainCircuit size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Luyện thi {currentQuestionData.jlptLevel || "N5"}</h1>
                        <p className="text-sm font-medium text-slate-500">Chủ đề: {currentQuestionData.topic}</p>
                    </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
                    Câu hỏi {currentIndex + 1}/{questions.length}
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-semibold text-slate-700 mb-6 leading-relaxed">
                    {instruction}
                </h2>

                {/* Highlighted Sentence (Chỉ hiện nếu API có chứa chuỗi trong ngoặc kép 「 」) */}
                {sentence && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 mb-8 flex justify-center items-center">
                        <p className="text-3xl font-bold text-slate-800 tracking-wider">
                            {sentence}
                        </p>
                    </div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {Object.entries(currentQuestionData.options || {}).map(([key, value]) => {
                        // Lưu ý: Đảm bảo API của bạn có field "correctAnswer", nếu không chỗ này cần sửa lại logic check
                        // Sửa lại logic kiểm tra isCorrect cho giao diện
            const correctAns = currentQuestionData.correctAnswer;
            const isCorrect = 
              String(key).trim().toUpperCase() === String(correctAns).trim().toUpperCase() ||
              String(value).trim() === String(correctAns).trim();
              
            const isSelected = key === selectedOption;

                        let buttonStyle = "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 group w-full ";
                        let iconBoxStyle = "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ";

                        if (!isSubmitted) {
                            buttonStyle += isSelected
                                ? "border-green-500 bg-green-50 text-green-800 shadow-sm"
                                : "border-slate-200 bg-white hover:border-green-300 hover:bg-slate-50 text-slate-700";
                            iconBoxStyle += isSelected
                                ? "bg-green-500 text-white"
                                : "bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-600";
                        } else {
                            if (isCorrect) {
                                buttonStyle += "border-green-500 bg-green-50 text-green-800 ring-2 ring-green-500/20";
                                iconBoxStyle += "bg-green-500 text-white";
                            } else if (isSelected && !isCorrect) {
                                buttonStyle += "border-rose-500 bg-rose-50 text-rose-800";
                                iconBoxStyle += "bg-rose-500 text-white";
                            } else {
                                buttonStyle += "border-slate-100 bg-slate-50 opacity-60 text-slate-400 cursor-not-allowed";
                                iconBoxStyle += "bg-slate-200 text-slate-400";
                            }
                        }

                        return (
                            <button
                                key={key}
                                disabled={isSubmitted}
                                onClick={() => setSelectedOption(key)}
                                className={buttonStyle}
                            >
                                <div className={iconBoxStyle}>{key}</div>
                                <span className="font-semibold text-lg flex-1">{value}</span>

                                {isSubmitted && isCorrect && <CheckCircle2 className="text-green-500" size={24} />}
                                {isSubmitted && isSelected && !isCorrect && <XCircle className="text-rose-500" size={24} />}
                            </button>
                        );
                    })}
                </div>

                {/* Action Area */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    {!isSubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                            className={`
                px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all
                ${selectedOption
                                    ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }
              `}
                        >
                            Kiểm tra đáp án
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3.5 bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-all hover:-translate-y-0.5 shadow-md"
                        >
                            {currentIndex < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                            <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Dòng chữ nhỏ mờ (Debug/ID) */}
            <div className="text-center text-slate-400 text-xs font-medium">
                Question ID: {currentQuestionData.questionId}
            </div>
        </div>
    );
}