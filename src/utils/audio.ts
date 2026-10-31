// Child-friendly synthesised sound effects using Web Audio API (offline & instant)

class SoundFX {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // Gentle pop / tap sound
  playTap() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // safe fallback
    }
  }

  // Happy success chime (rising chord)
  playSuccess() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const start = this.ctx.currentTime + idx * 0.09;
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {
      // safe fallback
    }
  }

  // Gentle oops chime
  playWrong() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // safe fallback
    }
  }

  // Star celebration fanfare
  playCelebration() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const melody = [523.25, 523.25, 659.25, 783.99, 880, 1046.5];
      melody.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = this.ctx.currentTime + idx * 0.12;
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // safe fallback
    }
  }
}

export const sounds = new SoundFX();

// ---------------------------------------------------------------------------
// Browser SpeechSynthesis text-to-speech
// ---------------------------------------------------------------------------
let cachedVoices: SpeechSynthesisVoice[] = [];

function refreshVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return cachedVoices;
  const list = window.speechSynthesis.getVoices();
  if (list.length > 0) cachedVoices = list;
  return cachedVoices;
}

// Voices load asynchronously on Chrome/Android, so listen for them once.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  try {
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
    refreshVoices();
  } catch {
    // ignore - speech is optional
  }
}

/** Remove markdown marks and emoji so the voice does not read "star star" or symbol names. */
export function cleanForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/[#*_`>~]/g, "")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function speakText(text: string, lang: "bn" | "en" = "bn") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  const spoken = cleanForSpeech(text);
  if (!spoken) return;
  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Cheerful friendly pitch

    const voices = refreshVoices();
    if (lang === "bn") {
      utterance.lang = "bn-BD";
      const bnVoice = voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith("bn"));
      if (bnVoice) utterance.voice = bnVoice;
    } else {
      utterance.lang = "en-US";
      const enVoice = voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith("en"));
      if (enVoice) utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis error:", err);
  }
}
