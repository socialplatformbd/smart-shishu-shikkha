"use client";

import React from "react";
import { Language } from "@/types";
import { Send } from "lucide-react";

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="mt-10 mb-4 border-t border-slate-200/80 pt-8 pb-6 text-center text-xs text-slate-500">
      <div className="max-w-4xl mx-auto px-4 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-3 font-semibold text-slate-700">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
            Made by Mohammad Rakib
          </span>

          <a
            href="https://t.me/appdevbyrakib"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-full border border-sky-200 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-sky-600" />
            <span>Join My Telegram Channel</span>
          </a>
        </div>

        <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
          স্মার্ট শিশু শিক্ষা — শিশুদের বর্ণমালা, ভাষা ও বিজ্ঞানের প্রাথমিক আনন্দের জন্য তৈরি শিক্ষামূলক প্ল্যাটফর্ম।
        </p>

        <div className="pt-2 text-[10px] text-slate-400 flex flex-wrap items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} Smart Shishu Shikkha</span>
          <span>•</span>
          <span>Official Channel: <a href="https://t.me/appdevbyrakib" target="_blank" rel="noopener noreferrer" className="underline text-sky-600">t.me/appdevbyrakib</a></span>
        </div>
      </div>
    </footer>
  );
};
