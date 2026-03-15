import React from "react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen, Target, Zap, Users, Star, ArrowRight,
    CheckCircle, MessageCircle, PlayCircle, ShieldCheck,
    Facebook, Twitter, Youtube
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import Button from "@/components/ui/Button";
import heroImage from "@/assets/images/hero-japanese.png";


export default function Home() {
    const navigate = useNavigate();
    const { language, t, changeLanguage } = useLanguage();


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
                        <span onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="font-bold text-blue-600 hover:text-blue-700 transition-all cursor-pointer">{t("nav_features")}</span>
                        <span onClick={() => navigate("/login")} className="font-bold text-blue-600 hover:text-blue-700 transition-all cursor-pointer">{t("nav_courses")}</span>
                        <span onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })} className="font-bold text-blue-600 hover:text-blue-700 transition-all cursor-pointer">{t("nav_about")}</span>
                    </div>







                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="px-5 py-2.5 font-bold text-slate-600 hover:text-green-600 transition-all"
                        >
                            {t("nav_login")}
                        </button>

                        <Button
                            onClick={() => navigate("/register")}
                            className="!bg-green-600 hover:!bg-green-700 text-white !rounded-xl !px-6 font-bold shadow-lg shadow-green-100"
                        >
                            {t("nav_register")}
                        </Button>

                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-16 pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="z-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/50 border border-green-200 text-green-700 font-bold text-sm mb-6 animate-fade-in">
                            <Zap size={16} /> {t("hero_badge")}
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                            {t("hero_title_1")} <span className="text-green-600">JLPT</span> <br />
                            {t("hero_title_2")} <span className="relative">

                                AI
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0,10 Q50,20 100,10" stroke="#16a34a" strokeWidth="4" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            {t("hero_desc")}
                        </p>


                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button
                                onClick={() => navigate("/placement-test")}
                                className="w-full sm:w-auto !py-4 !px-8 !bg-green-600 hover:!bg-green-700 !rounded-2xl text-xl font-black shadow-xl shadow-green-200 flex items-center gap-3 active:scale-95 transition-all text-white"
                            >
                                {t("hero_cta")} <ArrowRight />
                            </Button>

                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
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
                            {t("hero_stats")}
                        </p>

                    </div>

                    {/* Hero Illustration/Image */}
                    <div className="relative">
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                        <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src={heroImage}
                                alt="Japanese Culture"
                                className="rounded-[32px] w-full h-auto object-cover aspect-[4/3]"
                            />


                            {/* Floating UI Elements */}
                            <div className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-xl font-bold">N3</div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">{t("level_target")}</p>
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
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">{t("now_learning")}</p>
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
                    <p className="text-center text-slate-400 font-bold text-sm uppercase tracking-[0.3em] mb-8">{t("trust_badges_title")}</p>

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
                        <h2 className="text-sm font-black text-green-600 uppercase tracking-[0.2em] mb-4">{t("val_core_title")}</h2>
                        <h3 className="text-4xl font-black text-slate-900 mb-4">{t("val_core_subtitle")}</h3>
                        <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
                    </div>


                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Target className="w-8 h-8 text-white" />,
                                color: "bg-blue-600",
                                title: t("feat_1_title"),
                                desc: t("feat_1_desc")
                            },
                            {
                                icon: <Zap className="w-8 h-8 text-white" />,
                                color: "bg-green-600",
                                title: t("feat_2_title"),
                                desc: t("feat_2_desc")
                            },
                            {
                                icon: <MessageCircle className="w-8 h-8 text-white" />,
                                color: "bg-purple-600",
                                title: t("feat_3_title"),
                                desc: t("feat_3_desc")
                            },
                            {
                                icon: <BookOpen className="w-8 h-8 text-white" />,
                                color: "bg-amber-600",
                                title: t("feat_4_title"),
                                desc: t("feat_4_desc")
                            },
                            {
                                icon: <Users className="w-8 h-8 text-white" />,
                                color: "bg-indigo-600",
                                title: t("feat_5_title"),
                                desc: t("feat_5_desc")
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-white" />,
                                color: "bg-rose-600",
                                title: t("feat_6_title"),
                                desc: t("feat_6_desc")
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
                    <h2 className="text-4xl md:text-5xl font-black mb-6">{t("test_flow_title")}</h2>
                    <p className="text-xl text-green-50 mb-12 max-w-2xl mx-auto font-medium opacity-90">
                        {t("test_flow_desc")}
                    </p>


                    <div className="grid sm:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
                        {[
                            { step: "01", title: t("step_1_title"), desc: t("step_1_desc") },
                            { step: "02", title: t("step_2_title"), desc: t("step_2_desc") },
                            { step: "03", title: t("step_3_title"), desc: t("step_3_desc") },
                            { step: "04", title: t("step_4_title"), desc: t("step_4_desc") }
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
                        {t("test_now")}
                    </button>

                    <p className="mt-6 text-sm font-medium text-green-100 italic">
                        {t("test_free_note")}
                    </p>

                </div>
            </section>

            {/* Footer */}
            <footer id="footer" className="bg-slate-900 text-slate-400 py-16 px-6">

                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white text-2xl">
                                🐳
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">SABO<span className="text-green-600">JP</span></span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">
                            {t("footer_desc")}
                        </p>

                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/thanh.nam.910862" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all cursor-pointer">
                                <Facebook size={18} />
                            </a>
                            <a href="https://www.facebook.com/thanh.nam.910862" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all cursor-pointer">
                                <Twitter size={18} />
                            </a>
                            <a href="https://www.facebook.com/thanh.nam.910862" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all cursor-pointer">
                                <Youtube size={18} />
                            </a>
                        </div>

                    </div>

                    <div>
                        <h5 className="text-white font-bold mb-6">{t("platform")}</h5>

                        <ul className="space-y-4 text-sm font-medium">
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_plat_1")}</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_plat_2")}</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_plat_3")}</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_plat_4")}</li>
                        </ul>

                    </div>

                    <div>
                        <h5 className="text-white font-bold mb-6">{t("company")}</h5>

                        <ul className="space-y-4 text-sm font-medium">
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_comp_1")}</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_comp_2")}</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_comp_3")}</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_comp_4")}</li>
                        </ul>

                    </div>

                    <div>
                        <h5 className="text-white font-bold mb-6">{t("support")}</h5>

                        <ul className="space-y-4 text-sm font-medium">
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_supp_1")}</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_supp_2")}</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_supp_3")}</li>
                            <li className="hover:text-green-500 cursor-pointer transition-colors">{t("f_supp_4")}</li>
                        </ul>

                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 flex flex-col md:row items-center justify-between gap-4">
                    <p className="text-xs">{t("footer_rights")}</p>
                    <div className="flex gap-6 text-xs font-semibold">
                        <span
                            onClick={() => changeLanguage("vi")}
                            className={`cursor-pointer transition-colors ${language === "vi" ? "text-green-500" : "hover:text-white"}`}
                        >
                            Tiếng Việt (VN)
                        </span>
                        <span
                            onClick={() => changeLanguage("en")}
                            className={`cursor-pointer transition-colors ${language === "en" ? "text-green-500" : "hover:text-white"}`}
                        >
                            English (US)
                        </span>
                        <span
                            onClick={() => changeLanguage("ja")}
                            className={`cursor-pointer transition-colors ${language === "ja" ? "text-green-500" : "hover:text-white"}`}
                        >
                            Japanese (JP)
                        </span>
                    </div>
                </div>

            </footer>
        </div>
    );
}
