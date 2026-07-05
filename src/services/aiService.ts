const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/** Whether a Gemini API key is configured — lets the UI hide the feature if not. */
export const isAiEnabled = Boolean(API_KEY);

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface AiStats {
  level: number;
  totalXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  isMaxLevel: boolean;
  bestActiveStreak: number;
  habitsCount: number;
}

const SYSTEM_PROMPT = `You are the in-app coach for Dailynx, a habit and to-do tracking app. Be warm, brief, and genuine — never generic corporate motivational filler.

How the app works, for when the user asks "how do I..." questions:
- Dashboard: today's schedule of habits with a progress ring, a to-do list, and an XP/level bar.
- Habits page: add a habit with a title and a scheduled time (the "Manage" link from the Dashboard, or the Habits tab). Edit or delete habits there; deleting asks for confirmation first.
- Checking a habit off on the Dashboard marks it done for today and grants XP once, permanently. Unchecking asks for confirmation because it can break a streak, but never removes XP already earned.
- Streaks count consecutive days completed, counting back from today; they reset automatically at local midnight if a day is missed.
- Analytics page: 7-day and 30-day completion charts, a streak leaderboard, current level, and total XP.
- Calendar page: a heatmap of daily completion history.
- Settings: edit profile, install the app as a PWA, sign out, credits.
- XP & Levels: completing a habit grants 10 XP, completing a task grants 5 XP, always automatically and permanently — XP can never go down, even if a habit is edited, unchecked, or deleted. Level 2 needs 100 total XP; each level after needs 50 more, up to a max of Level 100.

Only describe features listed above — do not invent ones that don't exist. When asked for motivation, or when there's no specific question, give a short, upbeat, specific nudge using the stats provided. Keep replies under ~80 words unless the user clearly wants more detail.`;

function statsToPrompt(stats: AiStats): string {
  const levelLine = stats.isMaxLevel
    ? `Level ${stats.level} (max level), ${stats.totalXp} XP total`
    : `Level ${stats.level}, ${stats.totalXp} XP total (${stats.xpIntoLevel}/${stats.xpForNextLevel} XP into next level)`;

  return `Current stats — ${levelLine}, best active streak ${stats.bestActiveStreak} day(s), ${stats.habitsCount} habit(s) tracked.`;
}

/** Sends the running chat history to Gemini and returns the coach's reply. */
export async function askAiCoach(
  history: ChatMessage[],
  stats: AiStats
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      "AI coach isn't configured yet — add VITE_GEMINI_API_KEY to enable it."
    );
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: `${SYSTEM_PROMPT}\n\n${statsToPrompt(stats)}` }],
      },
      contents: history.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.8,
        // gemini-2.5-flash "thinks" by default, which silently eats the
        // output budget and can return empty/truncated replies. The coach
        // needs plain short answers, not reasoning, so turn thinking off.
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed (${response.status})`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as
    | string
    | undefined;

  if (!text) throw new Error("AI returned an empty response.");

  return text.trim();
}
