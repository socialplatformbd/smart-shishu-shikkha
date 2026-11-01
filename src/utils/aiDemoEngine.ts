import type { AIAction, AILangPref } from "@/types";

export interface DemoResponse {
  answer: string;
  practiceQuestions: string[];
}

interface LangBlock {
  answer: string;
  /** One very short, baby-friendly sentence used by the "explain more simply" button. */
  simple: string;
  practice: string[];
}

interface DemoTopic {
  id: string;
  /** Returns true when the (lower-cased) question is about this topic. */
  match: (q: string) => boolean;
  bn: LangBlock;
  en: LangBlock;
}

/** True when the text contains at least one Bengali letter. */
export function containsBengali(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

/** Whole-word English match, so "sun" does not fire on "Sunday" and "rain" not on "train". */
const word = (q: string, ...words: string[]) =>
  words.some((w) => new RegExp(`\\b${w}\\b`, "i").test(q));

const topics: DemoTopic[] = [
  {
    id: "greeting",
    match: (q) =>
      /(কেমন আছ|নাম কি|নাম কী|হ্যালো|সালাম|আসসালামু)/.test(q) || word(q, "hello", "hi", "hey", "how are you"),
    bn: {
      answer:
        "ওয়া আলাইকুমুস সালাম! আমি তোমার স্মার্ট AI শিক্ষক ও বন্ধু! 🤖✨ আমি খুব ভালো আছি। তুমি আজ কী বিষয় শিখতে চাও? বাংলা বর্ণমালা, মজার অংক, নাকি মহাশূন্যের গল্প?",
      simple: "আমি তোমার রোবট বন্ধু! 🤖 চলো একসাথে নতুন কিছু শিখি।",
      practice: ["১ থেকে ১০ গণনা শিখতে চাও?", "চাঁদ কেন রাতে আলো দেয়?", "বাঘ সম্পর্কে কিছু জানতে চাও?"],
    },
    en: {
      answer:
        "Hello there little friend! 🤖✨ I am your Smart AI Teacher. I'm doing wonderfully! What exciting topic do you want to learn today? English, fun math, or nature secrets?",
      simple: "I am your robot friend! 🤖 Let's learn something new together.",
      practice: ["Do you want to learn counting 1 to 10?", "Why is the sky blue?", "Tell me about the Royal Bengal Tiger!"],
    },
  },
  {
    id: "salah",
    match: (q) => /(নামাজ|নামায|সালাত|ওযু|অজু)/.test(q) || word(q, "salah", "namaz", "prayer", "prayers", "wudu"),
    bn: {
      answer:
        "🕌 **নামাজ:**\n\n১. প্রতিদিন ৫ ওয়াক্ত নামাজ: ফজর, যোহর, আসর, মাগরিব ও এশা।\n২. নামাজের আগে ওযু করে পরিষ্কার হতে হয়।\n৩. নামাজে আমরা আল্লাহর সাথে কথা বলি এবং তাঁর শুকরিয়া জানাই। ছোটরা মা-বাবার সাথে নামাজ শিখতে পারো। 🤲",
      simple: "দিনে ৫ বার আল্লাহর সামনে দাঁড়িয়ে নামাজ পড়ি। 🕌",
      practice: ["দিনে কয় ওয়াক্ত নামাজ?", "মাগরিবের ফরজ কত রাকআত?", "ওযুর আগে কী বলতে হয়?"],
    },
    en: {
      answer:
        "🕌 **Prayer (Salah):**\n\n1. Five daily prayers: Fajr, Zuhr, Asr, Maghrib and Isha.\n2. Before praying we make wudu to be clean.\n3. In prayer we talk to Allah and thank Him. Children can learn to pray with their parents. 🤲",
      simple: "We pray five times a day, standing before Allah. 🕌",
      practice: ["How many prayers are there each day?", "How many fard rakats are in Maghrib?", "What do we say before wudu?"],
    },
  },
  {
    id: "qurbani",
    match: (q) => /(কুরবানি|কোরবানি|আযহা|আজহা)/.test(q) || word(q, "qurbani", "adha", "sacrifice"),
    bn: {
      answer:
        "🐑 **ঈদুল আযহা ও কুরবানি:**\n\n১. ঈদুল আযহা হয় ১০ জিলহজ।\n২. নবী ইবরাহিম (আ.) আল্লাহর হুকুম মানতে প্রস্তুত ছিলেন। সেই আনুগত্যের স্মরণে আমরা কুরবানি করি।\n৩. কুরবানির মাংস গরিব, আত্মীয় ও প্রতিবেশীদের সাথে ভাগ করে নিই। 💚",
      simple: "আল্লাহর হুকুম মানার স্মরণে কুরবানি করি এবং মাংস সবার সাথে ভাগ করি। 🐑",
      practice: ["ঈদুল আযহা কবে হয়?", "কুরবানির মাংস কাদের দেওয়া হয়?", "ইবরাহিম (আ.) কে ছিলেন?"],
    },
    en: {
      answer:
        "🐑 **Eid al-Adha and Qurbani:**\n\n1. Eid al-Adha is on 10 Dhul Hijjah.\n2. Prophet Ibrahim (AS) was ready to obey Allah. We remember his obedience through the sacrifice.\n3. We share the meat with poor people, relatives and neighbours. 💚",
      simple: "We sacrifice to remember obeying Allah, and we share the meat with everyone. 🐑",
      practice: ["When is Eid al-Adha?", "Who gets the Qurbani meat?", "Who was Ibrahim (AS)?"],
    },
  },
  {
    id: "roza",
    match: (q) => /(রোজা|রমজান|রমযান|ঈদ|সাহরি|ইফতার)/.test(q) || word(q, "ramadan", "fasting", "roza", "eid", "iftar"),
    bn: {
      answer:
        "🌙 **রমজান ও রোজা:**\n\n১. রমজান মাসে ভোর থেকে সূর্যাস্ত পর্যন্ত খাওয়া-দাওয়া থেকে বিরত থাকাকে রোজা বলে।\n২. ভোরে খাওয়াকে সাহরি এবং সন্ধ্যায় রোজা ভাঙাকে ইফতার বলে।\n৩. রমজানের পরে ১ শাওয়াল ঈদুল ফিতর। বড় হলে রোজা ফরজ হয়। 🎉",
      simple: "রমজানে সারাদিন না খেয়ে থাকি, সন্ধ্যায় ইফতার করি। 🌙",
      practice: ["রোজা কোন মাসে রাখা হয়?", "সাহরি কখন খাওয়া হয়?", "ঈদুল ফিতর কবে হয়?"],
    },
    en: {
      answer:
        "🌙 **Ramadan and fasting:**\n\n1. In Ramadan we do not eat or drink from dawn until sunset. This is fasting.\n2. The meal before dawn is Suhoor, and breaking the fast at sunset is Iftar.\n3. After Ramadan comes Eid al-Fitr on 1 Shawwal. Fasting becomes obligatory when a person grows up. 🎉",
      simple: "In Ramadan we do not eat all day, and we break the fast in the evening. 🌙",
      practice: ["In which month do Muslims fast?", "When do we eat Suhoor?", "When is Eid al-Fitr?"],
    },
  },
  {
    id: "prophets",
    match: (q) => /(নবীদের|আদম|নূহ|ইবরাহিম|ইব্রাহিম|মূসা|ঈসা|ইউসুফ|ইউনুস|সুলাইমান)/.test(q) || word(q, "prophets", "adam", "ibrahim", "abraham", "musa", "moses", "noah", "nuh", "yusuf", "joseph", "yunus", "jesus"),
    bn: {
      answer:
        "🌟 **নবী-রাসূলগণ:**\n\n১. আল্লাহ মানুষকে সঠিক পথ দেখাতে যুগে যুগে নবী পাঠিয়েছেন। কুরআনে ২৫ জন নবীর নাম আছে।\n২. প্রথম নবী আদম (আ.), শেষ নবী মুহাম্মাদ (সা.)।\n৩. 'ইসলাম' ট্যাবের 'নবীদের গল্প' অংশে নূহ, ইবরাহিম, ইউসুফ, মূসা সহ অনেকের গল্প পড়তে পারো। 📖",
      simple: "আল্লাহ ভালো পথ দেখাতে অনেক নবী পাঠিয়েছেন। প্রথম আদম (আ.), শেষ মুহাম্মাদ (সা.)। 🌟",
      practice: ["প্রথম নবী কে ছিলেন?", "বড় নৌকা বানিয়েছিলেন কোন নবী?", "শেষ নবী কে?"],
    },
    en: {
      answer:
        "🌟 **The Prophets:**\n\n1. Allah sent prophets through the ages to guide people. The names of 25 prophets are in the Quran.\n2. The first prophet was Adam (AS) and the last is Muhammad (PBUH).\n3. Read the stories of Nuh, Ibrahim, Yusuf, Musa and more in the 'Islam' tab. 📖",
      simple: "Allah sent many prophets to show the good way. First Adam (AS), last Muhammad (PBUH). 🌟",
      practice: ["Who was the first prophet?", "Which prophet built the great ark?", "Who is the last prophet?"],
    },
  },
  {
    id: "nabi",
    match: (q) => /(নবী|রাসূল|মুহাম্মদ|মুহাম্মাদ|মক্কা|মদিনা|কাবা|হিজরত)/.test(q) || word(q, "prophet", "muhammad", "makkah", "mecca", "madinah", "kaaba"),
    bn: {
      answer:
        "🌟 **প্রিয় নবী মুহাম্মাদ (সা.):**\n\n১. তিনি আল্লাহর সর্বশেষ নবী। মক্কায় জন্মগ্রহণ করেন।\n২. সত্যবাদিতার জন্য তাঁকে 'আল-আমিন' (বিশ্বস্ত) বলা হতো।\n৩. ৪০ বছর বয়সে প্রথম ওহি আসে এবং পরে তিনি মদিনায় হিজরত করেন। তিনি সবাইকে ক্ষমা ও ভালোবাসার শিক্ষা দিয়েছেন। 💚",
      simple: "নবীজি (সা.) সত্য কথা বলতেন, সবাইকে ভালোবাসতেন ও ক্ষমা করতেন। 💚",
      practice: ["নবীজি (সা.) কোথায় জন্মেছিলেন?", "'আল-আমিন' মানে কী?", "হিজরত কী?"],
    },
    en: {
      answer:
        "🌟 **Our beloved Prophet Muhammad (PBUH):**\n\n1. He is the last prophet of Allah, born in Makkah.\n2. He was called 'Al-Amin' (the Trustworthy) because he was so honest.\n3. He received the first revelation at 40 and later migrated to Madinah. He taught everyone forgiveness and love. 💚",
      simple: "The Prophet (PBUH) told the truth, loved everyone and forgave others. 💚",
      practice: ["Where was the Prophet (PBUH) born?", "What does 'Al-Amin' mean?", "What is the Hijrah?"],
    },
  },
  {
    id: "quran",
    match: (q) => /(কুরআন|কোরআন|সূরা|সুরা|আয়াত)/.test(q) || word(q, "quran", "koran", "surah", "ayah"),
    bn: {
      answer:
        "📗 **আল-কুরআন:**\n\n১. কুরআন আল্লাহর কালাম, মুসলমানদের শেষ আসমানি কিতাব।\n২. কুরআনে ১১৪টি সূরা ও ৩০টি পারা আছে।\n৩. প্রথম সূরা আল-ফাতিহা। সঠিক তিলাওয়াত শিক্ষকের কাছ থেকে শুনে শুনে শিখতে হয়। 📖",
      simple: "কুরআন আল্লাহর কথা। এতে ১১৪টি সূরা আছে। 📗",
      practice: ["কুরআনে কয়টি সূরা?", "কুরআনের প্রথম সূরা কোনটি?", "সূরা ইখলাসে কয়টি আয়াত?"],
    },
    en: {
      answer:
        "📗 **The Quran:**\n\n1. The Quran is the word of Allah, the final holy book for Muslims.\n2. It has 114 surahs and 30 parts.\n3. The first surah is Al-Fatiha. The correct recitation should be learned by listening to a teacher. 📖",
      simple: "The Quran is Allah's word. It has 114 surahs. 📗",
      practice: ["How many surahs are in the Quran?", "Which is the first surah?", "How many verses are in Surah Al-Ikhlas?"],
    },
  },
  {
    id: "sky",
    match: (q) => /আকাশ/.test(q) || word(q, "sky"),
    bn: {
      answer:
        "💙 **আকাশ নীল কেন?**\n\n১. সূর্যের সাদা আলোর ভেতরে সব রং মেশানো থাকে।\n২. সেই আলো বাতাসের ভেতর দিয়ে আসার সময় নীল রংটা সবচেয়ে বেশি চারদিকে ছড়িয়ে পড়ে।\n৩. তাই আমরা যেদিকেই তাকাই, আকাশটা নীল দেখতে পাই! 🌤️",
      simple: "সূর্যের আলোর নীল রংটা আকাশে ছড়িয়ে যায়, তাই আকাশ নীল! 💙",
      practice: ["রংধনুতে কয়টি রং থাকে?", "সূর্য কোন দিকে ওঠে?", "রাতে আকাশে কী কী দেখা যায়?"],
    },
    en: {
      answer:
        "💙 **Why is the sky blue?**\n\n1. Sunlight looks white, but it is made of many colors mixed together.\n2. When sunlight travels through the air, the blue color gets scattered in every direction the most.\n3. So wherever we look up, the sky looks blue! 🌤️",
      simple: "Blue light from the sun spreads all over the sky, so the sky looks blue! 💙",
      practice: ["How many colors are in a rainbow?", "Where does the sun rise?", "What can we see in the night sky?"],
    },
  },
  {
    id: "space",
    match: (q) => /(চাঁদ|সূর্য|তারা|নক্ষত্র|মহাকাশ)/.test(q) || word(q, "moon", "sun", "star", "stars", "space"),
    bn: {
      answer:
        "🌕 **চাঁদ ও সূর্যের মজার তথ্য:**\n\n১. **সূর্য:** সূর্য হলো আমাদের সবচেয়ে কাছের একটি বিরাট জলন্ত নক্ষত্র। এটি আমাদের আলো ও মিষ্টি রোদ দেয়।\n২. **চাঁদ:** চাঁদের কিন্তু নিজস্ব কোনো আলো নেই! সূর্যের আলো যখন চাঁদের গায়ে পড়ে আয়নার মতো প্রতিফলিত হয়, তখন আমরা রাতের আকাশে চাঁদকে উজ্জ্বল দেখতে পাই। 🌟",
      simple: "সূর্য আমাদের আলো দেয়। চাঁদ সেই আলো আয়নার মতো ফিরিয়ে দেয়, তাই রাতে চাঁদ জ্বলজ্বল করে! 🌙",
      practice: ["দিনের বেলা কি চাঁদ দেখা যায়?", "সূর্য কোন দিকে ওঠে এবং কোন দিকে অস্ত যায়?", "চাঁদে কি কোনো বাতাস আছে?"],
    },
    en: {
      answer:
        "🌕 **The Secret of the Moon and Sun:**\n\n1. **The Sun:** The Sun is a giant, bright star. It gives warmth and light to everything on Earth!\n2. **The Moon:** The Moon doesn't have its own light! Sunlight shines on the Moon and bounces back to Earth like a mirror! 🌟",
      simple: "The Sun gives us light. The Moon bounces that light back like a mirror, so it glows at night! 🌙",
      practice: ["Does the moon have air or water?", "In which direction does the Sun rise?", "Why do stars twinkle at night?"],
    },
  },
  {
    id: "rain",
    match: (q) => /(বৃষ্টি|রংধনু|মেঘ|বর্ষা)/.test(q) || word(q, "rain", "rainbow", "cloud", "clouds"),
    bn: {
      answer:
        "🌧️ **বৃষ্টি কীভাবে হয়?**\n\n১. সূর্যের তাপে নদী-পুকুরের পানি বাষ্প হয়ে আকাশে উড়ে যায় (একে বাষ্পীভবন বলে)।\n২. আকাশের ঠান্ডা বাতাসে সেই বাষ্প জমে হালকা মেঘ তৈরি করে।\n৩. মেঘগুলো ভারী হয়ে আর ভাসতে পারে না, তখন টুপটুপ করে বৃষ্টির ফোঁটা হয়ে ঝরে পড়ে! 🌈 বৃষ্টির পর রোদ উঠলে ৭ রঙের রংধনু দেখা যায়।",
      simple: "পানি উপরে উঠে মেঘ হয়। মেঘ ভারী হলে পানি বৃষ্টি হয়ে নিচে পড়ে! 🌧️",
      practice: ["রংধনুতে কয়টি রং থাকে জানো কি?", "বৃষ্টির দিনে ব্যাঙ কেমন শব্দ করে?", "মেঘের রং কখনো সাদা আর কখনো কালো হয় কেন?"],
    },
    en: {
      answer:
        "🌧️ **How Rain Happens:**\n\n1. The warm sun turns water from lakes into invisible vapor that rises up high.\n2. Up in the cool sky, the vapor cools down and gathers into puffy clouds.\n3. When the clouds get too heavy, the water falls down as rain! 🌈 When sunlight shines through raindrops, a 7-color rainbow appears!",
      simple: "Water goes up and makes clouds. When clouds get heavy, the water falls down as rain! 🌧️",
      practice: ["How many colors are in a rainbow?", "Can you name three colors of the rainbow?", "What sound does thunder make?"],
    },
  },
  {
    id: "lion",
    match: (q) => /সিংহ/.test(q) || word(q, "lion", "lions"),
    bn: {
      answer:
        "🦁 **সিংহ:**\n\n১. সিংহকে অনেকে \"বনের রাজা\" বলে ডাকে।\n২. পুরুষ সিংহের গলায় বড় কেশর থাকে, মেয়ে সিংহের থাকে না।\n৩. সিংহ দল বেঁধে থাকে, সেই দলকে বলে \"প্রাইড\"। বাংলাদেশে বনের সিংহ থাকে না, চিড়িয়াখানায় দেখা যায়।",
      simple: "সিংহের গলায় বড় কেশর থাকে। সিংহ দল বেঁধে থাকে! 🦁",
      practice: ["সিংহ কোথায় থাকে?", "বাঘ আর সিংহের মধ্যে কী মিল আছে?", "বাংলাদেশের জাতীয় পশু কোনটি?"],
    },
    en: {
      answer:
        "🦁 **The Lion:**\n\n1. Many people call the lion the \"king of the jungle\".\n2. Male lions have a big fluffy mane around the neck; female lions do not.\n3. Lions live in family groups called prides. In Bangladesh you can see lions in zoos, not in the wild.",
      simple: "A lion has a big fluffy mane. Lions live together in a family group! 🦁",
      practice: ["Where do lions live?", "What is the same between a tiger and a lion?", "What is the national animal of Bangladesh?"],
    },
  },
  {
    id: "elephant",
    match: (q) => /হাতি/.test(q) || word(q, "elephant", "elephants"),
    bn: {
      answer:
        "🐘 **হাতি:**\n\n১. হাতি স্থলের সবচেয়ে বড় প্রাণী।\n২. হাতির লম্বা শুঁড় দিয়ে সে খাবার ধরে, পানি খায় এবং গোসলও করে!\n৩. হাতি ঘাস, পাতা ও ফল খায়। হাতি খুব বুদ্ধিমান ও শান্ত প্রাণী।",
      simple: "হাতি সবচেয়ে বড় স্থলের প্রাণী। শুঁড় দিয়ে পানি খায়! 🐘",
      practice: ["হাতির শুঁড় দিয়ে কী কী করা যায়?", "হাতি কী খায়?", "ইংরেজিতে হাতিকে কী বলে?"],
    },
    en: {
      answer:
        "🐘 **The Elephant:**\n\n1. The elephant is the biggest animal that lives on land.\n2. It uses its long trunk to pick up food, drink water and even take a shower!\n3. Elephants eat grass, leaves and fruits. They are smart and gentle animals.",
      simple: "The elephant is the biggest land animal. It drinks water with its trunk! 🐘",
      practice: ["What can an elephant do with its trunk?", "What do elephants eat?", "What is 'হাতি' in English?"],
    },
  },
  {
    id: "tiger",
    match: (q) => /(বাঘ|সুন্দরবন|জাতীয় পশু|প্রাণী)/.test(q) || word(q, "tiger", "tigers", "sundarbans", "animal", "animals"),
    bn: {
      answer:
        "🐯 **রয়েল বেঙ্গল টাইগার (বাঘ):**\n\n১. বাঘ হলো বাংলাদেশের জাতীয় পশু!\n২. সুন্দরবনের ম্যানগ্রোভ বনে আমাদের রয়েল বেঙ্গল টাইগার বাস করে।\n৩. বাঘের গায়ে হলুদ-কমলা রঙের ওপর কালো ডোরাকাটা দাগ থাকে এবং বাঘ সাঁতার কাটতে দারুণ ওস্তাদ!",
      simple: "বাঘ আমাদের জাতীয় পশু। গায়ে ডোরাকাটা দাগ, থাকে সুন্দরবনে! 🐯",
      practice: ["বাঘের প্রিয় খাবার কী?", "সুন্দরবন কোথায় অবস্থিত?", "সিংহ ও বাঘের মধ্যে কী পার্থক্য?"],
    },
    en: {
      answer:
        "🐯 **The Royal Bengal Tiger:**\n\n1. The Tiger is the proud national animal of Bangladesh!\n2. They live in the lush mangrove forests of the Sundarbans.\n3. They have orange coats with black stripes, and unlike house cats, tigers love to swim in rivers!",
      simple: "The tiger is our national animal. It has stripes and lives in the Sundarbans! 🐯",
      practice: ["What is the national animal of Bangladesh?", "Can tigers swim?", "Where are the Sundarbans?"],
    },
  },
  {
    id: "math",
    match: (q) => /(গণিত|অংক|যোগ|বিয়োগ|সংখ্যা|গোনা|গণনা)/.test(q) || word(q, "math", "maths", "add", "addition", "subtract", "count", "counting", "numbers?") || /[০-৯0-9]/.test(q),
    bn: {
      answer:
        "🔢 **সহজ গণিতের ধাপ:**\n\nধরা যাক তোমার কাছে ৩টি মিষ্টি আপেল 🍎🍎🍎 আছে।\nতোমার মা তোমাকে আরও ২টি আপেল 🍎🍎 দিলেন।\n\nএখন একসাথে গুনো: ১, ২, ৩... ৪, ৫!\nতাহলে ৩ + ২ = ৫! খুব সহজ, তাই না? 🎉",
      simple: "৩টি আপেল আর ২টি আপেল মিলে হলো ৫টি আপেল! 🍎",
      practice: ["৪ + ৩ যোগ করলে কত হয় বলো তো?", "তোমার কাছে ৫টি চকলেট ছিল, ২টি খেয়ে ফেললে কয়টি থাকে?", "কোন সংখ্যাটি বড়: ৭ নাকি ৯?"],
    },
    en: {
      answer:
        "🔢 **Simple Math Steps:**\n\nImagine you have 3 juicy red apples 🍎🍎🍎.\nYour mother gives you 2 more apples 🍎🍎.\n\nNow count them all together: 1, 2, 3... 4, 5!\nSo 3 + 2 = 5! Math is like a fun counting game! 🎉",
      simple: "3 apples and 2 apples together make 5 apples! 🍎",
      practice: ["What is 4 + 3?", "If you have 6 crayons and give away 2, how many are left?", "Which is bigger: 7 or 9?"],
    },
  },
  {
    id: "health",
    match: (q) => /(হাত(?!ি)|দাঁত|স্বাস্থ্য|সাবান)/.test(q) || word(q, "wash", "handwashing", "brush", "teeth", "health", "healthy", "soap"),
    bn: {
      answer:
        "🧼 **হাত ধোয়া ও সুস্থ থাকার নিয়ম:**\n\n১. বাইরে থেকে খেলে এসে বা খাওয়ার আগে সাবান দিয়ে হাত ধুতে হয়।\n২. অন্তত ২০ সেকেন্ড ধরে হাতের তালু, আঙুলের ফাঁক ও নখ ঘষে পরিষ্কার করতে হয়।\n৩. এতে হাতের অদৃশ্য জীবাণু ধুয়ে যায় এবং পেটব্যথা বা সর্দি থেকে সুরক্ষিত থাকা যায়!",
      simple: "খাওয়ার আগে সাবান দিয়ে হাত ধুই, তাহলে জীবাণু পালিয়ে যায়! 🧼",
      practice: ["দিনে কয়বার দাঁত মাজা উচিত?", "খাওয়ার আগে কেন হাত ধুতে হয়?", "রাতে তাড়াতাড়ি ঘুমানো কেন ভালো?"],
    },
    en: {
      answer:
        "🧼 **Healthy Handwashing Habits:**\n\n1. Always wash your hands with soap before eating and after playing.\n2. Scrub your palms, fingers and nails for 20 seconds (sing Happy Birthday twice!).\n3. This washes away tiny invisible germs and keeps your tummy happy and healthy!",
      simple: "Wash your hands with soap before eating, and the germs run away! 🧼",
      practice: ["How many times a day should we brush our teeth?", "Why is soap important when washing hands?", "Why should we wash fruits before eating?"],
    },
  },
];

function fallbackBlock(isBn: boolean): LangBlock {
  return isBn
    ? {
        answer:
          "🙈 **এই প্রশ্নের উত্তর এখন আমার কাছে নেই।**\n\nআমি এখন সহজ অফলাইন মোডে আছি, তাই কয়েকটা বিষয়ই বলতে পারি: চাঁদ-সূর্য, বৃষ্টি, আকাশ, বাঘ, সিংহ, হাতি, গণিত, হাত ধোয়া, নামাজ, রোজা, নবীজি (সা.) আর কুরআন। 🌟\n\nতুমি চাইলে এই বিষয়গুলো জিজ্ঞাসা করতে পারো, অথবা বড়দের সাথে আলোচনা করে নতুন কিছু জেনে নিতে পারো!",
        simple: "এই প্রশ্নটা আমি এখনো জানি না 🙈 বড়দের জিজ্ঞাসা করো, আর চাঁদ, বৃষ্টি বা বাঘের কথা আমাকে জিজ্ঞাসা করো!",
        practice: ["চাঁদ কেন রাতে আলো দেয়?", "বৃষ্টি কীভাবে হয়?", "বাঘ সম্পর্কে কিছু বলো"],
      }
    : {
        answer:
          "🙈 **I don't know the answer to that one yet.**\n\nI am in simple offline mode right now, so I can only talk about a few things: the moon and sun, rain, the sky, tigers, lions, elephants, math, washing hands, prayer, fasting, the Prophet (PBUH) and the Quran. 🌟\n\nYou can ask me about those, or talk with a grown-up to discover something new!",
        simple: "I don't know that one yet 🙈 Ask a grown-up, and ask me about the moon, rain or tigers!",
        practice: ["Why does the moon shine at night?", "How does rain fall?", "Tell me about tigers"],
      };
}

/**
 * Child-friendly answers that work with no internet and no API key.
 * @param query    the child's original question
 * @param langPref "bn" | "en" | "auto" (auto follows the language of the question)
 * @param action   "translate" flips the answer to the other language, "simplify" gives the very short version
 */
export function getDemoEducationalAnswer(
  query: string,
  langPref: AILangPref = "auto",
  action: AIAction = "normal"
): DemoResponse {
  const q = query.toLowerCase().trim();
  const questionIsBn = containsBengali(query);
  let isBn = langPref === "bn" || (langPref === "auto" && questionIsBn);

  if (action === "translate") {
    // Flip relative to the language the answer would normally be given in.
    isBn = !isBn;
  }

  const topic = topics.find((t) => t.match(q));
  const block = topic ? (isBn ? topic.bn : topic.en) : fallbackBlock(isBn);

  if (action === "simplify") {
    const intro = isBn ? "🐣 আরও সহজ করে বলি:\n\n" : "🐣 Let me say it more simply:\n\n";
    return { answer: intro + block.simple, practiceQuestions: block.practice };
  }

  return { answer: block.answer, practiceQuestions: block.practice };
}
