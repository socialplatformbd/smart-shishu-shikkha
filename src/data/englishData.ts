import { EnglishLetterItem } from "@/types";

export const englishAlphabet: EnglishLetterItem[] = [
  { letter: "A", word: "Apple", phonics: "এ ফর অ্যাপেল", meaningBn: "আপেল", sentence: "An apple is sweet and red.", emoji: "🍎", category: "alphabet" },
  { letter: "B", word: "Ball", phonics: "বি ফর বল", meaningBn: "খেলার বল", sentence: "I play with a colorful ball.", emoji: "⚽", category: "alphabet" },
  { letter: "C", word: "Cat", phonics: "সি ফর ক্যাট", meaningBn: "বিড়াল", sentence: "The cat loves warm milk.", emoji: "🐱", category: "alphabet" },
  { letter: "D", word: "Dog", phonics: "ডি ফর ডগ", meaningBn: "কুকুর", sentence: "The dog is a loyal pet.", emoji: "🐶", category: "alphabet" },
  { letter: "E", word: "Elephant", phonics: "ই ফর এলিফ্যান্ট", meaningBn: "হাতি", sentence: "The elephant has a long trunk.", emoji: "🐘", category: "alphabet" },
  { letter: "F", word: "Fish", phonics: "এফ ফর ফিশ", meaningBn: "মাছ", sentence: "Fish swim quickly in water.", emoji: "🐟", category: "alphabet" },
  { letter: "G", word: "Grapes", phonics: "জি ফর গ্রেপস", meaningBn: "আঙ্গুর", sentence: "Grapes are juicy and sweet.", emoji: "🍇", category: "alphabet" },
  { letter: "H", word: "Horse", phonics: "এইচ ফর হর্স", meaningBn: "ঘোড়া", sentence: "A horse runs very fast.", emoji: "🐴", category: "alphabet" },
  { letter: "I", word: "Ice cream", phonics: "আই ফর আইসক্রিম", meaningBn: "আইসক্রিম", sentence: "Ice cream is cool and yummy.", emoji: "🍦", category: "alphabet" },
  { letter: "J", word: "Jug", phonics: "জে ফর জাগ", meaningBn: "জগ", sentence: "The jug is full of cool water.", emoji: "🫗", category: "alphabet" },
  { letter: "K", word: "Kite", phonics: "কে ফর কাইট", meaningBn: "ঘুড়ি", sentence: "The kite flies high in the sky.", emoji: "🪁", category: "alphabet" },
  { letter: "L", word: "Lion", phonics: "এল ফর লায়ন", meaningBn: "সিংহ", sentence: "The lion is the king of the jungle.", emoji: "🦁", category: "alphabet" },
  { letter: "M", word: "Mango", phonics: "এম ফর ম্যাংগো", meaningBn: "আম", sentence: "Mango is the king of fruits.", emoji: "🥭", category: "alphabet" },
  { letter: "N", word: "Nest", phonics: "এন ফর নেস্ট", meaningBn: "পাখির বাসা", sentence: "Birds build safe nests in trees.", emoji: "🪺", category: "alphabet" },
  { letter: "O", word: "Orange", phonics: "ও ফর অরেঞ্জ", meaningBn: "কমলালেবু", sentence: "Orange has plenty of vitamin C.", emoji: "🍊", category: "alphabet" },
  { letter: "P", word: "Peacock", phonics: "পি ফর পিকক", meaningBn: "ময়ূর", sentence: "The peacock dances in the rain.", emoji: "🦚", category: "alphabet" },
  { letter: "Q", word: "Queen", phonics: "কিউ ফর কুইন", meaningBn: "রানি", sentence: "The queen wears a golden crown.", emoji: "👑", category: "alphabet" },
  { letter: "R", word: "Rabbit", phonics: "আর ফর র‍্যাবিট", meaningBn: "খরগোশ", sentence: "A rabbit likes fresh carrots.", emoji: "🐰", category: "alphabet" },
  { letter: "S", word: "Sun", phonics: "এস ফর সান", meaningBn: "সূর্য", sentence: "The sun gives us light and warmth.", emoji: "☀️", category: "alphabet" },
  { letter: "T", word: "Tiger", phonics: "টি ফর টাইগার", meaningBn: "বাঘ", sentence: "The Royal Bengal Tiger lives in Sundarbans.", emoji: "🐯", category: "alphabet" },
  { letter: "U", word: "Umbrella", phonics: "ইউ ফর আমব্রেলা", meaningBn: "ছাতা", sentence: "Open your umbrella on rainy days.", emoji: "☂️", category: "alphabet" },
  { letter: "V", word: "Van", phonics: "ভি ফর ভ্যান", meaningBn: "ভ্যান গাড়ি", sentence: "The school van takes children home.", emoji: "🚐", category: "alphabet" },
  { letter: "W", word: "Watch", phonics: "ডব্লিউ ফর ওয়াচ", meaningBn: "হাতঘড়ি", sentence: "A watch shows the exact time.", emoji: "⌚", category: "alphabet" },
  { letter: "X", word: "Xylophone", phonics: "এক্স ফর জাইলোফোন", meaningBn: "জাইলোফোন বাজনা", sentence: "Children play the sweet xylophone.", emoji: "🎵", category: "alphabet" },
  { letter: "Y", word: "Yak", phonics: "ওয়াই ফর ইয়াক", meaningBn: "চমরী গাই", sentence: "A yak lives on snowy mountains.", emoji: "🐂", category: "alphabet" },
  { letter: "Z", word: "Zebra", phonics: "জেড ফর জেব্রা", meaningBn: "জেব্রা", sentence: "A zebra has black and white stripes.", emoji: "🦓", category: "alphabet" },
];

