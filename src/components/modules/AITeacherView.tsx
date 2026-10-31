"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Language, AIMessage, AIAction, AILangPref } from "@/types";
import { translations } from "@/data/translations";
import {
  Volume2,
  Copy,
  Check,
  Send,
  RotateCcw,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { speakText, sounds } from "@/utils/audio";
import { getDemoEducationalAnswer, containsBengali } from "@/utils/aiDemoEngine";
import { checkInputSafety } from "@/utils/aiSafety";

interface AITeacherViewProps {
  lang: Language;
  onAddStars: (stars: number) => void;
  isOnline: boolean;
}

/** Shows **bold** parts of an answer as real bold text instead of raw asterisks. */
const RichText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

const SAMPLE_CHIPS = [
  { bn: "চাঁদ কেন আলো দেয়? 🌕", en: "Why does the moon shine? 🌕", qBn: "চাঁদ কেন আলো দেয়?", qEn: "Why does the moon shine?" },
  { bn: "বাঘ সম্পর্কে বলো 🐯", en: "Tell me about tigers 🐯", qBn: "বাঘ সম্পর্কে বলো", qEn: "Tell me about tigers" },
  { bn: "বৃষ্টি কীভাবে হয়? 🌧️", en: "How does rain fall? 🌧️", qBn: "বৃষ্টি কীভাবে হয়?", qEn: "How does rain fall?" },
  { bn: "আমাকে ১ থেকে ১০ শেখাও 🔢", en: "Teach me numbers 1 to 10 🔢", qBn: "আমাকে ১ থেকে ১০ শেখাও", qEn: "Teach me numbers 1 to 10" },
  { bn: "হাত কেন ধুতে হয়? 🧼", en: "Why wash hands? 🧼", qBn: "হাত কেন ধুতে হয়?", qEn: "Why wash hands?" },
  { bn: "রংধনুতে কয়টি রং? 🌈", en: "How many rainbow colors? 🌈", qBn: "রংধনুতে কয়টি রং?", qEn: "How many rainbow colors? " },
];

export const AITeacherView: React.FC<AITeacherViewProps> = ({
  lang,
  onAddStars,
  isOnline,
}) => {
  const t = translations[lang].ai;
  const isBn = lang === "bn";

  // The welcome message is built from the current language, so switching language updates it too.
  const welcomeMessage: AIMessage = useMemo(
    () => ({
      id: "welcome_msg",
      role: "assistant",
      content: isBn
        ? "নমস্কার ও স্বাগতম! আমি তোমার ডিজিটাল AI শিক্ষক 🤖✨ তোমার মনের যেকোনো প্রশ্ন আমাকে জিজ্ঞাসা করতে পারো—যেমন: 'চাঁদ কেন রাতে আলো দেয়?', 'বাঘ সম্পর্কে বলো', অথবা 'আমাকে যোগ শেখাও'!"
        : "Hello there! I am your AI Teacher 🤖✨ Ask me anything you are curious about—like 'Why is the sky blue?', 'Tell me about tigers', or 'How to add numbers'!",
      timestamp: 0,
      isDemo: true,
      practiceQuestions: [
        isBn ? "চাঁদ কেন রাতে আলো দেয়?" : "Why does the moon shine at night?",
        isBn ? "বাঘ সম্পর্কে কিছু বলো" : "Tell me about tigers",
        isBn ? "বৃষ্টি কীভাবে তৈরি হয়?" : "How is rain made?",
      ],
    }),
    [isBn]
  );

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [langPref, setLangPref] = useState<AILangPref>("auto");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const allMessages = [welcomeMessage, ...messages];

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, isLoading]);

  const pushMessage = (msg: AIMessage) => setMessages((prev) => [...prev, msg]);

  /**
   * Sends one request to the teacher.
   *  - normal: shows the child's question as a chat bubble.
   *  - simplify / translate: re-use the ORIGINAL question + the previous answer (never the whole answer as a "question").
   * If the network or server is unavailable the built-in offline engine answers, so the AI tab still works offline.
   */
  const askTeacher = async (
    question: string,
    action: AIAction = "normal",
    context?: string
  ) => {
    const q = question.trim();
    if (!q || isLoading) return;

    sounds.playTap();

    const actionLabel: Record<AIAction, string> = {
      normal: q,
      simplify: isBn ? "আরও সহজ করে বলো 🐣" : "Explain more simply 🐣",
      translate: isBn ? "অনুবাদ করো 🌐" : "Translate it 🌐",
      practice: isBn ? "আমাকে অনুশীলন প্রশ্ন দাও ✏️" : "Give me practice questions ✏️",
    };

    pushMessage({
      id: "u_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      role: "user",
      content: actionLabel[action],
      timestamp: Date.now(),
    });
    if (action === "normal") setInputText("");

    setIsLoading(true);

    const finishWith = (content: string, practiceQuestions: string[] | undefined, demo: boolean, isError = false, blocked = false) => {
      if (isError) {
        sounds.playWrong();
      } else {
        sounds.playSuccess();
        if (action === "normal" && !blocked) onAddStars(1); // 1 star for a curious question
        setIsDemoMode(demo);
      }
      pushMessage({
        id: "ai_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
        role: "assistant",
        content,
        timestamp: Date.now(),
        isDemo: demo,
        sourceQuestion: q,
        practiceQuestions: isError ? undefined : practiceQuestions,
      });
    };

    const offlineAnswer = () => {
      // The same child-safety check also runs on the device when the server cannot be reached.
      const safety = checkInputSafety(q);
      if (!safety.ok) {
        const bnAnswer = langPref === "bn" || (langPref === "auto" && containsBengali(q));
        finishWith(bnAnswer ? safety.messageBn : safety.messageEn, undefined, true, false, true);
        return;
      }
      const demo = getDemoEducationalAnswer(q, langPref, action);
      finishWith(demo.answer, demo.practiceQuestions, true);
    };

    // Offline: no need to wait for a failing network call.
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      offlineAnswer();
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, langPref, action, context }),
        signal: controller.signal,
      });

      let data: { ok?: boolean; blocked?: boolean; answer?: string; practiceQuestions?: string[]; isDemo?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.ok && data.answer) {
        finishWith(data.answer, data.practiceQuestions, Boolean(data.isDemo), false, Boolean(data.blocked));
      } else if (res.status === 429 || res.status === 400) {
        finishWith(
          data.error || (isBn ? "দুঃখিত, প্রশ্নটি পাঠানো যায়নি। আবার চেষ্টা করো।" : "Sorry, that question could not be sent. Please try again."),
          undefined,
          true,
          true
        );
      } else {
        // Server problem: the offline engine still answers.
        offlineAnswer();
      }
    } catch {
      // Network problem or timeout: the offline engine still answers.
      offlineAnswer();
    } finally {
      clearTimeout(timer);
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    const plain = text.replace(/\*\*/g, "");
    const done = () => {
      sounds.playTap();
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    };
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(plain).then(done).catch(() => undefined);
      }
    } catch {
      // clipboard is optional
    }
  };

  const handleReadAloud = (text: string) => {
    sounds.playTap();
    // Read in the language the text is really written in.
    speakText(text, containsBengali(text) ? "bn" : "en");
  };

  const lastUserQuestion = (): string => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") return messages[i].content;
    }
    return "";
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
              {t.title}
            </span>
            <span className="px-2.5 py-0.5 bg-black/20 text-amber-100 rounded-full text-[11px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? "শিশু-বান্ধব ও নিরাপদ" : "Kid-friendly & safe"}</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <span>{isBn ? "বন্ধু রোবট শিক্ষক" : "Friendly Robot Teacher"}</span>
            <span className="text-2xl">🤖</span>
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1">
            {t.desc}
          </p>
        </div>

        {/* Language Preference for AI Responses */}
        <div className="flex flex-col gap-1 text-xs w-full md:w-auto">
          <span className="text-amber-100 font-semibold text-center md:text-right">
            {t.languagePref}
          </span>
          <div className="flex gap-1 bg-white/20 p-1 rounded-2xl justify-center">
            <button
              onClick={() => { sounds.playTap(); setLangPref("bn"); }}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                langPref === "bn" ? "bg-white text-amber-900 shadow-sm" : "text-white hover:bg-white/10"
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => { sounds.playTap(); setLangPref("en"); }}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                langPref === "en" ? "bg-white text-amber-900 shadow-sm" : "text-white hover:bg-white/10"
              }`}
            >
              English
            </button>
            <button
              onClick={() => { sounds.playTap(); setLangPref("auto"); }}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                langPref === "auto" ? "bg-white text-amber-900 shadow-sm" : "text-white hover:bg-white/10"
              }`}
            >
              {isBn ? "অটো" : "Auto"}
            </button>
          </div>
        </div>
      </div>

      {/* Mode Status Pill */}
      <div className="flex items-center justify-between px-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-700">
            {!isOnline ? t.demoBadge : (isDemoMode ? t.demoBadge : t.liveBadge)}
          </span>
        </div>
        <button
          onClick={() => {
            sounds.playTap();
            setMessages([]);
          }}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.clearChat}</span>
        </button>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-500 px-1">
          {t.suggestedQuestions}
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SAMPLE_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => askTeacher(isBn ? chip.qBn : chip.qEn.trim())}
              disabled={isLoading}
              className="px-3.5 py-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-2xl text-xs font-bold text-slate-700 shrink-0 transition-all active:scale-95 shadow-xs disabled:opacity-50"
            >
              {isBn ? chip.bn : chip.en}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-3 sm:p-6 min-h-[280px] sm:min-h-[360px] max-h-[55dvh] sm:max-h-[520px] overflow-y-auto space-y-4">
        {allMessages.map((msg) => {
          const isAssistant = msg.role === "assistant";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isAssistant ? "justify-start" : "justify-end"
              }`}
            >
              {isAssistant && (
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 text-xl shadow-xs">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-4 sm:p-5 shadow-xs text-sm leading-relaxed ${
                  isAssistant
                    ? "bg-amber-50/70 border border-amber-200 text-slate-800 rounded-tl-sm"
                    : "bg-emerald-600 text-white rounded-tr-sm"
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-line break-words font-medium text-sm sm:text-base">
                  <RichText text={msg.content} />
                </div>

                {/* Assistant Action Buttons */}
                {isAssistant && (
                  <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleReadAloud(msg.content)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors"
                      title={t.listenBtn}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.listenBtn}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors"
                      title={t.copyBtn}
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t.copyBtn}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => askTeacher(msg.sourceQuestion || lastUserQuestion() || msg.content.slice(0, 200), "simplify", msg.content)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors"
                    >
                      <span>{t.simplifyBtn}</span>
                    </button>

                    <button
                      onClick={() => askTeacher(msg.sourceQuestion || lastUserQuestion() || msg.content.slice(0, 200), "translate", msg.content)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t.translateBtn}</span>
                    </button>
                  </div>
                )}

                {/* Follow-up Practice questions */}
                {isAssistant && msg.practiceQuestions && msg.practiceQuestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block">
                      {isBn ? "💡 আরও ভাবো ও বলো:" : "💡 Think and tell more:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.practiceQuestions.map((pq, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => askTeacher(pq)}
                          disabled={isLoading}
                          className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-slate-700 text-xs font-medium border border-amber-200 text-left transition-colors"
                        >
                          ❓ {pq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 text-xl shadow-xs">
                  🧒
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shrink-0 animate-bounce">
              🤖
            </div>
            <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>{isBn ? "রোবট শিক্ষক ভাবছে ও উত্তর তৈরি করছে... ✨" : "The robot teacher is thinking... ✨"}</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          askTeacher(inputText);
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-3xl border-2 border-amber-200 shadow-md focus-within:border-amber-400"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.inputPlaceholder}
          maxLength={300}
          className="flex-1 min-w-0 px-4 py-3 bg-transparent text-base text-slate-800 placeholder-slate-400 outline-none"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-2xl shadow-md shadow-amber-200 transition-all active:scale-95 flex items-center justify-center shrink-0"
          aria-label="Send"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Disclaimer */}
      <div className="text-center px-4">
        <p className="text-[11px] text-slate-400">
          {t.disclaimer}
        </p>
      </div>
    </div>
  );
};
