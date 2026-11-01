/*
 * Islamic learning content for children.
 * Only widely agreed, well-known basics are included. Arabic text is shown for reading practice;
 * correct recitation (tajweed) must be learned from a teacher, and the app says so.
 * Please have an Islamic teacher / scholar review this file before public release.
 */

export interface InfoItem {
  id: string;
  icon: string;
  titleBn: string;
  titleEn: string;
  /** Small label such as a year or a number (shown as a pill). */
  tagBn?: string;
  tagEn?: string;
  arabic?: string;
  bodyBn: string[];
  bodyEn: string[];
  /** Numbered list (steps, months, manners ...). */
  stepsBn?: string[];
  stepsEn?: string[];
  lessonBn?: string;
  lessonEn?: string;
}

export interface PrayerItem {
  id: string;
  icon: string;
  nameBn: string;
  nameEn: string;
  arabic: string;
  timeBn: string;
  timeEn: string;
  fardRakat: number;
}

export interface DuaItem {
  id: string;
  icon: string;
  titleBn: string;
  titleEn: string;
  arabic: string;
  translitBn: string;
  meaningBn: string;
  meaningEn: string;
}

export interface AyahItem {
  arabic: string;
  translitBn: string;
  meaningBn: string;
  meaningEn: string;
}

export interface SurahItem {
  id: string;
  nameBn: string;
  nameEn: string;
  arabicName: string;
  ayahCount: number;
  ayat: AyahItem[];
}

// ---------------------------------------------------------------------------
// 1) Five pillars of Islam
// ---------------------------------------------------------------------------
export const pillars: InfoItem[] = [
  {
    id: "kalima",
    icon: "☪️",
    titleBn: "১. কালেমা (ঈমান)",
    titleEn: "1. Kalima (Faith)",
    tagBn: "১ম স্তম্ভ",
    tagEn: "Pillar 1",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ",
    bodyBn: [
      "কালেমা তাইয়্যেবা: লা ইলাহা ইল্লাল্লাহু মুহাম্মাদুর রাসূলুল্লাহ।",
      "অর্থ: আল্লাহ ছাড়া কোনো ইলাহ (উপাস্য) নেই, মুহাম্মাদ (সা.) আল্লাহর রাসূল।",
      "এটাই ইসলামের সবচেয়ে বড় ভিত্তি। এটা মনে-প্রাণে বিশ্বাস করার নামই ঈমান।",
    ],
    bodyEn: [
      "Kalima Tayyiba: La ilaha illallahu Muhammadur Rasulullah.",
      "Meaning: There is no god but Allah, and Muhammad (PBUH) is the Messenger of Allah.",
      "This is the biggest foundation of Islam. Believing it with the heart is called Iman (faith).",
    ],
  },
  {
    id: "salah",
    icon: "🕌",
    titleBn: "২. নামাজ (সালাত)",
    titleEn: "2. Salah (Prayer)",
    tagBn: "২য় স্তম্ভ",
    tagEn: "Pillar 2",
    bodyBn: [
      "প্রতিদিন পাঁচ ওয়াক্ত নামাজ পড়া ফরজ: ফজর, যোহর, আসর, মাগরিব ও এশা।",
      "নামাজে আমরা সরাসরি আল্লাহর সাথে কথা বলি, তাঁর কাছে সাহায্য চাই এবং তাঁর শুকরিয়া জানাই।",
      "ছোটদের জন্য নামাজ ফরজ নয়, তবে ছোটবেলা থেকেই মা-বাবার সাথে নামাজ শেখা ও অভ্যাস করা ভালো।",
    ],
    bodyEn: [
      "Five daily prayers are obligatory: Fajr, Zuhr, Asr, Maghrib and Isha.",
      "In prayer we speak to Allah, ask for His help and thank Him.",
      "Prayer is not yet obligatory for young children, but it is good to learn and practise it with your parents.",
    ],
  },
  {
    id: "sawm",
    icon: "🌙",
    titleBn: "৩. রোজা (সাওম)",
    titleEn: "3. Sawm (Fasting)",
    tagBn: "৩য় স্তম্ভ",
    tagEn: "Pillar 3",
    bodyBn: [
      "রমজান মাসে ভোরের আগে (সুবহে সাদিক) থেকে সূর্যাস্ত পর্যন্ত খাওয়া-দাওয়া থেকে বিরত থাকাকে রোজা বলে।",
      "ভোরে খাবার খাওয়াকে সাহরি এবং সূর্যাস্তের পর খাবার খেয়ে রোজা ভাঙাকে ইফতার বলে।",
      "রোজা আমাদের ধৈর্য শেখায় এবং গরিব মানুষের কষ্ট বুঝতে সাহায্য করে। বড় হলে রোজা ফরজ হয়।",
    ],
    bodyEn: [
      "In Ramadan we do not eat or drink from dawn (Fajr) until sunset. This is called fasting.",
      "The meal before dawn is Suhoor, and the meal at sunset that ends the fast is Iftar.",
      "Fasting teaches patience and helps us feel the hunger of poor people. It becomes obligatory when a person grows up.",
    ],
  },
  {
    id: "zakat",
    icon: "💝",
    titleBn: "৪. যাকাত",
    titleEn: "4. Zakat (Charity)",
    tagBn: "৪র্থ স্তম্ভ",
    tagEn: "Pillar 4",
    bodyBn: [
      "যার কাছে নির্দিষ্ট পরিমাণের বেশি সম্পদ থাকে, সে বছরে একবার সম্পদের একটি অংশ গরিব ও অভাবী মানুষকে দেয়। একেই যাকাত বলে।",
      "যাকাত সম্পদকে পবিত্র করে এবং সমাজে ভালোবাসা বাড়ায়।",
      "ছোটরাও নিজের জমানো টাকা বা খাবার থেকে কিছু দান করে অন্যকে সাহায্য করতে পারে।",
    ],
    bodyEn: [
      "A person who has more than a set amount of wealth gives a part of it once a year to poor and needy people. This is Zakat.",
      "Zakat purifies wealth and spreads love in society.",
      "Children can also help others by sharing some of their food or savings.",
    ],
  },
  {
    id: "hajj",
    icon: "🕋",
    titleBn: "৫. হজ",
    titleEn: "5. Hajj (Pilgrimage)",
    tagBn: "৫ম স্তম্ভ",
    tagEn: "Pillar 5",
    bodyBn: [
      "যার সামর্থ্য আছে, তার ওপর জীবনে একবার মক্কায় গিয়ে কাবা শরিফের হজ করা ফরজ।",
      "হজ হয় জিলহজ মাসে। সারা বিশ্বের মুসলমান একসাথে একই পোশাকে আল্লাহর ঘরে আসেন, কেউ ছোট-বড় নয়।",
      "হজের শেষে ১০ জিলহজ ঈদুল আযহা উদযাপিত হয়।",
    ],
    bodyEn: [
      "A Muslim who is able must perform Hajj once in a lifetime at the Kaaba in Makkah.",
      "Hajj takes place in the month of Dhul Hijjah. Muslims from all over the world stand together in simple white clothes, equal before Allah.",
      "Eid al-Adha is celebrated on 10 Dhul Hijjah.",
    ],
  },
];

