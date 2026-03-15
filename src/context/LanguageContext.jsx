import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
    vi: {
        nav_features: "Tính năng",
        nav_courses: "Khóa học",
        nav_about: "Về chúng tôi",
        nav_login: "Đăng nhập",
        nav_register: "Đăng ký ngay",
        hero_badge: "Nền tảng học tiếng Nhật AI thế hệ mới",
        hero_title_1: "Chinh phục",
        hero_title_2: "thông minh hơn với",
        hero_desc: "Học tiếng Nhật cá nhân hóa. AI phân tích trình độ, gợi ý lộ trình và đồng hành cùng bạn trên mọi nẻo đường chinh phục N5 đến N1.",
        hero_cta: "Test trình độ miễn phí",
        hero_stats: "Hơn 2,000+ học viên đã tin tưởng và tham gia test trình độ.",
        val_core_title: "Giá trị cốt lõi",
        val_core_subtitle: "Học tiếng Nhật chưa bao giờ dễ dàng đến thế",
        footer_rights: "© 2026 SABOJP. All rights reserved",
        level_target: "Mục tiêu",
        now_learning: "Đang học",
        test_now: "BẮT ĐẦU TEST NGAY 👋",
        test_free_note: "* Hoàn toàn miễn phí, không yêu cầu đăng nhập",
        platform: "Nền tảng",
        company: "Công ty",
        support: "Hỗ trợ",
        footer_desc: "Nền tảng học tiếng Nhật ứng dụng công nghệ AI hàng đầu Việt Nam. Giúp học viên chinh phục JLPT nhanh chóng và dễ dàng.",
        test_flow_title: "Bạn thuộc Level nào trong JLPT?",
        test_flow_desc: "Đừng học mù quáng. Hãy để AI xác định trình độ thực tế của bạn và gợi ý lộ trình học tập hiệu quả nhất ngay hôm nay.",
        trust_badges_title: "Tin dùng bởi học viên từ các trường đại học",
        // Features
        feat_1_title: "AI Placement Test", feat_1_desc: "Xác định trình độ JLPT chính xác trong 15 phút.",
        feat_2_title: "Lộ trình cá nhân hóa", feat_2_desc: "Hệ thống tự động đề xuất khóa học phù hợp nhất.",
        feat_3_title: "Hỗ trợ 24/7 với AI Chat", feat_3_desc: "Giải đáp ngữ pháp và từ vựng ngay lập tức.",
        feat_4_title: "Kho tài liệu khổng lồ", feat_4_desc: "500+ bài giảng và hàng ngàn bài tập từ N5-N1.",
        feat_5_title: "Cộng đồng học thuật", feat_5_desc: "Giao lưu và luyện tập cùng hàng ngàn học viên.",
        feat_6_title: "Chứng nhận uy tín", feat_6_desc: "Cấp chứng nhận hoàn thành sau mỗi khóa học.",
        // Test Steps
        step_1_title: "Làm bài Test", step_1_desc: "25 câu hỏi thông minh",
        step_2_title: "AI Phân tích", step_2_desc: "Đưa ra ưu & nhược điểm",
        step_3_title: "Gợi ý lộ trình", step_3_desc: "Khóa học phù hợp nhất",
        step_4_title: "Bắt đầu học", step_4_desc: "Nâng level thần tốc",
        // Footer Links
        f_plat_1: "Tính năng chính", f_plat_4: "Lộ trình học tập",
        f_plat_2: "AI Placement Test", f_plat_3: "Thư viện bài giảng",
        f_comp_1: "Về chúng tôi", f_comp_2: "Giảng viên", f_comp_3: "Tin tức & Sự kiện", f_comp_4: "Liên hệ",
        f_supp_1: "Trung tâm trợ giúp", f_supp_2: "Điều khoản dịch vụ", f_supp_3: "Chính sách bảo mật", f_supp_4: "Cộng đồng hội viên"
    },
    en: {
        nav_features: "Features",
        nav_courses: "Courses",
        nav_about: "About Us",
        nav_login: "Login",
        nav_register: "Register Now",
        hero_badge: "Next-Gen AI Japanese Learning Platform",
        hero_title_1: "Conquer",
        hero_title_2: "smarter with",
        hero_desc: "Personalized Japanese learning. AI analyzes your level, suggests paths, and accompanies you from N5 to N1.",
        hero_cta: "Free Placement Test",
        hero_stats: "Over 2,000+ students trusted and took the placement test.",
        val_core_title: "Core Values",
        val_core_subtitle: "Japanese learning has never been this easy",
        footer_rights: "© 2026 SABOJP. All rights reserved",
        level_target: "Level Target",
        now_learning: "Now Learning",
        test_now: "START TEST NOW 👋",
        test_free_note: "* Completely free, no login required",
        platform: "Platform",
        company: "Company",
        support: "Support",
        footer_desc: "Leading AI-powered Japanese learning platform. Helping students conquer JLPT quickly and easily.",
        test_flow_title: "What's your JLPT Level?",
        test_flow_desc: "Don't study blindly. Let AI determine your real level and suggest the most effective path today.",
        trust_badges_title: "Trusted by students from top universities",
        // Features
        feat_1_title: "AI Placement Test", feat_1_desc: "Determine your exact JLPT level in just 15 minutes.",
        feat_2_title: "Personalized Path", feat_2_desc: "Smaller chunks of learning recommended for you.",
        feat_3_title: "24/7 AI Chat Support", feat_3_desc: "Instant answers for grammar and vocabulary.",
        feat_4_title: "Huge Library", feat_4_desc: "500+ video lessons and thousands of exercises.",
        feat_5_title: "Academic Community", feat_5_desc: "Interact and practice with thousands of students.",
        feat_6_title: "Official Certificates", feat_6_desc: "Earn certificates after completing each course.",
        // Test Steps
        step_1_title: "Take the Test", step_1_desc: "25 smart questions",
        step_2_title: "AI Analysis", step_2_desc: "Identify strengths & weaknesses",
        step_3_title: "Path Suggestion", step_3_desc: "Most suitable course route",
        step_4_title: "Start Learning", step_4_desc: "Fast-track your JLPT level",
        // Footer Links
        f_plat_1: "Key Features", f_plat_4: "Learning Paths",
        f_plat_2: "AI Placement Test", f_plat_3: "Lesson Library",
        f_comp_1: "About Us", f_comp_2: "Instructors", f_comp_3: "News & Events", f_comp_4: "Contact",
        f_supp_1: "Help Center", f_supp_2: "Terms of Service", f_supp_3: "Privacy Policy", f_supp_4: "Community"
    },
    ja: {
        nav_features: "機能",
        nav_courses: "コース",
        nav_about: "私たちについて",
        nav_login: "ログイン",
        nav_register: "今すぐ登録",
        hero_badge: "次世代AI日本語学習プラットフォーム",
        hero_title_1: "を攻略する",
        hero_title_2: "AIでもっと賢く",
        hero_desc: "個別化された日本語学習。AIがあなたのレベルを分析し、学習ルートを提案し、N5からN1まで寄り添います。",
        hero_cta: "無料レベル判定テスト",
        hero_stats: "2,000人以上の学生が信頼し、レベル判定テストを受けました。",
        val_core_title: "核心的価値",
        val_core_subtitle: "日本語学習がこれほど簡単になったことはありません",
        footer_rights: "© 2026 SABOJP. 全著作権所有",
        level_target: "目標レベル",
        now_learning: "学習中",
        test_now: "今すぐテストを開始 👋",
        test_free_note: "* 完全に無料、ログイン不要",
        platform: "プラットフォーム",
        company: "会社",
        support: "サポート",
        footer_desc: "AI搭載の日本語学習プラットフォーム。JLPTの迅速かつ簡単な攻略を支援します。",
        test_flow_title: "あなたのJLPTレベルは？",
        test_flow_desc: "やみくもに勉強しないでください。AIにレベルを判定させ、最適な道を提案させましょう。",
        trust_badges_title: "トップ大学の学生に信頼されています",
        // Features
        feat_1_title: "AI判定テスト", feat_1_desc: "15分で正確なJLPTレベルを判定します。",
        feat_2_title: "個別ルート", feat_2_desc: "最適なコースを自動的に提案します。",
        feat_3_title: "24/7 AIチャット", feat_3_desc: "文法や語彙の質問に即座に回答します。",
        feat_4_title: "膨大なライブラリ", feat_4_desc: "500以上の授業と数千の練習問題。",
        feat_5_title: "学術コミュニティ", feat_5_desc: "何千人もの学生と交流し、練習します。",
        feat_6_title: "修了証書", feat_6_desc: "各レベル修了後に証明書を発行します。",
        // Test Steps
        step_1_title: "テストを受ける", step_1_desc: "25のスマートな質問",
        step_2_title: "AI分析", step_2_desc: "長所と短所を特定する",
        step_3_title: "ルート提案", step_3_desc: "最適なコースの提案",
        step_4_title: "学習開始", step_4_desc: "最速でレベルアップ",
        // Footer Links
        f_plat_1: "主な機能", f_plat_4: "学習パス",
        f_plat_2: "AI判定テスト", f_plat_3: "ライブラリ",
        f_comp_1: "私たちについて", f_comp_2: "講師紹介", f_comp_3: "ニュース", f_comp_4: "お問い合わせ",
        f_supp_1: "ヘルプセンター", f_supp_2: "利用規約", f_supp_3: "プライバシー", f_supp_4: "コミュニティ"
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem("app_lang") || "vi");

    useEffect(() => {
        localStorage.setItem("app_lang", language);
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
