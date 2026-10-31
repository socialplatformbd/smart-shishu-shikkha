"use client";

import React from "react";
import Image from "next/image";
import { translations } from "@/data/translations";
import { Language } from "@/types";
import { Star, Download, Globe, Wifi, WifiOff, Send } from "lucide-react";
import { sounds } from "@/utils/audio";

interface NavbarProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  stars: number;
  isOnline: boolean;
  onOpenInstall: () => void;
  isInstalled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  stars,
  isOnline,
  onOpenInstall,
  isInstalled,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-md shadow-emerald-200 border-2 border-emerald-400 bg-white shrink-0">
            <Image
              src="/icons/app-logo.png"
              alt="স্মার্ট শিশু শিক্ষা"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm min-[380px]:text-base sm:text-xl font-bold text-slate-800 leading-tight flex items-center gap-1.5">
              <span className="truncate">{t.appName}</span>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-full font-semibold">
                শিশু সংস্করণ
              </span>
            </h1>
            <p className="text-[11px] text-emerald-700 font-medium hidden sm:block">
              {t.appNameSub}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Online/Offline Status Indicator */}
          <div
            className={`items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold border ${
              isOnline ? "hidden min-[400px]:flex" : "flex"
            } ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
            }`}
            title={isOnline ? t.onlineStatus : t.offlineStatus}
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{t.onlineStatus}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">{lang === "bn" ? "অফলাইন" : "Offline"}</span>
              </>
            )}
          </div>

          {/* Star Counter Pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 font-bold text-xs sm:text-sm shadow-sm"
            title={t.starsCount}
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse-gentle" />
            <span>{stars}</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => {
              sounds.playTap();
              onLanguageChange(lang === "bn" ? "en" : "bn");
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-all border border-slate-200 active:scale-95"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === "bn" ? "English" : "বাংলা"}</span>
          </button>

          {/* Install PWA Button (if not yet in standalone mode) */}
          {!isInstalled && (
            <button
              onClick={() => {
                sounds.playTap();
                onOpenInstall();
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-sm shadow-emerald-200 transition-all active:scale-95"
              aria-label="Install App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === "bn" ? "ইনস্টল" : "Install"}</span>
            </button>
          )}

          {/* Official Telegram Link */}
          <a
            href="https://t.me/appdevbyrakib"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-[380px]:block p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-full border border-sky-200 transition-transform active:scale-90"
            title="Join Official Telegram: https://t.me/appdevbyrakib"
          >
            <Send className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
