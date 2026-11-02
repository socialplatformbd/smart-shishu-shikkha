"use client";

import React, { useState, useEffect, useRef } from "react";
import { Language } from "@/types";
import { bengaliVowels, bengaliConsonants } from "@/data/bengaliData";
import { englishAlphabet } from "@/data/englishData";
import { sounds } from "@/utils/audio";
import confetti from "canvas-confetti";

/*
 * Brain-boost games: memory, attention, logic, counting, language and time.
 * Nothing is sent anywhere. The only thing saved is the child's best level, on this device (localStorage).
 */

interface BrainGamesProps {
  lang: Language;
  onAddStars: (stars: number) => void;
}

type GameId = "simon" | "missing" | "odd" | "order" | "letter" | "clock";

interface GameProps {
  isBn: boolean;
  onAddStars: (stars: number) => void;
  best: number;
  onBest: (value: number) => void;
}

const BEST_KEY = "smart_shishu_brain_best_v1";

function loadBest(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BEST_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveBest(all: Record<string, number>) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(all));
  } catch {
    // saving is optional
  }
}

const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
const num = (isBn: boolean, n: number) => (isBn ? toBn(n) : String(n));

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/** Timers that are always cleaned up when the child leaves the game. */
function useTimers() {
  const ids = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    ids.current.push(id);
  };
  const clear = () => {
    ids.current.forEach((id) => window.clearTimeout(id));
    ids.current = [];
  };
  useEffect(() => clear, []); // eslint-disable-line react-hooks/exhaustive-deps
  return { later, clear };
}

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-center min-w-[72px]">
    <div className="text-[10px] font-bold text-purple-600">{label}</div>
    <div className="text-base font-extrabold text-purple-900">{value}</div>
  </div>
);

const BigButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-md shadow-purple-200"
  >
    {children}
  </button>
);

// ===========================================================================
// 1) Colour memory (Simon)
// ===========================================================================
const PADS = [
  { color: "bg-rose-500", lit: "bg-rose-200 ring-4 ring-rose-400", freq: 262 },
  { color: "bg-emerald-500", lit: "bg-emerald-200 ring-4 ring-emerald-400", freq: 330 },
  { color: "bg-sky-500", lit: "bg-sky-200 ring-4 ring-sky-400", freq: 392 },
  { color: "bg-amber-400", lit: "bg-amber-100 ring-4 ring-amber-300", freq: 523 },
];

const SimonGame: React.FC<GameProps> = ({ isBn, onAddStars, best, onBest }) => {
  const { later, clear } = useTimers();
  const [seq, setSeq] = useState<number[]>([]);
  const [phase, setPhase] = useState<"idle" | "show" | "input" | "wait" | "over">("idle");
  const [lit, setLit] = useState<number | null>(null);
  const [pos, setPos] = useState(0);

  const playSequence = (sequence: number[]) => {
    setPhase("show");
    setPos(0);
    sequence.forEach((pad, i) => {
      later(() => {
        setLit(pad);
        sounds.playNote(PADS[pad].freq, 450);
      }, 700 + i * 800);
      later(() => setLit(null), 700 + i * 800 + 450);
    });
    later(() => setPhase("input"), 700 + sequence.length * 800);
  };

  const start = () => {
    clear();
    const first = [randInt(0, 3)];
    setSeq(first);
    playSequence(first);
  };

  const press = (pad: number) => {
    if (phase !== "input") return;
    setLit(pad);
    sounds.playNote(PADS[pad].freq, 300);
    later(() => setLit(null), 220);

    if (pad === seq[pos]) {
      if (pos + 1 === seq.length) {
        // round finished
        setPhase("wait");
        sounds.playSuccess();
        onAddStars(1);
        if (seq.length > best) onBest(seq.length);
        const next = [...seq, randInt(0, 3)];
        later(() => {
          setSeq(next);
          playSequence(next);
        }, 1000);
      } else {
        setPos(pos + 1);
      }
    } else {
      setPhase("over");
      sounds.playWrong();
    }
  };

  const status =
    phase === "idle" ? (isBn ? "শুরু করতে বাটন চাপো" : "Press start to begin")
    : phase === "show" ? (isBn ? "👀 ভালো করে দেখো..." : "👀 Watch carefully...")
    : phase === "input" ? (isBn ? "👆 এবার তুমি করো!" : "👆 Now you repeat it!")
    : phase === "wait" ? (isBn ? "🎉 দারুণ! পরের রাউন্ড..." : "🎉 Great! Next round...")
    : (isBn ? `😅 ভুল হয়ে গেছে! তুমি ${toBn(Math.max(seq.length - 1, 0))} ধাপ পর্যন্ত মনে রেখেছ।` : `😅 Oops! You remembered ${Math.max(seq.length - 1, 0)} steps.`);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Stat label={isBn ? "ধাপ" : "Level"} value={num(isBn, seq.length)} />
        <Stat label={isBn ? "সেরা" : "Best"} value={num(isBn, best)} />
      </div>
      <p className="text-center text-sm font-bold text-slate-700 min-h-[40px]">{status}</p>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {PADS.map((p, i) => (
          <button
            key={i}
            onClick={() => press(i)}
            aria-label={`pad ${i + 1}`}
            className={`h-28 sm:h-32 rounded-3xl transition-all duration-150 active:scale-95 ${lit === i ? p.lit : p.color} ${
              phase === "input" ? "" : "opacity-90"
            }`}
          />
        ))}
      </div>
      {(phase === "idle" || phase === "over") && (
        <BigButton onClick={start}>{phase === "idle" ? (isBn ? "শুরু করো ▶️" : "Start ▶️") : (isBn ? "আবার খেলো 🔄" : "Play again 🔄")}</BigButton>
      )}
    </div>
  );
};

