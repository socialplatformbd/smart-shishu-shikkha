export type Language = "bn" | "en";

export type NavTab = 
  | "home" 
  | "bengali" 
  | "english" 
  | "math" 
  | "gk" 
  | "islam" 
  | "games" 
  | "quiz" 
  | "ai" 
  | "progress" 
  | "about";

export interface BengaliLetter {
  letter: string;
  word: string;
  meaning: string;
  sentence: string;
  pronounce: string;
  emoji: string;
  category: "vowel" | "consonant";
}

export interface EnglishLetterItem {
  letter: string;
  word: string;
  phonics: string;
  meaningBn: string;
  sentence: string;
  emoji: string;
  category: "alphabet" | "fruits" | "animals" | "birds" | "colors" | "numbers" | "objects";
}

export interface MathTopic {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  level: "easy" | "medium" | "advanced";
}

export interface GKCard {
  id: string;
  category: string;
  categoryBn: string;
  titleBn: string;
  titleEn: string;
  icon: string;
  funFactBn: string;
  funFactEn: string;
  descriptionBn: string;
  descriptionEn: string;
  question: {
    qBn: string;
    qEn: string;
    optionsBn: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationBn: string;
    explanationEn: string;
  };
}

export interface QuizQuestion {
  id: string;
  category: "bengali" | "english" | "math" | "gk" | "islamic" | "mixed";
  difficulty: "easy" | "medium" | "hard";
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationBn: string;
  explanationEn: string;
  hintBn?: string;
  hintEn?: string;
}

export interface UserProgress {
  sessionId: string;
  nickname: string;
  stars: number;
  completedLessons: string[];
  quizzesTaken: number;
  highestQuizScore: number;
  badges: string[];
  lastActive: string;
}

export type AIAction = "normal" | "simplify" | "practice" | "translate";
export type AILangPref = "auto" | "bn" | "en";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isDemo?: boolean;
  /** The child's original question that produced this answer (used by "simplify" / "translate"). */
  sourceQuestion?: string;
  practiceQuestions?: string[];
}

export interface BadgeInfo {
  id: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  icon: string;
  unlocked: boolean;
}
