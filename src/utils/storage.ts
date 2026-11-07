import { UserProgress, Language } from "@/types";

const PROGRESS_STORAGE_KEY = "smart_shishu_progress_v1";
const LANG_STORAGE_KEY = "smart_shishu_lang_v1";

function makeSessionId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return "user_" + crypto.randomUUID().slice(0, 8);
    }
  } catch {
    // fall through
  }
  return "user_" + Math.random().toString(36).substring(2, 10);
}

function createDefaultProgress(): UserProgress {
  return {
    sessionId: "",
    nickname: "ছোট্ট বন্ধু",
    stars: 5, // welcome bonus stars
    completedLessons: [],
    quizzesTaken: 0,
    highestQuizScore: 0,
    badges: ["welcome_star"],
    lastActive: new Date().toISOString(),
  };
}

/** Every badge the child has really earned, worked out from the saved numbers. */
function computeBadges(p: UserProgress): string[] {
  const earned = new Set<string>(p.badges);
  earned.add("welcome_star");
  if (p.completedLessons.some((id) => id.startsWith("bn_"))) earned.add("bengali_reader");
  if (p.completedLessons.some((id) => id.startsWith("en_"))) earned.add("english_star");
  if (p.completedLessons.some((id) => id.startsWith("math_"))) earned.add("math_wizard");
  if (p.completedLessons.some((id) => id.startsWith("islam_"))) earned.add("islam_learner");
  if (p.completedLessons.some((id) => id.startsWith("write_"))) earned.add("writer_star");
  if (p.quizzesTaken >= 1) earned.add("quiz_starter");
  if (p.highestQuizScore >= 100) earned.add("perfect_score");
  if (p.completedLessons.length >= 5) earned.add("star_learner");
  if (p.completedLessons.length >= 15) earned.add("knowledge_hero");
  return Array.from(earned);
}

/** Make sure data read from localStorage has the right shape (it may be old, edited or corrupt). */
function sanitize(raw: unknown): UserProgress {
  const base = createDefaultProgress();
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<UserProgress>;
  const strArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  const num = (v: unknown, fallback: number): number =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : fallback;

  const progress: UserProgress = {
    sessionId: typeof r.sessionId === "string" ? r.sessionId : base.sessionId,
    nickname: typeof r.nickname === "string" && r.nickname.trim() ? r.nickname : base.nickname,
    stars: num(r.stars, base.stars),
    completedLessons: strArray(r.completedLessons),
    quizzesTaken: num(r.quizzesTaken, 0),
    highestQuizScore: num(r.highestQuizScore, 0),
    badges: strArray(r.badges),
    lastActive: typeof r.lastActive === "string" ? r.lastActive : base.lastActive,
  };
  progress.badges = computeBadges(progress);
  return progress;
}

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "bn";
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === "en" ? "en" : "bn";
  } catch {
    return "bn";
  }
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (e) {
    console.warn("Could not save language to localStorage", e);
  }
}

export function getStoredProgress(): UserProgress {
  if (typeof window === "undefined") return sanitize(null);
  try {
    const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!data) {
      const initial = sanitize(null);
      initial.sessionId = makeSessionId();
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = sanitize(JSON.parse(data));
    if (!parsed.sessionId) parsed.sessionId = makeSessionId();
    return parsed;
  } catch {
    return sanitize(null);
  }
}

export function saveStoredProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    const toSave: UserProgress = {
      ...progress,
      badges: computeBadges(progress),
      lastActive: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn("Could not save progress to localStorage", e);
  }
}

export function addStars(count: number): number {
  const p = getStoredProgress();
  p.stars = Math.max(0, (p.stars || 0) + count);
  saveStoredProgress(p);
  return p.stars;
}

export function markLessonComplete(lessonId: string): { isNew: boolean; totalCompleted: number } {
  const p = getStoredProgress();
  if (p.completedLessons.includes(lessonId)) {
    return { isNew: false, totalCompleted: p.completedLessons.length };
  }
  p.completedLessons.push(lessonId);
  p.stars += 3; // 3 stars per new lesson completed
  saveStoredProgress(p); // badges are worked out inside save
  return { isNew: true, totalCompleted: p.completedLessons.length };
}

export function recordQuizAttempt(score: number, total: number): void {
  if (!Number.isFinite(total) || total <= 0) return;
  const p = getStoredProgress();
  p.quizzesTaken += 1;
  const percentage = Math.round((score / total) * 100);
  if (percentage > p.highestQuizScore) {
    p.highestQuizScore = percentage;
  }
  p.stars += score * 2; // 2 stars for each correct quiz answer
  saveStoredProgress(p);
}

export function resetStoredProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch (e) {
    console.warn("Could not reset progress", e);
  }
}
