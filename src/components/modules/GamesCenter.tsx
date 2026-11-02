"use client";

import React, { useState, useEffect } from "react";
import { Language } from "@/types";
import { memoryCardPairs, pictureMatchItems, wordScrambleItems } from "@/data/gamesData";
import { RotateCcw } from "lucide-react";
import { sounds } from "@/utils/audio";
import { BrainGames } from "@/components/modules/BrainGames";
import confetti from "canvas-confetti";

interface MemoryCardState {
  id: string;
  pairId: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GamesCenterProps {
  lang: Language;
  onAddStars: (stars: number) => void;
}

export const GamesCenter: React.FC<GamesCenterProps> = ({ lang, onAddStars }) => {
  const [activeGame, setActiveGame] = useState<"memory" | "picture" | "spelling" | "brain">("memory");

  // Game 1: Memory Match State
  const [memoryDeck, setMemoryDeck] = useState<MemoryCardState[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [memoryScore, setMemoryScore] = useState(0);

  // Game 2: Picture Word Match State
  const [pmIndex, setPmIndex] = useState(0);
  const [pmChoice, setPmChoice] = useState<string | null>(null);
  const [pmScore, setPmScore] = useState(0);

  // Game 3: Spelling Builder State
  const [spellIndex, setSpellIndex] = useState(0);
  const [currentBuilt, setCurrentBuilt] = useState<string[]>([]);
  const [spellScore, setSpellScore] = useState(0);

  const [usedLetters, setUsedLetters] = useState<number[]>([]);
  const [spellDone, setSpellDone] = useState(false);

  // Initialize Memory Game (4 random pairs, shuffled)
  const initMemoryGame = () => {
    const pairs = [...memoryCardPairs].sort(() => Math.random() - 0.5).slice(0, 4);
    const cards: MemoryCardState[] = [];
    pairs.forEach((pair, idx) => {
      cards.push({ id: `t_${idx}`, pairId: pair.pairId, label: `${pair.letter} (${pair.name})`, isFlipped: false, isMatched: false });
      cards.push({ id: `e_${idx}`, pairId: pair.pairId, label: pair.emoji, isFlipped: false, isMatched: false });
    });
    setMemoryDeck(cards.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMemoryScore(0);
  };

  useEffect(() => {
    initMemoryGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFlipCard = (index: number) => {
    if (selectedCards.length === 2) return;
    const card = memoryDeck[index];
    if (!card || card.isFlipped || card.isMatched) return;
    sounds.playTap();

    const flipped = memoryDeck.map((c, i) => (i === index ? { ...c, isFlipped: true } : c));
    setMemoryDeck(flipped);
    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [firstIdx, secondIdx] = newSelected;
      if (flipped[firstIdx].pairId === flipped[secondIdx].pairId) {
        sounds.playSuccess();
        setTimeout(() => {
          const matched = flipped.map((c, i) => (i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c));
          setMemoryDeck(matched);
          setSelectedCards([]);
          setMemoryScore((prev) => prev + 1);
          if (matched.every((c) => c.isMatched)) {
            sounds.playCelebration();
            confetti({ particleCount: 70, spread: 80 });
            onAddStars(5);
          }
        }, 500);
      } else {
        sounds.playWrong();
        setTimeout(() => {
          setMemoryDeck(flipped.map((c, i) => (i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c)));
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // Picture Match Handler
  const handlePictureChoice = (choice: string) => {
    if (pmChoice) return;
    setPmChoice(choice);
    const curr = pictureMatchItems[pmIndex];
    const isCorrect = choice === (lang === "bn" ? curr.correctWordBn : curr.correctWordEn);
    if (isCorrect) {
      sounds.playSuccess();
      setPmScore((prev) => prev + 1);
      onAddStars(2);
      confetti({ particleCount: 30, spread: 45 });
    } else {
      sounds.playWrong();
    }
  };

  const nextPictureItem = () => {
    sounds.playTap();
    setPmChoice(null);
    setPmIndex((prev) => (prev + 1) % pictureMatchItems.length);
  };

  // Spelling Builder Handlers
  const currentSpellItem = wordScrambleItems[spellIndex];
  const handleTapLetter = (letter: string, btnIdx: number) => {
    if (spellDone || usedLetters.includes(btnIdx)) return;
    if (currentBuilt.length >= currentSpellItem.correctOrder.length) return;
    sounds.playTap();
    const nextArr = [...currentBuilt, letter];
    setCurrentBuilt(nextArr);
    setUsedLetters((prev) => [...prev, btnIdx]);
    if (nextArr.length === currentSpellItem.correctOrder.length) {
      const isCorrect = nextArr.every((l, idx) => l === currentSpellItem.correctOrder[idx]);
      if (isCorrect) {
        sounds.playSuccess();
        confetti({ particleCount: 50, spread: 60 });
        setSpellScore((prev) => prev + 1);
        setSpellDone(true);
        onAddStars(3);
      } else {
        sounds.playWrong();
        setTimeout(() => {
          setCurrentBuilt([]);
          setUsedLetters([]);
        }, 800);
      }
    }
  };

  const resetSpellWord = () => {
    sounds.playTap();
    setCurrentBuilt([]);
    setUsedLetters([]);
    setSpellDone(false);
  };

  const nextSpellWord = () => {
    sounds.playTap();
    setCurrentBuilt([]);
    setUsedLetters([]);
    setSpellDone(false);
    setSpellIndex((prev) => (prev + 1) % wordScrambleItems.length);
  };

  return (
    <div className="space-y-6">
      {/* Games Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-2">
            {lang === "bn" ? "শিশুদের মজার খেলা" : "Fun games for kids"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <span>{lang === "bn" ? "শিক্ষামূলক গেমস জোন" : "Educational Games Zone"}</span>
            <span className="text-2xl">🎮</span>
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm mt-1">
            {lang === "bn"
              ? "খেলে খেলে স্মৃতিশক্তি, মনোযোগ, বর্ণ চেনা, বানান ও গণনা চর্চা করি।"
              : "Boost memory, focus, letters, spelling and counting with joyful games."}
          </p>
        </div>

        {/* Game Mode Selector */}
        <div className="flex flex-wrap gap-2 p-1 bg-white/20 backdrop-blur-md rounded-2xl w-full md:w-auto justify-center">
          <button
            onClick={() => { sounds.playTap(); setActiveGame("memory"); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGame === "memory" ? "bg-white text-purple-900 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {lang === "bn" ? "১. বর্ণ মেলাও 🃏" : "1. Memory Match 🃏"}
          </button>
          <button
            onClick={() => { sounds.playTap(); setActiveGame("picture"); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGame === "picture" ? "bg-white text-purple-900 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {lang === "bn" ? "২. ছবি দেখে শব্দ 🖼️" : "2. Picture Match 🖼️"}
          </button>
          <button
            onClick={() => { sounds.playTap(); setActiveGame("spelling"); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGame === "spelling" ? "bg-white text-purple-900 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {lang === "bn" ? "৩. শব্দ গঠন ধাঁধা 🧩" : "3. Word Builder 🧩"}
          </button>
          <button
            onClick={() => { sounds.playTap(); setActiveGame("brain"); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGame === "brain" ? "bg-white text-purple-900 shadow-sm" : "text-white hover:bg-white/10"
            }`}
          >
            {lang === "bn" ? "৪. মেধা-বিকাশ 🧠" : "4. Brain Boost 🧠"}
          </button>
        </div>
      </div>

      {/* Brain-boost games (6 games) */}
      {activeGame === "brain" && <BrainGames lang={lang} onAddStars={onAddStars} />}

      {/* Game 1: Memory Match */}
      {activeGame === "memory" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-md max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {lang === "bn" ? "বর্ণ ও ছবি কার্ড মেলাও" : "Match Letter & Picture"}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === "bn"
                  ? "যেকোনো দুটি কার্ড উল্টে একই জোড়া খুঁজে বের করো!"
                  : "Tap two cards to find matching letter and emoji pair!"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-xs">
                {lang === "bn" ? `জোড়া মিলেছে: ${memoryScore}/৪` : `Pairs: ${memoryScore}/4`}
              </span>
              <button
                onClick={initMemoryGame}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {memoryDeck.map((card, idx) => {
              const showContent = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.id}
                  onClick={() => handleFlipCard(idx)}
                  disabled={card.isMatched}
                  className={`h-24 sm:h-28 rounded-2xl p-1 flex items-center justify-center text-center leading-tight break-words font-black transition-all duration-300 transform active:scale-95 ${
                    card.isMatched
                      ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-300 cursor-default scale-95 opacity-80"
                      : showContent
                      ? `bg-purple-600 text-white shadow-lg ${card.label.includes("(") ? "text-xs sm:text-xl" : "text-3xl sm:text-4xl"}`
                      : "bg-purple-100 hover:bg-purple-200 text-purple-400 border-2 border-purple-200 text-2xl"
                  }`}
                >
                  {showContent ? (
                    <span className="animate-pop">{card.label}</span>
                  ) : (
                    <span>❓</span>
                  )}
                </button>
              );
            })}
          </div>

          {memoryDeck.length > 0 && memoryDeck.every((c) => c.isMatched) && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-center animate-pop">
              <h4 className="text-lg font-bold text-emerald-900">
                {lang === "bn" ? "🎉 অসাধারণ! সব কার্ড মিলে গেছে! (+৫ তারা অর্জিত)" : "🎉 Amazing! All cards matched! (+5 stars)"}
              </h4>
              <button
                onClick={initMemoryGame}
                className="mt-3 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold"
              >
                {lang === "bn" ? "আবার খেলো 🔄" : "Play again 🔄"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Game 2: Picture Match Quiz */}
      {activeGame === "picture" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-md max-w-xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{lang === "bn" ? "প্রশ্ন" : "Question"} {pmIndex + 1} / {pictureMatchItems.length}</span>
            <span className="text-purple-600">{lang === "bn" ? "স্কোর" : "Score"}: {pmScore}</span>
          </div>

          <div className="w-28 h-28 mx-auto rounded-3xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-6xl shadow-inner animate-pulse-gentle">
            {pictureMatchItems[pmIndex].emoji}
          </div>

          <h3 className="text-xl font-extrabold text-slate-800">
            {lang === "bn" ? "ছবির সাথে সঠিক শব্দটি মেলাও:" : "Select the matching word for the picture:"}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {(lang === "bn"
              ? pictureMatchItems[pmIndex].optionsBn
              : pictureMatchItems[pmIndex].optionsEn
            ).map((opt) => {
              const curr = pictureMatchItems[pmIndex];
              const isCorrect = opt === (lang === "bn" ? curr.correctWordBn : curr.correctWordEn);
              const isSelected = pmChoice === opt;

              let style = "bg-slate-50 hover:bg-purple-50 text-slate-800 border-slate-200";
              if (pmChoice) {
                if (isCorrect) style = "bg-emerald-500 text-white border-emerald-600 shadow-md";
                else if (isSelected) style = "bg-rose-500 text-white border-rose-600";
              }

              return (
                <button
                  key={opt}
                  onClick={() => handlePictureChoice(opt)}
                  disabled={!!pmChoice}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-base sm:text-lg border-2 transition-all active:scale-95 ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {pmChoice && (
            <div className="space-y-3 animate-pop">
              <p className="text-sm font-bold text-slate-700">
                {pmChoice ===
                (lang === "bn"
                  ? pictureMatchItems[pmIndex].correctWordBn
                  : pictureMatchItems[pmIndex].correctWordEn)
                  ? (lang === "bn" ? "দারুণ! সঠিক উত্তর! 🌟 (+২ তারা)" : "Great! Correct answer! 🌟 (+2 stars)")
                  : (lang === "bn"
                    ? `একটু ভুল হলো! সঠিক উত্তর: ${pictureMatchItems[pmIndex].correctWordBn}`
                    : `Oops, not quite! The right answer is: ${pictureMatchItems[pmIndex].correctWordEn}`)}
              </p>
              <button
                onClick={nextPictureItem}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-purple-200"
              >
                <span>{lang === "bn" ? "পরবর্তী ছবি ➡️" : "Next picture ➡️"}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Game 3: Spelling Builder */}
      {activeGame === "spelling" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-md max-w-xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{lang === "bn" ? "শব্দ" : "Word"} {spellIndex + 1} / {wordScrambleItems.length}</span>
            <span className="text-purple-600">{lang === "bn" ? "সঠিক বানান" : "Correct spellings"}: {spellScore}</span>
          </div>

          <div className="text-6xl animate-bounce">
            {currentSpellItem.emoji}
          </div>

          <h3 className="text-xl font-extrabold text-slate-800">
            {lang === "bn" ? "অক্ষর সাজিয়ে সঠিক বানান তৈরি করো:" : "Tap the Bengali letters in order to spell the word:"}
          </h3>

          {/* Constructed word boxes */}
          <div className="flex justify-center gap-2 min-h-[56px]">
            {currentSpellItem.correctOrder.map((_, idx) => (
              <div
                key={idx}
                className="w-14 h-14 rounded-2xl border-2 border-dashed border-purple-400 bg-purple-50 flex items-center justify-center text-2xl font-black text-purple-900 shadow-inner"
              >
                {currentBuilt[idx] || ""}
              </div>
            ))}
          </div>

          {/* Jumbled choices */}
          <div className="flex justify-center gap-3">
            {currentSpellItem.jumbledLetters.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleTapLetter(letter, idx)}
                disabled={usedLetters.includes(idx) || spellDone || currentBuilt.length >= currentSpellItem.correctOrder.length}
                className="w-14 h-14 rounded-2xl bg-white hover:bg-purple-600 hover:text-white border-2 border-purple-300 text-2xl font-bold text-slate-800 shadow-sm active:scale-90 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-800"
              >
                {letter}
              </button>
            ))}
          </div>

          {spellDone && (
            <p className="text-sm font-bold text-emerald-700 animate-pop">
              {lang === "bn" ? "🎉 দারুণ! বানান সঠিক হয়েছে! (+৩ তারা)" : "🎉 Great! Spelled correctly! (+3 stars)"}
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={resetSpellWord}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              {lang === "bn" ? "আবার সাজাও 🔄" : "Reset 🔄"}
            </button>
            <button
              onClick={nextSpellWord}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              {lang === "bn" ? "পরবর্তী শব্দ ➡️" : "Next word ➡️"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
