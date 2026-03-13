import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
    MessageSquare, Search, CheckCircle, HelpCircle,
    CornerDownRight, Clock, Send, ThumbsUp, Trash2, EyeOff
} from 'lucide-react';
import { getDiscussions, replyDiscussion, deleteDiscussion } from '@/services/discussionService';

const QUICK_REPLIES = [
    "Cảm ơn bạn đã phản hồi tích cực! Chúc bạn học tốt.",
    "Chào bạn, bạn vui lòng chụp ảnh màn hình lỗi gửi vào nhóm Zalo để được support nhanh nhé.",
    "Bạn thử kiểm tra lại version của Node.js xem sao nhé.",
    "Vấn đề này đã được giải thích kỹ ở phút 15:30 trong video, bạn xem lại giúp mình nha."
];

export default function StaffDiscussions() {
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ unanswered: 0, total: 0 });
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    const fetchDiscussions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDiscussions(filter, search);
            const data = res.data?.data;
            const list = Array.isArray(data?.data) ? data.data : [];
            setDiscussions(list);
            setStats({
                unanswered: list.filter(d => d.status === 'UNANSWERED').length,
                total: data?.totalElements ?? list.length
            });
        } catch (err) {
            console.error('Error fetching discussions:', err);
            setDiscussions([]);
        } finally {
            setLoading(false);
        }
    }, [filter, search]);

    useEffect(() => { fetchDiscussions(); }, [fetchDiscussions]);

    const handleReplyClick = (id) => {
        setReplyingTo(replyingTo === id ? null : id);
        setReplyText('');
    };

    const submitReply = async (id) => {
        if (!replyText.trim()) return;
        try {
            await replyDiscussion(id, replyText);
            toast.success('Đã gửi câu trả lời thành công!');
            setReplyingTo(null);
            setReplyText('');
            fetchDiscussions();
        } catch {
            toast.error('Gửi thất bại, vui lòng thử lại!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
        try {
            await deleteDiscussion(id);
            toast.success('Đã xóa bình luận!');
            fetchDiscussions();
        } catch {
            toast.error('Xóa thất bại!');
        }
    };

    const formatTime = (ts) => {
        if (!ts) return '';
        try { return new Date(ts).toLocaleString('vi-VN'); } catch { return ts; }
    };

    return (
        <div className="space-y-6 font-sans text-slate-800 animate-fade-in-up">

            {/* 1. HEADER & STATS */}
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                        <MessageSquare className="text-blue-600" size={28} /> Q&A & Bình luận
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Quản lý tương tác, giải đáp thắc mắc học viên.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 px-3">
                        <div className={`w-2 h-2 rounded-full ${stats.unanswered > 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className="text-xs font-bold text-slate-500">{stats.unanswered} câu hỏi chưa trả lời</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-2 px-3">
                        <span className="text-xs font-bold text-slate-500">Tổng: <span className="text-slate-800">{stats.total}</span></span>
                    </div>
                </div>
            </div>

            {/* 2. TOOLBAR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7 lg:col-span-8 flex flex-wrap gap-2">
                    {[
                        { key: 'ALL', label: 'Tất cả', active: 'bg-slate-800 text-white border-slate-800' },
                        { key: 'UNANSWERED', label: 'Cần trả lời', active: 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm', icon: <HelpCircle size={16} /> },
                        { key: 'QUESTIONS', label: 'Chỉ xem Hỏi đáp', active: 'bg-blue-50 text-blue-600 border-blue-200' },
                    ].map(tab => (
                        <button key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border flex items-center gap-2 transition-all
                                ${filter === tab.key ? tab.active : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                        >
                            {tab.icon}{tab.label}
                        </button>
                    ))}
                </div>
                <div className="md:col-span-5 lg:col-span-4 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm nội dung hoặc tên học viên..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
                    />
                </div>
            </div>

            {/* 3. DISCUSSION LIST */}
            <div className="space-y-4">
                {loading && <div className="text-center py-8 text-slate-400">Đang tải...</div>}

                {!loading && discussions.map((item) => (
                    <div key={item.id}
                        className={`bg-white rounded-2xl border transition-all ${item.status === 'UNANSWERED' ? 'border-rose-100 shadow-sm' : 'border-slate-100 hover:border-blue-100'}`}
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${item.avatarColor || 'bg-blue-100 text-blue-600'}`}>
                                        {item.avatar}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                            {item.user}
                                            {item.type === 'QUESTION' && (
                                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 font-bold uppercase">Câu hỏi</span>
                                            )}
                                        </h4>
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                            <Clock size={12} /> {formatTime(item.timestamp)}
                                            <span className="mx-1">•</span>
                                            <span className="text-slate-500 font-medium">{item.lesson}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pl-14">
                                <p className="text-slate-700 text-sm leading-relaxed mb-3">{item.content}</p>

                                {/* Show existing admin reply */}
                                {item.adminReply && (
                                    <div className="flex items-start gap-2 mb-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                        <CornerDownRight size={14} className="text-blue-400 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="text-[10px] font-bold text-blue-500 uppercase">Phản hồi từ Staff</span>
                                            <p className="text-sm text-blue-700">{item.adminReply}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                        <ThumbsUp size={14} /> {item.likes > 0 ? item.likes : 'Thích'}
                                    </button>
                                    <button
                                        onClick={() => handleReplyClick(item.id)}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${replyingTo === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 hover:text-blue-600'}`}
                                    >
                                        <MessageSquare size={14} /> Trả lời
                                    </button>
                                    {item.status === 'UNANSWERED' && (
                                        <span className="text-rose-500 flex items-center gap-1 ml-auto animate-pulse">
                                            <HelpCircle size={14} /> Chưa được giải đáp
                                        </span>
                                    )}
                                    {item.status === 'ANSWERED' && (
                                        <span className="text-emerald-600 flex items-center gap-1 ml-auto">
                                            <CheckCircle size={14} /> Đã giải đáp
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* INLINE REPLY FORM */}
                        {replyingTo === item.id && (
                            <div className="border-t border-slate-100 bg-slate-50/50 p-4 pl-16 rounded-b-2xl">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {QUICK_REPLIES.map((qr, idx) => (
                                        <button key={idx} onClick={() => setReplyText(qr)}
                                            className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded hover:border-blue-300 hover:text-blue-600 transition-colors"
                                        >
                                            {qr.substring(0, 30)}...
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`Trả lời ${item.user}...`}
                                        className="w-full p-3 pr-12 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none min-h-[80px] bg-white"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => submitReply(item.id)}
                                        className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                                        disabled={!replyText.trim()}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                                <div className="flex justify-end items-center mt-2">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleDelete(item.id)}
                                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors" title="Xóa bình luận này">
                                            <Trash2 size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors" title="Ẩn bình luận">
                                            <EyeOff size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {!loading && discussions.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <div className="inline-flex p-4 rounded-full bg-slate-50 text-slate-300 mb-3"><MessageSquare size={32} /></div>
                        <p className="text-slate-500 font-medium">Không tìm thấy nội dung nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
}