"use client";

import React, { useState } from "react";
import { Language } from "@/types";
import {
  pillars,
  imanItems,
  prayers,
  wudu,
  duas,
  surahs,
  prophetStories,
  seerahTimeline,
  khulafa,
  islamicFacts,
  type InfoItem,
} from "@/data/islamicData";
import { Volume2, CheckCircle2, ChevronDown, Moon } from "lucide-react";
import { speakText, sounds } from "@/utils/audio";
import confetti from "canvas-confetti";

interface IslamicModuleProps {
  lang: Language;
  onLessonComplete: (lessonId: string) => void;
  completedLessons: string[];
}

type Section = "basics" | "prayer" | "dua" | "surah" | "prophets" | "seerah" | "facts";

const toBn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

interface Ctx {
  isBn: boolean;
  openId: string | null;
  completedLessons: string[];
  toggle: (id: string) => void;
  complete: (lessonId: string) => void;
  listen: (text: string) => void;
}

const DoneButton = ({ ctx, lessonId }: { ctx: Ctx; lessonId: string }) => {
  const done = ctx.completedLessons.includes(lessonId);
  return (
    <button
      onClick={() => ctx.complete(lessonId)}
      disabled={done}
      className={`w-full mt-3 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
        done
          ? "bg-emerald-100 text-emerald-800 cursor-default"
          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200"
      }`}
    >
      <CheckCircle2 className="w-4 h-4" />
      <span>
        {done
          ? ctx.isBn ? "পড়া শেষ ✅" : "Done ✅"
          : ctx.isBn ? "মন দিয়ে পড়েছি ✅ (+৩ তারা)" : "I have read it ✅ (+3 stars)"}
      </span>
    </button>
  );
};

