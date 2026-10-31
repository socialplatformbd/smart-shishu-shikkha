"use client";

import React, { useState } from "react";
import { Language, GKCard } from "@/types";
import { gkCards } from "@/data/gkData";

import { CheckCircle2, Volume2, Sparkles, HelpCircle } from "lucide-react";
import { speakText, sounds } from "@/utils/audio";
import confetti from "canvas-confetti";

interface GKModuleProps {
  lang: Language;
  onLessonComplete: (lessonId: string) => void;
  completedLessons: string[];
}

export const GKModule: React.FC<GKModuleProps> = ({
  lang,
  onLessonComplete,
  completedLessons,
}) => {
  const [selectedCard, setSelectedCard] = useState<GKCard>(gkCards[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);


  const handleSelectOption = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);

    if (idx === selectedCard.question.correctIndex) {
      sounds.playSuccess();
      confetti({ particleCount: 45, spread: 60 });
      onLessonComplete(`gk_${selectedCard.id}`);
    } else {
      sounds.playWrong();
    }
  };

  const handlePronounce = (text: string) => {
    sounds.playTap();
    speakText(text, lang);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
            {lang === "bn" ? "সাধারণ জ্ঞান ও প্রকৃতি" : "General Knowledge & Nature"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <span>{lang === "bn" ? "ছোটদের জ্ঞানের রাজ্য" : "The kids' world of knowledge"}</span>
            <span className="text-2xl">🌍</span>
          </h2>
          <p className="text-teal-100 text-xs sm:text-sm mt-1">
            {lang === "bn"
              ? "বাংলাদেশ, ঋতু, শরীর, স্বাস্থ্য ও মহাকাশের মজার রহস্য জানি।"
              : "Explore Bangladesh, seasons, senses, healthy habits and science."}
          </p>
        </div>

        {/* Categories selector */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white/20 backdrop-blur-md rounded-2xl w-full sm:w-auto justify-center">
          {gkCards.map((card) => (
            <button
              key={card.id}
              onClick={() => {
                sounds.playTap();
                setSelectedCard(card);
                setSelectedOption(null);
                setAnswered(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedCard.id === card.id
                  ? "bg-white text-teal-800 shadow-sm"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span>{card.icon}</span>
              <span className="hidden sm:inline">
                {lang === "bn" ? card.titleBn : card.titleEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Main Learning Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-100 shadow-md space-y-5">
          {/* Top Header */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-teal-50 text-teal-800 font-bold text-xs rounded-full border border-teal-200">
              {lang === "bn" ? selectedCard.categoryBn : selectedCard.category}
            </span>
            <button
              onClick={() =>
                handlePronounce(
                  lang === "bn"
                    ? `${selectedCard.titleBn}. ${selectedCard.descriptionBn}`
                    : `${selectedCard.titleEn}. ${selectedCard.descriptionEn}`
                )
              }
              className="p-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === "bn" ? "পড়ে শোনাও 🔊" : "Read Aloud 🔊"}</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-4xl shrink-0">
              {selectedCard.icon}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                {lang === "bn" ? selectedCard.titleBn : selectedCard.titleEn}
              </h3>
              <p className="text-xs text-teal-600 font-semibold mt-0.5">
                {lang === "bn" ? selectedCard.categoryBn : selectedCard.category}
              </p>
            </div>
          </div>

          {/* Fun Fact Pill */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-xs uppercase tracking-wider text-amber-700">
                {lang === "bn" ? "মজার তথ্য (Fun Fact)" : "Fun Fact"}
              </span>
              <p className="mt-0.5 font-medium">
                {lang === "bn" ? selectedCard.funFactBn : selectedCard.funFactEn}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-sm sm:text-base leading-relaxed">
            {lang === "bn" ? selectedCard.descriptionBn : selectedCard.descriptionEn}
          </div>

          {/* Interactive Question */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>{lang === "bn" ? selectedCard.question.qBn : selectedCard.question.qEn}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {(lang === "bn" ? selectedCard.question.optionsBn : selectedCard.question.optionsEn).map(
                (opt, idx) => {
                  const isCorrect = idx === selectedCard.question.correctIndex;
                  const isChosen = selectedOption === idx;

                  let btnStyle = "bg-slate-50 hover:bg-teal-50 text-slate-800 border-slate-200";
                  if (answered) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
                    } else if (isChosen) {
                      btnStyle = "bg-rose-500 text-white border-rose-600";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={answered}
                      className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all text-left flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {answered && isCorrect && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  );
                }
              )}
            </div>

            {answered && (
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold animate-pop ${
                  selectedOption === selectedCard.question.correctIndex
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-rose-50 text-rose-900 border border-rose-200"
                }`}
              >
                {lang === "bn"
                  ? selectedCard.question.explanationBn
                  : selectedCard.question.explanationEn}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Cards list */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2.5">
          <h4 className="text-sm font-bold text-slate-700 mb-2">
            {lang === "bn" ? "সকল সাধারণ জ্ঞান পাঠ" : "All General Knowledge Topics"}
          </h4>

          {gkCards.map((card) => {
            const isCurrent = card.id === selectedCard.id;
            const done = completedLessons.includes(`gk_${card.id}`);

            return (
              <button
                key={card.id}
                onClick={() => {
                  sounds.playTap();
                  setSelectedCard(card);
                  setSelectedOption(null);
                  setAnswered(false);
                }}
                className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition-all ${
                  isCurrent
                    ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm">
                      {lang === "bn" ? card.titleBn : card.titleEn}
                    </h5>
                    <p className={`text-[11px] ${isCurrent ? "text-teal-100" : "text-slate-400"}`}>
                      {lang === "bn" ? card.categoryBn : card.category}
                    </p>
                  </div>
                </div>

                {done && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCurrent ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {lang === "bn" ? "সম্পন্ন ✅" : "Done ✅"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
