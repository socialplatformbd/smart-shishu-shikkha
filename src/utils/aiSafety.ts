/**
 * Child-safety filters for the AI teacher.
 * - Runs on the question BEFORE anything is sent to an AI service, and on the AI answer before it is shown.
 * - Pure functions only: nothing is stored, logged or sent anywhere.
 * - A word list can never be perfect. It is one layer, next to the strict system prompt.
 */

export type SafetyKind = "self_harm" | "violence" | "sexual" | "drugs" | "personal_info" | "abuse" | "jailbreak";

export type SafetyResult =
  | { ok: true }
  | { ok: false; kind: SafetyKind; messageBn: string; messageEn: string };

const BN = "\\u0980-\\u09FF";
// Bengali has no \b, so match a word only when it is not glued to other Bengali letters.
// `prefix` lets inflected forms match too (e.g. বন্দুকের).
const bn = (word: string, prefix = true) =>
  new RegExp(`(^|[^${BN}])${word}${prefix ? "" : `(?![${BN}])`}`);
const en = (word: string) => new RegExp(`\\b${word}\\b`, "i");

const RULES: { kind: SafetyKind; tests: RegExp[] }[] = [
  {
    kind: "self_harm",
    tests: [
      bn("আত্মহত্যা"), bn("মরে যেতে চাই"), bn("মরে যাই"), bn("নিজেকে শেষ"), bn("নিজেকে আঘাত"),
      en("suicide"), en("kill myself"), en("self[- ]?harm"), en("want to die"), en("hurt myself"),
    ],
  },
  {
    kind: "violence",
    tests: [
      bn("বোমা"), bn("বন্দুক"), bn("পিস্তল"), bn("অস্ত্র"), bn("খুন"), bn("হত্যা"), bn("বিষ খাও"), bn("মেরে ফেল"),
      bn("ছুরি মার"),
      en("bomb"), en("gun"), en("guns"), en("weapon"), en("weapons"), en("murder"), en("kill"), en("poison"), en("stab"),
      en("explosive"), en("how to hurt"),
    ],
  },
  {
    kind: "sexual",
    tests: [
      bn("যৌন"), bn("সেক্স"), bn("নগ্ন"), bn("পর্ন"), bn("ধর্ষণ"), bn("উলঙ্গ"),
      en("sex"), en("sexy"), en("porn"), en("nude"), en("naked"), en("rape"), en("boobs"),
    ],
  },
  {
    kind: "drugs",
    tests: [
      bn("মাদক"), bn("গাঁজা"), bn("ইয়াবা"), bn("হেরোইন"), bn("মদ", false), bn("বিয়ার", false), bn("সিগারেট"), bn("ধূমপান"),
      en("drug"), en("drugs"), en("cocaine"), en("heroin"), en("alcohol"), en("beer"), en("cigarette"), en("vape"),
    ],
  },
  {
    kind: "abuse",
    tests: [
      bn("হারামি"), bn("শুয়োর"), bn("কুত্তা"), bn("খানকি"), bn("মাগি"), bn("চুদ"),
      en("fuck"), en("shit"), en("bitch"), en("asshole"), en("bastard"),
    ],
  },
  {
    kind: "jailbreak",
    tests: [
      en("ignore (all |any )?(the )?(previous|above|prior) (instructions|rules)"),
      en("system prompt"), en("jailbreak"), en("pretend (you are|to be)"), en("act as (a|an) "),
      bn("আগের নির্দেশ ভুলে"), bn("নিয়ম ভুলে যাও"),
    ],
  },
];

// Bengali digits -> ASCII, so a phone number written in Bengali digits is still caught.
function normalizeDigits(text: string): string {
  return text.replace(/[\u09E6-\u09EF]/g, (d) => String(d.charCodeAt(0) - 0x09e6));
}

