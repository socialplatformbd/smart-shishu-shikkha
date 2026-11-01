"use client";

import React, { useState, useEffect } from "react";
import { Language, NavTab, UserProgress } from "@/types";

import {
  getStoredLanguage,
  setStoredLanguage,
  getStoredProgress,
  addStars,
  markLessonComplete,
  recordQuizAttempt,
  resetStoredProgress,
} from "@/utils/storage";

import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { HomeDashboard } from "@/components/HomeDashboard";
import { BottomNav } from "@/components/BottomNav";
import { InstallModal } from "@/components/InstallModal";
import { Footer } from "@/components/Footer";

// Learning Modules
import { BengaliModule } from "@/components/modules/BengaliModule";
import { EnglishModule } from "@/components/modules/EnglishModule";
import { MathModule } from "@/components/modules/MathModule";
import { IslamicModule } from "@/components/modules/IslamicModule";
import { GKModule } from "@/components/modules/GKModule";
import { GamesCenter } from "@/components/modules/GamesCenter";
import { QuizCenter } from "@/components/modules/QuizCenter";
import { AITeacherView } from "@/components/modules/AITeacherView";
import { ProgressView } from "@/components/modules/ProgressView";
import { AboutView } from "@/components/modules/AboutView";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function HomePage() {
  const [lang, setLang] = useState<Language>("bn");
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [progress, setProgress] = useState<UserProgress>({
    sessionId: "",
    nickname: "ছোট্ট বন্ধু",
    stars: 5,
    completedLessons: [],
    quizzesTaken: 0,
    highestQuizScore: 0,
    badges: ["welcome_star"],
    lastActive: "",
  });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Initialize language & progress from storage
    const initialLang = getStoredLanguage();
    setLang(initialLang);

    const initialProg = getStoredProgress();
    setProgress(initialProg);

    // Check online status
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register Service Worker for PWA & offline support
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.warn("SW registration error:", err));
    }

    // Check if running in standalone display mode (already installed)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Handle beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // The browser tells us when the app has been installed
    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
    };
    window.addEventListener("appinstalled", handleInstalled);

    // Check query params (e.g. ?tab=bengali)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab") as NavTab | null;
      if (tabParam && ["bengali", "english", "math", "gk", "islam", "games", "quiz", "ai", "progress", "about"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    } catch {
      // safe fallback
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const goToTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setStoredLanguage(newLang);
  };

  const handleLessonComplete = (lessonId: string) => {
    markLessonComplete(lessonId);
    const updated = getStoredProgress();
    setProgress(updated);
  };

  const handleAddStars = (count: number) => {
    addStars(count);
    const updated = getStoredProgress();
    setProgress(updated);
  };

  const handleRecordQuiz = (score: number, total: number) => {
    recordQuizAttempt(score, total);
    const updated = getStoredProgress();
    setProgress(updated);
  };

  const handleResetProgress = () => {
    resetStoredProgress();
    const fresh = getStoredProgress();
    setProgress(fresh);
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallModalOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      setIsInstallModalOpen(true);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-dvh grid place-items-center bg-emerald-50">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto animate-bounce">
            🎒
          </div>
          <h2 className="text-xl font-bold text-slate-800">স্মার্ট শিশু শিক্ষা</h2>
          <p className="text-xs text-emerald-700">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 pb-[calc(5.5rem_+_env(safe-area-inset-bottom))]">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onLanguageChange={handleLanguageChange}
        stars={progress.stars}
        isOnline={isOnline}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        isInstalled={isInstalled}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-4 sm:pt-6">
        {/* Render Hero Banner on Home Tab or Module */}
        {activeTab === "home" && (
          <>
            <HeroBanner
              lang={lang}
              onNavigate={goToTab}
            />
            <HomeDashboard
              lang={lang}
              onNavigate={goToTab}
              completedLessonsCount={progress.completedLessons.length}
              stars={progress.stars}
              isOnline={isOnline}
            />
          </>
        )}

        {/* 1. Bengali Module */}
        {activeTab === "bengali" && (
          <BengaliModule
            lang={lang}
            onLessonComplete={handleLessonComplete}
            completedLessons={progress.completedLessons}
          />
        )}

        {/* 2. English Module */}
        {activeTab === "english" && (
          <EnglishModule
            lang={lang}
            onLessonComplete={handleLessonComplete}
            completedLessons={progress.completedLessons}
          />
        )}

        {/* 3. Math Module */}
        {activeTab === "math" && (
          <MathModule
            lang={lang}
            onLessonComplete={handleLessonComplete}
            completedLessons={progress.completedLessons}
          />
        )}

        {/* 4. General Knowledge */}
        {activeTab === "gk" && (
          <GKModule
            lang={lang}
            onLessonComplete={handleLessonComplete}
            completedLessons={progress.completedLessons}
          />
        )}

        {/* 5. Educational Games */}
        {/* Islamic learning */}
        {activeTab === "islam" && (
          <IslamicModule
            lang={lang}
            onLessonComplete={handleLessonComplete}
            completedLessons={progress.completedLessons}
          />
        )}

        {activeTab === "games" && (
          <GamesCenter
            lang={lang}
            onAddStars={handleAddStars}
          />
        )}

        {/* 6. Quiz Center */}
        {activeTab === "quiz" && (
          <QuizCenter
            lang={lang}
            onRecordQuiz={handleRecordQuiz}
          />
        )}

        {/* 7. AI Teacher */}
        {activeTab === "ai" && (
          <AITeacherView
            lang={lang}
            onAddStars={handleAddStars}
            isOnline={isOnline}
          />
        )}

        {/* 8. Progress and Badges */}
        {activeTab === "progress" && (
          <ProgressView
            lang={lang}
            progress={progress}
            onResetProgress={handleResetProgress}
          />
        )}

        {/* 9. About Page & Developer Credit */}
        {activeTab === "about" && (
          <AboutView
            lang={lang}
            onOpenInstall={() => setIsInstallModalOpen(true)}
            isInstalled={isInstalled}
          />
        )}

        {/* Developer Branding Footer */}
        <Footer lang={lang} />
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={goToTab}
        lang={lang}
      />

      {/* PWA Installation Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        lang={lang}
        onNativeInstall={handleNativeInstall}
        canNativeInstall={!!deferredPrompt}
      />
    </div>
  );
}
