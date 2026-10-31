"use client";

import React, { useState } from "react";
import { Language, UserProgress } from "@/types";
import { allBadges } from "@/data/badgesData";
import { translations } from "@/data/translations";
import { Award, Star, AlertTriangle, ShieldAlert } from "lucide-react";
import { sounds } from "@/utils/audio";

interface ProgressViewProps {
  lang: Language;
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  lang,
  progress,
  onResetProgress,
}) => {
  const t = translations[lang].progress;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  // Simple parent gate: a small sum a young child cannot do yet
  const [gate, setGate] = useState({ a: 12, b: 7 });
  const [gateInput, setGateInput] = useState("");
  const gateOk = gateInput.trim() === String(gate.a + gate.b);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
            {lang === "bn" ? "আমার অর্জন" : "My Achievements"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <span>{t.title}</span>
            <span className="text-2xl">🌟</span>
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1">
            {lang === "bn" ? "“দারুণ! তুমি আজ নতুন কিছু শিখছো এবং প্রতিদিন উন্নতি করছো।”" : "“Great job! You are learning something new and getting better every day.”"}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/30">
          <Star className="w-6 h-6 fill-amber-300 text-amber-100 animate-bounce" />
          <div>
            <div className="text-xl font-black leading-none">{progress.stars}</div>
            <div className="text-[10px] text-amber-100 uppercase tracking-wide font-bold">
              {lang === "bn" ? "মোট তারা" : "Stars"}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{progress.stars}</div>
          <div className="text-xs text-slate-500 font-bold mt-1">{t.starsEarned}</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-2xl mb-1">📖</div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {progress.completedLessons.length}
          </div>
          <div className="text-xs text-slate-500 font-bold mt-1">{t.lessonsCompleted}</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-2xl sm:text-3xl font-black text-sky-600">{progress.quizzesTaken}</div>
          <div className="text-xs text-slate-500 font-bold mt-1">{t.quizzesTaken}</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {progress.highestQuizScore}%
          </div>
          <div className="text-xs text-slate-500 font-bold mt-1">{t.highestScore}</div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>{t.badgesTitle}</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {lang === "bn" ? "লক খোলা বা আনলক করা ব্যাজ" : "Unlocked and locked badges"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allBadges.map((badge) => {
            const isUnlocked = progress.badges.includes(badge.id) || badge.unlocked;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                  isUnlocked
                    ? "bg-amber-50/60 border-amber-300 shadow-sm"
                    : "bg-slate-50 border-slate-200 opacity-50 grayscale"
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="text-sm font-extrabold text-slate-800">
                  {lang === "bn" ? badge.titleBn : badge.titleEn}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {lang === "bn" ? badge.descBn : badge.descEn}
                </p>
                <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isUnlocked ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                }`}>
                  {isUnlocked ? (lang === "bn" ? "অর্জিত ✅" : "Unlocked ✅") : (lang === "bn" ? "লকড 🔒" : "Locked 🔒")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parental Control & Reset Area */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>{t.resetTitle}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          {lang === "bn"
            ? "সকল অগ্রগতি এই ডিভাইসের মেমরিতে সংরক্ষিত থাকে। অভিভাবক চাইলে এখান থেকে নতুন করে শুরু করতে পারেন।"
            : "All learning data is stored locally on this device. Parents can reset the progress if needed."}
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => {
              sounds.playTap();
              setGate({ a: 11 + Math.floor(Math.random() * 8), b: 6 + Math.floor(Math.random() * 4) });
              setGateInput("");
              setShowResetConfirm(true);
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl font-bold text-xs transition-colors"
          >
            {t.resetBtn}
          </button>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-3 animate-pop">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{t.resetConfirmTitle}</span>
            </div>
            <p className="text-xs text-rose-700">{t.resetConfirmDesc}</p>
            <div className="flex items-center gap-2 text-xs text-rose-800 font-bold">
              <span>{lang === "bn" ? "অভিভাবকের জন্য:" : "For parents:"} {gate.a} + {gate.b} = ?</span>
              <input
                type="text"
                inputMode="numeric"
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-20 px-2 py-1 text-base rounded-lg border border-rose-300 bg-white text-slate-800"
                aria-label="Parent check answer"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sounds.playTap();
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                disabled={!gateOk}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs"
              >
                {t.confirmReset}
              </button>
              <button
                onClick={() => {
                  sounds.playTap();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-white text-slate-700 rounded-xl font-bold text-xs border border-slate-200"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
