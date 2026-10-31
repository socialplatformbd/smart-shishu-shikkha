"use client";

import React, { useState } from "react";
import { Language } from "@/types";
import { mathShapes, toBengaliNumber, mathComparisons, mathPatterns } from "@/data/mathData";
import { translations } from "@/data/translations";
import { RotateCcw } from "lucide-react";
import { sounds, speakText } from "@/utils/audio";
import confetti from "canvas-confetti";

/** Fisher-Yates shuffle (unbiased, and done once per question instead of on every render). */
function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const makeCountingOptions = (n: number) => shuffle([n - 1, n, n + 1, n + 2].filter((v) => v > 0));
const makeAddOptions = (a: number, b: number) => shuffle([a + b - 1, a + b, a + b + 1]);
const makeSubOptions = (a: number, b: number) => shuffle([a - b - 1, a - b, a - b + 1].filter((v) => v >= 0));

interface MathModuleProps {
  lang: Language;
  onLessonComplete: (lessonId: string) => void;
  completedLessons: string[];
}

export const MathModule: React.FC<MathModuleProps> = ({
  lang,
  onLessonComplete,
  completedLessons,
}) => {
  const t = translations[lang].math;
  const [tab, setTab] = useState<"numbers" | "counting" | "compare" | "addition" | "subtraction" | "shapes" | "patterns">("numbers");

  // State for Counting Game
  const [countingCount, setCountingCount] = useState<number>(4);
  const [countingSelected, setCountingSelected] = useState<number | null>(null);
  const [countingFeedback, setCountingFeedback] = useState<"correct" | "wrong" | null>(null);

  // State for Comparison Game
  const [compIndex, setCompIndex] = useState(0);
  const [compAnswer, setCompAnswer] = useState<string | null>(null);
  const [compFeedback, setCompFeedback] = useState<"correct" | "wrong" | null>(null);

  // State for Addition Exercise
  const [addA, setAddA] = useState(3);
  const [addB, setAddB] = useState(2);
  const [addChoice, setAddChoice] = useState<number | null>(null);
  const [addFeedback, setAddFeedback] = useState<"correct" | "wrong" | null>(null);

  // State for Subtraction Exercise
  const [subA, setSubA] = useState(6);
  const [subB, setSubB] = useState(2);
  const [subChoice, setSubChoice] = useState<number | null>(null);
  const [subFeedback, setSubFeedback] = useState<"correct" | "wrong" | null>(null);

  // State for Patterns
  const [patternIdx, setPatternIdx] = useState(0);
  const [patternChoice, setPatternChoice] = useState<string | null>(null);
  const [patternFeedback, setPatternFeedback] = useState<"correct" | "wrong" | null>(null);

  // Answer choices are created once per question (not re-shuffled on every render)
  const [countingOptions, setCountingOptions] = useState<number[]>(() => makeCountingOptions(4));
  const [addOptions, setAddOptions] = useState<number[]>(() => makeAddOptions(3, 2));
  const [subOptions, setSubOptions] = useState<number[]>(() => makeSubOptions(6, 2));
  const [patternOptions, setPatternOptions] = useState<string[]>(() => shuffle(mathPatterns[0].options));

  // Handlers for Counting
  const handleCountAnswer = (ans: number) => {
    if (countingFeedback === "correct") return;
    setCountingSelected(ans);
    if (ans === countingCount) {
      sounds.playSuccess();
      setCountingFeedback("correct");
      confetti({ particleCount: 40, spread: 50 });
      onLessonComplete("math_counting");
    } else {
      sounds.playWrong();
      setCountingFeedback("wrong");
    }
  };

  const nextCountingRound = () => {
    sounds.playTap();
    const nextVal = Math.floor(Math.random() * 8) + 2; // 2 to 9
    setCountingCount(nextVal);
    setCountingOptions(makeCountingOptions(nextVal));
    setCountingSelected(null);
    setCountingFeedback(null);
  };

  // Handlers for Comparison
  const handleCompAnswer = (symbol: string) => {
    if (compFeedback === "correct") return;
    setCompAnswer(symbol);
    const curr = mathComparisons[compIndex];
    if (symbol === curr.correct) {
      sounds.playSuccess();
      setCompFeedback("correct");
      onLessonComplete("math_comparison");
    } else {
      sounds.playWrong();
      setCompFeedback("wrong");
    }
  };

  const nextCompRound = () => {
    sounds.playTap();
    setCompIndex((prev) => (prev + 1) % mathComparisons.length);
    setCompAnswer(null);
    setCompFeedback(null);
  };

  // Handlers for Addition
  const handleAddAnswer = (ans: number) => {
    if (addFeedback === "correct") return;
    setAddChoice(ans);
    if (ans === addA + addB) {
      sounds.playSuccess();
      setAddFeedback("correct");
      confetti({ particleCount: 40, spread: 50 });
      onLessonComplete("math_addition");
    } else {
      sounds.playWrong();
      setAddFeedback("wrong");
    }
  };

  const nextAddRound = () => {
    sounds.playTap();
    const newA = Math.floor(Math.random() * 5) + 1;
    const newB = Math.floor(Math.random() * 5) + 1;
    setAddA(newA);
    setAddB(newB);
    setAddOptions(makeAddOptions(newA, newB));
    setAddChoice(null);
    setAddFeedback(null);
  };

  // Handlers for Subtraction
  const handleSubAnswer = (ans: number) => {
    if (subFeedback === "correct") return;
    setSubChoice(ans);
    if (ans === subA - subB) {
      sounds.playSuccess();
      setSubFeedback("correct");
      confetti({ particleCount: 40, spread: 50 });
      onLessonComplete("math_subtraction");
    } else {
      sounds.playWrong();
      setSubFeedback("wrong");
    }
  };

  const nextSubRound = () => {
    sounds.playTap();
    const newA = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const newB = Math.floor(Math.random() * 3) + 1; // 1 to 3
    setSubA(newA);
    setSubB(newB);
    setSubOptions(makeSubOptions(newA, newB));
    setSubChoice(null);
    setSubFeedback(null);
  };

  // Handlers for Patterns
  const handlePatternAnswer = (choice: string) => {
    if (patternFeedback === "correct") return;
    setPatternChoice(choice);
    if (choice === mathPatterns[patternIdx].correct) {
      sounds.playSuccess();
      setPatternFeedback("correct");
      confetti({ particleCount: 40, spread: 50 });
      onLessonComplete("math_patterns");
    } else {
      sounds.playWrong();
      setPatternFeedback("wrong");
    }
  };

  const nextPatternRound = () => {
    sounds.playTap();
    const next = (patternIdx + 1) % mathPatterns.length;
    setPatternIdx(next);
    setPatternOptions(shuffle(mathPatterns[next].options));
    setPatternChoice(null);
    setPatternFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
            {lang === "bn" ? "মজার গণিত" : "Fun Math"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <span>{lang === "bn" ? "সংখ্যা, যোগ-বিয়োগ ও আকৃতি" : "Numbers, add, subtract & shapes"}</span>
            <span className="text-2xl">🔢</span>
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            {lang === "bn"
              ? "ছবি গুনে গুনে সহজ গণিত এবং ধাঁধা সমাধান করি।"
              : "Counting, comparisons, addition, subtraction and geometric shapes."}
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white/20 backdrop-blur-md rounded-2xl w-full md:w-auto justify-center">
          <button
            onClick={() => { sounds.playTap(); setTab("numbers"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === "numbers" ? "bg-white text-emerald-800 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.numbers}
          </button>
          <button
            onClick={() => { sounds.playTap(); setTab("counting"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === "counting" ? "bg-white text-emerald-800 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.counting}
          </button>
          <button
            onClick={() => { sounds.playTap(); setTab("addition"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === "addition" ? "bg-white text-emerald-800 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.addition}
          </button>
          <button
            onClick={() => { sounds.playTap(); setTab("subtraction"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === "subtraction" ? "bg-white text-emerald-800 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.subtraction}
          </button>
          <button
            onClick={() => { sounds.playTap(); setTab("shapes"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === "shapes" ? "bg-white text-emerald-800 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.shapes}
          </button>
          <button
            onClick={() => { sounds.playTap(); setTab("compare"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === "compare" ? "bg-white text-emerald-800 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {t.comparison}
          </button>
          <button
            onClick={() => { sounds.playTap(); setTab("patterns"); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === "patterns" ? "bg-white text-emerald-800 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {lang === "bn" ? "প্যাটার্ন" : "Patterns"}
          </button>
        </div>
      </div>

      {/* 1. Numbers 1 to 100 */}
      {tab === "numbers" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">{lang === "bn" ? "১ থেকে ১০০ সংখ্যা শেখা" : "Learn Numbers 1 to 100"}</h3>
              <p className="text-xs text-slate-500">{lang === "bn" ? "যেকোনো সংখ্যার ওপর ট্যাপ করে উচ্চারণ শোনো" : "Tap any number to hear it"}</p>
            </div>
            <button
              onClick={() => {
                sounds.playSuccess();
                onLessonComplete("math_numbers_100");
              }}
              className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors"
            >
              {completedLessons.includes("math_numbers_100") ? (lang === "bn" ? "পড়া শেষ ✅" : "Done ✅") : (lang === "bn" ? "সম্পন্ন চিহ্নিত করো ✅" : "Mark as done ✅")}
            </button>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-[500px] overflow-y-auto p-1">
            {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => {
                  sounds.playTap();
                  speakText(lang === "bn" ? toBengaliNumber(n) : n.toString(), lang);
                }}
                className="p-2 sm:p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-500 hover:text-white text-emerald-950 font-bold border border-emerald-100 transition-all flex flex-col items-center justify-center active:scale-95 group"
              >
                <span className="text-base sm:text-lg">{toBengaliNumber(n)}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-emerald-100 font-medium">
                  {n}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Interactive Counting Game */}
      {tab === "counting" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md text-center max-w-xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
            {lang === "bn" ? "ছবি গণনা করো 🍎" : "Count the pictures 🍎"}
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            {lang === "bn" ? "নিচে কয়টি আপেল আছে গুনে বলো তো?" : "How many apples are below? Count and tell!"}
          </h3>

          {/* Visual items */}
          <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-100 flex flex-wrap items-center justify-center gap-3 min-h-[140px]">
            {Array.from({ length: countingCount }).map((_, i) => (
              <span key={i} className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                🍎
              </span>
            ))}
          </div>

          {/* Option buttons */}
          <div className="grid grid-cols-4 gap-3">
            {countingOptions
              .map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCountAnswer(opt)}
                  className={`py-3 rounded-2xl text-base sm:text-2xl font-extrabold border-2 transition-all ${
                    countingSelected === opt
                      ? opt === countingCount
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                        : "bg-rose-500 text-white border-rose-600"
                      : "bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200"
                  }`}
                >
                  {toBengaliNumber(opt)}<span className="hidden sm:inline"> ({opt})</span>
                </button>
              ))}
          </div>

          {/* Feedback */}
          {countingFeedback && (
            <div className={`p-4 rounded-2xl font-bold text-sm ${
              countingFeedback === "correct" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"
            }`}>
              {countingFeedback === "correct" ? t.correctMessage : t.wrongMessage}
            </div>
          )}

          <button
            onClick={nextCountingRound}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === "bn" ? "নতুন গণনা প্রশ্ন ➡️" : "New counting question ➡️"}</span>
          </button>
        </div>
      )}

      {/* 3. Addition with Visual Counters */}
      {tab === "addition" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md text-center max-w-xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
            {lang === "bn" ? "সহজ ছবি যোগ (+)" : "Easy picture addition (+)"}
          </div>

          <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-black text-slate-800">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              {toBengaliNumber(addA)}
            </div>
            <span className="text-emerald-600">+</span>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              {toBengaliNumber(addB)}
            </div>
            <span className="text-slate-400">=</span>
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl border-2 border-amber-300">
              {addChoice !== null ? toBengaliNumber(addChoice) : "?"}
            </div>
          </div>

          {/* Visual representations */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: addA }).map((_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
            </div>
            <span className="font-bold text-slate-400">+</span>
            <div className="flex gap-1">
              {Array.from({ length: addB }).map((_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-3">
            {addOptions
              .map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddAnswer(opt)}
                  className={`py-3.5 rounded-2xl text-xl font-bold border-2 transition-all ${
                    addChoice === opt
                      ? opt === addA + addB
                        ? "bg-emerald-500 text-white border-emerald-600"
                        : "bg-rose-500 text-white border-rose-600"
                      : "bg-white hover:bg-emerald-50 text-slate-800 border-slate-200"
                  }`}
                >
                  {toBengaliNumber(opt)}
                </button>
              ))}
          </div>

          {addFeedback && (
            <div className={`p-4 rounded-2xl font-bold text-sm ${
              addFeedback === "correct" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"
            }`}>
              {addFeedback === "correct"
                ? (lang === "bn" ? `দারুণ! ${toBengaliNumber(addA)} + ${toBengaliNumber(addB)} = ${toBengaliNumber(addA + addB)}!` : `Great! ${addA} + ${addB} = ${addA + addB}!`)
                : (lang === "bn" ? "আবার চেষ্টা করো, উপরের তারাগুলো একসাথে গুনো!" : "Try again, count all the stars together!")}
            </div>
          )}

          <button
            onClick={nextAddRound}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === "bn" ? "নতুন যোগ অনুশীলন ➡️" : "New addition question ➡️"}</span>
          </button>
        </div>
      )}

      {/* 4. Subtraction */}
      {tab === "subtraction" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md text-center max-w-xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
            {lang === "bn" ? "সহজ বিয়োগ (-)" : "Easy subtraction (-)"}
          </div>

          <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-black text-slate-800">
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
              {toBengaliNumber(subA)}
            </div>
            <span className="text-rose-600">-</span>
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
              {toBengaliNumber(subB)}
            </div>
            <span className="text-slate-400">=</span>
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl border-2 border-amber-300">
              {subChoice !== null ? toBengaliNumber(subChoice) : "?"}
            </div>
          </div>

          {/* Visual representations */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs text-slate-500 mb-2">
              {lang === "bn" ? `মোট ${toBengaliNumber(subA)}টি বেলুন থেকে ${toBengaliNumber(subB)}টি ফেটে গেল:` : `${subA} balloons in total, ${subB} popped:`}
            </p>
            <div className="flex justify-center gap-1.5 flex-wrap">
              {Array.from({ length: subA - subB }).map((_, i) => (
                <span key={`r_${i}`} className="text-2xl">🎈</span>
              ))}
              {Array.from({ length: subB }).map((_, i) => (
                <span key={`b_${i}`} className="text-2xl opacity-30 line-through">🎈</span>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-3">
            {subOptions
              .map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubAnswer(opt)}
                  className={`py-3.5 rounded-2xl text-xl font-bold border-2 transition-all ${
                    subChoice === opt
                      ? opt === subA - subB
                        ? "bg-emerald-500 text-white border-emerald-600"
                        : "bg-rose-500 text-white border-rose-600"
                      : "bg-white hover:bg-emerald-50 text-slate-800 border-slate-200"
                  }`}
                >
                  {toBengaliNumber(opt)}
                </button>
              ))}
          </div>

          {subFeedback && (
            <div className={`p-4 rounded-2xl font-bold text-sm ${
              subFeedback === "correct" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"
            }`}>
              {subFeedback === "correct"
                ? (lang === "bn" ? `একদম ঠিক! ${toBengaliNumber(subA)} - ${toBengaliNumber(subB)} = ${toBengaliNumber(subA - subB)}!` : `Exactly right! ${subA} - ${subB} = ${subA - subB}!`)
                : (lang === "bn" ? "আবার চেষ্টা করো, অবশিষ্ট বেলুনগুলো গুনে দেখো!" : "Try again, count the balloons that are left!")}
            </div>
          )}

          <button
            onClick={nextSubRound}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === "bn" ? "নতুন বিয়োগ প্রশ্ন ➡️" : "New subtraction question ➡️"}</span>
          </button>
        </div>
      )}

      {/* 5. Geometric Shapes */}
      {tab === "shapes" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mathShapes.map((shape) => (
            <div
              key={shape.id}
              onClick={() => {
                sounds.playTap();
                speakText(lang === "bn" ? shape.nameBn : shape.nameEn, lang);
              }}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl group-hover:scale-125 transition-transform">
                  {shape.icon}
                </span>
                <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-full">
                  {lang === "bn" ? shape.nameBn : shape.nameEn}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                {lang === "bn" ? shape.nameBn : shape.nameEn}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {lang === "bn" ? shape.sidesBn : shape.sidesEn}
              </p>
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 font-medium">
                {lang === "bn" ? shape.exampleBn : shape.exampleEn}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Comparison */}
      {tab === "compare" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md text-center max-w-xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
            {lang === "bn" ? "ছোট-বড় তুলনা (>, <, =)" : "Compare numbers (>, <, =)"}
          </div>

          <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-black text-slate-800">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              {toBengaliNumber(mathComparisons[compIndex].a)}
            </div>
            <div className="p-4 bg-amber-100 text-amber-900 rounded-2xl border-2 border-amber-300 min-w-[70px]">
              {compAnswer || "?"}
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              {toBengaliNumber(mathComparisons[compIndex].b)}
            </div>
          </div>

          {/* 3 Buttons: >, =, < */}
          <div className="grid grid-cols-3 gap-3">
            {[">", "=", "<"].map((sym) => (
              <button
                key={sym}
                onClick={() => handleCompAnswer(sym)}
                className={`py-4 rounded-2xl text-2xl font-black border-2 transition-all ${
                  compAnswer === sym
                    ? sym === mathComparisons[compIndex].correct
                      ? "bg-emerald-500 text-white border-emerald-600"
                      : "bg-rose-500 text-white border-rose-600"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          {compFeedback && (
            <div className={`p-4 rounded-2xl font-bold text-sm ${
              compFeedback === "correct" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"
            }`}>
              {compFeedback === "correct"
                ? (lang === "bn" ? mathComparisons[compIndex].expBn : mathComparisons[compIndex].expEn)
                : t.wrongMessage}
            </div>
          )}

          <button
            onClick={nextCompRound}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === "bn" ? "পরবর্তী তুলনা ➡️" : "Next comparison ➡️"}</span>
          </button>
        </div>
      )}

      {/* 7. Patterns */}
      {tab === "patterns" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md text-center max-w-xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full text-xs font-bold">
            {lang === "bn" ? "প্যাটার্ন চেনা 🧩" : "Find the pattern 🧩"}
          </div>

          <p className="text-sm font-bold text-slate-700">
            {lang === "bn" ? "পরের ছবিটি কোনটি হবে?" : "Which picture comes next?"}
          </p>

          <div className="flex items-center justify-center gap-2 flex-wrap text-4xl sm:text-5xl">
            {mathPatterns[patternIdx].sequence.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
            <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 flex items-center justify-center text-3xl sm:text-4xl">
              {patternChoice ?? "❓"}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {patternOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handlePatternAnswer(opt)}
                className={`py-3 rounded-2xl text-3xl border-2 transition-all ${
                  patternChoice === opt
                    ? opt === mathPatterns[patternIdx].correct
                      ? "bg-emerald-500 border-emerald-600"
                      : "bg-rose-500 border-rose-600"
                    : "bg-white hover:bg-emerald-50 border-slate-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {patternFeedback && (
            <div className={`p-4 rounded-2xl font-bold text-sm ${
              patternFeedback === "correct" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"
            }`}>
              {patternFeedback === "correct"
                ? (lang === "bn" ? mathPatterns[patternIdx].explanationBn : mathPatterns[patternIdx].explanationEn)
                : (lang === "bn" ? "আবার চেষ্টা করো, ছবিগুলো মন দিয়ে দেখো!" : "Try again, look at the pictures carefully!")}
            </div>
          )}

          <button
            onClick={nextPatternRound}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === "bn" ? "পরবর্তী প্যাটার্ন ➡️" : "Next pattern ➡️"}</span>
          </button>
        </div>
      )}
    </div>
  );
};
