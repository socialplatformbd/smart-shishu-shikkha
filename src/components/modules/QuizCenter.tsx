"use client";

import React, { useState } from "react";
import { Language, QuizQuestion } from "@/types";
import { quizQuestions } from "@/data/quizData";
import { translations } from "@/data/translations";
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Star } from "lucide-react";
import { sounds } from "@/utils/audio";
import confetti from "canvas-confetti";

function shuffleQuestions(list: QuizQuestion[]): QuizQuestion[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QuizCenterProps {
  lang: Language;
  onRecordQuiz: (score: number, total: number) => void;
}

export const QuizCenter: React.FC<QuizCenterProps> = ({ lang, onRecordQuiz }) => {
  const t = translations[lang].quiz;
  const [selectedCat, setSelectedCat] = useState<"all" | "bengali" | "english" | "math" | "gk">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [questionOrder, setQuestionOrder] = useState<QuizQuestion[]>(() => shuffleQuestions(quizQuestions));
  const filteredQuestions = selectedCat === "all"
    ? questionOrder
    : questionOrder.filter((q) => q.category === selectedCat);

  const currentQ = filteredQuestions[currentIndex] || quizQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      sounds.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      sounds.playWrong();
    }
  };

  const handleNextQuestion = () => {
    sounds.playTap();
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz Finished!
      sounds.playCelebration();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setIsFinished(true);
      onRecordQuiz(score, filteredQuestions.length);
    }
  };

  const handleRestartQuiz = (category?: "all" | "bengali" | "english" | "math" | "gk") => {
    sounds.playTap();
    if (category) setSelectedCat(category);
    setQuestionOrder(shuffleQuestions(quizQuestions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const percentage = Math.round((score / filteredQuestions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
            {lang === "bn" ? "মেধা ও কুইজ উৎসব" : "Brain & Quiz Festival"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <span>{lang === "bn" ? "কুইজ কেন্দ্র (Quiz Hub)" : "Quiz Hub"}</span>
            <span className="text-2xl">🏆</span>
          </h2>
          <p className="text-sky-100 text-xs sm:text-sm mt-1">
            {lang === "bn"
              ? "সঠিক উত্তর দিয়ে চকচকে তারা ও নতুন মেডেল জিতে নাও!"
              : "Test your learning and collect shiny stars and badges!"}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white/20 backdrop-blur-md rounded-2xl w-full md:w-auto justify-center">
          <button
            onClick={() => handleRestartQuiz("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCat === "all" ? "bg-white text-sky-900 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {lang === "bn" ? "সব মিলিয়ে 🌟" : "All 🌟"}
          </button>
          <button
            onClick={() => handleRestartQuiz("bengali")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCat === "bengali" ? "bg-white text-sky-900 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {lang === "bn" ? "বাংলা 📖" : "Bengali 📖"}
          </button>
          <button
            onClick={() => handleRestartQuiz("english")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCat === "english" ? "bg-white text-sky-900 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            English 🔤
          </button>
          <button
            onClick={() => handleRestartQuiz("math")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCat === "math" ? "bg-white text-sky-900 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {lang === "bn" ? "গণিত 🔢" : "Math 🔢"}
          </button>
          <button
            onClick={() => handleRestartQuiz("gk")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCat === "gk" ? "bg-white text-sky-900 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {lang === "bn" ? "জ্ঞান 🌍" : "GK 🌍"}
          </button>
        </div>
      </div>

      {/* Quiz Card View */}
      {!isFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-md max-w-2xl mx-auto space-y-6">
          {/* Header Row */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-200">
              {t.question} {currentIndex + 1} / {filteredQuestions.length}
            </span>
            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{t.score}: {score}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <div className="text-center space-y-2 py-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
              {lang === "bn" ? currentQ.questionBn : currentQ.questionEn}
            </h3>
            {lang === "bn" && (
              <p className="text-xs text-slate-400 italic font-medium">
                {currentQ.questionEn}
              </p>
            )}
          </div>

          {/* 4 Options Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {(lang === "bn" ? currentQ.optionsBn : currentQ.optionsEn).map((option, idx) => {
              const isCorrect = idx === currentQ.correctIndex;
              const isChosen = selectedOption === idx;

              let style = "bg-slate-50 hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-300";
              if (isAnswered) {
                if (isCorrect) {
                  style = "bg-emerald-500 text-white border-emerald-600 shadow-md";
                } else if (isChosen) {
                  style = "bg-rose-500 text-white border-rose-600";
                } else {
                  style = "bg-slate-50 text-slate-400 border-slate-100 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl text-sm sm:text-base font-bold border-2 transition-all flex items-center justify-between active:scale-95 text-left ${style}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {isAnswered && isChosen && !isCorrect && <XCircle className="w-5 h-5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Instant Explanation Box */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-slate-800 text-xs sm:text-sm animate-pop space-y-1">
              <span className="font-bold text-sky-900 block flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                {t.reviewTitle}:
              </span>
              <p className="leading-relaxed">
                {lang === "bn" ? currentQ.explanationBn : currentQ.explanationEn}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-sky-200 transition-all text-base animate-pop"
            >
              <span>{currentIndex < filteredQuestions.length - 1 ? t.nextQuestion : t.finishQuiz}</span>
            </button>
          )}
        </div>
      ) : (
        /* Quiz Finished Celebration Screen */
        <div className="bg-white rounded-3xl p-8 border-2 border-sky-200 shadow-xl max-w-md mx-auto text-center space-y-6 animate-pop">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-5xl shadow-md animate-bounce">
            🏆
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              {t.quizCompleted}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {lang === "bn" ? "দারুণ চেষ্টা করেছ ছোট্ট বন্ধু!" : "Fantastic effort, little star!"}
            </p>
          </div>

          {/* Score Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 space-y-2">
            <div className="text-4xl font-black text-sky-900">
              {score} / {filteredQuestions.length}
            </div>
            <div className="text-sm font-bold text-sky-700">
              {t.percentage}: {percentage}%
            </div>
            <p className="text-xs text-amber-700 font-semibold pt-1">
              {lang === "bn" ? `⭐ তুমি এই কুইজে ${score * 2}টি নতুন তারা অর্জন করেছ!` : `⭐ You earned ${score * 2} new stars in this quiz!`}
            </p>
          </div>

          <button
            onClick={() => handleRestartQuiz()}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-sky-200 transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retry}</span>
          </button>
        </div>
      )}
    </div>
  );
};
