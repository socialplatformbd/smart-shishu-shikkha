"use client";

import React, { useState, useRef, useEffect } from "react";
import { Language } from "@/types";
import { bengaliVowels, bengaliConsonants } from "@/data/bengaliData";
import { englishAlphabet } from "@/data/englishData";
import { rasterizeStrokes, scoreTracing, GRID, type Pt, type TracingScore } from "@/utils/tracing";
import { sounds, speakText } from "@/utils/audio";
import { Volume2, ChevronLeft, ChevronRight, Eraser, Undo2 } from "lucide-react";
import confetti from "canvas-confetti";

/*
 * "Learn to write": the child traces a letter with a finger.
 * The drawing never leaves the phone and is not saved. Only "letter done" is remembered (as a lesson).
 */

interface WritingModuleProps {
  lang: Language;
  onLessonComplete: (lessonId: string) => void;
  completedLessons: string[];
}

type SetId = "bnv" | "bnc" | "enu" | "enl" | "dbn" | "den";

const FONT_BN = "'Noto Sans Bengali','Hind Siliguri','Kalpurush','Nirmala UI','Vrinda',sans-serif";
const FONT_LAT = "'Trebuchet MS','Arial Rounded MT Bold',Arial,sans-serif";

// Marks that only exist attached to another letter are not traced alone.
const SIGNS = ["ং", "ঃ", "ঁ"];

const SETS: { id: SetId; bn: string; en: string; chars: string[]; font: string }[] = [
  { id: "bnv", bn: "স্বরবর্ণ", en: "Bengali vowels", chars: bengaliVowels.map((x) => x.letter), font: FONT_BN },
  { id: "bnc", bn: "ব্যঞ্জনবর্ণ", en: "Bengali consonants", chars: bengaliConsonants.map((x) => x.letter).filter((c) => !SIGNS.includes(c)), font: FONT_BN },
  { id: "enu", bn: "A–Z বড় হাতের", en: "A–Z capital", chars: englishAlphabet.map((x) => x.letter), font: FONT_LAT },
  { id: "enl", bn: "a–z ছোট হাতের", en: "a–z small", chars: englishAlphabet.map((x) => x.letter.toLowerCase()), font: FONT_LAT },
  { id: "dbn", bn: "বাংলা সংখ্যা ০–৯", en: "Bengali digits", chars: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"], font: FONT_BN },
  { id: "den", bn: "সংখ্যা 0–9", en: "Digits 0–9", chars: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], font: FONT_LAT },
];

const CANVAS = 600; // internal drawing resolution (scaled by CSS)

/** Draws one glyph centred and auto-fitted, so every font and letter fills the box the same way. */
function drawGlyph(
  ctx: CanvasRenderingContext2D,
  size: number,
  ch: string,
  font: string,
  mode: "visual" | "mask"
) {
  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `bold 100px ${font}`;
  const m0 = ctx.measureText(ch);
  const w0 = m0.actualBoundingBoxLeft + m0.actualBoundingBoxRight;
  const h0 = m0.actualBoundingBoxAscent + m0.actualBoundingBoxDescent;
  const longest = Math.max(w0, h0, 1);
  const fontSize = (100 * 0.66 * size) / longest;
  ctx.font = `bold ${fontSize}px ${font}`;
  const m = ctx.measureText(ch);
  const x = size / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
  const y = size / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
  if (mode === "visual") {
    ctx.fillStyle = "#ddd6fe";
    ctx.fillText(ch, x, y);
  } else {
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.lineJoin = "round";
    ctx.lineWidth = size * 0.05; // a little thicker so the check is forgiving
    ctx.strokeText(ch, x, y);
    ctx.fillText(ch, x, y);
  }
  ctx.restore();
}