// ---------------------------------------------------------------------------
// 2) Six articles of faith (from the hadith of Jibril)
// ---------------------------------------------------------------------------
export const imanItems: InfoItem[] = [
  {
    id: "allah",
    icon: "✨",
    titleBn: "১. আল্লাহর ওপর ঈমান",
    titleEn: "1. Belief in Allah",
    bodyBn: ["আল্লাহ এক। তিনি আমাদের, আকাশ-জমিন ও সবকিছুর সৃষ্টিকর্তা ও পালনকর্তা। তাঁর কোনো শরিক নেই।"],
    bodyEn: ["Allah is One. He created us, the sky, the earth and everything, and He takes care of all. He has no partner."],
  },
  {
    id: "angels",
    icon: "🪽",
    titleBn: "২. ফেরেশতার ওপর ঈমান",
    titleEn: "2. Belief in Angels",
    bodyBn: ["ফেরেশতারা আল্লাহর নূরের তৈরি সম্মানিত সৃষ্টি। তাঁরা আল্লাহর হুকুম মানেন। জিবরীল (আ.) নবীদের কাছে আল্লাহর বাণী (ওহি) নিয়ে আসতেন।"],
    bodyEn: ["Angels are honoured creatures of Allah made of light. They always obey Allah. Jibril (Gabriel) brought Allah's revelation to the prophets."],
  },
  {
    id: "books",
    icon: "📖",
    titleBn: "৩. আসমানি কিতাবের ওপর ঈমান",
    titleEn: "3. Belief in the Books",
    bodyBn: ["আল্লাহ নবীদের কাছে কিতাব পাঠিয়েছেন: তাওরাত (মূসা আ.), যাবুর (দাউদ আ.), ইঞ্জিল (ঈসা আ.) এবং সর্বশেষ কিতাব আল-কুরআন (মুহাম্মাদ সা.)।"],
    bodyEn: ["Allah sent books to His prophets: the Tawrat (Musa), Zabur (Dawud), Injil (Isa) and the final book, the Quran (Muhammad, PBUH)."],
  },
  {
    id: "prophets",
    icon: "🌟",
    titleBn: "৪. নবী-রাসূলের ওপর ঈমান",
    titleEn: "4. Belief in the Prophets",
    bodyBn: ["আল্লাহ মানুষকে সঠিক পথ দেখাতে যুগে যুগে নবী-রাসূল পাঠিয়েছেন। প্রথম নবী আদম (আ.), শেষ নবী মুহাম্মাদ (সা.)।"],
    bodyEn: ["Allah sent prophets and messengers to guide people. The first prophet was Adam, and the last prophet is Muhammad (PBUH)."],
  },
  {
    id: "akhirah",
    icon: "🌅",
    titleBn: "৫. আখিরাতের ওপর ঈমান",
    titleEn: "5. Belief in the Last Day",
    bodyBn: ["একদিন সব মানুষকে আল্লাহর সামনে দাঁড়াতে হবে। সেদিন ভালো কাজের জন্য পুরস্কার (জান্নাত) আছে। তাই আমাদের সবসময় ভালো কাজ করা উচিত।"],
    bodyEn: ["One day everyone will stand before Allah. Good deeds are rewarded with Paradise (Jannah). So we should always do good."],
  },
  {
    id: "qadr",
    icon: "🤲",
    titleBn: "৬. তাকদীরের ওপর ঈমান",
    titleEn: "6. Belief in Destiny (Qadr)",
    bodyBn: [
      "ভালো-মন্দ সবকিছু আল্লাহর জানা ও ইচ্ছায় ঘটে। তাই ভালো কিছু পেলে শুকরিয়া করি, কষ্ট এলে ধৈর্য ধরি।",
      "(অনেক বইয়ে মৃত্যুর পর পুনরুত্থানকে আলাদা করে ঈমানের ৭টি বিষয়ও বলা হয়।)",
    ],
    bodyEn: [
      "Everything good and bad happens with Allah's knowledge and will. So we thank Allah for good things and stay patient in hard times.",
      "(Some books count the resurrection after death as a separate, seventh point.)",
    ],
  },
];

// ---------------------------------------------------------------------------
// 3) Five daily prayers + wudu
// ---------------------------------------------------------------------------
export const prayers: PrayerItem[] = [
  { id: "fajr", icon: "🌄", nameBn: "ফজর", nameEn: "Fajr", arabic: "الْفَجْر", timeBn: "ভোরে, সুবহে সাদিক থেকে সূর্য ওঠার আগ পর্যন্ত", timeEn: "Dawn, from first light until sunrise", fardRakat: 2 },
  { id: "zuhr", icon: "☀️", nameBn: "যোহর", nameEn: "Zuhr", arabic: "الظُّهْر", timeBn: "দুপুরে, সূর্য মাথার ওপর থেকে ঢলে পড়ার পর", timeEn: "Midday, after the sun passes its highest point", fardRakat: 4 },
  { id: "asr", icon: "🌤️", nameBn: "আসর", nameEn: "Asr", arabic: "الْعَصْر", timeBn: "বিকেলে, সূর্য ডোবার কিছু আগ পর্যন্ত", timeEn: "Afternoon, until a little before sunset", fardRakat: 4 },
  { id: "maghrib", icon: "🌇", nameBn: "মাগরিব", nameEn: "Maghrib", arabic: "الْمَغْرِب", timeBn: "সূর্য ডোবার পর পরই", timeEn: "Right after sunset", fardRakat: 3 },
  { id: "isha", icon: "🌃", nameBn: "এশা", nameEn: "Isha", arabic: "الْعِشَاء", timeBn: "রাতে, সন্ধ্যার আকাশের লালচে ভাব মিলিয়ে যাওয়ার পর", timeEn: "Night, after the evening twilight fades", fardRakat: 4 },
];

