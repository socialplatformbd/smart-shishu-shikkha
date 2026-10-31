"use client";

import React from "react";
import Image from "next/image";
import { translations } from "@/data/translations";
import { Language, NavTab } from "@/types";
import { Sparkles, BookOpen, Calculator, Gamepad2, Send } from "lucide-react";
import { sounds } from "@/utils/audio";

interface HeroBannerProps {
  lang: Language;
  onNavigate: (tab: NavTab) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  lang,
  onNavigate,
}) => {
  const t = translations[lang];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-xl shadow-emerald-900/10 p-5 sm:p-8 mb-6">
      {/* Decorative floating background elements */}
      <div className="absolute top-2 right-4 text-emerald-300/30 text-6xl select-none pointer-events-none animate-float">
        ⭐
      </div>
      <div className="absolute bottom-2 left-6 text-emerald-300/30 text-5xl select-none pointer-events-none animate-float" style={{ animationDelay: "1s" }}>
        🎨
      </div>

      <div className="relative z-10 grid md:grid-cols-12 gap-6 items-center">
        {/* Left Text Content */}
        <div className="md:col-span-7 space-y-3 sm:space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.tagline}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug drop-shadow-sm">
            {t.welcomeTitle}
          </h2>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-xl">
            {t.welcomeSubtitle}
          </p>

          {/* Quick jump action buttons */}
          <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
            <button
              onClick={() => {
                sounds.playTap();
                onNavigate("bengali");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-900/20 active:scale-95 transition-all"
            >
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>{lang === "bn" ? "বাংলা শেখা 📖" : "Learn Bengali 📖"}</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                onNavigate("math");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-900/20 active:scale-95 transition-all"
            >
              <Calculator className="w-4 h-4 text-amber-900" />
              <span>{lang === "bn" ? "মজার গণিত 🔢" : "Fun Math 🔢"}</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                onNavigate("ai");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-indigo-900/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{lang === "bn" ? "AI শিক্ষক 🤖" : "AI Teacher 🤖"}</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                onNavigate("games");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-purple-900/20 active:scale-95 transition-all"
            >
              <Gamepad2 className="w-4 h-4 text-purple-200" />
              <span>{lang === "bn" ? "মজার খেলা 🎮" : "Play Games 🎮"}</span>
            </button>
          </div>

          {/* Developer credit & Telegram channel */}
          <div className="pt-2 flex flex-wrap items-center gap-3 justify-center md:justify-start text-xs text-emerald-100">
            <span className="font-semibold bg-emerald-800/40 px-2.5 py-1 rounded-full border border-emerald-400/30">
              Made by Mohammad Rakib
            </span>
            <a
              href="https://t.me/appdevbyrakib"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-200 hover:text-white underline font-medium hover:scale-105 transition-transform"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.telegramBtn}</span>
            </a>
          </div>
        </div>

        {/* Right Mascot Hero Image */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 bg-emerald-400/20">
            <Image
              src="/images/hero-classroom.png"
              alt="স্মার্ট শিশু শিক্ষা ক্লাসরুম"
              fill
              sizes="(max-width: 640px) 192px, 240px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
