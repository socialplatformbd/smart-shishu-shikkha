"use client";

import React, { useState } from "react";
import { BengaliLetter, Language } from "@/types";
import { bengaliVowels, bengaliConsonants, easyBengaliSentences } from "@/data/bengaliData";
import { translations } from "@/data/translations";
import { Volume2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { speakText, sounds } from "@/utils/audio";
import confetti from "canvas-confetti";

interface BengaliModuleProps {
  lang: Language;
  onLessonComplete: (lessonId: string) => void;
  completedLessons: string[];
}

export const BengaliModule: React.FC<BengaliModuleProps> = ({
  lang,
  onLessonComplete,
  completedLessons,
}) => {
  const t = translations[lang].bengali;
  const [subTab, setSubTab] = useState<"vowels" | "consonants" | "sentences" | "practice">("vowels");
  const [selectedLetter, setSelectedLetter] = useState<BengaliLetter>(bengaliVowels[0]);

  const activeLetters = subTab === "vowels" ? bengaliVowels : bengaliConsonants;
  const currentIndex = activeLetters.findIndex((l) => l.letter === selectedLetter.letter);
  const isCompleted = completedLessons.includes(`bn_${selectedLetter.letter}`);

  const handleNext = () => {
    sounds.playTap();
    if (currentIndex < activeLetters.length - 1) {
      setSelectedLetter(activeLetters[currentIndex + 1]);
    } else {
      setSelectedLetter(activeLetters[0]);
    }
  };

  const handlePrev = () => {
    sounds.playTap();
    if (currentIndex > 0) {
      setSelectedLetter(activeLetters[currentIndex - 1]);
    } else {
      setSelectedLetter(activeLetters[activeLetters.length - 1]);
    }
  };

  const handlePronounce = (text: string) => {
    sounds.playTap();
    speakText(text, "bn");
  };

  const handleCompleteLesson = () => {
    if (isCompleted) return;
    sounds.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    onLessonComplete(`bn_${selectedLetter.letter}`);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/25 rounded-full text-xs font-bold mb-2">
            {lang === "bn" ? "বাংলা পাঠশালা" : "Bengali Pathshala"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <span>{lang === "bn" ? "স্বরবর্ণ ও ব্যঞ্জনবর্ণ" : "Vowels & Consonants"}</span>
            <span className="text-2xl">🌺</span>
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm mt-1">
            {lang === "bn"
              ? "সুন্দর ছবি, সঠিক উচ্চারণ ও বাক্যের সাথে আনন্দের সাথে বাংলা শিখি।"
              : "Learn Bengali vowels, consonants, words and sentences with rich sounds."}
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white/20 backdrop-blur-md rounded-2xl w-full sm:w-auto justify-center">
          <button
            onClick={() => {
              sounds.playTap();
              setSubTab("vowels");
              setSelectedLetter(bengaliVowels[0]);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subTab === "vowels" ? "bg-white text-rose-700 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.vowels}
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setSubTab("consonants");
              setSelectedLetter(bengaliConsonants[0]);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subTab === "consonants" ? "bg-white text-rose-700 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.consonants}
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setSubTab("sentences");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subTab === "sentences" ? "bg-white text-rose-700 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.easySentences}
          </button>
        </div>
      </div>

      {subTab !== "sentences" ? (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Main Interactive Teaching Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-md flex flex-col items-center text-center relative overflow-hidden">
            {/* Top Navigation Row */}
            <div className="w-full flex items-center justify-between mb-4">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t.prevLesson}</span>
              </button>

              <span className="px-3 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-full border border-rose-200">
                {currentIndex + 1} / {activeLetters.length}
              </span>

              <button
                onClick={handleNext}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
              >
                <span className="hidden sm:inline">{t.nextLesson}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Giant Letter Badge with Sound Button */}
            <div className="relative my-2">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-rose-100 via-pink-50 to-rose-200 border-4 border-rose-300 flex items-center justify-center text-6xl sm:text-7xl font-extrabold text-rose-700 shadow-inner">
                {selectedLetter.letter}
              </div>
              <button
                onClick={() => handlePronounce(`${selectedLetter.letter}, ${selectedLetter.pronounce}`)}
                className="absolute -bottom-2 -right-2 p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                title={t.pronounce}
                aria-label={t.pronounce}
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            {/* Word & Illustration */}
            <div className="mt-5 space-y-2">
              <div className="text-5xl">{selectedLetter.emoji}</div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wide">
                {selectedLetter.letter} - তে {selectedLetter.word}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                ({selectedLetter.meaning})
              </p>
            </div>

            {/* Rhyme or sentence */}
            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 max-w-md w-full">
              <p className="text-base sm:text-lg font-bold text-rose-900 leading-snug">
                &ldquo;{selectedLetter.sentence}&rdquo;
              </p>
              <button
                onClick={() => handlePronounce(selectedLetter.sentence)}
                className="mt-2 inline-flex items-center gap-1 text-xs text-rose-700 hover:text-rose-900 font-bold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "বাক্যটি শোনো" : "Listen to sentence"}</span>
              </button>
            </div>

            {/* Action Bar (Pronounce & Mark Done) */}
            <div className="mt-6 flex flex-wrap gap-3 w-full justify-center">
              <button
                onClick={() => handlePronounce(`${selectedLetter.pronounce}`)}
                className="px-5 py-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
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
                <span>{isCompleted ? t.completed : t.markComplete}</span>
              </button>
            </div>
          </div>

          {/* Letter Selection Grid */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
              <span>{subTab === "vowels" ? t.vowels : t.consonants}</span>
              <span className="text-xs text-slate-400">{lang === "bn" ? "ট্যাপ করে বর্ণ নির্বাচন করো" : "Tap a letter to choose it"}</span>
            </h4>

            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 max-h-[460px] overflow-y-auto p-1">
              {activeLetters.map((item) => {
                const isSelected = item.letter === selectedLetter.letter;
                const done = completedLessons.includes(`bn_${item.letter}`);

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
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200 scale-105"
                        : "bg-slate-50 hover:bg-rose-50 text-slate-800 border border-slate-100"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-bold">{item.letter}</span>
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
        /* Easy Sentences View */
        <div className="grid sm:grid-cols-2 gap-4">
          {easyBengaliSentences.map((sent) => (
            <div
              key={sent.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-rose-300 transition-all flex items-start gap-3.5"
            >
              <div className="text-3xl p-2.5 rounded-2xl bg-rose-50 shrink-0">
                {sent.icon}
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-slate-800 leading-snug">{sent.bn}</p>
                <p className="text-xs text-slate-500 mt-1 italic">{sent.en}</p>
                <button
                  onClick={() => handlePronounce(sent.bn)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "শোনো ও বলো" : "Listen & say"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