/** One expandable card (title row + content). */
const Card = ({
  ctx,
  id,
  icon,
  title,
  tag,
  lessonId,
  children,
}: {
  ctx: Ctx;
  id: string;
  icon: string;
  title: string;
  tag?: string;
  lessonId: string;
  children: React.ReactNode;
}) => {
  const isOpen = ctx.openId === id;
  const done = ctx.completedLessons.includes(lessonId);
  return (
    <div className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${isOpen ? "border-emerald-300" : "border-slate-200"}`}>
      <button
        onClick={() => ctx.toggle(id)}
        className="w-full p-3.5 flex items-center justify-between gap-3 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{icon}</span>
          <div className="min-w-0">
            <h4 className="font-bold text-sm sm:text-base text-slate-800 break-words">{title}</h4>
            {tag && <p className="text-[11px] text-emerald-700 font-semibold">{tag}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {done && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">✅</span>}
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>
      {isOpen && <div className="px-3.5 pb-4 pt-1 border-t border-slate-100 space-y-2">{children}</div>}
    </div>
  );
};

/** Standard card for an InfoItem. */
const InfoCard = ({ ctx, item, prefix }: { ctx: Ctx; item: InfoItem; prefix: string }) => {
  const { isBn } = ctx;
  const body = isBn ? item.bodyBn : item.bodyEn;
  const steps = isBn ? item.stepsBn : item.stepsEn;
  const lesson = isBn ? item.lessonBn : item.lessonEn;
  const lessonId = `islam_${prefix}_${item.id}`;
  return (
    <Card
      ctx={ctx}
      id={lessonId}
      icon={item.icon}
      title={isBn ? item.titleBn : item.titleEn}
      tag={isBn ? item.tagBn : item.tagEn}
      lessonId={lessonId}
    >
      {item.arabic && (
        <p lang="ar" dir="rtl" className="font-arabic text-2xl sm:text-3xl text-center text-emerald-900 bg-emerald-50 rounded-2xl py-3 px-2">
          {item.arabic}
        </p>
      )}
      {body.map((p, i) => (
        <p key={i} className="text-sm sm:text-base text-slate-700 leading-relaxed">{p}</p>
      ))}
      {steps && (
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {steps.map((st, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 rounded-xl px-3 py-2">
              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                {isBn ? toBn(i + 1) : i + 1}
              </span>
              <span>{st}</span>
            </li>
          ))}
        </ol>
      )}
      {lesson && (
        <p className="text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          💡 {isBn ? "শিক্ষা:" : "Lesson:"} {lesson}
        </p>
      )}
      <button
        onClick={() => ctx.listen([...body, ...(steps ?? [])].join(". "))}
        className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
      >
        <Volume2 className="w-3.5 h-3.5" />
        <span>{isBn ? "শোনো" : "Listen"}</span>
      </button>
      <DoneButton ctx={ctx} lessonId={lessonId} />
    </Card>
  );
};

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-bold text-slate-600 pt-2">{children}</h3>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 leading-relaxed">
    {children}
  </p>
);

export const IslamicModule: React.FC<IslamicModuleProps> = ({
  lang,
  onLessonComplete,
  completedLessons,
}) => {
  const isBn = lang === "bn";
  const [section, setSection] = useState<Section>("basics");
  const [openId, setOpenId] = useState<string | null>(null);

  const tabs: { id: Section; bn: string; en: string }[] = [
    { id: "basics", bn: "ঈমান ও ইসলাম", en: "Faith & Islam" },
    { id: "prayer", bn: "নামাজ", en: "Prayer" },
    { id: "dua", bn: "দোয়া", en: "Duas" },
    { id: "surah", bn: "ছোট সূরা", en: "Short Surahs" },
    { id: "prophets", bn: "নবীদের গল্প", en: "Prophet Stories" },
    { id: "seerah", bn: "প্রিয় নবী (সা.)", en: "Our Prophet (PBUH)" },
    { id: "facts", bn: "জানার মতো", en: "Good to know" },
  ];

  const toggle = (id: string) => {
    sounds.playTap();
    setOpenId((prev) => (prev === id ? null : id));
  };

  const complete = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) return;
    sounds.playSuccess();
    confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });
    onLessonComplete(lessonId);
  };

  const listen = (text: string) => {
    sounds.playTap();
    speakText(text, isBn ? "bn" : "en");
  };

  const ctx: Ctx = { isBn, openId, completedLessons, toggle, complete, listen };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-lg">
        <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold mb-1.5">
          <Moon className="w-4 h-4" />
          <span>{isBn ? "ছোটদের জন্য" : "For children"}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold">{isBn ? "ইসলামি শিক্ষা" : "Islamic Learning"}</h2>
        <p className="text-sm text-emerald-50 mt-1">
          {isBn
            ? "কালেমা, নামাজ, দোয়া, ছোট সূরা, নবীদের গল্প ও প্রিয় নবী (সা.)-এর জীবনী শেখো।"
            : "Learn the Kalima, prayer, duas, short surahs, prophet stories and the life of our Prophet (PBUH)."}
        </p>
      </div>

      {/* Section pills */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-2xl border border-slate-200">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => {
              sounds.playTap();
              setSection(tb.id);
              setOpenId(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              section === tb.id ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {isBn ? tb.bn : tb.en}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {/* ---------------- basics ---------------- */}
        {section === "basics" && (
          <>
            <Heading>{isBn ? "ইসলামের ৫টি স্তম্ভ" : "The 5 Pillars of Islam"}</Heading>
            {pillars.map((p) => <InfoCard ctx={ctx} key={p.id} item={p} prefix="pillar" />)}
            <Heading>{isBn ? "ঈমানের মূল বিষয় (৬টি)" : "The 6 Articles of Faith"}</Heading>
            {imanItems.map((p) => <InfoCard ctx={ctx} key={p.id} item={p} prefix="iman" />)}
          </>
        )}

        {/* ---------------- prayer ---------------- */}
        {section === "prayer" && (
          <>
            <Heading>{isBn ? "পাঁচ ওয়াক্ত নামাজ" : "The Five Daily Prayers"}</Heading>
            {prayers.map((pr) => {
              const lessonId = `islam_prayer_${pr.id}`;
              return (
                <Card
                  ctx={ctx}
                  key={pr.id}
                  id={lessonId}
                  icon={pr.icon}
                  title={`${isBn ? pr.nameBn : pr.nameEn} (${pr.arabic})`}
                  tag={isBn ? `ফরজ ${toBn(pr.fardRakat)} রাকআত` : `${pr.fardRakat} rakat fard`}
                  lessonId={lessonId}
                >
                  <p className="text-sm sm:text-base text-slate-700">
                    ⏰ {isBn ? pr.timeBn : pr.timeEn}
                  </p>
                  <p className="text-sm sm:text-base text-slate-700">
                    {isBn
                      ? `এই ওয়াক্তে ${toBn(pr.fardRakat)} রাকআত ফরজ নামাজ পড়তে হয়।`
                      : `This prayer has ${pr.fardRakat} rakats of obligatory (fard) prayer.`}
                  </p>
                  <DoneButton ctx={ctx} lessonId={lessonId} />
                </Card>
              );
            })}
            <Note>
              {isBn
                ? "এখানে শুধু ফরজ রাকআত দেখানো হয়েছে। সুন্নত, বিতর ও জুমার নামাজের নিয়ম মা-বাবা বা শিক্ষকের কাছে শিখো।"
                : "Only the obligatory (fard) rakats are shown here. Learn the sunnah, witr and Jumuah prayers from your parents or a teacher."}
            </Note>
            <Heading>{isBn ? "ওযু" : "Wudu"}</Heading>
            <InfoCard ctx={ctx} item={wudu} prefix="wudu" />
          </>
        )}

        {/* ---------------- duas ---------------- */}
        {section === "dua" && (
          <>
            <Heading>{isBn ? "প্রতিদিনের দোয়া" : "Daily Duas"}</Heading>
            {duas.map((d) => {
              const lessonId = `islam_dua_${d.id}`;
              return (
                <Card ctx={ctx} key={d.id} id={lessonId} icon={d.icon} title={isBn ? d.titleBn : d.titleEn} lessonId={lessonId}>
                  <p lang="ar" dir="rtl" className="font-arabic text-2xl sm:text-3xl text-center text-emerald-900 bg-emerald-50 rounded-2xl py-3 px-2">
                    {d.arabic}
                  </p>
                  <p className="text-sm sm:text-base text-slate-800 font-semibold">🗣️ {d.translitBn}</p>
                  <p className="text-sm sm:text-base text-slate-700">
                    <span className="font-bold">{isBn ? "অর্থ: " : "Meaning: "}</span>
                    {isBn ? d.meaningBn : d.meaningEn}
                  </p>
                  <button
                    onClick={() => listen(isBn ? d.meaningBn : d.meaningEn)}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isBn ? "অর্থ শোনো" : "Listen to meaning"}</span>
                  </button>
                  <DoneButton ctx={ctx} lessonId={lessonId} />
                </Card>
              );
            })}
            <Note>
              {isBn
                ? "আরবি দোয়ার সঠিক উচ্চারণ মা-বাবা বা হুজুর/শিক্ষকের কাছ থেকে শুনে শুনে শেখো।"
                : "Learn the correct pronunciation of the Arabic by listening to your parents or a teacher."}
            </Note>
          </>
        )}

        {/* ---------------- surahs ---------------- */}
        {section === "surah" && (
          <>
            <Heading>{isBn ? "ছোট সূরা" : "Short Surahs"}</Heading>
            {surahs.map((s) => {
              const lessonId = `islam_surah_${s.id}`;
              return (
                <Card
                  ctx={ctx}
                  key={s.id}
                  id={lessonId}
                  icon="📗"
                  title={`${isBn ? s.nameBn : s.nameEn} (${s.arabicName})`}
                  tag={isBn ? `${toBn(s.ayahCount)}টি আয়াত` : `${s.ayahCount} verses`}
                  lessonId={lessonId}
                >
                  <div className="space-y-2.5">
                    {s.ayat.map((a, i) => (
                      <div key={i} className="rounded-2xl bg-slate-50 border border-slate-100 p-3 space-y-1.5">
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-1">
                            {isBn ? toBn(i + 1) : i + 1}
                          </span>
                          <p lang="ar" dir="rtl" className="font-arabic text-xl sm:text-2xl text-emerald-900 flex-1 text-right">
                            {a.arabic}
                          </p>
                        </div>
                        <p className="text-sm text-slate-800 font-semibold">🗣️ {a.translitBn}</p>
                        <p className="text-sm text-slate-600">{isBn ? a.meaningBn : a.meaningEn}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => listen(s.ayat.map((a) => (isBn ? a.meaningBn : a.meaningEn)).join(" "))}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isBn ? "অর্থ শোনো" : "Listen to meaning"}</span>
                  </button>
                  <DoneButton ctx={ctx} lessonId={lessonId} />
                </Card>
              );
            })}
            <Note>
              {isBn
                ? "কুরআন তিলাওয়াতের সঠিক নিয়ম (তাজবীদ) অবশ্যই একজন যোগ্য শিক্ষকের কাছ থেকে শিখতে হবে। এখানে শুধু পড়ার অনুশীলন ও অর্থ দেওয়া হয়েছে।"
                : "The correct way of reciting the Quran (tajweed) must be learned from a qualified teacher. Here you only get reading practice and meanings."}
            </Note>
          </>
        )}

        {/* ---------------- prophets ---------------- */}
        {section === "prophets" && (
          <>
            <Heading>{isBn ? "নবী-রাসূলদের গল্প" : "Stories of the Prophets"}</Heading>
            {prophetStories.map((p) => <InfoCard ctx={ctx} key={p.id} item={p} prefix="prophet" />)}
            <Note>
              {isBn
                ? "গল্পগুলো কুরআনে বর্ণিত ঘটনার সংক্ষিপ্ত রূপ। বিস্তারিত বড়দের কাছ থেকে শুনো।"
                : "These stories are short summaries of events told in the Quran. Ask the grown-ups for more."}
            </Note>
          </>
        )}

        {/* ---------------- seerah ---------------- */}
        {section === "seerah" && (
          <>
            <Heading>{isBn ? "প্রিয় নবী মুহাম্মাদ (সা.)-এর জীবনী" : "Life of Prophet Muhammad (PBUH)"}</Heading>
            {seerahTimeline.map((p) => <InfoCard ctx={ctx} key={p.id} item={p} prefix="seerah" />)}
            <Heading>{isBn ? "চার খলিফা (খুলাফায়ে রাশিদিন)" : "The Four Rightly-Guided Caliphs"}</Heading>
            {khulafa.map((p) => <InfoCard ctx={ctx} key={p.id} item={p} prefix="khalifa" />)}
          </>
        )}

        {/* ---------------- facts ---------------- */}
        {section === "facts" && (
          <>
            <Heading>{isBn ? "জানার মতো কিছু কথা" : "Good things to know"}</Heading>
            {islamicFacts.map((p) => <InfoCard ctx={ctx} key={p.id} item={p} prefix="fact" />)}
          </>
        )}
      </div>

      <p className="text-center text-[11px] text-slate-400 px-4">
        {isBn
          ? "এই অংশ সংক্ষিপ্ত। আরও জানতে মা-বাবা বা ইসলামি শিক্ষকের সাথে কথা বলো।"
          : "This section is a short introduction. Talk to your parents or an Islamic teacher to learn more."}
      </p>
    </div>
  );
};
