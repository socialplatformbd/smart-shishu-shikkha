"use client";

import React from "react";
import { translations } from "@/data/translations";
import { Language, NavTab } from "@/types";
import {
  BookOpen,
  Languages,
  Calculator,
  Compass,
  Gamepad2,
  HelpCircle,
  Sparkles,
  Award,
  Info,
  ChevronRight,
  WifiOff,
  CheckCircle2,
} from "lucide-react";
import { sounds } from "@/utils/audio";

interface HomeDashboardProps {
  lang: Language;
  onNavigate: (tab: NavTab) => void;
  completedLessonsCount: number;
  stars: number;
  isOnline: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  lang,
  onNavigate,
  completedLessonsCount,
  stars,
  isOnline,
}) => {
  const t = translations[lang];

  const cards = [
    {
      id: "ai" as NavTab,
      title: t.modules.aiTeacherTitle,
      desc: t.modules.aiTeacherDesc,
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      badge: lang === "bn" ? "AI রোবট শিক্ষক" : "AI Robot Tutor",
      bgGradient: "from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400",
      pillBg: "bg-amber-100 text-amber-800",
      accentColor: "text-amber-600",
    },
    {
      id: "bengali" as NavTab,
      title: t.modules.bengaliTitle,
      desc: t.modules.bengaliDesc,
      icon: <BookOpen className="w-8 h-8 text-rose-500" />,
      badge: lang === "bn" ? "স্বরবর্ণ ও ব্যঞ্জনবর্ণ" : "Bengali Alphabet",
      bgGradient: "from-rose-50 to-pink-50 border-rose-200 hover:border-rose-400",
      pillBg: "bg-rose-100 text-rose-800",
      accentColor: "text-rose-600",
    },
    {
      id: "english" as NavTab,
      title: t.modules.englishTitle,
      desc: t.modules.englishDesc,
      icon: <Languages className="w-8 h-8 text-indigo-500" />,
      badge: lang === "bn" ? "A–Z ও শব্দভাণ্ডার" : "A–Z & Phonics",
      bgGradient: "from-indigo-50 to-blue-50 border-indigo-200 hover:border-indigo-400",
      pillBg: "bg-indigo-100 text-indigo-800",
      accentColor: "text-indigo-600",
    },
    {
      id: "math" as NavTab,
      title: t.modules.mathTitle,
      desc: t.modules.mathDesc,
      icon: <Calculator className="w-8 h-8 text-emerald-500" />,
      badge: lang === "bn" ? "১-১০০ ও মজার যোগ" : "Counting & Shapes",
      bgGradient: "from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400",
      pillBg: "bg-emerald-100 text-emerald-800",
      accentColor: "text-emerald-600",
    },
    {
      id: "gk" as NavTab,
      title: t.modules.gkTitle,
      desc: t.modules.gkDesc,
      icon: <Compass className="w-8 h-8 text-teal-500" />,
      badge: lang === "bn" ? "বাংলাদেশ ও বিজ্ঞান" : "Bangladesh & Nature",
      bgGradient: "from-teal-50 to-cyan-50 border-teal-200 hover:border-teal-400",
      pillBg: "bg-teal-100 text-teal-800",
      accentColor: "text-teal-600",
    },
    {
      id: "games" as NavTab,
      title: t.modules.gamesTitle,
      desc: t.modules.gamesDesc,
      icon: <Gamepad2 className="w-8 h-8 text-purple-500" />,
      badge: lang === "bn" ? "৩টি শিক্ষামূলক গেম" : "3 Educational Games",
      bgGradient: "from-purple-50 to-fuchsia-50 border-purple-200 hover:border-purple-400",
      pillBg: "bg-purple-100 text-purple-800",
      accentColor: "text-purple-600",
    },
    {
      id: "quiz" as NavTab,
      title: t.modules.quizTitle,
      desc: t.modules.quizDesc,
      icon: <HelpCircle className="w-8 h-8 text-sky-500" />,
      badge: lang === "bn" ? "মেধা ও তারা যাচাই" : "Earn Stars & Medals",
      bgGradient: "from-sky-50 to-blue-50 border-sky-200 hover:border-sky-400",
      pillBg: "bg-sky-100 text-sky-800",
      accentColor: "text-sky-600",
    },
    {
      id: "progress" as NavTab,
      title: t.modules.myProgressTitle,
      desc: t.modules.myProgressDesc,
      icon: <Award className="w-8 h-8 text-amber-500" />,
      badge: `${stars} ⭐ ${lang === "bn" ? "অর্জিত তারা" : "Stars Earned"}`,
      bgGradient: "from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-400",
      pillBg: "bg-amber-100 text-amber-800",
      accentColor: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Offline Status Notice Banner when disconnected */}
      {!isOnline && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl text-amber-900 shadow-sm animate-pop">
          <div className="w-10 h-10 rounded-2xl bg-amber-200 flex items-center justify-center shrink-0">
            <WifiOff className="w-5 h-5 text-amber-800" />
          </div>
          <div className="text-sm">
            <p className="font-bold">{t.offlineStatus}</p>
            <p className="text-xs text-amber-700">
              {lang === "bn"
                ? "বাংলা, ইংরেজি, গণিত, খেলা এবং কুইজের সকল সংরক্ষিত পাঠ ইন্টারনেট ছাড়াই সম্পূর্ণ চালু আছে।"
                : "All bundled Bengali, English, Math, Games, and Quizzes remain completely accessible offline."}
            </p>
          </div>
        </div>
      )}

      {/* Grid of Learning Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => {
              sounds.playTap();
              onNavigate(card.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                sounds.playTap();
                onNavigate(card.id);
              }
            }}
            className={`group relative rounded-3xl p-5 border-2 bg-gradient-to-br ${card.bgGradient} shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.98] select-none`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${card.pillBg}`}>
                  {card.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-bold text-slate-600">
              <span className={card.accentColor}>
                {lang === "bn" ? "শুরু করো" : "Start Learning"}
              </span>
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary & Quick About Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {lang === "bn" ? "তোমার শিক্ষা অগ্রগতি" : "Your Learning Progress"}
            </h4>
            <p className="text-xs text-slate-500">
              {lang === "bn"
                ? `তুমি এখন পর্যন্ত ${completedLessonsCount}টি পাঠ সম্পন্ন করেছ এবং ${stars}টি তারা পেয়েছ!`
                : `You have completed ${completedLessonsCount} lessons and collected ${stars} stars!`
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              sounds.playTap();
              onNavigate("about");
            }}
            className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>{t.tabs.about}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
