import React from "react";
import { useNavigate } from "react-router-dom";
import { 
    BookOpen, Target, Zap, Users, Star, ArrowRight, 
    CheckCircle, MessageCircle, PlayCircle, ShieldCheck
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-green-200">
                            🐳
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tight">SABO<span className="text-green-600">JP</span></span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="font-semibold text-slate-600 hover:text-green-600 transition-colors">Tính năng</a>
                        <a href="#courses" className="font-semibold text-slate-600 hover:text-green-600 transition-colors">Khóa học</a>
                        <a href="#about" className="font-semibold text-slate-600 hover:text-green-600 transition-colors">Về chúng tôi</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate("/login")}
                            className="px-5 py-2.5 font-bold text-slate-600 hover:text-green-600 transition-all"
                        >
                            Đăng nhập
                        </button>
                        <Button 
                            onClick={() => navigate("/register")}
                            className="!bg-green-600 hover:!bg-green-700 text-white !rounded-xl !px-6 font-bold shadow-lg shadow-green-100"
                        >
                            Đăng ký ngay
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-16 pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="z-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/50 border border-green-200 text-green-700 font-bold text-sm mb-6 animate-fade-in">
                            <Zap size={16} /> Nền tảng học tiếng Nhật AI thế hệ mới
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                            Chinh phục <span className="text-green-600">JLPT</span> <br />
                            thông minh hơn với <span className="relative">
                                AI
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0,10 Q50,20 100,10" stroke="#16a34a" strokeWidth="4" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Học tiếng Nhật cá nhân hóa. AI phân tích trình độ, gợi ý lộ trình và đồng hành cùng bạn trên mọi nẻo đường chinh phục N5 đến N1.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button 
                                onClick={() => navigate("/placement-test")}
                                className="w-full sm:w-auto !py-4 !px-8 !bg-green-600 hover:!bg-green-700 !rounded-2xl text-xl font-black shadow-xl shadow-green-200 flex items-center gap-3 active:scale-95 transition-all text-white"
                            >
                                Test trình độ miễn phí <ArrowRight />
                            </Button>
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-white bg-green-100 text-green-700 font-bold flex items-center justify-center shadow-sm text-xs">
                                    +2k
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 font-medium">
                            Hơn <span className="text-green-600 font-bold">2,000+ học viên</span> đã tin tưởng và tham gia test trình độ.
                        </p>
                    </div>

                    {/* Hero Illustration/Image */}
                    <div className="relative">
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                        
                        <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img 
                                src="https://images.unsplash.com/photo-1542385151-efd9000785a0?w=1000&auto=format&fit=crop" 
                                alt="Japanese Culture" 
                                className="rounded-[32px] w-full h-auto object-cover aspect-[4/3]"
                            />
                            
                            {/* Floating UI Elements */}
                            <div className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-xl font-bold">N3</div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Level Target</p>
                                        <p className="text-sm font-bold text-slate-800">85% Complete</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -right-6 bottom-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-bounce-slow delay-1000">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                        <PlayCircle />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Now Learning</p>
                                        <p className="text-sm font-bold text-slate-800">Kanji N3 - Lesson 12</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges - Replaced with Text Badges to avoid broken images */}
            <section className="bg-white py-12 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-slate-400 font-bold text-sm uppercase tracking-[0.3em] mb-8">Tin dùng bởi học viên từ các trường đại học</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 font-black text-2xl text-slate-400">
                        <span className="hover:text-green-600 transition-colors">FPT UNIVERSITY</span>
                        <span className="hover:text-green-600 transition-colors">HUST</span>
                        <span className="hover:text-green-600 transition-colors">VNU</span>
                        <span className="hover:text-green-600 transition-colors">UEH</span>
                        <span className="hover:text-green-600 transition-colors">FTU</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-black text-green-600 uppercase tracking-[0.2em] mb-4">Giá trị cốt lõi</h2>
                        <h3 className="text-4xl font-black text-slate-900 mb-4">Học tiếng Nhật chưa bao giờ <br /> dễ dàng đến thế</h3>
                        <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Target className="w-8 h-8 text-white" />,
                                color: "bg-blue-600",
                                title: "AI Placement Test",
                                desc: "Dựa trên hàng ngàn dữ liệu đề thi thực tế, AI của chúng tôi sẽ xác định chính xác trình độ JLPT hiện tại của bạn chỉ trong 15 phút."
                            },
                            {
                                icon: <Zap className="w-8 h-8 text-white" />,
                                color: "bg-green-600",
                                title: "Lộ trình cá nhân hóa",
                                desc: "Sau khi làm bài test, hệ thống sẽ tự động đề xuất những khóa học và kỹ năng bạn đang thiếu để bứt phá level nhanh nhất."
                            },
                            {
                                icon: <MessageCircle className="w-8 h-8 text-white" />,
                                color: "bg-purple-600",
                                title: "Hỗ trợ 24/7 với AI Chat",
                                desc: "Bất cứ khi nào gặp cấu trúc ngữ pháp khó hay từ vựng lạ, 'Sensei AI' luôn sẵn sàng giải đáp cho bạn ngay lập tức."
                            },
                            {
                                icon: <BookOpen className="w-8 h-8 text-white" />,
                                color: "bg-amber-600",
                                title: "Kho tài liệu khổng lồ",
                                desc: "Hơn 500+ bài giảng video, hàng ngàn bài tập từ N5 đến N1 được biên soạn bởi các chuyên gia tiếng Nhật hàng đầu."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-white" />,
                                color: "bg-indigo-600",
                                title: "Cộng đồng học thuật",
                                desc: "Giao lưu, thảo luận và cùng nhau luyện tập với hàng ngàn học viên khác trên khắp cả nước."
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-white" />,
                                color: "bg-rose-600",
                                title: "Chứng chỉ hoàn thành",
                                desc: "SABOJP cấp chứng nhận uy tín sau mỗi khóa học nâng level, minh chứng cho sự nỗ lực và trình độ của bạn."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_50px_rgba(22,163,74,0.1)] transition-all duration-300 group">
                                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Test Flow Section (CTA for Placement Test) */}
            <section className="py-24 px-6 bg-green-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 skew-x-[-20deg] translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Bạn thuộc Level nào trong JLPT?</h2>
                    <p className="text-xl text-green-50 mb-12 max-w-2xl mx-auto font-medium opacity-90">
                        Đừng học mù quáng. Hãy để AI xác định trình độ thực tế của bạn và gợi ý lộ trình học tập hiệu quả nhất ngay hôm nay.
                    </p>
                    
                    <div className="grid sm:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
                        {[
                            { step: "01", title: "Làm bài Test", desc: "25 câu hỏi thông minh" },
                            { step: "02", title: "AI Phân tích", desc: "Đưa ra ưu & nhược điểm" },
                            { step: "03", title: "Gợi ý lộ trình", desc: "Khóa học phù hợp nhất" },
                            { step: "04", title: "Bắt đầu học", desc: "Nâng level thần tốc" }
                        ].map((s, idx) => (
                            <div key={idx} className="relative p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                                <span className="absolute -top-3 -left-3 w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center font-black text-sm shadow-md">
                                    {s.step}
                                </span>
                                <p className="font-bold text-lg mb-1">{s.title}</p>
                                <p className="text-xs text-green-100">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => navigate("/placement-test")}
                        className="bg-white text-green-600 px-12 py-5 rounded-2xl font-black text-2xl shadow-2xl hover:bg-slate-50 hover:-translate-y-1 transition-all active:translate-y-0"
                    >
                        BẮT ĐẦU TEST NGAY 👋
                    </button>
                    <p className="mt-6 text-sm font-medium text-green-100 italic">
                        * Hoàn toàn miễn phí, không yêu cầu đăng nhập
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
                    <div className="col-span-1 md:col-span-1">
                         <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                                🐳
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">SABO<span className="text-green-600">JP</span></span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">
                            Nền tảng học tiếng Nhật ứng dụng công nghệ AI hàng đầu Việt Nam. Giúp học viên chinh phục JLPT nhanh chóng và dễ dàng.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all cursor-pointer">f</div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all cursor-pointer">t</div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all cursor-pointer">y</div>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-white font-bold mb-6">Nền tảng</h5>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Tính năng chính</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">AI Placement Test</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Thư viện bài giảng</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Lộ trình học tập</li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white font-bold mb-6">Công ty</h5>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Về chúng tôi</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Giảng viên</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Tin tức & Sự kiện</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Liên hệ</li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white font-bold mb-6">Hỗ trợ</h5>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Trung tâm trợ giúp</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Điều khoản dịch vụ</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Chính sách bảo mật</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">Cộng đồng hội viên</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 flex flex-col md:row items-center justify-between gap-4">
                    <p className="text-xs">© 2026 SABOJP. All rights reserved. Power by Gemini AI 🐳</p>
                    <div className="flex gap-6 text-xs font-semibold">
                        <span className="hover:text-white cursor-pointer transition-colors">Tiếng Việt (VN)</span>
                        <span className="hover:text-white cursor-pointer transition-colors">English (US)</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Japanese (JP)</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
