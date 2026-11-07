# স্মার্ট শিশু শিক্ষা | Smart Shishu Shikkha
### Complete AI Teacher Web App + Installable PWA

> **Developer Credit:** Made by Mohammad Rakib  
> **Official Telegram Channel:** [https://t.me/appdevbyrakib](https://t.me/appdevbyrakib)  
> **Language:** বাংলা (Bengali - Default) | English  
> **Target Audience:** Android mobile users and children aged 4–10 years  

---

## 🌟 Overview

**স্মার্ট শিশু শিক্ষা** (Smart Shishu Shikkha) is a cheerful, mobile-first, installable Progressive Web Application (PWA) designed to teach children Bengali, English, Mathematics, and General Knowledge through colorful interactive cards, games, voice pronunciation, and an optional smart AI tutor.

### Key Features
- 🌺 **Bengali Learning (বাংলা শেখা):** Vowels (স্বরবর্ণ ১১টি), Consonants (ব্যঞ্জনবর্ণ ৩৯টি), words with pictures (অ - অজগর, আ - আম), pronunciation playback, and easy sentences.
- 🔤 **English Learning (ইংরেজি শেখা):** Alphabet A–Z with phonics, vocabulary categories (Fruits, Animals, Colors, Everyday Objects), picture matching, and Bengali translations.
- 🔢 **Mathematics (মজার গণিত):** Numbers 1–100, interactive item counting game, comparisons (> , < , =), picture addition (+), subtraction (-), geometric shapes, and patterns.
- 🌍 **General Knowledge (সাধারণ জ্ঞান):** Curated cards on Bangladesh, seasons, senses, good habits, road safety, and space science with interactive mini check questions.
- 🎮 **Educational Games (শিক্ষামূলক খেলাধুলা):** Memory Card Match, Picture-Word Match, and Word Spelling Builder with instant auditory feedback and star rewards.
- 🏆 **Quiz Center (কুইজ কেন্দ্র):** Multiple-choice quizzes in Bengali, English, Math, and General Knowledge with explanations, percentage calculation, and confetti celebrations.
- 🤖 **Smart AI Teacher (AI শিক্ষক):** Dedicated AI tutor with child-safe responses, practice questions generator, "Explain More Simply" and "Translate" options. Built-in Offline Educational Demo Mode works with no API key and no internet (the AI tab falls back to it automatically)!
- 📲 **PWA & Offline First:** Installable on Android home screens, service worker caching for offline learning, and live online/offline indicator.
- ⭐ **Local Progress Tracking:** Track earned stars, completed lessons, and unlock special achievement badges without requiring accounts. Includes parental reset controls.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router) & React
- **Language:** TypeScript
- **Styling:** Modern Tailwind CSS with child-friendly palette and playful animations
- **Audio:** Web Audio API synthesizer for instant zero-dependency sound effects + Web Speech API for voice pronunciation
- **Storage:** Browser localStorage (no account and no database needed)
- **PWA:** Web App Manifest, Service Worker (`/sw.js`), and offline fallback
- **Visuals:** PNG app icons (192 / 512 / maskable) and a robot-teacher hero illustration in `public/`

---

## 🚀 Environment Variables

All variables are optional. To enable the live AI teacher copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `GROQ_API_KEY`, `GROQ_MODEL` | (Optional) Groq free tier | `gsk_...` |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_MODEL` | (Optional) Cloudflare Workers AI | |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | (Optional) Gemini free tier (used last) | |
| `AI_API_KEY`, `AI_API_URL`, `AI_MODEL` | (Optional) any OpenAI-compatible provider | |

> **Note:** Providers are tried in order (custom → Groq → Cloudflare → Gemini) and the next one is used when a free quota ends. If no key is provided, the app automatically runs in **Educational Demo Mode** with smart pre-programmed child-friendly answers for space, animals, science, math, and everyday questions.

---

## 📲 How to Install as Android PWA

1. Open the website in **Google Chrome** on an Android phone.
2. Tap the in-app **"ইনস্টল"** button on the top navbar or banner.
3. If the native prompt doesn't open automatically:
   - Tap the **3-dot menu** (⋮) at the top right of Chrome.
   - Select **"Install app"** or **"Add to Home screen"**.
   - Tap **"Install"**.
4. The app icon will appear on your phone's home screen and work smoothly even when offline!

---

## 🌐 Deployment to Vercel

1. Create a GitHub repository and push your project files.
2. Log into [vercel.com](https://vercel.com) and click **"Add New" > "Project"**.
3. Import your GitHub repository.
4. Framework preset: **Next.js** (detected automatically).
5. Add your Environment Variables (`AI_API_KEY`, `AI_API_URL`, `AI_MODEL` if you want the live AI teacher).
6. Click **Deploy**.

---

## 👨‍💻 Developer & Official Channel

- **Developer:** Mohammad Rakib
- **Credit:** Made by Mohammad Rakib
- **Official Telegram Channel:** [https://t.me/appdevbyrakib](https://t.me/appdevbyrakib)
- **Telegram Label:** Join My Telegram Channel

---

## 🧪 Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # TypeScript check
npm run build && npm start   # production build (the service worker only registers in production)
```

---

## 🔒 Child safety & privacy

- **No accounts, no analytics, no tracking, no cookies.** Progress (stars, badges) lives only in the child's own browser (`localStorage`).
- **The server stores nothing.** `/api/ask` does not log, save or cache questions or answers. Only a short-lived request counter under a salted hash of the IP is kept in memory for 1 minute (abuse protection).
- **Questions are sent to an AI service only to create the answer** (Groq / Cloudflare / Gemini, whichever key you set). Gemini's free tier may use content to improve Google products, so it is the last choice; leave `GEMINI_API_KEY` empty to avoid it.
- **Safety layers:** (1) the question is checked on the server and on the device *before* it is sent: violence, sexual content, drugs, abuse, self-harm, prompt-injection and personal data (phone, e-mail, address, password) are blocked with a kind message and never reach the AI; (2) a strict child-only system prompt; (3) the AI answer is checked again and replaced if unsuitable; links are always removed.
- **No external fonts or scripts** are loaded, so no visitor IP address is sent to third parties by the page itself.
- A word-list filter is never perfect. Parents should stay nearby for young children.

- **Brain-Boost Games (মেধা-বিকাশ গেম):** Colour Memory (Simon), What is Missing?, Find the Odd One, Number Order, First Letter (phonics) and Read the Clock. Only the best score is saved, on the child's own device.

- **Learn to Write (অক্ষর লেখা শেখা):** trace Bengali vowels/consonants, A–Z, a–z and digits with a finger; the app checks the writing on-device and gives stars. Nothing is sent or saved.