// ===========================================================================
// 2) What is missing?
// ===========================================================================
const EMOJI_POOL = ["🍎", "🍌", "🍇", "🍊", "🍓", "🐶", "🐱", "🐟", "🐦", "🐘", "🚗", "🚌", "✈️", "⚽", "📚", "✏️", "🎈", "🌳", "🌸", "⭐", "🌙", "☂️", "🔔", "🎒", "🍪", "🥕", "🎁", "🐢"];

interface MissingRound {
  items: string[];
  missing: number;
  options: string[];
}

function makeMissingRound(level: number): MissingRound {
  const count = Math.min(3 + Math.floor(level / 2), 6);
  const items = shuffle(EMOJI_POOL).slice(0, count);
  const missing = randInt(0, count - 1);
  const distractors = shuffle(EMOJI_POOL.filter((e) => !items.includes(e))).slice(0, 2);
  return { items, missing, options: shuffle([items[missing], ...distractors]) };
}

const MissingGame: React.FC<GameProps> = ({ isBn, onAddStars, best, onBest }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState<MissingRound>(() => makeMissingRound(1));
  const [roundKey, setRoundKey] = useState(0);
  const [phase, setPhase] = useState<"show" | "ask" | "result">("show");
  const [picked, setPicked] = useState<string | null>(null);

  const showMs = 2500 + round.items.length * 600;

  useEffect(() => {
    if (phase !== "show") return;
    const t = window.setTimeout(() => setPhase("ask"), showMs);
    return () => window.clearTimeout(t);
  }, [phase, roundKey, showMs]);

  const choose = (emoji: string) => {
    if (phase !== "ask") return;
    setPicked(emoji);
    setPhase("result");
    if (emoji === round.items[round.missing]) {
      sounds.playSuccess();
      confetti({ particleCount: 30, spread: 45 });
      onAddStars(2);
      const next = level + 1;
      setLevel(next);
      if (next - 1 > best) onBest(next - 1);
    } else {
      sounds.playWrong();
    }
  };

  const nextRound = () => {
    sounds.playTap();
    setRound(makeMissingRound(level));
    setRoundKey((k) => k + 1);
    setPicked(null);
    setPhase("show");
  };

  const isCorrect = picked === round.items[round.missing];

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Stat label={isBn ? "স্তর" : "Level"} value={num(isBn, level)} />
        <Stat label={isBn ? "সেরা" : "Best"} value={num(isBn, best)} />
      </div>
      <p className="text-center text-sm font-bold text-slate-700">
        {phase === "show" ? (isBn ? "👀 ছবিগুলো মনে রাখো!" : "👀 Remember these pictures!")
          : phase === "ask" ? (isBn ? "🤔 কোনটা হারিয়ে গেল?" : "🤔 Which one is missing?")
          : isCorrect ? (isBn ? "🎉 একদম ঠিক! (+২ তারা)" : "🎉 Exactly right! (+2 stars)")
          : (isBn ? `😅 হারিয়ে গিয়েছিল: ${round.items[round.missing]}` : `😅 The missing one was: ${round.items[round.missing]}`)}
      </p>

      <div className="flex flex-wrap justify-center gap-3 p-4 bg-purple-50 rounded-3xl border border-purple-100 min-h-[100px]">
        {round.items.map((e, i) => (
          <span
            key={i}
            className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-3xl sm:text-4xl rounded-2xl bg-white shadow-sm ${
              phase !== "show" && i === round.missing ? "border-2 border-dashed border-amber-400 bg-amber-50" : ""
            }`}
          >
            {phase !== "show" && i === round.missing ? (phase === "result" ? e : "❓") : e}
          </span>
        ))}
      </div>

      {phase === "show" && (
        <button
          onClick={() => setPhase("ask")}
          className="w-full py-2.5 bg-white border-2 border-purple-200 text-purple-800 font-bold rounded-2xl active:scale-95 text-sm"
        >
          {isBn ? "মনে রেখেছি ✔" : "I remember ✔"}
        </button>
      )}

      {phase !== "show" && (
        <div className="flex justify-center gap-3">
          {round.options.map((o) => (
            <button
              key={o}
              onClick={() => choose(o)}
              disabled={phase === "result"}
              className={`w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl rounded-2xl border-2 transition-all active:scale-95 ${
                phase === "result"
                  ? o === round.items[round.missing] ? "bg-emerald-100 border-emerald-500"
                    : o === picked ? "bg-rose-100 border-rose-400" : "bg-white border-slate-200 opacity-60"
                  : "bg-white border-purple-200 hover:bg-purple-50"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}

      {phase === "result" && <BigButton onClick={nextRound}>{isBn ? "পরের রাউন্ড ➡️" : "Next round ➡️"}</BigButton>}
    </div>
  );
};

// ===========================================================================
// 3) Find the odd one out
// ===========================================================================
const ODD_PAIRS: [string, string][] = [
  ["🍎", "🍅"], ["🐶", "🐺"], ["🌞", "🌝"], ["😀", "😃"], ["⭐", "🌟"], ["🐥", "🐤"], ["🍊", "🍑"], ["🧡", "❤️"], ["🔵", "🟣"], ["🐭", "🐹"],
];

interface OddRound {
  base: string;
  odd: string;
  size: number;
  oddIndex: number;
}

function makeOddRound(level: number): OddRound {
  const size = level < 4 ? 3 : 4;
  const [a, b] = shuffle(ODD_PAIRS)[0];
  const swap = Math.random() < 0.5;
  return { base: swap ? a : b, odd: swap ? b : a, size, oddIndex: randInt(0, size * size - 1) };
}

const OddGame: React.FC<GameProps> = ({ isBn, onAddStars, best, onBest }) => {
  const { later } = useTimers();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState<OddRound>(() => makeOddRound(1));
  const [wrong, setWrong] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const tap = (i: number) => {
    if (locked) return;
    if (i === round.oddIndex) {
      setLocked(true);
      sounds.playSuccess();
      onAddStars(1);
      const nextScore = score + 1;
      setScore(nextScore);
      if (nextScore > best) onBest(nextScore);
      later(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        setRound(makeOddRound(nextLevel));
        setWrong(null);
        setLocked(false);
      }, 500);
    } else {
      sounds.playWrong();
      setWrong(i);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Stat label={isBn ? "স্কোর" : "Score"} value={num(isBn, score)} />
        <Stat label={isBn ? "সেরা" : "Best"} value={num(isBn, best)} />
      </div>
      <p className="text-center text-sm font-bold text-slate-700">
        {wrong !== null
          ? (isBn ? "আবার ভালো করে দেখো 🔍" : "Look again carefully 🔍")
          : (isBn ? "🔍 যেটা একটু আলাদা, সেটা ট্যাপ করো!" : "🔍 Tap the one that is a little different!")}
      </p>
      <div
        className="grid gap-2 max-w-xs mx-auto"
        style={{ gridTemplateColumns: `repeat(${round.size}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: round.size * round.size }).map((_, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`aspect-square rounded-2xl text-3xl sm:text-4xl flex items-center justify-center border-2 active:scale-90 transition-all ${
              i === wrong ? "bg-rose-100 border-rose-400"
                : locked && i === round.oddIndex ? "bg-emerald-100 border-emerald-500"
                : "bg-white border-slate-200 hover:bg-purple-50"
            }`}
          >
            {i === round.oddIndex ? round.odd : round.base}
          </button>
        ))}
      </div>
    </div>
  );
};

// ===========================================================================
// 4) Tap the numbers in order
// ===========================================================================
interface OrderRound {
  numbers: number[];
  desc: boolean;
}

function makeOrderRound(level: number): OrderRound {
  const count = [5, 7, 9][Math.min(level - 1, 2)];
  const desc = level % 4 === 0;
  return { numbers: shuffle(Array.from({ length: count }, (_, i) => i + 1)), desc };
}

const OrderGame: React.FC<GameProps> = ({ isBn, onAddStars, best, onBest }) => {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState<OrderRound>(() => makeOrderRound(1));
  const [done, setDone] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const startRef = useRef<number>(0);

  const total = round.numbers.length;
  const expected = round.desc ? total - done.length : done.length + 1;

  const tap = (n: number) => {
    if (finished || done.includes(n)) return;
    if (done.length === 0) startRef.current = Date.now();
    if (n === expected) {
      sounds.playTap();
      const nextDone = [...done, n];
      setDone(nextDone);
      setWrong(null);
      if (nextDone.length === total) {
        setFinished(true);
        setSeconds(Math.max(1, Math.round((Date.now() - startRef.current) / 1000)));
        sounds.playSuccess();
        confetti({ particleCount: 40, spread: 50 });
        onAddStars(2);
        if (level > best) onBest(level);
      }
    } else {
      sounds.playWrong();
      setWrong(n);
    }
  };

  const next = () => {
    sounds.playTap();
    const nextLevel = level + 1;
    setLevel(nextLevel);
    setRound(makeOrderRound(nextLevel));
    setDone([]);
    setWrong(null);
    setFinished(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Stat label={isBn ? "স্তর" : "Level"} value={num(isBn, level)} />
        <Stat label={isBn ? "সেরা" : "Best"} value={num(isBn, best)} />
      </div>
      <p className="text-center text-sm font-bold text-slate-700">
        {finished
          ? (isBn ? `🎉 সব ঠিক! সময় লেগেছে ${toBn(seconds)} সেকেন্ড (+২ তারা)` : `🎉 All correct! It took ${seconds} seconds (+2 stars)`)
          : round.desc
            ? (isBn ? "⬇️ বড় থেকে ছোট ক্রমে ট্যাপ করো!" : "⬇️ Tap from biggest to smallest!")
            : (isBn ? "⬆️ ছোট থেকে বড় ক্রমে ট্যাপ করো!" : "⬆️ Tap from smallest to biggest!")}
      </p>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {round.numbers.map((n) => {
          const isDone = done.includes(n);
          return (
            <button
              key={n}
              onClick={() => tap(n)}
              className={`aspect-square rounded-2xl text-2xl sm:text-3xl font-extrabold border-2 active:scale-90 transition-all ${
                isDone ? "bg-emerald-100 border-emerald-400 text-emerald-500"
                  : n === wrong ? "bg-rose-100 border-rose-400 text-rose-700"
                  : "bg-white border-purple-200 text-purple-900 hover:bg-purple-50"
              }`}
            >
              {isBn ? toBn(n) : n}
            </button>
          );
        })}
      </div>
      {finished && <BigButton onClick={next}>{isBn ? "পরের স্তর ➡️" : "Next level ➡️"}</BigButton>}
    </div>
  );
};

// ===========================================================================
// 5) First letter (phonics)
// ===========================================================================
interface LetterQ {
  emoji: string;
  word: string;
  answer: string;
  options: string[];
}

function makeLetterQ(isBn: boolean): LetterQ {
  const pool = isBn
    ? [...bengaliVowels, ...bengaliConsonants]
        .filter((x) => x.word.startsWith(x.letter))
        .map((x) => ({ letter: x.letter, word: x.word, emoji: x.emoji }))
    : englishAlphabet.map((x) => ({ letter: x.letter, word: x.word, emoji: x.emoji }));
  const pick = pool[randInt(0, pool.length - 1)];
  const others = shuffle(pool.filter((x) => x.letter !== pick.letter)).slice(0, 2).map((x) => x.letter);
  return { emoji: pick.emoji, word: pick.word, answer: pick.letter, options: shuffle([pick.letter, ...others]) };
}

const LetterGame: React.FC<GameProps> = ({ isBn, onAddStars, best, onBest }) => {
  const { later } = useTimers();
  const [q, setQ] = useState<LetterQ>(() => makeLetterQ(isBn));
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (letter: string) => {
    if (picked) return;
    setPicked(letter);
    if (letter === q.answer) {
      sounds.playSuccess();
      onAddStars(1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > best) onBest(nextStreak);
    } else {
      sounds.playWrong();
      setStreak(0);
    }
    later(() => {
      setQ(makeLetterQ(isBn));
      setPicked(null);
    }, 1100);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Stat label={isBn ? "টানা ঠিক" : "Streak"} value={num(isBn, streak)} />
        <Stat label={isBn ? "সেরা" : "Best"} value={num(isBn, best)} />
      </div>
      <p className="text-center text-sm font-bold text-slate-700">
        {isBn ? "এই নামটা কোন অক্ষর দিয়ে শুরু হয়?" : "Which letter does this word start with?"}
      </p>
      <div className="text-center p-5 bg-purple-50 rounded-3xl border border-purple-100">
        <div className="text-6xl">{q.emoji}</div>
        <div className="mt-2 text-xl font-extrabold text-slate-800">{q.word}</div>
      </div>
      <div className="flex justify-center gap-3">
        {q.options.map((o) => (
          <button
            key={o}
            onClick={() => choose(o)}
            disabled={picked !== null}
            className={`w-20 h-20 rounded-2xl text-3xl font-extrabold border-2 transition-all active:scale-95 ${
              picked === null ? "bg-white border-purple-200 text-purple-900 hover:bg-purple-50"
                : o === q.answer ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                : o === picked ? "bg-rose-100 border-rose-400 text-rose-800"
                : "bg-white border-slate-200 text-slate-400"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className={`text-center text-sm font-bold ${picked === q.answer ? "text-emerald-700" : "text-rose-700"}`}>
          {picked === q.answer
            ? (isBn ? "🎉 ঠিক! (+১ তারা)" : "🎉 Correct! (+1 star)")
            : (isBn ? `সঠিক উত্তর: ${q.answer}` : `The answer is: ${q.answer}`)}
        </p>
      )}
    </div>
  );
};

// ===========================================================================
// 6) Read the clock
// ===========================================================================
interface ClockQ {
  hour: number;
  minute: 0 | 30;
  options: { hour: number; minute: 0 | 30 }[];
}

function makeClockQ(level: number): ClockQ {
  const hour = randInt(1, 12);
  const minute: 0 | 30 = level >= 3 && Math.random() < 0.5 ? 30 : 0;
  const wrongOnes: { hour: number; minute: 0 | 30 }[] = [];
  while (wrongOnes.length < 2) {
    const h = randInt(1, 12);
    const m: 0 | 30 = level >= 3 && Math.random() < 0.5 ? 30 : 0;
    if ((h !== hour || m !== minute) && !wrongOnes.some((w) => w.hour === h && w.minute === m)) {
      wrongOnes.push({ hour: h, minute: m });
    }
  }
  return { hour, minute, options: shuffle([{ hour, minute }, ...wrongOnes]) };
}

const fmtTime = (isBn: boolean, h: number, m: number) => {
  const text = `${h}:${m === 0 ? "00" : "30"}`;
  return isBn ? toBn(text) : text;
};

const Clock: React.FC<{ hour: number; minute: number; isBn: boolean }> = ({ hour, minute, isBn }) => {
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;
  const point = (angle: number, len: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: 100 + len * Math.cos(rad), y: 100 + len * Math.sin(rad) };
  };
  const hEnd = point(hourAngle, 48);
  const mEnd = point(minuteAngle, 70);
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56 mx-auto" role="img" aria-label="clock">
      <circle cx="100" cy="100" r="95" fill="#ffffff" stroke="#7c3aed" strokeWidth="6" />
      {Array.from({ length: 12 }).map((_, i) => {
        const n = i + 1;
        const p = point(n * 30, 78);
        return (
          <text key={n} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="17" fontWeight="700" fill="#4c1d95">
            {isBn ? toBn(n) : n}
          </text>
        );
      })}
      <line x1="100" y1="100" x2={hEnd.x} y2={hEnd.y} stroke="#1e1b4b" strokeWidth="8" strokeLinecap="round" />
      <line x1="100" y1="100" x2={mEnd.x} y2={mEnd.y} stroke="#e11d48" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="7" fill="#7c3aed" />
    </svg>
  );
};

const ClockGame: React.FC<GameProps> = ({ isBn, onAddStars, best, onBest }) => {
  const { later } = useTimers();
  const [level, setLevel] = useState(1);
  const [q, setQ] = useState<ClockQ>(() => makeClockQ(1));
  const [picked, setPicked] = useState<{ hour: number; minute: number } | null>(null);
  const [score, setScore] = useState(0);

  const choose = (o: { hour: number; minute: number }) => {
    if (picked) return;
    setPicked(o);
    const ok = o.hour === q.hour && o.minute === q.minute;
    if (ok) {
      sounds.playSuccess();
      onAddStars(2);
      const nextScore = score + 1;
      setScore(nextScore);
      if (nextScore > best) onBest(nextScore);
    } else {
      sounds.playWrong();
    }
    later(() => {
      const nextLevel = ok ? level + 1 : level;
      setLevel(nextLevel);
      setQ(makeClockQ(nextLevel));
      setPicked(null);
    }, 1300);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Stat label={isBn ? "ঠিক উত্তর" : "Correct"} value={num(isBn, score)} />
        <Stat label={isBn ? "সেরা" : "Best"} value={num(isBn, best)} />
      </div>
      <p className="text-center text-sm font-bold text-slate-700">
        {isBn ? "ঘড়িতে এখন কয়টা বাজে? (ছোট কাঁটা = ঘণ্টা, লাল বড় কাঁটা = মিনিট)" : "What time is it? (short hand = hour, red long hand = minutes)"}
      </p>
      <Clock hour={q.hour} minute={q.minute} isBn={isBn} />
      <div className="flex justify-center gap-3">
        {q.options.map((o) => {
          const isAnswer = o.hour === q.hour && o.minute === q.minute;
          const isPicked = picked && picked.hour === o.hour && picked.minute === o.minute;
          return (
            <button
              key={`${o.hour}-${o.minute}`}
              onClick={() => choose(o)}
              disabled={picked !== null}
              className={`px-4 py-3 rounded-2xl text-lg font-extrabold border-2 transition-all active:scale-95 ${
                picked === null ? "bg-white border-purple-200 text-purple-900 hover:bg-purple-50"
                  : isAnswer ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                  : isPicked ? "bg-rose-100 border-rose-400 text-rose-800"
                  : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              {fmtTime(isBn, o.hour, o.minute)}
            </button>
          );
        })}
      </div>
      {picked && (
        <p className={`text-center text-sm font-bold ${picked.hour === q.hour && picked.minute === q.minute ? "text-emerald-700" : "text-rose-700"}`}>
          {picked.hour === q.hour && picked.minute === q.minute
            ? (isBn ? "🎉 ঠিক! (+২ তারা)" : "🎉 Correct! (+2 stars)")
            : (isBn ? `সঠিক সময়: ${fmtTime(true, q.hour, q.minute)}` : `The time is ${fmtTime(false, q.hour, q.minute)}`)}
        </p>
      )}
    </div>
  );
};

// ===========================================================================
// Hub
// ===========================================================================
const GAMES: {
  id: GameId;
  icon: string;
  titleBn: string;
  titleEn: string;
  skillBn: string;
  skillEn: string;
  descBn: string;
  descEn: string;
}[] = [
  { id: "simon", icon: "🎨", titleBn: "রং মনে রাখো", titleEn: "Colour Memory", skillBn: "স্মৃতিশক্তি", skillEn: "Memory", descBn: "রঙের ক্রম দেখে একই ক্রমে ট্যাপ করো।", descEn: "Watch the colours, then repeat the order." },
  { id: "missing", icon: "🕵️", titleBn: "কোনটা হারিয়ে গেল?", titleEn: "What is Missing?", skillBn: "মনে রাখা", skillEn: "Recall", descBn: "ছবিগুলো মনে রাখো, কোনটা নেই বলো।", descEn: "Remember the pictures and spot the missing one." },
  { id: "odd", icon: "🔍", titleBn: "ভিন্নটি খোঁজো", titleEn: "Find the Odd One", skillBn: "মনোযোগ", skillEn: "Focus", descBn: "অনেক ছবির মধ্যে আলাদাটা খুঁজে বের করো।", descEn: "Find the different picture in the crowd." },
  { id: "order", icon: "🔢", titleBn: "ক্রমে ট্যাপ করো", titleEn: "Number Order", skillBn: "গণনা", skillEn: "Counting", descBn: "সংখ্যাগুলো ছোট থেকে বড় (বা উল্টো) ক্রমে ট্যাপ করো।", descEn: "Tap the numbers in the right order." },
  { id: "letter", icon: "🔤", titleBn: "প্রথম অক্ষর", titleEn: "First Letter", skillBn: "ভাষা", skillEn: "Language", descBn: "ছবির নাম কোন অক্ষর দিয়ে শুরু, বলো।", descEn: "Say which letter the picture's name begins with." },
  { id: "clock", icon: "🕒", titleBn: "ঘড়ি দেখো", titleEn: "Read the Clock", skillBn: "সময় বোঝা", skillEn: "Time", descBn: "ঘড়ি দেখে কয়টা বাজে বলো।", descEn: "Read the clock and tell the time." },
];

export const BrainGames: React.FC<BrainGamesProps> = ({ lang, onAddStars }) => {
  const isBn = lang === "bn";
  const [game, setGame] = useState<GameId | null>(null);
  const [best, setBest] = useState<Record<string, number>>(loadBest);

  const updateBest = (id: GameId) => (value: number) => {
    setBest((prev) => {
      if ((prev[id] ?? 0) >= value) return prev;
      const next = { ...prev, [id]: value };
      saveBest(next);
      return next;
    });
  };

  const active = GAMES.find((g) => g.id === game);

  if (!active) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-extrabold text-purple-900">{isBn ? "🧠 মেধা-বিকাশ গেম" : "🧠 Brain-Boost Games"}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {isBn
              ? "মনে রাখা, মনোযোগ, গণনা, ভাষা ও সময় বোঝার ক্ষমতা বাড়াও। যত খেলবে তত বুদ্ধি বাড়বে!"
              : "Train memory, focus, counting, language and time-telling. The more you play, the sharper you get!"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => { sounds.playTap(); setGame(g.id); }}
              className="text-left p-4 rounded-3xl bg-white border-2 border-purple-200 hover:border-purple-400 shadow-sm active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl shrink-0">{g.icon}</span>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-800">{isBn ? g.titleBn : g.titleEn}</h4>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {isBn ? g.skillBn : g.skillEn}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">{isBn ? g.descBn : g.descEn}</p>
              <p className="text-[11px] font-bold text-amber-700 mt-1.5">
                🏆 {isBn ? "সেরা:" : "Best:"} {num(isBn, best[g.id] ?? 0)}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const common: GameProps = {
    isBn,
    onAddStars,
    best: best[active.id] ?? 0,
    onBest: updateBest(active.id),
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => { sounds.playTap(); setGame(null); }}
          className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-purple-800 text-xs font-bold active:scale-95"
        >
          ⬅️ {isBn ? "সব গেম" : "All games"}
        </button>
        <h3 className="text-base font-extrabold text-purple-900 flex items-center gap-1.5">
          <span>{active.icon}</span>
          <span>{isBn ? active.titleBn : active.titleEn}</span>
        </h3>
      </div>
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-purple-200 shadow-md">
        {active.id === "simon" && <SimonGame {...common} />}
        {active.id === "missing" && <MissingGame {...common} />}
        {active.id === "odd" && <OddGame {...common} />}
        {active.id === "order" && <OrderGame {...common} />}
        {active.id === "letter" && <LetterGame {...common} />}
        {active.id === "clock" && <ClockGame {...common} />}
      </div>
    </div>
  );
};