const PERSONAL_INFO_TESTS: RegExp[] = [
  /(\+?88)?[\s-]?0?1[3-9][\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{3}/, // Bangladesh mobile number
  /\b\d{10,}\b/, // any long number (phone, NID, card ...)
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, // e-mail
  en("password"), en("my address"), en("my phone"), en("my school is"), en("home address"),
  bn("পাসওয়ার্ড"), bn("আমার ঠিকানা"), bn("আমার ফোন"), bn("আমার নাম্বার"), bn("বাসার ঠিকানা"), bn("আমার স্কুলের নাম"),
];

const MESSAGES: Record<SafetyKind, { bn: string; en: string }> = {
  self_harm: {
    bn: "💛 তুমি যদি মন খারাপ, ভয় বা কষ্ট পাও, তাহলে এখনই মা-বাবা বা যাকে বিশ্বাস করো এমন কোনো বড়কে বলো। তারা তোমাকে সাহায্য করবে। তুমি খুব গুরুত্বপূর্ণ!",
    en: "💛 If you feel sad, scared or hurt, please tell your mum, dad or a grown-up you trust right now. They will help you. You are very important!",
  },
  violence: {
    bn: "🙅 এই বিষয়ে আমি কিছু বলতে পারব না, কারণ এটা শিশুদের জন্য নিরাপদ নয়। চলো বরং প্রাণী, প্রকৃতি বা মজার অংক নিয়ে কথা বলি! 🌳",
    en: "🙅 I can't talk about that because it is not safe for children. Let's talk about animals, nature or fun math instead! 🌳",
  },
  sexual: {
    bn: "🙅 এই প্রশ্নটা শিশুদের জন্য নয়। এটা নিয়ে জানতে চাইলে মা-বাবা বা শিক্ষককে জিজ্ঞাসা করো। চলো অন্য কিছু শিখি! 📚",
    en: "🙅 That question is not for children. Please ask a parent or teacher about it. Let's learn something else! 📚",
  },
  drugs: {
    bn: "🙅 এটা শিশুদের জন্য নিরাপদ বিষয় নয়। এ নিয়ে জানতে চাইলে বড়দের জিজ্ঞাসা করো। চলো স্বাস্থ্যকর অভ্যাস নিয়ে শিখি! 🥕",
    en: "🙅 That is not a safe topic for children. Please ask a grown-up about it. Let's learn about healthy habits instead! 🥕",
  },
  abuse: {
    bn: "😊 চলো ভালো ও মিষ্টি কথায় কথা বলি। তুমি আমাকে পড়াশোনা, প্রাণী বা প্রকৃতি নিয়ে প্রশ্ন করতে পারো! 🌈",
    en: "😊 Let's use kind and friendly words. You can ask me about school, animals or nature! 🌈",
  },
  jailbreak: {
    bn: "🤖 আমি শুধু শিশুদের শেখানোর জন্য তৈরি। পড়াশোনা বা প্রকৃতি নিয়ে প্রশ্ন করো, আমি খুশি হয়ে উত্তর দেব! 📖",
    en: "🤖 I am made only to help children learn. Ask me about school or nature and I'll happily answer! 📖",
  },
  personal_info: {
    bn: "🔒 তোমার ফোন নম্বর, ঠিকানা, স্কুলের নাম বা পাসওয়ার্ড কাউকে লিখে জানাবে না। আমার কাছেও না! চলো অন্য কিছু শিখি। 🌟",
    en: "🔒 Never type your phone number, address, school name or password for anyone, not even me! Let's learn something else. 🌟",
  },
};

/** Checks a child's question. Nothing here leaves the device/server process. */
export function checkInputSafety(text: string): SafetyResult {
  const plain = text.toLowerCase();
  const digits = normalizeDigits(text);

  if (PERSONAL_INFO_TESTS.some((re) => re.test(digits) || re.test(plain))) {
    return { ok: false, kind: "personal_info", messageBn: MESSAGES.personal_info.bn, messageEn: MESSAGES.personal_info.en };
  }
  for (const rule of RULES) {
    if (rule.tests.some((re) => re.test(plain))) {
      return { ok: false, kind: rule.kind, messageBn: MESSAGES[rule.kind].bn, messageEn: MESSAGES[rule.kind].en };
    }
  }
  return { ok: true };
}

/** Checks the AI's answer before it is shown. Also blocks links, which a child should never be sent to. */
export function isOutputSafe(text: string): boolean {
  if (/https?:\/\/|www\./i.test(text)) return false;
  const plain = text.toLowerCase();
  return !RULES.some((rule) => rule.kind !== "jailbreak" && rule.tests.some((re) => re.test(plain)));
}