export const WritingModule: React.FC<WritingModuleProps> = ({ lang, onLessonComplete, completedLessons }) => {
  const isBn = lang === "bn";
  const [setId, setSetId] = useState<SetId>("bnv");
  const [index, setIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [hasInk, setHasInk] = useState(false);
  const [result, setResult] = useState<TracingScore | null>(null);

  const guideRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef<HTMLCanvasElement | null>(null);
  const strokes = useRef<Pt[][]>([]);
  const drawing = useRef(false);

  const set = SETS.find((s) => s.id === setId) ?? SETS[0];
  const ch = set.chars[Math.min(index, set.chars.length - 1)];
  const lessonId = (c: string) => `write_${setId}_${c}`;
  const doneCount = set.chars.filter((c) => completedLessons.includes(lessonId(c))).length;

  // Draw the practice sheet (dotted guide lines + the grey letter)
  useEffect(() => {
    const canvas = guideRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, CANVAS, CANVAS);
    ctx.save();
    ctx.strokeStyle = "#e9d5ff";
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 12]);
    ctx.beginPath();
    ctx.moveTo(0, CANVAS / 2);
    ctx.lineTo(CANVAS, CANVAS / 2);
    ctx.moveTo(CANVAS / 2, 0);
    ctx.lineTo(CANVAS / 2, CANVAS);
    ctx.stroke();
    ctx.restore();
    if (showGuide) drawGlyph(ctx, CANVAS, ch, set.font, "visual");
  }, [ch, set.font, showGuide]);

  const redraw = () => {
    const canvas = drawRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, CANVAS, CANVAS);
    ctx.strokeStyle = "#7c3aed";
    ctx.fillStyle = "#7c3aed";
    ctx.lineWidth = 26;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const stroke of strokes.current) {
      if (stroke.length === 1) {
        ctx.beginPath();
        ctx.arc(stroke[0].x * CANVAS, stroke[0].y * CANVAS, 13, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(stroke[0].x * CANVAS, stroke[0].y * CANVAS);
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x * CANVAS, stroke[i].y * CANVAS);
      ctx.stroke();
    }
  };

  const clearAll = () => {
    strokes.current = [];
    drawing.current = false;
    setHasInk(false);
    setResult(null);
    redraw();
  };

  // New letter -> fresh page
  useEffect(() => {
    clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setId, index]);

  const toPoint = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // not all browsers allow it
    }
    drawing.current = true;
    strokes.current.push([toPoint(e)]);
    setResult(null);
    setHasInk(true);
    redraw();
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    const current = strokes.current[strokes.current.length - 1];
    if (!current) return;
    current.push(toPoint(e));
    redraw();
  };

  const onUp = () => {
    drawing.current = false;
  };

  const undo = () => {
    sounds.playTap();
    strokes.current.pop();
    setHasInk(strokes.current.length > 0);
    setResult(null);
    redraw();
  };

  const clearPage = () => {
    sounds.playTap();
    clearAll();
  };

  const move = (delta: number) => {
    sounds.playTap();
    setIndex((i) => (i + delta + set.chars.length) % set.chars.length);
  };

  const check = () => {
    // The letter's shape, drawn small, is compared with the child's strokes.
    const off = document.createElement("canvas");
    off.width = GRID;
    off.height = GRID;
    const octx = off.getContext("2d", { willReadFrequently: true });
    let guide: Uint8Array;
    try {
      if (!octx) throw new Error("no canvas");
      drawGlyph(octx, GRID, ch, set.font, "mask");
      const data = octx.getImageData(0, 0, GRID, GRID).data;
      guide = new Uint8Array(GRID * GRID);
      for (let i = 0; i < guide.length; i++) guide[i] = data[i * 4 + 3] > 90 ? 1 : 0;
    } catch {
      // Could not read the canvas: be kind and accept a real attempt
      const ink = rasterizeStrokes(strokes.current, GRID, 4);
      const inkCells = ink.reduce((a, b) => a + b, 0);
      const ok = inkCells >= 120;
      const fallback: TracingScore = { coverage: 1, precision: 1, inkCells, passed: ok, stars: 2 };
      finish(fallback);
      return;
    }
    const ink = rasterizeStrokes(strokes.current, GRID, 4);
    finish(scoreTracing(guide, ink, GRID, 5));
  };

  const finish = (score: TracingScore) => {
    setResult(score);
    if (score.passed) {
      sounds.playSuccess();
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });
      if (!completedLessons.includes(lessonId(ch))) onLessonComplete(lessonId(ch));
    } else {
      sounds.playWrong();
    }
  };

  const hint = (r: TracingScore) => {
    if (r.passed) return isBn ? "🎉 দারুণ লিখেছ!" : "🎉 Great writing!";
    if (r.inkCells < 40) return isBn ? "✍️ আঙুল দিয়ে অক্ষরটার ওপর দিয়ে লেখো।" : "✍️ Trace over the letter with your finger.";
    if (r.coverage < 0.62) return isBn ? "👀 অক্ষরের পুরোটা লেখো, কিছু অংশ বাকি আছে।" : "👀 Write the whole letter, some parts are missing.";
    return isBn ? "🎯 ধূসর অক্ষরের ওপর দিয়ে লেখার চেষ্টা করো।" : "🎯 Try to stay on top of the grey letter.";
  };

  const pronounce = () => {
    sounds.playTap();
    speakText(ch, /[\u0980-\u09FF]/.test(ch) ? "bn" : "en");
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="text-xs font-bold text-fuchsia-100 mb-1">✍️ {isBn ? "আঙুল দিয়ে লেখো" : "Write with your finger"}</div>
        <h2 className="text-xl sm:text-2xl font-extrabold">{isBn ? "অক্ষর লেখা শেখা" : "Learn to Write"}</h2>
        <p className="text-sm text-fuchsia-50 mt-1">
          {isBn
            ? "ধূসর অক্ষরের ওপর দিয়ে আঙুল টেনে লেখো। ঠিক হলে তারা পাবে!"
            : "Drag your finger over the grey letter. Get stars when it is right!"}
        </p>
      </div>

      {/* Set selector */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-2xl border border-slate-200">
        {SETS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              sounds.playTap();
              setSetId(s.id);
              setIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              setId === s.id ? "bg-purple-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {isBn ? s.bn : s.en}
          </button>
        ))}
      </div>

      {/* Letter chips */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600">
            {isBn ? "অক্ষর বেছে নাও" : "Pick a letter"}
          </span>
          <span className="text-[11px] font-bold text-emerald-700">
            ✅ {isBn ? `${String(doneCount).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)])}/${String(set.chars.length).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)])}` : `${doneCount}/${set.chars.length}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {set.chars.map((c, i) => {
            const done = completedLessons.includes(lessonId(c));
            return (
              <button
                key={`${c}-${i}`}
                onClick={() => {
                  sounds.playTap();
                  setIndex(i);
                }}
                style={{ fontFamily: set.font }}
                className={`w-9 h-9 rounded-xl text-base font-bold border-2 transition-all active:scale-90 ${
                  i === index
                    ? "bg-purple-600 border-purple-700 text-white"
                    : done
                      ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-purple-50"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Writing pad */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-purple-200 shadow-md max-w-md mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => move(-1)}
            aria-label="previous"
            className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="text-[11px] font-bold text-slate-500">
              {isBn ? "এই অক্ষরটি লেখো" : "Write this letter"}
            </div>
            <div className="text-3xl font-extrabold text-purple-900 leading-tight" style={{ fontFamily: set.font }}>
              {ch}
            </div>
          </div>
          <button
            onClick={() => move(1)}
            aria-label="next"
            className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full aspect-square rounded-2xl border-2 border-purple-300 bg-white overflow-hidden select-none">
          <canvas
            ref={guideRef}
            width={CANVAS}
            height={CANVAS}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          <canvas
            ref={drawRef}
            width={CANVAS}
            height={CANVAS}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={onUp}
            style={{ touchAction: "none" }}
            className="absolute inset-0 w-full h-full cursor-crosshair"
          />
        </div>

        {result && (
          <div
            className={`p-3 rounded-2xl text-center text-sm font-bold ${
              result.passed ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
            }`}
          >
            <div>{hint(result)}</div>
            {result.passed && (
              <div className="text-xl mt-1">
                {"⭐".repeat(result.stars)}
                <span className="text-xs text-emerald-800 ml-2">
                  {completedLessons.includes(lessonId(ch)) ? "" : isBn ? "(+৩ তারা)" : "(+3 stars)"}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={undo}
            disabled={!hasInk}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 active:scale-95"
          >
            <Undo2 className="w-4 h-4" />
            <span>{isBn ? "একটা দাগ মুছো" : "Undo"}</span>
          </button>
          <button
            onClick={clearPage}
            disabled={!hasInk}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 active:scale-95"
          >
            <Eraser className="w-4 h-4" />
            <span>{isBn ? "সব মুছো" : "Clear"}</span>
          </button>
          <button
            onClick={pronounce}
            className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold flex items-center gap-1.5 active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isBn ? "শোনো" : "Listen"}</span>
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setShowGuide((v) => !v);
              clearAll();
            }}
            className="px-3 py-2 rounded-xl bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-800 text-xs font-bold active:scale-95"
          >
            {showGuide ? (isBn ? "🙈 লুকিয়ে লেখো" : "🙈 Hide guide") : (isBn ? "👀 গাইড দেখাও" : "👀 Show guide")}
          </button>
        </div>

        <button
          onClick={check}
          disabled={!hasInk}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-md shadow-purple-200"
        >
          {isBn ? "ঠিক হয়েছে কিনা দেখি ✅" : "Check my writing ✅"}
        </button>

        {!showGuide && (
          <p className="text-center text-[11px] text-slate-500">
            {isBn
              ? "গাইড লুকানো আছে। অক্ষরটা মনে করে লেখো, তারপর পরীক্ষা করো!"
              : "The guide is hidden. Write the letter from memory, then check!"}
          </p>
        )}
      </div>

      <p className="text-center text-[11px] text-slate-400 px-4">
        {isBn
          ? "🔒 তোমার আঁকা কোথাও পাঠানো বা সংরক্ষণ করা হয় না।"
          : "🔒 Your drawing is never sent or saved anywhere."}
      </p>
    </div>
  );
};