export const wudu: InfoItem = {
  id: "wudu",
  icon: "💧",
  titleBn: "ওযুর সহজ ধাপ",
  titleEn: "Easy steps of Wudu",
  bodyBn: [
    "নামাজের আগে ওযু করে শরীর পরিষ্কার ও পবিত্র করতে হয়। শুরুতে 'বিসমিল্লাহ' বলি।",
  ],
  bodyEn: ["Before prayer we make wudu (washing) to be clean. We begin by saying 'Bismillah'."],
  stepsBn: [
    "দুই হাত কবজি পর্যন্ত ধোয়া",
    "কুলি করা",
    "নাকে পানি দিয়ে পরিষ্কার করা",
    "পুরো মুখ ধোয়া",
    "কনুইসহ দুই হাত ধোয়া",
    "মাথা মাসেহ করা (ভেজা হাত বুলানো) ও কান মাসেহ করা",
    "গোড়ালিসহ দুই পা ধোয়া",
  ],
  stepsEn: [
    "Wash both hands up to the wrists",
    "Rinse the mouth",
    "Sniff water into the nose and clean it",
    "Wash the whole face",
    "Wash both arms including the elbows",
    "Wipe the head and the ears with wet hands",
    "Wash both feet including the ankles",
  ],
  lessonBn: "সব নিয়ম ভালোভাবে মা-বাবা বা শিক্ষকের কাছ থেকে দেখে দেখে শিখো।",
  lessonEn: "Learn all the rules properly by watching your parents or a teacher.",
};

// ---------------------------------------------------------------------------
// 4) Daily duas
// ---------------------------------------------------------------------------
export const duas: DuaItem[] = [
  {
    id: "bismillah",
    icon: "🍽️",
    titleBn: "খাওয়ার আগে",
    titleEn: "Before eating",
    arabic: "بِسْمِ اللَّهِ",
    translitBn: "বিসমিল্লাহ",
    meaningBn: "আল্লাহর নামে (শুরু করছি)।",
    meaningEn: "In the name of Allah (I begin).",
  },
  {
    id: "after_eating",
    icon: "😋",
    titleBn: "খাওয়ার পরে",
    titleEn: "After eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    translitBn: "আলহামদু লিল্লাহিল্লাযী আত'আমানা ওয়া সাকানা ওয়া জা'আলানা মুসলিমীন",
    meaningBn: "সকল প্রশংসা আল্লাহর, যিনি আমাদের খাইয়েছেন, পান করিয়েছেন এবং মুসলিম বানিয়েছেন।",
    meaningEn: "All praise is for Allah, who fed us, gave us drink and made us Muslims.",
  },
  {
    id: "sleep",
    icon: "🌙",
    titleBn: "ঘুমানোর আগে",
    titleEn: "Before sleeping",
    arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
    translitBn: "আল্লাহুম্মা বিসমিকা আমূতু ওয়া আহইয়া",
    meaningBn: "হে আল্লাহ, তোমার নামেই আমি মরি (ঘুমাই) ও বাঁচি (জেগে উঠি)।",
    meaningEn: "O Allah, in Your name I die (sleep) and I live (wake).",
  },
  {
    id: "wake",
    icon: "🌅",
    titleBn: "ঘুম থেকে উঠে",
    titleEn: "After waking up",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    translitBn: "আলহামদু লিল্লাহিল্লাযী আহইয়ানা বা'দা মা আমাতানা ওয়া ইলাইহিন নুশূর",
    meaningBn: "সকল প্রশংসা আল্লাহর, যিনি মৃত্যুর (ঘুমের) পর আমাদের জীবিত করেছেন, আর তাঁর কাছেই ফিরে যেতে হবে।",
    meaningEn: "All praise is for Allah, who gave us life after death (sleep), and to Him we will return.",
  },
  {
    id: "leaving_home",
    icon: "🚪",
    titleBn: "বাড়ি থেকে বের হওয়ার সময়",
    titleEn: "When leaving home",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    translitBn: "বিসমিল্লাহি তাওয়াক্কালতু আলাল্লাহি, ওয়া লা হাওলা ওয়া লা কুওওয়াতা ইল্লা বিল্লাহ",
    meaningBn: "আল্লাহর নামে, আল্লাহর ওপর ভরসা করলাম। আল্লাহ ছাড়া কোনো শক্তি ও ক্ষমতা নেই।",
    meaningEn: "In the name of Allah, I trust in Allah. There is no power or strength except with Allah.",
  },
  {
    id: "salam",
    icon: "🤝",
    titleBn: "সালাম ও সালামের উত্তর",
    titleEn: "Greeting and reply",
    arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
    translitBn: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহ",
    meaningBn: "আপনার ওপর শান্তি, আল্লাহর রহমত ও বরকত বর্ষিত হোক। উত্তরে বলি: ওয়া আলাইকুমুস সালাম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহ।",
    meaningEn: "May peace, Allah's mercy and blessings be upon you. We reply: Wa alaykumus salam wa rahmatullahi wa barakatuh.",
  },
  {
    id: "sneeze",
    icon: "🤧",
    titleBn: "হাঁচি দিলে",
    titleEn: "When you sneeze",
    arabic: "الْحَمْدُ لِلَّهِ",
    translitBn: "আলহামদু লিল্লাহ",
    meaningBn: "হাঁচি দিয়ে বলি 'আলহামদু লিল্লাহ'। যে শোনে সে বলে 'ইয়ারহামুকাল্লাহ' (আল্লাহ তোমার ওপর দয়া করুন)। উত্তরে বলি 'ইয়াহদীকুমুল্লাহু ওয়া ইউসলিহু বালাকুম' (আল্লাহ তোমাদের সঠিক পথ দেখান ও অবস্থা ভালো করুন)।",
    meaningEn: "After sneezing say 'Alhamdulillah'. The listener says 'Yarhamukallah' (may Allah have mercy on you). Reply: 'Yahdikumullahu wa yuslihu balakum' (may Allah guide you and put you in good condition).",
  },
  {
    id: "parents",
    icon: "👨‍👩‍👧",
    titleBn: "মা-বাবার জন্য দোয়া",
    titleEn: "Dua for parents",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translitBn: "রাব্বির হামহুমা কামা রাব্বাইয়ানী সাগীরা",
    meaningBn: "হে আমার রব, তাঁদের (মা-বাবার) প্রতি দয়া করো, যেমন তাঁরা ছোটবেলায় আমাকে লালন-পালন করেছেন।",
    meaningEn: "My Lord, have mercy on them (my parents) as they raised me when I was small.",
  },
];

