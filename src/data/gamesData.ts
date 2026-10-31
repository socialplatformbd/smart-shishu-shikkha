export interface MemoryCard {
  id: string;
  pairId: string;
  display: string;
  type: "text" | "emoji";
  matched: boolean;
}

export const memoryCardPairs = [
  { pairId: "a", letter: "অ", name: "অজগর", emoji: "🐍" },
  { pairId: "aa", letter: "আ", name: "আম", emoji: "🥭" },
  { pairId: "i", letter: "ই", name: "ইঁদুর", emoji: "🐭" },
  { pairId: "k", letter: "ক", name: "কলম", emoji: "🖊️" },
  { pairId: "g", letter: "গ", name: "গরু", emoji: "🐄" },
  { pairId: "m", letter: "ম", name: "মাছ", emoji: "🐟" },
];

export interface PictureMatchItem {
  id: string;
  imageUrl: string;
  emoji: string;
  correctWordBn: string;
  correctWordEn: string;
  optionsBn: string[];
  optionsEn: string[];
  hintBn: string;
  hintEn: string;
}

export const pictureMatchItems: PictureMatchItem[] = [
  {
    id: "pm1",
    imageUrl: "",
    emoji: "🐯",
    correctWordBn: "বাঘ",
    correctWordEn: "Tiger",
    optionsBn: ["বাঘ", "সিংহ", "বিড়াল", "ভালুক"],
    optionsEn: ["Tiger", "Lion", "Cat", "Bear"],
    hintBn: "এটি বনের ডোরাকাটা সুন্দর প্রাণী।",
    hintEn: "A wild striped big cat.",
  },
  {
    id: "pm2",
    imageUrl: "",
    emoji: "🍎",
    correctWordBn: "আপেল",
    correctWordEn: "Apple",
    optionsBn: ["কলা", "আপেল", "কমলা", "আম"],
    optionsEn: ["Banana", "Apple", "Orange", "Mango"],
    hintBn: "মিষ্টি লাল রঙের রসালো ফল।",
    hintEn: "A sweet crunchy red fruit.",
  },
  {
    id: "pm3",
    imageUrl: "",
    emoji: "⛵",
    correctWordBn: "নৌকা",
    correctWordEn: "Boat",
    optionsBn: ["গাড়ি", "বিমান", "নৌকা", "ট্রেন"],
    optionsEn: ["Car", "Aeroplane", "Boat", "Train"],
    hintBn: "এটি নদীর পানিতে ভাসে।",
    hintEn: "Floats across rivers and ponds.",
  },
  {
    id: "pm4",
    imageUrl: "",
    emoji: "🦜",
    correctWordBn: "টিয়া",
    correctWordEn: "Parrot",
    optionsBn: ["দোয়েল", "টিয়া", "কাক", "বুলবুলি"],
    optionsEn: ["Magpie", "Parrot", "Crow", "Nightingale"],
    hintBn: "এর শরীর সবুজ ও ঠোঁট লাল।",
    hintEn: "Green feathers and a curved red beak.",
  },
  {
    id: "pm5",
    imageUrl: "",
    emoji: "🌙",
    correctWordBn: "চাঁদ",
    correctWordEn: "Moon",
    optionsBn: ["সূর্য", "তারা", "মেঘ", "চাঁদ"],
    optionsEn: ["Sun", "Star", "Cloud", "Moon"],
    hintBn: "রাতের আকাশে রুপালি আলো দেয়।",
    hintEn: "Glows gently in the night sky.",
  },
];

export interface WordScrambleItem {
  id: string;
  emoji: string;
  wordBn: string;
  wordEn: string;
  jumbledLetters: string[];
  correctOrder: string[];
}

export const wordScrambleItems: WordScrambleItem[] = [
  {
    id: "ws1",
    emoji: "🥭",
    wordBn: "আম",
    wordEn: "MANGO",
    jumbledLetters: ["ম", "আ"],
    correctOrder: ["আ", "ম"],
  },
  {
    id: "ws2",
    emoji: "🖊️",
    wordBn: "কলম",
    wordEn: "PEN",
    jumbledLetters: ["ম", "ক", "ল"],
    correctOrder: ["ক", "ল", "ম"],
  },
  {
    id: "ws3",
    emoji: "🐟",
    wordBn: "মাছ",
    wordEn: "FISH",
    jumbledLetters: ["ছ", "মা"],
    correctOrder: ["মা", "ছ"],
  },
  {
    id: "ws4",
    emoji: "📚",
    wordBn: "বই",
    wordEn: "BOOK",
    jumbledLetters: ["ই", "ব"],
    correctOrder: ["ব", "ই"],
  },
  {
    id: "ws5",
    emoji: "🌸",
    wordBn: "গোলাপ",
    wordEn: "ROSE",
    jumbledLetters: ["প", "গো", "লা"],
    correctOrder: ["গো", "লা", "প"],
  },
];
