// ---------------------------------------------------------------------------
// AI providers (all speak the OpenAI chat-completions format). Order = privacy-friendliest first.
// Only providers whose keys are set are used. Nothing is stored by this app.
// ---------------------------------------------------------------------------
export interface Provider {
  name: string;
  url: string;
  key: string;
  model: string;
}

export function getProviders(): Provider[] {
  const list: Provider[] = [];
  const env = process.env;

  // Your own OpenAI-compatible provider (optional)
  if (env.AI_API_KEY && env.AI_API_URL) {
    list.push({ name: "custom", url: env.AI_API_URL, key: env.AI_API_KEY, model: env.AI_MODEL || "gpt-4o-mini" });
  }
  // Groq (free tier, very fast)
  if (env.GROQ_API_KEY) {
    list.push({
      name: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: env.GROQ_API_KEY,
      model: env.GROQ_MODEL || "llama-3.3-70b-versatile",
    });
  }
  // Cloudflare Workers AI (free daily allowance)
  if (env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_API_TOKEN) {
    list.push({
      name: "cloudflare",
      url: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/v1/chat/completions`,
      key: env.CLOUDFLARE_API_TOKEN,
      model: env.CLOUDFLARE_MODEL || "@cf/meta/llama-3.1-8b-instruct",
    });
  }
  // Gemini free tier: Google may use free-tier content to improve its products, so it is the LAST choice.
  if (env.GEMINI_API_KEY) {
    list.push({
      name: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      key: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL || "gemini-2.5-flash-lite",
    });
  }
  return list;
}
