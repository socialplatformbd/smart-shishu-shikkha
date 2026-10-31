"use client";

import React from "react";
import Image from "next/image";
import { Language } from "@/types";
import { translations } from "@/data/translations";
import {
  Info,
  Send,
  Download,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { sounds } from "@/utils/audio";

interface AboutViewProps {
  lang: Language;
  onOpenInstall: () => void;
  isInstalled: boolean;
}

export const AboutView: React.FC<AboutViewProps> = ({
  lang,
  onOpenInstall,
  isInstalled,
}) => {
  const t = translations[lang].about;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg flex flex-col sm:flex-row items-center gap-5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-4 border-white/40 shadow-md shrink-0 bg-white">
          <Image
            src="/icons/app-logo.png"
            alt="স্মার্ট শিশু শিক্ষা"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-1.5">
            {t.appTypeVal}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            স্মার্ট শিশু শিক্ষা | Smart Shishu Shikkha
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Made by Mohammad Rakib
          </p>
        </div>
      </div>

      {/* Official Required App Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Info className="w-5 h-5 text-emerald-600" />
          <span>{t.title}</span>
        </h3>

        <div className="space-y-3.5 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-50 gap-1">
            <span className="text-slate-500 font-medium">{t.appNameLabel}</span>
            <span className="font-bold text-slate-800">Smart Shishu Shikkha</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-50 gap-1">
            <span className="text-slate-500 font-medium">বাংলা নাম:</span>
            <span className="font-bold text-slate-800">স্মার্ট শিশু শিক্ষা</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-50 gap-1">
            <span className="text-slate-500 font-medium">{t.appTypeLabel}</span>
            <span className="font-bold text-emerald-700">{t.appTypeVal}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-50 gap-1">
            <span className="text-slate-500 font-medium">{t.developerLabel}</span>
            <span className="font-bold text-slate-800">Mohammad Rakib</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-50 gap-1">
            <span className="text-slate-500 font-medium">{t.creditLabel}</span>
            <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Made by Mohammad Rakib
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-50 gap-1">
            <span className="text-slate-500 font-medium">{t.telegramLabel}</span>
            <a
              href="https://t.me/appdevbyrakib"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:text-sky-700 font-bold underline flex items-center gap-1"
            >
              <span>https://t.me/appdevbyrakib</span>
            </a>
          </div>

          {/* Bengali Description Required Box */}
          <div className="pt-2">
            <span className="text-slate-500 font-medium block mb-1">{t.descLabel}</span>
            <blockquote className="p-4 rounded-2xl bg-emerald-50/70 border-l-4 border-emerald-500 text-slate-700 italic text-sm leading-relaxed">
              {t.descVal}
            </blockquote>
          </div>
        </div>

        {/* Telegram Official Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <a
            href="https://t.me/appdevbyrakib"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-sky-200 transition-all active:scale-95 text-sm"
          >
            <Send className="w-4 h-4" />
            <span>Join My Telegram Channel</span>
          </a>

          {!isInstalled && (
            <button
              onClick={() => {
                sounds.playTap();
                onOpenInstall();
              }}
              className="py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all active:scale-95 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>{lang === "bn" ? "অ্যাপ ইনস্টল গাইড" : "Install PWA Guide"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Safety & Offline Highlights */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">
              {lang === "bn" ? "অফলাইন সুবিধা" : "Offline Ready"}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t.offlineReady}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">
              {lang === "bn" ? "নিরাপদ শিশু পরিবেশ" : "100% Child Safe"}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t.safeChild}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