// ---------------------------------------------------------------------------
// 5) Short surahs
// ---------------------------------------------------------------------------
export const surahs: SurahItem[] = [
  {
    id: "fatiha",
    nameBn: "সূরা আল-ফাতিহা",
    nameEn: "Surah Al-Fatiha",
    arabicName: "الْفَاتِحَة",
    ayahCount: 7,
    ayat: [
      { arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translitBn: "বিসমিল্লাহির রাহমানির রাহীম", meaningBn: "পরম করুণাময়, অতি দয়ালু আল্লাহর নামে (শুরু করছি)।", meaningEn: "In the name of Allah, the Most Gracious, the Most Merciful." },
      { arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translitBn: "আলহামদু লিল্লাহি রাব্বিল আলামীন", meaningBn: "সকল প্রশংসা আল্লাহর, যিনি সারা জাহানের প্রতিপালক।", meaningEn: "All praise is for Allah, Lord of all the worlds." },
      { arabic: "الرَّحْمَٰنِ الرَّحِيمِ", translitBn: "আর রাহমানির রাহীম", meaningBn: "যিনি পরম করুণাময়, অতি দয়ালু।", meaningEn: "The Most Gracious, the Most Merciful." },
      { arabic: "مَالِكِ يَوْمِ الدِّينِ", translitBn: "মালিকি ইয়াওমিদ্দীন", meaningBn: "যিনি বিচার দিনের মালিক।", meaningEn: "Master of the Day of Judgment." },
      { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translitBn: "ইয়্যাকা না'বুদু ওয়া ইয়্যাকা নাস্তাঈন", meaningBn: "আমরা শুধু তোমারই ইবাদত করি এবং শুধু তোমারই কাছে সাহায্য চাই।", meaningEn: "You alone we worship, and You alone we ask for help." },
      { arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translitBn: "ইহদিনাস সিরাতাল মুস্তাকীম", meaningBn: "আমাদের সরল পথ দেখাও।", meaningEn: "Guide us to the straight path." },
      { arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translitBn: "সিরাতাল্লাযীনা আন'আমতা আলাইহিম, গাইরিল মাগদূবি আলাইহিম ওয়ালাদ্দাল্লীন", meaningBn: "তাঁদের পথ, যাঁদের তুমি নিয়ামত দিয়েছ; তাদের পথ নয়, যাদের ওপর গজব এসেছে এবং যারা পথভ্রষ্ট।", meaningEn: "The path of those You have blessed, not of those who earned anger, nor of those who went astray." },
    ],
  },
  {
    id: "ikhlas",
    nameBn: "সূরা আল-ইখলাস",
    nameEn: "Surah Al-Ikhlas",
    arabicName: "الْإِخْلَاص",
    ayahCount: 4,
    ayat: [
      { arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translitBn: "কুল হুওয়াল্লাহু আহাদ", meaningBn: "বলো, তিনি আল্লাহ, এক ও অদ্বিতীয়।", meaningEn: "Say: He is Allah, the One." },
      { arabic: "اللَّهُ الصَّمَدُ", translitBn: "আল্লাহুস সামাদ", meaningBn: "আল্লাহ অমুখাপেক্ষী (সবাই তাঁর মুখাপেক্ষী)।", meaningEn: "Allah is the Eternal, needing nothing; everyone needs Him." },
      { arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translitBn: "লাম ইয়ালিদ ওয়া লাম ইউলাদ", meaningBn: "তিনি কাউকে জন্ম দেননি এবং তাঁকেও কেউ জন্ম দেয়নি।", meaningEn: "He has not begotten, nor was He begotten." },
      { arabic: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", translitBn: "ওয়া লাম ইয়াকুল্লাহু কুফুওয়ান আহাদ", meaningBn: "আর তাঁর সমকক্ষ কেউ নেই।", meaningEn: "And there is none equal to Him." },
    ],
  },
  {
    id: "falaq",
    nameBn: "সূরা আল-ফালাক",
    nameEn: "Surah Al-Falaq",
    arabicName: "الْفَلَق",
    ayahCount: 5,
    ayat: [
      { arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translitBn: "কুল আউযু বিরাব্বিল ফালাক", meaningBn: "বলো, আমি ভোরের রবের কাছে আশ্রয় চাই।", meaningEn: "Say: I seek refuge in the Lord of the daybreak." },
      { arabic: "مِنْ شَرِّ مَا خَلَقَ", translitBn: "মিন শার্রি মা খালাক", meaningBn: "তিনি যা সৃষ্টি করেছেন, তার অনিষ্ট থেকে।", meaningEn: "From the evil of what He created." },
      { arabic: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ", translitBn: "ওয়া মিন শার্রি গাসিকিন ইযা ওয়াকাব", meaningBn: "অন্ধকার রাতের অনিষ্ট থেকে, যখন তা ছেয়ে যায়।", meaningEn: "From the evil of darkness when it spreads." },
      { arabic: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", translitBn: "ওয়া মিন শার্রিন নাফফাসাতি ফিল উকাদ", meaningBn: "গিঁটে ফুঁ দেওয়া (জাদুকারীদের) অনিষ্ট থেকে।", meaningEn: "From the evil of those who blow on knots (practise magic)." },
      { arabic: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", translitBn: "ওয়া মিন শার্রি হাসিদিন ইযা হাসাদ", meaningBn: "হিংসুকের অনিষ্ট থেকে, যখন সে হিংসা করে।", meaningEn: "And from the evil of the envier when he envies." },
    ],
  },
  {
    id: "nas",
    nameBn: "সূরা আন-নাস",
    nameEn: "Surah An-Nas",
    arabicName: "النَّاس",
    ayahCount: 6,
    ayat: [
      { arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translitBn: "কুল আউযু বিরাব্বিন নাস", meaningBn: "বলো, আমি মানুষের রবের কাছে আশ্রয় চাই।", meaningEn: "Say: I seek refuge in the Lord of mankind." },
      { arabic: "مَلِكِ النَّاسِ", translitBn: "মালিকিন নাস", meaningBn: "মানুষের মালিক (বাদশাহ)।", meaningEn: "The King of mankind." },
      { arabic: "إِلَٰهِ النَّاسِ", translitBn: "ইলাহিন নাস", meaningBn: "মানুষের ইলাহ (উপাস্য)।", meaningEn: "The God of mankind." },
      { arabic: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", translitBn: "মিন শার্রিল ওয়াসওয়াসিল খান্নাস", meaningBn: "কুমন্ত্রণাদাতা আত্মগোপনকারীর অনিষ্ট থেকে।", meaningEn: "From the evil of the whisperer who hides." },
      { arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", translitBn: "আল্লাযী ইউওয়াসউইসু ফী সুদূরিন নাস", meaningBn: "যে মানুষের অন্তরে কুমন্ত্রণা দেয়।", meaningEn: "Who whispers in the hearts of people." },
      { arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", translitBn: "মিনাল জিন্নাতি ওয়ান নাস", meaningBn: "জিনের মধ্য থেকে এবং মানুষের মধ্য থেকে।", meaningEn: "From among the jinn and mankind." },
    ],
  },
  {
    id: "kawthar",
    nameBn: "সূরা আল-কাউসার",
    nameEn: "Surah Al-Kawthar",
    arabicName: "الْكَوْثَر",
    ayahCount: 3,
    ayat: [
      { arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", translitBn: "ইন্না আ'তাইনাকাল কাওসার", meaningBn: "নিশ্চয়ই আমি তোমাকে কাউসার দান করেছি।", meaningEn: "Indeed, We have granted you Al-Kawthar." },
      { arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", translitBn: "ফাসাল্লি লিরাব্বিকা ওয়ানহার", meaningBn: "অতএব তোমার রবের জন্য নামাজ পড়ো ও কুরবানি করো।", meaningEn: "So pray to your Lord and sacrifice." },
      { arabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", translitBn: "ইন্না শানিআকা হুওয়াল আবতার", meaningBn: "নিশ্চয়ই তোমার শত্রুই তো নির্বংশ (নাম-নিশানাহীন)।", meaningEn: "Indeed, your enemy is the one cut off." },
    ],
  },
];

// ---------------------------------------------------------------------------
// 6) Stories of the prophets (short)
// ---------------------------------------------------------------------------
export const prophetStories: InfoItem[] = [
  {
    id: "adam",
    icon: "🌍",
    titleBn: "আদম (আ.)",
    titleEn: "Adam (AS)",
    tagBn: "প্রথম মানুষ ও প্রথম নবী",
    tagEn: "First human & first prophet",
    bodyBn: [
      "আল্লাহ মাটি দিয়ে প্রথম মানুষ আদম (আ.)-কে সৃষ্টি করেন এবং তাঁকে সবকিছুর নাম শেখান।",
      "ফেরেশতাদের তিনি আদমকে সম্মান জানাতে বললেন। তাঁর স্ত্রী ছিলেন হাওয়া (আ.)।",
      "ভুল করে ফেললে তাঁরা আল্লাহর কাছে ক্ষমা চান এবং আল্লাহ তাঁদের ক্ষমা করে দেন।",
    ],
    bodyEn: [
      "Allah created the first human, Adam (AS), from clay and taught him the names of things.",
      "Allah told the angels to honour Adam. His wife was Hawwa (Eve).",
      "When they made a mistake they asked Allah for forgiveness, and Allah forgave them.",
    ],
    lessonBn: "ভুল হলে আল্লাহর কাছে ক্ষমা চাইতে হয়।",
    lessonEn: "When we make a mistake, we should ask Allah for forgiveness.",
  },
  {
    id: "nuh",
    icon: "🚢",
    titleBn: "নূহ (আ.)",
    titleEn: "Nuh (AS)",
    tagBn: "নৌকা ও মহাপ্লাবন",
    tagEn: "The ark and the flood",
    bodyBn: [
      "নূহ (আ.) অনেক বছর ধরে মানুষকে এক আল্লাহর দিকে ডেকেছেন, কিন্তু খুব কম মানুষই তাঁর কথা মানল।",
      "আল্লাহর নির্দেশে তিনি এক বিশাল নৌকা বানালেন। তারপর মহাপ্লাবন এল।",
      "ঈমানদার মানুষ এবং প্রতিটি প্রাণীর এক জোড়া করে নৌকায় আশ্রয় পেল।",
    ],
    bodyEn: [
      "Nuh (AS) called his people to the One Allah for many years, but very few listened.",
      "By Allah's command he built a huge ark. Then the great flood came.",
      "The believers and a pair of every kind of animal were saved in the ark.",
    ],
    lessonBn: "ভালো কাজে ধৈর্য ধরতে হয়, হাল ছাড়তে নেই।",
    lessonEn: "Be patient and never give up on doing good.",
  },
  {
    id: "ibrahim",
    icon: "🔥",
    titleBn: "ইবরাহিম (আ.)",
    titleEn: "Ibrahim (AS)",
    tagBn: "আল্লাহর বন্ধু",
    tagEn: "Friend of Allah",
    bodyBn: [
      "ইবরাহিম (আ.) মূর্তিপূজার বিরুদ্ধে সবাইকে এক আল্লাহর কথা বলেছিলেন।",
      "তাঁকে আগুনে ফেলা হলে আল্লাহ আগুনকে ঠান্ডা ও শান্তিদায়ক করে দিলেন, তিনি রক্ষা পেলেন।",
      "তিনি ও তাঁর ছেলে ইসমাইল (আ.) মক্কায় কাবা ঘর নির্মাণ করেন। আল্লাহর হুকুম মানার পরীক্ষায় সফল হওয়ার স্মরণে আমরা ঈদুল আযহায় কুরবানি করি।",
    ],
    bodyEn: [
      "Ibrahim (AS) told everyone to worship only Allah and not idols.",
      "When he was thrown into a fire, Allah made the fire cool and safe, and he was saved.",
      "Together with his son Ismail (AS) he built the Kaaba in Makkah. We remember his obedience to Allah through the sacrifice on Eid al-Adha.",
    ],
    lessonBn: "আল্লাহর হুকুম মানা সবচেয়ে বড় কাজ।",
    lessonEn: "Obeying Allah is the most important thing.",
  },
  {
    id: "yusuf",
    icon: "⭐",
    titleBn: "ইউসুফ (আ.)",
    titleEn: "Yusuf (AS)",
    tagBn: "ধৈর্য ও ক্ষমা",
    tagEn: "Patience and forgiveness",
    bodyBn: [
      "ইউসুফ (আ.) ছোটবেলায় স্বপ্নে দেখলেন, এগারোটি তারা, সূর্য ও চাঁদ তাঁকে সম্মান করছে।",
      "হিংসা করে তাঁর ভাইয়েরা তাঁকে কূপে ফেলে দেয়। পরে তিনি মিশরে যান এবং অনেক কষ্ট সহ্য করেন।",
      "সততা ও ধৈর্যের কারণে আল্লাহ তাঁকে সম্মানিত করেন। পরে তিনি ভাইদের ক্ষমা করে দেন।",
    ],
    bodyEn: [
      "As a boy, Yusuf (AS) dreamed that eleven stars, the sun and the moon bowed to him.",
      "His brothers, jealous of him, threw him into a well. Later he was taken to Egypt and faced many hardships.",
      "Because of his honesty and patience Allah honoured him, and he forgave his brothers.",
    ],
    lessonBn: "হিংসা খারাপ। ধৈর্য ও ক্ষমা অনেক সুন্দর গুণ।",
    lessonEn: "Jealousy is bad. Patience and forgiveness are beautiful qualities.",
  },
  {
    id: "musa",
    icon: "🌊",
    titleBn: "মূসা (আ.)",
    titleEn: "Musa (AS)",
    tagBn: "ফেরাউন ও সাগর",
    tagEn: "Pharaoh and the sea",
    bodyBn: [
      "শিশু মূসা (আ.)-কে তাঁর মা নদীতে ভাসিয়ে দেন, আল্লাহর ইচ্ছায় তিনি ফেরাউনের ঘরেই বড় হন।",
      "আল্লাহ তাঁকে নবী করেন এবং তাওরাত কিতাব দেন। ফেরাউন অত্যাচারী ছিল।",
      "আল্লাহর হুকুমে সাগর দুই ভাগ হয়ে গেল। মূসা (আ.) ও ঈমানদাররা পার হলেন, আর ফেরাউন ডুবে গেল।",
    ],
    bodyEn: [
      "Baby Musa (AS) was placed in the river by his mother, and by Allah's will he grew up in Pharaoh's house.",
      "Allah made him a prophet and gave him the Tawrat. Pharaoh was a cruel ruler.",
      "By Allah's command the sea split. Musa and the believers crossed safely, and Pharaoh drowned.",
    ],
    lessonBn: "অত্যাচার চিরকাল থাকে না, আল্লাহ সাহায্য করেন।",
    lessonEn: "Cruelty does not last forever. Allah helps those who trust Him.",
  },
  {
    id: "yunus",
    icon: "🐋",
    titleBn: "ইউনুস (আ.)",
    titleEn: "Yunus (AS)",
    tagBn: "মাছের পেটে দোয়া",
    tagEn: "The dua in the whale",
    arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    bodyBn: [
      "ইউনুস (আ.) এক বিশাল মাছের পেটে চলে গিয়েছিলেন। অন্ধকারে তিনি আল্লাহকে ডাকলেন:",
      "'লা ইলাহা ইল্লা আন্তা সুবহানাকা ইন্নী কুনতু মিনায যালিমীন' (তুমি ছাড়া কোনো ইলাহ নেই, তুমি পবিত্র, আমি ভুল করেছি)।",
      "আল্লাহ তাঁর ডাক শুনলেন এবং তাঁকে মুক্তি দিলেন।",
    ],
    bodyEn: [
      "Yunus (AS) found himself inside a huge fish. In the darkness he called upon Allah:",
      "'La ilaha illa anta, subhanaka, inni kuntu minaz-zalimin' (There is no god but You, glory to You, I was wrong).",
      "Allah heard his call and rescued him.",
    ],
    lessonBn: "বিপদে আল্লাহকে ডাকলে তিনি শোনেন।",
    lessonEn: "When we are in trouble and call Allah, He hears us.",
  },
  {
    id: "sulaiman",
    icon: "🐜",
    titleBn: "সুলাইমান (আ.)",
    titleEn: "Sulaiman (AS)",
    tagBn: "পশুপাখির ভাষা",
    tagEn: "Language of animals",
    bodyBn: [
      "আল্লাহ সুলাইমান (আ.)-কে বিশাল রাজত্ব দিয়েছিলেন এবং পশুপাখির কথা বোঝার জ্ঞান দিয়েছিলেন।",
      "একবার তিনি এক পিঁপড়ার কথা শুনে মুচকি হাসলেন এবং আল্লাহর শুকরিয়া আদায় করলেন।",
    ],
    bodyEn: [
      "Allah gave Sulaiman (AS) a great kingdom and the ability to understand animals.",
      "Once he heard an ant speaking, smiled, and thanked Allah for his blessings.",
    ],
    lessonBn: "বড় হলেও অহংকার করতে নেই, সবসময় আল্লাহর শুকরিয়া করতে হয়।",
    lessonEn: "Even when we are great, we must not be proud; we should always thank Allah.",
  },
  {
    id: "isa",
    icon: "🌿",
    titleBn: "ঈসা (আ.)",
    titleEn: "Isa (AS)",
    tagBn: "মারইয়াম (আ.)-এর পুত্র",
    tagEn: "Son of Maryam (AS)",
    bodyBn: [
      "ঈসা (আ.) আল্লাহর একজন সম্মানিত নবী। তাঁর মা মারইয়াম (আ.) অত্যন্ত পবিত্র ও সম্মানিত নারী ছিলেন।",
      "আল্লাহর হুকুমে তিনি পিতা ছাড়াই জন্ম নেন। আল্লাহ তাঁকে ইঞ্জিল কিতাব দেন।",
      "আল্লাহর অনুমতিতে তিনি অনেক অলৌকিক কাজ (মুজিযা) দেখিয়েছেন।",
    ],
    bodyEn: [
      "Isa (AS) is an honoured prophet of Allah. His mother Maryam (AS) was a very pure and respected woman.",
      "By Allah's command he was born without a father. Allah gave him the Injil.",
      "By Allah's permission he showed many miracles.",
    ],
    lessonBn: "সব নবীকে সম্মান করা আমাদের শিক্ষা।",
    lessonEn: "We are taught to respect all the prophets.",
  },
];

// ---------------------------------------------------------------------------
// 7) Life of the Prophet Muhammad (PBUH) in short
// ---------------------------------------------------------------------------
export const seerahTimeline: InfoItem[] = [
  {
    id: "birth",
    icon: "🌙",
    titleBn: "জন্ম",
    titleEn: "Birth",
    tagBn: "আনুমানিক ৫৭০ খ্রি.",
    tagEn: "About 570 CE",
    bodyBn: [
      "প্রিয় নবী মুহাম্মাদ (সা.) মক্কায় রবিউল আউয়াল মাসে জন্মগ্রহণ করেন।",
      "জন্মের আগেই তাঁর পিতা আবদুল্লাহ ইন্তেকাল করেন। মা আমিনা এবং পরে দাদা আবদুল মুত্তালিব ও চাচা আবু তালিব তাঁকে লালন-পালন করেন।",
    ],
    bodyEn: [
      "Our beloved Prophet Muhammad (PBUH) was born in Makkah in the month of Rabi al-Awwal.",
      "His father Abdullah passed away before his birth. His mother Aminah, and later his grandfather Abdul Muttalib and uncle Abu Talib, took care of him.",
    ],
  },
  {
    id: "alamin",
    icon: "🤝",
    titleBn: "আল-আমিন (বিশ্বস্ত)",
    titleEn: "Al-Amin (the Trustworthy)",
    tagBn: "যুবক বয়স",
    tagEn: "Young adulthood",
    bodyBn: [
      "যুবক বয়সেই তিনি সত্যবাদিতা ও আমানতদারির জন্য 'আল-আমিন' উপাধি পান।",
      "তিনি বিবি খাদিজা (রা.)-কে বিয়ে করেন। মানুষ তাঁর কাছে নিশ্চিন্তে নিজেদের জিনিস আমানত রাখত।",
    ],
    bodyEn: [
      "In his youth he became known as 'Al-Amin' (the Trustworthy) for his honesty.",
      "He married Khadijah (RA). People safely left their valuables with him.",
    ],
    lessonBn: "সত্য বলা ও আমানত রক্ষা করা আমাদেরও শিখতে হবে।",
    lessonEn: "We should also learn to tell the truth and keep trusts.",
  },
  {
    id: "wahy",
    icon: "📜",
    titleBn: "প্রথম ওহি",
    titleEn: "The first revelation",
    tagBn: "৪০ বছর বয়সে",
    tagEn: "At age 40",
    bodyBn: [
      "মক্কার হেরা গুহায় জিবরীল (আ.) আল্লাহর প্রথম বাণী নিয়ে আসেন। প্রথম শব্দ ছিল 'ইকরা' (পড়ো)।",
      "এভাবে কুরআন নাজিল শুরু হয় এবং প্রায় ২৩ বছর ধরে নাজিল হতে থাকে।",
    ],
    bodyEn: [
      "In the cave of Hira near Makkah, Jibril (AS) brought the first words of Allah. The first word was 'Iqra' (Read).",
      "This is how the Quran began to be revealed, over about 23 years.",
    ],
    lessonBn: "ইসলামের প্রথম নির্দেশই হলো পড়া, তাই জ্ঞান অর্জন খুব গুরুত্বপূর্ণ।",
    lessonEn: "The very first command was to read, so seeking knowledge is very important.",
  },
  {
    id: "makkah_days",
    icon: "💪",
    titleBn: "মক্কার কঠিন দিনগুলো",
    titleEn: "Hard days in Makkah",
    tagBn: "প্রায় ১৩ বছর",
    tagEn: "About 13 years",
    bodyBn: [
      "মক্কায় তিনি মানুষকে এক আল্লাহর দিকে ডাকলেন। অনেকে তাঁকে ও সাহাবিদের কষ্ট দিল।",
      "তবুও তিনি ধৈর্য ধরলেন, কারো ক্ষতি করেননি।",
    ],
    bodyEn: [
      "In Makkah he called people to the One Allah. Many people hurt him and his companions.",
      "Yet he stayed patient and never harmed anyone in return.",
    ],
  },
  {
    id: "hijrah",
    icon: "🐪",
    titleBn: "হিজরত",
    titleEn: "The Hijrah",
    tagBn: "৬২২ খ্রি.",
    tagEn: "622 CE",
    bodyBn: [
      "আল্লাহর নির্দেশে নবীজি (সা.) আবু বকর (রা.)-কে সাথে নিয়ে মক্কা ছেড়ে মদিনায় চলে যান। একে হিজরত বলে।",
      "মদিনার মানুষ তাঁকে খুব ভালোবাসায় বরণ করে নেয়। এই বছর থেকেই হিজরি সন শুরু হয়।",
    ],
    bodyEn: [
      "By Allah's command the Prophet (PBUH) left Makkah with Abu Bakr (RA) and went to Madinah. This is the Hijrah.",
      "The people of Madinah welcomed him with great love. The Hijri calendar begins from this migration.",
    ],
  },
  {
    id: "makkah_conquest",
    icon: "🕊️",
    titleBn: "মক্কা বিজয়",
    titleEn: "Conquest of Makkah",
    tagBn: "৮ হিজরি",
    tagEn: "8 AH",
    bodyBn: [
      "মক্কা বিজয়ের দিন নবীজি (সা.) যারা তাঁকে কষ্ট দিয়েছিল তাদের সবাইকে ক্ষমা করে দেন।",
      "বিনা যুদ্ধে ও বিনা রক্তপাতে মক্কা জয় হয়। এটা ক্ষমা ও দয়ার সবচেয়ে বড় উদাহরণ।",
    ],
    bodyEn: [
      "On the day Makkah was opened, the Prophet (PBUH) forgave those who had hurt him.",
      "Makkah was taken peacefully, without bloodshed. It is a great example of forgiveness and mercy.",
    ],
    lessonBn: "শত্রুকেও ক্ষমা করা বড় মনের পরিচয়।",
    lessonEn: "Forgiving even enemies shows a great heart.",
  },
  {
    id: "farewell",
    icon: "🤲",
    titleBn: "বিদায় হজ ও ইন্তেকাল",
    titleEn: "Farewell Hajj and passing",
    tagBn: "১০–১১ হিজরি (৬৩২ খ্রি.)",
    tagEn: "10–11 AH (632 CE)",
    bodyBn: [
      "১০ হিজরিতে নবীজি (সা.) বিদায় হজ করেন এবং আরাফাতের ময়দানে সবার জন্য শান্তি, ন্যায় ও সমতার বার্তা দেন।",
      "১১ হিজরিতে ৬৩ বছর বয়সে তিনি মদিনায় ইন্তেকাল করেন। তাঁকে মসজিদে নববীর পাশে (আয়েশা রা.-এর ঘরে) দাফন করা হয়।",
    ],
    bodyEn: [
      "In 10 AH the Prophet (PBUH) performed the Farewell Hajj and gave a message of peace, justice and equality at Arafat.",
      "In 11 AH he passed away in Madinah at the age of 63, and was buried beside the Prophet's Mosque.",
    ],
  },
];

export const khulafa: InfoItem[] = [
  {
    id: "abubakr",
    icon: "1️⃣",
    titleBn: "আবু বকর সিদ্দিক (রা.)",
    titleEn: "Abu Bakr as-Siddiq (RA)",
    tagBn: "প্রথম খলিফা",
    tagEn: "First Caliph",
    bodyBn: [
      "তিনি নবীজি (সা.)-এর সবচেয়ে ঘনিষ্ঠ বন্ধু ছিলেন এবং হিজরতে তাঁর সাথী ছিলেন।",
      "তাঁর সত্যবাদিতার জন্য তাঁকে 'সিদ্দিক' বলা হয়। নবীজির ইন্তেকালের পর তিনি প্রথম খলিফা হন।",
    ],
    bodyEn: [
      "He was the closest friend of the Prophet (PBUH) and his companion in the Hijrah.",
      "He is called 'As-Siddiq' (the Truthful). After the Prophet's passing he became the first caliph.",
    ],
  },
  {
    id: "umar",
    icon: "2️⃣",
    titleBn: "ওমর ইবনুল খাত্তাব (রা.)",
    titleEn: "Umar ibn al-Khattab (RA)",
    tagBn: "দ্বিতীয় খলিফা",
    tagEn: "Second Caliph",
    bodyBn: [
      "তিনি ন্যায়বিচারের জন্য বিখ্যাত ছিলেন এবং প্রজাদের খোঁজখবর রাখতেন।",
      "তাঁর সময়ে হিজরি সন গণনা চালু হয়।",
    ],
    bodyEn: [
      "He was famous for justice and for caring about the needs of his people.",
      "The Hijri calendar was introduced during his time.",
    ],
  },
  {
    id: "uthman",
    icon: "3️⃣",
    titleBn: "ওসমান ইবনে আফফান (রা.)",
    titleEn: "Uthman ibn Affan (RA)",
    tagBn: "তৃতীয় খলিফা",
    tagEn: "Third Caliph",
    bodyBn: [
      "তিনি অত্যন্ত লাজুক ও দানশীল ছিলেন। মুসলমানদের পানির কষ্ট দূর করতে তিনি কূপ কিনে দান করেছিলেন।",
      "তাঁর সময়ে কুরআনের কপি তৈরি করে বিভিন্ন অঞ্চলে পাঠানো হয়।",
    ],
    bodyEn: [
      "He was very modest and generous. He bought a well and gave it to the Muslims to solve their water problem.",
      "During his time copies of the Quran were prepared and sent to different regions.",
    ],
  },
  {
    id: "ali",
    icon: "4️⃣",
    titleBn: "আলী ইবনে আবি তালিব (রা.)",
    titleEn: "Ali ibn Abi Talib (RA)",
    tagBn: "চতুর্থ খলিফা",
    tagEn: "Fourth Caliph",
    bodyBn: [
      "তিনি নবীজি (সা.)-এর চাচাতো ভাই এবং জামাতা ছিলেন। ছোটবেলাতেই তিনি ইসলাম গ্রহণ করেন।",
      "তিনি জ্ঞান ও সাহসের জন্য বিখ্যাত ছিলেন।",
    ],
    bodyEn: [
      "He was the cousin and son-in-law of the Prophet (PBUH) and accepted Islam as a child.",
      "He was famous for his knowledge and bravery.",
    ],
  },
];

// ---------------------------------------------------------------------------
// 8) Things worth knowing
// ---------------------------------------------------------------------------
export const islamicFacts: InfoItem[] = [
  {
    id: "quran",
    icon: "📗",
    titleBn: "আল-কুরআন সম্পর্কে",
    titleEn: "About the Quran",
    bodyBn: [
      "কুরআন আল্লাহর কালাম, মুসলমানদের সর্বশেষ আসমানি কিতাব।",
      "কুরআনে ১১৪টি সূরা এবং ৩০টি পারা (জুয) আছে।",
      "প্রথম নাজিল হয় সূরা আলাকের প্রথম কয়েকটি আয়াত। সবচেয়ে বড় সূরা আল-বাকারা, আর সবচেয়ে ছোট সূরা আল-কাউসার।",
      "কুরআনে ২৫ জন নবীর নাম এসেছে।",
    ],
    bodyEn: [
      "The Quran is the word of Allah, the final holy book for Muslims.",
      "It has 114 surahs and 30 parts (juz).",
      "The first revelation was the first verses of Surah Al-Alaq. The longest surah is Al-Baqarah and the shortest is Al-Kawthar.",
      "The names of 25 prophets are mentioned in the Quran.",
    ],
  },
  {
    id: "months",
    icon: "🗓️",
    titleBn: "১২টি হিজরি মাস",
    titleEn: "The 12 Hijri months",
    bodyBn: ["হিজরি সন চাঁদের হিসাবে চলে। মাসগুলো হলো:"],
    bodyEn: ["The Hijri calendar follows the moon. The months are:"],
    stepsBn: ["মুহাররম", "সফর", "রবিউল আউয়াল", "রবিউস সানি", "জমাদিউল আউয়াল", "জমাদিউস সানি", "রজব", "শা'বান", "রমজান", "শাওয়াল", "জিলকদ", "জিলহজ"],
    stepsEn: ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhul Qadah", "Dhul Hijjah"],
  },
  {
    id: "eids",
    icon: "🎉",
    titleBn: "দুই ঈদ",
    titleEn: "The two Eids",
    bodyBn: [
      "ঈদুল ফিতর: রমজানের রোজা শেষে ১ শাওয়াল। এদিন আমরা নামাজ পড়ি, একসাথে আনন্দ করি এবং গরিবদের ফিতরা দিই।",
      "ঈদুল আযহা: ১০ জিলহজ। ইবরাহিম (আ.)-এর আনুগত্যের স্মরণে কুরবানি করা হয় এবং মাংস গরিব ও আত্মীয়দের মধ্যে ভাগ করা হয়।",
    ],
    bodyEn: [
      "Eid al-Fitr: 1 Shawwal, after the fasts of Ramadan. We pray, celebrate together and give Fitrah to the poor.",
      "Eid al-Adha: 10 Dhul Hijjah. A sacrifice is made to remember Ibrahim's (AS) obedience, and the meat is shared with the poor and relatives.",
    ],
  },
  {
    id: "manners",
    icon: "💚",
    titleBn: "মুসলিম শিশুর সুন্দর আদব",
    titleEn: "Good manners of a Muslim child",
    bodyBn: ["নবীজি (সা.) আমাদের সুন্দর আচরণ শিখিয়েছেন। আমরাও চেষ্টা করি:"],
    bodyEn: ["The Prophet (PBUH) taught us beautiful manners. Let us try to:"],
    stepsBn: [
      "দেখা হলে সালাম দেওয়া",
      "সবসময় সত্য কথা বলা",
      "মা-বাবার কথা মানা ও তাঁদের সেবা করা",
      "ডান হাতে খাওয়া ও খাওয়ার আগে হাত ধোয়া",
      "প্রতিবেশী ও বন্ধুদের সাথে ভালো ব্যবহার করা",
      "পশুপাখির প্রতি দয়া করা",
      "পরিষ্কার-পরিচ্ছন্ন থাকা",
    ],
    stepsEn: [
      "Give salam when you meet someone",
      "Always tell the truth",
      "Obey and serve your parents",
      "Eat with the right hand and wash hands before eating",
      "Be kind to neighbours and friends",
      "Be kind to animals",
      "Stay clean and tidy",
    ],
    lessonBn: "পরিচ্ছন্নতা ঈমানের অঙ্গ।",
    lessonEn: "Cleanliness is part of faith.",
  },
];
