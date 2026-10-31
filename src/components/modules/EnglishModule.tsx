"use client";

import React, { useState } from "react";
import { EnglishLetterItem, Language } from "@/types";
import { englishAlphabet, vocabCategories } from "@/data/englishData";
import { translations } from "@/data/translations";
import { Volume2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { speakText, sounds } from "@/utils/audio";
import confetti from "canvas-confetti";

interface EnglishModuleProps {
  lang: Language;
  onLessonComplete: (lessonId: string) => void;
  completedLessons: string[];
}

export const EnglishModule: React.FC<EnglishModuleProps> = ({
  lang,
  onLessonComplete,
  completedLessons,
}) => {
  const t = translations[lang].english;
  const [subTab, setSubTab] = useState<"alphabet" | "vocab">("alphabet");
  const [selectedLetter, setSelectedLetter] = useState<EnglishLetterItem>(englishAlphabet[0]);
  const [selectedVocabCat, setSelectedVocabCat] = useState(vocabCategories[0].id);

  const currentIndex = englishAlphabet.findIndex((l) => l.letter === selectedLetter.letter);
  const isCompleted = completedLessons.includes(`en_${selectedLetter.letter}`);

  const handleNext = () => {
    sounds.playTap();
    if (currentIndex < englishAlphabet.length - 1) {
      setSelectedLetter(englishAlphabet[currentIndex + 1]);
    } else {
      setSelectedLetter(englishAlphabet[0]);
    }
  };

  const handlePrev = () => {
    sounds.playTap();
    if (currentIndex > 0) {
      setSelectedLetter(englishAlphabet[currentIndex - 1]);
    } else {
      setSelectedLetter(englishAlphabet[englishAlphabet.length - 1]);
    }
  };

  const handlePronounce = (text: string) => {
    sounds.playTap();
    speakText(text, "en");
  };

  const handleCompleteLesson = () => {
    if (isCompleted) return;
    sounds.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    onLessonComplete(`en_${selectedLetter.letter}`);
  };

  const currentVocab = vocabCategories.find((c) => c.id === selectedVocabCat) || vocabCategories[0];

  return (
    <div className="space-y-6">
      {/* English Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
            English For Kids
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <span>Alphabet & Vocabulary</span>
            <span className="text-2xl">🦁</span>
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1">
            {lang === "bn"
              ? "A–Z বর্ণমালা, ইংরেজি উচ্চারণ ও বাংলা অর্থসহ সহজে শিখি।"
              : "Learn A–Z phonics, vocabulary and Bengali meanings."}
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex gap-2 p-1 bg-white/20 backdrop-blur-md rounded-2xl">
          <button
            onClick={() => {
              sounds.playTap();
              setSubTab("alphabet");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === "alphabet" ? "bg-white text-indigo-700 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.alphabet}
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setSubTab("vocab");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === "vocab" ? "bg-white text-indigo-700 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.vocabulary}
          </button>
        </div>
      </div>

      {subTab === "alphabet" ? (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Main Letter Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-md flex flex-col items-center text-center">
            {/* Top Navigation Row */}
            <div className="w-full flex items-center justify-between mb-4">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200">
                Letter {currentIndex + 1} of 26
              </span>

              <button
                onClick={handleNext}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Giant Letter Badge */}
            <div className="relative my-2">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-indigo-100 via-blue-50 to-indigo-200 border-4 border-indigo-300 flex items-center justify-center text-6xl sm:text-7xl font-extrabold text-indigo-700 shadow-inner">
                {selectedLetter.letter}
              </div>
              <button
                onClick={() => handlePronounce(`${selectedLetter.letter}. ${selectedLetter.word}`)}
                className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                title={t.pronounce}
                aria-label={t.pronounce}
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            {/* Word Details */}
            <div className="mt-5 space-y-1">
              <div className="text-5xl">{selectedLetter.emoji}</div>
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-wide mt-2">
                {selectedLetter.letter} for {selectedLetter.word}
              </h3>
              <p className="text-indigo-600 font-semibold text-sm">
                বাংলা অর্থ: <span className="font-bold text-slate-700">{selectedLetter.meaningBn}</span>
              </p>
              <p className="text-xs text-slate-400 font-medium">
                ({selectedLetter.phonics})
              </p>
            </div>

            {/* Sentence */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 max-w-md w-full">
              <p className="text-base sm:text-lg font-bold text-indigo-950 leading-snug">
                &ldquo;{selectedLetter.sentence}&rdquo;
              </p>
              <button
                onClick={() => handlePronounce(selectedLetter.sentence)}
                className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-700 hover:text-indigo-900 font-bold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to sentence</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3 w-full justify-center">
              <button
                onClick={() => handlePronounce(`${selectedLetter.word}`)}
                className="px-5 py-3 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.pronounce}</span>
              </button>

              <button
                onClick={handleCompleteLesson}
                disabled={isCompleted}
                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                  isCompleted
                    ? "bg-emerald-100 text-emerald-800 cursor-default"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? "Completed 🎉" : "Mark as Done ✅"}</span>
              </button>
            </div>
          </div>

          {/* 26 Letter Grid Selector */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
              <span>Alphabet A–Z</span>
              <span className="text-xs text-slate-400">Tap to select</span>
            </h4>

            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 max-h-[460px] overflow-y-auto p-1">
              {englishAlphabet.map((item) => {
                const isSelected = item.letter === selectedLetter.letter;
                const done = completedLessons.includes(`en_${item.letter}`);

                return (
                  <button
                    key={item.letter}
                    onClick={() => {
                      sounds.playTap();
                      setSelectedLetter(item);
                      handlePronounce(item.letter);
                    }}
                    className={`relative p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
                        : "bg-slate-50 hover:bg-indigo-50 text-slate-800 border border-slate-100"
                    }`}
                  >
                    <span className="text-2xl font-bold">{item.letter}</span>
                    <span className="text-[10px] truncate max-w-full font-medium opacity-80 mt-0.5">
                      {item.word}
                    </span>
                    {done && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Vocabulary Categories */
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {vocabCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playTap();
                  setSelectedVocabCat(cat.id);
                }}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  selectedVocabCat === cat.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{lang === "bn" ? cat.nameBn : cat.nameEn}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {currentVocab.items.map((item) => (
              <div
                key={item.wordEn}
                onClick={() => handlePronounce(item.wordEn)}
                className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group active:scale-95"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-800">
                  {item.wordEn}
                </h4>
                <p className="text-xs text-indigo-600 font-bold mt-0.5">
                  {item.wordBn}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-indigo-600 font-medium">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{item.phonetic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
