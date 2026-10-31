export interface MathShape {
  id: string;
  nameBn: string;
  nameEn: string;
  sidesBn: string;
  sidesEn: string;
  exampleBn: string;
  exampleEn: string;
  icon: string;
  color: string;
}

export const mathShapes: MathShape[] = [
  {
    id: "circle",
    nameBn: "বৃত্ত (গোল)",
    nameEn: "Circle",
    sidesBn: "কোনো বাহু বা কোণা নেই, এটি সম্পূর্ণ গোল।",
    sidesEn: "No corners or straight edges, perfectly round.",
    exampleBn: "যেমন: ফুটবল ⚽, ঘড়ি ⏰, থালা 🍽️",
    exampleEn: "Example: Football, clock, plate",
    icon: "⭕",
    color: "bg-rose-500",
  },
  {
    id: "triangle",
    nameBn: "ত্রিভুজ (তিন কোণা)",
    nameEn: "Triangle",
    sidesBn: "৩টি বাহু এবং ৩টি কোণা থাকে।",
    sidesEn: "Has 3 sides and 3 corners.",
    exampleBn: "যেমন: পিৎজার টুকরো 🍕, সিঙ্গাড়া 🥟, পাহাড়ের চূড়া ⛰️",
    exampleEn: "Example: Pizza slice, mountain peak",
    icon: "🔺",
    color: "bg-amber-500",
  },
  {
    id: "square",
    nameBn: "বর্গক্ষেত্র (চার বাহু সমান)",
    nameEn: "Square",
    sidesBn: "৪টি বাহুই সমান এবং ৪টি কোণ আছে।",
    sidesEn: "Has 4 equal sides and 4 corners.",
    exampleBn: "যেমন: ক্যারাম বোর্ড 🔲, লুডুর ছক্কা 🎲, জানালার ফ্রেম 🪟",
    exampleEn: "Example: Chessboard, dice, square window",
    icon: "⏹️",
    color: "bg-emerald-500",
  },
  {
    id: "rectangle",
    nameBn: "আয়াতক্ষেত্র",
    nameEn: "Rectangle",
    sidesBn: "বিপরীত বাহুগুলো সমান এবং ৪টি কোণা আছে।",
    sidesEn: "Opposite sides are equal and has 4 corners.",
    exampleBn: "যেমন: বই 📚, মোবাইল ফোন 📱, ক্লাসরুমের ব্ল্যাকবোর্ড 📋",
    exampleEn: "Example: Book, smartphone, blackboard",
    icon: "▭",
    color: "bg-blue-500",
  },
  {
    id: "star",
    nameBn: "তারকা (স্টার)",
    nameEn: "Star",
    sidesBn: "৫টি কোণা বিশিষ্ট সুন্দর ঝিকিমিকি রূপ।",
    sidesEn: "Has 5 shiny points glowing bright.",
    exampleBn: "যেমন: রাতের আকাশের তারা ⭐, সাগর তারা (স্টারফিশ) 🌟",
    exampleEn: "Example: Stars in night sky, starfish",
    icon: "⭐",
    color: "bg-yellow-400",
  },
];

export const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNumber(num: number): string {
  return num
    .toString()
    .split("")
    .map((char) => {
      const idx = parseInt(char, 10);
      return !isNaN(idx) ? bengaliDigits[idx] : char;
    })
    .join("");
}

export const mathComparisons = [
  { a: 5, b: 3, correct: ">", expBn: "৫ হলো ৩ এর চেয়ে বড় (>)", expEn: "5 is greater than 3" },
  { a: 2, b: 6, correct: "<", expBn: "২ হলো ৬ এর চেয়ে ছোট (<)", expEn: "2 is less than 6" },
  { a: 7, b: 7, correct: "=", expBn: "৭ এবং ৭ সমান সমান (=)", expEn: "7 is equal to 7" },
  { a: 9, b: 4, correct: ">", expBn: "৯ হলো ৪ এর চেয়ে বড় (>)", expEn: "9 is greater than 4" },
  { a: 3, b: 8, correct: "<", expBn: "৩ হলো ৮ এর চেয়ে ছোট (<)", expEn: "3 is less than 8" },
  { a: 10, b: 10, correct: "=", expBn: "১০ এবং ১০ সমান সমান (=)", expEn: "10 is equal to 10" },
];

export const mathPatterns = [
  {
    sequence: ["🍎", "🍌", "🍎", "🍌", "🍎"],
    options: ["🍌", "🍎", "🍇", "🍊"],
    correct: "🍌",
    explanationBn: "একবার আপেল 🍎, এরপর কলা 🍌—তাই পরবর্তী ফলটি হবে কলা!",
    explanationEn: "Alternating apple and banana, so banana comes next!",
  },
  {
    sequence: ["⭐", "⭐", "🌙", "⭐", "⭐"],
    options: ["🌙", "⭐", "☀️", "☁️"],
    correct: "🌙",
    explanationBn: "দুটো তারা ⭐⭐ এরপর একটি চাঁদ 🌙—তাই পরেরটি চাঁদ!",
    explanationEn: "Two stars then one moon, so the moon repeats!",
  },
  {
    sequence: ["🔴", "🟢", "🔵", "🔴", "🟢"],
    options: ["🔵", "🔴", "🟡", "🟣"],
    correct: "🔵",
    explanationBn: "লাল, সবুজ, এরপর নীল রঙের ধারা।",
    explanationEn: "Red, green, then blue pattern.",
  },
];
