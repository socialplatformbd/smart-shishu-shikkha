"use client";

import React, { useEffect, useRef } from "react";
import { NavTab, Language } from "@/types";
import { translations } from "@/data/translations";
import {
  Home,
  BookOpen,
  Languages,
  Calculator,
  Compass,
  Gamepad2,
  HelpCircle,
  Sparkles,
  Award,
  Info,
} from "lucide-react";
import { sounds } from "@/utils/audio";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  lang,
}) => {
  const t = translations[lang].tabs;
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // On small screens the 10 tabs scroll sideways: keep the selected one in view.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeTab]);

  const tabs: { id: NavTab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "home", label: t.home, icon: <Home className="w-5 h-5" />, color: "text-emerald-600" },
    { id: "bengali", label: t.bengali, icon: <BookOpen className="w-5 h-5" />, color: "text-rose-600" },
    { id: "english", label: t.english, icon: <Languages className="w-5 h-5" />, color: "text-indigo-600" },
    { id: "math", label: t.math, icon: <Calculator className="w-5 h-5" />, color: "text-amber-600" },
    { id: "gk", label: t.gk, icon: <Compass className="w-5 h-5" />, color: "text-teal-600" },
    { id: "games", label: t.games, icon: <Gamepad2 className="w-5 h-5" />, color: "text-purple-600" },
    { id: "quiz", label: t.quiz, icon: <HelpCircle className="w-5 h-5" />, color: "text-blue-600" },
    { id: "ai", label: t.ai, icon: <Sparkles className="w-5 h-5" />, color: "text-amber-500" },
    { id: "progress", label: t.progress, icon: <Award className="w-5 h-5" />, color: "text-emerald-500" },
    { id: "about", label: t.about, icon: <Info className="w-5 h-5" />, color: "text-slate-500" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex items-center justify-between sm:justify-center sm:gap-2 overflow-x-auto py-1.5 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeRef : undefined}
                onClick={() => {
                  sounds.playTap();
                  onTabChange(tab.id);
                  // Scroll to top when changing tab
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[76px] py-1 px-1 rounded-2xl transition-all duration-150 shrink-0 ${
                  isActive
                    ? "bg-emerald-50/90 text-emerald-700 font-bold scale-105 shadow-sm border border-emerald-200/60"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-transform ${
                    isActive ? "scale-110 " + tab.color : "text-slate-500"
                  }`}
                >
                  {tab.icon}
                </div>
                <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
