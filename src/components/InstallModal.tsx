"use client";

import React from "react";
import { translations } from "@/data/translations";
import { Language } from "@/types";
import { X, Smartphone, Download, CheckCircle, ExternalLink } from "lucide-react";
import { sounds } from "@/utils/audio";

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNativeInstall?: () => void;
  canNativeInstall: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  lang,
  onNativeInstall,
  canNativeInstall,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 shadow-2xl border-4 border-emerald-300 relative text-left">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{t.installModalTitle}</h3>
            <p className="text-xs text-emerald-600 font-medium">স্মার্ট শিশু শিক্ষা PWA</p>
          </div>
        </div>

        {canNativeInstall && (
          <button
            onClick={() => {
              sounds.playSuccess();
              if (onNativeInstall) onNativeInstall();
            }}
            className="w-full mb-4 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all text-base"
          >
            <Download className="w-5 h-5" />
            {lang === "bn" ? "এখনই ইনস্টল করুন 📲" : "Install Now Directly 📲"}
          </button>
        )}

        {/* Steps */}
        <div className="space-y-3 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 text-sm text-slate-700">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">১</span>
            <p className="leading-snug">{t.installStep1}</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">২</span>
            <p className="leading-snug">{t.installStep2}</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">৩</span>
            <p className="leading-snug">{t.installStep3}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{lang === "bn" ? "ইনস্টল করার পর ইন্টারনেট ছাড়াও অধিকাংশ পাঠ পড়া যাবে!" : "Once installed, most lessons work completely offline!"}</span>
        </div>

        {/* Official Telegram button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
          <a
            href="https://t.me/appdevbyrakib"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            {t.telegramBtn}
          </a>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-full py-2 text-slate-500 hover:text-slate-800 text-sm font-semibold rounded-xl"
          >
            {t.installClose}
          </button>
        </div>
      </div>
    </div>
  );
};
