import { NextResponse } from "next/server";
import { getProviders } from "@/utils/aiProviders";

export const dynamic = "force-dynamic";

/*
 * Diagnostic page: open  /api/status  in a browser to see WHY the AI teacher is (not) answering.
 * It sends a tiny fixed test message ("Say OK"). It never shows keys, questions or answers.
 */

const NO_STORE = { "Cache-Control": "no-store" };
let cache: { time: number; body: unknown } | null = null;

function scrub(text: string): string {
  return text.replace(/gsk_[A-Za-z0-9]+/g, "***").replace(/[A-Za-z0-9_-]{28,}/g, "***").slice(0, 160);
}

function hintFor(status: number): string {
  if (status >= 200 && status < 300) return "OK - this provider works.";
  if (status === 401 || status === 403) return "The API key is wrong, revoked or not allowed. Create a NEW key, update the variable in Vercel, then Redeploy.";
  if (status === 404 || status === 400) return "The model name is probably wrong or retired. Set GROQ_MODEL (or the matching *_MODEL) to a name from groqModels below, then Redeploy.";
  if (status === 429) return "Free quota or rate limit reached. Wait a while, or add another provider.";
  if (status === 0) return "Could not reach the provider (network error or timeout).";
  return "Provider returned an unexpected error.";
}

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.time < 30_000) {
    return NextResponse.json(cache.body, { headers: NO_STORE });
  }

  const providers = getProviders();
  const results: Record<string, unknown>[] = [];

  for (const p of providers) {
    const started = Date.now();
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${p.key}` },
        body: JSON.stringify({ model: p.model, messages: [{ role: "user", content: "Say OK" }], max_tokens: 200, ...(p.extra ?? {}) }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
      let detail = "";
      let hasContent: boolean | undefined;
      if (res.ok) {
        try {
          const j = await res.json();
          hasContent = Boolean(String(j?.choices?.[0]?.message?.content ?? "").trim());
        } catch {
          hasContent = false;
        }
      } else {
        try {
          const j = await res.json();
          detail = scrub(String(j?.error?.message || j?.error?.type || ""));
        } catch {
          detail = "";
        }
      }
      results.push({ provider: p.name, model: p.model, status: res.status, ok: res.ok, hasContent, ms: Date.now() - started, detail, hint: hintFor(res.status) });
    } catch {
      results.push({ provider: p.name, model: p.model, status: 0, ok: false, ms: Date.now() - started, hint: hintFor(0) });
    }
  }

  // Groq: list the model names that currently exist, so a retired model can be replaced.
  let groqModels: string[] | undefined;
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${groqKey}` },
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
      if (res.ok) {
        const j = await res.json();
        groqModels = (j?.data ?? []).map((m: { id: string }) => m.id).slice(0, 30);
      }
    } catch {
      groqModels = undefined;
    }
  }

  const body = {
    configuredProviders: providers.map((p) => p.name),
    note:
      providers.length === 0
        ? "No provider key was found. Check the variable name (GROQ_API_KEY, exactly), that it is set for Production, and that you Redeployed after adding it."
        : "Test used a fixed message. No keys or questions are shown here.",
    results,
    groqModels,
  };
  cache = { time: now, body };
  return NextResponse.json(body, { headers: NO_STORE });
}
