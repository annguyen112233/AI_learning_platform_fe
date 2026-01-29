import React, { useState } from 'react';
import { 
  Award, Star, Zap, TrendingUp, Lock, CheckCircle2, 
  Trophy, Target, Calendar, Crown, Medal, Share2
} from 'lucide-react';

// --- COMPONENTS ---

// 1. Stat Card (Thẻ thống kê nhỏ)
const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
       <Icon size={24} />
    </div>
    <div>
       <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</div>
       <div className="text-xl font-bold text-slate-800">{value}</div>
       {subtext && <div className="text-xs text-emerald-600 font-medium">{subtext}</div>}
    </div>
  </div>
);

// 2. Achievement Badge (Thẻ huy hiệu)
const AchievementCard = ({ title, desc, icon: Icon, progress, total, isUnlocked, rarity }) => {
  const percent = Math.min(100, Math.round((progress / total) * 100));
  
  // Màu sắc dựa trên độ hiếm
  const rarityConfig = {
    common: "bg-slate-100 text-slate-500 border-slate-200",
    rare: "bg-blue-50 text-blue-600 border-blue-100",
    epic: "bg-purple-50 text-purple-600 border-purple-100",
    legendary: "bg-amber-50 text-amber-600 border-amber-100",
  };
  
  const activeStyle = rarityConfig[rarity] || rarityConfig.common;

  return (
    <div className={`relative group p-5 rounded-2xl border transition-all duration-300 flex flex-col h-full
      ${isUnlocked 
        ? 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1' 
        : 'bg-slate-50/50 border-slate-100 opacity-70 grayscale hover:grayscale-0 hover:opacity-100'
      }
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isUnlocked ? activeStyle : 'bg-slate-200 text-slate-400'}`}>
           {isUnlocked ? <Icon size={28} strokeWidth={1.5} /> : <Lock size={24} />}
        </div>
        {isUnlocked && (
          <div className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide bg-slate-100 text-slate-500">
            {rarity}
          </div>
        )}
      </div>

      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-4 flex-1 leading-relaxed">{desc}</p>

      {/* Progress Bar */}
      <div className="mt-auto">
         <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className={isUnlocked ? "text-emerald-600" : "text-slate-400"}>
              {progress}/{total}
            </span>
            <span className="text-slate-400">{percent}%</span>
         </div>
         <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-emerald-500' : 'bg-slate-300'}`}
              style={{ width: `${percent}%` }}
            />
         </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Dữ liệu mẫu
  const userStats = {
     level: 12,
     currentXP: 2450,
     nextLevelXP: 3000,
     streak: 15,
     totalBadges: 8
  };

  const achievements = [
    { id: 1, title: "Khởi đầu nan", desc: "Hoàn thành bài học đầu tiên của bạn.", icon: CheckCircle2, progress: 1, total: 1, isUnlocked: true, rarity: "common" },
    { id: 2, title: "Học giả chăm chỉ", desc: "Duy trì chuỗi học tập (Streak) trong 7 ngày liên tiếp.", icon: Zap, progress: 7, total: 7, isUnlocked: true, rarity: "rare" },
    { id: 3, title: "Bậc thầy Kanji", desc: "Học thuộc 100 chữ Kanji N5.", icon: Award, progress: 85, total: 100, isUnlocked: false, rarity: "epic" },
    { id: 4, title: "Thần đồng ngữ pháp", desc: "Đạt điểm tuyệt đối trong 5 bài kiểm tra ngữ pháp.", icon: Star, progress: 3, total: 5, isUnlocked: false, rarity: "legendary" },
    { id: 5, title: "Cú đêm", desc: "Hoàn thành một bài học sau 10 giờ tối.", icon: Calendar, progress: 1, total: 1, isUnlocked: true, rarity: "common" },
    { id: 6, title: "Nhà giao tiếp", desc: "Thực hành hội thoại với AI trong 30 phút.", icon: Trophy, progress: 10, total: 30, isUnlocked: false, rarity: "rare" },
  ];

  const filteredAchievements = activeTab === 'all' 
    ? achievements 
    : activeTab === 'unlocked' 
      ? achievements.filter(a => a.isUnlocked) 
      : achievements.filter(a => !a.isUnlocked);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-800">
      
      {/* 1. HERO SECTION: USER LEVEL SUMMARY */}
      <div className="bg-white border-b border-slate-200">
         <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
               
               {/* Left: Avatar & Level Circle */}
               <div className="relative shrink-0">
                  <div className="w-32 h-32 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center relative z-10">
                     <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                        alt="User" 
                        className="w-full h-full object-cover rounded-full"
                     />
                  </div>
                  {/* Badge Level */}
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white z-20 flex items-center gap-1">
                     <Crown size={14} fill="currentColor"/> Lv.{userStats.level}
                  </div>
               </div>

               {/* Center: Progress & Stats */}
               <div className="flex-1 w-full space-y-4">
                  <div>
                     <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Minh Hoang</h1>
                     <p className="text-slate-500 font-medium">Học viên tích cực • Tham gia từ 2023</p>
                  </div>
                  
                  {/* XP Bar */}
                  <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200">
                     <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-emerald-700">Level {userStats.level}</span>
                        <span className="text-slate-400">{userStats.currentXP} / {userStats.nextLevelXP} XP</span>
                     </div>
                     <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-slate-100">
                        <div 
                           className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                           style={{ width: `${(userStats.currentXP / userStats.nextLevelXP) * 100}%` }}
                        ></div>
                     </div>
                     <div className="text-xs text-slate-400 mt-2 text-right">
                        Còn {userStats.nextLevelXP - userStats.currentXP} XP nữa để lên cấp
                     </div>
                  </div>
               </div>

               {/* Right: Share Button */}
               <div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                     <Share2 size={18} /> Chia sẻ hồ sơ
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* 2. STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <StatCard 
              icon={Zap} 
              label="Chuỗi ngày (Streak)" 
              value={userStats.streak} 
              subtext="Chuỗi dài nhất!" 
              color="bg-orange-100 text-orange-500"
           />
           <StatCard 
              icon={Target} 
              label="Tổng điểm XP" 
              value={userStats.currentXP.toLocaleString()} 
              subtext="+120 hôm nay"
              color="bg-blue-100 text-blue-500" 
           />
           <StatCard 
              icon={Award} 
              label="Huy hiệu" 
              value={userStats.totalBadges} 
              color="bg-purple-100 text-purple-500" 
           />
           <StatCard 
              icon={TrendingUp} 
              label="Hạng tuần" 
              value="#5" 
              subtext="Top 1% học viên"
              color="bg-emerald-100 text-emerald-500" 
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* 3. LEFT COLUMN: ACHIEVEMENTS GALLERY */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                    <Medal className="text-yellow-500" fill="currentColor"/> Bộ sưu tập huy hiệu
                 </h2>
                 
                 {/* Tabs */}
                 <div className="flex bg-slate-100 p-1 rounded-xl">
                    {[{id: 'all', label: 'Tất cả'}, {id: 'unlocked', label: 'Đã đạt'}, {id: 'locked', label: 'Chưa đạt'}].map(tab => (
                       <button 
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                          {tab.label}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {filteredAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} {...achievement} />
                 ))}
              </div>
           </div>

           {/* 4. RIGHT COLUMN: SIDEBAR (Leaderboard & Quests) */}
           <div className="space-y-8">
              
              {/* Daily Quests */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar className="text-emerald-600" size={20}/> Nhiệm vụ ngày
                 </h3>
                 <div className="space-y-4">
                    {[
                       { task: "Hoàn thành 1 bài học", done: true, xp: 50 },
                       { task: "Đạt 90% bài kiểm tra", done: false, xp: 100 },
                       { task: "Học 5 từ vựng mới", done: false, xp: 30 },
                    ].map((quest, idx) => (
                       <div key={idx} className="flex items-center gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${quest.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent'}`}>
                             <CheckCircle2 size={14} />
                          </div>
                          <div className="flex-1">
                             <div className={`text-sm font-medium ${quest.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{quest.task}</div>
                          </div>
                          <div className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md">+{quest.xp} XP</div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                 {/* Decorative BG */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>

                 <h3 className="font-bold mb-4 flex items-center gap-2 relative z-10">
                    <Trophy className="text-yellow-300" size={20} fill="currentColor"/> Bảng xếp hạng tuần
                 </h3>
                 
                 <div className="space-y-3 relative z-10">
                    {[
                       { name: "Sarah N.", xp: 3200, rank: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
                       { name: "Tuan Minh", xp: 2950, rank: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan" },
                       { name: "Jessica", xp: 2800, rank: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jess" },
                    ].map((user) => (
                       <div key={user.rank} className="flex items-center gap-3 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                          <div className={`w-6 h-6 flex items-center justify-center font-bold rounded-full text-xs
                             ${user.rank === 1 ? 'bg-yellow-400 text-yellow-900' : 
                               user.rank === 2 ? 'bg-slate-300 text-slate-800' : 
                               'bg-orange-300 text-orange-900'}
                          `}>
                             {user.rank}
                          </div>
                          <img src={user.avatar} alt="Ava" className="w-8 h-8 rounded-full bg-white"/>
                          <div className="flex-1 text-sm font-medium truncate">{user.name}</div>
                          <div className="text-xs font-bold text-indigo-200">{user.xp} XP</div>
                       </div>
                    ))}
                    
                    {/* User Rank */}
                    <div className="mt-4 pt-3 border-t border-white/20 text-center text-xs text-indigo-200">
                       Bạn đang xếp thứ <span className="text-white font-bold text-sm">#5</span>. Cố lên!
                    </div>
                 </div>
              </div>

           </div>

        </div>
      </div>
    </div>
  );
}