export interface VocabCategory {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  items: { wordEn: string; wordBn: string; phonetic: string; emoji: string }[];
}

export const vocabCategories: VocabCategory[] = [
  {
    id: "fruits",
    nameBn: "ফলমূল",
    nameEn: "Fruits",
    icon: "🍎",
    items: [
      { wordEn: "Apple", wordBn: "আপেল", phonetic: "অ্যাপেল", emoji: "🍎" },
      { wordEn: "Banana", wordBn: "কলা", phonetic: "ব্যানানা", emoji: "🍌" },
      { wordEn: "Mango", wordBn: "আম", phonetic: "ম্যাংগো", emoji: "🥭" },
      { wordEn: "Orange", wordBn: "কমলা", phonetic: "অরেঞ্জ", emoji: "🍊" },
      { wordEn: "Watermelon", wordBn: "তরমুজ", phonetic: "ওয়াটারমেলন", emoji: "🍉" },
      { wordEn: "Pineapple", wordBn: "আনারস", phonetic: "পাইনঅ্যাপল", emoji: "🍍" },
      { wordEn: "Grapes", wordBn: "আঙ্গুর", phonetic: "গ্রেপস", emoji: "🍇" },
      { wordEn: "Papaya", wordBn: "পেঁপে", phonetic: "পাপায়া", emoji: "🍈" },
    ],
  },
  {
    id: "animals",
    nameBn: "পশুপাখি ও প্রাণী",
    nameEn: "Animals",
    icon: "🦁",
    items: [
      { wordEn: "Tiger", wordBn: "বাঘ", phonetic: "টাইগার", emoji: "🐯" },
      { wordEn: "Elephant", wordBn: "হাতি", phonetic: "এলিফ্যান্ট", emoji: "🐘" },
      { wordEn: "Lion", wordBn: "সিংহ", phonetic: "লায়ন", emoji: "🦁" },
      { wordEn: "Deer", wordBn: "হরিণ", phonetic: "ডিয়ার", emoji: "🦌" },
      { wordEn: "Rabbit", wordBn: "খরগোশ", phonetic: "র‍্যাবিট", emoji: "🐰" },
      { wordEn: "Monkey", wordBn: "বানর", phonetic: "মাঙ্কি", emoji: "🐒" },
      { wordEn: "Cow", wordBn: "গরু", phonetic: "কাউ", emoji: "🐄" },
      { wordEn: "Horse", wordBn: "ঘোড়া", phonetic: "হর্স", emoji: "🐴" },
    ],
  },
  {
    id: "colors",
    nameBn: "রংধনু ও রং",
    nameEn: "Colors",
    icon: "🎨",
    items: [
      { wordEn: "Red", wordBn: "লাল", phonetic: "রেড", emoji: "🔴" },
      { wordEn: "Green", wordBn: "সবুজ", phonetic: "গ্রিন", emoji: "🟢" },
      { wordEn: "Blue", wordBn: "নীল", phonetic: "ব্লু", emoji: "🔵" },
      { wordEn: "Yellow", wordBn: "হলুদ", phonetic: "ইয়েলো", emoji: "🟡" },
      { wordEn: "Orange", wordBn: "কমলা", phonetic: "অরেঞ্জ", emoji: "🟠" },
      { wordEn: "Purple", wordBn: "বেগুনি", phonetic: "পার্পল", emoji: "🟣" },
      { wordEn: "White", wordBn: "সাদা", phonetic: "হোয়াইট", emoji: "⚪" },
      { wordEn: "Black", wordBn: "কালো", phonetic: "ব্ল্যাক", emoji: "⚫" },
    ],
  },
  {
    id: "objects",
    nameBn: "প্রতিদিনের জিনিস",
    nameEn: "Everyday Objects",
    icon: "🎒",
    items: [
      { wordEn: "Book", wordBn: "বই", phonetic: "বুক", emoji: "📚" },
      { wordEn: "Pencil", wordBn: "পেন্সিল", phonetic: "পেন্সিল", emoji: "✏️" },
      { wordEn: "Bag", wordBn: "ব্যাগ / থলে", phonetic: "ব্যাগ", emoji: "🎒" },
      { wordEn: "Clock", wordBn: "ঘড়ি", phonetic: "ক্লক", emoji: "⏰" },
      { wordEn: "Chair", wordBn: "চেয়ার / কেদারা", phonetic: "চেয়ার", emoji: "🪑" },
      { wordEn: "Bottle", wordBn: "বোতল", phonetic: "বটল", emoji: "🍼" },
      { wordEn: "Shoes", wordBn: "জুতো", phonetic: "শুজ", emoji: "👟" },
      { wordEn: "Umbrella", wordBn: "ছাতা", phonetic: "আমব্রেলা", emoji: "☂️" },
    ],
  },
];
